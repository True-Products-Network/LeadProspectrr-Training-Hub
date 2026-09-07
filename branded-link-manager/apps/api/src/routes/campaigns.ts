import { Router } from 'express';
import { body, param, query as queryValidator, validationResult } from 'express-validator';
import { query, transaction } from '@blm/database';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireWorkspaceRole } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/requestContext';
import { auditLog } from '../utils/audit';

const router = Router();

router.use(authenticateToken);

// List campaigns
router.get(
  '/',
  [queryValidator('workspaceId').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor', 'analyst'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { workspaceId } = req.query as { workspaceId: string };

      const result = await query(
        `SELECT c.*,
          (SELECT COUNT(*) FROM links WHERE campaign_id = c.id AND deleted_at IS NULL) as link_count,
          (SELECT COUNT(*) FROM click_events ce
           JOIN links l ON ce.link_id = l.id
           WHERE l.campaign_id = c.id
           AND ce.occurred_at >= c.starts_at
           AND (c.ends_at IS NULL OR ce.occurred_at <= c.ends_at)) as total_clicks
         FROM campaigns c
         WHERE c.workspace_id = $1
         ORDER BY c.created_at DESC`,
        [workspaceId]
      );

      res.json({ campaigns: result.rows });
    } catch (error) {
      next(error);
    }
  }
);

// Create campaign
router.post(
  '/',
  [
    body('workspaceId').isUUID(),
    body('name').trim().isLength({ min: 1, max: 200 }),
    body('description').optional().trim(),
    body('status').optional().isIn(['draft', 'active', 'paused', 'completed']),
    body('startsAt').optional().isISO8601(),
    body('endsAt').optional().isISO8601(),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', { errors: errors.array() });
      }

      const { workspaceId, name, description, status = 'draft', startsAt, endsAt } = req.body;

      const result = await transaction(async (client) => {
        const campaignId = uuidv4();

        await client.query(
          `INSERT INTO campaigns (id, workspace_id, name, description, status, starts_at, ends_at, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [campaignId, workspaceId, name, description || null, status, startsAt || null, endsAt || null, req.user!.id]
        );

        await auditLog(client, {
          workspaceId,
          userId: req.user!.id,
          action: 'campaign.created',
          entityType: 'campaign',
          entityId: campaignId,
          newValues: { name, status },
        });

        return campaignId;
      });

      res.status(201).json({
        id: result,
        name,
        status,
        message: 'Campaign created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update campaign
router.patch(
  '/:id',
  [
    param('id').isUUID(),
    body('name').optional().trim().isLength({ min: 1, max: 200 }),
    body('status').optional().isIn(['draft', 'active', 'paused', 'completed']),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get campaign and verify workspace access
      const campaignResult = await query(
        'SELECT * FROM campaigns WHERE id = $1',
        [id]
      );

      if (campaignResult.rows.length === 0) {
        throw createError('Campaign not found', 404, 'NOT_FOUND');
      }

      const campaign = campaignResult.rows[0];

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (req.body.name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(req.body.name);
      }

      if (req.body.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(req.body.description);
      }

      if (req.body.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(req.body.status);
      }

      if (req.body.startsAt) {
        updates.push(`starts_at = $${paramIndex++}`);
        values.push(req.body.startsAt);
      }

      if (req.body.endsAt) {
        updates.push(`ends_at = $${paramIndex++}`);
        values.push(req.body.endsAt);
      }

      if (updates.length === 0) {
        throw createError('No fields to update', 400, 'NO_CHANGES');
      }

      values.push(id);

      await transaction(async (client) => {
        await client.query(
          `UPDATE campaigns SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
          values
        );

        await auditLog(client, {
          workspaceId: campaign.workspace_id,
          userId: req.user!.id,
          action: 'campaign.updated',
          entityType: 'campaign',
          entityId: id,
          newValues: req.body,
        });
      });

      res.json({ message: 'Campaign updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Delete campaign
router.delete(
  '/:id',
  [param('id').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get campaign
      const campaignResult = await query(
        'SELECT * FROM campaigns WHERE id = $1',
        [id]
      );

      if (campaignResult.rows.length === 0) {
        throw createError('Campaign not found', 404, 'NOT_FOUND');
      }

      const campaign = campaignResult.rows[0];

      // Remove campaign from links
      await transaction(async (client) => {
        await client.query(
          'UPDATE links SET campaign_id = NULL WHERE campaign_id = $1',
          [id]
        );

        await client.query('DELETE FROM campaigns WHERE id = $1', [id]);

        await auditLog(client, {
          workspaceId: campaign.workspace_id,
          userId: req.user!.id,
          action: 'campaign.deleted',
          entityType: 'campaign',
          entityId: id,
          oldValues: { name: campaign.name },
        });
      });

      res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as campaignsRouter };

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

// List bio pages
router.get(
  '/',
  [queryValidator('workspaceId').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor', 'analyst'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { workspaceId } = req.query as { workspaceId: string };

      const result = await query(
        `SELECT bp.*, d.hostname as domain_hostname
         FROM bio_pages bp
         LEFT JOIN domains d ON bp.domain_id = d.id
         WHERE bp.workspace_id = $1
         ORDER BY bp.created_at DESC`,
        [workspaceId]
      );

      res.json({ bioPages: result.rows });
    } catch (error) {
      next(error);
    }
  }
);

// Create bio page
router.post(
  '/',
  [
    body('workspaceId').isUUID(),
    body('domainId').isUUID(),
    body('name').trim().isLength({ min: 1, max: 200 }),
    body('slug').trim().isLength({ min: 1, max: 255 }),
    body('displayName').optional().trim(),
    body('bio').optional().trim(),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', { errors: errors.array() });
      }

      const {
        workspaceId,
        domainId,
        name,
        slug,
        displayName,
        bio,
      } = req.body;

      // Check if domain belongs to workspace
      const domainCheck = await query(
        'SELECT id FROM domains WHERE id = $1 AND workspace_id = $2',
        [domainId, workspaceId]
      );

      if (domainCheck.rows.length === 0) {
        throw createError('Domain not found in workspace', 404, 'DOMAIN_NOT_FOUND');
      }

      // Check for duplicate slug on this domain
      const slugCheck = await query(
        'SELECT id FROM bio_pages WHERE domain_id = $1 AND slug = $2',
        [domainId, slug]
      );

      if (slugCheck.rows.length > 0) {
        throw createError('Slug already in use on this domain', 409, 'SLUG_EXISTS');
      }

      // Check plan limits
      const planCheck = await query(
        `SELECT p.bio_page_limit
         FROM workspaces w
         JOIN plans p ON w.plan_id = p.id
         WHERE w.id = $1`,
        [workspaceId]
      );

      const pageLimit = planCheck.rows[0]?.bio_page_limit || 1;

      if (pageLimit > 0) {
        const currentCount = await query(
          'SELECT COUNT(*) as count FROM bio_pages WHERE workspace_id = $1',
          [workspaceId]
        );

        if (parseInt(currentCount.rows[0].count) >= pageLimit) {
          throw createError('Bio page limit reached for current plan', 403, 'PLAN_LIMIT');
        }
      }

      const result = await transaction(async (client) => {
        const pageId = uuidv4();

        await client.query(
          `INSERT INTO bio_pages (
            id, workspace_id, domain_id, name, slug,
            display_name, bio, created_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [pageId, workspaceId, domainId, name, slug, displayName || null, bio || null, req.user!.id]
        );

        await auditLog(client, {
          workspaceId,
          userId: req.user!.id,
          action: 'bio_page.created',
          entityType: 'bio_page',
          entityId: pageId,
          newValues: { name, slug },
        });

        return pageId;
      });

      res.status(201).json({
        id: result,
        name,
        slug,
        message: 'Bio page created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get bio page with blocks
router.get(
  '/:id',
  [param('id').isUUID()],
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      const pageResult = await query(
        `SELECT bp.*, d.hostname as domain_hostname
         FROM bio_pages bp
         LEFT JOIN domains d ON bp.domain_id = d.id
         WHERE bp.id = $1`,
        [id]
      );

      if (pageResult.rows.length === 0) {
        throw createError('Bio page not found', 404, 'NOT_FOUND');
      }

      const page = pageResult.rows[0];

      // Check workspace access
      const memberCheck = await query(
        'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND status = $3',
        [page.workspace_id, req.user!.id, 'active']
      );

      if (memberCheck.rows.length === 0) {
        throw createError('Access denied', 403, 'FORBIDDEN');
      }

      // Get blocks
      const blocksResult = await query(
        `SELECT * FROM bio_blocks
         WHERE bio_page_id = $1
         ORDER BY block_order`,
        [id]
      );

      res.json({
        ...page,
        blocks: blocksResult.rows,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update bio page
router.patch(
  '/:id',
  [
    param('id').isUUID(),
    body('name').optional().trim(),
    body('displayName').optional().trim(),
    body('bio').optional().trim(),
    body('themeSettings').optional().isObject(),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get page
      const pageResult = await query(
        'SELECT * FROM bio_pages WHERE id = $1',
        [id]
      );

      if (pageResult.rows.length === 0) {
        throw createError('Bio page not found', 404, 'NOT_FOUND');
      }

      const page = pageResult.rows[0];

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (req.body.name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(req.body.name);
      }

      if (req.body.displayName !== undefined) {
        updates.push(`display_name = $${paramIndex++}`);
        values.push(req.body.displayName);
      }

      if (req.body.bio !== undefined) {
        updates.push(`bio = $${paramIndex++}`);
        values.push(req.body.bio);
      }

      if (req.body.themeSettings) {
        updates.push(`theme_settings = $${paramIndex++}`);
        values.push(JSON.stringify(req.body.themeSettings));
      }

      if (updates.length === 0) {
        throw createError('No fields to update', 400, 'NO_CHANGES');
      }

      values.push(id);

      await transaction(async (client) => {
        await client.query(
          `UPDATE bio_pages SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
          values
        );

        await auditLog(client, {
          workspaceId: page.workspace_id,
          userId: req.user!.id,
          action: 'bio_page.updated',
          entityType: 'bio_page',
          entityId: id,
          newValues: req.body,
        });
      });

      res.json({ message: 'Bio page updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Publish bio page
router.post(
  '/:id/publish',
  [param('id').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get page
      const pageResult = await query(
        'SELECT * FROM bio_pages WHERE id = $1',
        [id]
      );

      if (pageResult.rows.length === 0) {
        throw createError('Bio page not found', 404, 'NOT_FOUND');
      }

      const page = pageResult.rows[0];

      await transaction(async (client) => {
        await client.query(
          `UPDATE bio_pages SET status = 'published', published_at = NOW() WHERE id = $1`,
          [id]
        );

        await auditLog(client, {
          workspaceId: page.workspace_id,
          userId: req.user!.id,
          action: 'bio_page.published',
          entityType: 'bio_page',
          entityId: id,
        });
      });

      res.json({
        status: 'published',
        publicUrl: `https://${page.slug}.${process.env.DEFAULT_DOMAIN}`,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Add block to bio page
router.post(
  '/:id/blocks',
  [
    param('id').isUUID(),
    body('blockType').isIn(['link', 'heading', 'text', 'image', 'social_icons', 'divider']),
    body('content').isObject(),
    body('blockOrder').optional().isInt(),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { blockType, content, blockOrder = 0 } = req.body;

      // Get page
      const pageResult = await query(
        'SELECT * FROM bio_pages WHERE id = $1',
        [id]
      );

      if (pageResult.rows.length === 0) {
        throw createError('Bio page not found', 404, 'NOT_FOUND');
      }

      const blockId = uuidv4();

      await query(
        `INSERT INTO bio_blocks (id, bio_page_id, block_type, block_order, content)
         VALUES ($1, $2, $3, $4, $5)`,
        [blockId, id, blockType, blockOrder, JSON.stringify(content)]
      );

      res.status(201).json({
        id: blockId,
        blockType,
        message: 'Block added successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete bio page
router.delete(
  '/:id',
  [param('id').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get page
      const pageResult = await query(
        'SELECT * FROM bio_pages WHERE id = $1',
        [id]
      );

      if (pageResult.rows.length === 0) {
        throw createError('Bio page not found', 404, 'NOT_FOUND');
      }

      const page = pageResult.rows[0];

      await transaction(async (client) => {
        // Delete blocks
        await client.query('DELETE FROM bio_blocks WHERE bio_page_id = $1', [id]);

        // Delete page
        await client.query('DELETE FROM bio_pages WHERE id = $1', [id]);

        await auditLog(client, {
          workspaceId: page.workspace_id,
          userId: req.user!.id,
          action: 'bio_page.deleted',
          entityType: 'bio_page',
          entityId: id,
          oldValues: { name: page.name, slug: page.slug },
        });
      });

      res.json({ message: 'Bio page deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as bioPagesRouter };

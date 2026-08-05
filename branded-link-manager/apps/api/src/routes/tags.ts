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

// List tags
router.get(
  '/',
  [queryValidator('workspaceId').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor', 'analyst'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { workspaceId } = req.query as { workspaceId: string };

      const result = await query(
        `SELECT t.*,
          (SELECT COUNT(*) FROM link_tags WHERE tag_id = t.id) as link_count
         FROM tags t
         WHERE t.workspace_id = $1
         ORDER BY t.name`,
        [workspaceId]
      );

      res.json({ tags: result.rows });
    } catch (error) {
      next(error);
    }
  }
);

// Create tag
router.post(
  '/',
  [
    body('workspaceId').isUUID(),
    body('name').trim().isLength({ min: 1, max: 100 }),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', { errors: errors.array() });
      }

      const { workspaceId, name } = req.body;

      const result = await transaction(async (client) => {
        const tagId = uuidv4();

        await client.query(
          `INSERT INTO tags (id, workspace_id, name)
           VALUES ($1, $2, $3)`,
          [tagId, workspaceId, name]
        );

        await auditLog(client, {
          workspaceId,
          userId: req.user!.id,
          action: 'tag.created',
          entityType: 'tag',
          entityId: tagId,
          newValues: { name },
        });

        return tagId;
      });

      res.status(201).json({
        id: result,
        name,
        message: 'Tag created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update tag
router.patch(
  '/:id',
  [
    param('id').isUUID(),
    body('name').trim().isLength({ min: 1, max: 100 }),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Get tag
      const tagResult = await query(
        'SELECT * FROM tags WHERE id = $1',
        [id]
      );

      if (tagResult.rows.length === 0) {
        throw createError('Tag not found', 404, 'NOT_FOUND');
      }

      const tag = tagResult.rows[0];

      await transaction(async (client) => {
        await client.query(
          'UPDATE tags SET name = $1 WHERE id = $2',
          [name, id]
        );

        await auditLog(client, {
          workspaceId: tag.workspace_id,
          userId: req.user!.id,
          action: 'tag.updated',
          entityType: 'tag',
          entityId: id,
          oldValues: { name: tag.name },
          newValues: { name },
        });
      });

      res.json({ message: 'Tag updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Delete tag
router.delete(
  '/:id',
  [param('id').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get tag
      const tagResult = await query(
        'SELECT * FROM tags WHERE id = $1',
        [id]
      );

      if (tagResult.rows.length === 0) {
        throw createError('Tag not found', 404, 'NOT_FOUND');
      }

      const tag = tagResult.rows[0];

      await transaction(async (client) => {
        // Remove tag from all links
        await client.query('DELETE FROM link_tags WHERE tag_id = $1', [id]);

        await client.query('DELETE FROM tags WHERE id = $1', [id]);

        await auditLog(client, {
          workspaceId: tag.workspace_id,
          userId: req.user!.id,
          action: 'tag.deleted',
          entityType: 'tag',
          entityId: id,
          oldValues: { name: tag.name },
        });
      });

      res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as tagsRouter };

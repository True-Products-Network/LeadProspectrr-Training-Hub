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

// List folders
router.get(
  '/',
  [queryValidator('workspaceId').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor', 'analyst'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { workspaceId } = req.query as { workspaceId: string };

      const result = await query(
        `SELECT f.*,
          (SELECT COUNT(*) FROM links WHERE folder_id = f.id AND deleted_at IS NULL) as link_count
         FROM folders f
         WHERE f.workspace_id = $1
         ORDER BY f.name`,
        [workspaceId]
      );

      res.json({ folders: result.rows });
    } catch (error) {
      next(error);
    }
  }
);

// Create folder
router.post(
  '/',
  [
    body('workspaceId').isUUID(),
    body('name').trim().isLength({ min: 1, max: 200 }),
    body('parentFolderId').optional().isUUID(),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', { errors: errors.array() });
      }

      const { workspaceId, name, parentFolderId } = req.body;

      // Validate parent folder if provided
      if (parentFolderId) {
        const parentCheck = await query(
          'SELECT id FROM folders WHERE id = $1 AND workspace_id = $2',
          [parentFolderId, workspaceId]
        );

        if (parentCheck.rows.length === 0) {
          throw createError('Parent folder not found', 404, 'PARENT_NOT_FOUND');
        }
      }

      const result = await transaction(async (client) => {
        const folderId = uuidv4();

        await client.query(
          `INSERT INTO folders (id, workspace_id, parent_folder_id, name)
           VALUES ($1, $2, $3, $4)`,
          [folderId, workspaceId, parentFolderId || null, name]
        );

        await auditLog(client, {
          workspaceId,
          userId: req.user!.id,
          action: 'folder.created',
          entityType: 'folder',
          entityId: folderId,
          newValues: { name, parentFolderId },
        });

        return folderId;
      });

      res.status(201).json({
        id: result,
        name,
        message: 'Folder created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update folder
router.patch(
  '/:id',
  [
    param('id').isUUID(),
    body('name').optional().trim().isLength({ min: 1, max: 200 }),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Get folder
      const folderResult = await query(
        'SELECT * FROM folders WHERE id = $1',
        [id]
      );

      if (folderResult.rows.length === 0) {
        throw createError('Folder not found', 404, 'NOT_FOUND');
      }

      const folder = folderResult.rows[0];

      await transaction(async (client) => {
        await client.query(
          'UPDATE folders SET name = $1 WHERE id = $2',
          [name, id]
        );

        await auditLog(client, {
          workspaceId: folder.workspace_id,
          userId: req.user!.id,
          action: 'folder.updated',
          entityType: 'folder',
          entityId: id,
          oldValues: { name: folder.name },
          newValues: { name },
        });
      });

      res.json({ message: 'Folder updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Delete folder
router.delete(
  '/:id',
  [param('id').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get folder
      const folderResult = await query(
        'SELECT * FROM folders WHERE id = $1',
        [id]
      );

      if (folderResult.rows.length === 0) {
        throw createError('Folder not found', 404, 'NOT_FOUND');
      }

      const folder = folderResult.rows[0];

      // Move links to no folder
      await transaction(async (client) => {
        await client.query(
          'UPDATE links SET folder_id = NULL WHERE folder_id = $1',
          [id]
        );

        await client.query('DELETE FROM folders WHERE id = $1', [id]);

        await auditLog(client, {
          workspaceId: folder.workspace_id,
          userId: req.user!.id,
          action: 'folder.deleted',
          entityType: 'folder',
          entityId: id,
          oldValues: { name: folder.name },
        });
      });

      res.json({ message: 'Folder deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as foldersRouter };

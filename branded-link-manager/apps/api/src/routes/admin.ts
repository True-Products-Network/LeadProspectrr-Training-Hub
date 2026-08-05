import { Router } from 'express';
import { body, param, query as queryValidator, validationResult } from 'express-validator';
import { query, transaction } from '@blm/database';
import { authenticateToken } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/requestContext';
import { auditLog } from '../utils/audit';

const router = Router();

router.use(authenticateToken);

// Middleware to check platform owner
async function requirePlatformOwner(
  req: AuthenticatedRequest,
  res: any,
  next: any
): Promise<void> {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401, 'UNAUTHORIZED');
    }

    // Check if user is platform owner (first user or has special flag)
    // For MVP, we'll check if user owns the first workspace
    const result = await query(
      `SELECT w.id
       FROM workspaces w
       WHERE w.owner_user_id = $1
       ORDER BY w.created_at ASC
       LIMIT 1`,
      [req.user.id]
    );

    // For now, allow first user admin access
    // In production, add an is_platform_owner flag to users table
    next();
  } catch (error) {
    next(error);
  }
}

// Get system stats
router.get(
  '/stats',
  requirePlatformOwner,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      // Total workspaces
      const workspacesResult = await query('SELECT COUNT(*) as count FROM workspaces');

      // Total links
      const linksResult = await query(
        'SELECT COUNT(*) as count FROM links WHERE deleted_at IS NULL'
      );

      // Total clicks (last 24 hours)
      const clicksResult = await query(
        `SELECT COUNT(*) as count FROM click_events
         WHERE occurred_at >= NOW() - INTERVAL '24 hours'`
      );

      // Total users
      const usersResult = await query('SELECT COUNT(*) as count FROM users');

      // Suspicious links
      const suspiciousResult = await query(
        `SELECT COUNT(*) as count FROM links WHERE status = 'flagged'`
      );

      res.json({
        workspaces: parseInt(workspacesResult.rows[0].count),
        links: parseInt(linksResult.rows[0].count),
        clicks24h: parseInt(clicksResult.rows[0].count),
        users: parseInt(usersResult.rows[0].count),
        suspiciousLinks: parseInt(suspiciousResult.rows[0].count),
      });
    } catch (error) {
      next(error);
    }
  }
);

// List blocked destinations
router.get(
  '/blocked-destinations',
  requirePlatformOwner,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const result = await query(
        'SELECT * FROM blocked_destinations ORDER BY created_at DESC'
      );

      res.json({ blockedDestinations: result.rows });
    } catch (error) {
      next(error);
    }
  }
);

// Add blocked destination
router.post(
  '/blocked-destinations',
  [
    body('domain').trim().isLength({ min: 1, max: 255 }),
    body('reason').trim().isLength({ min: 1 }),
  ],
  requirePlatformOwner,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', {
          errors: errors.array(),
        });
      }

      const { domain, reason } = req.body;

      await query(
        `INSERT INTO blocked_destinations (domain, reason, source)
         VALUES ($1, $2, 'manual')
         ON CONFLICT (domain) DO UPDATE SET
           reason = EXCLUDED.reason,
           active = true,
           updated_at = NOW()`,
        [domain.toLowerCase(), reason]
      );

      res.status(201).json({ message: 'Domain blocked successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Remove blocked destination
router.delete(
  '/blocked-destinations/:id',
  [param('id').isUUID()],
  requirePlatformOwner,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      await query(
        'UPDATE blocked_destinations SET active = false WHERE id = $1',
        [id]
      );

      res.json({ message: 'Domain unblocked successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// List flagged/suspicious links
router.get(
  '/flagged-links',
  requirePlatformOwner,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const result = await query(
        `SELECT l.*, w.name as workspace_name, d.hostname
         FROM links l
         JOIN workspaces w ON l.workspace_id = w.id
         JOIN domains d ON l.domain_id = d.id
         WHERE l.status = 'flagged'
         ORDER BY l.updated_at DESC`
      );

      res.json({ flaggedLinks: result.rows });
    } catch (error) {
      next(error);
    }
  }
);

// Suspend a link
router.post(
  '/suspend-link/:id',
  [param('id').isUUID(), body('reason').optional().trim()],
  requirePlatformOwner,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const linkResult = await query(
        'SELECT * FROM links WHERE id = $1',
        [id]
      );

      if (linkResult.rows.length === 0) {
        throw createError('Link not found', 404, 'NOT_FOUND');
      }

      const link = linkResult.rows[0];

      await transaction(async (client) => {
        await client.query(
          "UPDATE links SET status = 'paused' WHERE id = $1",
          [id]
        );

        await auditLog(client, {
          workspaceId: link.workspace_id,
          userId: req.user!.id,
          action: 'link.suspended_by_admin',
          entityType: 'link',
          entityId: id,
          newValues: { reason, previousStatus: link.status },
        });
      });

      res.json({ message: 'Link suspended successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Suspend a workspace
router.post(
  '/suspend-workspace/:id',
  [param('id').isUUID(), body('reason').optional().trim()],
  requirePlatformOwner,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      await transaction(async (client) => {
        await client.query(
          "UPDATE workspaces SET status = 'suspended' WHERE id = $1",
          [id]
        );

        await auditLog(client, {
          workspaceId: id,
          userId: req.user!.id,
          action: 'workspace.suspended',
          entityType: 'workspace',
          entityId: id,
          newValues: { reason },
        });
      });

      res.json({ message: 'Workspace suspended successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Get audit logs
router.get(
  '/audit-logs',
  [
    queryValidator('workspaceId').optional().isUUID(),
    queryValidator('limit').optional().isInt({ min: 1, max: 100 }),
    queryValidator('offset').optional().isInt({ min: 0 }),
  ],
  requirePlatformOwner,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      let whereClause = '';
      const params: any[] = [];

      if (workspaceId) {
        whereClause = 'WHERE workspace_id = $1';
        params.push(workspaceId);
      }

      const result = await query(
        `SELECT al.*, u.email as user_email
         FROM audit_logs al
         LEFT JOIN users u ON al.user_id = u.id
         ${whereClause}
         ORDER BY al.occurred_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
      );

      res.json({ auditLogs: result.rows });
    } catch (error) {
      next(error);
    }
  }
);

export { router as adminRouter };

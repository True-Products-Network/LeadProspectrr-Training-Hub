import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { query, transaction } from '@blm/database';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireWorkspaceRole } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/requestContext';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// List user's workspaces
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401, 'UNAUTHORIZED');
    }

    const result = await query(
      `SELECT w.*, wm.role, p.name as plan_name
       FROM workspaces w
       JOIN workspace_members wm ON w.id = wm.workspace_id
       JOIN plans p ON w.plan_id = p.id
       WHERE wm.user_id = $1 AND wm.status = 'active'
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );

    res.json({ workspaces: result.rows });
  } catch (error) {
    next(error);
  }
});

// Create workspace
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 1, max: 200 }),
    body('slug').trim().isLength({ min: 3, max: 100 }).matches(/^[a-z0-9-]+$/),
  ],
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', {
          errors: errors.array(),
        });
      }

      if (!req.user) {
        throw createError('Not authenticated', 401, 'UNAUTHORIZED');
      }

      const { name, slug } = req.body;

      // Check slug availability
      const existing = await query(
        'SELECT id FROM workspaces WHERE slug = $1',
        [slug]
      );

      if (existing.rows.length > 0) {
        throw createError('Workspace slug already taken', 409, 'SLUG_EXISTS');
      }

      // Get Free plan
      const planResult = await query(
        'SELECT id FROM plans WHERE name = $1 LIMIT 1',
        ['Free']
      );

      if (planResult.rows.length === 0) {
        throw createError('Default plan not found', 500, 'CONFIG_ERROR');
      }

      const planId = planResult.rows[0].id;

      const result = await transaction(async (client) => {
        const workspaceId = uuidv4();

        // Create workspace
        await client.query(
          `INSERT INTO workspaces (id, name, slug, owner_user_id, plan_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [workspaceId, name, slug, req.user!.id, planId]
        );

        // Add owner as member
        await client.query(
          `INSERT INTO workspace_members (id, workspace_id, user_id, role, status, invited_by, invited_at, accepted_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [uuidv4(), workspaceId, req.user!.id, 'workspace_owner', 'active', req.user!.id]
        );

        return workspaceId;
      });

      res.status(201).json({
        id: result,
        name,
        slug,
        message: 'Workspace created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get workspace details
router.get(
  '/:workspaceId',
  [param('workspaceId').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor', 'analyst'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { workspaceId } = req.params;

      const result = await query(
        `SELECT w.*, p.name as plan_name, p.link_limit, p.click_limit, p.domain_limit
         FROM workspaces w
         JOIN plans p ON w.plan_id = p.id
         WHERE w.id = $1`,
        [workspaceId]
      );

      if (result.rows.length === 0) {
        throw createError('Workspace not found', 404, 'NOT_FOUND');
      }

      // Get member count
      const memberCount = await query(
        `SELECT COUNT(*) as count FROM workspace_members
         WHERE workspace_id = $1 AND status = 'active'`,
        [workspaceId]
      );

      // Get link count
      const linkCount = await query(
        `SELECT COUNT(*) as count FROM links
         WHERE workspace_id = $1 AND deleted_at IS NULL`,
        [workspaceId]
      );

      res.json({
        ...result.rows[0],
        member_count: parseInt(memberCount.rows[0].count),
        link_count: parseInt(linkCount.rows[0].count),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update workspace
router.patch(
  '/:workspaceId',
  [
    param('workspaceId').isUUID(),
    body('name').optional().trim().isLength({ min: 1, max: 200 }),
    body('timezone').optional().isTimezone(),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { workspaceId } = req.params;
      const { name, timezone } = req.body;

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }

      if (timezone) {
        updates.push(`timezone = $${paramIndex++}`);
        values.push(timezone);
      }

      if (updates.length === 0) {
        throw createError('No fields to update', 400, 'NO_CHANGES');
      }

      values.push(workspaceId);

      await query(
        `UPDATE workspaces SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
        values
      );

      res.json({ message: 'Workspace updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// List workspace members
router.get(
  '/:workspaceId/members',
  [param('workspaceId').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor', 'analyst'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { workspaceId } = req.params;

      const result = await query(
        `SELECT wm.*, u.email, u.first_name, u.last_name
         FROM workspace_members wm
         JOIN users u ON wm.user_id = u.id
         WHERE wm.workspace_id = $1
         ORDER BY wm.created_at DESC`,
        [workspaceId]
      );

      res.json({ members: result.rows });
    } catch (error) {
      next(error);
    }
  }
);

// Invite member
router.post(
  '/:workspaceId/members',
  [
    param('workspaceId').isUUID(),
    body('email').isEmail().normalizeEmail(),
    body('role').isIn(['workspace_admin', 'editor', 'analyst']),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', {
          errors: errors.array(),
        });
      }

      const { workspaceId } = req.params;
      const { email, role } = req.body;

      // Find user by email
      const userResult = await query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        // TODO: Send invitation email for new users
        throw createError('User not found. Invitation emails not yet implemented.', 404, 'USER_NOT_FOUND');
      }

      const userId = userResult.rows[0].id;

      // Check if already a member
      const existingMember = await query(
        'SELECT id FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
        [workspaceId, userId]
      );

      if (existingMember.rows.length > 0) {
        throw createError('User is already a member of this workspace', 409, 'ALREADY_MEMBER');
      }

      // Add member
      await query(
        `INSERT INTO workspace_members (id, workspace_id, user_id, role, status, invited_by, invited_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [uuidv4(), workspaceId, userId, role, 'pending', req.user!.id]
      );

      res.status(201).json({ message: 'Invitation sent successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Remove member
router.delete(
  '/:workspaceId/members/:memberId',
  [param('workspaceId').isUUID(), param('memberId').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { workspaceId, memberId } = req.params;

      // Cannot remove workspace owner
      const member = await query(
        'SELECT role FROM workspace_members WHERE id = $1',
        [memberId]
      );

      if (member.rows.length === 0) {
        throw createError('Member not found', 404, 'NOT_FOUND');
      }

      if (member.rows[0].role === 'workspace_owner') {
        throw createError('Cannot remove workspace owner', 403, 'CANNOT_REMOVE_OWNER');
      }

      await query(
        `UPDATE workspace_members SET status = 'removed', updated_at = NOW()
         WHERE id = $1 AND workspace_id = $2`,
        [memberId, workspaceId]
      );

      res.json({ message: 'Member removed successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as workspacesRouter };

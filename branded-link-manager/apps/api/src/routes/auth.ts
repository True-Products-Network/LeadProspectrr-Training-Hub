import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { query, transaction } from '@blm/database';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, authenticateToken } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/requestContext';

const router = Router();
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().isLength({ min: 1, max: 100 }),
    body('lastName').trim().isLength({ min: 1, max: 100 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', {
          errors: errors.array(),
        });
      }

      const { email, password, firstName, lastName } = req.body;

      // Check if user exists
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw createError('Email already registered', 409, 'EMAIL_EXISTS');
      }

      // Create user with default workspace
      const result = await transaction(async (client) => {
        const userId = uuidv4();
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // Create user
        await client.query(
          `INSERT INTO users (id, email, password_hash, first_name, last_name)
           VALUES ($1, $2, $3, $4, $5)`,
          [userId, email, passwordHash, firstName, lastName]
        );

        // Get Free plan
        const planResult = await client.query(
          'SELECT id FROM plans WHERE name = $1 LIMIT 1',
          ['Free']
        );

        if (planResult.rows.length === 0) {
          throw createError('Default plan not found', 500, 'CONFIG_ERROR');
        }

        const planId = planResult.rows[0].id;

        // Create workspace
        const workspaceId = uuidv4();
        const workspaceSlug = `workspace-${Date.now()}`;
        await client.query(
          `INSERT INTO workspaces (id, name, slug, owner_user_id, plan_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [workspaceId, `${firstName}'s Workspace`, workspaceSlug, userId, planId]
        );

        // Add as workspace owner
        await client.query(
          `INSERT INTO workspace_members (id, workspace_id, user_id, role, status, invited_by, invited_at, accepted_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [uuidv4(), workspaceId, userId, 'workspace_owner', 'active', userId]
        );

        return { userId, workspaceId };
      });

      const token = generateToken(result.userId, email);

      res.status(201).json({
        token,
        user: {
          id: result.userId,
          email,
          firstName,
          lastName,
        },
        workspaceId: result.workspaceId,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', {
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user
      const userResult = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
      }

      const user = userResult.rows[0];

      // Check password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
      }

      // Update last login
      await query(
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [user.id]
      );

      const token = generateToken(user.id, user.email);

      // Get user's workspaces
      const workspacesResult = await query(
        `SELECT w.*, wm.role
         FROM workspaces w
         JOIN workspace_members wm ON w.id = wm.workspace_id
         WHERE wm.user_id = $1 AND wm.status = 'active'
         ORDER BY w.created_at DESC`,
        [user.id]
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          timezone: user.timezone,
        },
        workspaces: workspacesResult.rows,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401, 'UNAUTHORIZED');
    }

    // Get user's workspaces
    const workspacesResult = await query(
      `SELECT w.*, wm.role
       FROM workspaces w
       JOIN workspace_members wm ON w.id = wm.workspace_id
       WHERE wm.user_id = $1 AND wm.status = 'active'
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        timezone: req.user.timezone,
      },
      workspaces: workspacesResult.rows,
    });
  } catch (error) {
    next(error);
  }
});

// Change password
router.post(
  '/change-password',
  authenticateToken,
  [
    body('currentPassword').exists(),
    body('newPassword').isLength({ min: 8 }),
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

      const { currentPassword, newPassword } = req.body;

      // Verify current password
      const userResult = await query(
        'SELECT password_hash FROM users WHERE id = $1',
        [req.user.id]
      );

      const validPassword = await bcrypt.compare(
        currentPassword,
        userResult.rows[0].password_hash
      );

      if (!validPassword) {
        throw createError('Current password is incorrect', 400, 'INVALID_PASSWORD');
      }

      // Update password
      const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
      await query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [newHash, req.user.id]
      );

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as authRouter };

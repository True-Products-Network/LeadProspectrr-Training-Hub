import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '@blm/database';
import { AuthenticatedRequest } from './requestContext';
import { createError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

interface TokenPayload {
  userId: string;
  email: string;
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('Access token required', 401, 'UNAUTHORIZED');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Fetch user from database
    const result = await query(
      'SELECT * FROM users WHERE id = $1 AND status = $2',
      [decoded.userId, 'active']
    );

    if (result.rows.length === 0) {
      throw createError('User not found or inactive', 401, 'UNAUTHORIZED');
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Invalid token', 401, 'UNAUTHORIZED'));
    } else {
      next(error);
    }
  }
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export function requireWorkspaceRole(...allowedRoles: string[]) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;

      if (!workspaceId) {
        throw createError('Workspace ID required', 400, 'MISSING_WORKSPACE');
      }

      if (!req.user) {
        throw createError('Authentication required', 401, 'UNAUTHORIZED');
      }

      // Check workspace membership
      const memberResult = await query(
        `SELECT wm.*, w.* as workspace
         FROM workspace_members wm
         JOIN workspaces w ON wm.workspace_id = w.id
         WHERE wm.workspace_id = $1
         AND wm.user_id = $2
         AND wm.status = 'active'`,
        [workspaceId, req.user.id]
      );

      if (memberResult.rows.length === 0) {
        throw createError('Access denied to workspace', 403, 'FORBIDDEN');
      }

      const membership = memberResult.rows[0];

      if (!allowedRoles.includes(membership.role)) {
        throw createError('Insufficient permissions', 403, 'FORBIDDEN');
      }

      req.membership = membership;
      req.workspace = membership.workspace;
      next();
    } catch (error) {
      next(error);
    }
  };
}

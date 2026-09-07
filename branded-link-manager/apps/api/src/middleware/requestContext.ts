import { Request, Response, NextFunction } from 'express';
import { User, Workspace, WorkspaceMember } from '@blm/database';

export interface AuthenticatedRequest extends Request {
  user?: User;
  workspace?: Workspace;
  membership?: WorkspaceMember;
}

export function requestContext(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Add request ID for tracing
  req.id = crypto.randomUUID();
  next();
}

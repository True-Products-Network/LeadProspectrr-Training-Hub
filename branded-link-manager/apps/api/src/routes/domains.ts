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

// List domains
router.get(
  '/',
  [queryValidator('workspaceId').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor', 'analyst'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { workspaceId } = req.query as { workspaceId: string };

      const result = await query(
        `SELECT d.*,
          (SELECT COUNT(*) FROM links WHERE domain_id = d.id AND deleted_at IS NULL) as link_count
         FROM domains d
         WHERE d.workspace_id = $1
         ORDER BY d.is_default DESC, d.created_at DESC`,
        [workspaceId]
      );

      res.json({ domains: result.rows });
    } catch (error) {
      next(error);
    }
  }
);

// Add domain
router.post(
  '/',
  [
    body('workspaceId').isUUID(),
    body('hostname').trim().isLength({ min: 3, max: 255 }),
    body('type').optional().isIn(['subdomain', 'root']),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', { errors: errors.array() });
      }

      const { workspaceId, hostname, type = 'subdomain' } = req.body;

      // Validate hostname format
      if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(hostname) && type === 'subdomain') {
        throw createError('Invalid subdomain format. Use format: go.example.com', 400, 'INVALID_HOSTNAME');
      }

      // Check if domain already exists in workspace
      const existingCheck = await query(
        'SELECT id FROM domains WHERE workspace_id = $1 AND hostname = $2',
        [workspaceId, hostname]
      );

      if (existingCheck.rows.length > 0) {
        throw createError('Domain already exists in workspace', 409, 'DOMAIN_EXISTS');
      }

      // Check plan limits
      const planCheck = await query(
        `SELECT p.domain_limit
         FROM workspaces w
         JOIN plans p ON w.plan_id = p.id
         WHERE w.id = $1`,
        [workspaceId]
      );

      const domainLimit = planCheck.rows[0]?.domain_limit || 0;

      if (domainLimit > 0) {
        const currentCount = await query(
          'SELECT COUNT(*) as count FROM domains WHERE workspace_id = $1',
          [workspaceId]
        );

        if (parseInt(currentCount.rows[0].count) >= domainLimit) {
          throw createError('Domain limit reached for current plan', 403, 'PLAN_LIMIT');
        }
      }

      // Generate verification token
      const verificationToken = `verify-${uuidv4()}`;

      const result = await transaction(async (client) => {
        const domainId = uuidv4();

        await client.query(
          `INSERT INTO domains (
            id, workspace_id, hostname, type, verification_token,
            verification_status, dns_status, ssl_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [domainId, workspaceId, hostname, type, verificationToken, 'pending_dns', 'pending', 'pending']
        );

        await auditLog(client, {
          workspaceId,
          userId: req.user!.id,
          action: 'domain.created',
          entityType: 'domain',
          entityId: domainId,
          newValues: { hostname, type },
        });

        return domainId;
      });

      res.status(201).json({
        id: result,
        hostname,
        verificationToken,
        dnsInstructions: {
          type: 'CNAME',
          name: hostname.split('.')[0],
          value: process.env.PLATFORM_DOMAIN || 'lnk.local',
        },
        message: 'Domain added. Please configure DNS to verify.',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify domain
router.post(
  '/:id/verify',
  [param('id').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get domain
      const domainResult = await query(
        'SELECT * FROM domains WHERE id = $1',
        [id]
      );

      if (domainResult.rows.length === 0) {
        throw createError('Domain not found', 404, 'NOT_FOUND');
      }

      const domain = domainResult.rows[0];

      // Check workspace access
      const memberCheck = await query(
        'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND status = $3',
        [domain.workspace_id, req.user!.id, 'active']
      );

      if (memberCheck.rows.length === 0) {
        throw createError('Access denied', 403, 'FORBIDDEN');
      }

      // In MVP, simulate DNS verification
      // In production, this would actually check DNS records
      await transaction(async (client) => {
        await client.query(
          `UPDATE domains SET
            verification_status = 'active',
            dns_status = 'verified',
            ssl_status = 'active',
            certificate_expires_at = NOW() + INTERVAL '90 days'
           WHERE id = $1`,
          [id]
        );

        await auditLog(client, {
          workspaceId: domain.workspace_id,
          userId: req.user!.id,
          action: 'domain.verified',
          entityType: 'domain',
          entityId: id,
        });
      });

      res.json({
        status: 'active',
        message: 'Domain verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Set as default domain
router.post(
  '/:id/default',
  [param('id').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get domain
      const domainResult = await query(
        'SELECT * FROM domains WHERE id = $1',
        [id]
      );

      if (domainResult.rows.length === 0) {
        throw createError('Domain not found', 404, 'NOT_FOUND');
      }

      const domain = domainResult.rows[0];

      if (domain.verification_status !== 'active') {
        throw createError('Domain must be verified before setting as default', 400, 'DOMAIN_NOT_VERIFIED');
      }

      await transaction(async (client) => {
        // Clear existing default
        await client.query(
          'UPDATE domains SET is_default = false WHERE workspace_id = $1',
          [domain.workspace_id]
        );

        // Set new default
        await client.query(
          'UPDATE domains SET is_default = true WHERE id = $1',
          [id]
        );

        // Update workspace default
        await client.query(
          'UPDATE workspaces SET default_domain_id = $1 WHERE id = $2',
          [id, domain.workspace_id]
        );

        await auditLog(client, {
          workspaceId: domain.workspace_id,
          userId: req.user!.id,
          action: 'domain.set_default',
          entityType: 'domain',
          entityId: id,
        });
      });

      res.json({ message: 'Default domain updated' });
    } catch (error) {
      next(error);
    }
  }
);

// Delete domain
router.delete(
  '/:id',
  [param('id').isUUID()],
  requireWorkspaceRole('workspace_owner', 'workspace_admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get domain
      const domainResult = await query(
        'SELECT * FROM domains WHERE id = $1',
        [id]
      );

      if (domainResult.rows.length === 0) {
        throw createError('Domain not found', 404, 'NOT_FOUND');
      }

      const domain = domainResult.rows[0];

      // Check if domain has links
      const linksCheck = await query(
        'SELECT COUNT(*) as count FROM links WHERE domain_id = $1 AND deleted_at IS NULL',
        [id]
      );

      if (parseInt(linksCheck.rows[0].count) > 0) {
        throw createError('Cannot delete domain with active links', 400, 'DOMAIN_HAS_LINKS');
      }

      await transaction(async (client) => {
        await client.query('DELETE FROM domains WHERE id = $1', [id]);

        await auditLog(client, {
          workspaceId: domain.workspace_id,
          userId: req.user!.id,
          action: 'domain.deleted',
          entityType: 'domain',
          entityId: id,
          oldValues: { hostname: domain.hostname },
        });
      });

      res.json({ message: 'Domain deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as domainsRouter };

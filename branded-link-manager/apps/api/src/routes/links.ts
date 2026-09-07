import { Router } from 'express';
import { body, param, query as queryValidator, validationResult } from 'express-validator';
import { query, transaction } from '@blm/database';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireWorkspaceRole } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/requestContext';
import { auditLog } from '../utils/audit';
import { isBlockedDestination, resolveDestination } from '../utils/validation';

const router = Router();

router.use(authenticateToken);

// List links
router.get(
  '/',
  [
    queryValidator('workspaceId').isUUID(),
    queryValidator('page').optional().isInt({ min: 1 }),
    queryValidator('limit').optional().isInt({ min: 1, max: 100 }),
    queryValidator('status').optional().isIn(['active', 'scheduled', 'expired', 'paused', 'broken', 'archived']),
    queryValidator('search').optional().trim(),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor', 'analyst'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', { errors: errors.array() });
      }

      const { workspaceId } = req.query as { workspaceId: string };
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;
      const status = req.query.status as string;
      const search = req.query.search as string;

      let whereClause = 'WHERE l.workspace_id = $1 AND l.deleted_at IS NULL';
      const params: any[] = [workspaceId];
      let paramIndex = 2;

      if (status) {
        whereClause += ` AND l.status = $${paramIndex++}`;
        params.push(status);
      }

      if (search) {
        whereClause += ` AND (l.title ILIKE $${paramIndex} OR l.slug ILIKE $${paramIndex} OR l.destination_url ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      // Get total count
      const countResult = await query(
        `SELECT COUNT(*) as total FROM links l ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].total);

      // Get links
      const result = await query(
        `SELECT l.*, d.hostname as domain_hostname,
          c.name as campaign_name, f.name as folder_name,
          COALESCE(
            (SELECT json_agg(t.*)
             FROM tags t
             JOIN link_tags lt ON t.id = lt.tag_id
             WHERE lt.link_id = l.id),
            '[]'
          ) as tags
         FROM links l
         LEFT JOIN domains d ON l.domain_id = d.id
         LEFT JOIN campaigns c ON l.campaign_id = c.id
         LEFT JOIN folders f ON l.folder_id = f.id
         ${whereClause}
         ORDER BY l.created_at DESC
         LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
        [...params, limit, offset]
      );

      res.json({
        links: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create link
router.post(
  '/',
  [
    body('workspaceId').isUUID(),
    body('domainId').isUUID(),
    body('title').trim().isLength({ min: 1, max: 255 }),
    body('slug').trim().isLength({ min: 1, max: 255 }).matches(/^[a-zA-Z0-9-_]+$/),
    body('destinationUrl').isURL({ protocols: ['http', 'https'] }),
    body('redirectType').optional().isIn(['301', '302', '307', '308']),
    body('campaignId').optional().isUUID(),
    body('folderId').optional().isUUID(),
    body('description').optional().trim(),
    body('tags').optional().isArray(),
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
        title,
        slug,
        destinationUrl,
        redirectType = '302',
        campaignId,
        folderId,
        description,
        tags,
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
        'SELECT id FROM links WHERE domain_id = $1 AND slug = $2 AND deleted_at IS NULL',
        [domainId, slug]
      );

      if (slugCheck.rows.length > 0) {
        throw createError('Slug already in use on this domain', 409, 'SLUG_EXISTS');
      }

      // Validate destination
      if (await isBlockedDestination(destinationUrl)) {
        throw createError('Destination URL is blocked', 400, 'BLOCKED_DESTINATION');
      }

      // Resolve destination (follow redirects, validate)
      const resolvedUrl = await resolveDestination(destinationUrl);

      const result = await transaction(async (client) => {
        const linkId = uuidv4();

        // Create link
        await client.query(
          `INSERT INTO links (
            id, workspace_id, domain_id, campaign_id, folder_id,
            title, slug, destination_url, resolved_destination_url,
            redirect_type, status, description, created_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            linkId, workspaceId, domainId, campaignId || null, folderId || null,
            title, slug, destinationUrl, resolvedUrl,
            redirectType, 'active', description || null, req.user!.id,
          ]
        );

        // Add tags if provided
        if (tags && tags.length > 0) {
          for (const tagId of tags) {
            await client.query(
              'INSERT INTO link_tags (id, link_id, tag_id) VALUES ($1, $2, $3)',
              [uuidv4(), linkId, tagId]
            );
          }
        }

        // Audit log
        await auditLog(client, {
          workspaceId,
          userId: req.user!.id,
          action: 'link.created',
          entityType: 'link',
          entityId: linkId,
          newValues: { title, slug, destinationUrl, redirectType },
        });

        return linkId;
      });

      res.status(201).json({
        id: result,
        title,
        slug,
        shortUrl: `${req.workspace?.default_domain_id ? '' : process.env.DEFAULT_DOMAIN}/${slug}`,
        message: 'Link created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get link details
router.get(
  '/:id',
  [param('id').isUUID()],
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      const result = await query(
        `SELECT l.*, d.hostname as domain_hostname,
          c.name as campaign_name, f.name as folder_name,
          COALESCE(
            (SELECT json_agg(json_build_object('id', t.id, 'name', t.name))
             FROM tags t
             JOIN link_tags lt ON t.id = lt.tag_id
             WHERE lt.link_id = l.id),
            '[]'
          ) as tags
         FROM links l
         LEFT JOIN domains d ON l.domain_id = d.id
         LEFT JOIN campaigns c ON l.campaign_id = c.id
         LEFT JOIN folders f ON l.folder_id = f.id
         WHERE l.id = $1 AND l.deleted_at IS NULL`,
        [id]
      );

      if (result.rows.length === 0) {
        throw createError('Link not found', 404, 'NOT_FOUND');
      }

      const link = result.rows[0];

      // Check workspace access
      const memberCheck = await query(
        'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND status = $3',
        [link.workspace_id, req.user!.id, 'active']
      );

      if (memberCheck.rows.length === 0) {
        throw createError('Access denied', 403, 'FORBIDDEN');
      }

      res.json({ link });
    } catch (error) {
      next(error);
    }
  }
);

// Update link
router.patch(
  '/:id',
  [
    param('id').isUUID(),
    body('title').optional().trim().isLength({ min: 1, max: 255 }),
    body('destinationUrl').optional().isURL({ protocols: ['http', 'https'] }),
    body('redirectType').optional().isIn(['301', '302', '307', '308']),
    body('status').optional().isIn(['active', 'paused', 'archived']),
  ],
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get link and check access
      const linkResult = await query(
        'SELECT * FROM links WHERE id = $1 AND deleted_at IS NULL',
        [id]
      );

      if (linkResult.rows.length === 0) {
        throw createError('Link not found', 404, 'NOT_FOUND');
      }

      const link = linkResult.rows[0];

      // Check workspace access
      const memberCheck = await query(
        'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND status = $3',
        [link.workspace_id, req.user!.id, 'active']
      );

      if (memberCheck.rows.length === 0) {
        throw createError('Access denied', 403, 'FORBIDDEN');
      }

      const role = memberCheck.rows[0].role;
      if (role === 'analyst') {
        throw createError('Insufficient permissions', 403, 'FORBIDDEN');
      }

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (req.body.title) {
        updates.push(`title = $${paramIndex++}`);
        values.push(req.body.title);
        oldValues.title = link.title;
        newValues.title = req.body.title;
      }

      if (req.body.destinationUrl) {
        if (await isBlockedDestination(req.body.destinationUrl)) {
          throw createError('Destination URL is blocked', 400, 'BLOCKED_DESTINATION');
        }

        const resolvedUrl = await resolveDestination(req.body.destinationUrl);
        updates.push(`destination_url = $${paramIndex++}`);
        updates.push(`resolved_destination_url = $${paramIndex++}`);
        values.push(req.body.destinationUrl, resolvedUrl);
        oldValues.destination_url = link.destination_url;
        newValues.destination_url = req.body.destinationUrl;
      }

      if (req.body.redirectType) {
        updates.push(`redirect_type = $${paramIndex++}`);
        values.push(req.body.redirectType);
        oldValues.redirect_type = link.redirect_type;
        newValues.redirect_type = req.body.redirectType;
      }

      if (req.body.status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(req.body.status);
        oldValues.status = link.status;
        newValues.status = req.body.status;

        if (req.body.status === 'archived') {
          updates.push(`archived_at = NOW()`);
        }
      }

      if (updates.length === 0) {
        throw createError('No fields to update', 400, 'NO_CHANGES');
      }

      values.push(id);

      await transaction(async (client) => {
        await client.query(
          `UPDATE links SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
          values
        );

        await auditLog(client, {
          workspaceId: link.workspace_id,
          userId: req.user!.id,
          action: 'link.updated',
          entityType: 'link',
          entityId: id,
          oldValues,
          newValues,
        });
      });

      res.json({ message: 'Link updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Delete link (soft delete)
router.delete(
  '/:id',
  [param('id').isUUID()],
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Get link and check access
      const linkResult = await query(
        'SELECT * FROM links WHERE id = $1 AND deleted_at IS NULL',
        [id]
      );

      if (linkResult.rows.length === 0) {
        throw createError('Link not found', 404, 'NOT_FOUND');
      }

      const link = linkResult.rows[0];

      // Check workspace access
      const memberCheck = await query(
        'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND status = $3',
        [link.workspace_id, req.user!.id, 'active']
      );

      if (memberCheck.rows.length === 0) {
        throw createError('Access denied', 403, 'FORBIDDEN');
      }

      const role = memberCheck.rows[0].role;
      if (!['workspace_owner', 'workspace_admin'].includes(role)) {
        throw createError('Insufficient permissions', 403, 'FORBIDDEN');
      }

      await transaction(async (client) => {
        await client.query(
          'UPDATE links SET deleted_at = NOW() WHERE id = $1',
          [id]
        );

        await auditLog(client, {
          workspaceId: link.workspace_id,
          userId: req.user!.id,
          action: 'link.deleted',
          entityType: 'link',
          entityId: id,
          oldValues: { title: link.title, slug: link.slug },
        });
      });

      res.json({ message: 'Link deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as linksRouter };

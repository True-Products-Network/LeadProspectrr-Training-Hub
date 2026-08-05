import { Router } from 'express';
import { query as queryValidator, validationResult } from 'express-validator';
import { query } from '@blm/database';
import { authenticateToken, requireWorkspaceRole } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/requestContext';

const router = Router();

router.use(authenticateToken);

// Dashboard summary
router.get(
  '/dashboard',
  [
    queryValidator('workspaceId').isUUID(),
    queryValidator('days').optional().isInt({ min: 1, max: 365 }),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor', 'analyst'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError('Validation failed', 400, 'VALIDATION_ERROR', { errors: errors.array() });
      }

      const { workspaceId } = req.query as { workspaceId: string };
      const days = parseInt(req.query.days as string) || 30;
      const since = new Date();
      since.setDate(since.getDate() - days);

      // Get summary stats
      const statsResult = await query(
        `SELECT
          COUNT(*) as total_clicks,
          COUNT(DISTINCT unique_visitor_key) as unique_clicks,
          COUNT(*) FILTER (WHERE is_bot = true) as bot_clicks,
          COUNT(*) FILTER (WHERE is_qr_scan = true) as qr_scans
         FROM click_events
         WHERE workspace_id = $1
         AND occurred_at >= $2`,
        [workspaceId, since]
      );

      // Get top links
      const topLinksResult = await query(
        `SELECT
          l.id, l.title, l.slug,
          COUNT(*) as clicks
         FROM click_events ce
         JOIN links l ON ce.link_id = l.id
         WHERE ce.workspace_id = $1
         AND ce.occurred_at >= $2
         GROUP BY l.id, l.title, l.slug
         ORDER BY clicks DESC
         LIMIT 10`,
        [workspaceId, since]
      );

      // Get top countries
      const countriesResult = await query(
        `SELECT country_code, COUNT(*) as clicks
         FROM click_events
         WHERE workspace_id = $1
         AND occurred_at >= $2
         AND country_code IS NOT NULL
         GROUP BY country_code
         ORDER BY clicks DESC
         LIMIT 10`,
        [workspaceId, since]
      );

      // Get device breakdown
      const devicesResult = await query(
        `SELECT device_type, COUNT(*) as clicks
         FROM click_events
         WHERE workspace_id = $1
         AND occurred_at >= $2
         AND device_type IS NOT NULL
         GROUP BY device_type
         ORDER BY clicks DESC`,
        [workspaceId, since]
      );

      // Get browser breakdown
      const browsersResult = await query(
        `SELECT browser, COUNT(*) as clicks
         FROM click_events
         WHERE workspace_id = $1
         AND occurred_at >= $2
         AND browser IS NOT NULL
         GROUP BY browser
         ORDER BY clicks DESC
         LIMIT 10`,
        [workspaceId, since]
      );

      // Get referrer breakdown
      const referrersResult = await query(
        `SELECT referrer_domain, COUNT(*) as clicks
         FROM click_events
         WHERE workspace_id = $1
         AND occurred_at >= $2
         AND referrer_domain IS NOT NULL
         GROUP BY referrer_domain
         ORDER BY clicks DESC
         LIMIT 10`,
        [workspaceId, since]
      );

      // Get click trend (daily)
      const trendResult = await query(
        `SELECT
          DATE(occurred_at) as date,
          COUNT(*) as clicks,
          COUNT(DISTINCT unique_visitor_key) as unique_clicks
         FROM click_events
         WHERE workspace_id = $1
         AND occurred_at >= $2
         GROUP BY DATE(occurred_at)
         ORDER BY date`,
        [workspaceId, since]
      );

      res.json({
        summary: statsResult.rows[0],
        topLinks: topLinksResult.rows,
        countries: countriesResult.rows,
        devices: devicesResult.rows,
        browsers: browsersResult.rows,
        referrers: referrersResult.rows,
        trend: trendResult.rows,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Link-specific analytics
router.get(
  '/links/:linkId',
  [
    queryValidator('workspaceId').isUUID(),
    queryValidator('days').optional().isInt({ min: 1, max: 365 }),
  ],
  requireWorkspaceRole('workspace_owner', 'workspace_admin', 'editor', 'analyst'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { linkId } = req.params;
      const { workspaceId } = req.query as { workspaceId: string };
      const days = parseInt(req.query.days as string) || 30;
      const since = new Date();
      since.setDate(since.getDate() - days);

      // Verify link belongs to workspace
      const linkCheck = await query(
        'SELECT id FROM links WHERE id = $1 AND workspace_id = $2',
        [linkId, workspaceId]
      );

      if (linkCheck.rows.length === 0) {
        throw createError('Link not found', 404, 'NOT_FOUND');
      }

      // Get link stats
      const statsResult = await query(
        `SELECT
          COUNT(*) as total_clicks,
          COUNT(DISTINCT unique_visitor_key) as unique_clicks,
          COUNT(*) FILTER (WHERE is_bot = true) as bot_clicks,
          COUNT(*) FILTER (WHERE is_qr_scan = true) as qr_scans
         FROM click_events
         WHERE link_id = $1
         AND occurred_at >= $2`,
        [linkId, since]
      );

      // Get daily breakdown
      const dailyResult = await query(
        `SELECT
          DATE(occurred_at) as date,
          COUNT(*) as clicks,
          COUNT(DISTINCT unique_visitor_key) as unique_clicks
         FROM click_events
         WHERE link_id = $1
         AND occurred_at >= $2
         GROUP BY DATE(occurred_at)
         ORDER BY date`,
        [linkId, since]
      );

      // Get countries
      const countriesResult = await query(
        `SELECT country_code, COUNT(*) as clicks
         FROM click_events
         WHERE link_id = $1
         AND occurred_at >= $2
         AND country_code IS NOT NULL
         GROUP BY country_code
         ORDER BY clicks DESC
         LIMIT 10`,
        [linkId, since]
      );

      // Get devices
      const devicesResult = await query(
        `SELECT device_type, COUNT(*) as clicks
         FROM click_events
         WHERE link_id = $1
         AND occurred_at >= $2
         AND device_type IS NOT NULL
         GROUP BY device_type
         ORDER BY clicks DESC`,
        [linkId, since]
      );

      // Get browsers
      const browsersResult = await query(
        `SELECT browser, COUNT(*) as clicks
         FROM click_events
         WHERE link_id = $1
         AND occurred_at >= $2
         AND browser IS NOT NULL
         GROUP BY browser
         ORDER BY clicks DESC
         LIMIT 10`,
        [linkId, since]
      );

      // Get referrers
      const referrersResult = await query(
        `SELECT referrer_domain, COUNT(*) as clicks
         FROM click_events
         WHERE link_id = $1
         AND occurred_at >= $2
         AND referrer_domain IS NOT NULL
         GROUP BY referrer_domain
         ORDER BY clicks DESC
         LIMIT 10`,
        [linkId, since]
      );

      res.json({
        linkId,
        summary: statsResult.rows[0],
        daily: dailyResult.rows,
        countries: countriesResult.rows,
        devices: devicesResult.rows,
        browsers: browsersResult.rows,
        referrers: referrersResult.rows,
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as analyticsRouter };

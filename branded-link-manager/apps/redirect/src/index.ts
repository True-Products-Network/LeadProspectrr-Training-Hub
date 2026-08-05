import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from 'ioredis';
import { query } from '@blm/database';
import { UAParser } from 'ua-parser-js';
import { v4 as uuidv4 } from 'crypto';
import { createHash } from 'crypto';

const app = express();
const PORT = process.env.REDIRECT_PORT || 3001;

// Redis client for caching
const redis = new createClient(process.env.REDIS_URL || 'redis://localhost:6379/0');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting for redirects
const redirectLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: parseInt(process.env.REDIRECT_RATE_LIMIT_MAX || '1000'),
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
});
app.use(redirectLimiter);

// Parse user agent
app.use((req, res, next) => {
  const parser = new UAParser(req.headers['user-agent']);
  (req as any).ua = parser.getResult();
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'redirect' });
});

// Main redirect handler
app.get('/:slug', handleRedirect);
app.get('/:slug/*', handleRedirect);

interface LinkData {
  id: string;
  workspace_id: string;
  domain_id: string;
  destination_url: string;
  redirect_type: string;
  status: string;
  password_hash: string | null;
  starts_at: Date | null;
  expires_at: Date | null;
  fallback_url: string | null;
  expired_behavior: string;
}

async function handleRedirect(req: express.Request, res: express.Response) {
  const startTime = Date.now();
  const hostname = req.headers.host || '';
  const slug = req.params.slug;
  const pathSuffix = req.params[0] ? '/' + req.params[0] : '';

  try {
    // 1. Check cache first (fast path)
    const cacheKey = `redirect:${hostname}:${slug}`;
    const cached = await redis.get(cacheKey);

    let linkData: LinkData;

    if (cached) {
      linkData = JSON.parse(cached);
    } else {
      // 2. Database lookup (slow path)
      const result = await query(
        `SELECT l.*, d.hostname
         FROM links l
         JOIN domains d ON l.domain_id = d.id
         WHERE d.hostname = $1
         AND l.slug = $2
         AND l.status IN ('active', 'scheduled', 'expired')
         AND l.deleted_at IS NULL`,
        [hostname, slug]
      );

      if (result.rows.length === 0) {
        return res.status(404).send('Link not found');
      }

      linkData = result.rows[0];

      // Cache for 5 minutes
      await redis.setex(cacheKey, 300, JSON.stringify(linkData));
    }

    // 3. Validate link status
    const now = new Date();

    // Check scheduled start
    if (linkData.starts_at && new Date(linkData.starts_at) > now) {
      return res.status(404).send('Link not yet active');
    }

    // Check expiration
    if (linkData.expires_at && new Date(linkData.expires_at) < now) {
      if (linkData.expired_behavior === 'fallback' && linkData.fallback_url) {
        return performRedirect(res, linkData.fallback_url, linkData.redirect_type);
      }
      return res.status(parseInt(linkData.expired_behavior === '410' ? '410' : '404'))
        .send('Link has expired');
    }

    // Check if paused
    if (linkData.status === 'paused') {
      return res.status(404).send('Link is paused');
    }

    // 4. Track click asynchronously (don't wait)
    trackClick(req, linkData, startTime).catch(console.error);

    // 5. Perform redirect
    const destination = linkData.destination_url + pathSuffix + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
    performRedirect(res, destination, linkData.redirect_type);

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Internal error');
  }
}

function performRedirect(res: express.Response, destination: string, type: string) {
  const statusCode = parseInt(type) || 302;
  res.redirect(statusCode, destination);
}

async function trackClick(req: express.Request, link: LinkData, startTime: number) {
  try {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const ipHash = createHash('sha256')
      .update(ip + (process.env.IP_HASH_SALT || 'salt'))
      .digest('hex');

    const ua = (req as any).ua || {};
    const referrer = req.headers.referer || req.headers.referrer || null;

    // Parse UTM parameters from query string
    const queryParams = new URL(req.url, `http://${req.headers.host}`).searchParams;

    // Generate unique visitor key (simplified for MVP)
    const visitorKey = createHash('sha256')
      .update(ipHash + ua.browser?.name + ua.device?.type)
      .digest('hex')
      .substring(0, 32);

    const sessionKey = createHash('sha256')
      .update(ipHash + Date.now().toString())
      .digest('hex')
      .substring(0, 32);

    // Check if unique (simplified - in production use Redis for deduplication)
    const isUnique = true; // TODO: Implement proper unique check

    // Basic bot detection
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    const botType = isBot ? detectBotType(userAgent) : null;

    // Queue click event for background processing
    // For MVP, we'll insert directly but in production use a message queue
    await query(
      `INSERT INTO click_events (
        id, workspace_id, link_id, domain_id, occurred_at,
        destination_url, ip_hash, unique_visitor_key, session_key,
        browser, browser_version, operating_system, device_type,
        referrer_url, referrer_domain, user_agent,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        bot_type, is_bot, is_unique, response_time_ms
      ) VALUES (
        $1, $2, $3, $4, NOW(), $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20,
        $21, $22, $23, $24
      )`,
      [
        uuidv4(),
        link.workspace_id,
        link.id,
        link.domain_id,
        link.destination_url,
        ipHash,
        visitorKey,
        sessionKey,
        ua.browser?.name || null,
        ua.browser?.version || null,
        ua.os?.name || null,
        ua.device?.type || 'desktop',
        referrer,
        referrer ? new URL(referrer as string).hostname : null,
        userAgent.substring(0, 500),
        queryParams.get('utm_source'),
        queryParams.get('utm_medium'),
        queryParams.get('utm_campaign'),
        queryParams.get('utm_term'),
        queryParams.get('utm_content'),
        botType,
        isBot,
        isUnique,
        Date.now() - startTime,
      ]
    );

    // Update link last clicked
    await query(
      'UPDATE links SET last_health_check_at = NOW() WHERE id = $1',
      [link.id]
    );

  } catch (error) {
    console.error('Click tracking error:', error);
    // Don't throw - tracking failures shouldn't break redirects
  }
}

function detectBotType(userAgent: string): string | null {
  const ua = userAgent.toLowerCase();

  if (ua.includes('googlebot')) return 'search_engine';
  if (ua.includes('bingbot')) return 'search_engine';
  if (ua.includes('facebookexternalhit')) return 'social_crawler';
  if (ua.includes('twitterbot')) return 'social_crawler';
  if (ua.includes('linkedinbot')) return 'social_crawler';
  if (ua.includes('slackbot')) return 'preview_fetcher';
  if (ua.includes('discordbot')) return 'preview_fetcher';
  if (ua.includes('crawler')) return 'confirmed_bot';
  if (ua.includes('bot')) return 'suspicious';

  return null;
}

// Start server
app.listen(PORT, () => {
  console.log(`Redirect service running on port ${PORT}`);
  console.log(`Cache: Redis at ${process.env.REDIS_URL || 'redis://localhost:6379/0'}`);
});

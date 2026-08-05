// Vercel Edge Function handler for redirects
// This is optimized for Vercel's Edge Runtime

import { createClient } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

interface LinkData {
  id: string;
  workspace_id: string;
  domain_id: string;
  destination_url: string;
  redirect_type: string;
  status: string;
  password_hash: string | null;
  starts_at: string | null;
  expires_at: string | null;
  fallback_url: string | null;
  expired_behavior: string;
}

export default async function handler(request: Request): Promise<Response> {
  const startTime = Date.now();
  const url = new URL(request.url);
  const hostname = url.hostname;
  const slug = url.pathname.slice(1); // Remove leading /

  // Skip API routes
  if (slug.startsWith('api/') || slug === 'health') {
    return new Response('Not found', { status: 404 });
  }

  try {
    // Initialize KV store
    const kv = createClient({
      url: process.env.KV_REST_API_URL || '',
      token: process.env.KV_REST_API_TOKEN || '',
    });

    // Check cache first
    const cacheKey = `redirect:${hostname}:${slug}`;
    const cached = await kv.get<string>(cacheKey);

    let linkData: LinkData;

    if (cached) {
      linkData = JSON.parse(cached);
    } else {
      // Query database (using Vercel Postgres)
      const { sql } = await import('@vercel/postgres');

      const result = await sql`
        SELECT l.*, d.hostname
        FROM links l
        JOIN domains d ON l.domain_id = d.id
        WHERE d.hostname = ${hostname}
        AND l.slug = ${slug}
        AND l.status IN ('active', 'scheduled', 'expired')
        AND l.deleted_at IS NULL
      `;

      if (result.rows.length === 0) {
        return new Response('Link not found', { status: 404 });
      }

      linkData = result.rows[0] as LinkData;

      // Cache for 5 minutes
      await kv.set(cacheKey, JSON.stringify(linkData), { ex: 300 });
    }

    // Validate link status
    const now = new Date();

    // Check scheduled start
    if (linkData.starts_at && new Date(linkData.starts_at) > now) {
      return new Response('Link not yet active', { status: 404 });
    }

    // Check expiration
    if (linkData.expires_at && new Date(linkData.expires_at) < now) {
      if (linkData.expired_behavior === 'fallback' && linkData.fallback_url) {
        return Response.redirect(linkData.fallback_url, parseInt(linkData.redirect_type) || 302);
      }
      return new Response('Link has expired', {
        status: parseInt(linkData.expired_behavior === '410' ? '410' : '404')
      });
    }

    // Check if paused
    if (linkData.status === 'paused') {
      return new Response('Link is paused', { status: 404 });
    }

    // Track click asynchronously (fire and forget)
    trackClick(request, linkData, startTime).catch(console.error);

    // Perform redirect
    const statusCode = parseInt(linkData.redirect_type) || 302;
    return Response.redirect(linkData.destination_url, statusCode);

  } catch (error) {
    console.error('Redirect error:', error);
    return new Response('Internal error', { status: 500 });
  }
}

async function trackClick(request: Request, link: LinkData, startTime: number): Promise<void> {
  try {
    const { sql } = await import('@vercel/postgres');

    // Get IP and hash it
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + (process.env.IP_HASH_SALT || 'salt'));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const ipHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Parse user agent
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /bot|crawler|spider/i.test(userAgent);

    // Get referrer
    const referrer = request.headers.get('referer') || request.headers.get('referrer');

    // Insert click event
    await sql`
      INSERT INTO click_events (
        id, workspace_id, link_id, domain_id, occurred_at,
        destination_url, ip_hash, unique_visitor_key, session_key,
        user_agent, referrer_url, referrer_domain, is_bot, is_unique,
        response_time_ms
      ) VALUES (
        gen_random_uuid(), ${link.workspace_id}, ${link.id}, ${link.domain_id}, NOW(),
        ${link.destination_url}, ${ipHash}, ${ipHash}, ${ipHash},
        ${userAgent.substring(0, 500)}, ${referrer}, ${referrer ? new URL(referrer).hostname : null},
        ${isBot}, true, ${Date.now() - startTime}
      )
    `;

  } catch (error) {
    console.error('Click tracking error:', error);
  }
}

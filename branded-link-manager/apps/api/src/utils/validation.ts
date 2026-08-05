import { query } from '@blm/database';

export async function isBlockedDestination(url: string): Promise<boolean> {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();

    const result = await query(
      'SELECT id FROM blocked_destinations WHERE domain = $1 AND active = true',
      [domain]
    );

    return result.rows.length > 0;
  } catch {
    return true; // Block invalid URLs
  }
}

export async function resolveDestination(url: string): Promise<string> {
  // In MVP, just validate the URL format
  // In production, this would follow redirects and check the final destination
  try {
    const urlObj = new URL(url);

    // Only allow http and https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid protocol');
    }

    // Remove common tracking parameters that might be added later
    const blockedParams = ['fbclid', 'gclid', 'utm_source', 'utm_medium', 'utm_campaign'];
    blockedParams.forEach(param => urlObj.searchParams.delete(param));

    return urlObj.toString();
  } catch (error) {
    throw new Error('Invalid destination URL');
  }
}

export function generateSlug(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(slug) && slug.length >= 1 && slug.length <= 255;
}

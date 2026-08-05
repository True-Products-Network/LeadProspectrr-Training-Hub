// Shared constants
export const APP_NAME = 'Branded Link Manager';
export const APP_VERSION = '0.1.0';

// Link status constants
export const LINK_STATUS = {
  ACTIVE: 'active',
  SCHEDULED: 'scheduled',
  EXPIRED: 'expired',
  PAUSED: 'paused',
  BROKEN: 'broken',
  ARCHIVED: 'archived',
  FLAGGED: 'flagged',
} as const;

// Redirect types
export const REDIRECT_TYPES = {
  PERMANENT: '301',
  TEMPORARY: '302',
  TEMPORARY_PRESERVE: '307',
  PERMANENT_PRESERVE: '308',
} as const;

// User roles
export const USER_ROLES = {
  PLATFORM_OWNER: 'platform_owner',
  WORKSPACE_OWNER: 'workspace_owner',
  WORKSPACE_ADMIN: 'workspace_admin',
  EDITOR: 'editor',
  ANALYST: 'analyst',
} as const;

// Domain status
export const DOMAIN_STATUS = {
  PENDING_DNS: 'pending_dns',
  DNS_VERIFIED: 'dns_verified',
  SSL_PENDING: 'ssl_pending',
  ACTIVE: 'active',
  ERROR: 'error',
  SUSPENDED: 'suspended',
} as const;

// Health status
export const HEALTH_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  BROKEN: 'broken',
  BLOCKED: 'blocked',
  UNKNOWN: 'unknown',
} as const;

// Utility functions
export function generateShortId(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '')
    .substring(0, 255);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

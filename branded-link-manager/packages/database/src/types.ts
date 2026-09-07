// User roles
export type UserRole = 'platform_owner' | 'workspace_owner' | 'workspace_admin' | 'editor' | 'analyst';

// Link status
export type LinkStatus = 'active' | 'scheduled' | 'expired' | 'paused' | 'broken' | 'archived' | 'flagged';

// Redirect types
export type RedirectType = '301' | '302' | '307' | '308';

// Domain status
export type DomainStatus = 'pending_dns' | 'dns_verified' | 'ssl_pending' | 'active' | 'error' | 'suspended';

// Health status
export type HealthStatus = 'healthy' | 'warning' | 'broken' | 'blocked' | 'unknown';

// Bot types
export type BotType = 'search_engine' | 'social_crawler' | 'preview_fetcher' | 'security_scanner' | 'email_checker' | 'suspicious' | 'confirmed_bot';

// Block sources
export type BlockSource = 'manual' | 'reputation_api' | 'user_report' | 'auto_detect';

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

// User
export interface User extends BaseEntity {
  email: string;
  password_hash: string | null;
  external_auth_id: string | null;
  first_name: string;
  last_name: string;
  status: 'active' | 'inactive' | 'suspended';
  timezone: string;
  email_verified_at: Date | null;
  last_login_at: Date | null;
}

// Workspace
export interface Workspace extends BaseEntity {
  name: string;
  slug: string;
  owner_user_id: string;
  plan_id: string;
  status: 'active' | 'suspended' | 'deleted';
  timezone: string;
  default_domain_id: string | null;
}

// Workspace Member
export interface WorkspaceMember extends BaseEntity {
  workspace_id: string;
  user_id: string;
  role: UserRole;
  status: 'pending' | 'active' | 'removed';
  invited_by: string;
  invited_at: Date;
  accepted_at: Date | null;
}

// Plan
export interface Plan extends BaseEntity {
  name: string;
  monthly_price: number;
  annual_price: number;
  link_limit: number;
  click_limit: number;
  domain_limit: number;
  bio_page_limit: number;
  team_member_limit: number;
  retention_days: number;
  feature_flags: Record<string, boolean>;
  active: boolean;
}

// Domain
export interface Domain extends BaseEntity {
  workspace_id: string;
  hostname: string;
  type: 'subdomain' | 'root';
  verification_token: string;
  verification_status: DomainStatus;
  dns_status: 'pending' | 'verified' | 'failed';
  ssl_status: 'pending' | 'active' | 'failed' | 'expiring';
  certificate_expires_at: Date | null;
  is_default: boolean;
}

// Link
export interface Link extends BaseEntity {
  workspace_id: string;
  domain_id: string;
  campaign_id: string | null;
  folder_id: string | null;
  title: string;
  slug: string;
  destination_url: string;
  resolved_destination_url: string;
  redirect_type: RedirectType;
  status: LinkStatus;
  description: string | null;
  password_hash: string | null;
  starts_at: Date | null;
  expires_at: Date | null;
  fallback_url: string | null;
  expired_behavior: 'fallback' | '404' | '410';
  health_status: HealthStatus;
  last_health_check_at: Date | null;
  created_by: string;
  archived_at: Date | null;
  deleted_at: Date | null;
}

// Tag
export interface Tag extends BaseEntity {
  workspace_id: string;
  name: string;
}

// Link Tag
export interface LinkTag {
  id: string;
  link_id: string;
  tag_id: string;
}

// Folder
export interface Folder extends BaseEntity {
  workspace_id: string;
  parent_folder_id: string | null;
  name: string;
}

// Campaign
export interface Campaign extends BaseEntity {
  workspace_id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'paused' | 'completed';
  starts_at: Date | null;
  ends_at: Date | null;
  created_by: string;
}

// Click Event
export interface ClickEvent {
  id: string;
  workspace_id: string;
  link_id: string;
  domain_id: string;
  occurred_at: Date;
  destination_url: string;
  redirect_rule_id: string | null;
  ip_hash: string;
  unique_visitor_key: string;
  session_key: string;
  country_code: string | null;
  region: string | null;
  city: string | null;
  browser: string | null;
  browser_version: string | null;
  operating_system: string | null;
  device_type: 'desktop' | 'mobile' | 'tablet' | 'other' | null;
  referrer_url: string | null;
  referrer_domain: string | null;
  user_agent: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  bot_type: BotType | null;
  is_bot: boolean;
  is_unique: boolean;
  is_qr_scan: boolean;
  is_bio_click: boolean;
  response_status: number;
  response_time_ms: number;
  created_at: Date;
}

// Bio Page
export interface BioPage extends BaseEntity {
  workspace_id: string;
  domain_id: string;
  name: string;
  slug: string;
  display_name: string;
  bio: string | null;
  profile_image_url: string | null;
  theme_settings: Record<string, any>;
  seo_title: string | null;
  seo_description: string | null;
  social_image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  created_by: string;
  published_at: Date | null;
}

// Bio Block
export interface BioBlock extends BaseEntity {
  bio_page_id: string;
  block_type: string;
  block_order: number;
  content: Record<string, any>;
  settings: Record<string, any>;
  starts_at: Date | null;
  ends_at: Date | null;
  active: boolean;
}

// QR Code
export interface QRCode extends BaseEntity {
  workspace_id: string;
  link_id: string;
  settings: Record<string, any>;
  file_url: string | null;
}

// Audit Log
export interface AuditLog {
  id: string;
  workspace_id: string | null;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_hash: string | null;
  occurred_at: Date;
}

// Blocked Destination
export interface BlockedDestination extends BaseEntity {
  domain: string;
  reason: string;
  source: BlockSource;
  active: boolean;
}

// API Key
export interface ApiKey extends BaseEntity {
  workspace_id: string;
  name: string;
  key_hash: string;
  scopes: string[];
  last_used_at: Date | null;
  expires_at: Date | null;
  revoked_at: Date | null;
  created_by: string;
}

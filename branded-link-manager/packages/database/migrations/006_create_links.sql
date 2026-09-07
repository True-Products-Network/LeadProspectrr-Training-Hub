-- Create links table
CREATE TABLE IF NOT EXISTS links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE RESTRICT,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    destination_url TEXT NOT NULL,
    resolved_destination_url TEXT,
    redirect_type VARCHAR(3) DEFAULT '302' CHECK (redirect_type IN ('301', '302', '307', '308')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'expired', 'paused', 'broken', 'archived', 'flagged')),
    description TEXT,
    password_hash VARCHAR(255),
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    fallback_url TEXT,
    expired_behavior VARCHAR(20) DEFAULT '404' CHECK (expired_behavior IN ('fallback', '404', '410')),
    health_status VARCHAR(20) DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'warning', 'broken', 'blocked', 'unknown')),
    last_health_check_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(domain_id, slug)
);

-- Create indexes
CREATE INDEX idx_links_workspace ON links(workspace_id);
CREATE INDEX idx_links_domain ON links(domain_id);
CREATE INDEX idx_links_campaign ON links(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_links_folder ON links(folder_id) WHERE folder_id IS NOT NULL;
CREATE INDEX idx_links_status ON links(status);
CREATE INDEX idx_links_slug ON links(slug);
CREATE INDEX idx_links_created_by ON links(created_by);
CREATE INDEX idx_links_deleted_at ON links(deleted_at) WHERE deleted_at IS NULL;

-- Composite index for redirect lookups
CREATE INDEX idx_links_redirect_lookup ON links(domain_id, slug, status) WHERE deleted_at IS NULL;

-- Create trigger for updated_at
CREATE TRIGGER update_links_updated_at
    BEFORE UPDATE ON links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create link_tags junction table
CREATE TABLE IF NOT EXISTS link_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE(link_id, tag_id)
);

-- Create indexes
CREATE INDEX idx_link_tags_link ON link_tags(link_id);
CREATE INDEX idx_link_tags_tag ON link_tags(tag_id);

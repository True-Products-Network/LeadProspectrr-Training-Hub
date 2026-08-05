-- Create bio_pages table
CREATE TABLE IF NOT EXISTS bio_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    display_name VARCHAR(200),
    bio TEXT,
    profile_image_url TEXT,
    theme_settings JSONB DEFAULT '{}',
    seo_title VARCHAR(200),
    seo_description TEXT,
    social_image_url TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(domain_id, slug)
);

-- Create indexes
CREATE INDEX idx_bio_pages_workspace ON bio_pages(workspace_id);
CREATE INDEX idx_bio_pages_domain ON bio_pages(domain_id);
CREATE INDEX idx_bio_pages_status ON bio_pages(status);

-- Create trigger for updated_at
CREATE TRIGGER update_bio_pages_updated_at
    BEFORE UPDATE ON bio_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create bio_blocks table
CREATE TABLE IF NOT EXISTS bio_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bio_page_id UUID NOT NULL REFERENCES bio_pages(id) ON DELETE CASCADE,
    block_type VARCHAR(50) NOT NULL CHECK (block_type IN ('link', 'heading', 'text', 'image', 'social_icons', 'divider')),
    block_order INTEGER NOT NULL DEFAULT 0,
    content JSONB NOT NULL DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bio_blocks_page ON bio_blocks(bio_page_id);
CREATE INDEX idx_bio_blocks_active ON bio_blocks(active) WHERE active = true;

-- Create trigger for updated_at
CREATE TRIGGER update_bio_blocks_updated_at
    BEFORE UPDATE ON bio_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create bio_page_views table for analytics
CREATE TABLE IF NOT EXISTS bio_page_views (
    id UUID DEFAULT gen_random_uuid(),
    bio_page_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    unique_visitor_key VARCHAR(64) NOT NULL,
    country_code VARCHAR(2),
    browser VARCHAR(50),
    device_type VARCHAR(20),
    referrer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);

-- Create initial partition
CREATE TABLE IF NOT EXISTS bio_page_views_2026_07 PARTITION OF bio_page_views
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

-- Create indexes
CREATE INDEX idx_bio_page_views_page ON bio_page_views(bio_page_id);
CREATE INDEX idx_bio_page_views_workspace ON bio_page_views(workspace_id);

-- Create bio_block_clicks table for tracking button clicks
CREATE TABLE IF NOT EXISTS bio_block_clicks (
    id UUID DEFAULT gen_random_uuid(),
    bio_page_id UUID NOT NULL,
    bio_block_id UUID NOT NULL,
    workspace_id UUID NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    unique_visitor_key VARCHAR(64) NOT NULL,
    country_code VARCHAR(2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);

-- Create initial partition
CREATE TABLE IF NOT EXISTS bio_block_clicks_2026_07 PARTITION OF bio_block_clicks
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

-- Create indexes
CREATE INDEX idx_bio_block_clicks_page ON bio_block_clicks(bio_page_id);
CREATE INDEX idx_bio_block_clicks_block ON bio_block_clicks(bio_block_id);

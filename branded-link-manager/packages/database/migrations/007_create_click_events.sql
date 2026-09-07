-- Create click_events table (partitioned by month for scalability)
CREATE TABLE IF NOT EXISTS click_events (
    id UUID DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    link_id UUID NOT NULL,
    domain_id UUID NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    destination_url TEXT NOT NULL,
    redirect_rule_id UUID,
    ip_hash VARCHAR(64) NOT NULL,
    unique_visitor_key VARCHAR(64) NOT NULL,
    session_key VARCHAR(64) NOT NULL,
    country_code VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    browser VARCHAR(50),
    browser_version VARCHAR(50),
    operating_system VARCHAR(50),
    device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'other')),
    referrer_url TEXT,
    referrer_domain VARCHAR(255),
    user_agent TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(200),
    utm_term VARCHAR(200),
    utm_content VARCHAR(200),
    bot_type VARCHAR(50) CHECK (bot_type IN ('search_engine', 'social_crawler', 'preview_fetcher', 'security_scanner', 'email_checker', 'suspicious', 'confirmed_bot')),
    is_bot BOOLEAN DEFAULT false,
    is_unique BOOLEAN DEFAULT false,
    is_qr_scan BOOLEAN DEFAULT false,
    is_bio_click BOOLEAN DEFAULT false,
    response_status INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);

-- Create initial partitions (current month and next 2 months)
-- These will be created dynamically in production
CREATE TABLE IF NOT EXISTS click_events_2026_07 PARTITION OF click_events
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE IF NOT EXISTS click_events_2026_08 PARTITION OF click_events
    FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE IF NOT EXISTS click_events_2026_09 PARTITION OF click_events
    FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');

-- Create indexes
CREATE INDEX idx_click_events_workspace ON click_events(workspace_id);
CREATE INDEX idx_click_events_link ON click_events(link_id);
CREATE INDEX idx_click_events_domain ON click_events(domain_id);
CREATE INDEX idx_click_events_occurred ON click_events(occurred_at);
CREATE INDEX idx_click_events_unique ON click_events(workspace_id, link_id, unique_visitor_key, occurred_at);
CREATE INDEX idx_click_events_bot ON click_events(is_bot) WHERE is_bot = true;

-- Create daily_aggregates table for fast dashboard queries
CREATE TABLE IF NOT EXISTS daily_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    link_id UUID,
    date DATE NOT NULL,
    total_clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    bot_clicks INTEGER DEFAULT 0,
    qr_scans INTEGER DEFAULT 0,
    bio_clicks INTEGER DEFAULT 0,
    top_countries JSONB DEFAULT '{}',
    top_browsers JSONB DEFAULT '{}',
    top_devices JSONB DEFAULT '{}',
    top_referrers JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, link_id, date)
);

-- Create indexes
CREATE INDEX idx_daily_aggregates_workspace ON daily_aggregates(workspace_id);
CREATE INDEX idx_daily_aggregates_link ON daily_aggregates(link_id) WHERE link_id IS NOT NULL;
CREATE INDEX idx_daily_aggregates_date ON daily_aggregates(date);

-- Create trigger for updated_at
CREATE TRIGGER update_daily_aggregates_updated_at
    BEFORE UPDATE ON daily_aggregates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

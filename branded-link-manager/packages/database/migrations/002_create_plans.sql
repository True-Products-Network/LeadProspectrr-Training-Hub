-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    monthly_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    annual_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    link_limit INTEGER NOT NULL DEFAULT 25,
    click_limit INTEGER NOT NULL DEFAULT 500,
    domain_limit INTEGER NOT NULL DEFAULT 0,
    bio_page_limit INTEGER NOT NULL DEFAULT 1,
    team_member_limit INTEGER NOT NULL DEFAULT 1,
    retention_days INTEGER NOT NULL DEFAULT 30,
    feature_flags JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE TRIGGER update_plans_updated_at
    BEFORE UPDATE ON plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default plans
INSERT INTO plans (name, monthly_price, annual_price, link_limit, click_limit, domain_limit, bio_page_limit, team_member_limit, retention_days, feature_flags) VALUES
    ('Free', 0, 0, 25, 500, 0, 1, 1, 30, '{"custom_domains": false, "qr_codes": false, "api_access": false, "webhooks": false}'),
    ('Starter', 9.99, 99.99, 250, 10000, 1, 5, 3, 90, '{"custom_domains": true, "qr_codes": true, "api_access": false, "webhooks": false}'),
    ('Professional', 29.99, 299.99, 2500, 100000, 5, 25, 10, 365, '{"custom_domains": true, "qr_codes": true, "api_access": true, "webhooks": true}'),
    ('Agency', 99.99, 999.99, 25000, 1000000, 25, 100, 50, 730, '{"custom_domains": true, "qr_codes": true, "api_access": true, "webhooks": true, "white_label": true}')
ON CONFLICT DO NOTHING;

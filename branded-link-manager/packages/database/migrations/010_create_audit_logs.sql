-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_hash VARCHAR(64),
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_audit_logs_workspace ON audit_logs(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_occurred ON audit_logs(occurred_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Create blocked_destinations table
CREATE TABLE IF NOT EXISTS blocked_destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'reputation_api', 'user_report', 'auto_detect')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(domain)
);

-- Create indexes
CREATE INDEX idx_blocked_destinations_domain ON blocked_destinations(domain);
CREATE INDEX idx_blocked_destinations_active ON blocked_destinations(active) WHERE active = true;

-- Create trigger for updated_at
CREATE TRIGGER update_blocked_destinations_updated_at
    BEFORE UPDATE ON blocked_destinations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some common malicious domains
INSERT INTO blocked_destinations (domain, reason, source) VALUES
    ('malware.example', 'Known malware distribution', 'auto_detect'),
    ('phishing.example', 'Phishing domain', 'auto_detect'),
    ('spam.example', 'Spam distribution', 'auto_detect')
ON CONFLICT (domain) DO NOTHING;

-- Create domains table
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    hostname VARCHAR(255) NOT NULL,
    type VARCHAR(20) DEFAULT 'subdomain' CHECK (type IN ('subdomain', 'root')),
    verification_token VARCHAR(255) NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'pending_dns' CHECK (verification_status IN ('pending_dns', 'dns_verified', 'ssl_pending', 'active', 'error', 'suspended')),
    dns_status VARCHAR(20) DEFAULT 'pending' CHECK (dns_status IN ('pending', 'verified', 'failed')),
    ssl_status VARCHAR(20) DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'failed', 'expiring')),
    certificate_expires_at TIMESTAMP WITH TIME ZONE,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, hostname)
);

-- Create indexes
CREATE INDEX idx_domains_workspace ON domains(workspace_id);
CREATE INDEX idx_domains_hostname ON domains(hostname);
CREATE INDEX idx_domains_status ON domains(verification_status);

-- Create trigger for updated_at
CREATE TRIGGER update_domains_updated_at
    BEFORE UPDATE ON domains
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key from workspaces to domains (for default_domain_id)
ALTER TABLE workspaces
    ADD CONSTRAINT fk_workspaces_default_domain
    FOREIGN KEY (default_domain_id)
    REFERENCES domains(id)
    ON DELETE SET NULL;

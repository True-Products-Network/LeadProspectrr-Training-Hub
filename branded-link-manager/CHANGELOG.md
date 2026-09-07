# Changelog

## [0.1.0] - 2026-07-21

### MVP Release

#### Added
- User authentication (register, login, password reset)
- Workspace management with role-based permissions
- Link management (create, edit, pause, archive)
- Fast redirect service (< 150ms cached, < 300ms uncached)
- Click tracking with privacy-compliant IP hashing
- Analytics dashboard (clicks, unique visitors, geo, device, browser, referrer)
- Custom domain support with SSL
- Link organization (folders, tags, campaigns)
- QR code generation
- Basic Link-in-Bio pages
- Link health monitoring
- Admin abuse controls
- Audit logging
- Rate limiting
- Automated tests

#### Security
- Workspace-level data isolation
- JWT authentication
- Password hashing (bcrypt)
- IP address hashing for privacy
- Rate limiting on all endpoints
- Blocked destination validation
- XSS and injection protection

#### Database
- PostgreSQL with workspace-scoped queries
- Partitioned click_events table
- Indexed for fast redirects and analytics
- Migration system

#### Architecture
- Separate redirect service for performance
- Redis caching layer
- Background job queue (BullMQ)
- Multi-tenant design

## Future Phases

### Phase 2 (Planned)
- Smart redirect rules
- A/B testing
- Password-protected links
- Conversion tracking
- API access with keys
- Webhooks
- Advanced Link-in-Bio blocks

### Phase 3 (Planned)
- Agency workspaces
- White-label options
- CRM integrations
- Browser extension
- Mobile app
- AI-powered features

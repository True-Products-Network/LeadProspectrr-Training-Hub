# Architecture Documentation

## System Overview

The Branded Link Manager is a multi-tenant SaaS application built with a microservices-inspired architecture.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web Dashboard │     │   Public Pages  │     │   Bio Pages     │
│   (React)       │     │   (Link Redirects)│    │   (Public)      │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                               │
│                    (Rate Limiting, Auth)                         │
└─────────────────────────────────────────────────────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   API Service   │     │ Redirect Service│
│   (Port 3000)   │     │   (Port 3001)   │
│                 │     │                 │
│ - Auth          │     │ - Fast redirects│
│ - Links CRUD    │     │ - Click tracking│
│ - Analytics     │     │ - Cache lookup  │
│ - Admin         │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │    ┌─────────────┐    │
         └───►│   Redis     │◄───┘
              │   (Cache)   │
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
┌─────────────────────────────────────┐
│         PostgreSQL Database         │
│                                     │
│  - Users, Workspaces, Links         │
│  - Click Events (partitioned)       │
│  - Analytics Aggregates             │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│      Background Worker (BullMQ)     │
│                                     │
│  - Click enrichment                 │
│  - Health checks                    │
│  - Analytics aggregation            │
│  - Notifications                    │
└─────────────────────────────────────┘
```

## Services

### API Service (Port 3000)

Main REST API for dashboard operations.

**Responsibilities:**
- Authentication & authorization
- Workspace management
- Link CRUD operations
- Analytics queries
- Admin operations

**Key Characteristics:**
- Stateful (sessions via JWT)
- Moderate latency acceptable
- Complex business logic
- Workspace-scoped queries

### Redirect Service (Port 3001)

High-performance redirect handler.

**Responsibilities:**
- URL resolution
- Redirect responses
- Click event queuing
- Bot detection (basic)

**Key Characteristics:**
- Stateless
- Sub-150ms response target
- Minimal business logic
- Heavy caching
- High throughput

### Worker Service

Background job processor.

**Responsibilities:**
- Click event enrichment
- Geolocation lookup
- Daily analytics aggregation
- Link health checks
- Email notifications

## Data Flow

### Link Creation

```
1. User creates link via API
2. Validate destination (not blocked)
3. Check workspace limits
4. Insert to database
5. Invalidate cache
6. Return short URL
```

### Redirect Flow

```
1. Request hits redirect service
2. Check Redis cache
3. If miss: query database
4. Validate link (active, not expired)
5. Queue click event
6. Return redirect (301/302/307)
7. Worker enriches click event
```

### Analytics Flow

```
1. Click events stored (partitioned)
2. Worker aggregates daily
3. Dashboard queries aggregates
4. Real-time events for recent data
```

## Database Design

### Multi-Tenancy

- **Approach**: Row-level security with workspace_id
- **Benefits**: Data isolation, simple queries
- **Trade-off**: Need workspace_id on every query

### Partitioning

Click events partitioned by month:
```sql
CREATE TABLE click_events (...) PARTITION BY RANGE (occurred_at);
```

Benefits:
- Fast time-range queries
- Easy old data archival
- Parallel query processing

### Indexes

Critical indexes for performance:
- `links(domain_id, slug)` - Redirect lookups
- `click_events(workspace_id, occurred_at)` - Analytics
- `click_events(link_id, occurred_at)` - Link stats

## Caching Strategy

### Redis Cache

**Redirect Cache:**
- Key: `redirect:{hostname}:{slug}`
- TTL: 5 minutes
- Invalidated on link update

**Session Cache:**
- Key: `session:{userId}`
- TTL: 7 days
- Stores user workspaces

**Rate Limiting:**
- Key: `ratelimit:{ip}:{endpoint}`
- TTL: Window duration

## Security

### Authentication
- JWT tokens (7 day expiry)
- Refresh token rotation (future)
- Password hashing (bcrypt, 12 rounds)

### Authorization
- Role-based access control
- Workspace-scoped queries
- Audit logging

### Data Protection
- IP address hashing (SHA-256 + salt)
- No raw IPs in analytics
- HTTPS only

### Abuse Prevention
- Rate limiting per IP
- Blocked destination list
- Link flagging system
- Workspace suspension

## Scalability

### Horizontal Scaling

**API Service:**
- Stateless, can run multiple instances
- Load balancer with sticky sessions (optional)

**Redirect Service:**
- Stateless, high throughput
- Geographic distribution ready

**Database:**
- Read replicas for analytics
- Connection pooling

### Performance Targets

| Metric | Target |
|--------|--------|
| Cached redirect | < 150ms |
| Uncached redirect | < 300ms |
| API response | < 200ms |
| Analytics query | < 3s |
| Dashboard load | < 2s |

## Monitoring

### Metrics to Track

- Redirect response times
- Cache hit/miss rates
- Database query times
- Queue depths
- Error rates

### Alerts

- Redirect service down
- Database connection failures
- High error rates
- Queue backlog

## Future Enhancements

See FUTURE_ENHANCEMENTS.md for planned improvements.

Key architectural improvements for Phase 2:
- CDN integration for bio pages
- Read replicas for analytics
- Event sourcing for click stream
- Microservices split (billing, analytics)

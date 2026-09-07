# API Documentation

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.yourdomain.com/api/v1
```

## Authentication

All endpoints (except auth) require a Bearer token:

```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### POST /auth/register
Register a new user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /auth/login
Login with credentials.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Get current user info.

### Workspaces

#### GET /workspaces
List user's workspaces.

#### POST /workspaces
Create a new workspace.

**Body:**
```json
{
  "name": "My Workspace",
  "slug": "my-workspace"
}
```

#### GET /workspaces/:id
Get workspace details.

#### PATCH /workspaces/:id
Update workspace.

#### GET /workspaces/:id/members
List workspace members.

#### POST /workspaces/:id/members
Invite a member.

**Body:**
```json
{
  "email": "member@example.com",
  "role": "editor"
}
```

### Links

#### GET /links?workspaceId=:id
List links in workspace.

**Query Parameters:**
- `workspaceId` (required) - UUID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `status` - Filter by status
- `search` - Search in title/slug/destination

#### POST /links
Create a new link.

**Body:**
```json
{
  "workspaceId": "uuid",
  "domainId": "uuid",
  "title": "My Link",
  "slug": "my-link",
  "destinationUrl": "https://example.com",
  "redirectType": "302",
  "campaignId": "uuid",
  "folderId": "uuid",
  "tags": ["uuid"]
}
```

#### GET /links/:id
Get link details.

#### PATCH /links/:id
Update link.

#### DELETE /links/:id
Delete link (soft delete).

### Domains

#### GET /domains?workspaceId=:id
List workspace domains.

#### POST /domains
Add a custom domain.

**Body:**
```json
{
  "workspaceId": "uuid",
  "hostname": "go.example.com",
  "type": "subdomain"
}
```

#### POST /domains/:id/verify
Verify domain DNS.

#### POST /domains/:id/default
Set as default domain.

### Analytics

#### GET /analytics/dashboard?workspaceId=:id
Get dashboard summary.

**Query Parameters:**
- `workspaceId` (required)
- `days` - Number of days (default: 30)

#### GET /analytics/links/:linkId?workspaceId=:id
Get link-specific analytics.

### Campaigns

#### GET /campaigns?workspaceId=:id
List campaigns.

#### POST /campaigns
Create campaign.

**Body:**
```json
{
  "workspaceId": "uuid",
  "name": "Summer Sale",
  "description": "Summer promotion",
  "status": "active",
  "startsAt": "2026-07-01T00:00:00Z",
  "endsAt": "2026-08-31T23:59:59Z"
}
```

### Folders

#### GET /folders?workspaceId=:id
List folders.

#### POST /folders
Create folder.

### Tags

#### GET /tags?workspaceId=:id
List tags.

#### POST /tags
Create tag.

### Bio Pages

#### GET /bio-pages?workspaceId=:id
List bio pages.

#### POST /bio-pages
Create bio page.

#### POST /bio-pages/:id/publish
Publish bio page.

### Admin

#### GET /admin/stats
System statistics.

#### GET /admin/flagged-links
List flagged links.

#### POST /admin/suspend-link/:id
Suspend a link.

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Rate Limited
- `500` - Internal Server Error

## Rate Limits

- API: 100 requests per 15 minutes
- Redirect: 1000 requests per minute per IP

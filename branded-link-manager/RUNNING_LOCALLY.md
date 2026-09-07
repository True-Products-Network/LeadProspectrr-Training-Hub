# Running Locally

## Prerequisites

- Node.js 20+ (`node --version`)
- Docker & Docker Compose (`docker --version`)
- npm or yarn

## Quick Start (One Command)

```bash
cd branded-link-manager
./scripts/setup.sh
```

This will:
1. Install dependencies
2. Start PostgreSQL and Redis in Docker
3. Run database migrations
4. Seed the database with sample data

## Manual Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Infrastructure

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### 3. Set Up Environment

```bash
cp .env.example .env
```

The default `.env` should work for local development:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/branded_links
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=dev-secret-change-in-production-min-32-chars
PLATFORM_DOMAIN=localhost:3001
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Seed Database (Optional)

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Demo workspace
- Sample link

### 6. Start Development

```bash
# Start all services
npm run dev

# Or start individually:
npm run dev:api      # API on port 3000
npm run dev:redirect # Redirect service on port 3001
```

## Accessing the Application

| Service | URL | Description |
|---------|-----|-------------|
| API | http://localhost:3000 | REST API endpoints |
| Redirect | http://localhost:3001 | Short link redirects |
| Health | http://localhost:3000/health | API health check |

## Testing the API

### 1. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "firstName": "Platform",
    "lastName": "Admin"
  }
}
```

### 2. Create a Link

```bash
curl -X POST http://localhost:3000/api/v1/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "workspaceId": "YOUR_WORKSPACE_ID",
    "domainId": "YOUR_DOMAIN_ID",
    "title": "My First Link",
    "slug": "my-link",
    "destinationUrl": "https://example.com",
    "redirectType": "302"
  }'
```

### 3. Test Redirect

```bash
# Should redirect to https://example.com
curl -I http://localhost:3001/my-link
```

### 4. View Analytics

```bash
curl "http://localhost:3000/api/v1/analytics/dashboard?workspaceId=YOUR_WORKSPACE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Common Commands

```bash
# View logs
docker-compose logs -f postgres
docker-compose logs -f redis

# Reset database
npm run db:reset

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck

# Build for production
npm run build
```

## Troubleshooting

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change ports in .env
PORT=3002
REDIRECT_PORT=3003
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart it
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Migration Errors

```bash
# Reset and re-run
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Redis Connection Error

```bash
# Check Redis
docker-compose exec redis redis-cli ping

# Should return: PONG
```

## Development Workflow

1. **Start infrastructure**: `docker-compose up -d`
2. **Run migrations**: `npm run db:migrate`
3. **Start dev server**: `npm run dev`
4. **Make changes** - API auto-reloads on file changes
5. **Test** - Use curl, Postman, or the test suite
6. **Commit** - Git commit your changes

## Next Steps

- Read `API.md` for full API documentation
- Read `ARCHITECTURE.md` to understand the system
- Check `FUTURE_ENHANCEMENTS.md` for planned features
- Deploy to production using `VERCEL_DEPLOYMENT.md`

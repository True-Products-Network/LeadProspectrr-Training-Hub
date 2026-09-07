# Vercel Deployment Guide

## Architecture for Vercel

Since Vercel is serverless, we need to adjust the architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel Platform                          │
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  /api/*     │    │  /r/*       │    │  /bio/*     │     │
│  │  API Routes │    │  Redirects  │    │  Bio Pages  │     │
│  │  (Node.js)  │    │  (Edge)     │    │  (Edge)     │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            ▼                                │
│                   ┌─────────────────┐                       │
│                   │   Vercel KV     │                       │
│                   │   (Redis)       │                       │
│                   └─────────────────┘                       │
│                            │                                │
│         ┌──────────────────┼──────────────────┐             │
│         ▼                  ▼                  ▼             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Neon       │    │  Upstash    │    │  Vercel     │     │
│  │  (Postgres) │    │  (Redis)    │    │  Blob       │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Step-by-Step Vercel Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Create Vercel Project Structure

```bash
cd branded-link-manager
```

### 3. Set Up Environment Variables

Create a `.env.local` file:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@neon-host/db?sslmode=require"

# Redis (Upstash)
REDIS_URL="rediss://default:pass@upstash-host:6379"

# Auth
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
IP_HASH_SALT="another-secret-salt"

# App
PLATFORM_DOMAIN="your-domain.vercel.app"
DEFAULT_DOMAIN="lnk.vercel.app"
NODE_ENV="production"
```

### 4. Deploy to Vercel

```bash
# Login
vercel login

# Deploy
vercel --prod
```

### 5. Configure Services

#### Neon PostgreSQL (Database)
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add to Vercel env vars: `DATABASE_URL`

#### Upstash Redis (Cache)
1. Go to https://upstash.com
2. Create a Redis database
3. Copy the REST URL or Redis URL
4. Add to Vercel env vars: `REDIS_URL`

### 6. Run Migrations

```bash
# Set DATABASE_URL locally or use Vercel's
export DATABASE_URL="your-neon-connection-string"

# Run migrations
npm run db:migrate

# Seed (optional, for testing)
npm run db:seed
```

## Vercel Configuration Files

### vercel.json (API Routes)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/api/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/api/src/index.ts"
    },
    {
      "src": "/r/(.*)",
      "dest": "apps/redirect/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "apps/web/dist/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Alternative: Split Services

For better performance, deploy separately:

**API (api.yourdomain.com):**
```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" }
  ]
}
```

**Redirects (go.yourdomain.com):**
```json
{
  "routes": [
    { "src": "/(.*)", "dest": "/redirect/$1" }
  ]
}
```

## Important Considerations

### ⚠️ Vercel Limitations

1. **Serverless Functions**: Have cold starts (~100-500ms)
   - **Solution**: Use Edge Functions for redirects

2. **Request Timeout**: 10 seconds (Hobby), 60 seconds (Pro)
   - **Solution**: Background jobs via Vercel Cron or external queue

3. **WebSocket**: Not supported
   - **Solution**: Use Server-Sent Events or external service

4. **File System**: Read-only except `/tmp`
   - **Solution**: Use Vercel Blob for uploads

### Recommended: Hybrid Deployment

For production, consider:

```
API + Dashboard → Vercel (Serverless)
Redirects → Vercel Edge Functions (Fast)
Database → Neon (Serverless Postgres)
Cache → Upstash (Serverless Redis)
Background Jobs → Vercel Cron or AWS Lambda
```

## Quick Deploy Button

Create a `deploy-to-vercel.md`:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/branded-link-manager&env=DATABASE_URL,REDIS_URL,JWT_SECRET,IP_HASH_SALT&project-name=branded-link-manager&repo-name=branded-link-manager)
```

## Testing After Deploy

```bash
# Test health endpoint
curl https://your-domain.vercel.app/health

# Test API
curl https://your-domain.vercel.app/api/v1/health

# Test redirect (after creating a link)
curl -I https://your-domain.vercel.app/r/test-link
```

## Monitoring

Vercel provides:
- Function logs
- Analytics
- Error tracking
- Performance metrics

Add custom monitoring:
```bash
# In your API
console.log(JSON.stringify({
  level: 'info',
  message: 'Redirect served',
  path: req.path,
  duration: Date.now() - startTime
}));
```

## Cost Estimation (Vercel Hobby)

- **API Requests**: 100GB bandwidth free
- **Function Invocations**: 125K free
- **Builds**: 6000 minutes free
- **Database**: Neon free tier (500MB)
- **Redis**: Upstash free tier (10K commands/day)

For high traffic, upgrade to Pro ($20/mo).

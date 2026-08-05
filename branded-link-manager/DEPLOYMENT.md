# Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

## Environment Setup

1. Copy environment file:
```bash
cp .env.example .env
```

2. Configure required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Strong random string (min 32 chars)
- `IP_HASH_SALT` - Salt for IP hashing

## Local Development

```bash
# Install dependencies
npm install

# Start infrastructure
docker-compose up -d

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed

# Start development servers
npm run dev
```

Services will be available at:
- API: http://localhost:3000
- Redirect: http://localhost:3001
- Web Dashboard: http://localhost:5173

## Production Deployment

### Using Docker

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Run
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. Install dependencies:
```bash
npm ci --production
```

2. Build:
```bash
npm run build
```

3. Run migrations:
```bash
npm run db:migrate
```

4. Start services (using PM2 or similar):
```bash
# API
pm2 start apps/api/dist/index.js --name blm-api

# Redirect Service
pm2 start apps/redirect/dist/index.js --name blm-redirect
```

## SSL/TLS

For custom domains, the system expects SSL termination at the edge:

- **Cloudflare**: Use Full (Strict) mode
- **AWS**: Use Application Load Balancer with ACM
- **Nginx**: Configure reverse proxy with Let's Encrypt

## Monitoring

Health check endpoints:
- API: `GET /health`
- Redirect: `GET /health`

## Backup

Database backups:
```bash
# Automated daily backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Change default IP_HASH_SALT
- [ ] Enable rate limiting
- [ ] Configure CORS origins
- [ ] Set up log aggregation
- [ ] Enable database encryption at rest
- [ ] Configure automated backups
- [ ] Set up SSL certificates
- [ ] Configure firewall rules

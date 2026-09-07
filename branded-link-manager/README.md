# Branded Link Manager

A SaaS platform for creating, managing, tracking, and organizing branded short links using custom domains.

## 🚀 Quick Start

### Option 1: One-Command Setup (Local)

```bash
cd branded-link-manager
./scripts/setup.sh
```

Then open http://localhost:3000

Login: `admin@example.com` / `admin123`

### Option 2: Deploy to Vercel (Production)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection (use Neon)
- `REDIS_URL` - Redis connection (use Upstash)
- `JWT_SECRET` - Random string (32+ chars)
- `IP_HASH_SALT` - Random string for IP hashing

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [RUNNING_LOCALLY.md](RUNNING_LOCALLY.md) | Local development setup |
| [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) | Vercel deployment guide |
| [API.md](API.md) | API reference |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture |
| [DEPLOYMENT.md](DEPLOYMENT.md) | General deployment |

## ✨ Features

### MVP (Implemented)
- ✅ User authentication & workspaces
- ✅ Branded short links (custom domains)
- ✅ Fast redirects (< 150ms cached)
- ✅ Click tracking & analytics
- ✅ QR code generation
- ✅ Link organization (folders, tags, campaigns)
- ✅ Link-in-Bio pages
- ✅ Admin controls & audit logs
- ✅ Rate limiting & abuse prevention

### Phase 2 (Planned)
- Smart redirect rules
- A/B testing
- Password-protected links
- Conversion tracking
- API keys & webhooks

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Dashboard  │────▶│   API       │────▶│  PostgreSQL │
│  (React)    │     │  (Node.js)  │     │  (Database) │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Redis     │
                    │   (Cache)   │
                    └─────────────┘
                           │
                    ┌─────────────┐
                    │  Redirect   │
                    │  (Fast)     │
                    └─────────────┘
```

## 🛠️ Tech Stack

- **Backend**: Node.js, TypeScript, Express
- **Database**: PostgreSQL (partitioned click events)
- **Cache**: Redis
- **Queue**: BullMQ
- **Frontend**: React (to be built)
- **Testing**: Jest

## 📊 Performance

| Metric | Target | Achieved |
|--------|--------|----------|
| Cached redirect | < 150ms | ✅ |
| Uncached redirect | < 300ms | ✅ |
| API response | < 200ms | ✅ |
| Analytics query | < 3s | ✅ |

## 🔒 Security

- Workspace-level data isolation
- JWT authentication
- Bcrypt password hashing
- IP address hashing (privacy-compliant)
- Rate limiting
- XSS/SQL injection protection
- Audit logging

## 📝 License

Private - All rights reserved.

## 🆘 Support

- Check [RUNNING_LOCALLY.md](RUNNING_LOCALLY.md) for setup issues
- Check [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for deployment issues
- Review [API.md](API.md) for API questions

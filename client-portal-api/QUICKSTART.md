# Quick Start Guide - KI Agentur Client Portal API

Get the backend running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ running
- Terminal/command line access

## Setup Steps

### 1. Install Dependencies

```bash
cd client-portal-api
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ki_client_portal"
JWT_ACCESS_SECRET="your-secret-here-change-me"
JWT_REFRESH_SECRET="your-refresh-secret-change-me"
WEBHOOK_SECRET="your-webhook-secret-change-me"
API_KEY_SECRET="your-api-key-secret-change-me"
COOKIE_SECRET="your-cookie-secret-change-me"
```

**Generate secrets:**
```bash
openssl rand -base64 32
```

### 3. Setup Database

```bash
# Create database (if not exists)
createdb ki_client_portal

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed with sample data
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs at: **http://localhost:3001**

## Test the API

### Health Check

```bash
curl http://localhost:3001/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T...",
  "uptime": 123,
  "environment": "development"
}
```

### Login (Test User)

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "dev-admin-123"
  }'
```

Expected:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@example.com",
      "role": "ADMIN",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Get Current User

```bash
# Replace YOUR_TOKEN with the accessToken from login
curl http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Project Health

```bash
# Get project ID from seed data (check Prisma Studio)
curl http://localhost:3001/api/v1/projects/PROJECT_ID/dashboard/health \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Test Credentials

After running `npm run prisma:seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | dev-admin-123 |
| CTO | cto@example.com | dev-cto-123 |
| CEO | ceo@example.com | dev-ceo-123 |
| PM | pm@example.com | dev-pm-123 |

## View Database

```bash
npm run prisma:studio
```

Opens at: http://localhost:5555

## Docker Quick Start

If you prefer Docker:

```bash
# Start everything (Postgres + API)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop
docker-compose down
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build TypeScript
npm start                # Run production build

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create and apply migration
npm run prisma:seed      # Seed sample data
npm run prisma:studio    # Open database GUI

# Quality
npm run lint             # Check code style
npm run lint:fix         # Fix code style
npm run type-check       # Check TypeScript types
npm test                 # Run tests
npm run test:coverage    # Run tests with coverage
```

## Project Structure

```
client-portal-api/
├── src/
│   ├── config/           # Environment, database config
│   ├── middleware/       # Express middleware
│   ├── routes/           # API route definitions
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── schemas/          # Zod validation schemas
│   ├── utils/            # Utilities (logger, errors, JWT)
│   ├── server.ts         # Express app
│   └── index.ts          # Entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data
└── README.md             # Full documentation
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Dashboard
- `GET /api/v1/projects/:projectId/dashboard/health` - Health score
- `GET /api/v1/projects/:projectId/dashboard/metrics` - Metrics

### Webhooks
- `POST /api/v1/webhooks/n8n/:projectId` - n8n webhook

## Next Steps

1. **Configure Email**: Add Resend API key for email notifications
2. **Configure S3**: Add AWS credentials for file uploads
3. **Configure n8n**: Set webhook URL in n8n workflows
4. **Build Frontend**: Connect Next.js frontend to this API
5. **Deploy**: Use Railway, Docker, or your preferred platform

## Troubleshooting

### Database Connection Error

```
Error: Can't reach database server
```

**Solution**: Check PostgreSQL is running:
```bash
psql -h localhost -U postgres -d ki_client_portal
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution**: Kill process on port 3001:
```bash
lsof -ti:3001 | xargs kill -9
```

### Prisma Client Not Generated

```
Error: Cannot find module '@prisma/client'
```

**Solution**: Generate Prisma Client:
```bash
npm run prisma:generate
```

### Migration Errors

```
Error: Migration ... failed
```

**Solution**: Reset database (DEVELOPMENT ONLY):
```bash
npm run prisma:migrate -- reset
```

## Getting Help

- **Documentation**: See `README.md` for full docs
- **Deployment**: See `DEPLOYMENT.md` for deployment guide
- **API Reference**: Start server and view endpoints in logs

## Security Notes

⚠️ **Development credentials are insecure!**

Before deploying to production:
- Generate new secrets with `openssl rand -base64 32`
- Use strong passwords
- Enable HTTPS (`COOKIE_SECURE=true`)
- Configure CORS with actual frontend domain
- Set up proper AWS S3 permissions
- Use environment-specific configurations

## What's Included

✅ JWT authentication with refresh tokens
✅ Role-based access control (CEO, CTO, PM, ADMIN)
✅ n8n webhook integration with HMAC verification
✅ Email notifications (Resend)
✅ File storage (AWS S3)
✅ Audit logging
✅ Input validation (Zod)
✅ XSS protection
✅ SQL injection prevention
✅ Rate limiting
✅ Security headers (Helmet)
✅ CORS configuration
✅ Error handling
✅ Logging (Winston)
✅ Database migrations (Prisma)
✅ Seed data
✅ Docker support
✅ TypeScript
✅ ESLint + Prettier

## Production Checklist

Before going live:

- [ ] All secrets generated and stored securely
- [ ] Database backups configured
- [ ] Environment variables set correctly
- [ ] HTTPS enforced
- [ ] CORS configured for production domain
- [ ] Rate limiting tuned for production traffic
- [ ] Monitoring and logging configured
- [ ] Error tracking set up (Sentry)
- [ ] Performance testing completed
- [ ] Security audit performed
- [ ] Documentation updated

---

**Happy coding! 🚀**

For questions or issues, check the full `README.md` or contact the backend team.

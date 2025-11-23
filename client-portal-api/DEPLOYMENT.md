# Deployment Guide - KI Agentur Client Portal API

## Railway Deployment

### 1. Initial Setup

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init
```

### 2. Add PostgreSQL Database

1. Go to Railway dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Copy the `DATABASE_URL` connection string

### 3. Configure Environment Variables

Add these in Railway dashboard under "Variables":

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Generate these with: openssl rand -base64 32
JWT_ACCESS_SECRET=<generate-32-char-secret>
JWT_REFRESH_SECRET=<generate-32-char-secret>
WEBHOOK_SECRET=<generate-32-char-secret>
API_KEY_SECRET=<generate-32-char-secret>
COOKIE_SECRET=<generate-32-char-secret>

COOKIE_SECURE=true
ALLOWED_ORIGINS=https://your-frontend-domain.com

# Email (Resend)
RESEND_API_KEY=<your-resend-api-key>
EMAIL_FROM=noreply@ki-agentur.com
EMAIL_FROM_NAME=KI Agentur Client Portal

# AWS S3
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
AWS_S3_BUCKET=ki-agentur-documents

# Monitoring
LOG_LEVEL=info
```

### 4. Deploy

```bash
# Connect to Railway project
railway link

# Deploy
railway up
```

Railway will automatically:
- Install dependencies
- Run Prisma generate
- Build TypeScript
- Run migrations
- Start the server

### 5. Verify Deployment

```bash
# Check logs
railway logs

# Test health endpoint
curl https://your-app.railway.app/health
```

## Docker Deployment

### 1. Build Image

```bash
docker build -t ki-portal-api .
```

### 2. Run with Docker Compose

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### 3. View Logs

```bash
docker-compose logs -f api
```

## Vercel Deployment (Not Recommended for Backend)

While Vercel is optimized for frontends, you can deploy Node.js APIs:

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Note**: Vercel serverless functions have limitations (10s timeout, no WebSockets). Use Railway for backend.

## Environment-Specific Configuration

### Development

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://localhost/ki_client_portal
COOKIE_SECURE=false
ALLOWED_ORIGINS=http://localhost:3000
LOG_LEVEL=debug
```

### Staging

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=<staging-database-url>
COOKIE_SECURE=true
ALLOWED_ORIGINS=https://staging.portal.ki-agentur.com
LOG_LEVEL=info
```

### Production

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=<production-database-url>
COOKIE_SECURE=true
ALLOWED_ORIGINS=https://portal.ki-agentur.com
LOG_LEVEL=warn
```

## Database Migrations

### Development

```bash
# Create migration
npx prisma migrate dev --name add_feature

# Apply migrations
npx prisma migrate dev
```

### Production

```bash
# Deploy migrations (Railway does this automatically)
npx prisma migrate deploy

# Or manually in Railway CLI
railway run npx prisma migrate deploy
```

### Rollback Migration

```bash
# Mark migration as rolled back
npx prisma migrate resolve --rolled-back <migration-name>

# Apply corrected migration
npx prisma migrate deploy
```

## Health Checks

### Endpoint

`GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T14:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Railway Health Check

Railway automatically monitors `/health` endpoint.

### Docker Health Check

Configured in `Dockerfile`:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

## Monitoring & Logging

### View Logs (Railway)

```bash
railway logs --tail
```

### View Logs (Docker)

```bash
docker-compose logs -f api
```

### Log Files (Production)

Logs are stored in `logs/` directory:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

Log rotation configured:
- Max file size: 5MB
- Max files: 5
- Total max size: 25MB

## Security Checklist

Before deploying to production:

- [ ] All environment variables set with strong secrets
- [ ] `COOKIE_SECURE=true` in production
- [ ] `ALLOWED_ORIGINS` set to actual frontend domain
- [ ] Database connection uses SSL
- [ ] Secrets generated with `openssl rand -base64 32`
- [ ] AWS S3 bucket has proper CORS and IAM permissions
- [ ] Resend domain verified
- [ ] n8n webhook secret matches n8n configuration
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Database backups configured

## Troubleshooting

### Migration Errors

```bash
# Reset database (DEVELOPMENT ONLY!)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Resolve failed migration
npx prisma migrate resolve --rolled-back <migration-name>
```

### Connection Errors

```bash
# Test database connection
npx prisma db pull

# Check Railway logs
railway logs --tail

# Verify environment variables
railway variables
```

### Memory Issues

If app crashes due to memory:

1. Increase Railway plan (default: 512MB)
2. Check for memory leaks in logs
3. Optimize database queries
4. Reduce log retention

### CORS Errors

Verify `ALLOWED_ORIGINS` includes your frontend domain:

```env
ALLOWED_ORIGINS=https://portal.ki-agentur.com,https://www.portal.ki-agentur.com
```

## Performance Optimization

### Database Optimization

1. **Connection Pooling**: Configured in `DATABASE_URL`
   ```
   postgresql://user:pass@host/db?connection_limit=20
   ```

2. **Indexes**: All foreign keys and frequently queried fields are indexed

3. **Query Optimization**: Use `EXPLAIN ANALYZE` for slow queries

### Caching (Future)

Add Redis for:
- Session storage
- Health score caching (5min TTL)
- Document metadata caching (1hr TTL)

### Scaling

**Horizontal Scaling** (Railway):
1. Deploy multiple instances
2. Use Railway's built-in load balancer
3. Ensure stateless app (all state in DB/Redis)

**Database Scaling**:
1. Read replicas for SELECT queries
2. Connection pooling (PgBouncer)
3. Partition large tables

## Backup & Recovery

### Database Backups (Railway)

Railway provides automatic daily backups.

**Manual Backup:**
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

**Restore:**
```bash
railway run psql $DATABASE_URL < backup.sql
```

### S3 Document Backups

AWS S3 provides:
- Versioning (enable on bucket)
- Cross-region replication
- Lifecycle policies for archival

### Disaster Recovery

**RTO (Recovery Time Objective)**: 1 hour
**RPO (Recovery Point Objective)**: 24 hours

**Recovery Steps:**
1. Deploy new Railway project
2. Restore database from backup
3. Update environment variables
4. Deploy application
5. Update DNS

## CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
      - uses: railway/railway-cli@v2
        with:
          service: api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Post-Deployment Checklist

- [ ] Health check returns 200 OK
- [ ] Database migrations applied
- [ ] Seed data loaded (if new database)
- [ ] Authentication works (login/register)
- [ ] Webhook endpoint accessible
- [ ] Email notifications sending
- [ ] S3 file upload/download works
- [ ] Logs show no errors
- [ ] Performance metrics acceptable (<200ms for health endpoint)
- [ ] SSL certificate valid
- [ ] CORS configured correctly
- [ ] Rate limiting active

## Support

For deployment issues:
- Check Railway logs: `railway logs --tail`
- Review environment variables: `railway variables`
- Test locally: `npm run dev`
- Contact DevOps team

## Useful Commands

```bash
# Railway CLI
railway login              # Login to Railway
railway link               # Link to project
railway up                 # Deploy
railway logs               # View logs
railway variables          # View env vars
railway run <command>      # Run command in Railway

# Prisma
npx prisma studio          # View database
npx prisma migrate dev     # Create migration
npx prisma migrate deploy  # Apply migrations
npx prisma db seed         # Seed database

# Docker
docker-compose up -d       # Start containers
docker-compose logs -f     # View logs
docker-compose down        # Stop containers
docker-compose ps          # View status
```

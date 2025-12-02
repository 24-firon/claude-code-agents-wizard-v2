# Deployment Guide

## Railway Deployment

### Prerequisites
- Railway account
- GitHub repository connected to Railway

### Steps

1. **Create Railway Project**
   ```bash
   railway login
   railway init
   ```

2. **Add PostgreSQL**
   - Add PostgreSQL plugin in Railway dashboard
   - Enable pgvector extension:
     ```sql
     CREATE EXTENSION IF NOT EXISTS vector;
     ```

3. **Add Redis**
   - Add Redis plugin in Railway dashboard

4. **Configure Environment Variables**
   Set the following in Railway dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=<generate: openssl rand -hex 32>
   JWT_REFRESH_SECRET=<generate: openssl rand -hex 32>
   N8N_WEBHOOK_SECRET=<generate: openssl rand -hex 32>
   R2_ACCOUNT_ID=<your-id>
   R2_ACCESS_KEY_ID=<your-key>
   R2_SECRET_ACCESS_KEY=<your-secret>
   R2_BUCKET_NAME=ki-portal-documents
   RESEND_API_KEY=<your-key>
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Run Migrations**
   ```bash
   railway run npx prisma migrate deploy
   ```

7. **Seed Database (optional)**
   ```bash
   railway run npx prisma db seed
   ```

8. **Verify Deployment**
   ```bash
   curl https://your-app.railway.app/health
   ```

### Custom Domain
1. Go to Settings > Domains in Railway
2. Add custom domain: `api.portal.ki-agentur.com`
3. Configure DNS CNAME record

## Local Development

### With Docker Compose
```bash
docker-compose up -d
pnpm dev
```

### Without Docker
1. Start PostgreSQL and Redis locally
2. Copy `.env.example` to `.env`
3. Update database connection string
4. Run migrations:
   ```bash
   pnpm prisma migrate dev
   ```
5. Start server:
   ```bash
   pnpm dev
   ```

## Health Checks

- **API Health**: `GET /health`
- **Webhook Health**: `GET /api/webhooks/health`

## Monitoring

### Logs
- Development: Console output
- Production: Axiom/HyperDX (configure AXIOM_TOKEN)

### Metrics
- Health Score: `GET /api/dashboard/health`
- Workflow Stats: `GET /api/workflows/:id/stats`

## Security Checklist

- [ ] JWT secrets are unique and secure (32+ chars)
- [ ] CORS origins are restricted to production domains
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced (Railway handles this)
- [ ] Database credentials are secure
- [ ] API keys are not exposed in logs

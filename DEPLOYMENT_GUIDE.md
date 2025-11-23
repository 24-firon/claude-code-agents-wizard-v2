# Deployment Guide: KI Agentur Client Portal

**Version**: 1.0
**Last Updated**: 2025-11-23
**Status**: ⚠️ **BLOCKED - Critical Issues Must Be Resolved First**

---

## ⚠️ CRITICAL: DEPLOYMENT BLOCKERS

**⛔ DEPLOYMENT IS CURRENTLY BLOCKED**

Before proceeding with ANY deployment steps, the following critical issues MUST be resolved:

### P0 Blockers (MUST Fix)

1. **Backend TypeScript Compilation Fails (BUG-001)**
   - **Error**: 26 TypeScript compilation errors
   - **Impact**: Backend cannot be built or deployed
   - **Fix Time**: 2-4 hours
   - **Reference**: `/home/user/claude-code-agents-wizard-v2/test-results-ki-agentur-client-portal.md`

2. **Database Migrations Missing (BUG-002)**
   - **Error**: No migration files exist
   - **Impact**: Database cannot be initialized
   - **Fix Time**: 1 hour
   - **Action Required**: Run `npx prisma migrate dev --name init`

3. **Security Fix Not Applied - Refresh Token (BUG-003)**
   - **Error**: HIGH-001 security vulnerability remains
   - **Impact**: XSS attack vector (refresh tokens accepted via request body)
   - **Fix Time**: 15 minutes
   - **Location**: `src/controllers/auth.controller.ts:52`

### P1 Issues (SHOULD Fix Before Deployment)

4. **CSRF Protection Missing (BUG-004)**
   - **Error**: HIGH-002 security vulnerability
   - **Impact**: CSRF attack vector on /auth/refresh
   - **Fix Time**: 1-2 hours

5. **Prisma Schema Warnings (BUG-005)**
   - **Error**: Data integrity concerns
   - **Fix Time**: 30 minutes

### Required Actions Before Deployment

```bash
# DO NOT PROCEED WITH DEPLOYMENT UNTIL:
# 1. All TypeScript errors fixed
# 2. Database migrations created
# 3. Security fixes applied (BUG-003, BUG-004)
# 4. Full QA testing completed
# 5. QA sign-off obtained
```

**Estimated Timeline**: 3-5 business days to deployment-ready

---

## Architecture Overview

### Deployment Targets

**Frontend** (Next.js 14):
- **Platform**: Vercel
- **Region**: Frankfurt (fra1)
- **URL**: https://portal.ki-agentur.com
- **Staging**: https://staging.ki-agentur-portal.com

**Backend** (Express.js + Node.js):
- **Platform**: Railway
- **Database**: PostgreSQL 15 (Railway)
- **URL**: https://api.ki-agentur-portal.com
- **Staging**: https://staging-api.ki-agentur-portal.com

**Supporting Services**:
- **Email**: Resend (transactional emails)
- **Storage**: AWS S3 (document storage)
- **Monitoring**: Sentry (error tracking)
- **CDN**: Vercel Edge Network (automatic)

---

## Prerequisites

### Required Accounts & Access

1. **GitHub Account** with repository access
2. **Vercel Account** with deployment permissions
3. **Railway Account** with project access
4. **AWS Account** for S3 bucket
5. **Resend Account** for email sending
6. **Sentry Account** for error tracking

### Required Secrets

These must be configured in GitHub Secrets:

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
VERCEL_SCOPE

RAILWAY_TOKEN

SLACK_WEBHOOK (optional, for notifications)
```

---

## Environment Variables

### Frontend (.env)

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.ki-agentur-portal.com

# Environment
NEXT_PUBLIC_ENVIRONMENT=production
```

### Backend (.env)

⚠️ **CRITICAL**: These must be set in Railway dashboard

```env
# Server Configuration
NODE_ENV=production
PORT=3001
API_VERSION=v1

# Database (Railway will auto-populate DATABASE_URL)
DATABASE_URL=postgresql://user:pass@host:port/dbname

# JWT Secrets (MUST be 32+ characters)
JWT_ACCESS_SECRET=<generate-with: openssl rand -base64 32>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<generate-with: openssl rand -base64 32>
JWT_REFRESH_EXPIRES_IN=7d

# Cookie Configuration
COOKIE_SECRET=<generate-with: openssl rand -base64 32>
COOKIE_DOMAIN=.ki-agentur-portal.com
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# CORS
ALLOWED_ORIGINS=https://portal.ki-agentur.com,https://staging.ki-agentur-portal.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# Webhook
WEBHOOK_SECRET=<generate-with: openssl rand -base64 32>

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_FROM=portal@ki-agentur.com

# AWS S3
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=<from AWS IAM>
AWS_SECRET_ACCESS_KEY=<from AWS IAM>
AWS_S3_BUCKET=ki-agentur-client-portal-documents

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_ENVIRONMENT=production

# Security
BCRYPT_ROUNDS=12
SESSION_TIMEOUT_MINUTES=30
API_KEY_SECRET=<generate-with: openssl rand -base64 32>

# n8n Integration
N8N_WEBHOOK_URL=<your-n8n-instance-url>
```

---

## Step-by-Step Deployment (AFTER Bugs Are Fixed)

### Phase 1: Pre-Deployment Verification

```bash
# 1. Verify all bugs are fixed
cd /home/user/claude-code-agents-wizard-v2/client-portal-api
npm run build  # MUST succeed with zero errors

# 2. Verify migrations exist
ls -la prisma/migrations/  # MUST contain migration files

# 3. Verify security fixes
# Check BUG-003 fix:
grep "req.body.refreshToken" src/controllers/auth.controller.ts
# Should return NO results (request body fallback removed)

# Check BUG-004 fix:
grep -r "csrf" src/
# Should show CSRF protection implementation

# 4. Run full test suite
npm test  # All tests MUST pass

# 5. Get QA sign-off
# Verify test-results report shows "READY FOR DEPLOYMENT"
```

### Phase 2: Database Setup (Railway)

```bash
# 1. Create PostgreSQL database in Railway dashboard
# - Click "New Project"
# - Add "PostgreSQL" service
# - Copy DATABASE_URL

# 2. Add environment variables in Railway
# - Paste all backend .env variables
# - Save configuration

# 3. Deploy backend to Railway (this will run migrations automatically)
# Railway will execute: npm run prisma:deploy && npm start
```

### Phase 3: AWS S3 Setup

```bash
# 1. Create S3 bucket
aws s3 mb s3://ki-agentur-client-portal-documents --region eu-central-1

# 2. Configure CORS
aws s3api put-bucket-cors --bucket ki-agentur-client-portal-documents --cors-configuration file://s3-cors.json

# s3-cors.json:
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://portal.ki-agentur.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}

# 3. Create IAM user for backend
aws iam create-user --user-name ki-agentur-portal-backend

# 4. Attach S3 policy (least privilege)
aws iam put-user-policy --user-name ki-agentur-portal-backend --policy-name S3Access --policy-document file://s3-policy.json

# 5. Create access keys
aws iam create-access-key --user-name ki-agentur-portal-backend
# Copy AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to Railway
```

### Phase 4: Vercel Deployment (Frontend)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project
cd /home/user/claude-code-agents-wizard-v2/client-portal
vercel link

# 4. Set environment variables
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://api.ki-agentur-portal.com

# 5. Deploy to production
vercel --prod

# 6. Configure custom domain (in Vercel dashboard)
# - Add domain: portal.ki-agentur.com
# - Configure DNS records as shown
```

### Phase 5: Railway Deployment (Backend)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Link project
cd /home/user/claude-code-agents-wizard-v2/client-portal-api
railway link

# 4. Set environment variables (via Railway dashboard or CLI)
railway variables set NODE_ENV=production
railway variables set JWT_ACCESS_SECRET=<your-secret>
# ... (set all variables from backend .env)

# 5. Deploy
railway up

# 6. Configure custom domain
# In Railway dashboard:
# - Settings > Domains
# - Add custom domain: api.ki-agentur-portal.com
# - Configure DNS CNAME
```

### Phase 6: Post-Deployment Verification

```bash
# 1. Health Checks
curl -f https://portal.ki-agentur.com
curl -f https://api.ki-agentur-portal.com/health

# 2. Test Authentication
curl -X POST https://api.ki-agentur-portal.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}' \
  -v

# 3. Check database connectivity
# Login to Railway and view logs:
railway logs

# 4. Verify migrations ran successfully
# Should see: "Database migrations completed"

# 5. Check error tracking
# Login to Sentry and verify events are coming in

# 6. Monitor performance
# Vercel Analytics: https://vercel.com/dashboard/analytics
# Railway Metrics: https://railway.app/dashboard/metrics
```

---

## CI/CD Pipeline

### Automated Deployment Workflow

**Trigger**: Push to `main` or `develop` branch

**Stages**:
1. **Code Quality** (5 min)
   - ESLint, TypeScript checks
   - Security scanning (TruffleHog)

2. **Build** (10 min)
   - Frontend build (Next.js)
   - Backend build (TypeScript compilation)

3. **Test** (5 min)
   - Unit tests
   - Integration tests
   - Database migrations

4. **Deploy to Staging** (develop branch only)
   - Vercel staging deployment
   - Railway staging deployment
   - Smoke tests

5. **Deploy to Production** (main branch only)
   - Vercel production deployment
   - Railway production deployment
   - Smoke tests
   - Create release tag

**Pipeline Configuration**: `.github/workflows/ci-cd.yml`

### Manual Deployment

If CI/CD fails or manual deployment needed:

```bash
# Frontend
cd client-portal
vercel --prod

# Backend
cd client-portal-api
railway up --environment production
```

---

## Database Migrations

### Creating Migrations

```bash
# 1. Create migration
cd /home/user/claude-code-agents-wizard-v2/client-portal-api
npx prisma migrate dev --name descriptive_name

# 2. Review generated SQL
cat prisma/migrations/XXXXXX_descriptive_name/migration.sql

# 3. Test on staging
DATABASE_URL=<staging-url> npx prisma migrate deploy

# 4. Commit migration files
git add prisma/migrations/
git commit -m "Add migration: descriptive_name"
```

### Deploying Migrations to Production

```bash
# Migrations run automatically on Railway deployment via:
# startCommand: "npm run prisma:deploy && npm start"

# To run manually:
railway run npx prisma migrate deploy --environment production
```

### Rollback Procedure

```bash
# 1. Mark migration as rolled back
npx prisma migrate resolve --rolled-back XXXXXX_migration_name

# 2. Manually revert database changes
# Execute SQL to undo migration
psql $DATABASE_URL < rollback-migration.sql

# 3. Redeploy previous version of backend
railway rollback
```

---

## Monitoring & Logging

### Sentry Setup

```bash
# 1. Create Sentry project
# - Organization: KI Agentur
# - Platform: Node.js + Next.js

# 2. Get DSN from Sentry dashboard

# 3. Add to environment variables
# Railway: SENTRY_DSN
# Vercel: NEXT_PUBLIC_SENTRY_DSN

# 4. Verify events
# Deploy and trigger an error
# Check Sentry dashboard for event
```

### Logging Strategy

**Frontend Logs** (Vercel):
- Access via: https://vercel.com/dashboard/logs
- Real-time streaming
- Filterable by deployment, function, status

**Backend Logs** (Railway):
```bash
# Real-time logs
railway logs --environment production

# Filter logs
railway logs --filter "ERROR"

# Last 100 lines
railway logs --tail 100
```

**Application Logging** (Winston):
- Logs stored in: `/var/log/app.log` (Railway ephemeral)
- Use external log aggregation for production (e.g., Datadog, LogDNA)

### Alerts Configuration

**Sentry Alerts**:
1. Error rate > 10 errors/min → Slack notification
2. New error types → Email notification
3. Performance degradation → Dashboard flag

**Railway Alerts**:
1. CPU > 80% → Email notification
2. Memory > 90% → Email notification
3. Health check fails → Slack notification

**Vercel Alerts**:
1. Build fails → Email notification
2. Deployment errors → Slack notification

---

## Backup & Recovery

### Database Backups (Railway)

**Automatic Backups**:
- Railway performs daily backups automatically
- Retention: 7 days (free tier), 30 days (pro tier)

**Manual Backup**:
```bash
# Create backup
railway backup create --environment production

# List backups
railway backup list

# Restore backup
railway backup restore <backup-id>
```

**Manual Database Dump**:
```bash
# Backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Restore
psql $DATABASE_URL < backup-YYYYMMDD-HHMMSS.sql
```

### S3 Bucket Versioning

```bash
# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ki-agentur-client-portal-documents \
  --versioning-configuration Status=Enabled

# Lifecycle policy (archive old versions)
aws s3api put-bucket-lifecycle-configuration \
  --bucket ki-agentur-client-portal-documents \
  --lifecycle-configuration file://s3-lifecycle.json
```

### Disaster Recovery Plan

**RTO (Recovery Time Objective)**: 1 hour
**RPO (Recovery Point Objective)**: 24 hours (daily backups)

**Recovery Steps**:
1. Restore database from latest backup (15 min)
2. Redeploy backend from Git (10 min)
3. Redeploy frontend from Git (5 min)
4. Verify functionality (15 min)
5. Update DNS if needed (15 min)

---

## Rollback Procedures

### Frontend Rollback (Vercel)

```bash
# Via Vercel dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "Promote to Production"

# Via CLI:
vercel rollback
```

### Backend Rollback (Railway)

```bash
# Via Railway dashboard:
# 1. Go to Deployments
# 2. Click "..." on previous deployment
# 3. Click "Redeploy"

# Via CLI:
railway rollback --environment production
```

### Database Rollback

```bash
# 1. Mark current migration as rolled back
npx prisma migrate resolve --rolled-back <migration-name>

# 2. Restore from backup
railway backup restore <backup-id>

# 3. Redeploy backend at previous version
git checkout <previous-commit>
railway up
```

---

## Security Hardening

### SSL/TLS Configuration

**Vercel**:
- Automatic SSL certificates (Let's Encrypt)
- Auto-renewal
- HTTPS enforced (automatic redirect)

**Railway**:
- Automatic SSL certificates
- Custom domain SSL automatic
- TLS 1.2+ only

### Security Headers

Configured in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {"key": "X-Content-Type-Options", "value": "nosniff"},
        {"key": "X-Frame-Options", "value": "DENY"},
        {"key": "X-XSS-Protection", "value": "1; mode=block"},
        {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
        {"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()"}
      ]
    }
  ]
}
```

Backend headers configured via Helmet.js (automatic in Express app)

### Rate Limiting

Configured in backend:
- Global: 100 requests/15 min
- Auth endpoints: 5 requests/15 min
- Webhooks: 100 requests/min

### Secrets Management

**DO NOT**:
- ❌ Commit secrets to Git
- ❌ Hardcode API keys in code
- ❌ Share .env files via email/Slack

**DO**:
- ✅ Use Vercel environment variables
- ✅ Use Railway environment variables
- ✅ Use GitHub Secrets for CI/CD
- ✅ Rotate secrets quarterly
- ✅ Use different secrets per environment

---

## Performance Optimization

### Frontend Optimizations

- ✅ Static prerendering (all routes)
- ✅ Image optimization (Next.js automatic)
- ✅ Code splitting (automatic)
- ✅ Edge caching (Vercel CDN)
- ✅ Bundle size < 200KB

**Target Metrics**:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**Monitoring**: Vercel Analytics Dashboard

### Backend Optimizations

- ✅ Database connection pooling (Prisma)
- ✅ Query optimization (indexes)
- ✅ Response compression (gzip)
- ✅ API caching (Redis in future)
- ✅ Prisma query optimization

**Target Metrics**:
- Health endpoint: < 200ms
- Document list: < 300ms
- Document search: < 500ms
- Auth endpoints: < 200ms

**Monitoring**: Railway Metrics Dashboard + Sentry Performance

---

## Cost Estimates

### Monthly Infrastructure Costs

| Service | Tier | Cost |
|---------|------|------|
| Vercel (Frontend) | Pro | $20/month |
| Railway (Backend) | Starter | $5/month base + usage |
| Railway (PostgreSQL) | - | ~$15/month |
| AWS S3 (Storage) | Pay-as-you-go | ~$5/month |
| Resend (Email) | Free tier | $0 (up to 3,000/month) |
| Sentry (Monitoring) | Developer | $0 (50k events/month) |
| **Total** | | **~$45-60/month** |

**Scaling Costs** (Year 2, 500 clients):
- Vercel: $20/month (same)
- Railway Backend: ~$50/month (increased usage)
- Railway PostgreSQL: ~$30/month (larger instance)
- AWS S3: ~$20/month (more documents)
- Resend: $20/month (paid tier for volume)
- **Total**: **~$140/month**

---

## Troubleshooting

### Common Issues

**1. Backend TypeScript Compilation Fails**
```bash
# Error: 26 TypeScript errors
# Solution: Fix all errors listed in BUG-001
cd client-portal-api
npm run build
# Fix each error individually
```

**2. Database Connection Failed**
```bash
# Error: Can't reach database server
# Check: DATABASE_URL in Railway environment variables
# Verify: PostgreSQL service is running in Railway
railway status
```

**3. Migrations Failed**
```bash
# Error: Migration already applied
# Solution: Mark as resolved
npx prisma migrate resolve --applied <migration-name>

# Error: Migration conflicts
# Solution: Reset dev database, DO NOT reset production
npx prisma migrate reset  # DEV ONLY
```

**4. CORS Errors**
```bash
# Error: CORS policy blocked
# Check: ALLOWED_ORIGINS includes your frontend domain
# Update in Railway: ALLOWED_ORIGINS=https://portal.ki-agentur.com
```

**5. Frontend Build Fails on Vercel**
```bash
# Error: Module not found
# Check: package.json includes all dependencies
# Solution: npm install locally, commit package-lock.json

# Error: Environment variable missing
# Check: NEXT_PUBLIC_API_URL set in Vercel dashboard
```

**6. 404 Errors in Production**
```bash
# Error: Page not found
# Check: Next.js routing (all pages in app/ directory)
# Verify: Build output shows page was generated
```

### Getting Help

**Logs**:
```bash
# Vercel logs
vercel logs <deployment-url>

# Railway logs
railway logs --environment production --tail 100

# Application logs
# Check Sentry dashboard for errors
```

**Support Contacts**:
- Vercel Support: https://vercel.com/support
- Railway Support: https://railway.app/help
- AWS Support: https://aws.amazon.com/support/
- Sentry Support: https://sentry.io/support/

---

## Checklist: Pre-Deployment

Before deploying to production, verify ALL items:

### Code Quality
- [ ] ✅ All TypeScript errors fixed (BUG-001)
- [ ] ✅ All ESLint warnings resolved
- [ ] ✅ All tests passing
- [ ] ✅ Code review completed
- [ ] ✅ No console.log statements in production code

### Security
- [ ] ⚠️ BUG-003 fixed (refresh token security)
- [ ] ⚠️ BUG-004 fixed (CSRF protection)
- [ ] ✅ Security audit completed
- [ ] ✅ Dependencies updated (npm audit clean)
- [ ] ✅ Secrets not committed to Git
- [ ] ✅ Environment variables configured

### Database
- [ ] ⚠️ BUG-002 fixed (migrations created)
- [ ] ⚠️ BUG-005 fixed (schema warnings)
- [ ] ✅ Migrations tested on staging
- [ ] ✅ Seed data prepared
- [ ] ✅ Backup strategy configured
- [ ] ✅ Database performance tested

### Testing
- [ ] ❌ Functional testing completed (blocked)
- [ ] ❌ Integration testing completed (blocked)
- [ ] ❌ E2E testing completed (blocked)
- [ ] ❌ Accessibility testing completed (blocked)
- [ ] ❌ Performance testing completed (blocked)
- [ ] ❌ QA sign-off obtained

### Infrastructure
- [ ] ✅ Vercel project configured
- [ ] ✅ Railway project configured
- [ ] ✅ AWS S3 bucket created
- [ ] ✅ Resend account configured
- [ ] ✅ Sentry project created
- [ ] ✅ Custom domains configured
- [ ] ✅ SSL certificates verified

### Monitoring
- [ ] ✅ Error tracking enabled (Sentry)
- [ ] ✅ Performance monitoring configured
- [ ] ✅ Logging configured
- [ ] ✅ Alerts configured
- [ ] ✅ Health checks working

### Documentation
- [ ] ✅ Environment variables documented
- [ ] ✅ Deployment guide complete
- [ ] ✅ Rollback procedures documented
- [ ] ✅ Runbooks prepared
- [ ] ✅ Team trained on procedures

**Current Status**: ❌ **NOT READY** (5 critical blockers)

---

## Next Steps

### Immediate Actions Required

1. **Development Team** - Fix BUG-001 through BUG-005 (estimated 5-8 hours)
2. **QA Team** - Complete full testing after bugs fixed (2-3 days)
3. **DevOps Team** - Stand by for deployment once QA approves

### Deployment Timeline (After Bugs Fixed)

| Day | Phase | Activities |
|-----|-------|-----------|
| Day 1 | Bug Fixes | Development team fixes all P0/P1 bugs |
| Day 2-3 | Testing | QA executes full test suite |
| Day 3 | QA Sign-off | QA provides deployment approval |
| Day 4 | Staging Deploy | Deploy to staging, smoke tests |
| Day 4 | Production Deploy | Deploy to production, verify |
| Day 5 | Monitoring | Monitor metrics, gather feedback |

**Estimated Timeline to Production**: 4-5 business days from now

---

## Conclusion

This deployment guide provides comprehensive instructions for deploying the KI Agentur Client Portal to production. However, **deployment is currently BLOCKED** by 5 critical issues that must be resolved first.

Once all bugs are fixed and QA provides sign-off, this guide can be followed step-by-step to deploy to Vercel (frontend) and Railway (backend + database).

**Status**: ⚠️ **DEPLOYMENT BLOCKED - AWAITING BUG FIXES**

**Contact**: DevOps Engineer Agent
**Last Updated**: 2025-11-23
**Next Review**: After all P0/P1 bugs are resolved

---

**END OF DEPLOYMENT GUIDE**

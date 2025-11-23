# Environment Variables Reference

**Project**: KI Agentur Client Portal
**Last Updated**: 2025-11-23

---

## Frontend Environment Variables (Vercel)

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://api.ki-agentur-portal.com` | ✅ Yes |
| `NEXT_PUBLIC_ENVIRONMENT` | Environment name | `production` or `staging` | ⚠️ Optional |

### Setup in Vercel

```bash
# Via Vercel Dashboard:
# 1. Go to Project Settings > Environment Variables
# 2. Add each variable for Production, Preview, Development

# Via Vercel CLI:
vercel env add NEXT_PUBLIC_API_URL
# Enter value: https://api.ki-agentur-portal.com
# Select environment: Production

vercel env add NEXT_PUBLIC_ENVIRONMENT
# Enter value: production
# Select environment: Production
```

---

## Backend Environment Variables (Railway)

### Required Variables (Critical)

| Variable | Description | Example | Secret | Required |
|----------|-------------|---------|--------|----------|
| `NODE_ENV` | Environment mode | `production` | ❌ No | ✅ Yes |
| `PORT` | Server port | `3001` | ❌ No | ✅ Yes |
| `API_VERSION` | API version prefix | `v1` | ❌ No | ✅ Yes |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host:port/db` | ✅ Yes | ✅ Yes |

**DATABASE_URL**: Railway auto-populates this when you add PostgreSQL service

### JWT Configuration (Critical - MUST be 32+ characters)

| Variable | Description | Generate Command | Required |
|----------|-------------|------------------|----------|
| `JWT_ACCESS_SECRET` | Access token signing secret | `openssl rand -base64 32` | ✅ Yes |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime | `15m` | ✅ Yes |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | `openssl rand -base64 32` | ✅ Yes |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime | `7d` | ✅ Yes |

**Example**:
```bash
# Generate secrets
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Add to Railway
railway variables set JWT_ACCESS_SECRET="$JWT_ACCESS_SECRET"
railway variables set JWT_ACCESS_EXPIRES_IN="15m"
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
railway variables set JWT_REFRESH_EXPIRES_IN="7d"
```

### Cookie Configuration

| Variable | Description | Value | Required |
|----------|-------------|-------|----------|
| `COOKIE_SECRET` | Cookie signing secret | `openssl rand -base64 32` | ✅ Yes |
| `COOKIE_DOMAIN` | Cookie domain | `.ki-agentur-portal.com` | ✅ Yes |
| `COOKIE_SECURE` | Secure flag (HTTPS only) | `true` | ✅ Yes |
| `COOKIE_SAME_SITE` | SameSite attribute | `strict` | ✅ Yes |

**Example**:
```bash
COOKIE_SECRET=$(openssl rand -base64 32)
railway variables set COOKIE_SECRET="$COOKIE_SECRET"
railway variables set COOKIE_DOMAIN=".ki-agentur-portal.com"
railway variables set COOKIE_SECURE="true"
railway variables set COOKIE_SAME_SITE="strict"
```

### CORS Configuration

| Variable | Description | Value | Required |
|----------|-------------|-------|----------|
| `ALLOWED_ORIGINS` | Allowed CORS origins (comma-separated) | `https://portal.ki-agentur.com,https://staging.ki-agentur-portal.com` | ✅ Yes |

**Example**:
```bash
railway variables set ALLOWED_ORIGINS="https://portal.ki-agentur.com,https://staging.ki-agentur-portal.com"
```

### Rate Limiting

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` (15 min) | ⚠️ Optional |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | ⚠️ Optional |
| `AUTH_RATE_LIMIT_MAX` | Auth endpoint limit | `5` | ⚠️ Optional |

**Example**:
```bash
railway variables set RATE_LIMIT_WINDOW_MS="900000"
railway variables set RATE_LIMIT_MAX_REQUESTS="100"
railway variables set AUTH_RATE_LIMIT_MAX="5"
```

### Webhook Configuration

| Variable | Description | Generate Command | Required |
|----------|-------------|------------------|----------|
| `WEBHOOK_SECRET` | Webhook signature secret | `openssl rand -base64 32` | ✅ Yes |

**Example**:
```bash
WEBHOOK_SECRET=$(openssl rand -base64 32)
railway variables set WEBHOOK_SECRET="$WEBHOOK_SECRET"
```

### Email Configuration (Resend)

| Variable | Description | Source | Required |
|----------|-------------|--------|----------|
| `RESEND_API_KEY` | Resend API key | Resend dashboard | ✅ Yes |
| `EMAIL_FROM` | Sender email address | `portal@ki-agentur.com` | ✅ Yes |

**Setup**:
1. Create account at https://resend.com
2. Verify domain `ki-agentur.com`
3. Create API key
4. Add to Railway:
```bash
railway variables set RESEND_API_KEY="re_xxxxxxxxxxxxx"
railway variables set EMAIL_FROM="portal@ki-agentur.com"
```

### AWS S3 Configuration

| Variable | Description | Source | Required |
|----------|-------------|--------|----------|
| `AWS_REGION` | S3 bucket region | `eu-central-1` | ✅ Yes |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key | AWS IAM Console | ✅ Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | AWS IAM Console | ✅ Yes |
| `AWS_S3_BUCKET` | S3 bucket name | `ki-agentur-client-portal-documents` | ✅ Yes |

**Setup**:
```bash
# 1. Create S3 bucket
aws s3 mb s3://ki-agentur-client-portal-documents --region eu-central-1

# 2. Create IAM user
aws iam create-user --user-name ki-agentur-portal-backend

# 3. Create access key
aws iam create-access-key --user-name ki-agentur-portal-backend
# Save AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

# 4. Add to Railway
railway variables set AWS_REGION="eu-central-1"
railway variables set AWS_ACCESS_KEY_ID="AKIA..."
railway variables set AWS_SECRET_ACCESS_KEY="..."
railway variables set AWS_S3_BUCKET="ki-agentur-client-portal-documents"
```

### Monitoring (Sentry)

| Variable | Description | Source | Required |
|----------|-------------|--------|----------|
| `SENTRY_DSN` | Sentry Data Source Name | Sentry dashboard | ⚠️ Optional |
| `SENTRY_ENVIRONMENT` | Sentry environment | `production` | ⚠️ Optional |

**Setup**:
1. Create account at https://sentry.io
2. Create new project (Node.js)
3. Copy DSN
4. Add to Railway:
```bash
railway variables set SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
railway variables set SENTRY_ENVIRONMENT="production"
```

### Security Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `BCRYPT_ROUNDS` | bcrypt hashing rounds | `12` | ⚠️ Optional |
| `SESSION_TIMEOUT_MINUTES` | Session inactivity timeout | `30` | ⚠️ Optional |
| `API_KEY_SECRET` | API key encryption secret | `openssl rand -base64 32` | ✅ Yes |

**Example**:
```bash
API_KEY_SECRET=$(openssl rand -base64 32)
railway variables set BCRYPT_ROUNDS="12"
railway variables set SESSION_TIMEOUT_MINUTES="30"
railway variables set API_KEY_SECRET="$API_KEY_SECRET"
```

### n8n Integration

| Variable | Description | Value | Required |
|----------|-------------|-------|----------|
| `N8N_WEBHOOK_URL` | n8n webhook endpoint | `https://your-n8n-instance.com/webhook/...` | ⚠️ Optional |

**Example**:
```bash
railway variables set N8N_WEBHOOK_URL="https://n8n.ki-agentur.com/webhook/client-portal"
```

---

## Complete Backend .env Template

```env
# ============================================================================
# SERVER CONFIGURATION
# ============================================================================
NODE_ENV=production
PORT=3001
API_VERSION=v1

# ============================================================================
# DATABASE (Railway auto-populates)
# ============================================================================
DATABASE_URL=postgresql://postgres:password@host:5432/dbname

# ============================================================================
# JWT CONFIGURATION (CRITICAL - Generate with: openssl rand -base64 32)
# ============================================================================
JWT_ACCESS_SECRET=CHANGE_ME_32_CHARACTERS_MINIMUM_abc123
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=CHANGE_ME_32_CHARACTERS_MINIMUM_def456
JWT_REFRESH_EXPIRES_IN=7d

# ============================================================================
# COOKIE CONFIGURATION
# ============================================================================
COOKIE_SECRET=CHANGE_ME_32_CHARACTERS_MINIMUM_ghi789
COOKIE_DOMAIN=.ki-agentur-portal.com
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# ============================================================================
# CORS CONFIGURATION
# ============================================================================
ALLOWED_ORIGINS=https://portal.ki-agentur.com,https://staging.ki-agentur-portal.com

# ============================================================================
# RATE LIMITING
# ============================================================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# ============================================================================
# WEBHOOK CONFIGURATION
# ============================================================================
WEBHOOK_SECRET=CHANGE_ME_32_CHARACTERS_MINIMUM_jkl012

# ============================================================================
# EMAIL (RESEND)
# ============================================================================
RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_FROM=portal@ki-agentur.com

# ============================================================================
# AWS S3
# ============================================================================
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_S3_BUCKET=ki-agentur-client-portal-documents

# ============================================================================
# MONITORING (SENTRY)
# ============================================================================
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_ENVIRONMENT=production

# ============================================================================
# SECURITY
# ============================================================================
BCRYPT_ROUNDS=12
SESSION_TIMEOUT_MINUTES=30
API_KEY_SECRET=CHANGE_ME_32_CHARACTERS_MINIMUM_mno345

# ============================================================================
# n8n INTEGRATION (OPTIONAL)
# ============================================================================
N8N_WEBHOOK_URL=https://n8n.ki-agentur.com/webhook/client-portal
```

---

## Environment-Specific Configurations

### Development

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://localhost:5432/client_portal_dev
ALLOWED_ORIGINS=http://localhost:3000
COOKIE_SECURE=false
```

### Staging

```env
NODE_ENV=staging
PORT=3001
DATABASE_URL=<railway-staging-db-url>
ALLOWED_ORIGINS=https://staging.ki-agentur-portal.com
COOKIE_SECURE=true
COOKIE_DOMAIN=.ki-agentur-portal.com
```

### Production

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=<railway-production-db-url>
ALLOWED_ORIGINS=https://portal.ki-agentur.com
COOKIE_SECURE=true
COOKIE_DOMAIN=.ki-agentur-portal.com
```

---

## Secrets Generation Script

Save as `generate-secrets.sh`:

```bash
#!/bin/bash

echo "=========================================="
echo "Generating Production Secrets"
echo "=========================================="
echo ""

echo "JWT_ACCESS_SECRET=$(openssl rand -base64 32)"
echo "JWT_REFRESH_SECRET=$(openssl rand -base64 32)"
echo "COOKIE_SECRET=$(openssl rand -base64 32)"
echo "WEBHOOK_SECRET=$(openssl rand -base64 32)"
echo "API_KEY_SECRET=$(openssl rand -base64 32)"

echo ""
echo "=========================================="
echo "Copy these values to Railway dashboard"
echo "NEVER commit these to Git!"
echo "=========================================="
```

**Usage**:
```bash
chmod +x generate-secrets.sh
./generate-secrets.sh > secrets.txt
# Copy values to Railway, then delete secrets.txt
rm secrets.txt
```

---

## Security Best Practices

### DO NOT

- ❌ Commit `.env` files to Git
- ❌ Share secrets via email or Slack
- ❌ Use same secrets across environments
- ❌ Use short or simple secrets (< 32 characters)
- ❌ Reuse secrets from other projects
- ❌ Store secrets in plaintext files

### DO

- ✅ Generate unique secrets per environment
- ✅ Use `openssl rand -base64 32` for all secrets
- ✅ Store secrets in Vercel/Railway dashboards
- ✅ Use GitHub Secrets for CI/CD
- ✅ Rotate secrets quarterly
- ✅ Document secret rotation procedures
- ✅ Use different DATABASE_URL per environment
- ✅ Delete local `.env` files after setup

---

## Verification Checklist

Before deploying, verify all variables are set:

### Frontend (Vercel)
- [ ] ✅ `NEXT_PUBLIC_API_URL` set for Production
- [ ] ✅ `NEXT_PUBLIC_API_URL` set for Preview
- [ ] ✅ Value points to correct backend URL

### Backend (Railway)
- [ ] ✅ `NODE_ENV=production`
- [ ] ✅ `DATABASE_URL` auto-populated by Railway
- [ ] ✅ `JWT_ACCESS_SECRET` (32+ chars)
- [ ] ✅ `JWT_REFRESH_SECRET` (32+ chars)
- [ ] ✅ `COOKIE_SECRET` (32+ chars)
- [ ] ✅ `WEBHOOK_SECRET` (32+ chars)
- [ ] ✅ `API_KEY_SECRET` (32+ chars)
- [ ] ✅ `ALLOWED_ORIGINS` includes frontend domain
- [ ] ✅ `RESEND_API_KEY` from Resend dashboard
- [ ] ✅ `AWS_ACCESS_KEY_ID` from AWS IAM
- [ ] ✅ `AWS_SECRET_ACCESS_KEY` from AWS IAM
- [ ] ✅ All secrets are unique (not from examples)

### Verification Commands

```bash
# Check Railway variables
railway variables --environment production

# Test backend with secrets
curl -X POST https://api.ki-agentur-portal.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPassword123!"}' \
  -v

# Check response headers (should see secure cookies)
```

---

## Troubleshooting

### Error: "JWT secret must be at least 32 characters"

**Solution**: Generate proper secret
```bash
openssl rand -base64 32
# Copy output to JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
```

### Error: "DATABASE_URL is not defined"

**Solution**: Ensure PostgreSQL service is linked in Railway
1. Go to Railway project
2. Click "+ New" > "Database" > "PostgreSQL"
3. Railway will auto-populate DATABASE_URL

### Error: "CORS blocked"

**Solution**: Add frontend domain to ALLOWED_ORIGINS
```bash
railway variables set ALLOWED_ORIGINS="https://portal.ki-agentur.com"
```

### Error: "Email sending failed"

**Solution**: Verify Resend configuration
1. Check RESEND_API_KEY is correct
2. Verify domain is verified in Resend dashboard
3. Check EMAIL_FROM domain matches verified domain

---

## Environment Variables by Service

### Vercel (Frontend)
Total: 2 variables
- Required: 1 (NEXT_PUBLIC_API_URL)
- Optional: 1 (NEXT_PUBLIC_ENVIRONMENT)

### Railway (Backend)
Total: 27 variables
- Critical: 11 (NODE_ENV, DATABASE_URL, JWT secrets, COOKIE_SECRET, etc.)
- Required: 22 (all except Sentry and n8n)
- Optional: 5 (rate limits, monitoring, n8n)

### GitHub Secrets (CI/CD)
Total: 5 variables
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- RAILWAY_TOKEN
- SLACK_WEBHOOK (optional)

---

**Last Updated**: 2025-11-23
**Maintained By**: DevOps Team

**END OF ENVIRONMENT VARIABLES REFERENCE**

# Monitoring & Observability Setup

**Project**: KI Agentur Client Portal
**Last Updated**: 2025-11-23

---

## Monitoring Stack Overview

| Component | Tool | Purpose | Cost |
|-----------|------|---------|------|
| Error Tracking | Sentry | Track frontend + backend errors | Free (50k events/month) |
| Performance Monitoring | Sentry + Vercel Analytics | Track performance metrics | Included |
| Logging | Railway Logs + Winston | Application logs | Included |
| Uptime Monitoring | UptimeRobot (recommended) | Health check monitoring | Free (50 monitors) |
| APM | Railway Metrics | Backend CPU, memory, requests | Included |
| Frontend Analytics | Vercel Analytics | Page views, Web Vitals | Included |

---

## 1. Sentry Error Tracking

### Setup

**1. Create Sentry Account**
```bash
# Visit: https://sentry.io
# Create account
# Create organization: "KI Agentur"
```

**2. Create Projects**
```bash
# Create two projects:
# 1. "client-portal-frontend" (Next.js)
# 2. "client-portal-backend" (Node.js)
```

**3. Get DSN**
```bash
# Frontend: Settings > Client Keys (DSN)
# Backend: Settings > Client Keys (DSN)
# Copy both DSNs
```

**4. Configure Frontend**

Already integrated in code, just add environment variable:

```bash
# Vercel dashboard
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

**5. Configure Backend**

Already integrated in code, add to Railway:

```bash
railway variables set SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
railway variables set SENTRY_ENVIRONMENT="production"
```

### Sentry Dashboard

**Access**: https://sentry.io/organizations/ki-agentur/issues/

**Key Metrics**:
- Error count (last 24 hours)
- Error types
- Affected users
- Error frequency trends
- Performance slowdowns

### Alert Configuration

**1. Create Alert Rules**

Settings > Alerts > Create Alert Rule

**Alert: High Error Rate**
```yaml
Condition: Errors > 10 in 5 minutes
Actions:
  - Email: devops@ki-agentur.com
  - Slack: #alerts-production
Priority: Critical
```

**Alert: New Error Type**
```yaml
Condition: First seen error
Actions:
  - Email: developers@ki-agentur.com
  - Slack: #engineering
Priority: High
```

**Alert: Performance Degradation**
```yaml
Condition: P95 response time > 1000ms for 10 minutes
Actions:
  - Email: devops@ki-agentur.com
  - Slack: #alerts-production
Priority: Medium
```

**2. Configure Slack Integration**

Settings > Integrations > Slack
- Connect workspace
- Select channels: #alerts-production, #engineering
- Test notification

### Testing Sentry

```bash
# Frontend - trigger test error
# In browser console:
throw new Error("Sentry test error from frontend");

# Backend - trigger test error
curl -X GET https://api.ki-agentur-portal.com/api/v1/test-error

# Check Sentry dashboard for events
```

---

## 2. Vercel Analytics

### Setup

**1. Enable Analytics**
```bash
# Vercel dashboard:
# Project Settings > Analytics > Enable
```

**2. Install Package** (Already installed)
```json
{
  "dependencies": {
    "@vercel/analytics": "^1.0.0"
  }
}
```

**3. Integration** (Already in code)
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Metrics Tracked

**Web Vitals**:
- First Contentful Paint (FCP): Target < 1.5s
- Largest Contentful Paint (LCP): Target < 2.5s
- First Input Delay (FID): Target < 100ms
- Cumulative Layout Shift (CLS): Target < 0.1
- Time to First Byte (TTFB): Target < 600ms

**Custom Events**:
```typescript
import { track } from '@vercel/analytics';

// Track user actions
track('document_uploaded', { documentType: 'pdf' });
track('search_performed', { query: 'contracts' });
track('notification_clicked', { type: 'workflow_update' });
```

### Dashboard Access

https://vercel.com/dashboard/analytics

**Views**:
- Overview: Page views, visitors, top pages
- Web Vitals: Performance scores
- Devices: Desktop vs mobile
- Locations: Geographic distribution

---

## 3. Railway Metrics

### Setup

Automatic - no setup required. Metrics collected automatically when backend is deployed.

### Dashboard Access

```bash
# Via Railway dashboard:
# https://railway.app/project/your-project/metrics

# Via CLI:
railway logs --environment production
```

### Metrics Tracked

**Resource Usage**:
- CPU utilization (%)
- Memory usage (MB)
- Network I/O (MB/s)
- Disk I/O (MB/s)

**Application Metrics**:
- Request count
- Response time (p50, p95, p99)
- Error rate
- Active connections

**Database Metrics** (PostgreSQL):
- Connection count
- Query performance
- Database size
- Cache hit ratio

### Alert Configuration

**Railway Dashboard > Notifications**

**Alert: High CPU**
```yaml
Condition: CPU > 80% for 5 minutes
Action: Email notification
```

**Alert: High Memory**
```yaml
Condition: Memory > 90% for 5 minutes
Action: Email notification
```

**Alert: Service Crash**
```yaml
Condition: Service exits unexpectedly
Action: Email + auto-restart
```

---

## 4. Application Logging (Winston)

### Log Levels

```typescript
logger.error('Authentication failed', { userId, reason });  // Critical issues
logger.warn('Rate limit approaching', { ip, requests });   // Warnings
logger.info('User logged in', { userId, timestamp });      // Important events
logger.debug('Query executed', { sql, duration });         // Debug info
```

### Log Structure

All logs include:
- Timestamp
- Level (error/warn/info/debug)
- Message
- Context (userId, requestId, etc.)
- Environment (production/staging)

**Example Log Entry**:
```json
{
  "timestamp": "2025-11-23T10:30:45.123Z",
  "level": "error",
  "message": "Database connection failed",
  "context": {
    "error": "Connection timeout",
    "host": "postgres.railway.app",
    "retries": 3
  },
  "environment": "production"
}
```

### Accessing Logs

**Railway Logs**:
```bash
# Real-time logs
railway logs --environment production --tail 100

# Filter by level
railway logs --filter "ERROR"

# Search logs
railway logs --search "authentication"

# Export logs
railway logs > logs-$(date +%Y%m%d).txt
```

**Log Retention**:
- Railway: 7 days (free), 30 days (pro)
- Recommendation: Export critical logs to external service (Datadog, LogDNA) for long-term retention

---

## 5. Uptime Monitoring (UptimeRobot)

### Setup

**1. Create Account**
```bash
# Visit: https://uptimerobot.com
# Create free account (50 monitors)
```

**2. Add Monitors**

**Monitor 1: Frontend Health**
```yaml
Name: Client Portal Frontend
Type: HTTP(s)
URL: https://portal.ki-agentur.com
Interval: 5 minutes
Alert: Email when down
```

**Monitor 2: Backend Health**
```yaml
Name: Client Portal Backend API
Type: HTTP(s)
URL: https://api.ki-agentur-portal.com/health
Interval: 5 minutes
Alert: Email when down
```

**Monitor 3: Database Health**
```yaml
Name: Database Connection
Type: Keyword
URL: https://api.ki-agentur-portal.com/health
Expected keyword: "database":"connected"
Interval: 5 minutes
Alert: Email when keyword not found
```

**3. Configure Alerts**

Settings > Alert Contacts
- Email: devops@ki-agentur.com
- Slack webhook: https://hooks.slack.com/...
- SMS: +49... (optional, paid)

**4. Status Page** (Optional)

Create public status page:
- https://status.ki-agentur-portal.com
- Shows uptime for all services
- Incident history

---

## 6. Health Check Endpoints

### Backend Health Endpoint

**Endpoint**: `/health`

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2025-11-23T10:30:45.123Z",
  "uptime": 86400,
  "services": {
    "database": "connected",
    "redis": "not configured",
    "s3": "connected",
    "email": "configured"
  },
  "version": "1.0.0",
  "environment": "production"
}
```

**Response** (503 Service Unavailable):
```json
{
  "status": "unhealthy",
  "timestamp": "2025-11-23T10:30:45.123Z",
  "services": {
    "database": "disconnected",
    "error": "Connection timeout"
  }
}
```

### Testing Health Checks

```bash
# Frontend
curl https://portal.ki-agentur.com
# Should return: 200 OK

# Backend
curl https://api.ki-agentur-portal.com/health
# Should return: {"status":"healthy",...}

# Database via backend
curl https://api.ki-agentur-portal.com/health | jq '.services.database'
# Should return: "connected"
```

---

## 7. Performance Monitoring

### Key Performance Indicators (KPIs)

| Metric | Target | Alert Threshold | Critical |
|--------|--------|-----------------|----------|
| Frontend LCP | < 2.5s | > 3s | > 4s |
| Frontend FCP | < 1.5s | > 2s | > 3s |
| Frontend CLS | < 0.1 | > 0.15 | > 0.25 |
| API Response Time (P95) | < 300ms | > 500ms | > 1000ms |
| API Response Time (P99) | < 500ms | > 1000ms | > 2000ms |
| Error Rate | < 0.1% | > 0.5% | > 1% |
| Database Query Time (P95) | < 100ms | > 200ms | > 500ms |
| Uptime | > 99.9% | < 99.5% | < 99% |

### Performance Dashboards

**Vercel Analytics Dashboard**:
- https://vercel.com/dashboard/analytics
- Web Vitals scores
- Page load times
- Visitor metrics

**Railway Metrics Dashboard**:
- https://railway.app/project/your-project/metrics
- CPU/Memory usage
- Request throughput
- Response times

**Sentry Performance Dashboard**:
- https://sentry.io/organizations/ki-agentur/performance/
- Transaction performance
- Database query performance
- External API latency

---

## 8. Custom Metrics & Events

### Backend Custom Metrics

```typescript
import { logger } from './utils/logger';

// Track business metrics
logger.info('document_uploaded', {
  userId: user.id,
  documentType: 'contract',
  fileSize: file.size,
  duration: uploadTime
});

logger.info('workflow_completed', {
  workflowId: workflow.id,
  duration: completionTime,
  steps: workflow.steps.length
});

// Track performance metrics
logger.info('slow_query', {
  query: 'SELECT * FROM documents WHERE...',
  duration: queryTime,
  threshold: 1000
});
```

### Frontend Custom Events

```typescript
import { track } from '@vercel/analytics';

// Track user interactions
track('document_viewed', {
  documentId,
  documentType,
  viewDuration: timeSpent
});

track('search_query', {
  query: searchTerm,
  resultsCount: results.length,
  timeToResults: searchTime
});

track('notification_interaction', {
  notificationId,
  action: 'click',
  type: notificationType
});
```

---

## 9. Alert Summary

### Critical Alerts (Immediate Response)

1. **Service Down**
   - Frontend unreachable
   - Backend health check fails
   - Database connection lost
   - **Response Time**: 5 minutes

2. **High Error Rate**
   - > 1% of requests failing
   - **Response Time**: 15 minutes

3. **Security Incident**
   - Multiple failed login attempts (> 50/min)
   - Unusual traffic patterns
   - **Response Time**: Immediate

### Warning Alerts (Monitor & Plan)

1. **Performance Degradation**
   - API response time > 1s (P95)
   - Frontend LCP > 3s
   - **Response Time**: 1 hour

2. **Resource Usage High**
   - CPU > 80%
   - Memory > 90%
   - **Response Time**: 1 hour

3. **Database Issues**
   - Slow queries (> 1s)
   - Connection pool > 80%
   - **Response Time**: 2 hours

### Info Alerts (Track Trends)

1. **Traffic Spikes**
   - 2x normal traffic
   - Unusual geographic patterns

2. **New Error Types**
   - First occurrence of new error
   - Track and triage

---

## 10. Monitoring Checklist

### Daily Checks
- [ ] Check Sentry for new errors
- [ ] Review error rate trends
- [ ] Check uptime status (UptimeRobot)
- [ ] Review performance metrics (Vercel Analytics)
- [ ] Check Railway resource usage

### Weekly Checks
- [ ] Review performance trends
- [ ] Analyze slow queries
- [ ] Check log volume (ensure not hitting limits)
- [ ] Review user analytics (traffic patterns)
- [ ] Check disk usage (database size)

### Monthly Checks
- [ ] Review and update alert thresholds
- [ ] Analyze error patterns (common issues)
- [ ] Performance optimization review
- [ ] Cost analysis (service usage)
- [ ] Security incident review

---

## 11. Monitoring Costs

| Service | Plan | Monthly Cost | Notes |
|---------|------|--------------|-------|
| Sentry | Developer | $0 | 50k events/month (sufficient) |
| Vercel Analytics | Included | $0 | Included with Pro plan |
| Railway Metrics | Included | $0 | Included with all plans |
| UptimeRobot | Free | $0 | 50 monitors, 5min interval |
| **Total** | | **$0** | All included or free tier |

**Scaling Costs** (Year 2, high traffic):
- Sentry Team: $26/month (200k events)
- External log aggregation: ~$50/month (optional)
- **Total**: ~$76/month

---

## 12. Monitoring Setup Script

Save as `setup-monitoring.sh`:

```bash
#!/bin/bash

echo "=========================================="
echo "Monitoring Setup for KI Agentur Portal"
echo "=========================================="
echo ""

echo "1. Testing Frontend Health..."
curl -f https://portal.ki-agentur.com && echo "✅ Frontend OK" || echo "❌ Frontend DOWN"

echo ""
echo "2. Testing Backend Health..."
curl -f https://api.ki-agentur-portal.com/health && echo "✅ Backend OK" || echo "❌ Backend DOWN"

echo ""
echo "3. Testing Backend Database..."
curl -s https://api.ki-agentur-portal.com/health | jq '.services.database' | grep -q "connected" && echo "✅ Database OK" || echo "❌ Database DOWN"

echo ""
echo "4. Testing Sentry (trigger error)..."
curl -X GET https://api.ki-agentur-portal.com/api/v1/test-error && echo "✅ Sentry event sent" || echo "⚠️ Sentry not configured"

echo ""
echo "=========================================="
echo "Monitoring checks complete"
echo "Check Sentry dashboard for test error"
echo "=========================================="
```

---

## Conclusion

This monitoring setup provides comprehensive visibility into:
- ✅ Error tracking (Sentry)
- ✅ Performance metrics (Vercel Analytics + Railway)
- ✅ Uptime monitoring (UptimeRobot)
- ✅ Application logs (Winston + Railway)
- ✅ Resource usage (Railway Metrics)
- ✅ Custom business metrics

**Total Cost**: $0/month (all free tier or included)

**Next Steps**:
1. Set up Sentry projects
2. Configure alerts in each platform
3. Test all health check endpoints
4. Set up UptimeRobot monitors
5. Create monitoring runbook for on-call team

---

**Last Updated**: 2025-11-23
**Maintained By**: DevOps Team

**END OF MONITORING SETUP GUIDE**

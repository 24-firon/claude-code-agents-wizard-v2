# Database Quick Reference: KI Agentur Client Portal

**For Backend Engineers** | **Date**: 2025-11-22 | **Status**: Ready to Implement

---

## 30-Second Summary

**Database**: PostgreSQL 15+
**ORM**: Prisma (TypeScript)
**Tables**: 10 core tables (Users, Projects, Documents, Workflows, Notifications, etc.)
**Scale**: 50→500 clients, 150→1,500 users, 2,500→50,000 documents
**Performance**: Health score <200ms, Search <500ms, List <300ms

---

## Files You Need

| File | Purpose | Location |
|------|---------|----------|
| `prisma-schema.prisma` | Database schema definition | Copy to `backend/prisma/schema.prisma` |
| `database-design-*.md` | Complete design documentation | Reference as needed |
| `prisma-seed.ts` | Sample data for development | Copy to `backend/prisma/seed.ts` |
| `migration-guide-*.md` | How to manage migrations | Reference for deployments |

---

## Quick Setup (5 minutes)

```bash
# 1. Copy schema
cp prisma-schema.prisma backend/prisma/schema.prisma

# 2. Copy seed script
cp prisma-seed.ts backend/prisma/seed.ts

# 3. Install dependencies
cd backend
npm install

# 4. Create database
createdb ki_client_portal

# 5. Set environment variable
export DATABASE_URL="postgresql://localhost/ki_client_portal"

# 6. Generate Prisma Client
npx prisma generate

# 7. Create initial migration
npx prisma migrate dev --name init

# 8. Seed development data
npx prisma db seed

# 9. Open Prisma Studio (optional, to browse data)
npx prisma studio
# Opens at http://localhost:5555
```

✅ Database is ready!

---

## Core Tables Overview

### 1. Users
Stores user accounts with roles (CEO, CTO, PM, Admin)
```typescript
// Key fields
id, email (unique), role, projectId, passwordHash, lastLogin, createdAt
// Indexes: email (login), projectId (list by project)
```

### 2. Projects
Project metadata and health tracking
```typescript
// Key fields
id, name, ownerId, healthScore (0-100), status, createdAt
// Indexes: ownerId (list by owner), status (filter)
```

### 3. Documents
Project documents with versioning and full-text search
```typescript
// Key fields
id, projectId, name, phase, filePath (S3), version, uploaderId, searchVector
// Indexes: projectId (list), phase (filter), fulltext (search)
```

### 4. WorkflowLog
n8n workflow execution tracking
```typescript
// Key fields
id, projectId, n8nWorkflowId, executionId, status, executionTimeMs, errorMessage
// Indexes: projectId (dashboard health), createdAt DESC (recent)
// JSON fields: executionDetails, inputData, outputData
```

### 5. Notifications
In-app + email notifications
```typescript
// Key fields
id, userId, type, title, body, readAt, createdAt
// Types: WORKFLOW_COMPLETED, WORKFLOW_FAILED, MILESTONE_COMPLETED, DOCUMENT_UPLOADED, etc.
```

### 6. Additional Tables
- **NotificationPreference**: User notification settings
- **ApiKey**: Developer API keys (hashed for security)
- **Session**: JWT session management
- **AuditLog**: Compliance audit trail
- **DocumentPermission**: Role-based document access

---

## Most Important Queries

### Health Score (Most Frequent - <200ms target)
```typescript
// Get workflow success rate for health score
const stats = await prisma.workflowLog.groupBy({
  by: ['status'],
  where: {
    projectId,
    createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
  },
  _count: { id: true }
});
// Index used: (projectId, status, created_at DESC)
```

### Document List (Page Load - <300ms target)
```typescript
// List documents by project and phase, paginated
const documents = await prisma.document.findMany({
  where: { projectId, phase, deletedAt: null },
  skip: (page - 1) * 20,
  take: 20,
  orderBy: { createdAt: 'desc' }
});
// Index used: (projectId, phase, created_at DESC)
```

### Document Search (<500ms target)
```typescript
// Full-text search across documents
const results = await prisma.document.findMany({
  where: {
    projectId,
    deletedAt: null,
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { searchVector: { contains: query } }
    ]
  },
  take: 20
});
// Index used: GIN fulltext index
```

### Recent Workflows (CTO Technical Logs - <250ms)
```typescript
// Get recent workflow executions for CTO view
const workflows = await prisma.workflowLog.findMany({
  where: {
    projectId,
    status: { not: 'IN_PROGRESS' }
  },
  orderBy: { createdAt: 'desc' },
  take: 50
});
// Index used: (projectId, status, created_at DESC)
```

### User Notifications (<100ms target)
```typescript
// Get unread notifications for notification center
const unread = await prisma.notification.findMany({
  where: { userId, readAt: null },
  orderBy: { createdAt: 'desc' },
  take: 20
});
// Index used: userId + partial index WHERE readAt IS NULL
```

---

## Key Design Decisions

### Soft Deletes
- All user-facing entities have `deletedAt` timestamp
- Instead of DELETE, set `deletedAt = NOW()`
- Filter in queries: `where: { deletedAt: null }`
- **Why**: GDPR compliance, data recovery, audit trails

### Role-Based Access
- Permissions enforced at **application layer** (middleware)
- Database doesn't enforce (for simplicity)
- Each query filters by `projectId` + user's role

### JSON Fields for Workflows
- Store full n8n execution details in JSONB
- Allows flexible schema as n8n evolves
- Index with GIN for efficient queries: `executionDetails->>'errorType'`

### API Key Security
- Never store plaintext API keys
- Hash keys before storage: `keyHash = HMAC-SHA256(key)`
- Verify: Compare provided key hash with stored hash

### Session Management
- Store session metadata (IP, device info) for security
- Use token hashes (not plaintext tokens)
- Clean up expired sessions: `DELETE FROM sessions WHERE expires_at < NOW()`

---

## Caching Opportunities

### What to Cache (and TTL)

| Data | Cache TTL | Invalidation |
|------|-----------|--------------|
| Health score | 30 seconds | On webhook receipt |
| Document list | 5 minutes | On document upload |
| User permissions | 1 hour | On role change |
| Workflow status | 30 seconds | On webhook receipt |
| Notification count | 1 minute | On notification creation |

### Cache Implementation Pattern

```typescript
// Example: Health score with 30s cache
async function getHealthScore(projectId: string) {
  const cacheKey = `health_score:${projectId}`;

  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Calculate if not cached
  const score = calculateHealthScore(projectId);

  // Store in cache for 30 seconds
  await redis.setex(cacheKey, 30, JSON.stringify(score));

  return score;
}

// Invalidate on webhook
async function handleN8nWebhook(payload) {
  // Process webhook
  await redis.del(`health_score:${payload.projectId}`);
  // Next query will recalculate
}
```

---

## Performance Checklist

### Before Launching MVP

- [ ] All foreign keys indexed
- [ ] Composite indexes for hot queries
- [ ] Full-text search indexes created
- [ ] Partial indexes for soft deletes
- [ ] Slow query log enabled
- [ ] Connection pooling configured (20 connections)

### Query Performance Targets

```
✅ Health score query: <200ms
✅ Document list: <300ms
✅ Document search: <500ms
✅ Notification center: <100ms
✅ API key validation: <50ms
⚠️  If >1 second: Missing index
```

---

## Common Patterns

### Count with Grouping
```typescript
// Count documents by phase
const stats = await prisma.document.groupBy({
  by: ['phase'],
  where: { projectId, deletedAt: null },
  _count: { id: true }
});
// Returns: [{ phase: 'REQUIREMENTS', _count: 5 }, ...]
```

### Pagination
```typescript
// Cursor-based (preferred for large datasets)
const docs = await prisma.document.findMany({
  where: { projectId },
  cursor: { id: lastDocId },
  skip: 1,
  take: 20,
  orderBy: { createdAt: 'desc' }
});

// Offset-based (simpler, okay for MVP)
const docs = await prisma.document.findMany({
  where: { projectId },
  skip: (page - 1) * 20,
  take: 20,
  orderBy: { createdAt: 'desc' }
});
```

### Eager Loading (Prevent N+1)
```typescript
// ❌ WRONG: N+1 queries
const projects = await prisma.project.findMany();
for (const p of projects) {
  const docs = await prisma.document.findMany({ where: { projectId: p.id } });
}

// ✅ CORRECT: Single query with JOIN
const projects = await prisma.project.findMany({
  include: {
    documents: { where: { deletedAt: null }, take: 5 }
  }
});
```

### Select Only Needed Fields
```typescript
// ❌ Fetches everything (large JSON fields, etc.)
const docs = await prisma.document.findMany({ where: { projectId } });

// ✅ Only what you need
const docs = await prisma.document.findMany({
  where: { projectId },
  select: {
    id: true,
    name: true,
    phase: true,
    createdAt: true,
    // Exclude: searchVector, large JSON fields
  }
});
```

---

## Repository Pattern Example

Organize your data access like this:

```typescript
// repositories/document.repository.ts
export class DocumentRepository {

  async findByProject(projectId: string, phase?: DocumentPhase) {
    return prisma.document.findMany({
      where: {
        projectId,
        phase,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async search(projectId: string, query: string) {
    return prisma.document.findMany({
      where: {
        projectId,
        deletedAt: null,
        name: { contains: query, mode: 'insensitive' }
      },
      take: 20
    });
  }

  async createVersion(projectId: string, documentId: string, data: CreateDocumentInput) {
    // Increment version
    const existing = await prisma.document.findUnique({ where: { id: documentId } });

    return prisma.document.create({
      data: {
        ...data,
        projectId,
        version: (existing?.version || 0) + 1
      }
    });
  }
}
```

---

## Monitoring in Production

### Essential Queries

```sql
-- Find slow queries (>200ms)
SELECT query, mean_exec_time FROM pg_stat_statements
WHERE mean_exec_time > 200
ORDER BY mean_exec_time DESC;

-- Monitor index usage
SELECT * FROM pg_stat_user_indexes
WHERE idx_scan = 0  -- Unused indexes
ORDER BY pg_relation_size(indexrelid) DESC;

-- Check table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size('public.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.'||tablename) DESC;

-- Find missing indexes (sequential scans)
SELECT relname, n_live_tup, seq_scan, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan AND n_live_tup > 1000
ORDER BY seq_scan DESC;
```

---

## Troubleshooting

### "Cannot find @prisma/client"
```bash
npx prisma generate
npm install
```

### "Relation does not exist"
```bash
# Migration partially failed
npx prisma migrate status
npx prisma migrate resolve --rolled-back [migration_name]
npx prisma migrate deploy
```

### "Foreign key constraint violation"
```bash
# Data inconsistency, find orphaned records
SELECT * FROM documents WHERE project_id NOT IN (SELECT id FROM projects);
DELETE FROM documents WHERE project_id NOT IN (SELECT id FROM projects);
```

### Slow Health Score Query
```bash
# Verify index exists
SELECT * FROM pg_stat_user_indexes
WHERE indexname = 'idx_workflow_logs_project_status_created';

# If missing, create it
CREATE INDEX CONCURRENTLY idx_workflow_logs_project_status_created
  ON workflow_logs(project_id, status, created_at DESC);
```

---

## Next Steps for Backend Team

1. **Copy schema**: `cp prisma-schema.prisma backend/prisma/schema.prisma`
2. **Run migrations**: `npx prisma migrate dev --name init`
3. **Seed data**: `npx prisma db seed`
4. **Create repositories**: Implement DocumentRepository, WorkflowRepository, etc.
5. **Build services**: AuthService, DashboardService, DocumentService
6. **Write controllers**: REST endpoints (POST /documents, GET /health, etc.)
7. **Add middleware**: Auth validation, error handling, logging
8. **Test**: Unit tests, integration tests, performance tests

---

## Useful Commands

```bash
# Database operations
npx prisma migrate dev           # Create migration + apply
npx prisma migrate deploy        # Apply existing migrations
npx prisma migrate status        # Check migration status
npx prisma db push              # Push schema changes (dev only)
npx prisma db seed              # Run seed script
npx prisma db pull              # Sync schema from existing DB
npx prisma studio               # Open GUI database browser
npx prisma generate             # Regenerate Prisma Client

# TypeScript/Validation
npx prisma format               # Format schema.prisma
npx prisma validate             # Check for errors
npx tsc --noEmit                # Type check

# Debugging
npm run dev                      # Run with auto-reload
npm run build                    # Compile TypeScript
npm run start                    # Run production build
npm test                         # Run tests
```

---

## Critical Reminders

⚠️ **Never** store plaintext passwords → Use bcrypt
⚠️ **Never** store plaintext API keys → Use HMAC-SHA256
⚠️ **Never** expose tokens in logs → Hash before logging
⚠️ **Always** validate user input → Use Zod schemas
⚠️ **Always** check role permissions → Middleware validation
⚠️ **Always** soft delete user data → Set deletedAt, don't DELETE
⚠️ **Always** cache health scores → 30s TTL, webhook invalidation

---

## Further Documentation

- **Full Design**: `database-design-ki-agentur-client-portal.md`
- **Migrations**: `migration-guide-ki-agentur.md`
- **Architecture**: `architecture-ki-agentur-client-portal.md`
- **Prisma Docs**: https://www.prisma.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/15/

---

**Ready to implement? Start with the Quick Setup section above!**

Questions? Check the full database design document or Prisma documentation.

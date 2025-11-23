# Database Migration Guide: KI Agentur Client Portal

**Version**: 1.0 | **Date**: 2025-11-22 | **Status**: Ready for Implementation

---

## Quick Start

### Development Environment Setup

```bash
# 1. Create local PostgreSQL database
createdb ki_client_portal

# 2. Set environment variable
export DATABASE_URL="postgresql://localhost/ki_client_portal"

# 3. Copy Prisma schema
cp prisma-schema.prisma backend/prisma/schema.prisma

# 4. Generate Prisma Client
npx prisma generate

# 5. Apply migrations (creates all tables)
npx prisma migrate dev --name init

# 6. Seed development data
npx prisma db seed

# 7. Verify with Prisma Studio
npx prisma studio  # Opens at http://localhost:5555
```

---

## Migration Strategy

### Phase 1: Initial Schema (MVP)
**Timeline**: Immediate
**File**: `001_init`
**Changes**:
- Create all core tables
- Add indexes for performance
- Add triggers for `updated_at` timestamps
- Add full-text search configuration

**Prisma Command**:
```bash
npx prisma migrate dev --name init
```

**What It Does**:
1. Generates SQL from schema.prisma
2. Creates migration file with timestamp
3. Applies migration to database
4. Updates prisma/schema.prisma (no manual changes needed)

### Phase 2: Additional Indexes & Optimization (Day 7-14)
**Timeline**: After MVP stability
**Planned Changes**:
- Add composite indexes for hot queries
- Add partial indexes for soft-deleted rows
- Optimize full-text search

```bash
npx prisma migrate dev --name add_performance_indexes
```

### Phase 3: Archive & Partitioning (Year 2)
**Timeline**: Post-growth
**Planned Changes**:
- Partition workflow_logs by created_at (monthly)
- Archive old audit logs to cold storage
- Add materialized views for dashboard calculations

---

## Migration Workflow

### Creating a New Migration

**Scenario**: Add a new field to the User model

```bash
# 1. Modify prisma/schema.prisma
# (e.g., add: avatar_url String? @db.VarChar(500))

# 2. Generate migration
npx prisma migrate dev --name add_user_avatar

# 3. Review generated migration file
cat prisma/migrations/[timestamp]_add_user_avatar/migration.sql
# Output:
# -- AddColumn
# ALTER TABLE "users" ADD COLUMN "avatar_url" VARCHAR(500);

# 4. Commit both files to Git
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(db): add user avatar URL field"

# 5. Test on staging
DATABASE_URL="postgresql://staging-db/ki_portal" npx prisma migrate deploy
```

### Creating a Custom Migration (Without Schema Changes)

**Scenario**: Add a specific index or function

```bash
# 1. Create migration without modifying schema
npx prisma migrate dev --name add_custom_index --create-only

# 2. Edit the generated migration.sql file
# Modify: prisma/migrations/[timestamp]_add_custom_index/migration.sql

# 3. Example custom migration:
# CREATE INDEX CONCURRENTLY idx_workflow_logs_project_status
#   ON workflow_logs(project_id, status, created_at DESC);

# 4. Resolve in Prisma (mark as applied without changing schema)
npx prisma migrate resolve --applied [timestamp]_add_custom_index
```

---

## Deployment Workflow

### Pre-Production Steps

```bash
# 1. Test migration locally
npx prisma migrate dev  # Creates local migration

# 2. Test on staging (full database copy)
# Backup production database
pg_dump ki_client_portal > backup.sql

# Restore to staging
createdb ki_staging
psql ki_staging < backup.sql

# Run migration on staging
DATABASE_URL="postgresql://localhost/ki_staging" npx prisma migrate deploy

# Verify no errors
npx prisma db execute --stdin < /dev/null  # Verify connection
```

### Production Deployment

```bash
# 1. In CI/CD pipeline (before code deployment)
# All migrations run automatically in Railway deployments

# 2. Manual deployment (if needed)
npx prisma migrate deploy

# 3. Verify migration applied
npx prisma migrate status

# Example output:
# 1 migration found in prisma/migrations
#
# 1 migration applied:
#   001_init

# 4. If rollback needed (CAUTION!)
npx prisma migrate resolve --rolled-back 001_init
```

---

## Rollback Procedures

### During Development (Before Pushing)

```bash
# If migration not yet committed:
npx prisma migrate reset  # Resets entire database + re-applies migrations

# Or step back one migration:
npx prisma migrate resolve --rolled-back [migration_name]
```

### After Production Deployment (CRITICAL)

**Scenario**: Migration causes production issues

```bash
# 1. STOP immediate damage
# Kill any long-running transactions
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
WHERE state = 'active' AND query_start < now() - interval '5 minutes';

# 2. Understand what failed
# Check logs, review migration SQL

# 3. OPTION A: Fix data & re-apply
# If migration partially applied, fix inconsistent state
# Then re-run: npx prisma migrate deploy

# 4. OPTION B: Rollback (if additive only)
# For ADD COLUMN migrations:
npx prisma migrate resolve --rolled-back [migration_name]
# Then revert code to previous version

# 5. Post-Incident
# - Document what went wrong
# - Add additional testing to prevent recurrence
# - Plan fix migration
```

**Key Rule**: Only rollback if migration is **backward compatible** and **not dependent** on code changes.

---

## Best Practices

### Migration Safety

**✅ DO**:
- Test on staging first (full production data)
- Keep migrations small and focused
- Use `CONCURRENTLY` for large table indexes
- Test rollback procedure
- Add index migrations separately (easier to debug)
- Document breaking changes in commit message

**❌ DON'T**:
- Create migrations with table locks on large tables
- Rename columns without backward compatibility
- Delete columns in same migration as code removal
- Assume migration will finish quickly (set timeouts)
- Deploy code that depends on unreleased migrations

### Index Naming Convention

```
idx_{table}_{columns}_{type}
idx_users_email
idx_documents_project_phase_created
idx_workflow_logs_status_gin
```

### Timestamp Columns

All tables should have:
```prisma
createdAt     DateTime  @default(now())
updatedAt     DateTime  @updatedAt
```

Prisma automatically manages `updatedAt`.

### Soft Delete Pattern

```prisma
deletedAt     DateTime?  // null = active, timestamp = deleted

// In queries:
where: { deletedAt: null }

// In indexes (faster queries):
@@index([deletedAt])  // For IS NULL queries
```

---

## Monitoring Migrations

### During Migration Execution

```bash
# Check migration progress (in another terminal)
SELECT query, now() - query_start as duration
FROM pg_stat_activity
WHERE state = 'active' AND query LIKE '%CREATE INDEX%';
```

### After Migration

```bash
# Verify all indexes were created
SELECT * FROM pg_stat_user_indexes
WHERE schemaname = 'public' AND indexname LIKE 'idx_%';

# Check for invalid indexes (failed during CONCURRENTLY)
SELECT * FROM pg_stat_user_indexes
WHERE indisvalid = false;

# Monitor slow queries
SELECT query, mean_exec_time FROM pg_stat_statements
WHERE query LIKE '%workflow%' OR query LIKE '%documents%'
ORDER BY mean_exec_time DESC LIMIT 10;
```

---

## Troubleshooting

### Migration Fails with "Relation Does Not Exist"

```
Error: relation "users" does not exist
```

**Solution**: Migration partially applied. Check state:
```bash
npx prisma migrate status

# If in "interrupted" state, resolve it:
npx prisma migrate resolve --rolled-back [name]

# Then re-run:
npx prisma migrate deploy
```

### Prisma Client Out of Sync

```
Error: @prisma/client' cannot be found
```

**Solution**: Regenerate Prisma Client:
```bash
npx prisma generate
npm install  # Reinstall if needed
```

### Migration Too Slow

```
ALTER TABLE workflow_logs ADD COLUMN ... (>30min)
```

**Solution**: Use `CONCURRENT` index building:
```sql
CREATE INDEX CONCURRENTLY idx_new_column ON table(column);
-- This doesn't lock the table for writes
```

### Foreign Key Constraint Violation

```
Error: insert or update on table "documents" violates foreign key constraint
```

**Solution**: Project was deleted but documents still reference it:
```bash
# Manually clean up
DELETE FROM documents WHERE project_id NOT IN (SELECT id FROM projects);

# Then retry migration
npx prisma migrate deploy
```

---

## Maintenance Tasks

### Monthly: Vacuum & Analyze

```bash
# Reclaim unused space
VACUUM ANALYZE;

# For specific table
VACUUM ANALYZE documents;
```

### Quarterly: Reindex Bloated Indexes

```bash
-- Find bloated indexes
SELECT * FROM pgstattuple_approx('idx_documents_project_id');

-- If bloat > 30%, rebuild
REINDEX INDEX CONCURRENTLY idx_documents_project_id;
```

### Annually: Archive Old Data

```bash
-- Move audit logs older than 1 year to archive table
INSERT INTO audit_logs_archive
SELECT * FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '1 year';

-- Similar for workflow_logs (keep last 6 months only)
DELETE FROM workflow_logs WHERE created_at < NOW() - INTERVAL '6 months';
```

---

## Environment-Specific Setup

### Development

```bash
# .env
DATABASE_URL="postgresql://localhost:5432/ki_client_portal"
```

```bash
# Setup
npx prisma migrate dev
npx prisma db seed
npx prisma studio  # Browse data visually
```

### Staging

```bash
# .env.staging
DATABASE_URL="postgresql://staging-user:pass@staging-db.railway.app:5432/ki_portal_staging"
```

```bash
# Deploy
npx prisma migrate deploy
# No seeding on staging (use production copy)
```

### Production

```bash
# .env.production (in Railway dashboard, not local)
DATABASE_URL="postgresql://prod-user:secure-pass@prod-db.railway.app:5432/ki_portal"
```

```bash
# Deploy (in CI/CD only)
npx prisma migrate deploy
# NO seeding on production!
```

---

## Prisma Commands Reference

| Command | Purpose | When to Use |
|---------|---------|-----------|
| `npx prisma migrate dev` | Generate + apply migration | Every schema change |
| `npx prisma migrate deploy` | Apply existing migrations | Production deployment |
| `npx prisma migrate status` | Check migration status | Before deploying |
| `npx prisma migrate resolve` | Mark migration as applied/rolled back | Emergency recovery |
| `npx prisma migrate reset` | Reset database (DESTRUCTIVE) | Development only |
| `npx prisma generate` | Regenerate Prisma Client | After installing package |
| `npx prisma db seed` | Run seed script | Dev environment setup |
| `npx prisma studio` | Open GUI database browser | Explore data visually |

---

## Git Workflow for Migrations

```bash
# 1. Feature branch
git checkout -b feature/add-user-avatar

# 2. Modify schema
# Edit: prisma/schema.prisma
# Add: avatar_url String?

# 3. Create migration
npx prisma migrate dev --name add_user_avatar

# 4. Commit
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(db): add user avatar URL"

# 5. Push & create PR
git push origin feature/add-user-avatar

# 6. In code review: Verify migration SQL is safe
# Check: prisma/migrations/[timestamp]_add_user_avatar/migration.sql

# 7. Merge PR

# 8. Deploy to production
# CI/CD automatically runs: npx prisma migrate deploy
```

---

## Performance During Migrations

**Index Creation**:
- Regular `CREATE INDEX`: Locks table for writes
- `CREATE INDEX CONCURRENTLY`: Allows writes, takes 2-3x longer
- **Always use CONCURRENTLY for production tables**

**Column Addition**:
- `ADD COLUMN with DEFAULT`: Fast (1-2 seconds)
- `ADD COLUMN with CHECK constraint`: Fast
- `ADD COLUMN with NOT NULL`: Slow (must scan entire table)

**Data Type Change**:
- Compatible types: Fast
- Incompatible types: Slow (requires rewrite of all rows)
- **Plan these as maintenance windows**

---

## Backup Before Major Migrations

```bash
# Full database backup
pg_dump ki_client_portal > backup-$(date +%Y%m%d).sql

# Backup specific table
pg_dump ki_client_portal -t users > users-backup.sql

# Restore if needed
psql ki_client_portal < backup-20251122.sql
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-22 | Initial migration guide - MVP ready |

---

**Status**: ✅ Ready for Backend Team Implementation

**Next Steps**:
1. Copy `prisma-schema.prisma` → `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name init`
3. Run `npx prisma db seed` for development data
4. Run `npx prisma studio` to verify schema
5. Start building API endpoints with Prisma ORM

**Questions?**: Refer to Prisma docs: https://www.prisma.io/docs/concepts/components/prisma-migrate

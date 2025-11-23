# Database Design: KI Agentur Client Portal

**Version**: 1.0 | **Date**: 2025-11-22 | **Database Administrator**: DBA Agent | **Status**: Ready for Implementation

---

## Overview

The KI Agentur Client Portal database is designed for a multi-role transparency platform serving 50 clients MVP → 500 clients Year 2. The schema supports:

- **Role-based dashboards** (CEO, CTO, PM, Admin) with isolated data views
- **Real-time n8n integration** with webhook-driven workflow status updates
- **Document management** with versioning, full-text search, and access control
- **Notification system** with user preferences and audit trails
- **Complete audit logging** for GDPR compliance and security

**Database Technology**: PostgreSQL 15+ (on Railway)
**ORM**: Prisma with TypeScript generation
**Scale**: 50-1,500 users, 50-500 projects, 2,500-50,000 documents
**Performance Targets**: Health score <200ms, Document search <500ms, List endpoints <300ms

---

## Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KI AGENTUR CLIENT PORTAL - ERD                   │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐              ┌────────────────────────┐
│      users           │              │     projects           │
├──────────────────────┤              ├────────────────────────┤
│ PK id                │              │ PK id                  │
│    email (UX)        │──┐           │    name                │
│    password_hash     │  │           │    description         │
│    first_name        │  │           │    owner_id (FK) ──────┼──┐
│    last_name         │  │           │    health_score        │  │
│    role              │  │           │    status              │  │
│    deleted_at        │  │           │    created_at (IX)     │  │
│    created_at        │  │           │    updated_at          │  │
│    updated_at        │  │           │    deleted_at          │  │
│    last_login        │  │           └────────────────────────┘  │
└──────────────────────┘  │                     │                  │
         │                │                     │ 1:N              │
         │                │           ┌─────────▼──────────┐       │
         │                │           │   documents        │       │
         │ N:1            │           ├────────────────────┤       │
         │                │           │ PK id              │       │
         │                │           │    project_id (FK) │───────┤
         │                │           │    name (IX)       │       │
         │                │           │    phase           │       │
         │                │           │    file_path       │       │
         │                │           │    version         │       │
         │                │           │    uploader_id (FK)│──┐    │
         │                │           │    search_vector   │  │    │
         │                │           │    created_at (IX) │  │    │
         │                │           │    updated_at      │  │    │
         │                │           │    deleted_at      │  │    │
         │                │           └────────────────────┘  │    │
         │                │                   │               │    │
         │                │                   │ N:M (permissions)  │
         │                │           ┌───────▼──────────────────┐ │
         │                │           │  document_permissions    │ │
         │                │           ├────────────────────────┤ │
         │                │           │ PK id                  │ │
         │                │           │    document_id (FK)    │ │
         │                │           │    role                │ │
         │                │           │    permission_level    │ │
         │                │           │    created_at          │ │
         │                │           └────────────────────────┘ │
         │                │                                       │
         │                │   ┌──────────────────────────┐        │
         │                │   │  workflow_logs           │        │
         │                │   ├──────────────────────────┤        │
         │                │   │ PK id                    │        │
         │                │   │    project_id (FK) ──────┼────────┤
         │                │   │    n8n_workflow_id       │        │
         │                │   │    status                │        │
         │                │   │    execution_time_ms     │        │
         │                │   │    error_message         │        │
         │                │   │    execution_details     │        │
         │                │   │    created_at (IX)       │        │
         │                │   └──────────────────────────┘        │
         │                │                                       │
         │                └───────────────────────────────────────┘
         │
         │                ┌──────────────────────────┐
         │                │   notifications          │
         │                ├──────────────────────────┤
         │                │ PK id                    │
         │                │    user_id (FK) ─────────┼─┐
         │                │    type                  │ │
         │                │    title                 │ │
         │                │    body                  │ │
         │                │    data (JSON)           │ │
         │                │    read_at               │ │
         │                │    created_at (IX)       │ │
         │                └──────────────────────────┘ │
         │                                             │
         │                ┌──────────────────────────┐ │
         │                │ notification_preferences │ │
         │                ├──────────────────────────┤ │
         │                │ PK id                    │ │
         │                │    user_id (FK) ─────────┘ │
         │                │    type                    │
         │                │    enabled                 │
         │                │    delivery_method         │
         │                │    updated_at              │
         │                └──────────────────────────┘ │
         │                                             │
         └─────────────────────────────────────────────┘
                      N (many users per project)

┌──────────────────────────────┐
│     audit_logs               │
├──────────────────────────────┤
│ PK id                        │
│    user_id (FK) ────────────┤─→ users
│    resource_type             │
│    resource_id               │
│    action                    │
│    changes (JSON)            │
│    ip_address                │
│    user_agent                │
│    created_at (IX)           │
└──────────────────────────────┘

┌──────────────────────────────┐
│     api_keys                 │
├──────────────────────────────┤
│ PK id                        │
│    project_id (FK) ─────────┤─→ projects
│    user_id (FK) ────────────┤─→ users
│    key_hash (UX)             │ (HMAC-SHA256)
│    name                      │
│    last_used_at              │
│    revoked_at                │
│    created_at                │
└──────────────────────────────┘

┌──────────────────────────────┐
│     sessions                 │
├──────────────────────────────┤
│ PK id                        │
│    user_id (FK) ────────────┤─→ users
│    access_token_hash         │ (secure storage)
│    refresh_token_hash        │
│    ip_address                │
│    user_agent                │
│    device_info (JSON)        │
│    expires_at                │
│    created_at                │
│    last_activity_at          │
└──────────────────────────────┘

Key:
- PK = Primary Key
- FK = Foreign Key
- UX = Unique Index
- IX = Regular Index
- 1:N = One-to-Many relationship
- N:M = Many-to-Many relationship (through junction table)
```

---

## Complete Schema Definitions

### Prisma Schema (`prisma/schema.prisma`)

```prisma
// Prisma schema for KI Agentur Client Portal
// Database: PostgreSQL 15+
// Generated types: TypeScript (automatic)

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================================================
// USERS & AUTHENTICATION
// ============================================================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique @db.VarChar(255)
  passwordHash  String    @db.VarChar(255) // bcrypt hash, never plaintext
  firstName     String?   @db.VarChar(100)
  lastName      String?   @db.VarChar(100)
  role          UserRole  @default(USER) // CEO, CTO, PM, Admin
  projectId     String?   // Can be null for admin users
  project       Project?  @relation(fields: [projectId], references: [id], onDelete: SetNull)

  // Relations
  createdProjects Project[]      @relation("project_owner")
  documents       Document[]     @relation("document_uploader")
  notifications   Notification[]
  apiKeys         ApiKey[]
  sessions        Session[]
  auditLogs       AuditLog[]

  // Soft delete & timestamps
  deletedAt     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLogin     DateTime?
  lastActivityAt DateTime? @default(now())

  // Indexes for common queries
  @@index([email]) // Login lookups
  @@index([projectId]) // List users by project
  @@index([createdAt])
  @@index([deletedAt]) // Soft delete filtering

  // Full-text search support
  @@fulltext([email, firstName, lastName]) // For user search
}

enum UserRole {
  CEO
  CTO
  PM
  ADMIN
}

// ============================================================================
// PROJECTS & CORE ENTITIES
// ============================================================================

model Project {
  id            String    @id @default(cuid())
  name          String    @db.VarChar(255)
  description   String?   @db.Text
  ownerId       String    // FK to users
  owner         User      @relation("project_owner", fields: [ownerId], references: [id], onDelete: Cascade)

  // Health metrics
  healthScore   Int       @default(100) @db.SmallInt // 0-100
  status        ProjectStatus @default(ON_TRACK)

  // Relations
  documents     Document[]
  workflowLogs  WorkflowLog[]
  apiKeys       ApiKey[]

  // Soft delete & timestamps
  deletedAt     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Indexes for common queries
  @@index([ownerId]) // List projects by owner
  @@index([status]) // Filter by status
  @@index([createdAt])
  @@index([deletedAt])
}

enum ProjectStatus {
  ON_TRACK
  AT_RISK
  BLOCKED
}

// ============================================================================
// DOCUMENTS & FILE MANAGEMENT
// ============================================================================

model Document {
  id            String    @id @default(cuid())
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)

  name          String    @db.VarChar(500)
  phase         DocumentPhase @default(REQUIREMENTS)
  filePath      String    @db.VarChar(1024) // S3 key path
  fileSize      BigInt    @default(0) // Bytes
  mimeType      String?   @db.VarChar(100) // e.g., "application/pdf"
  version       Int       @default(1) // Incremented on each upload
  uploaderId    String
  uploader      User      @relation("document_uploader", fields: [uploaderId], references: [id], onDelete: SetNull)

  // Full-text search field (generated from name + content metadata)
  searchVector  String?   @db.Text // Store indexed text for search

  // Relations
  permissions   DocumentPermission[]

  // Soft delete & timestamps
  deletedAt     DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Indexes
  @@index([projectId]) // List documents by project
  @@index([phase]) // Filter by phase
  @@index([uploaderId])
  @@index([createdAt]) // Sort by upload date
  @@index([deletedAt])
  @@fulltext([name, searchVector]) // Full-text search

  // Unique constraint per phase per project
  @@unique([projectId, name, version])
}

enum DocumentPhase {
  REQUIREMENTS
  DESIGN
  DEVELOPMENT
  TESTING
  DEPLOYMENT
}

model DocumentPermission {
  id            String    @id @default(cuid())
  documentId    String
  document      Document  @relation(fields: [documentId], references: [id], onDelete: Cascade)

  role          UserRole  // Role that gets this permission
  permissionLevel PermissionLevel

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Indexes
  @@index([documentId])
  @@index([role])
  @@unique([documentId, role]) // One permission level per role
}

enum PermissionLevel {
  NONE          // No access
  READ_ONLY     // View only
  DOWNLOAD      // Can download
  EDIT          // Can edit metadata
}

// ============================================================================
// n8n WORKFLOW INTEGRATION
// ============================================================================

model WorkflowLog {
  id            String    @id @default(cuid())
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)

  n8nWorkflowId String    @db.VarChar(255) // ID from n8n
  n8nWorkflowName String  @db.VarChar(500) // Name from n8n
  executionId   String    @db.VarChar(255) // Unique per execution

  status        WorkflowStatus
  executionTimeMs Int?    @db.Integer // Milliseconds
  errorMessage  String?   @db.Text

  // Full execution details stored as JSON
  executionDetails Json?  @db.JsonB // PostgreSQL JSONB for efficient querying

  // Input/output data (often large)
  inputData     Json?     @db.JsonB
  outputData    Json?     @db.JsonB

  // Indexes
  @@index([projectId]) // Common filter
  @@index([n8nWorkflowId])
  @@index([status])
  @@index([createdAt]) // For sorting recent executions
  @@index([executionId]) // Unique lookup

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum WorkflowStatus {
  SUCCESS
  FAILED
  IN_PROGRESS
  TIMEOUT
  ERROR
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

model Notification {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  type          NotificationType
  title         String    @db.VarChar(255)
  body          String    @db.Text
  data          Json?     @db.JsonB // Context data (e.g., document_id, workflow_id)

  // Read status
  readAt        DateTime?

  // Indexes
  @@index([userId]) // List user notifications
  @@index([type])
  @@index([readAt]) // Find unread
  @@index([createdAt])

  createdAt     DateTime  @default(now())
}

enum NotificationType {
  WORKFLOW_COMPLETED
  WORKFLOW_FAILED
  MILESTONE_COMPLETED
  DOCUMENT_UPLOADED
  BLOCKER_CREATED
  WEEKLY_SUMMARY
  ACCESS_REQUEST
}

model NotificationPreference {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Notification type settings
  workflowCompleted Boolean @default(true)
  workflowFailed    Boolean @default(true)
  milestoneCompleted Boolean @default(true)
  documentUploaded  Boolean @default(true)
  blockerCreated    Boolean @default(true)
  weeklySummary     Boolean @default(true)

  // Delivery preferences
  emailEnabled      Boolean @default(true)
  inAppEnabled      Boolean @default(true)

  // Frequency
  emailFrequency    EmailFrequency @default(IMMEDIATE) // IMMEDIATE, DAILY, WEEKLY

  updatedAt     DateTime  @updatedAt
}

enum EmailFrequency {
  IMMEDIATE
  DAILY
  WEEKLY
  NEVER
}

// ============================================================================
// API KEYS & DEVELOPER ACCESS
// ============================================================================

model ApiKey {
  id            String    @id @default(cuid())
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: SetNull)

  name          String    @db.VarChar(255)
  keyHash       String    @db.VarChar(255) @unique // HMAC-SHA256 hashed key (never store plaintext)

  // Usage tracking
  lastUsedAt    DateTime?
  revokedAt     DateTime? // If revoked, api key is invalid

  // Indexes
  @@index([projectId])
  @@index([userId])
  @@index([keyHash])
  @@index([revokedAt]) // Filter for valid keys

  createdAt     DateTime  @default(now())
}

// ============================================================================
// SESSIONS & SECURITY
// ============================================================================

model Session {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  accessTokenHash String? @db.VarChar(255) // Don't store actual token, hash it
  refreshTokenHash String? @db.VarChar(255)

  // Device info
  ipAddress     String?   @db.VarChar(45) // IPv6 max 45 chars
  userAgent     String?   @db.Text
  deviceInfo    Json?     @db.JsonB // Browser, OS, device type

  // Expiration
  expiresAt     DateTime

  // Activity tracking
  lastActivityAt DateTime @default(now())

  // Indexes
  @@index([userId])
  @@index([expiresAt]) // Find expired sessions for cleanup
  @@index([lastActivityAt])

  createdAt     DateTime  @default(now())
}

// ============================================================================
// AUDIT LOGGING & COMPLIANCE
// ============================================================================

model AuditLog {
  id            String    @id @default(cuid())
  userId        String?   // Null for system actions
  user          User?     @relation(fields: [userId], references: [id], onDelete: SetNull)

  resourceType  String    @db.VarChar(100) // "Document", "User", "Project", etc.
  resourceId    String    @db.VarChar(255)
  action        AuditAction

  // What changed
  changes       Json?     @db.JsonB // { before: {}, after: {} }

  // Request context
  ipAddress     String?   @db.VarChar(45)
  userAgent     String?   @db.Text

  // Indexes
  @@index([userId])
  @@index([resourceType])
  @@index([resourceId])
  @@index([action])
  @@index([createdAt]) // Find logs in date range

  createdAt     DateTime  @default(now())
}

enum AuditAction {
  CREATE
  READ
  UPDATE
  DELETE
  DOWNLOAD
  SEARCH
  LOGIN
  LOGOUT
  REVOKE_API_KEY
  UPDATE_PERMISSION
}

// ============================================================================
// DATA MODELS (Metadata/Type Support)
// ============================================================================

// Optional: If you need to store webhook events for debugging
model WebhookEvent {
  id            String    @id @default(cuid())
  projectId     String
  eventType     String    @db.VarChar(255)

  payload       Json      @db.JsonB // Full webhook payload

  // Processing status
  processed     Boolean   @default(false)
  processedAt   DateTime?
  error         String?   @db.Text

  @@index([projectId])
  @@index([processed])
  @@index([createdAt])

  createdAt     DateTime  @default(now())
}

// ============================================================================
// INDEXES SUMMARY
// ============================================================================
// All tables have:
// - Primary key (id)
// - createdAt for temporal queries
// - deletedAt where applicable (soft deletes)
// - Foreign keys are indexed for JOIN performance
//
// Performance-critical indexes:
// - users.email: Login lookups
// - documents.projectId + documents.phase: List by project
// - workflow_logs.projectId: Dashboard health calculation
// - notifications.userId: Notification center
// - workflow_logs.createdAt DESC: Recent executions
```

---

## Indexes Strategy

### Index Inventory & Rationale

| Table | Index | Columns | Type | Purpose | Est. Size |
|-------|-------|---------|------|---------|-----------|
| users | idx_email | email | UNIQUE | Email lookups (login) | 1 MB |
| users | idx_projectId | projectId | BTREE | List users by project | 500 KB |
| users | idx_createdAt | createdAt | BTREE | Sorting, date range queries | 500 KB |
| projects | idx_ownerId | ownerId | BTREE | List projects by owner | 500 KB |
| projects | idx_status | status | BTREE | Filter by status | 250 KB |
| documents | idx_projectId | projectId | BTREE | List documents by project (most common) | 2 MB |
| documents | idx_phase | phase | BTREE | Filter by phase (requirements, design, etc.) | 500 KB |
| documents | idx_createdAt | createdAt DESC | BTREE | Sort recent documents | 1 MB |
| documents | idx_fulltext | name, searchVector | GIN | Full-text search (find docs) | 5 MB |
| workflow_logs | idx_projectId | projectId | BTREE | Dashboard health score query | 3 MB |
| workflow_logs | idx_n8nWorkflowId | n8nWorkflowId | BTREE | Lookup by n8n ID | 1 MB |
| workflow_logs | idx_createdAt | createdAt DESC | BTREE | Recent executions | 2 MB |
| notifications | idx_userId | userId | BTREE | Notification center | 2 MB |
| notifications | idx_readAt | readAt | BTREE | Find unread notifications | 1 MB |
| api_keys | idx_projectId | projectId | BTREE | List API keys by project | 500 KB |
| api_keys | idx_keyHash | keyHash | UNIQUE | Verify API key validity | 500 KB |
| audit_logs | idx_userId | userId | BTREE | User activity trail | 3 MB |
| audit_logs | idx_resourceId | resourceId | BTREE | Audit by resource | 2 MB |
| audit_logs | idx_createdAt | createdAt | BTREE | Date range queries | 2 MB |
| sessions | idx_userId | userId | BTREE | List user sessions | 1 MB |
| sessions | idx_expiresAt | expiresAt | BTREE | Cleanup expired sessions | 500 KB |

### Composite Indexes for Hot Queries

```sql
-- Health score calculation (most frequent query)
CREATE INDEX idx_workflow_logs_project_status_created
  ON workflow_logs(project_id, status, created_at DESC)
  WHERE deleted_at IS NULL;
-- Used by: SELECT status, COUNT(*) FROM workflow_logs
--          WHERE project_id = ? AND created_at > ?
--          GROUP BY status

-- Document listing by project and phase
CREATE INDEX idx_documents_project_phase_created
  ON documents(project_id, phase, created_at DESC)
  WHERE deleted_at IS NULL;
-- Used by: SELECT * FROM documents
--          WHERE project_id = ? AND phase = ?
--          ORDER BY created_at DESC LIMIT 20

-- Recent user activity (for audit/security)
CREATE INDEX idx_audit_logs_user_created
  ON audit_logs(user_id, created_at DESC);
```

### Full-Text Search Indexes

```sql
-- Document search (name + content)
CREATE INDEX idx_documents_search_full
  ON documents USING GIN(to_tsvector('english', name || ' ' || search_vector))
  WHERE deleted_at IS NULL;

-- User search (email, firstName, lastName)
CREATE INDEX idx_users_search
  ON users USING GIN(to_tsvector('english', email || ' ' || COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')))
  WHERE deleted_at IS NULL;
```

### Partial Indexes (Soft Deletes)

```sql
-- Only active documents (speed up queries that filter deletedAt)
CREATE INDEX idx_documents_active
  ON documents(project_id)
  WHERE deleted_at IS NULL;

-- Only unread notifications
CREATE INDEX idx_notifications_unread
  ON notifications(user_id)
  WHERE read_at IS NULL;

-- Only valid API keys
CREATE INDEX idx_api_keys_valid
  ON api_keys(project_id)
  WHERE revoked_at IS NULL;
```

---

## Data Access Patterns

### Pattern 1: Dashboard Health Score (CTO/CEO Dashboard)
**Use Case**: Calculate health score from recent workflows
**Frequency**: Every 30 seconds (polling)
**Performance Target**: < 200ms

```sql
-- Get workflow success rate from last 7 days
SELECT
  COUNT(*) as total_executions,
  COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END) as successful,
  ROUND(100.0 * COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END) / COUNT(*), 2) as success_rate
FROM workflow_logs
WHERE project_id = $1
  AND created_at > NOW() - INTERVAL '7 days'
  AND status NOT IN ('IN_PROGRESS');

-- Index used: idx_workflow_logs_project_status_created
-- Optimization: Only recent data (7 days), filtered by status (partialable)
```

### Pattern 2: Document List by Project (PM Dashboard)
**Use Case**: List documents organized by phase
**Frequency**: Page load (20 docs per page)
**Performance Target**: < 300ms

```sql
SELECT id, name, phase, file_size, version,
       uploader_id, created_at, updated_at
FROM documents
WHERE project_id = $1
  AND deleted_at IS NULL
  AND phase = $2  -- Filter by phase (requirements, design, etc.)
ORDER BY created_at DESC
LIMIT 20 OFFSET $3;

-- Indexes used: idx_documents_project_phase_created
-- Optimization: Composite index covers all columns (covering index)
```

### Pattern 3: Full-Text Document Search (All Roles)
**Use Case**: Find documents by keyword
**Frequency**: On-demand user search
**Performance Target**: < 500ms

```sql
SELECT id, name, phase, version, created_at,
       ts_rank(search_vector, to_tsquery('english', $2)) as relevance
FROM documents
WHERE project_id = $1
  AND deleted_at IS NULL
  AND to_tsvector('english', name || ' ' || search_vector) @@ to_tsquery('english', $2)
ORDER BY relevance DESC, created_at DESC
LIMIT 20;

-- Index used: idx_documents_search_full (GIN)
-- Optimization: Full-text search with ranking, project-scoped
```

### Pattern 4: Notification Center (All Roles)
**Use Case**: Get unread notifications
**Frequency**: Page load + notification badge
**Performance Target**: < 100ms

```sql
SELECT id, type, title, body, data, created_at, read_at
FROM notifications
WHERE user_id = $1
  AND read_at IS NULL
ORDER BY created_at DESC
LIMIT 20;

-- Index used: idx_notifications_unread
-- Optimization: Partial index on unread only
```

### Pattern 5: Recent Workflow Executions (CTO Technical Logs)
**Use Case**: View recent n8n execution logs
**Frequency**: CTO dashboard refresh (30s polling)
**Performance Target**: < 250ms

```sql
SELECT id, n8n_workflow_id, n8n_workflow_name,
       status, execution_time_ms, error_message, created_at
FROM workflow_logs
WHERE project_id = $1
  AND status != 'IN_PROGRESS'
ORDER BY created_at DESC
LIMIT 50;

-- Index used: idx_workflow_logs_project_status_created
-- Optimization: Exclude in-progress (noise), recent first
```

### Pattern 6: Audit Trail (Admin/Compliance)
**Use Case**: Find all changes to a resource or user
**Frequency**: Admin dashboard, compliance audits
**Performance Target**: < 500ms

```sql
SELECT user_id, action, changes, ip_address, created_at
FROM audit_logs
WHERE resource_type = $1
  AND resource_id = $2
  AND created_at > $3  -- Date range filter
ORDER BY created_at DESC
LIMIT 100;

-- Indexes used: idx_audit_logs_resourceId, idx_audit_logs_createdAt
-- Optimization: Composite index for resource + date
```

### Pattern 7: User Session Check (Every API Request)
**Use Case**: Validate JWT token against session DB
**Frequency**: Every single API request
**Performance Target**: < 50ms (critical!)

```sql
SELECT user_id, expires_at, last_activity_at
FROM sessions
WHERE id = $1
  AND expires_at > NOW();

-- Index used: idx_sessions_userId + primary key lookup
-- Optimization: Very fast point query, need on-disk caching (Redis in future)
```

### Pattern 8: API Key Validation (Webhook/API Requests)
**Use Case**: Verify API key for webhook/API access
**Frequency**: Every authenticated API request
**Performance Target**: < 50ms

```sql
SELECT project_id, last_used_at
FROM api_keys
WHERE key_hash = $1
  AND revoked_at IS NULL;

-- Index used: idx_api_keys_keyHash (unique)
-- Optimization: Fast lookup by hash
```

---

## Caching Strategy

### Cache Layers

```
1. Database Query Cache (Application Level - Redis)
   ├─ Health scores: 30-second TTL (cleared on webhook)
   ├─ Document metadata: 5-minute TTL
   ├─ User permissions: 1-hour TTL (cleared on role change)
   ├─ API key validation: 5-minute TTL
   └─ Notification preferences: 1-hour TTL

2. Session Cache (Redis)
   ├─ Active session tokens
   ├─ User role + project scope
   └─ Revoked API keys

3. Browser Cache (HTTP)
   ├─ Static JS/CSS: Cache-Control: max-age=31536000
   ├─ API responses: Cache-Control: max-age=300 (TanStack Query)
   └─ Documents: Conditional GET with ETags
```

### Cache Invalidation Events

```
Event: n8n Workflow Webhook Received
→ Invalidate: health_score::{projectId}
→ Invalidate: workflow_logs::{projectId}
→ Action: Update health_score immediately

Event: Document Uploaded
→ Invalidate: documents::{projectId}
→ Invalidate: notification_preferences (may need to send notification)
→ Action: Update document list, send notification

Event: User Role Changed
→ Invalidate: user_permissions::{userId}
→ Action: Expire user sessions, force re-auth

Event: API Key Revoked
→ Invalidate: api_key_valid::{keyHash}
→ Action: Immediate, no grace period
```

---

## Migrations Strategy

### Phase 1: Initial Schema (MVP Launch)

**File**: `prisma/migrations/001_init/migration.sql`

```sql
-- KI Agentur Client Portal - Initial Schema
-- MVP: Users, Projects, Documents, Workflows, Notifications

-- Create UUID extension (if not exists)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For LIKE indexes

-- Create all tables from Prisma schema
-- (Prisma handles this with `npx prisma migrate dev`)

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes (Prisma generates these, but explicit for clarity)
CREATE INDEX CONCURRENTLY idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_users_project_id ON users(project_id) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_projects_owner_id ON projects(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_documents_project_id ON documents(project_id) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_documents_phase ON documents(phase) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_workflow_logs_project_id ON workflow_logs(project_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_notifications_user_id ON notifications(user_id);

-- Create full-text search indexes
CREATE INDEX CONCURRENTLY idx_documents_search
    ON documents USING gin(to_tsvector('english', name));

CREATE INDEX CONCURRENTLY idx_users_search
    ON users USING gin(to_tsvector('english', email || ' ' || COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')))
    WHERE deleted_at IS NULL;

-- Create audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    action VARCHAR(20) NOT NULL,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Grant permissions to application user
-- (Specific to your Railway/PostgreSQL setup)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

**Rollback**: Prisma handles automatically with `npx prisma migrate resolve --rolled-back 001_init`

### Phase 2: Add Soft Deletes & Security Fields

**File**: `prisma/migrations/002_add_soft_deletes_security/migration.sql`

```sql
-- Add deleted_at to existing tables
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE projects ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE documents ADD COLUMN deleted_at TIMESTAMP;

-- Create indexes for soft delete filtering
CREATE INDEX CONCURRENTLY idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_projects_deleted_at ON projects(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_documents_deleted_at ON documents(deleted_at) WHERE deleted_at IS NOT NULL;

-- Add API keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    last_used_at TIMESTAMP,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX CONCURRENTLY idx_api_keys_project_id ON api_keys(project_id);
CREATE INDEX CONCURRENTLY idx_api_keys_key_hash ON api_keys(key_hash);

-- Add sessions table for JWT management
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_token_hash VARCHAR(255),
    refresh_token_hash VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_info JSONB,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX CONCURRENTLY idx_sessions_user_id ON sessions(user_id);
CREATE INDEX CONCURRENTLY idx_sessions_expires_at ON sessions(expires_at);
```

### Phase 3: Add Full-Text Search & Composite Indexes

**File**: `prisma/migrations/003_add_fulltext_search/migration.sql`

```sql
-- Add search_vector column for full-text search
ALTER TABLE documents ADD COLUMN search_vector TSVECTOR;

-- Populate initial search_vector
UPDATE documents SET search_vector = to_tsvector('english', name);

-- Create function to keep search_vector updated
CREATE OR REPLACE FUNCTION update_documents_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', NEW.name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_search_vector BEFORE INSERT OR UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_documents_search_vector();

-- Create GIN index for full-text search
CREATE INDEX CONCURRENTLY idx_documents_search_gin
    ON documents USING gin(search_vector);

-- Composite indexes for hot queries
CREATE INDEX CONCURRENTLY idx_documents_project_phase_created
    ON documents(project_id, phase, created_at DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY idx_workflow_logs_project_status_created
    ON workflow_logs(project_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY idx_audit_logs_user_created
    ON audit_logs(user_id, created_at DESC);
```

### Migration Deployment Checklist

Before deploying a migration to production:

```
✓ Migration tested locally
✓ Migration tested on staging database
✓ Rollback procedure tested
✓ Estimated impact assessed (table locks, indexes)
✓ No downtime-causing operations (all CONCURRENTLY)
✓ Backwards compatible with current code
✓ No removal of columns/tables (safe for rollback)
```

**Deployment Command**:
```bash
# In CI/CD before code deployment
npx prisma migrate deploy

# Monitor for slow queries
SELECT query, mean_time, calls FROM pg_stat_statements
WHERE query LIKE '%documents%' OR query LIKE '%workflow%'
ORDER BY mean_time DESC LIMIT 10;
```

---

## Data Integrity & Security

### Constraints

**Primary Keys**: UUID (cuid) on all tables
```prisma
id String @id @default(cuid())
```

**Foreign Keys**: Cascading deletes where appropriate
```prisma
project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
user User @relation(fields: [userId], references: [id], onDelete: SetNull)
```

**Unique Constraints**:
```prisma
// Email unique per user (critical for login)
email String @unique

// API key hash unique (security)
keyHash String @unique

// One permission per role per document
@@unique([documentId, role])
```

**Check Constraints** (data validation):
```sql
ALTER TABLE projects ADD CONSTRAINT check_health_score_valid
    CHECK (health_score >= 0 AND health_score <= 100);

ALTER TABLE documents ADD CONSTRAINT check_file_size_positive
    CHECK (file_size >= 0);
```

### Soft Deletes

All user-facing entities support soft deletes:

```prisma
deletedAt DateTime?
// In queries: WHERE deleted_at IS NULL
// In indexes: WHERE deleted_at IS NULL (partial indexes)
```

**Rationale**:
- Data recovery capability (GDPR right to access)
- Audit trail preservation
- Referential integrity maintained
- Fast "deletion" (just timestamp update)

### Sensitive Data Protection

**Passwords**: bcrypt hashing (12 salt rounds)
```javascript
const hash = await bcrypt.hash(plainPassword, 12);
// Never store plaintext
```

**API Keys**: HMAC-SHA256 hashed before storage
```javascript
const keyHash = crypto
  .createHmac('sha256', APP_SECRET)
  .update(plainKey)
  .digest('hex');
// Never store plaintext key
```

**Tokens**: Hashed in session table
```javascript
const tokenHash = crypto
  .createHash('sha256')
  .update(token)
  .digest('hex');
// Store hash, not token
```

**Personal Data** (GDPR compliance):
```javascript
// Mark columns with personal data
email, firstName, lastName, ipAddress

// GDPR right-to-erasure: set to NULL or anonymize
UPDATE users SET email = NULL, first_name = 'DELETED_USER_' || id,
                 last_name = '', deleted_at = NOW()
WHERE id = $1;
```

### Audit Logging

Every action logged for compliance:

```prisma
model AuditLog {
  userId String? // Who did it (null for system)
  resourceType String // What resource
  resourceId String // Which resource
  action AuditAction // What action (CREATE, UPDATE, DELETE, READ, DOWNLOAD)
  changes Json? // What changed (before/after)
  ipAddress String? // From where
  userAgent String? // What device/browser
}

// Examples:
// - User downloads document → READ action
// - Admin changes user role → UPDATE action
// - Document uploaded → CREATE action
// - Workflow executed → relevant state change
```

**Sensitive Operations with Audit**:
- Document access (who viewed what, when)
- Role changes (who changed what access)
- API key rotation (security audit trail)
- Login/logout (security audit trail)
- Data exports (compliance trail)

### Row-Level Security (Future - Year 2)

When moving to multi-tenant:

```sql
-- Enable RLS on sensitive tables
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see documents from their project
CREATE POLICY documents_project_isolation ON documents
  FOR ALL USING (project_id IN (
    SELECT project_id FROM users WHERE id = current_user_id
  ));
```

---

## Performance Optimization

### Query Performance Targets

| Query | Target | Optimization |
|-------|--------|--------------|
| Health score calculation | <200ms | Indexed, cached 30s |
| Document list | <300ms | Composite index, pagination |
| Document search | <500ms | Full-text index (GIN) |
| Login (email lookup) | <50ms | Unique index |
| API key validation | <50ms | Point query on hash |
| Notification center | <100ms | Partial index on unread |
| Recent workflows | <250ms | Time-series optimized |
| Audit log search | <500ms | Date range + resource index |

### Database Connection Pool Configuration

```javascript
// In backend .env
DATABASE_URL="postgresql://user:pass@host/dbname?connection_limit=20&pool_timeout=45"

// Prisma client config
prisma {
  engine_type = "library"
  connection_timeout = 45
  pool_size = 10
  statement_cache_size = 200
}

// For horizontal scaling: increase pool_size per instance
// Single instance: 10-20 connections
// 4 instances: 5 connections per instance (total 20)
```

### Query Optimization Patterns

**N+1 Prevention** (critical!):
```javascript
// WRONG: N+1 problem
const projects = await prisma.project.findMany();
for (const project of projects) {
  const docs = await prisma.document.findMany({ where: { projectId: project.id } });
  // This runs N additional queries
}

// CORRECT: Use eager loading
const projects = await prisma.project.findMany({
  include: {
    documents: true  // Fetches in single query with JOIN
  }
});
```

**Pagination** (for large result sets):
```javascript
// CORRECT: Paginate instead of fetching all
const page = await prisma.document.findMany({
  where: { projectId, deletedAt: null },
  skip: (pageNum - 1) * 20,
  take: 20,
  orderBy: { createdAt: 'desc' }
});

// Even better: cursor-based pagination (offset-free)
const page = await prisma.document.findMany({
  where: { projectId, deletedAt: null },
  skip: 1, // Skip the cursor
  take: 20,
  cursor: { id: lastDocumentId }, // Continue from here
  orderBy: { createdAt: 'desc' }
});
```

**Select Only Needed Fields**:
```javascript
// Don't fetch everything, select specific fields
const documents = await prisma.document.findMany({
  where: { projectId },
  select: {
    id: true,
    name: true,
    phase: true,
    createdAt: true,
    version: true
    // Don't select: searchVector, executionDetails (large JSON)
  }
});
```

### Slow Query Monitoring

```sql
-- Enable slow query logging in PostgreSQL
ALTER SYSTEM SET log_min_duration_statement = 200; -- Log queries >200ms
SELECT pg_reload_conf();

-- Find slow queries
SELECT query, mean_exec_time, calls FROM pg_stat_statements
WHERE mean_exec_time > 200
ORDER BY mean_exec_time DESC;

-- Analyze slow query plan
EXPLAIN ANALYZE SELECT * FROM documents WHERE project_id = 'xxx' ...;
```

---

## Scalability Plan

### MVP (50 clients)

```
Single database instance: 10GB PostgreSQL
Single application instance: 2GB RAM
No Redis caching needed yet
Expected: <500 concurrent users, <1000 QPS
```

### Year 1 (200 clients)

```
Same as MVP, with monitoring
Consider: Redis caching for sessions
Monitor: Query performance, database growth
Expected: <2,000 concurrent users, <3000 QPS
```

### Year 2 (500 clients) - Scaling Phase

**Database Scaling**:
```
Primary database: Write-only
Read replicas: 2-3 for SELECT queries
Replication lag: <1 second acceptable
Partition large tables by project_id for archival
```

**Query Optimization**:
```
Archive old audit logs (>1 year) → S3
Archive old workflow logs (>1 year) → S3
Materialized views for dashboard calculations (refresh every 30s)
```

**Caching Layer** (Redis):
```
Session storage (replaces database for auth)
Health score cache (5-minute TTL, webhook invalidation)
Document metadata cache (1-hour TTL)
User role cache (1-hour TTL, cleared on change)
```

**Application Scaling**:
```
Multiple API instances with load balancer
Stateless applications (all state in Redis/DB)
Job queue for async tasks (email, document processing)
```

---

## Seed Data (Development)

### File: `prisma/seed.ts`

```typescript
import { PrismaClient, UserRole, ProjectStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('password123', 12),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  const ctoUser = await prisma.user.create({
    data: {
      email: 'cto@example.com',
      passwordHash: await bcrypt.hash('password123', 12),
      firstName: 'CTO',
      lastName: 'User',
      role: UserRole.CTO,
    },
  });

  // Create test project
  const project = await prisma.project.create({
    data: {
      name: 'Sample Project',
      description: 'Development test project',
      ownerId: adminUser.id,
      healthScore: 85,
      status: ProjectStatus.ON_TRACK,
    },
  });

  // Create sample documents
  await prisma.document.create({
    data: {
      projectId: project.id,
      name: 'Requirements Document.pdf',
      phase: 'REQUIREMENTS',
      filePath: 's3://bucket/project/requirements.pdf',
      fileSize: 2048000,
      mimeType: 'application/pdf',
      uploaderId: adminUser.id,
    },
  });

  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run seed**:
```bash
npx prisma db seed
```

---

## Development Guidelines

### Local Setup

```bash
# 1. Database setup
createdb ki_client_portal
export DATABASE_URL="postgresql://localhost/ki_client_portal"

# 2. Apply migrations
npx prisma migrate dev --name init

# 3. Seed development data
npx prisma db seed

# 4. View database
npx prisma studio  # Opens GUI at http://localhost:5555
```

### Creating Migrations

```bash
# 1. Modify prisma/schema.prisma

# 2. Generate migration (creates .sql file)
npx prisma migrate dev --name "descriptive_migration_name"

# 3. Review generated SQL
# 4. Test migrations work
# 5. Commit both schema.prisma and migration files

# Rollback if needed (local only)
npx prisma migrate resolve --rolled-back migration_name
```

### Testing Queries

```bash
# 1. Use Prisma Client in scripts
npx ts-node scripts/test-query.ts

# 2. Or use `prisma studio` GUI
npx prisma studio

# 3. Or connect with psql
psql postgresql://localhost/ki_client_portal
SELECT * FROM users;
```

---

## Deployment Guidelines

### Pre-Deployment Checklist

```
✓ Migrations tested on staging database
✓ Rollback procedure tested
✓ EXPLAIN ANALYZE on new queries
✓ Indexes created concurrently (no locks)
✓ No data loss possible (only additive changes)
✓ Backward compatible with current code
✓ Backup created before deployment
✓ Monitoring configured for slow queries
```

### Production Deployment Steps

```bash
# 1. Code deployed to production
# 2. Run migrations (automatically in CI/CD or manually)
npx prisma migrate deploy

# 3. Verify migrations applied
npx prisma migrate status

# 4. Monitor performance
SELECT query, mean_exec_time FROM pg_stat_statements
WHERE query LIKE '%documents%' ORDER BY mean_exec_time DESC;

# 5. If rollback needed
npx prisma migrate resolve --rolled-back migration_name
```

### Post-Deployment Verification

```
✓ Health check endpoints responding (200 OK)
✓ Login working (email + password)
✓ Dashboard loading < 2 seconds
✓ Document upload/search working
✓ n8n webhook integration working
✓ No new errors in Sentry
✓ Query performance within targets (<200ms for health score)
```

---

## Monitoring & Maintenance

### Query Performance Monitoring

**Dashboard Queries** (health score calculation):
```sql
SELECT
  query,
  mean_exec_time as avg_time_ms,
  calls as query_count
FROM pg_stat_statements
WHERE query LIKE '%workflow_logs%'
ORDER BY mean_exec_time DESC;
```

**Alert if**:
- Health score query > 300ms (target: <200ms)
- Document search > 1000ms (target: <500ms)
- Any query > 5 seconds (likely missing index)

### Index Bloat Monitoring

```sql
-- Find underused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
-- Remove unused indexes (they slow writes)

-- Find bloated indexes
SELECT * FROM pgstattuple_approx('index_name');
-- If bloat > 30%, rebuild: REINDEX INDEX CONCURRENTLY index_name;
```

### Table Growth Monitoring

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  (SELECT count(*) FROM information_schema.columns WHERE table_name=tablename) as column_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Session Management

```sql
-- Find long-running queries
SELECT pid, now() - pg_stat_activity.query_start as duration, query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- Kill zombie connections if needed
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
WHERE state = 'idle' AND query_start < now() - interval '1 hour';
```

---

## Appendix: Common Queries

### Get User with Project Context

```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    project: {
      select: {
        id: true,
        name: true,
        healthScore: true,
      },
    },
  },
});
```

### Count Documents by Phase

```typescript
const stats = await prisma.document.groupBy({
  by: ['phase'],
  where: { projectId, deletedAt: null },
  _count: { id: true },
});
```

### Get Workflow Success Rate

```typescript
const stats = await prisma.workflowLog.groupBy({
  by: ['status'],
  where: { projectId },
  _count: { id: true },
});
const successRate = stats.find(s => s.status === 'SUCCESS')?._count || 0 / stats.reduce((a, s) => a + s._count, 0);
```

### Mark Notifications as Read

```typescript
await prisma.notification.updateMany({
  where: { userId, readAt: null },
  data: { readAt: new Date() },
});
```

### Get User's Recent Activities (Audit Trail)

```typescript
const activities = await prisma.auditLog.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' },
  take: 50,
});
```

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-22 | DBA Agent | Initial database design - MVP schema complete |

---

**Database Design Status: ✅ READY FOR IMPLEMENTATION**

**Next Steps**:
1. Backend Engineer implements services using Prisma
2. Run migrations: `npx prisma migrate dev`
3. Seed development data: `npx prisma db seed`
4. Create API endpoints with proper repository pattern
5. Monitor performance with slow query logs

**Related Documentation**:
- Architecture: `/home/user/claude-code-agents-wizard-v2/architecture-ki-agentur-client-portal.md`
- PRD: `/home/user/claude-code-agents-wizard-v2/prd-ki-agentur-client-portal.md`

**File Location**: `/home/user/claude-code-agents-wizard-v2/database-design-ki-agentur-client-portal.md`

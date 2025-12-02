# 🏗️ MASTER IMPLEMENTATION PLAN
## KI Agentur Client Portal - Backend

**Version:** 1.0.0
**Erstellt:** 2024-12-02
**Stack:** Hono + PostgreSQL + Prisma + pgvector + n8n
**Ziel:** Zukunftssicheres Backend für 2026/2027

---

## 📋 INHALTSVERZEICHNIS

1. [Executive Summary](#executive-summary)
2. [Architektur Overview](#architektur-overview)
3. [Tech Stack Decisions](#tech-stack-decisions)
4. [Phase 1: Project Setup & Infrastructure](#phase-1-project-setup--infrastructure)
5. [Phase 2: Database & Prisma Schema](#phase-2-database--prisma-schema)
6. [Phase 3: Authentication & Authorization](#phase-3-authentication--authorization)
7. [Phase 4: Core API Endpoints](#phase-4-core-api-endpoints)
8. [Phase 5: n8n Webhook Integration](#phase-5-n8n-webhook-integration)
9. [Phase 6: Testing & Security Audit](#phase-6-testing--security-audit)
10. [Phase 7: Deployment & Monitoring](#phase-7-deployment--monitoring)
11. [Agent Delegation Matrix](#agent-delegation-matrix)
12. [API Endpoint Specifications](#api-endpoint-specifications)
13. [Database Schema](#database-schema)

---

## 🎯 EXECUTIVE SUMMARY

### Projekt-Scope

**IN SCOPE (Dieses Projekt):**
- ✅ Complete Backend Implementation (Hono/Node.js)
- ✅ PostgreSQL + Prisma + pgvector
- ✅ 40+ API Endpoints
- ✅ Authentication & Authorization (JWT + RBAC)
- ✅ n8n Webhook Integration
- ✅ MCP Interface für Claude Agents
- ✅ Testing & Deployment

**OUT OF SCOPE (Separates Projekt):**
- ❌ Frontend Implementation (Next.js)
- ❌ UI/UX Design
- ❌ Frontend State Management

### User Personas

| Persona | Needs | Key Features |
|---------|-------|--------------|
| **CTO** | Live n8n Workflows, API Logs, Performance Metrics | Workflow Dashboard, Real-time Logs |
| **CEO** | Health Score Dashboard (<2s), Weekly Emails, ROI Tracking | Executive Dashboard, Email Reports |
| **PM** | Document Repository, Search, Version Control | Document Manager, Version History |

### MVP Features

1. **Authentication** - JWT + RBAC + Refresh Tokens
2. **Dashboard** - Health Score Calculation + Metrics
3. **Documents** - S3 Upload + Versioning + Search
4. **n8n Integration** - Webhooks + HMAC Verification
5. **Notifications** - Email (Resend) + In-App

---

## 🏛️ ARCHITEKTUR OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Frontend    │    Claude Agents    │    n8n Workflows   │
│  (portal.ki-agentur) │    (MCP Protocol)   │    (Self-Hosted)   │
└──────────┬───────────┴─────────┬───────────┴─────────┬──────────┘
           │ REST/tRPC           │ MCP                  │ Webhooks
           ▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Hono)                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ Rate Limit  │ │ Auth Check  │ │ Validation  │ │  Logging   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    Auth      │      │   Business   │      │   Webhook    │
│   Service    │      │    Logic     │      │   Handler    │
├──────────────┤      ├──────────────┤      ├──────────────┤
│ - Login      │      │ - Dashboard  │      │ - n8n Events │
│ - Register   │      │ - Documents  │      │ - HMAC Check │
│ - Refresh    │      │ - Workflows  │      │ - Processing │
│ - RBAC       │      │ - Notify     │      │ - Callbacks  │
└──────────────┘      └──────────────┘      └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   PostgreSQL    │  Cloudflare R2  │         Redis               │
│   + pgvector    │   (Documents)   │     (Sessions/Cache)        │
│   (Prisma ORM)  │                 │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

---

## 🔧 TECH STACK DECISIONS

| Layer | Technology | Version | Begründung |
|-------|------------|---------|------------|
| **Runtime** | Node.js | 20 LTS | Support bis 2026, ESM native |
| **Framework** | Hono | 4.x | Edge-ready, TypeScript-first, 10x schneller als Express |
| **ORM** | Prisma | 5.x | Type-safe, beste DX, Migrations |
| **Database** | PostgreSQL | 16 | pgvector Support, JSON, Performance |
| **Vector Search** | pgvector | 0.7+ | Semantische Suche für KI-Features |
| **Cache** | Redis | 7.x | Sessions, Rate Limiting, Queues |
| **Storage** | Cloudflare R2 | - | S3-kompatibel, keine Egress-Kosten |
| **Email** | Resend | - | Moderne API, beste DX |
| **Auth** | JWT + Cookies | - | Access (15min) + Refresh (7d) |
| **Validation** | Zod | 3.x | Runtime type checking |
| **Logging** | Axiom/HyperDX | - | Full-Stack Observability |
| **CI/CD** | GitHub Actions | - | Standard, Docker builds |
| **Hosting** | Railway | - | Beste DX für Node + Postgres |

---

## 📁 PROJECT STRUCTURE

```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   ├── app.ts                   # Hono app setup
│   │
│   ├── config/
│   │   ├── env.ts               # Environment variables (Zod validated)
│   │   ├── database.ts          # Prisma client
│   │   ├── redis.ts             # Redis client
│   │   ├── s3.ts                # R2/S3 client
│   │   └── resend.ts            # Email client
│   │
│   ├── middleware/
│   │   ├── auth.ts              # JWT verification
│   │   ├── rbac.ts              # Role-based access
│   │   ├── validate.ts          # Zod validation
│   │   ├── rateLimit.ts         # Rate limiting
│   │   ├── logging.ts           # Request logging
│   │   └── error.ts             # Error handler
│   │
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── auth.routes.ts       # /auth/*
│   │   ├── dashboard.routes.ts  # /dashboard/*
│   │   ├── documents.routes.ts  # /documents/*
│   │   ├── workflows.routes.ts  # /workflows/*
│   │   ├── webhooks.routes.ts   # /webhooks/*
│   │   ├── notifications.routes.ts
│   │   └── mcp.routes.ts        # /mcp/* (Claude Agent Interface)
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── documents.controller.ts
│   │   ├── workflows.controller.ts
│   │   ├── webhooks.controller.ts
│   │   └── notifications.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── healthScore.service.ts
│   │   ├── documents.service.ts
│   │   ├── workflows.service.ts
│   │   ├── notifications.service.ts
│   │   ├── email.service.ts
│   │   └── vectorSearch.service.ts
│   │
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── project.repository.ts
│   │   ├── document.repository.ts
│   │   ├── workflow.repository.ts
│   │   └── notification.repository.ts
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── dashboard.schema.ts
│   │   ├── documents.schema.ts
│   │   ├── workflows.schema.ts
│   │   └── common.schema.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── api.types.ts
│   │   └── prisma.types.ts
│   │
│   └── utils/
│       ├── logger.ts
│       ├── errors.ts
│       ├── jwt.ts
│       ├── password.ts
│       ├── hmac.ts
│       └── helpers.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── Dockerfile
└── docker-compose.yml
```

---

## 🔴 PHASE 1: PROJECT SETUP & INFRASTRUCTURE

### Ziel
Grundlegendes Projekt-Setup mit Hono, TypeScript, und Development-Tooling.

### Tasks für Sonnet Agent

```yaml
Agent: coder (Sonnet)
Task: "Phase 1 - Project Setup"
Input: This implementation plan
Output: Working Hono server with middleware
Estimated Tokens: ~60k
```

#### Task 1.1: Initialize Project
```bash
mkdir -p backend && cd backend
pnpm init
pnpm add hono @hono/node-server
pnpm add -D typescript @types/node tsx vitest
```

#### Task 1.2: TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Task 1.3: Environment Configuration
```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  // R2/S3
  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),

  // Resend
  RESEND_API_KEY: z.string(),

  // n8n
  N8N_WEBHOOK_SECRET: z.string().min(32),
  N8N_BASE_URL: z.string().url(),

  // Logging
  AXIOM_TOKEN: z.string().optional(),
  AXIOM_DATASET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
```

#### Task 1.4: Basic Hono Server
```typescript
// src/app.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { prettyJSON } from 'hono/pretty-json';

import { errorHandler } from './middleware/error';
import { rateLimiter } from './middleware/rateLimit';

const app = new Hono();

// Global Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['https://portal.ki-agentur.com'],
  credentials: true,
}));
app.use('*', secureHeaders());
app.use('*', prettyJSON());
app.use('*', rateLimiter);

// Health Check
app.get('/health', (c) => c.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}));

// Error Handler
app.onError(errorHandler);

export { app };
```

#### Task 1.5: Entry Point
```typescript
// src/index.ts
import { serve } from '@hono/node-server';
import { app } from './app';
import { env } from './config/env';
import { prisma } from './config/database';

async function main() {
  // Test database connection
  await prisma.$connect();
  console.log('✅ Database connected');

  // Start server
  serve({
    fetch: app.fetch,
    port: env.PORT,
  }, (info) => {
    console.log(`🚀 Server running on http://localhost:${info.port}`);
  });
}

main().catch(console.error);
```

### Acceptance Criteria
- [ ] `pnpm dev` startet Server auf Port 3000
- [ ] `GET /health` gibt `{ status: "ok" }` zurück
- [ ] TypeScript kompiliert fehlerfrei
- [ ] Environment Variables werden validiert

---

## 🟠 PHASE 2: DATABASE & PRISMA SCHEMA

### Ziel
Komplettes Datenbank-Schema mit pgvector für semantische Suche.

### Tasks für Sonnet Agent

```yaml
Agent: coder (Sonnet)
Task: "Phase 2 - Database Schema"
Input: Schema specification below
Output: schema.prisma, migrations, seed.ts
Estimated Tokens: ~50k
```

#### Task 2.1: Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

// ============================================
// ENUMS
// ============================================

enum UserRole {
  ADMIN
  CTO
  CEO
  PM
  VIEWER
}

enum ProjectStatus {
  ACTIVE
  PAUSED
  COMPLETED
  ARCHIVED
}

enum DocumentPhase {
  DISCOVERY
  PLANNING
  DEVELOPMENT
  TESTING
  DEPLOYMENT
  MAINTENANCE
}

enum WorkflowStatus {
  SUCCESS
  FAILED
  RUNNING
  PENDING
}

enum NotificationType {
  WORKFLOW_SUCCESS
  WORKFLOW_FAILED
  DOCUMENT_UPLOADED
  MILESTONE_DUE
  HEALTH_ALERT
  SYSTEM
}

// ============================================
// MODELS
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  firstName     String    @map("first_name")
  lastName      String    @map("last_name")
  role          UserRole  @default(VIEWER)
  avatarUrl     String?   @map("avatar_url")

  // Relations
  projectId     String?   @map("project_id")
  project       Project?  @relation(fields: [projectId], references: [id])

  notifications Notification[]

  // Metadata
  lastLoginAt   DateTime? @map("last_login_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@map("users")
  @@index([email])
  @@index([projectId])
}

model Project {
  id          String        @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(ACTIVE)
  healthScore Int           @default(100) @map("health_score")

  // Relations
  users       User[]
  documents   Document[]
  workflows   Workflow[]
  milestones  Milestone[]

  // Metadata
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  @@map("projects")
  @@index([status])
  @@index([healthScore])
}

model Document {
  id          String        @id @default(cuid())
  name        String
  description String?
  phase       DocumentPhase @default(DISCOVERY)
  filePath    String        @map("file_path")
  fileSize    Int           @map("file_size")
  mimeType    String        @map("mime_type")
  version     Int           @default(1)

  // Vector Embedding for semantic search
  embedding   Unsupported("vector(1536)")?

  // Relations
  projectId   String        @map("project_id")
  project     Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)

  versions    DocumentVersion[]
  uploadedById String       @map("uploaded_by_id")

  // Metadata
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  @@map("documents")
  @@index([projectId])
  @@index([phase])
  @@index([name])
}

model DocumentVersion {
  id         String   @id @default(cuid())
  version    Int
  filePath   String   @map("file_path")
  fileSize   Int      @map("file_size")
  changeNote String?  @map("change_note")

  // Relations
  documentId String   @map("document_id")
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)

  // Metadata
  createdAt  DateTime @default(now()) @map("created_at")

  @@map("document_versions")
  @@index([documentId])
  @@unique([documentId, version])
}

model Workflow {
  id           String         @id @default(cuid())
  name         String
  n8nId        String         @unique @map("n8n_id")
  description  String?
  successRate  Float          @default(100) @map("success_rate")
  avgExecTime  Int            @default(0) @map("avg_exec_time_ms")
  lastRunAt    DateTime?      @map("last_run_at")

  // Relations
  projectId    String         @map("project_id")
  project      Project        @relation(fields: [projectId], references: [id], onDelete: Cascade)

  logs         WorkflowLog[]

  // Metadata
  createdAt    DateTime       @default(now()) @map("created_at")
  updatedAt    DateTime       @updatedAt @map("updated_at")

  @@map("workflows")
  @@index([projectId])
  @@index([n8nId])
}

model WorkflowLog {
  id            String         @id @default(cuid())
  status        WorkflowStatus
  executionTime Int            @map("execution_time_ms")
  errorMessage  String?        @map("error_message")
  inputData     Json?          @map("input_data")
  outputData    Json?          @map("output_data")

  // Relations
  workflowId    String         @map("workflow_id")
  workflow      Workflow       @relation(fields: [workflowId], references: [id], onDelete: Cascade)

  // Metadata
  createdAt     DateTime       @default(now()) @map("created_at")

  @@map("workflow_logs")
  @@index([workflowId])
  @@index([status])
  @@index([createdAt])
}

model Milestone {
  id          String   @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime @map("due_date")
  completedAt DateTime? @map("completed_at")

  // Relations
  projectId   String   @map("project_id")
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  // Metadata
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("milestones")
  @@index([projectId])
  @@index([dueDate])
}

model Notification {
  id        String           @id @default(cuid())
  type      NotificationType
  title     String
  body      String
  data      Json?
  readAt    DateTime?        @map("read_at")

  // Relations
  userId    String           @map("user_id")
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Metadata
  createdAt DateTime         @default(now()) @map("created_at")

  @@map("notifications")
  @@index([userId])
  @@index([readAt])
  @@index([createdAt])
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String   @map("user_id")
  expiresAt DateTime @map("expires_at")

  // Metadata
  createdAt DateTime @default(now()) @map("created_at")

  @@map("refresh_tokens")
  @@index([userId])
  @@index([expiresAt])
}
```

#### Task 2.2: Seed Data
```typescript
// prisma/seed.ts
import { PrismaClient, UserRole, ProjectStatus, DocumentPhase } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  // Create Demo Project
  const project = await prisma.project.create({
    data: {
      name: 'Demo KI-Projekt',
      description: 'Ein Beispielprojekt für das Client Portal',
      status: ProjectStatus.ACTIVE,
      healthScore: 85,
    },
  });

  // Create Users
  const adminPassword = await hashPassword('Admin123!');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@ki-agentur.com',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        projectId: project.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'cto@demo-kunde.de',
        passwordHash: await hashPassword('Cto123!'),
        firstName: 'Max',
        lastName: 'Mustermann',
        role: UserRole.CTO,
        projectId: project.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'ceo@demo-kunde.de',
        passwordHash: await hashPassword('Ceo123!'),
        firstName: 'Erika',
        lastName: 'Musterfrau',
        role: UserRole.CEO,
        projectId: project.id,
      },
    }),
  ]);

  // Create Workflows
  await prisma.workflow.createMany({
    data: [
      {
        name: 'Lead Generation Workflow',
        n8nId: 'wf_lead_gen_001',
        description: 'Automatische Lead-Erfassung',
        successRate: 98.5,
        avgExecTime: 1250,
        projectId: project.id,
      },
      {
        name: 'Email Automation',
        n8nId: 'wf_email_auto_002',
        description: 'Automatische Email-Sequenzen',
        successRate: 99.2,
        avgExecTime: 890,
        projectId: project.id,
      },
    ],
  });

  // Create Milestones
  await prisma.milestone.createMany({
    data: [
      {
        title: 'Phase 1 Complete',
        description: 'Discovery und Planung abgeschlossen',
        dueDate: new Date('2024-12-15'),
        projectId: project.id,
      },
      {
        title: 'MVP Launch',
        description: 'Erste Version live',
        dueDate: new Date('2025-01-15'),
        projectId: project.id,
      },
    ],
  });

  console.log('✅ Seed completed');
  console.log(`   Project: ${project.name} (${project.id})`);
  console.log(`   Users: ${users.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Acceptance Criteria
- [ ] `pnpm prisma migrate dev` läuft ohne Fehler
- [ ] `pnpm prisma db seed` erstellt Testdaten
- [ ] pgvector Extension ist aktiviert
- [ ] Alle Indexes sind erstellt

---

## 🟡 PHASE 3: AUTHENTICATION & AUTHORIZATION

### Ziel
Vollständiges Auth-System mit JWT, Refresh Tokens, und RBAC.

### Tasks für Sonnet Agent

```yaml
Agent: coder (Sonnet)
Task: "Phase 3 - Authentication System"
Input: Auth specifications below
Output: Complete auth flow with RBAC
Estimated Tokens: ~80k
```

#### Task 3.1: Password Utilities
```typescript
// src/utils/password.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

#### Task 3.2: JWT Utilities
```typescript
// src/utils/jwt.ts
import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env';

const accessSecret = new TextEncoder().encode(env.JWT_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  projectId?: string;
}

export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(accessSecret);
}

export async function generateRefreshToken(payload: { sub: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, accessSecret);
  return payload as unknown as JWTPayload;
}

export async function verifyRefreshToken(token: string): Promise<{ sub: string }> {
  const { payload } = await jwtVerify(token, refreshSecret);
  return { sub: payload.sub as string };
}
```

#### Task 3.3: Auth Middleware
```typescript
// src/middleware/auth.ts
import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyAccessToken, JWTPayload } from '../utils/jwt';
import { HTTPException } from 'hono/http-exception';

declare module 'hono' {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyAccessToken(token);
    c.set('user', payload);
    await next();
  } catch {
    throw new HTTPException(401, { message: 'Invalid or expired token' });
  }
}
```

#### Task 3.4: RBAC Middleware
```typescript
// src/middleware/rbac.ts
import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { UserRole } from '@prisma/client';

type RoleHierarchy = Record<UserRole, number>;

const roleHierarchy: RoleHierarchy = {
  ADMIN: 100,
  CTO: 80,
  CEO: 80,
  PM: 60,
  VIEWER: 20,
};

export function requireRole(allowedRoles: UserRole[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    const userRole = user.role as UserRole;

    if (!allowedRoles.includes(userRole) && userRole !== 'ADMIN') {
      throw new HTTPException(403, {
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    await next();
  };
}

export function requireMinRole(minRole: UserRole) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    const userRole = user.role as UserRole;
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[minRole] || 0;

    if (userLevel < requiredLevel) {
      throw new HTTPException(403, {
        message: `Access denied. Minimum role required: ${minRole}`
      });
    }

    await next();
  };
}
```

#### Task 3.5: Auth Routes & Controller
```typescript
// src/routes/auth.routes.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema, refreshSchema } from '../schemas/auth.schema';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const auth = new Hono();

// Public routes
auth.post('/login', zValidator('json', loginSchema), authController.login);
auth.post('/register', zValidator('json', registerSchema), authController.register);
auth.post('/refresh', authController.refreshToken);
auth.post('/logout', authController.logout);

// Protected routes
auth.get('/me', authMiddleware, authController.getCurrentUser);
auth.patch('/me', authMiddleware, authController.updateProfile);

export { auth };
```

#### Task 3.6: Auth Schemas
```typescript
// src/schemas/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

### Acceptance Criteria
- [ ] `POST /auth/login` gibt JWT + Refresh Token zurück
- [ ] `POST /auth/register` erstellt neuen User
- [ ] `POST /auth/refresh` erneuert Access Token
- [ ] `GET /auth/me` gibt aktuellen User zurück (authenticated)
- [ ] RBAC blockiert unauthorized requests mit 403

---

## 🟢 PHASE 4: CORE API ENDPOINTS

### Ziel
Alle 40+ API Endpoints für Dashboard, Documents, Workflows, Notifications.

### Tasks für Sonnet Agent

```yaml
Agent: coder (Sonnet)
Task: "Phase 4 - Core API Endpoints"
Input: Endpoint specifications below
Output: Complete route handlers with business logic
Estimated Tokens: ~100k
```

### API Endpoint Specifications

#### Dashboard Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/dashboard` | ✅ | ANY | Get dashboard overview |
| GET | `/dashboard/health` | ✅ | ANY | Get health score details |
| GET | `/dashboard/metrics` | ✅ | CTO+ | Get detailed metrics |
| GET | `/dashboard/activity` | ✅ | ANY | Get recent activity |

```typescript
// GET /dashboard
// Response
{
  "project": {
    "id": "cuid...",
    "name": "Demo Projekt",
    "status": "ACTIVE",
    "healthScore": 85
  },
  "stats": {
    "activeWorkflows": 5,
    "documentsCount": 23,
    "upcomingMilestones": 2,
    "unreadNotifications": 3
  },
  "recentActivity": [
    { "type": "WORKFLOW_SUCCESS", "message": "...", "createdAt": "..." }
  ]
}
```

#### Documents Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/documents` | ✅ | ANY | List documents (paginated) |
| GET | `/documents/:id` | ✅ | ANY | Get document details |
| POST | `/documents` | ✅ | PM+ | Upload document |
| PATCH | `/documents/:id` | ✅ | PM+ | Update document |
| DELETE | `/documents/:id` | ✅ | ADMIN | Delete document |
| GET | `/documents/:id/download` | ✅ | ANY | Get download URL |
| GET | `/documents/:id/versions` | ✅ | ANY | List versions |
| POST | `/documents/:id/versions` | ✅ | PM+ | Upload new version |
| GET | `/documents/search` | ✅ | ANY | Semantic search |

```typescript
// POST /documents
// Request (multipart/form-data)
{
  "file": File,
  "name": "Projektplan.pdf",
  "description": "Detaillierter Projektplan Q1",
  "phase": "PLANNING"
}

// Response
{
  "id": "cuid...",
  "name": "Projektplan.pdf",
  "phase": "PLANNING",
  "version": 1,
  "downloadUrl": "https://...",
  "createdAt": "2024-12-01T..."
}
```

#### Workflows Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/workflows` | ✅ | ANY | List workflows |
| GET | `/workflows/:id` | ✅ | ANY | Get workflow details |
| GET | `/workflows/:id/logs` | ✅ | CTO+ | Get execution logs |
| GET | `/workflows/:id/stats` | ✅ | CTO+ | Get statistics |
| POST | `/workflows/:id/trigger` | ✅ | CTO+ | Manually trigger workflow |

```typescript
// GET /workflows/:id/stats
// Response
{
  "workflowId": "cuid...",
  "successRate": 98.5,
  "avgExecutionTime": 1250,
  "totalExecutions": 156,
  "lastWeek": {
    "success": 42,
    "failed": 1,
    "avgTime": 1180
  }
}
```

#### Notifications Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/notifications` | ✅ | ANY | List notifications |
| PATCH | `/notifications/:id/read` | ✅ | ANY | Mark as read |
| PATCH | `/notifications/read-all` | ✅ | ANY | Mark all as read |
| GET | `/notifications/unread-count` | ✅ | ANY | Get unread count |

### Acceptance Criteria
- [ ] Alle Endpoints sind implementiert
- [ ] Pagination funktioniert (limit, offset, cursor)
- [ ] File Upload zu R2 funktioniert
- [ ] Semantic Search mit pgvector funktioniert
- [ ] Error Handling ist konsistent

---

## 🔵 PHASE 5: N8N WEBHOOK INTEGRATION

### Ziel
Sichere Webhook-Verarbeitung mit HMAC-Verification und Event Processing.

### Tasks für Sonnet Agent

```yaml
Agent: coder (Sonnet)
Task: "Phase 5 - n8n Webhook Integration"
Input: Webhook specifications below
Output: Secure webhook handlers
Estimated Tokens: ~40k
```

#### Task 5.1: HMAC Verification
```typescript
// src/utils/hmac.ts
import { createHmac, timingSafeEqual } from 'crypto';
import { env } from '../config/env';

export function verifyN8nSignature(payload: string, signature: string): boolean {
  const expectedSig = createHmac('sha256', env.N8N_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  const sigBuffer = Buffer.from(signature.replace('sha256=', ''), 'hex');
  const expectedBuffer = Buffer.from(expectedSig, 'hex');

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(sigBuffer, expectedBuffer);
}
```

#### Task 5.2: Webhook Routes
```typescript
// src/routes/webhooks.routes.ts
import { Hono } from 'hono';
import { webhookAuth } from '../middleware/webhookAuth';
import * as webhookController from '../controllers/webhooks.controller';

const webhooks = new Hono();

// All webhook routes require HMAC verification
webhooks.use('/*', webhookAuth);

// n8n Webhooks
webhooks.post('/n8n/workflow-completed', webhookController.workflowCompleted);
webhooks.post('/n8n/workflow-failed', webhookController.workflowFailed);
webhooks.post('/n8n/workflow-started', webhookController.workflowStarted);

export { webhooks };
```

#### Task 5.3: Webhook Payload Schema
```typescript
// src/schemas/webhook.schema.ts
import { z } from 'zod';

export const workflowEventSchema = z.object({
  event: z.enum(['workflow_started', 'workflow_completed', 'workflow_failed']),
  workflow: z.object({
    id: z.string(),
    name: z.string(),
  }),
  execution: z.object({
    id: z.string(),
    status: z.enum(['success', 'failed', 'running']),
    executionTime: z.number().optional(),
    errorMessage: z.string().optional(),
    input: z.record(z.unknown()).optional(),
    output: z.record(z.unknown()).optional(),
  }),
  timestamp: z.string().datetime(),
});

export type WorkflowEvent = z.infer<typeof workflowEventSchema>;
```

#### Task 5.4: Webhook Controller
```typescript
// src/controllers/webhooks.controller.ts
import { Context } from 'hono';
import * as webhookService from '../services/webhooks.service';

export async function workflowCompleted(c: Context) {
  const event = c.get('webhookPayload');

  // Process the webhook
  await webhookService.handleWorkflowCompleted(event);

  return c.json({ received: true });
}

export async function workflowFailed(c: Context) {
  const event = c.get('webhookPayload');

  // Process and send alerts
  await webhookService.handleWorkflowFailed(event);

  return c.json({ received: true });
}
```

#### Task 5.5: Webhook Service (Business Logic)
```typescript
// src/services/webhooks.service.ts
import { prisma } from '../config/database';
import { WorkflowEvent } from '../schemas/webhook.schema';
import * as notificationService from './notifications.service';
import * as healthScoreService from './healthScore.service';

export async function handleWorkflowCompleted(event: WorkflowEvent) {
  const { workflow, execution } = event;

  // 1. Find or create workflow
  let dbWorkflow = await prisma.workflow.findUnique({
    where: { n8nId: workflow.id }
  });

  if (!dbWorkflow) {
    throw new Error(`Unknown workflow: ${workflow.id}`);
  }

  // 2. Create log entry
  await prisma.workflowLog.create({
    data: {
      workflowId: dbWorkflow.id,
      status: 'SUCCESS',
      executionTime: execution.executionTime || 0,
      inputData: execution.input,
      outputData: execution.output,
    }
  });

  // 3. Update workflow stats
  const logs = await prisma.workflowLog.findMany({
    where: { workflowId: dbWorkflow.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const successCount = logs.filter(l => l.status === 'SUCCESS').length;
  const successRate = (successCount / logs.length) * 100;
  const avgExecTime = Math.round(
    logs.reduce((sum, l) => sum + l.executionTime, 0) / logs.length
  );

  await prisma.workflow.update({
    where: { id: dbWorkflow.id },
    data: {
      successRate,
      avgExecTime,
      lastRunAt: new Date(),
    }
  });

  // 4. Recalculate project health score
  await healthScoreService.recalculate(dbWorkflow.projectId);

  // 5. Send notifications to project users
  await notificationService.notifyProjectUsers(
    dbWorkflow.projectId,
    'WORKFLOW_SUCCESS',
    `Workflow "${workflow.name}" completed successfully`,
    { workflowId: dbWorkflow.id, executionTime: execution.executionTime }
  );
}

export async function handleWorkflowFailed(event: WorkflowEvent) {
  // Similar logic with error handling and alerts
}
```

### Acceptance Criteria
- [ ] HMAC Verification blockiert invalid requests
- [ ] Workflow logs werden korrekt erstellt
- [ ] Success rate wird automatisch berechnet
- [ ] Health score wird nach jedem Event aktualisiert
- [ ] Notifications werden an Project Users gesendet

---

## 🟣 PHASE 6: TESTING & SECURITY AUDIT

### Ziel
Umfassende Tests und Security Hardening.

### Tasks für Sonnet Agent

```yaml
Agent: coder (Sonnet)
Task: "Phase 6 - Testing & Security"
Input: Test specifications below
Output: Unit tests, integration tests, security middleware
Estimated Tokens: ~60k
```

#### Test Structure
```
tests/
├── unit/
│   ├── utils/
│   │   ├── password.test.ts
│   │   ├── jwt.test.ts
│   │   └── hmac.test.ts
│   └── services/
│       ├── auth.service.test.ts
│       └── healthScore.service.test.ts
│
├── integration/
│   ├── auth.test.ts
│   ├── documents.test.ts
│   └── webhooks.test.ts
│
└── e2e/
    ├── login-flow.test.ts
    └── document-upload.test.ts
```

#### Task 6.1: Unit Tests
```typescript
// tests/unit/services/healthScore.service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { calculateHealthScore } from '../../../src/services/healthScore.service';

describe('healthScore.service', () => {
  describe('calculateHealthScore', () => {
    it('returns 100 for perfect workflows', () => {
      const workflows = [
        { successRate: 100, avgExecTime: 500 },
        { successRate: 100, avgExecTime: 800 },
      ];
      expect(calculateHealthScore(workflows, [], [])).toBe(100);
    });

    it('decreases score for failed workflows', () => {
      const workflows = [
        { successRate: 50, avgExecTime: 500 },
      ];
      expect(calculateHealthScore(workflows, [], [])).toBeLessThan(100);
    });

    it('accounts for overdue milestones', () => {
      const milestones = [
        { dueDate: new Date('2020-01-01'), completedAt: null },
      ];
      expect(calculateHealthScore([], milestones, [])).toBeLessThan(100);
    });
  });
});
```

#### Task 6.2: Integration Tests
```typescript
// tests/integration/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../src/app';
import { prisma } from '../../src/config/database';

describe('Auth Integration', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.user.create({
      data: {
        email: 'test@test.com',
        passwordHash: await hashPassword('Test123!'),
        firstName: 'Test',
        lastName: 'User',
        role: 'VIEWER',
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'test@test.com' } });
  });

  describe('POST /auth/login', () => {
    it('returns tokens for valid credentials', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'Test123!',
        }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.accessToken).toBeDefined();
      expect(body.user.email).toBe('test@test.com');
    });

    it('returns 401 for invalid password', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'WrongPassword!',
        }),
      });

      expect(res.status).toBe(401);
    });
  });
});
```

#### Task 6.3: Security Headers
```typescript
// src/middleware/security.ts
import { Context, Next } from 'hono';

export async function securityHeaders(c: Context, next: Next) {
  await next();

  // HSTS
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Prevent XSS
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');

  // CSP
  c.header('Content-Security-Policy', "default-src 'self'");

  // Referrer Policy
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
}
```

#### Task 6.4: Rate Limiting
```typescript
// src/middleware/rateLimit.ts
import { Context, Next } from 'hono';
import { redis } from '../config/redis';
import { HTTPException } from 'hono/http-exception';

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
};

export function rateLimiter(config: RateLimitConfig = defaultConfig) {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || 'unknown';
    const key = `ratelimit:${ip}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.pexpire(key, config.windowMs);
    }

    c.header('X-RateLimit-Limit', String(config.max));
    c.header('X-RateLimit-Remaining', String(Math.max(0, config.max - current)));

    if (current > config.max) {
      throw new HTTPException(429, {
        message: 'Too many requests, please try again later'
      });
    }

    await next();
  };
}

// Stricter limit for auth endpoints
export const authRateLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 10,
});
```

### Acceptance Criteria
- [ ] Unit Test Coverage > 80%
- [ ] Integration Tests für alle kritischen Flows
- [ ] Security Headers auf allen Responses
- [ ] Rate Limiting funktioniert
- [ ] Input Validation auf allen Endpoints

---

## ⚫ PHASE 7: DEPLOYMENT & MONITORING

### Ziel
Production Deployment auf Railway mit Monitoring.

### Tasks für Sonnet Agent

```yaml
Agent: coder (Sonnet)
Task: "Phase 7 - Deployment Setup"
Input: Deployment specifications below
Output: Dockerfile, GitHub Actions, Monitoring setup
Estimated Tokens: ~40k
```

#### Task 7.1: Dockerfile
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm prisma generate
RUN pnpm build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

EXPOSE 3000
```

#### Task 7.2: GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: railwayapp/railway-action@v0.3.0
        with:
          service: backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

#### Task 7.3: Railway Configuration
```toml
# railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

#### Task 7.4: Environment Variables (Railway)
```env
# Production Environment
NODE_ENV=production
PORT=3000

# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://...

# Redis (Railway Redis)
REDIS_URL=redis://...

# JWT
JWT_SECRET=<generate-32-char-secret>
JWT_REFRESH_SECRET=<generate-32-char-secret>

# Cloudflare R2
R2_ACCOUNT_ID=<your-account-id>
R2_ACCESS_KEY_ID=<your-access-key>
R2_SECRET_ACCESS_KEY=<your-secret-key>
R2_BUCKET_NAME=ki-agentur-portal

# Resend
RESEND_API_KEY=re_...

# n8n
N8N_WEBHOOK_SECRET=<generate-32-char-secret>
N8N_BASE_URL=https://n8n.ki-agentur.com

# Monitoring
AXIOM_TOKEN=xaat_...
AXIOM_DATASET=ki-portal-logs
```

### Deployment Runbook

1. **Create Railway Project**
   ```bash
   railway login
   railway init
   ```

2. **Add Services**
   - PostgreSQL 16 (Enable pgvector extension)
   - Redis 7
   - Backend (from GitHub repo)

3. **Configure Environment**
   - Add all env variables
   - Generate secrets: `openssl rand -hex 32`

4. **Deploy**
   ```bash
   railway up
   ```

5. **Run Migrations**
   ```bash
   railway run npx prisma migrate deploy
   ```

6. **Seed Database (optional)**
   ```bash
   railway run npx prisma db seed
   ```

7. **Verify**
   ```bash
   curl https://api.portal.ki-agentur.com/health
   # Expected: {"status":"ok","version":"1.0.0"}
   ```

8. **Setup Custom Domain**
   - Add domain: `api.portal.ki-agentur.com`
   - Configure DNS CNAME

### Acceptance Criteria
- [ ] Docker build funktioniert lokal
- [ ] GitHub Actions Pipeline ist grün
- [ ] Railway Deployment erfolgreich
- [ ] Health Check erreichbar
- [ ] Logs fließen zu Axiom

---

## 🤖 AGENT DELEGATION MATRIX

### Übersicht: Wer macht was?

| Phase | Agent | Model | Tasks | Est. Tokens |
|-------|-------|-------|-------|-------------|
| 1 | coder | Sonnet | Project Setup, Hono Server | ~60k |
| 2 | coder | Sonnet | Prisma Schema, Migrations, Seed | ~50k |
| 3 | coder | Sonnet | Auth System, JWT, RBAC | ~80k |
| 4 | coder | Sonnet | 40+ API Endpoints | ~100k |
| 5 | coder | Sonnet | n8n Webhooks, HMAC | ~40k |
| 6 | coder | Sonnet | Tests, Security | ~60k |
| 7 | coder | Sonnet | Docker, CI/CD, Deploy | ~40k |
| - | tester | Sonnet | After each phase | ~20k/phase |
| - | haiku | Haiku | Types, Boilerplate | ~30k total |

### Delegation Flow

```
OPUS (Orchestrator) - Du
│
├─→ Phase 1: Invoke coder("Setup Hono project with middleware")
│   └─→ tester("Verify /health returns 200")
│
├─→ Phase 2: Invoke coder("Create Prisma schema with 8 tables")
│   └─→ tester("Verify migrations run successfully")
│
├─→ Phase 3: Invoke coder("Implement JWT auth with RBAC")
│   └─→ tester("Test login/logout/refresh flows")
│
├─→ Phase 4: Invoke coder("Implement Dashboard endpoints")
│   └─→ tester("Verify all endpoints return correct data")
│
├─→ Phase 4b: Invoke coder("Implement Document endpoints")
│   └─→ tester("Test file upload to R2")
│
├─→ Phase 5: Invoke coder("Implement n8n webhook handlers")
│   └─→ tester("Test HMAC verification")
│
├─→ Phase 6: Invoke coder("Write unit & integration tests")
│   └─→ tester("Verify test coverage > 80%")
│
└─→ Phase 7: Invoke coder("Setup Docker & GitHub Actions")
    └─→ tester("Verify deployment pipeline")
```

---

## 📊 RESOURCE ESTIMATION

### Token Usage
| Model | Usage | Cost (approx.) |
|-------|-------|----------------|
| Opus | ~50k (orchestration) | ~$0.75 |
| Sonnet | ~500k (implementation) | ~$1.50 |
| Haiku | ~30k (boilerplate) | ~$0.01 |
| **Total** | **~580k** | **~$2.26** |

### Infrastructure Costs (Monthly)
| Service | Cost |
|---------|------|
| Railway (Backend) | ~$10-20 |
| Railway (PostgreSQL) | ~$10-20 |
| Railway (Redis) | ~$5-10 |
| Cloudflare R2 | ~$5-15 |
| Resend | $0 (free tier) |
| Axiom | $0 (free tier) |
| **Total** | **~$30-65/month** |

---

## ✅ FINAL CHECKLIST

### Pre-Launch
- [ ] All 7 phases completed
- [ ] All tests passing
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] Environment variables configured

### Launch Day
- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] Health check returning 200
- [ ] SSL certificate active
- [ ] Monitoring receiving logs

### Post-Launch
- [ ] Monitor error rates
- [ ] Check response times
- [ ] Verify webhook processing
- [ ] Test email delivery
- [ ] Review security logs

---

## 🚀 READY TO START

Dieser Plan ist jetzt vollständig.

**Nächster Schritt:** Ich (Opus) delegiere Phase 1 an den `coder` Sonnet-Agent mit den detaillierten Spezifikationen oben.

**Frage an dich:** Soll ich jetzt mit Phase 1 starten?

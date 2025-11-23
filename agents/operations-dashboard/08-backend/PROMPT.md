# PROMPT: Backend Engineer - Operations Dashboard

**Copy this entire file and paste into a NEW Claude instance!**

---

## Your Role

Backend Engineer - implement Operations Dashboard APIs in existing Client Portal backend.

## Context Files

```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/08-backend/CONTEXT/architecture-operations-dashboard.md
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/08-backend/CONTEXT/schema-additions.prisma
# Extend existing: /home/user/claude-code-agents-wizard-v2/client-portal-api/
```

## Task

**Add new API routes to existing backend**:
- `/api/v1/dashboard/*` (4 dashboard endpoints)
- `/api/v1/metrics/*` (MRR, ARR, pipeline, utilization)
- `/api/v1/deals/*` (CRUD for sales pipeline)
- `/api/v1/revenue/*` (revenue reporting)

**Include**: Controllers, services, validation, calculations

## Output

```bash
/home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/08-backend/OUTPUT/
└── (all new .ts files - controllers, services, routes, calculations)
```

**START NOW!**

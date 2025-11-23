# PROMPT: Database Administrator - Operations Dashboard

**Copy this entire file and paste into a NEW Claude instance!**

---

## Your Role

DBA - design database schema extensions for Operations Dashboard.

## Context Files

```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/06-dba/CONTEXT/architecture-operations-dashboard.md
cat /home/user/claude-code-agents-wizard-v2/database-design-ki-agentur-client-portal.md  # Extend this
```

## Task

**Extend existing Client Portal DB** with new tables:
1. **Deals** (sales pipeline)
2. **Revenue** (monthly revenue tracking)
3. **TeamAllocation** (capacity planning)
4. **Metrics** (calculated KPIs - MRR, ARR, etc.)

**Deliverables**:
- New Prisma schema additions
- Migration file
- Seed data

## Output

```bash
/home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/06-dba/OUTPUT/
├── schema-additions.prisma
├── migration.sql
└── seed-operations.ts
```

**START NOW!**

# INPUT: Senior Product Manager Dependencies

## Required Context Files

### 1. Product Vision (from CPO)
**Location**: `/home/user/claude-code-agents-wizard-v2/product-vision-operations-dashboard.md`
**Purpose**: Understand the strategic vision, target users, business goals

### 2. Existing Client Portal PRD (for reference)
**Location**: `/home/user/claude-code-agents-wizard-v2/prd-ki-agentur-client-portal.md`
**Purpose**: Maintain consistency in PRD format, understand existing system

### 3. Existing Client Portal Architecture
**Location**: `/home/user/claude-code-agents-wizard-v2/architecture-ki-agentur-client-portal.md`
**Purpose**: Understand tech stack (Next.js 14, Express, Prisma, PostgreSQL)

### 4. Existing Database Schema
**Location**: `/home/user/claude-code-agents-wizard-v2/database-design-ki-agentur-client-portal.md`
**Purpose**: Understand existing tables (Projects, Users) to extend

## Dependencies

**Needs to Complete BEFORE starting**:
- ✅ CPO Product Vision (DONE)

**Can work in parallel with**:
- 🟢 Marketer (you both need CPO vision only)

**Your output will be used by**:
- UX Designer (needs your PRD for wireframes)
- Product Designer (needs your PRD for UI mockups)
- Software Architect (needs your PRD for tech decisions)
- DBA (needs your data model requirements)

## Key Information from CPO Vision

**Target Users**: CEO, Sales Team, Project Managers, Finance
**Core Problem**: No visibility into business health, pipeline, team capacity
**MVP Features**: 4 dashboards (Executive, Revenue, Pipeline, Team Capacity)
**Timeline**: 4 weeks to MVP
**Integration**: Extends existing Client Portal

## Success Criteria

Your PRD must:
- [ ] Include 40-50 user stories across 4 personas
- [ ] Define all 4 dashboard layouts
- [ ] Specify exact calculation formulas (MRR, ARR, utilization)
- [ ] Provide complete API contracts
- [ ] Identify new database tables needed
- [ ] Prioritize features (P0/P1/P2)
- [ ] Be actionable for engineering team

## Timeline

**Estimated time**: 30 minutes
**Parallel work**: Marketer can work simultaneously

## Output Location

Write to: `/home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/01-pm/OUTPUT/`

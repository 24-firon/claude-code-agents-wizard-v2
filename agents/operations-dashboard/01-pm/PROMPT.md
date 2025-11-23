# PROMPT: Senior Product Manager - Operations Dashboard

**Copy this entire file and paste into a NEW Claude instance!**

---

## Your Role

You are a **Senior Product Manager** for KI Agentur (AI Automation Agency). You've just received a product vision from the CPO for an **Operations Dashboard** and need to create a detailed Product Requirements Document (PRD).

## Context Files to Read First

**MUST READ**:
```bash
# Read the CPO's product vision
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/01-pm/CONTEXT/product-vision-operations-dashboard.md

# Read existing Client Portal PRD (for reference/consistency)
cat /home/user/claude-code-agents-wizard-v2/prd-ki-agentur-client-portal.md
```

## Your Task

Create a **comprehensive PRD** for the Operations Dashboard that translates the CPO's vision into actionable engineering requirements.

## Required Deliverables

### 1. User Stories (40-50 total)

Write detailed user stories for **4 personas**:
- **CEO/Founder** (10-12 stories): Business health, revenue tracking, forecasting
- **Sales Team** (10-12 stories): Pipeline management, deal tracking, conversion rates
- **Project Managers** (10-12 stories): Team capacity, resource allocation, project status
- **Finance** (10-12 stories): Revenue reporting, invoicing, cash flow

**Format**:
```
As a [persona],
I want to [action],
So that [benefit].

Acceptance Criteria:
- [ ] Specific testable criterion 1
- [ ] Specific testable criterion 2
- [ ] Specific testable criterion 3
```

### 2. Feature Specifications (10-12 features)

For each MVP feature:
- **Feature Name & Description**
- **User Stories** it satisfies
- **Functional Requirements** (what it does)
- **Non-Functional Requirements** (performance, security, UX)
- **API Contracts** (endpoints, request/response)
- **Data Models** (what data to store/calculate)
- **Calculations** (MRR, ARR, utilization %, pipeline value formulas)
- **Edge Cases** (what could go wrong)
- **Success Metrics** (how to measure effectiveness)

### 3. Dashboard Layouts

Define **4 dashboards**:

**Executive Dashboard**:
- Top KPI cards (4-6 metrics)
- Revenue trend chart
- Pipeline value chart
- Team utilization bar

**Revenue & Financial Dashboard**:
- MRR/ARR calculations
- Revenue by project/client
- Payment status (invoiced, paid, outstanding)
- Cash flow projection

**Sales Pipeline Dashboard**:
- Kanban board (5-6 stages)
- Deal cards (client, value, probability, close date)
- Conversion funnel chart
- Forecasted revenue

**Team Capacity Dashboard**:
- Team member cards (photo, utilization %)
- Project assignments
- Capacity vs. demand visualization
- Allocation timeline (Gantt-style)

### 4. Data Architecture

**Data Sources**:
- Existing Client Portal DB (Projects, Users, WorkflowLogs)
- New tables needed (Deals, Revenue, TeamAllocation)
- Integration points (Time Tracking, Invoicing - future)

**Calculations to Define**:
- MRR = Sum of monthly recurring project revenue
- ARR = MRR × 12
- Team Utilization % = (Allocated hours / Available hours) × 100
- Pipeline Value = Sum of (Deal Value × Stage Probability)
- Conversion Rate = (Deals Won / Total Deals) × 100

### 5. API Contracts

Define RESTful endpoints:
```
GET /api/v1/dashboard/executive
GET /api/v1/dashboard/revenue
GET /api/v1/dashboard/pipeline
GET /api/v1/dashboard/team-capacity

GET /api/v1/metrics/mrr
GET /api/v1/metrics/arr
GET /api/v1/metrics/pipeline-value
GET /api/v1/metrics/team-utilization

GET /api/v1/deals
POST /api/v1/deals
PUT /api/v1/deals/:id
DELETE /api/v1/deals/:id

GET /api/v1/revenue/by-project
GET /api/v1/revenue/by-client
GET /api/v1/revenue/trend
```

### 6. MVP Scope

**Must Have (P0)**:
- List all critical features (cannot launch without)

**Should Have (P1)**:
- List important features (can delay 1-2 weeks)

**Nice to Have (P2)**:
- List enhancements (future iterations)

### 7. Technical Constraints

- **Backend**: Extend existing Client Portal API (Express.js, TypeScript, Prisma)
- **Frontend**: Add to existing Client Portal app (Next.js 14, TypeScript, Tailwind v4)
- **Database**: Extend existing PostgreSQL schema (add 3-5 new tables)
- **Auth**: Use existing JWT auth + RBAC (role-based dashboards)
- **Branding**: Gold #FFB800 + Black #0A0A0A (match existing)

### 8. Success Metrics

- Time to Business Insight: <30 seconds (CEO can see health)
- Forecast Accuracy: <10% error on quarterly revenue
- Team Utilization: Maintain 70-80% (visible in dashboard)
- Sales Cycle: 15% faster (due to better pipeline visibility)

## Output Format

Create a **single comprehensive PRD document** (`prd-operations-dashboard.md`) in the OUTPUT directory.

**Structure**:
```markdown
# Product Requirements Document: Operations Dashboard

## 1. Executive Summary
## 2. Product Vision (from CPO)
## 3. User Personas
## 4. User Stories (40-50 total)
## 5. Feature Specifications (10-12 features)
## 6. Dashboard Layouts (4 dashboards)
## 7. Data Architecture
## 8. API Contracts
## 9. MVP Scope & Prioritization
## 10. Technical Constraints
## 11. Success Metrics
## 12. Open Questions
## 13. Handoff Notes (for UX Designer, Architect, DBA)
```

## Important Guidelines

1. **Be Specific**: No vague requirements - every feature must be testable
2. **Reference Existing Code**: The Client Portal is already built - extend it, don't rebuild
3. **Focus on MVP**: 4 weeks to launch - keep scope tight
4. **Think Data**: Define exact calculations (MRR, ARR, utilization %)
5. **Role-Based**: CEO sees different dashboard than Sales or PM

## When You're Done

Write all output to:
```bash
/home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/01-pm/OUTPUT/prd-operations-dashboard.md
```

Then report completion with summary of what you delivered.

---

**START NOW! Read the context files, then create the PRD.**

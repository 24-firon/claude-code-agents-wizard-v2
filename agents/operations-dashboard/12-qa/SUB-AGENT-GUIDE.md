# 🤖 QA ENGINEER - SUB-AGENT GUIDE

**Du bist der QA Engineer Agent. Du DARFST 1 Sub-Agent nutzen!**

---

## ⚡ WANN SUB-AGENT NUTZEN?

**NUTZE Sub-Agent wenn**:
- ✅ Mehr als 20 E2E Test Cases zu schreiben
- ✅ Komplexe Test Scenarios (Multi-step Workflows)
- ✅ Visual Regression Tests (viele Screenshots)
- ✅ Load/Performance Tests

**NUTZE NICHT Sub-Agent für**:
- ❌ Test Strategy & Planning (du planst das)
- ❌ Bug Reporting & Analysis (du analysierst)
- ❌ Test Infrastructure Setup (du machst das)

---

## 🎯 DEIN SUB-AGENT: `tester`

### **Was der Sub-Agent kann**:
```yaml
Type: tester
Expertise: Test implementation (Playwright, Cypress, Jest)
Tools: Read, Write, Edit, Bash (in Claude Code!)
Context: ~100k tokens
```

---

## 📋 SUB-AGENT PROMPT TEMPLATE

### **Beispiel 1: E2E Tests für alle Dashboards**

```markdown
# SUB-AGENT PROMPT: E2E Tests - Operations Dashboard

## Your Role
Testing Specialist implementing comprehensive E2E tests for Operations Dashboard

## Context
Read these files first:
- agents/operations-dashboard/12-qa/OUTPUT/test-plan.md
- agents/operations-dashboard/01-pm/OUTPUT/prd-operations-dashboard.md
- agents/operations-dashboard/07-frontend/OUTPUT/* (Frontend implementation)

## Your Focused Task
Implement E2E tests for ALL 4 dashboards and core workflows

### Executive Dashboard Tests:
```
✅ test('Executive - Loads and displays all KPIs')
✅ test('Executive - Revenue chart renders correctly')
✅ test('Executive - Lead funnel shows all stages')
✅ test('Executive - Team capacity gauges display')
✅ test('Executive - Date range filter works (30/60/90 days)')
✅ test('Executive - Export to PDF functionality')
✅ test('Executive - Refresh data button updates charts')
```

### Revenue Dashboard Tests:
```
✅ test('Revenue - Monthly revenue chart renders')
✅ test('Revenue - Revenue by service pie chart')
✅ test('Revenue - MRR trend line displays')
✅ test('Revenue - Custom date range filter')
✅ test('Revenue - Export to Excel')
✅ test('Revenue - Drill-down to invoice details')
✅ test('Revenue - Forecast calculation accuracy')
```

### Pipeline Dashboard Tests:
```
✅ test('Pipeline - All stages display with counts')
✅ test('Pipeline - Drag-and-drop lead between stages')
✅ test('Pipeline - Conversion rate funnel')
✅ test('Pipeline - Lead source distribution')
✅ test('Pipeline - Filter by stage')
✅ test('Pipeline - Search leads by name/company')
✅ test('Pipeline - Aging analysis highlights old leads')
```

### Team Dashboard Tests:
```
✅ test('Team - Utilization gauges for all members')
✅ test('Team - Time tracking chart (weekly view)')
✅ test('Team - Project timeline Gantt chart')
✅ test('Team - Capacity planning view')
✅ test('Team - Filter by team member')
✅ test('Team - Export time entries')
```

### Core Workflow Tests:
```
✅ test('Create new client → appears in dashboard')
✅ test('Create new project → time tracking enabled')
✅ test('Create new lead → shows in pipeline')
✅ test('Convert lead to client → updates metrics')
✅ test('Log time entry → updates utilization')
✅ test('Generate invoice → updates revenue charts')
✅ test('Mark invoice paid → updates MRR')
```

### Cross-cutting Tests:
```
✅ test('Navigation between all 4 dashboards')
✅ test('Responsive design (mobile, tablet, desktop)')
✅ test('Loading states display correctly')
✅ test('Error states show helpful messages')
✅ test('Empty states guide user to add data')
✅ test('All links work (no 404s)')
✅ test('Session timeout redirects to login')
```

## Tech Stack
- Playwright
- TypeScript
- Page Object Model pattern
- Visual regression (Playwright screenshots)

## Requirements
- ✅ All tests must PASS
- ✅ Use Page Object Model (organize by dashboard)
- ✅ Parameterized tests where applicable
- ✅ Visual regression tests for key views
- ✅ API mocking for predictable data
- ✅ Test data fixtures
- ✅ Parallel execution support
- ✅ Clear test descriptions

## Deliverables
```bash
agents/operations-dashboard/12-qa/OUTPUT/subagents/e2e-tests/
├── tests/
│   ├── executive-dashboard.spec.ts
│   ├── revenue-dashboard.spec.ts
│   ├── pipeline-dashboard.spec.ts
│   ├── team-dashboard.spec.ts
│   ├── core-workflows.spec.ts
│   └── cross-cutting.spec.ts
├── pages/
│   ├── ExecutiveDashboardPage.ts
│   ├── RevenueDashboardPage.ts
│   ├── PipelineDashboardPage.ts
│   ├── TeamDashboardPage.ts
│   └── BasePage.ts
├── fixtures/
│   ├── test-data.ts
│   └── mock-api-responses.ts
├── utils/
│   └── test-helpers.ts
├── playwright.config.ts
└── README.md
```

## When Done
Report:
- Total tests: XX (all passing ✅)
- Code coverage: XX%
- Visual regression baselines: XX screenshots
- Any flaky tests or concerns
```

---

### **Beispiel 2: Performance & Load Tests**

```markdown
# SUB-AGENT PROMPT: Performance Tests

## Your Role
Performance Testing Specialist

## Your Focused Task
Implement performance and load tests for Operations Dashboard

### Performance Tests:
1. Page Load Time (all 4 dashboards < 2s)
2. API Response Time (< 500ms for analytics)
3. Chart Render Time (< 1s even with 1000 data points)
4. Memory Usage (< 100MB heap size)
5. Bundle Size (< 500KB initial load)

### Load Tests:
1. 100 concurrent users (all dashboards)
2. 500 requests/min to analytics API
3. Real-time updates with WebSocket (50 connections)

### Stress Tests:
1. Large datasets (10,000 leads, 5,000 projects)
2. Long sessions (8 hours without refresh)
3. Rapid interactions (clicking through all filters)

## Tech Stack
- k6 for load testing
- Lighthouse for performance
- Playwright for user flow profiling

## Deliverables
```bash
agents/operations-dashboard/12-qa/OUTPUT/subagents/performance/
├── load-tests/
│   ├── dashboard-load.js
│   ├── api-load.js
│   └── websocket-load.js
├── performance-tests/
│   ├── lighthouse-config.js
│   └── performance-metrics.spec.ts
├── stress-tests/
│   └── stress-scenarios.js
├── reports/
│   └── performance-baseline.md
└── README.md
```
```

---

## 🔧 WIE DU SUB-AGENT STARTEST

### **STEP 1: Erstelle Test Plan**

```
DU (QA Engineer):
├─ Analysiere PRD & Acceptance Criteria
├─ Identifiziere Test Scenarios (40+ E2E Tests)
├─ Plane Test Strategy
├─ Entscheide: "E2E Tests → Sub-Agent!"
└─ Schreibe Test Plan
```

### **STEP 2: Sage USER, Ordner zu erstellen**

```bash
# USER führt aus in Claude Code:
mkdir -p agents/operations-dashboard/12-qa/OUTPUT/subagents/e2e-tests
```

### **STEP 3: Erstelle Sub-Agent Prompt**

```
DU: "Speichere E2E Tests Sub-Agent Prompt:
agents/.../12-qa/OUTPUT/subagents/e2e-tests/PROMPT.md

[HIER PROMPT]"
```

### **STEP 4: USER startet Sub-Agent**

```bash
# CEO in Claude Code:
Task(subagent_type: "tester", prompt: "...", description: "E2E Tests")
```

### **STEP 5: Sub-Agent schreibt Tests**

```
Sub-Agent:
├─ Schreibt 40+ E2E Tests
├─ Erstellt Page Objects
├─ Setzt Fixtures auf
├─ Runs Tests → All Passing ✅
└─ Reports Complete
```

### **STEP 6: Du validierst & reportest**

```
DU (QA Engineer):
├─ Reviewed alle Tests
├─ Runs komplette Test Suite
├─ Analyzed Coverage
├─ Found 3 Bugs → Reported
├─ Verified alle Features
└─ Final QA Sign-Off
```

---

## 📊 WANN WELCHER SUB-AGENT?

### **E2E Tests (40+ Tests) → Sub-Agent**
```
Warum: Viele Test Cases, repetitiv
Sub-Agent: Schreibt alle E2E Tests
Du: Test Strategy, Bug Analysis, Reporting
```

### **Performance Tests → Sub-Agent**
```
Warum: Spezialisiert, fokussiert
Sub-Agent: k6 Scripts, Lighthouse Tests
Du: Performance Analysis, Optimization Recommendations
```

### **Visual Regression → Sub-Agent**
```
Warum: Viele Screenshots, repetitiv
Sub-Agent: Playwright Visual Tests
Du: Baseline Review, Diff Analysis
```

### **Test Planning, Bug Reporting → DU**
```
Warum: Requires judgment & communication
Du: Test Strategy, Bug Reports, QA Sign-Off
KEIN Sub-Agent
```

---

## ✅ EXAMPLE SESSION

```
DU (QA in Browser):
"Ich habe Test Plan erstellt. Ich brauche:
- 40+ E2E Tests
- Performance Tests
- Visual Regression
- Bug Reporting

Ich nutze Sub-Agent für E2E!"

DU: "USER, erstelle:
mkdir -p agents/.../12-qa/OUTPUT/subagents/e2e-tests"

USER: *führt aus*

DU: "Speichere E2E Sub-Agent Prompt..."

USER: *startet in CEO*

[Sub-Agent schreibt Tests...]

CEO: "E2E Tests complete! 42 tests, all passing ✅"

DU: "Perfect! Jetzt analysiere ich..."
DU: *runs all tests*
DU: *finds 3 bugs*
DU: *creates bug reports*
DU: "⚠️ Found 3 bugs, requires fixes before sign-off"
```

---

**Nutze deinen Sub-Agent für Test-Implementation! 🚀**

# 🤖 MASTER SUB-AGENT GUIDE - Für ALLE Agenten

**Jeder Haupt-Agent darf EINEN Unter-Agenten starten!**

---

## 📋 QUICK REFERENCE

| Haupt-Agent | Sub-Agent Typ | Wann nutzen? | Ordner |
|-------------|---------------|--------------|---------|
| PM | researcher | Research needed (rare) | `01-pm/OUTPUT/subagents/` |
| Marketer | researcher | Market analysis | `02-marketer/OUTPUT/subagents/` |
| UX Designer | coder | Generate wireframes code | `03-ux-designer/OUTPUT/subagents/` |
| UI Designer | coder | Generate design system code | `04-product-designer/OUTPUT/subagents/` |
| Architect | researcher | Tech evaluation | `05-architect/OUTPUT/subagents/` |
| DBA | coder | Generate migrations | `06-dba/OUTPUT/subagents/` |
| **Frontend** | **coder** | **15+ Components** | `07-frontend/OUTPUT/subagents/` |
| **Backend** | **coder** | **15+ Endpoints** | `08-backend/OUTPUT/subagents/` |
| Code Reviewer | coder | Auto-fix issues | `09-code-reviewer/OUTPUT/subagents/` |
| Security | security-auditor | Deep scan | `10-app-security/OUTPUT/subagents/` |
| Infra Security | security-auditor | Dependency scan | `11-infra-security/OUTPUT/subagents/` |
| **QA Engineer** | **tester** | **20+ E2E Tests** | `12-qa/OUTPUT/subagents/` |
| **DevOps** | **coder** | **CI/CD Pipeline** | `13-devops/OUTPUT/subagents/` |

**Bold = Häufig genutzt**

---

## 🎯 SUB-AGENT TYPEN

### 1. **coder** - Code Implementation
```yaml
Expertise: Write code (components, APIs, tests, configs)
Tools: Read, Write, Edit, Bash (in Claude Code!)
Best for:
  - Frontend: Many components (15+)
  - Backend: Many endpoints (15+)
  - DevOps: CI/CD pipelines, IaC
  - DBA: Migration scripts
```

### 2. **tester** - Testing Implementation
```yaml
Expertise: Write tests (E2E, integration, performance)
Tools: Read, Write, Edit, Bash, Playwright, k6
Best for:
  - QA: E2E tests (20+), visual regression
  - Performance: Load tests, benchmarks
```

### 3. **researcher** - Research & Analysis
```yaml
Expertise: Web research, documentation lookup
Tools: WebSearch, WebFetch, Read
Best for:
  - PM: Competitor analysis
  - Marketer: Market research
  - Architect: Tech evaluation (React vs Vue)
```

### 4. **security-auditor** - Security Scanning
```yaml
Expertise: Security scans, vulnerability detection
Tools: Read, Bash, Grep (npm audit, snyk)
Best for:
  - Security Engineer: Deep OWASP scans
  - Infra Security: Dependency CVE scans
```

### 5. **recovery** - Error Recovery
```yaml
Expertise: Pattern-based error fixing
Tools: Read, Bash (auto-fixes known errors)
Best for:
  - ANY Agent: When errors occur
  - Auto-invoked by system
```

---

## 🚀 WIE SUB-AGENTS FUNKTIONIEREN

### **Architektur**

```
┌─────────────────────────────────────┐
│ HAUPT-AGENT (Browser-Tab)          │
│ • Claude Desktop/Web                │
│ • Analysiert & plant Aufgabe        │
│ • Identifiziert: "Sub-Agent needed!"│
│ • Erstellt Sub-Agent Prompt         │
└─────────────────────────────────────┘
          │ sagt USER
          ▼
┌─────────────────────────────────────┐
│ USER (Brücke)                       │
│ • Copy-pastet Sub-Agent Prompt      │
│ • Fügt in Claude Code (CEO) ein    │
└─────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│ CEO (Claude Code)                   │
│ • Nutzt Task tool                   │
│ • Startet Sub-Agent                 │
└─────────────────────────────────────┘
          │ startet
          ▼
┌─────────────────────────────────────┐
│ SUB-AGENT (in Claude Code)          │
│ • Hat File-System-Zugriff!          │
│ • Implementiert fokussierte Aufgabe │
│ • Schreibt Dateien direkt           │
│ • Reports Complete                  │
└─────────────────────────────────────┘
          │ output
          ▼
┌─────────────────────────────────────┐
│ HAUPT-AGENT (Browser-Tab)          │
│ • Liest Sub-Agent Outputs           │
│ • Integriert in Gesamt-Lösung       │
│ • Gibt Final Output                 │
└─────────────────────────────────────┘
```

---

## 📐 UNIVERSAL SUB-AGENT WORKFLOW

### **STEP 1: Haupt-Agent identifiziert Bedarf**

```
Haupt-Agent (in Browser):
"Ich habe analysiert. Ich brauche:
- 20 React Components
- Das ist zu viel für eine Session
→ Ich nutze Sub-Agent!"
```

### **STEP 2: Haupt-Agent sagt USER, Ordner zu erstellen**

```
Haupt-Agent: "USER, führe bitte aus in Claude Code (CEO):

mkdir -p agents/operations-dashboard/XX-agent/OUTPUT/subagents/task-name
```

### **STEP 3: USER führt aus**

```bash
# In Claude Code (CEO):
mkdir -p agents/operations-dashboard/07-frontend/OUTPUT/subagents/charts
```

### **STEP 4: Haupt-Agent erstellt Sub-Agent Prompt**

```
Haupt-Agent: "USER, speichere bitte diesen Sub-Agent Prompt:
agents/.../07-frontend/OUTPUT/subagents/charts/PROMPT.md

# SUB-AGENT PROMPT: Chart Components

## Your Role
Code Implementation Specialist for Chart Components

## Your Focused Task
Implement 12 chart components using Recharts:
1. RevenueLineChart
2. LeadFunnelChart
...

## Deliverables
Create files in:
agents/.../07-frontend/OUTPUT/subagents/charts/components/
...
"
```

### **STEP 5: USER copy-pastet Prompt in Claude Code**

```bash
# USER copy-pastet den ganzen PROMPT Content
# Dann sagt USER zum CEO:

"Starte Sub-Agent mit diesem Prompt:
[PASTE COMPLETE PROMPT]"
```

### **STEP 6: CEO startet Sub-Agent via Task tool**

```yaml
CEO führt aus:
Task(
  subagent_type: "coder",
  prompt: "[KOMPLETTER PROMPT CONTENT]",
  description: "Implement chart components"
)
```

### **STEP 7: Sub-Agent arbeitet (in Claude Code)**

```
Sub-Agent:
├─ Liest Context files
├─ Implementiert 12 Chart Components
├─ Schreibt Dateien DIREKT (hat File-System!)
│   └─ agents/.../OUTPUT/subagents/charts/components/*.tsx
└─ Reports Complete an CEO
```

### **STEP 8: CEO informiert USER**

```
CEO: "Sub-Agent complete!
Output: agents/.../OUTPUT/subagents/charts/
Files: 12 chart components + types + utils"
```

### **STEP 9: USER informiert Haupt-Agent**

```
USER (copy-pastet in Browser-Tab zu Haupt-Agent):
"Sub-Agent fertig!
Outputs in: agents/.../OUTPUT/subagents/charts/"
```

### **STEP 10: Haupt-Agent integriert**

```
Haupt-Agent (Frontend in Browser):
"Perfect! Jetzt integriere ich die Charts...

// In Dashboard Pages:
import { RevenueLineChart } from './subagents/charts/components/RevenueLineChart'

...

✅ Frontend complete mit integrierten Charts!"
```

---

## ✅ DECISION TREE: Sub-Agent nutzen oder nicht?

```
START: Du hast eine große Aufgabe
   │
   ├─→ Ist die Aufgabe fokussiert & isoliert?
   │   (z.B. "20 Components", "15 APIs", "30 Tests")
   │   │
   │   YES ─→ Ist es repetitiv/ähnlich?
   │   │      │
   │   │      YES ─→ Mehr als 10-15 items?
   │   │      │      │
   │   │      │      YES ─→ ✅ NUTZE SUB-AGENT!
   │   │      │      │
   │   │      │      NO ─→ ❌ DU machst es
   │   │      │
   │   │      NO ─→ Braucht es viele Entscheidungen?
   │   │             │
   │   │             YES ─→ ❌ DU machst es
   │   │             NO ─→ ✅ NUTZE SUB-AGENT!
   │   │
   │   NO ─→ Ist es Architektur/Integration?
   │          │
   │          YES ─→ ❌ DU machst es
   │          NO ─→ Weitere Analyse nötig
   │
   └─→ Ist es nur 1-5 items?
       │
       YES ─→ ❌ DU machst es (kein Sub-Agent nötig)
```

---

## 🎓 EXAMPLE: Frontend Developer nutzt Sub-Agent

### **Situation**

```
Frontend Developer Agent (in Browser):
"Ich habe das UI Design analysiert.

Ich muss bauen:
✅ 4 Dashboard Pages (ich mache das)
✅ 12 Chart Components (komplex, repetitiv → SUB-AGENT!)
✅ 20 Base UI Components (repetitiv → SUB-AGENT!)
✅ Routing & State (ich mache das)
✅ API Integration (ich mache das)

Ich entscheide: Charts → Sub-Agent"
```

### **Workflow**

```
[STEP 1] Frontend Agent: "USER, erstelle:
  mkdir -p agents/.../07-frontend/OUTPUT/subagents/charts"

[STEP 2] USER führt aus in CEO

[STEP 3] Frontend Agent: "Speichere Sub-Agent Prompt:
  agents/.../07-frontend/OUTPUT/subagents/charts/PROMPT.md

  [HIER KOMPLETTER CHART PROMPT]"

[STEP 4] USER copy-pastet Prompt zu CEO

[STEP 5] CEO startet:
  Task(subagent_type: "coder", prompt: "...", ...)

[STEP 6] Sub-Agent implementiert 12 Charts (30 Min)

[STEP 7] CEO: "Charts complete!"

[STEP 8] USER informiert Frontend Agent

[STEP 9] Frontend Agent:
  "Perfect! Jetzt importiere ich Charts in Dashboards:

  // pages/executive-dashboard.tsx
  import { RevenueLineChart } from '../subagents/charts/...'

  ✅ Alle 4 Dashboards mit Charts integriert!
  ✅ Routing setup!
  ✅ API integration complete!
  ✅ Frontend DONE!"
```

---

## 🔧 SUB-AGENT PROMPT TEMPLATE

### **Universal Template für ALLE Sub-Agents**

```markdown
# SUB-AGENT PROMPT: [Task Name]

**This prompt runs in Claude Code (CEO) via Task tool!**

---

## Your Role
You are a [Specialist Type] helping the [Haupt-Agent Name] with [focused task].

---

## Context Files to Read First
**MUST READ**:
```bash
cat /path/to/context/file-1.md
cat /path/to/context/file-2.md
```

---

## Your Focused Task
[Clear, specific description of EXACTLY what to implement]

### Deliverables:
1. [Item 1]
2. [Item 2]
3. [Item 3]
...

---

## Tech Stack
- [Technology 1]
- [Technology 2]
- [Technology 3]

---

## Requirements
- ✅ [Requirement 1]
- ✅ [Requirement 2]
- ✅ [Requirement 3]
- ✅ [Quality standards]

---

## File Structure
Create files in:
```bash
agents/.../XX-agent/OUTPUT/subagents/[task-name]/
├── [folder-1]/
│   ├── [file-1]
│   └── [file-2]
├── [folder-2]/
│   └── [file-3]
└── README.md
```

---

## When Done
Report back to [Haupt-Agent] with:
- ✅ List of deliverables completed
- ⚠️ Any challenges encountered
- 📋 Integration instructions (if applicable)
- 🧪 Test results (if applicable)

---

**START IMMEDIATELY!**
```

---

## 📊 SUB-AGENT BEST PRACTICES

### **✅ DO**

1. **Fokussierte Aufgabe**: Sub-Agent bekommt EINE klare Aufgabe
2. **Klare Specs**: Genaue Liste was zu implementieren ist
3. **Context Files**: Alle nötigen Files im CONTEXT/ oder OUTPUT/
4. **File Structure**: Exakte Ordner-Struktur angeben
5. **Tech Stack**: Welche Libraries/Frameworks nutzen
6. **Quality Standards**: Tests, TypeScript, etc.

### **❌ DON'T**

1. **Vage Aufgaben**: "Build the frontend" (zu breit!)
2. **Entscheidungen**: "Decide which library to use" (Haupt-Agent entscheidet!)
3. **Integration**: "Integrate with other parts" (Haupt-Agent integriert!)
4. **Architektur**: "Design the system" (Haupt-Agent designed!)

---

## 🎯 SUB-AGENT LIMITS

### **Jeder Haupt-Agent darf NUR 1 Sub-Agent haben**

```
✅ ERLAUBT:
Frontend Agent
└─→ 1 Sub-Agent (coder für Charts)

❌ NICHT ERLAUBT:
Frontend Agent
├─→ Sub-Agent 1 (Charts)
└─→ Sub-Agent 2 (Forms)  ← FORBIDDEN!
```

**Lösung wenn mehr nötig**:
```
Frontend Agent nutzt 1 Sub-Agent für BEIDE:

Sub-Agent Aufgabe:
"Implementiere:
1. 12 Chart Components
2. 13 Form Components"

→ Sub-Agent macht ALLES in einer Session
```

---

## 📞 SUB-AGENT FOLDER STRUCTURE

```
agents/operations-dashboard/XX-agent/OUTPUT/
├── [haupt-agent-outputs].md
└── subagents/
    └── [task-name]/
        ├── PROMPT.md                 ← Sub-Agent Prompt (für Dokumentation)
        ├── [deliverable-folders]/    ← Sub-Agent Outputs
        │   ├── components/
        │   ├── utils/
        │   └── types/
        └── README.md                 ← Integration Guide
```

**Beispiel Frontend Charts**:
```
07-frontend/OUTPUT/
├── component-structure.md            ← Frontend's eigene Arbeit
├── routing-setup.md                  ← Frontend's eigene Arbeit
└── subagents/
    └── charts/
        ├── PROMPT.md
        ├── components/
        │   ├── RevenueLineChart.tsx
        │   ├── LeadFunnelChart.tsx
        │   └── ... (12 total)
        ├── types/
        │   └── chart-types.ts
        ├── utils/
        │   └── chart-config.ts
        └── README.md
```

---

## 🚀 QUICK START CHECKLIST

**Wenn du ein Haupt-Agent bist und Sub-Agent brauchst**:

- [ ] Identifiziere: Aufgabe ist fokussiert, isoliert, repetitiv
- [ ] Entscheide: Sub-Agent Typ (coder, tester, researcher, etc.)
- [ ] Sage USER: Erstelle Ordner `mkdir -p .../OUTPUT/subagents/[task]`
- [ ] Erstelle: Sub-Agent PROMPT.md (nutze Template oben)
- [ ] Sage USER: "Paste diesen Prompt in Claude Code (CEO)"
- [ ] USER startet Sub-Agent via Task tool in CEO
- [ ] Sub-Agent arbeitet, schreibt Outputs
- [ ] CEO informiert USER
- [ ] USER informiert DICH
- [ ] DU integrierst Sub-Agent Outputs
- [ ] DU gibst Final Output

---

## 📚 WEITERE RESOURCEN

**Agent-Spezifische Sub-Agent Guides**:
- `07-frontend/SUB-AGENT-GUIDE.md` - Frontend Sub-Agents
- `08-backend/SUB-AGENT-GUIDE.md` - Backend Sub-Agents
- `12-qa/SUB-AGENT-GUIDE.md` - QA/Testing Sub-Agents
- `13-devops/SUB-AGENT-GUIDE.md` - DevOps Sub-Agents

**System Docs**:
- `SYSTEM-INFO.md` - Complete System Architecture
- `PARALLEL-AGENT-WORKFLOW.md` - Parallel Agent Rules
- `SUBAGENT-TEMPLATE.md` - Original Sub-Agent Template

---

**Nutze Sub-Agents weise - sie sind deine mächtigen Helfer für fokussierte Implementation!** 🚀

---

**Version**: 1.0
**Last Updated**: 2025-11-23
**Applies to**: All 13 Agents in Operations Dashboard

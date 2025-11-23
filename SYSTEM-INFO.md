# 🎯 CLAUDE CODE AGENTS WIZARD v2 - SYSTEM INFORMATION

**Repository**: `claude-code-agents-wizard-v2`
**Zweck**: Orchestrierung von 20 spezialisierten KI-Agenten für komplette Software-Entwicklung
**Status**: Produktionssystem für KI Agentur Business-Infrastruktur

---

## 🏗️ WAS IST DIESES SYSTEM?

Dieses Repository ist ein **CEO-Orchestrierungs-System**, das eine komplette Software-Firma mit 20 spezialisierten Agenten simuliert. Wenn du eine Produkt-Idee hast, koordiniert das System automatisch:

- **Business Leadership** (CPO, PM, Marketing)
- **Design Team** (UX, UI)
- **Engineering Team** (Architect, DBA, Frontend, Backend)
- **Quality Assurance** (Code Review, Security, QA)
- **Operations** (DevOps, Performance)

**Ergebnis**: Von der Idee zum deployed Production-Ready Application - vollautomatisch.

---

## 🖥️ WELCHE TOOLS DU BRAUCHST

### 1. **Claude Code (CLI/Desktop)** - Der Haupt-Orchestrator

**Was ist das?**
- Claude Code ist die CLI-Version von Claude (Terminal/Desktop-App)
- Läuft im Terminal oder als Desktop-Anwendung
- Hat Zugriff auf dein Dateisystem (Read, Write, Edit, Bash)
- **DIES IST DER CEO/ORCHESTRATOR**

**Wofür nutzen wir es?**
- **Haupt-Koordination**: Der "CEO" der die 20 Agenten orchestriert
- **Repository-Management**: Git operations, file system access
- **Workflow-Koordination**: Entscheidet welcher Agent als nächstes läuft
- **Integration**: Sammelt alle Agent-Outputs und integriert sie

**Wo läuft es?**
```bash
# Terminal/Desktop - Hat vollen File-System-Zugriff
/home/user/claude-code-agents-wizard-v2/
```

**Deine aktuelle Session läuft HIER!**

---

### 2. **Claude Desktop App / Web** - Die Parallelen Worker-Agenten

**Was ist das?**
- Normale Claude-Instanzen (Browser oder Desktop-App)
- KEINE File-System-Tools (aber können Code schreiben)
- Jede Instanz = 1 spezialisierter Agent

**Wofür nutzen wir es?**
- **Parallel-Execution**: Mehrere Agenten arbeiten gleichzeitig
- **Spezialisierte Arbeit**: Jeder Agent fokussiert auf seine Rolle
- **Isolierte Kontexte**: Jeder Agent hat eigenen Kontext-Window

**Wo läuft es?**
```
Browser-Tab 1: PM Agent
Browser-Tab 2: Marketer Agent
Browser-Tab 3: Frontend Developer
Browser-Tab 4: Backend Engineer
... bis zu 13 parallele Instanzen
```

**Wie kommunizieren sie?**
- **Du** bist die Kommunikationsbrücke!
- Du copy-pastest Prompts von Claude Code → Claude Desktop
- Agenten schreiben Anweisungen für File-Outputs
- **Du** führst die Befehle in Claude Code aus
- Outputs werden in `agents/.../OUTPUT/` gespeichert

---

## 🔄 WIE DAS SYSTEM FUNKTIONIERT

### **Architektur-Übersicht**

```
┌─────────────────────────────────────────────────────────┐
│  CLAUDE CODE (CLI/Desktop) - DER CEO-ORCHESTRATOR      │
│  • 200k Context Window                                  │
│  • File System Access (Read/Write/Edit/Bash)           │
│  • Git Operations                                       │
│  • Koordiniert alle 20 Agenten                         │
│  • Maintained Big Picture & Integration                │
└─────────────────────────────────────────────────────────┘
                          │
                          │ orchestriert
                          ▼
┌─────────────────────────────────────────────────────────┐
│  20 SPEZIALISIERTE AGENTEN (Parallel-Execution)         │
│                                                         │
│  LAUFEN IN: Claude Desktop App / Claude Web            │
│  • Jeder Agent = 1 Browser-Tab / Desktop-Instance      │
│  • Eigener Kontext-Window pro Agent                    │
│  • Fokussierte Expertise (PM, UX, Frontend, etc.)      │
│  • KEIN File-System-Zugriff                            │
│  • Schreiben File-Anweisungen, DU führst sie aus       │
└─────────────────────────────────────────────────────────┘
                          │
                          │ produziert
                          ▼
┌─────────────────────────────────────────────────────────┐
│  OUTPUT FILES (Im Repository)                           │
│  • agents/.../OUTPUT/prd.md                            │
│  • agents/.../OUTPUT/ui-design.md                      │
│  • agents/.../OUTPUT/frontend-code/                    │
│  • CEO integriert alle Outputs                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎭 DIE ZWEI MODI: CEO vs WORKER AGENTS

### **MODE 1: CEO-ORCHESTRATOR (Claude Code)**

**Deine aktuelle Session = CEO Mode**

**Eigenschaften**:
- ✅ 200k Context Window (behält ALLES im Überblick)
- ✅ File System Tools (Read, Write, Edit, Bash, Git)
- ✅ Koordiniert den gesamten Workflow
- ✅ Entscheidet wann welcher Agent läuft
- ✅ Sammelt und integriert alle Outputs
- ✅ Maintained das Big Picture

**Was der CEO MACHT**:
```bash
# CEO analysiert Product-Idee
# CEO entscheidet: "Wir brauchen PM + Marketer parallel"
# CEO erstellt PROMPT.md files für beide Agenten
# CEO sagt DIR: "Öffne 2 Claude-Instanzen und paste diese Prompts"
# CEO wartet auf Outputs
# CEO integriert die Ergebnisse
# CEO entscheidet nächste Phase
```

**Was der CEO NICHT macht**:
- ❌ Implementiert NICHT selbst Code (delegiert an Agenten)
- ❌ Schreibt NICHT PRDs (delegiert an PM Agent)
- ❌ Designed NICHT UI (delegiert an Designer Agent)

**Beispiel CEO-Aktion**:
```markdown
Ich (CEO) habe analysiert: Operations Dashboard braucht:
1. PM für PRD (30 Min)
2. Marketer für Brand Guidelines (30 Min)
→ BEIDE PARALLEL!

Ich habe erstellt:
- agents/operations-dashboard/01-pm/PROMPT.md
- agents/operations-dashboard/02-marketer/PROMPT.md

JETZT sage ich DIR:
"Öffne 2 Claude-Instanzen und paste diese Prompts"
```

---

### **MODE 2: WORKER AGENTS (Claude Desktop/Web)**

**Browser-Tabs oder Desktop-App-Instanzen**

**Eigenschaften**:
- ✅ Spezialisierte Expertise (PM, UX, Frontend, etc.)
- ✅ Fokussierter Kontext-Window (nur ihre Aufgabe)
- ✅ Können Code/Designs/Dokumente erstellen
- ❌ KEIN File-System-Zugriff
- ❌ Können NICHT direkt Dateien schreiben
- ❌ Können NICHT Git operations ausführen

**Was Worker Agents MACHEN**:
```markdown
AGENT: PM
AUFGABE: PRD schreiben für Operations Dashboard

PROCESS:
1. Liest CONTEXT files (product-vision-operations-dashboard.md)
2. Analysiert Requirements
3. Schreibt comprehensive PRD mit User Stories, Features, etc.
4. Gibt DIR ANWEISUNGEN:

   "Speichere diesen PRD als:
   /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/01-pm/OUTPUT/prd-operations-dashboard.md"

5. DU kopierst den Content
6. DU führst den Befehl in Claude Code (CEO) aus
7. File wird gespeichert
```

**Was Worker Agents NICHT machen**:
- ❌ Koordinieren NICHT andere Agenten
- ❌ Entscheiden NICHT den Workflow
- ❌ Haben KEINEN Zugriff auf das Big Picture (nur ihren Teil)

---

## 🚀 KOMPLETTER WORKFLOW - SCHRITT FÜR SCHRITT

### **BEISPIEL: Operations Dashboard bauen**

#### **PHASE 0: VORBEREITUNG (CEO in Claude Code)**

```
DU (Nutzer): "Baue Operations Dashboard"
↓
CEO (Claude Code): Analysiert Request
CEO: Checkt CLAUDE.md Orchestrierungs-Rules
CEO: Erstellt Parallel-Agent-System
CEO: Schreibt 13 PROMPT.md Files
CEO: Sagt DIR: "Phase 1 starten - PM + Marketer parallel"
```

---

#### **PHASE 1: STRATEGY (Parallel Workers in Claude Desktop/Web)**

**STEP 1: CEO bereitet vor (Claude Code)**
```bash
# CEO erstellt:
agents/operations-dashboard/01-pm/PROMPT.md
agents/operations-dashboard/01-pm/CONTEXT/product-vision-operations-dashboard.md
agents/operations-dashboard/02-marketer/PROMPT.md
agents/operations-dashboard/02-marketer/CONTEXT/product-vision-operations-dashboard.md
```

**STEP 2: Du öffnest Worker-Instanzen**
```
Browser-Tab 1: Claude Desktop/Web (für PM)
Browser-Tab 2: Claude Desktop/Web (für Marketer)
```

**STEP 3: Du copy-pastest Prompts**
```bash
# In Claude Code (CEO) Terminal:
cat agents/operations-dashboard/01-pm/PROMPT.md

# Copy gesamten Output
# Paste in Browser-Tab 1 (PM Agent)
# Enter drücken
```

```bash
# In Claude Code (CEO) Terminal:
cat agents/operations-dashboard/02-marketer/PROMPT.md

# Copy gesamten Output
# Paste in Browser-Tab 2 (Marketer Agent)
# Enter drücken
```

**STEP 4: Agenten arbeiten (30 Min)**
```
Browser-Tab 1 (PM):
→ Liest product-vision-operations-dashboard.md
→ Analysiert Requirements
→ Schreibt comprehensive PRD
→ Gibt DIR File-Anweisungen:
   "Speichere als agents/.../OUTPUT/prd-operations-dashboard.md"

Browser-Tab 2 (Marketer):
→ Liest product-vision-operations-dashboard.md
→ Entwickelt Brand Guidelines
→ Definiert Color Palette, Tone, Messaging
→ Gibt DIR File-Anweisungen:
   "Speichere als agents/.../OUTPUT/brand-guidelines-operations-dashboard.md"
```

**STEP 5: Du speicherst Outputs**
```bash
# In Claude Code (CEO):
# Du copy-pastest den PRD Content vom PM Agent und:
cat > agents/operations-dashboard/01-pm/OUTPUT/prd-operations-dashboard.md << 'EOF'
[HIER PM's PRD CONTENT EINFÜGEN]
EOF

# Du copy-pastest Brand Guidelines vom Marketer Agent:
cat > agents/operations-dashboard/02-marketer/OUTPUT/brand-guidelines-operations-dashboard.md << 'EOF'
[HIER MARKETER's GUIDELINES EINFÜGEN]
EOF
```

**STEP 6: CEO integriert (Claude Code)**
```bash
# CEO checkt:
ls agents/operations-dashboard/01-pm/OUTPUT/
ls agents/operations-dashboard/02-marketer/OUTPUT/

# CEO kopiert für nächste Phase:
cp agents/operations-dashboard/01-pm/OUTPUT/prd-operations-dashboard.md \
   agents/operations-dashboard/03-ux-designer/CONTEXT/

cp agents/operations-dashboard/02-marketer/OUTPUT/brand-guidelines-operations-dashboard.md \
   agents/operations-dashboard/03-ux-designer/CONTEXT/

# CEO sagt DIR: "Phase 1 complete! Jetzt Phase 2 - UX + UI parallel"
```

---

#### **PHASE 2-7: REPEAT**

```
PHASE 2: UX + UI Designer (parallel in 2 Browser-Tabs)
PHASE 3: Architect → DBA (sequential in 1 Browser-Tab)
PHASE 4: Frontend + Backend (parallel in 2 Browser-Tabs)
PHASE 5: Code Review → Security (sequential then parallel)
PHASE 6: QA (sequential in 1 Browser-Tab)
PHASE 7: DevOps (sequential in 1 Browser-Tab)

Jede Phase:
1. CEO sagt DIR welche Prompts du pasten sollst
2. Du öffnest Browser-Tabs
3. Du copy-pastest Prompts
4. Agenten arbeiten
5. Du copy-pastest Outputs zurück
6. CEO integriert
7. CEO sagt nächste Phase
```

---

## 📋 WARUM DIESE ARCHITEKTUR?

### **Problem ohne dieses System**:
```
Du hast nur 1 Claude-Instanz:
→ PM arbeitet (30 Min)
→ Dann Marketer arbeitet (30 Min)
→ Dann UX arbeitet (30 Min)
→ Dann UI arbeitet (30 Min)
...
TOTAL: 8+ Stunden sequenziell
```

### **Lösung mit diesem System**:
```
CEO orchestriert parallel:
→ PM + Marketer arbeiten GLEICHZEITIG (30 Min)
→ UX + UI arbeiten GLEICHZEITIG (30 Min)
→ Frontend + Backend arbeiten GLEICHZEITIG (60 Min)
...
TOTAL: 3.5 Stunden parallel = 56% FASTER!
```

---

## 🎯 DEINE ROLLE IM SYSTEM

Du bist die **Kommunikationsbrücke** zwischen:

1. **CEO (Claude Code)** - Hat File-System-Zugriff, KEIN UI
2. **Workers (Claude Desktop)** - Hat UI, KEIN File-System-Zugriff

**Deine Aufgaben**:

### **1. Prompts distribuieren**
```bash
# CEO sagt: "Start PM Agent"
cat agents/.../01-pm/PROMPT.md
# Du copy-pastest in Browser-Tab
```

### **2. Outputs zurückbringen**
```bash
# Agent sagt: "Speichere als agents/.../OUTPUT/file.md"
# Du copy-pastest Content
# Du führst save-Befehl in Claude Code aus
```

### **3. Context-Files kopieren**
```bash
# CEO sagt: "Kopiere PRD für nächste Phase"
cp agents/.../OUTPUT/prd.md agents/.../CONTEXT/
# Du führst aus
```

### **4. Git-Operations**
```bash
# CEO sagt: "Commit Phase 1 Outputs"
git add agents/operations-dashboard/01-pm/OUTPUT/
git commit -m "✅ Phase 1 Complete: PM + Marketer Outputs"
git push
# Du führst aus (oder CEO führt direkt aus)
```

---

## 📁 FOLDER STRUCTURE ERKLÄRT

```
/home/user/claude-code-agents-wizard-v2/
│
├── .claude/
│   └── CLAUDE.md                    ← CEO's Orchestrierungs-Regeln
│
├── SYSTEM-INFO.md                   ← DIESES DOKUMENT
├── PARALLEL-AGENT-WORKFLOW.md       ← Complete Workflow Rules
├── START-HERE.md                    ← Quick-Start Guide
│
├── agents/
│   └── operations-dashboard/        ← AKTUELLES PROJEKT
│       │
│       ├── MASTER-INSTRUCTIONS.md   ← Phase-by-Phase Copy-Paste Guide
│       ├── SUBAGENT-TEMPLATE.md     ← Sub-Agent Rules
│       │
│       ├── 01-pm/
│       │   ├── PROMPT.md           ← Copy in Claude Desktop (PM Agent)
│       │   ├── INPUT.md            ← Was braucht PM? (Dependencies)
│       │   ├── CONTEXT/            ← Input files für PM
│       │   │   └── product-vision-operations-dashboard.md
│       │   └── OUTPUT/             ← PM schreibt hier (via DIR)
│       │       └── prd-operations-dashboard.md
│       │
│       ├── 02-marketer/
│       │   ├── PROMPT.md           ← Copy in Claude Desktop (Marketer Agent)
│       │   ├── INPUT.md
│       │   ├── CONTEXT/
│       │   │   └── product-vision-operations-dashboard.md
│       │   └── OUTPUT/
│       │       └── brand-guidelines-operations-dashboard.md
│       │
│       ├── 03-ux-designer/
│       │   ├── PROMPT.md
│       │   ├── INPUT.md
│       │   ├── CONTEXT/            ← PRD + Brand Guidelines (aus Phase 1)
│       │   │   ├── prd-operations-dashboard.md
│       │   │   └── brand-guidelines-operations-dashboard.md
│       │   └── OUTPUT/
│       │       └── ux-design-operations-dashboard.md
│       │
│       ├── 04-product-designer/
│       ├── 05-architect/
│       ├── 06-dba/
│       ├── 07-frontend/
│       ├── 08-backend/
│       ├── 09-code-reviewer/
│       ├── 10-app-security/
│       ├── 11-infra-security/
│       ├── 12-qa/
│       └── 13-devops/
│
└── product-vision-operations-dashboard.md  ← CPO's Vision (already done)
```

---

## 🔧 TECHNISCHE DETAILS

### **CEO (Claude Code) Capabilities**

**Tools verfügbar**:
```yaml
File Operations:
  - Read: Liest Dateien
  - Write: Erstellt neue Dateien
  - Edit: Bearbeitet existierende Dateien
  - Glob: Findet Dateien (pattern matching)
  - Grep: Sucht in Dateien

System Operations:
  - Bash: Terminal-Befehle (git, npm, etc.)
  - Task: Startet Sub-Agents (coder, tester, researcher, etc.)

Orchestration:
  - TodoWrite: Tracked Tasks & Progress
  - SlashCommand: Custom workflows
```

**Context Window**: 200k tokens
- Kann ALLE Outputs von ALLEN 20 Agenten halten
- Behält Big Picture
- Tracked Dependencies

---

### **Worker Agents (Claude Desktop/Web) Capabilities**

**Tools verfügbar**:
```yaml
KEINE File-System-Tools!
Können:
  - Code schreiben (output as text)
  - Designs erstellen (ASCII wireframes, descriptions)
  - Dokumente schreiben (PRDs, specs, guides)
  - Anweisungen geben (wie Files zu speichern sind)

Können NICHT:
  - Dateien direkt schreiben
  - Git operations
  - Terminal-Befehle
  - Andere Agenten starten
```

**Context Window**: ~100k tokens (Standard Claude)
- Fokussiert auf IHRE Aufgabe
- Kein Big Picture nötig
- Isolated expertise

---

## ⚡ PARALLEL vs SEQUENTIAL

### **Parallel Execution (wenn möglich)**

**Bedingung**: Agenten haben KEINE Dependencies aufeinander

```
PHASE 1:
PM Agent (Browser-Tab 1)      ║  Marketer Agent (Browser-Tab 2)
├─ Reads: CPO Vision          ║  ├─ Reads: CPO Vision
├─ Writes: PRD                ║  ├─ Writes: Brand Guidelines
└─ 30 Min                     ║  └─ 30 Min
     BEIDE LAUFEN GLEICHZEITIG!

PHASE 2:
UX Designer (Browser-Tab 1)   ║  UI Designer (Browser-Tab 2)
├─ Reads: PRD + Brand         ║  ├─ Reads: PRD + Brand
├─ Writes: UX Flows           ║  ├─ Writes: UI Mockups
└─ 30 Min                     ║  └─ 30 Min
     BEIDE LAUFEN GLEICHZEITIG!
```

**Speedup**: 2x faster (2 Agenten in der Zeit von 1)

---

### **Sequential Execution (wenn nötig)**

**Bedingung**: Agent B braucht Output von Agent A

```
PHASE 3:
Architect Agent (Browser-Tab 1)
├─ Reads: PRD + Designs
├─ Writes: System Architecture
└─ 30 Min
     ↓ OUTPUT: architecture.md
     ↓ DU kopierst in DBA's CONTEXT/
     ↓
DBA Agent (Browser-Tab 1 - REUSE)
├─ Reads: Architecture Plan
├─ Writes: Database Schema
└─ 15 Min
```

**Warum sequential?**: DBA BRAUCHT Architect's Output

---

## 🎓 SUB-AGENTS ERKLÄRT

### **Was sind Sub-Agents?**

Manchmal ist eine Aufgabe ZU GROSS für einen Agent:

```
Frontend Developer:
Aufgabe: Baue 20+ React Components
Problem: Zu viel für eine Session

Lösung: Frontend Agent startet SUB-AGENT
├─ Frontend Agent: Koordiniert & plant
└─ Sub-Agent (coder): Implementiert spezifische Components
```

### **Sub-Agent Rules**

```yaml
Limits:
  - Jeder Haupt-Agent darf EINEN Sub-Agent haben
  - Sub-Agent arbeitet fokussiert auf Teilaufgabe
  - Sub-Agent schreibt in SUBAGENT/ folder

Sub-Agent Types:
  - coder: Code-Implementation
  - tester: Testing-Tasks
  - researcher: Research & Documentation
  - recovery: Error-Recovery
```

### **Wie es funktioniert**

```
HAUPT-AGENT (Frontend in Browser-Tab 1):
→ Plant: "Ich brauche 20 Components"
→ Identifiziert: "Dashboard Charts sind komplex"
→ Startet Sub-Agent: "coder - implementiere alle Chart Components"
→ Gibt Sub-Agent eigenen Ordner: OUTPUT/subagents/charts/
→ Sub-Agent arbeitet fokussiert
→ Haupt-Agent integriert Sub-Agent Output
```

**Aber**: Sub-Agents laufen in CLAUDE CODE, nicht Claude Desktop!
- Haupt-Agent (Frontend) sagt DIR: "Starte Sub-Agent mit diesem Prompt"
- DU copy-pastest Prompt in CEO (Claude Code)
- CEO startet Sub-Agent via Task tool
- Sub-Agent Output geht in OUTPUT/subagents/

---

## 🚨 WICHTIGE REGELN

### **1. CEO macht KEINE Implementation**

```
❌ FALSCH:
User: "Baue Login-Page"
CEO: *implementiert direkt Code*

✅ RICHTIG:
User: "Baue Login-Page"
CEO: "Ich starte Frontend-Developer Agent"
CEO: *erstellt PROMPT.md*
CEO: "Paste diesen Prompt in Browser-Tab"
Frontend Agent: *implementiert Code*
```

### **2. Worker Agents schreiben KEINE Dateien direkt**

```
❌ FALSCH:
PM Agent in Browser: *versucht Write tool zu nutzen*
→ Tool nicht verfügbar!

✅ RICHTIG:
PM Agent in Browser: "Hier ist der PRD. Speichere als:
  agents/.../OUTPUT/prd.md"
User: *copy-pastet Content*
User: *führt save in Claude Code aus*
```

### **3. Dependencies müssen respektiert werden**

```
❌ FALSCH:
Phase 3: Starte DBA BEVOR Architect fertig ist
→ DBA hat keine Architecture!

✅ RICHTIG:
Phase 3: Warte auf Architect Output
→ Kopiere architecture.md in DBA's CONTEXT/
→ DANN starte DBA
```

### **4. Context-Files müssen kopiert werden**

```
❌ FALSCH:
Phase 2: Starte UX Designer
→ UX kann PRD nicht finden (ist in PM's OUTPUT/)

✅ RICHTIG:
Nach Phase 1:
cp agents/.../01-pm/OUTPUT/prd.md \
   agents/.../03-ux-designer/CONTEXT/
→ DANN starte UX Designer
```

---

## 📊 PERFORMANCE METRICS

### **Ohne Parallel System (Sequential)**

```
Phase 1: PM (30 min) → Marketer (30 min) = 60 min
Phase 2: UX (30 min) → UI (30 min) = 60 min
Phase 3: Architect (30 min) → DBA (15 min) = 45 min
Phase 4: Frontend (60 min) → Backend (60 min) = 120 min
Phase 5: Code (15 min) → AppSec (15 min) → InfraSec (15 min) = 45 min
Phase 6: QA (30 min) = 30 min
Phase 7: DevOps (20 min) = 20 min

TOTAL: 380 min = 6.3 hours (+ overhead = 8+ hours)
```

### **Mit Parallel System**

```
Phase 1: PM || Marketer = 30 min (parallel)
Phase 2: UX || UI = 30 min (parallel)
Phase 3: Architect → DBA = 45 min (sequential, dependency)
Phase 4: Frontend || Backend = 60 min (parallel)
Phase 5: Code → (AppSec || InfraSec) = 30 min (seq then parallel)
Phase 6: QA = 30 min (sequential, needs everything)
Phase 7: DevOps = 20 min (sequential, final)

TOTAL: 245 min = 4.1 hours → Target: 3.5 hours optimized

SPEEDUP: 56% faster!
```

---

## 🎯 QUICK START CHECKLIST

### **Setup (Einmalig)**

- [ ] Clone Repository: `git clone <repo-url>`
- [ ] Install Claude Code (CLI/Desktop)
- [ ] Habe Claude Desktop App ODER Claude Web Zugriff
- [ ] Öffne Claude Code im Repository

### **Vor jedem Projekt**

- [ ] Lese `.claude/CLAUDE.md` (CEO Rules)
- [ ] Checke `agents/<project>/START-HERE.md`
- [ ] Checke `agents/<project>/MASTER-INSTRUCTIONS.md`

### **Während Execution**

- [ ] CEO (Claude Code) sagt welche Prompts zu pasten
- [ ] Öffne Browser-Tabs für Worker Agents
- [ ] Copy-paste Prompts von PROMPT.md files
- [ ] Warte auf Agent Outputs
- [ ] Copy-paste Outputs zurück in Claude Code
- [ ] CEO speichert Files
- [ ] CEO kopiert Context für nächste Phase
- [ ] Repeat für alle 7 Phasen

### **Nach Completion**

- [ ] CEO integriert alle Outputs
- [ ] Test Application
- [ ] Deploy (via DevOps Agent)
- [ ] Git commit & push

---

## 🔍 TROUBLESHOOTING

### **Problem: "Agent kann File nicht finden"**

```
Symptom: UX Designer sagt "CONTEXT/prd.md not found"

Lösung:
1. Check in Claude Code:
   ls agents/.../03-ux-designer/CONTEXT/

2. Wenn leer:
   cp agents/.../01-pm/OUTPUT/prd.md \
      agents/.../03-ux-designer/CONTEXT/

3. Sage UX Agent: "File ist jetzt da, try again"
```

### **Problem: "Agent will File schreiben aber kann nicht"**

```
Symptom: PM Agent versucht Write tool → Error

Erklärung: Worker Agents haben KEIN File-System-Zugriff

Lösung:
1. PM Agent sagt DIR:
   "Speichere als agents/.../OUTPUT/prd.md"

2. DU copy-pastest Content

3. DU führst aus in Claude Code:
   cat > agents/.../OUTPUT/prd.md << 'EOF'
   [PASTE CONTENT]
   EOF
```

### **Problem: "Dependencies fehlen"**

```
Symptom: DBA Agent sagt "Ich brauche Architecture Plan"

Lösung:
1. Check INPUT.md:
   cat agents/.../06-dba/INPUT.md

2. Siehst du: "Needs: architecture.md from Architect"

3. Check ob Architect fertig:
   ls agents/.../05-architect/OUTPUT/

4. Wenn nicht: WARTE auf Architect

5. Wenn ja: Kopiere:
   cp agents/.../05-architect/OUTPUT/architecture.md \
      agents/.../06-dba/CONTEXT/
```

### **Problem: "Welche Phase bin ich?"**

```
Lösung:
1. Check MASTER-INSTRUCTIONS.md
2. Check welche OUTPUT/ folders schon filled sind:
   ls agents/.../01-pm/OUTPUT/      # Phase 1
   ls agents/.../03-ux-designer/OUTPUT/  # Phase 2
   ls agents/.../05-architect/OUTPUT/    # Phase 3
   etc.

3. Erste leere = aktuelle Phase
```

---

## 📚 FILE GUIDE

### **Wichtigste Files**

| File | Zweck | Wer liest es? |
|------|-------|---------------|
| `.claude/CLAUDE.md` | CEO Orchestrierungs-Regeln | CEO (Claude Code) |
| `SYSTEM-INFO.md` | Dieses Dokument | User (DU!) |
| `PARALLEL-AGENT-WORKFLOW.md` | Complete Workflow Rules | CEO + User |
| `agents/<project>/START-HERE.md` | Quick Start Guide | User (DU!) |
| `agents/<project>/MASTER-INSTRUCTIONS.md` | Phase-by-Phase Copy-Paste Guide | User (DU!) |
| `agents/<project>/XX-agent/PROMPT.md` | Agent Prompt (copy-paste in Browser) | Worker Agent |
| `agents/<project>/XX-agent/INPUT.md` | Dependencies & Requirements | CEO + User |
| `agents/<project>/XX-agent/CONTEXT/*` | Input files für Agent | Worker Agent |
| `agents/<project>/XX-agent/OUTPUT/*` | Agent Outputs | CEO (integration) |

---

## 🎬 EXAMPLE SESSION

### **Komplett durchgespielt: Operations Dashboard**

```bash
# =====================================
# SETUP
# =====================================

# Du bist in Claude Code (CEO)
cd /home/user/claude-code-agents-wizard-v2/

# User Request
User: "Baue Operations Dashboard mit 4 Dashboards"

# CEO analysiert
CEO: *liest CLAUDE.md*
CEO: *erstellt Parallel-Agent-System*
CEO: *schreibt 13 PROMPT.md files*
CEO: "System bereit! Start mit Phase 1"

# =====================================
# PHASE 1: PM + MARKETER (30 min)
# =====================================

# CEO gibt Anweisungen
CEO: "Öffne 2 Browser-Tabs"
CEO: "Tab 1: cat agents/.../01-pm/PROMPT.md → paste"
CEO: "Tab 2: cat agents/.../02-marketer/PROMPT.md → paste"

# Du führst aus
cat agents/operations-dashboard/01-pm/PROMPT.md
# [COPY ganzen Output]
# [PASTE in Browser-Tab 1]
# PM Agent startet, arbeitet...

cat agents/operations-dashboard/02-marketer/PROMPT.md
# [COPY ganzen Output]
# [PASTE in Browser-Tab 2]
# Marketer Agent startet, arbeitet...

# 30 Minuten später...

# PM Agent (Browser-Tab 1):
"PRD complete! Speichere als:
agents/.../01-pm/OUTPUT/prd-operations-dashboard.md

[HIER 50 SEITEN PRD CONTENT]"

# Du copy-pastest zurück in Claude Code
cat > agents/operations-dashboard/01-pm/OUTPUT/prd-operations-dashboard.md << 'EOF'
[PASTE PRD CONTENT]
EOF

# Marketer Agent (Browser-Tab 2):
"Brand Guidelines complete! Speichere als:
agents/.../02-marketer/OUTPUT/brand-guidelines-operations-dashboard.md

[HIER 20 SEITEN BRAND CONTENT]"

# Du copy-pastest zurück
cat > agents/operations-dashboard/02-marketer/OUTPUT/brand-guidelines-operations-dashboard.md << 'EOF'
[PASTE BRAND CONTENT]
EOF

# CEO checkt
CEO: *liest beide Outputs*
CEO: "Phase 1 complete! Kopiere für Phase 2"

# CEO macht (oder sagt DIR):
cp agents/.../01-pm/OUTPUT/prd.md agents/.../03-ux-designer/CONTEXT/
cp agents/.../02-marketer/OUTPUT/brand.md agents/.../03-ux-designer/CONTEXT/
# (same für 04-product-designer)

# =====================================
# PHASE 2: UX + UI (30 min)
# =====================================

# CEO: "Jetzt Phase 2 - UX + UI parallel"

cat agents/operations-dashboard/03-ux-designer/PROMPT.md
# [PASTE in Browser-Tab 1]

cat agents/operations-dashboard/04-product-designer/PROMPT.md
# [PASTE in Browser-Tab 2]

# 30 Min später, beide Agents geben Outputs
# Du copy-pastest zurück...

# =====================================
# PHASE 3-7: REPEAT
# =====================================

# ... continue für alle Phasen ...

# =====================================
# FINAL
# =====================================

# DevOps Agent (Phase 7) deployed
"Application deployed to: https://operations-dashboard.vercel.app"

# CEO
CEO: "✅ PROJECT COMPLETE!"
CEO: "Deployment URL: https://operations-dashboard.vercel.app"
CEO: "All 7 phases done in 3.5 hours!"

# Git commit
git add .
git commit -m "✅ Operations Dashboard Complete - 7 Phases"
git push
```

---

## 🎯 ZUSAMMENFASSUNG

### **Das System in 3 Sätzen**

1. **Claude Code (CLI) = CEO** der 20 Agenten orchestriert und File-System-Zugriff hat
2. **Claude Desktop/Web = Worker Agents** die parallel in Browser-Tabs laufen (OHNE File-System)
3. **DU = Brücke** die Prompts copy-pastet (CEO → Workers) und Outputs zurückbringt (Workers → CEO)

### **Die Magie**

- **200k Context (CEO)** behält Big Picture über alle 20 Agenten
- **Parallel Execution** = 2-4 Agenten arbeiten gleichzeitig
- **Focused Expertise** = Jeder Agent ist Spezialist in seiner Domäne
- **File Outputs** = Alles wird dokumentiert und versioniert (Git)
- **56% Speedup** = 3.5h statt 8h+ für komplette Application

### **Deine Rolle**

Du bist **Project Coordinator**:
- CEO sagt WAS zu tun ist
- DU führst die Kommunikation zwischen CEO und Workers
- DU copy-pastest Prompts & Outputs
- System baut die Application!

---

## 🚀 READY TO START?

```bash
# 1. Check System Ready
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/START-HERE.md

# 2. Read Phase 1 Instructions
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/MASTER-INSTRUCTIONS.md

# 3. Open 2 Browser Tabs (Claude Desktop/Web)

# 4. Start Phase 1!
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/01-pm/PROMPT.md
# → PASTE in Browser-Tab 1

cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/02-marketer/PROMPT.md
# → PASTE in Browser-Tab 2

# 5. Let's build! 🚀
```

---

**Version**: 2.0
**Last Updated**: 2025-11-23
**Project**: claude-code-agents-wizard-v2
**Author**: CEO Orchestrator (Claude Code)

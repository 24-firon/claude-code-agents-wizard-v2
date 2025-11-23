# 🔥 PARALLEL AGENT WORKFLOW - REGELWERK

**Status**: Phase 2 - Operations Dashboard Build
**Methode**: Parallel statt Sequenziell
**Zeitersparnis**: 70-80% (von 8 Stunden → 2-3 Stunden)

---

## 🎯 KONZEPT

Statt **14 Agents sequenziell** (8+ Stunden):
- Öffne **mehrere Claude-Instanzen parallel**
- Jeder Agent arbeitet in eigenem Ordner
- Prompts sind vorbereitet
- Am Ende: Alle Ergebnisse zusammenführen

---

## 📁 ORDNERSTRUKTUR

```
/home/user/claude-code-agents-wizard-v2/
└── agents/
    └── operations-dashboard/
        ├── 01-pm/                      # Senior Product Manager
        │   ├── PROMPT.md              # Dein Copy-Paste Prompt
        │   ├── INPUT.md               # Was der Agent bekommt
        │   └── OUTPUT/                # Agent schreibt hier
        ├── 02-marketer/               # Marketer
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        ├── 03-ux-designer/            # UX Designer
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        ├── 04-product-designer/       # Product Designer
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        ├── 05-architect/              # Software Architect
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        ├── 06-dba/                    # Database Administrator
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        ├── 07-frontend/               # Frontend Developer
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        ├── 08-backend/                # Backend Engineer
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        ├── 09-code-reviewer/          # Code Reviewer
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        ├── 10-app-security/           # App Security Engineer
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        ├── 11-infra-security/         # Security Auditor
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        ├── 12-qa/                     # QA Engineer
        │   ├── PROMPT.md
        │   ├── INPUT.md
        │   └── OUTPUT/
        └── 13-devops/                 # DevOps Engineer
            ├── PROMPT.md
            ├── INPUT.md
            └── OUTPUT/
```

---

## ⚡ PARALLEL-GRUPPEN (Dependencies beachten!)

### **GRUPPE 1: Strategy** (PM + Marketer parallel)
✅ **CPO DONE** - Product Vision bereits fertig

**Parallel starten**:
- 🟢 **PM** (Senior Product Manager) - braucht CPO Vision
- 🟢 **Marketer** - braucht CPO Vision

**Zeit**: ~30 Min parallel (statt 60 Min sequenziell)
**Instanzen**: 2

---

### **GRUPPE 2: Design** (UX + UI parallel)
**Warten auf**: PM (brauchen PRD)

**Parallel starten**:
- 🟢 **UX Designer** - braucht PRD + Brand Guidelines
- 🟢 **Product Designer** - braucht PRD + Brand Guidelines

**Zeit**: ~30 Min parallel (statt 60 Min sequenziell)
**Instanzen**: 2

---

### **GRUPPE 3: Architecture** (Architect → DBA sequenziell)
**Warten auf**: UX + UI Design

**Sequenziell**:
1. 🔵 **Software Architect** zuerst (braucht PRD + Designs)
2. 🔵 **DBA** danach (braucht Architecture)

**Zeit**: ~45 Min sequenziell (DBA braucht Architect Output)
**Instanzen**: 1 (nacheinander)

---

### **GRUPPE 4: Implementation** (Frontend + Backend parallel)
**Warten auf**: Architecture + DBA

**Parallel starten**:
- 🟢 **Frontend Developer** - braucht Designs + Architecture
- 🟢 **Backend Engineer** - braucht Architecture + DB Schema

**Zeit**: ~60 Min parallel (statt 120 Min sequenziell)
**Instanzen**: 2

---

### **GRUPPE 5: Quality** (Code Review → Security parallel)
**Warten auf**: Frontend + Backend fertig

**Sequenziell + Parallel**:
1. 🔵 **Code Reviewer** zuerst (15 Min)
2. Dann parallel:
   - 🟢 **App Security Engineer**
   - 🟢 **Security Auditor**

**Zeit**: ~30 Min (15 + 15 parallel)
**Instanzen**: 2 (nach Code Review)

---

### **GRUPPE 6: Testing** (QA alleine)
**Warten auf**: Security Audits fertig

**Sequenziell**:
- 🔵 **QA Engineer** (braucht alles: Code + Security Reports)

**Zeit**: ~30 Min
**Instanzen**: 1

---

### **GRUPPE 7: Deployment** (DevOps alleine)
**Warten auf**: QA Sign-Off

**Sequenziell**:
- 🔵 **DevOps Engineer** (braucht QA-approved Code)

**Zeit**: ~20 Min
**Instanzen**: 1

---

## 🎯 OPTIMALER WORKFLOW

### **PHASE 1** (Jetzt sofort - 2 Instanzen)
```
Instanz A: PM (Senior Product Manager)
Instanz B: Marketer
```
**Dauer**: 30 Min parallel
**Output**: PRD + Brand Guidelines

---

### **PHASE 2** (Nach PM fertig - 2 Instanzen)
```
Instanz A: UX Designer
Instanz B: Product Designer
```
**Dauer**: 30 Min parallel
**Output**: UX Flows + UI Mockups

---

### **PHASE 3** (Nach Design fertig - 1 Instanz → dann 1 Instanz)
```
Instanz A: Software Architect (30 Min)
Dann:
Instanz A: DBA (15 Min)
```
**Dauer**: 45 Min sequenziell
**Output**: Architecture + DB Schema

---

### **PHASE 4** (Nach Architecture fertig - 2 Instanzen)
```
Instanz A: Frontend Developer
Instanz B: Backend Engineer
```
**Dauer**: 60 Min parallel
**Output**: Complete Application Code

---

### **PHASE 5** (Nach Code fertig - 1 Instanz → dann 2 Instanzen)
```
Instanz A: Code Reviewer (15 Min)
Dann parallel:
Instanz A: App Security Engineer
Instanz B: Security Auditor
```
**Dauer**: 30 Min (15 + 15 parallel)
**Output**: Quality + Security Reports

---

### **PHASE 6** (Nach Security fertig - 1 Instanz)
```
Instanz A: QA Engineer
```
**Dauer**: 30 Min
**Output**: Test Results

---

### **PHASE 7** (Nach QA fertig - 1 Instanz)
```
Instanz A: DevOps Engineer
```
**Dauer**: 20 Min
**Output**: Deployment Ready

---

## 📋 WIE DU ES MACHST

### **Schritt 1**: Ordner öffnen
```bash
cd /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/01-pm
```

### **Schritt 2**: PROMPT.md öffnen
```bash
cat PROMPT.md
```

### **Schritt 3**: In neue Claude-Instanz kopieren
- Öffne neue Claude Web/Desktop Instanz
- Paste den kompletten Prompt
- Agent arbeitet

### **Schritt 4**: Output holen
Wenn Agent fertig:
```bash
# Agent schreibt nach OUTPUT/
ls OUTPUT/
```

### **Schritt 5**: Nächste Gruppe starten
Sobald Dependencies erfüllt (z.B. PM fertig → UX starten)

---

## 🚀 GESCHWINDIGKEITSVERGLEICH

**Sequenziell** (altes System):
```
PM (30) → Marketer (30) → UX (30) → UI (30) → Architect (30) →
DBA (15) → Frontend (60) → Backend (60) → Code Review (15) →
Security (15+15) → QA (30) → DevOps (20)

TOTAL: 8+ Stunden
```

**Parallel** (neues System):
```
PHASE 1: PM + Marketer (30 Min parallel)
PHASE 2: UX + UI (30 Min parallel)
PHASE 3: Architect → DBA (45 Min sequenziell)
PHASE 4: Frontend + Backend (60 Min parallel)
PHASE 5: Code Review → Security (30 Min)
PHASE 6: QA (30 Min)
PHASE 7: DevOps (20 Min)

TOTAL: 3.5 Stunden (245 Min)
SPEEDUP: 56% schneller!
```

---

## ⚠️ WICHTIGE REGELN

### **Dependencies beachten!**
❌ **NICHT starten**:
- UX/UI Designer OHNE PM fertig (brauchen PRD)
- DBA OHNE Architect fertig (braucht Architecture)
- Frontend/Backend OHNE Architecture + DBA (brauchen beide)
- Security OHNE Code Review (sollte zuerst)
- QA OHNE Security (braucht Security Reports)
- DevOps OHNE QA Sign-Off

✅ **KANN parallel**:
- PM + Marketer (beide brauchen nur CPO Vision)
- UX + UI Designer (beide brauchen PRD + Brand)
- Frontend + Backend (beide brauchen Architecture + DB)
- App Security + Security Auditor (beide brauchen Code)

### **Jeder Agent darf 1 Unteragenten haben**
Beispiel: Frontend Developer darf intern `Task` tool nutzen für Komponenten

### **Outputs in OUTPUT/ schreiben**
Jeder Agent schreibt seine Deliverables nach `OUTPUT/`:
```
OUTPUT/
├── prd-operations-dashboard.md
├── api-contracts.json
└── user-stories.md
```

### **INPUT.md lesen!**
Jeder Agent bekommt Context via `INPUT.md` - IMMER lesen!

---

## 🔄 FETCH STRATEGIE (Am Ende)

Wenn alle Agents fertig:

```bash
# Alle Outputs sammeln
cd /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard

# PRD
cat 01-pm/OUTPUT/*.md

# Brand Guidelines
cat 02-marketer/OUTPUT/*.md

# UX Design
cat 03-ux-designer/OUTPUT/*.md

# UI Design
cat 04-product-designer/OUTPUT/*.md

# Architecture
cat 05-architect/OUTPUT/*.md

# Database
cat 06-dba/OUTPUT/*.md

# Code
cat 07-frontend/OUTPUT/**/*.tsx
cat 08-backend/OUTPUT/**/*.ts

# Quality Reports
cat 09-code-reviewer/OUTPUT/*.md
cat 10-app-security/OUTPUT/*.md
cat 11-infra-security/OUTPUT/*.md

# Test Results
cat 12-qa/OUTPUT/*.md

# Deployment
cat 13-devops/OUTPUT/*.md
```

Oder automatisches Script (ich erstelle es gleich):
```bash
./fetch-all-outputs.sh
```

---

## 📊 INSTANZEN-BEDARF

**Maximal gleichzeitig**: 2 Instanzen
- Phase 1: PM + Marketer (2)
- Phase 2: UX + UI (2)
- Phase 4: Frontend + Backend (2)
- Phase 5: Security parallel (2)

**Empfehlung**:
- **2 Claude-Instanzen** = Schnellster Workflow
- **1 Claude-Instanz** = Sequenziell durch alle (langsamer, aber geht auch)

---

## ✅ VORTEILE

1. **Schneller**: 56% Zeitersparnis (8h → 3.5h)
2. **Unabhängig**: Du kannst andere Dinge machen
3. **Skalierbar**: Mehr Instanzen = noch schneller
4. **Qualität**: Gleich hoch (gleiche Prompts, gleiche Agents)
5. **Flexibel**: Du entscheidest wann du welche Gruppe startest

---

## 🎯 NÄCHSTER SCHRITT

**JETZT SOFORT**:

1. Ich erstelle alle 13 Agent-Ordner mit Prompts
2. Du öffnest 2 Claude-Instanzen
3. Startest **PM + Marketer parallel**
4. In 30 Min beide fertig
5. Dann weiter mit UX + UI

**Los geht's! Ordner werden jetzt erstellt...**

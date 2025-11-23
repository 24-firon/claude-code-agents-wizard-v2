# 🎯 MASTER INSTRUCTIONS - OPERATIONS DASHBOARD

**Du machst GAR NICHTS außer Copy-Paste! Ich sage dir genau was.**

---

## 📋 **PHASE 1: START SOFORT (30 Min)**

### Öffne 2 neue Claude-Instanzen

**Instanz A - PM:**
```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/01-pm/PROMPT.md
```
→ **KOMPLETTEN TEXT kopieren** → In Instanz A pasten → Enter

**Instanz B - Marketer:**
```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/02-marketer/PROMPT.md
```
→ **KOMPLETTEN TEXT kopieren** → In Instanz B pasten → Enter

### ⏰ WARTE 30 Minuten

Beide Agents arbeiten parallel.

### ✅ Check Outputs

```bash
ls agents/operations-dashboard/01-pm/OUTPUT/
ls agents/operations-dashboard/02-marketer/OUTPUT/
```

Du solltest sehen:
- `prd-operations-dashboard.md`
- `brand-guidelines-operations-dashboard.md`

### 📁 Kopiere Outputs für nächste Phase

```bash
# Kopiere PRD für UX/UI Designer
cp agents/operations-dashboard/01-pm/OUTPUT/prd-operations-dashboard.md \
   agents/operations-dashboard/03-ux-designer/CONTEXT/

cp agents/operations-dashboard/01-pm/OUTPUT/prd-operations-dashboard.md \
   agents/operations-dashboard/04-product-designer/CONTEXT/

# Kopiere Brand Guidelines für UX/UI Designer
cp agents/operations-dashboard/02-marketer/OUTPUT/brand-guidelines-operations-dashboard.md \
   agents/operations-dashboard/03-ux-designer/CONTEXT/

cp agents/operations-dashboard/02-marketer/OUTPUT/brand-guidelines-operations-dashboard.md \
   agents/operations-dashboard/04-product-designer/CONTEXT/
```

**➡️ DANN ZU PHASE 2**

---

## 📋 **PHASE 2: DESIGN (30 Min)**

### Öffne 2 neue Claude-Instanzen (oder nutze die gleichen)

**Instanz A - UX Designer:**
```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/03-ux-designer/PROMPT.md
```
→ **KOMPLETTEN TEXT kopieren** → Pasten → Enter

**Instanz B - Product Designer:**
```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/04-product-designer/PROMPT.md
```
→ **KOMPLETTEN TEXT kopieren** → Pasten → Enter

### ⏰ WARTE 30 Minuten

### ✅ Check Outputs

```bash
ls agents/operations-dashboard/03-ux-designer/OUTPUT/
ls agents/operations-dashboard/04-product-designer/OUTPUT/
```

Du solltest sehen:
- `ux-design-operations-dashboard.md`
- `ui-design-operations-dashboard.md`

### 📁 Kopiere Outputs für Architect

```bash
cp agents/operations-dashboard/01-pm/OUTPUT/prd-operations-dashboard.md \
   agents/operations-dashboard/05-architect/CONTEXT/

cp agents/operations-dashboard/03-ux-designer/OUTPUT/ux-design-operations-dashboard.md \
   agents/operations-dashboard/05-architect/CONTEXT/

cp agents/operations-dashboard/04-product-designer/OUTPUT/ui-design-operations-dashboard.md \
   agents/operations-dashboard/05-architect/CONTEXT/
```

**➡️ DANN ZU PHASE 3**

---

## 📋 **PHASE 3: ARCHITECTURE (45 Min)**

### Instanz A - Software Architect (30 Min)

```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/05-architect/PROMPT.md
```
→ Pasten → Enter → **WARTE bis fertig**

### ✅ Check Output

```bash
ls agents/operations-dashboard/05-architect/OUTPUT/
```

Du solltest sehen: `architecture-operations-dashboard.md`

### 📁 Kopiere für DBA

```bash
cp agents/operations-dashboard/05-architect/OUTPUT/architecture-operations-dashboard.md \
   agents/operations-dashboard/06-dba/CONTEXT/
```

### Instanz A - DBA (15 Min)

```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/06-dba/PROMPT.md
```
→ Pasten → Enter → **WARTE bis fertig**

### ✅ Check Output

```bash
ls agents/operations-dashboard/06-dba/OUTPUT/
```

Du solltest sehen:
- `schema-additions.prisma`
- `migration.sql`
- `seed-operations.ts`

### 📁 Kopiere für Frontend & Backend

```bash
# Für Frontend
cp agents/operations-dashboard/04-product-designer/OUTPUT/ui-design-operations-dashboard.md \
   agents/operations-dashboard/07-frontend/CONTEXT/

cp agents/operations-dashboard/05-architect/OUTPUT/architecture-operations-dashboard.md \
   agents/operations-dashboard/07-frontend/CONTEXT/

# Für Backend
cp agents/operations-dashboard/05-architect/OUTPUT/architecture-operations-dashboard.md \
   agents/operations-dashboard/08-backend/CONTEXT/

cp agents/operations-dashboard/06-dba/OUTPUT/schema-additions.prisma \
   agents/operations-dashboard/08-backend/CONTEXT/
```

**➡️ DANN ZU PHASE 4**

---

## 📋 **PHASE 4: IMPLEMENTATION (60 Min)**

### Öffne 2 neue Claude-Instanzen

**Instanz A - Frontend Developer:**
```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/07-frontend/PROMPT.md
```
→ Pasten → Enter

**Instanz B - Backend Engineer:**
```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/08-backend/PROMPT.md
```
→ Pasten → Enter

### ⏰ WARTE 60 Minuten (längste Phase)

### ✅ Check Outputs

```bash
ls agents/operations-dashboard/07-frontend/OUTPUT/
ls agents/operations-dashboard/08-backend/OUTPUT/
```

Du solltest viele `.tsx` und `.ts` Dateien sehen!

**➡️ DANN ZU PHASE 5**

---

## 📋 **PHASE 5: QUALITY (30 Min)**

### Instanz A - Code Reviewer (15 Min zuerst)

```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/09-code-reviewer/PROMPT.md
```
→ Pasten → Enter → **WARTE bis fertig**

### ✅ Check Output

```bash
ls agents/operations-dashboard/09-code-reviewer/OUTPUT/
```

### Dann PARALLEL: Security Audits

**Instanz A - App Security:**
```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/10-app-security/PROMPT.md
```
→ Pasten → Enter

**Instanz B - Infrastructure Security:**
```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/11-infra-security/PROMPT.md
```
→ Pasten → Enter

### ⏰ WARTE 15 Minuten

### ✅ Check Outputs

```bash
ls agents/operations-dashboard/10-app-security/OUTPUT/
ls agents/operations-dashboard/11-infra-security/OUTPUT/
```

**➡️ DANN ZU PHASE 6**

---

## 📋 **PHASE 6: QA TESTING (30 Min)**

### Instanz A - QA Engineer

```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/12-qa/PROMPT.md
```
→ Pasten → Enter

### ⏰ WARTE 30 Minuten

### ✅ Check Outputs

```bash
ls agents/operations-dashboard/12-qa/OUTPUT/
```

Du solltest sehen:
- `test-plan-operations-dashboard.md`
- `test-results-operations-dashboard.md`

**➡️ DANN ZU PHASE 7**

---

## 📋 **PHASE 7: DEPLOYMENT (20 Min)**

### Instanz A - DevOps Engineer

```bash
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/13-devops/PROMPT.md
```
→ Pasten → Enter

### ⏰ WARTE 20 Minuten

### ✅ Check Outputs

```bash
ls agents/operations-dashboard/13-devops/OUTPUT/
```

Du solltest sehen:
- `deployment-guide-operations-dashboard.md`
- `migration-operations.sql`

---

## 🎉 **FERTIG! ALLE OUTPUTS SAMMELN**

```bash
# Alle Dateien anzeigen
find agents/operations-dashboard -name "OUTPUT" -type d -exec ls -R {} \;
```

**Du hast jetzt**:
- ✅ PRD (Product Requirements)
- ✅ Brand Guidelines
- ✅ UX Design + Wireframes
- ✅ UI Design + Components
- ✅ System Architecture
- ✅ Database Schema + Migrations
- ✅ Frontend Code (alle .tsx Dateien)
- ✅ Backend Code (alle .ts Dateien)
- ✅ Code Review Report
- ✅ Security Audit Reports (2x)
- ✅ QA Test Results
- ✅ Deployment Guide

**ALLES FERTIG FÜR INTEGRATION!**

---

## 🚀 **ZEITPLAN NOCHMAL**

| Phase | Zeit | Was |
|-------|------|-----|
| 1 | 30 min | PM + Marketer |
| 2 | 30 min | UX + UI Design |
| 3 | 45 min | Architect → DBA |
| 4 | 60 min | Frontend + Backend |
| 5 | 30 min | Code Review + Security |
| 6 | 30 min | QA Testing |
| 7 | 20 min | DevOps |
| **TOTAL** | **3.5h** | **Komplett fertig!** |

---

## ❓ **PROBLEME?**

**Output-Ordner leer**: Agent arbeitet noch oder hat Fehler - check Claude-Instanz

**Context-Dateien fehlen**: Führe die `cp` Befehle nochmal aus

**Agent fragt nach Input**: Check ob vorherige Phase fertig ist

---

**LOS GEHT'S! START MIT PHASE 1!** 🚀

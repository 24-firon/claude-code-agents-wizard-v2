# 🤖 SUB-AGENT GUIDE - Universal Template

**Jeder Haupt-Agent darf EINEN Unter-Agenten haben!**

---

## ⚡ QUICK RULES

1. **Du darfst 1 Sub-Agent starten** via `Task` tool
2. **Sub-Agent erstellt seinen eigenen Ordner** in deinem OUTPUT/
3. **Sub-Agent arbeitet fokussiert** auf eine Teilaufgabe
4. **Sub-Agent gibt Ergebnis zurück** - du integrierst es

---

## 📋 WANN SUB-AGENT NUTZEN?

**NUTZE Sub-Agent wenn**:
- Aufgabe zu groß für dich allein (z.B. 10+ Komponenten bauen)
- Spezialisierte Aufgabe (z.B. Chart-Library-Integration)
- Parallele Teil-Tasks möglich

**NICHT NUTZEN wenn**:
- Task ist klein/einfach
- Du kannst es selbst schneller machen
- Kein klarer Fokus für Sub-Agent

---

## 🎯 SUB-AGENT TYPEN

### coder
**Nutze für**: Spezifische Code-Implementation
**Beispiel**: "Implementiere alle Chart-Komponenten für Dashboards"

### tester
**Nutze für**: Spezifische Test-Szenarien
**Beispiel**: "Teste alle Dashboard-Berechnungen (MRR, ARR, etc.)"

### researcher
**Nutze für**: Recherche/Dokumentation
**Beispiel**: "Recherchiere beste React-Chart-Library für unsere Needs"

---

## 📁 ORDNER-STRUKTUR MIT SUB-AGENT

```
agents/operations-dashboard/XX-your-agent/OUTPUT/
├── your-main-output.md
└── subagents/
    └── task-name/
        ├── PROMPT.md          # Was du dem Sub-Agent gabst
        ├── OUTPUT/            # Sub-Agent Ergebnisse
        └── README.md          # Sub-Agent Zusammenfassung
```

---

## 🚀 WIE SUB-AGENT STARTEN

### SCHRITT 1: Vorbereitung

```bash
# Erstelle Ordner für Sub-Agent
mkdir -p OUTPUT/subagents/chart-components/{PROMPT,OUTPUT}
```

### SCHRITT 2: Task Tool nutzen

```typescript
// In deinem Agent Code:
await Task({
  subagent_type: "coder",
  description: "Build dashboard chart components",
  prompt: `
Build 5 React chart components for Operations Dashboard:
1. LineChart (revenue trend)
2. BarChart (team capacity)
3. FunnelChart (sales pipeline)
4. PieChart (revenue by project)
5. GaugeChart (health score)

Tech Stack: React, TypeScript, Recharts
Brand: Gold #FFB800 + Black #0A0A0A

Output to: agents/operations-dashboard/XX-your-agent/OUTPUT/subagents/chart-components/OUTPUT/

Return: All 5 component files + usage examples
  `
});
```

### SCHRITT 3: Ergebnis integrieren

Sub-Agent schreibt in `OUTPUT/subagents/chart-components/OUTPUT/`

Du kopierst/integrierst seine Files in deine Haupt-Outputs.

---

## 📝 PROMPT-TEMPLATE FÜR SUB-AGENT

```markdown
# SUB-AGENT TASK: [Name]

**Parent Agent**: [Dein Name]
**Task Type**: [coder/tester/researcher]
**Output Location**: agents/operations-dashboard/XX-parent/OUTPUT/subagents/[task-name]/OUTPUT/

## Context
[Was bisher geschah - minimal context]

## Your Specific Task
[Exakte, fokussierte Aufgabe]

## Deliverables
1. [File 1]
2. [File 2]
3. [File 3]

## Constraints
- Tech Stack: [...]
- Style Guide: [...]
- Time Limit: [...]

## Output Format
Write all files to: [exact path]

**START NOW!**
```

---

## ✅ BEISPIELE

### Frontend Developer → coder (Chart Components)
```typescript
Task({
  subagent_type: "coder",
  description: "Build dashboard charts",
  prompt: "Build 5 Recharts components: Line, Bar, Funnel, Pie, Gauge..."
});
```

### Backend Engineer → coder (Calculation Logic)
```typescript
Task({
  subagent_type: "coder",
  description: "Implement MRR/ARR calculations",
  prompt: "Build calculation services for: MRR, ARR, Pipeline Value, Team Utilization..."
});
```

### QA Engineer → tester (Dashboard Testing)
```typescript
Task({
  subagent_type: "tester",
  description: "Test all dashboard calculations",
  prompt: "Write test cases for all financial calculations (MRR, ARR, etc.)..."
});
```

---

## ⚠️ WICHTIG

1. **Nur 1 Sub-Agent**: Nicht mehrere parallel (du bist nicht Orchestrator)
2. **Klare Aufgabe**: Sub-Agent braucht fokussierten Auftrag
3. **Eigener Ordner**: Sub-Agent schreibt in `OUTPUT/subagents/[name]/`
4. **Integration**: DU integrierst Sub-Agent Output in dein Haupt-Output

---

## 🎯 WANN SUB-AGENT ABLEHNEN

**NICHT nutzen wenn**:
- "Ich brauche Hilfe zu entscheiden..." → NEIN (du entscheidest)
- "Kannst du mal recherchieren..." → NEIN (du recherchierst in Context Files)
- "Schreib mir ein paar Ideen..." → NEIN (du schreibst Ideen)

**NUR nutzen wenn**:
- "Implementiere diese 10 klar definierten Komponenten" → JA
- "Teste diese 15 spezifischen Szenarien" → JA
- "Recherchiere diese Library-Optionen mit Kriterien X,Y,Z" → JA

---

**Du bist bereit! Falls du Sub-Agent brauchst, weißt du jetzt wie!** 🚀

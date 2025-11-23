# 🚀 OPERATIONS DASHBOARD - PARALLEL BUILD START HERE!

**Status**: Ready to launch parallel agents
**Goal**: Build complete Operations Dashboard in 3.5 hours (instead of 8+)
**Method**: Run multiple Claude instances in parallel

---

## ⚡ QUICK START (Do This NOW!)

### STEP 1: Open 2 Claude Instances

1. **Instance A**: New Claude tab/window
2. **Instance B**: New Claude tab/window

### STEP 2: Start PM (Instance A)

```bash
# Copy this file content and paste into Instance A
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/01-pm/PROMPT.md
```

Paste entire PROMPT.md into Instance A → Claude starts working!

### STEP 3: Start Marketer (Instance B) - PARALLEL!

```bash
# Copy this file content and paste into Instance B
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/02-marketer/PROMPT.md
```

Paste entire PROMPT.md into Instance B → Claude starts working!

**⏱️ Wait 30 minutes**: Both agents work in parallel

### STEP 4: Check Outputs

```bash
# PM output
ls /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/01-pm/OUTPUT/

# Marketer output
ls /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/02-marketer/OUTPUT/
```

You should see:
- `prd-operations-dashboard.md` (from PM)
- `brand-guidelines-operations-dashboard.md` (from Marketer)

---

## 📋 COMPLETE WORKFLOW

### PHASE 1: Strategy (NOW - 30 min)
✅ **CPO**: DONE (product-vision-operations-dashboard.md already exists)
🔄 **PM + Marketer**: PARALLEL (what you're doing now)

**When done**: Both output files appear in OUTPUT/ folders

---

### PHASE 2: Design (Next - 30 min)
**Wait until**: PM finishes (Marketer can still be running)

**Then start**:
- Instance A: UX Designer (`03-ux-designer/PROMPT.md`)
- Instance B: Product Designer (`04-product-designer/PROMPT.md`)

**Parallel**: Both work at same time

---

### PHASE 3: Architecture (Next - 45 min)
**Wait until**: UX + UI Designer finish

**Then start sequentially**:
1. Instance A: Software Architect (`05-architect/PROMPT.md`) - 30 min
2. Instance A: DBA (`06-dba/PROMPT.md`) - 15 min

**Sequential**: DBA needs Architect output

---

### PHASE 4: Implementation (Next - 60 min)
**Wait until**: Architecture + DBA finish

**Then start**:
- Instance A: Frontend Developer (`07-frontend/PROMPT.md`)
- Instance B: Backend Engineer (`08-backend/PROMPT.md`)

**Parallel**: Both work at same time

---

### PHASE 5: Quality (Next - 30 min)
**Wait until**: Frontend + Backend finish

**Then**:
1. Instance A: Code Reviewer (`09-code-reviewer/PROMPT.md`) - 15 min
2. After Code Review:
   - Instance A: App Security (`10-app-security/PROMPT.md`)
   - Instance B: Infra Security (`11-infra-security/PROMPT.md`)

**Parallel**: Security audits run together

---

### PHASE 6: Testing (Next - 30 min)
**Wait until**: Security audits finish

**Then start**:
- Instance A: QA Engineer (`12-qa/PROMPT.md`)

**Sequential**: Needs everything before it

---

### PHASE 7: Deployment (Final - 20 min)
**Wait until**: QA finishes

**Then start**:
- Instance A: DevOps Engineer (`13-devops/PROMPT.md`)

**Sequential**: Final step

---

## 📊 TIMELINE OVERVIEW

```
PHASE 1 (Strategy)        | ████████░░░░ | PM + Marketer    | 30 min
PHASE 2 (Design)          | ████████░░░░ | UX + UI          | 30 min
PHASE 3 (Architecture)    | ████░░░░░░░░ | Arch → DBA       | 45 min
PHASE 4 (Implementation)  | ████████████ | Front + Back     | 60 min
PHASE 5 (Quality)         | ████████░░░░ | Code + Security  | 30 min
PHASE 6 (Testing)         | ████████░░░░ | QA               | 30 min
PHASE 7 (Deployment)      | ████░░░░░░░░ | DevOps           | 20 min

TOTAL: 3.5 hours (parallel) vs. 8+ hours (sequential)
SPEEDUP: 56% faster!
```

---

## ✅ HOW TO KNOW WHEN AGENT IS DONE

Agent will say something like:
- "PRD complete and saved to OUTPUT/"
- "Brand guidelines created in OUTPUT/"
- "All files written successfully"

Then check the OUTPUT/ folder for files!

---

## 🔍 TROUBLESHOOTING

**Problem**: "Context file not found"
**Solution**: Copy context files manually:
```bash
cp /home/user/claude-code-agents-wizard-v2/product-vision-operations-dashboard.md \
   /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/XX-agent/CONTEXT/
```

**Problem**: "Agent asks questions"
**Solution**: Check INPUT.md for required dependencies - make sure previous agents finished

**Problem**: "Output folder empty"
**Solution**: Agent might still be working or encountered error - check Claude instance

---

## 📁 FOLDER STRUCTURE

```
agents/operations-dashboard/
├── 01-pm/
│   ├── PROMPT.md          ← Copy this to Claude
│   ├── INPUT.md           ← Dependencies info
│   ├── CONTEXT/           ← Context files
│   └── OUTPUT/            ← Agent writes here
├── 02-marketer/
│   ├── PROMPT.md
│   ├── INPUT.md
│   ├── CONTEXT/
│   └── OUTPUT/
├── 03-ux-designer/
├── 04-product-designer/
├── 05-architect/
├── 06-dba/
├── 07-frontend/
├── 08-backend/
├── 09-code-reviewer/
├── 10-app-security/
├── 11-infra-security/
├── 12-qa/
└── 13-devops/
```

---

## 🎯 NEXT STEPS

**Right now**:
1. ✅ Open 2 Claude instances
2. ✅ Paste PM prompt in Instance A
3. ✅ Paste Marketer prompt in Instance B
4. ⏱️ Wait 30 minutes

**After 30 minutes**:
5. ✅ Check OUTPUT/ folders for files
6. ✅ Read this file again for PHASE 2 instructions
7. ✅ Continue with UX + UI Designer

**Keep going until all 7 phases complete!**

---

## 📞 NEED HELP?

**Read these**:
- `/home/user/claude-code-agents-wizard-v2/PARALLEL-AGENT-WORKFLOW.md` - Full rules
- Each agent's `INPUT.md` - What they need
- Each agent's `PROMPT.md` - What they do

---

**🚀 START NOW! Open 2 Claude instances and begin PHASE 1!**

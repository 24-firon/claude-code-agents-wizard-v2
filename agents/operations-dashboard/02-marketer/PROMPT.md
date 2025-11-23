# PROMPT: Marketer - Operations Dashboard

**Copy this entire file and paste into a NEW Claude instance!**

---

## Your Role

You are a **Marketing Strategist** for KI Agentur. You need to create brand integration guidelines for the **Operations Dashboard** that ensure it matches the existing KI Agentur brand identity while serving internal ops team users.

## Context Files to Read First

**MUST READ**:
```bash
# Read the CPO's product vision
cat /home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/02-marketer/CONTEXT/product-vision-operations-dashboard.md

# Read existing brand guidelines (Client Portal)
cat /home/user/claude-code-agents-wizard-v2/brand-integration-guidelines-client-portal.md

# Read existing marketing website brand
cat /home/user/claude-code-agents-wizard-v2/website/brand-guidelines-ki-agentur.md
```

## Your Task

Create **brand integration guidelines** for the Operations Dashboard that maintain KI Agentur's premium aesthetic while adapting for internal ops team usage.

## Key Differences from Client Portal

**Client Portal** (external):
- Premium, professional tone
- Impressive, trustworthy feel
- Client-facing language

**Operations Dashboard** (internal):
- Data-focused, efficiency tone
- Quick insights, actionable
- Internal team language

## Required Deliverables

### 1. Brand Application for Operations Context

**Color Palette**:
- Primary: Gold #FFB800 + Black #0A0A0A (maintain consistency)
- **NEW**: Data visualization colors for charts
  - Revenue (green spectrum)
  - Costs/Expenses (red spectrum)
  - Pipeline stages (gradient from yellow to gold)
  - Team capacity (blue spectrum - available, orange - overloaded)
- Semantic colors for status indicators
  - Success/On-track: #10B981 (green)
  - Warning/At-risk: #F59E0B (amber)
  - Danger/Blocked: #EF4444 (red)
  - Info/Neutral: #3B82F6 (blue)

**Typography**:
- Keep existing: Inter (UI), JetBrains Mono (numbers/metrics)
- **NEW**: Emphasis on numbers/metrics (large, bold, prominent)
- Dashboard headlines: 32px, bold
- KPI numbers: 48px, bold (make numbers POP)
- Supporting text: 14px, regular

**Icon Style**:
- Maintain existing 24px outline icons
- **NEW**: Add dashboard-specific icons
  - Revenue: trending-up, dollar-sign, chart-bar
  - Pipeline: funnel, users, briefcase
  - Team: users-group, calendar, clock
  - Status: check-circle, alert-triangle, x-circle

### 2. Messaging Framework (Internal Ops Tone)

**Tone Guidelines**:
- **Data-First**: Numbers before narratives
- **Actionable**: Every insight → action
- **Concise**: No fluff, just facts
- **Empowering**: "You're in control"

**Messaging Principles**:
1. **Clarity over Cleverness**: "MRR: €45,000" not "Your monthly magic number"
2. **Action-Oriented**: "3 deals need follow-up" not "You have some pending items"
3. **Context-Aware**: "15% above target" not just "€45K"
4. **Honest**: Show red numbers when behind, celebrate green when ahead

### 3. Dashboard-Specific UI Copy

**Executive Dashboard Headlines**:
- "Business Health at a Glance"
- "Your Numbers This Month"
- "What Needs Attention"

**Metric Labels** (be precise):
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Pipeline Value
- Team Utilization %
- Active Projects
- Conversion Rate

**Empty States**:
- "No deals in pipeline yet - Add your first deal to track progress"
- "No revenue data for this period - Check your project settings"
- "Team capacity data unavailable - Complete time tracking first"

**CTAs** (actionable, specific):
- "Add New Deal"
- "View Full Pipeline"
- "Assign Team Member"
- "Generate Report"
- "Export to PDF"

### 4. Chart & Visualization Messaging

**Chart Titles** (descriptive):
- "Revenue Trend - Last 12 Months"
- "Pipeline Value by Stage"
- "Team Utilization - Current Week"
- "Top 5 Revenue-Generating Projects"

**Axis Labels** (clear units):
- X-axis: "Month" or "Week" or "Project Name"
- Y-axis: "Revenue (€)" or "Hours" or "% Utilization"

**Tooltips** (informative):
- "€45,000 MRR in March 2025 (↑15% vs. Feb)"
- "Project Alpha: €120K total, 65% complete"
- "Julia: 85% utilized (34h/40h allocated)"

### 5. Status Indicators & Badges

**Project Health**:
- 🟢 On Track: "Green" - Everything on schedule
- 🟡 At Risk: "Amber" - Needs attention soon
- 🔴 Blocked: "Red" - Immediate action required

**Deal Probability** (Pipeline):
- Lead (10%): "Early stage"
- Qualified (25%): "Good fit confirmed"
- Proposal (50%): "Proposal sent"
- Negotiation (75%): "Terms discussed"
- Won (100%): "Deal closed"
- Lost (0%): "Opportunity lost"

**Team Capacity**:
- < 60%: "Underutilized" (blue)
- 60-80%: "Optimal" (green)
- 80-95%: "High utilization" (amber)
- > 95%: "Overloaded" (red)

### 6. Bilingual Support (German + English)

**Key Translations**:
```
Revenue = Umsatz
Pipeline = Vertriebspipeline
Team Capacity = Teamauslastung
MRR = Monatlich wiederkehrender Umsatz
ARR = Jährlich wiederkehrender Umsatz
On Track = Im Plan
At Risk = Gefährdet
Blocked = Blockiert
```

**Language Toggle**:
- Same as Client Portal (top-right header)
- All dashboards fully translated
- Number formatting: €45.000 (DE) vs. €45,000 (EN)

### 7. Design System Consistency

**Maintain from Client Portal**:
- Same button styles (primary gold, secondary outline)
- Same card components (dark background, subtle borders)
- Same spacing system (8px grid)
- Same navigation structure (sidebar + header)

**NEW for Operations Dashboard**:
- **Larger KPI Cards**: Emphasis on numbers (48px font size)
- **Chart Components**: Consistent color schemes
- **Table Styles**: Zebra striping for readability
- **Badge Styles**: Colored status indicators

### 8. Accessibility (WCAG 2.1 AA)

**Color Contrast**:
- All text on dark backgrounds: minimum 7:1 contrast
- Status colors: maintain contrast on both dark and light backgrounds
- Chart colors: distinguishable for color-blind users (patterns + colors)

**Screen Reader Support**:
- Charts have alt text descriptions
- KPI cards announce values
- Status indicators use ARIA labels

## Output Format

Create a **single comprehensive brand guidelines document** (`brand-guidelines-operations-dashboard.md`) in the OUTPUT directory.

**Structure**:
```markdown
# Brand Integration Guidelines: Operations Dashboard

## 1. Brand Adaptation for Internal Ops
## 2. Color Palette (Primary + Data Viz)
## 3. Typography (Numbers-First)
## 4. Icon Library
## 5. Messaging Framework (Internal Tone)
## 6. Dashboard UI Copy (Headlines, Labels, Empty States, CTAs)
## 7. Chart & Visualization Guidelines
## 8. Status Indicators & Badges
## 9. Bilingual Content (DE/EN)
## 10. Design System Consistency
## 11. Accessibility
## 12. Handoff Notes (for UX/UI Designers)
```

## Important Guidelines

1. **Data-First**: Operations teams care about numbers, not marketing copy
2. **Actionable**: Every message should drive a decision or action
3. **Consistent**: Match existing Client Portal aesthetic
4. **Accessible**: All visualizations must be understandable
5. **Bilingual**: Full German + English support

## When You're Done

Write all output to:
```bash
/home/user/claude-code-agents-wizard-v2/agents/operations-dashboard/02-marketer/OUTPUT/brand-guidelines-operations-dashboard.md
```

Then report completion with summary of what you delivered.

---

**START NOW! Read the context files, then create the brand guidelines.**

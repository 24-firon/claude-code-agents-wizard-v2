# KI Agentur Lead Scoring Criteria Documentation

## Overview

The Lead Qualification Automation system uses a **points-based scoring algorithm** to automatically qualify, route, and nurture leads from the KI Agentur marketing website. Leads are scored on a scale of **0-165 points** across four dimensions.

## Scoring Dimensions

### 1. Company Size (0-40 points)
Indicates the scale of the prospect's organization and their likely budget capacity.

| Company Size | Points | Rationale |
|--------------|--------|-----------|
| **1-10 employees** | 10 | Startup/micro business; limited budget |
| **11-50 employees** | 20 | Small business; growing automation needs |
| **51-200 employees** | 30 | Mid-market; significant automation opportunity |
| **200+ employees** | 40 | Enterprise; highest automation ROI potential |
| **Unknown** | 15 | Default estimate for unspecified |

**How it's detected:**
- Keywords in message: "startup", "small", "growing", "mid-size", "enterprise"
- Explicit mentions: "1-10 employees", "11-50", "51-200", "200+"
- Default to "unknown" if no company size indicators

---

### 2. Budget Range (0-70 points)
The most critical factor. KI Agentur targets €50K+ projects, so budget heavily influences lead quality.

| Budget Range | Points | Fit for KI Agentur | Notes |
|--------------|--------|-------------------|-------|
| **< €50,000** | 10 | Poor fit | Small projects, unsuitable budget |
| **€50-100,000** | 30 | Good fit | Minimum viable project scope |
| **€100-250,000** | 50 | Excellent fit | Ideal project size |
| **€250,000+** | 70 | Premium fit | High-value enterprise projects |
| **Unknown/Not specified** | 5 | Poor fit | Must follow up for budget clarity |

**How it's detected:**
- Contact form enum selection: `<50k`, `50-100k`, `100-250k`, `250k+`
- Explicit mentions: "€50K", "100K budget", "250K+ project"
- If empty/unknown: default score = 5 (requires budget discovery)

---

### 3. Project Urgency (0-30 points)
Timeline urgency indicates buying cycle stage and motivation level.

| Urgency Level | Timeline | Points | Sales Priority | Notes |
|---------------|----------|--------|-----------------|-------|
| **ASAP** | Immediate | 30 | Critical | Hot opportunity - must call today |
| **1-3 months** | Near-term | 20 | High | Active project planning |
| **3-6 months** | Medium-term | 10 | Medium | In planning phase |
| **Exploring** | Undefined | 5 | Low | Early-stage research only |
| **Unknown** | TBD | 5 | Low | Requires follow-up |

**How it's detected:**
- Keywords: "ASAP", "urgent", "immediately", "next month", "this quarter"
- Phrases: "1-3 months", "3-6 months", "exploring", "researching"
- Default: "exploring" (least urgent)

---

### 4. AI/Automation Maturity (0-25 points)
Current automation experience and AI readiness affects implementation complexity and fit.

| Maturity Level | Points | Profile | Typical Timeline |
|----------------|--------|---------|------------------|
| **None** | 5 | No prior AI/automation experience; starting from scratch | 4-6 months |
| **Some** | 15 | Some chatbots or basic automation; familiar with concepts | 2-4 months |
| **Advanced** | 25 | GPT integration, ML models, mature automation stack | 1-2 months |

**How it's detected:**
- Keywords: "AI", "machine learning", "chatbot", "GPT", "automation", "API integration"
- Phrases: "advanced automation", "AI-ready", "already using AI tools"
- Default: "none" (no experience mentioned)

---

## Qualification Tiers

Leads are automatically assigned to tiers based on total score:

### Hot Lead (90-165 points)
**Characteristics:**
- Score: 90+
- Typical: Mid-market/enterprise + €100K+ budget + ASAP timeline + Some AI experience
- Sales Action: **Immediate calendar booking**
- Response: Call within 4 business hours
- Route: Sales team → Calendly booking link

**Score breakdown example:**
- Company size (51-200): 30 pts
- Budget (€100-250K): 50 pts
- Urgency (ASAP): 30 pts
- AI maturity (Some): 15 pts
- **Total: 125 points** ✓ Hot

### Warm Lead (60-89 points)
**Characteristics:**
- Score: 60-89
- Typical: Small-to-mid market + €50-100K budget + 1-3 month timeline + Exploring
- Sales Action: **Email nurture sequence + follow-up call in 3-5 days**
- Response: Personalized case study email
- Route: Marketing nurture → Sales follow-up

**Score breakdown example:**
- Company size (11-50): 20 pts
- Budget (€50-100K): 30 pts
- Urgency (1-3 months): 20 pts
- AI maturity (None): 5 pts
- **Total: 75 points** ✓ Warm

### Cold Lead (0-59 points)
**Characteristics:**
- Score: 0-59
- Typical: Startup + <€50K budget + Exploring + No AI experience
- Sales Action: **Newsletter subscription + monthly nurture**
- Response: Newsletter signup + educational content
- Route: Newsletter list → Long-term nurture

**Score breakdown example:**
- Company size (1-10): 10 pts
- Budget (<€50K): 10 pts
- Urgency (Exploring): 5 pts
- AI maturity (None): 5 pts
- **Total: 30 points** ✓ Cold

---

## Implementation Details

### Data Extraction
The system automatically extracts parameters from:

1. **Contact Form Fields:**
   - Name
   - Email
   - Company
   - Message (parsed for urgency, company size, AI maturity)
   - Budget (direct selection)

2. **Message Parsing:**
   - Uses keyword detection to identify company size, urgency, AI maturity
   - Case-insensitive pattern matching
   - Defaults to "unknown" if no matches

### Scoring Logic Flow

```
Lead Submission
    ↓
Parse Lead Data
    ├─ Extract: name, email, company, message, budget
    ├─ Detect: companySize, urgency, aiMaturity
    ↓
Lead Scoring Engine
    ├─ Company Size Score: 10-40 pts
    ├─ Budget Score: 5-70 pts
    ├─ Urgency Score: 5-30 pts
    ├─ AI Maturity Score: 5-25 pts
    ├─ TOTAL SCORE: 0-165 pts
    ↓
Determine Qualification Tier
    ├─ 90-165: HOT LEAD
    ├─ 60-89: WARM LEAD
    └─ 0-59: COLD LEAD
    ↓
Route & Respond
    ├─ Hot: Slack alert + Calendly email + Airtable save
    ├─ Warm: Case study email + Airtable save
    └─ Cold: Newsletter email + Airtable save
```

---

## Scoring Adjustment Guide

### When to Adjust Weights
Monitor these metrics monthly:
- **Sales conversion rate by tier:** Hot leads should convert >30%, Warm >10%
- **Average deal size by tier:** Should increase Hot > Warm > Cold
- **Sales cycle length by tier:** Should decrease Hot < Warm < Cold

### Seasonal Adjustments
For KI Agentur's enterprise focus:
- **Q4 (Budget Planning):** Increase urgency weight +10% (higher deal closure)
- **Q1 (Implementation):** Increase company size weight +5% (larger budgets approved)
- **Summer:** Decrease all weights -5% (lower buying activity)

---

## Example Scoring Scenarios

### Scenario 1: Ideal Hot Lead
**Input:**
```
Name: Maria Schmidt
Company: TechCore GmbH
Company Size: 150 employees
Budget: €150,000
Urgency: "We need to start this month"
Message: "We're a mid-size manufacturing company with 150 people.
We want to automate our customer service with AI chatbots.
We have some experience with automation tools already.
Budget is €150K and we need to start this month."
```

**Scoring:**
- Company Size (51-200 empl): 30 pts
- Budget (€100-250K): 50 pts
- Urgency (ASAP/1-3 months): 30 pts
- AI Maturity (Some): 15 pts
- **Total: 125 points → HOT LEAD**
- Action: Calendar booking + Slack alert

---

### Scenario 2: Warm Lead with Development Potential
**Input:**
```
Name: Klaus Weber
Company: FinanceFlow AG
Budget: €80,000
Urgency: "Looking at Q1 implementation"
Message: "We're growing and interested in AI automation for our
reporting processes. We have 45 people. Budget is around €80K.
Not urgent but want to start in Q1 next year."
```

**Scoring:**
- Company Size (11-50 empl): 20 pts
- Budget (€50-100K): 30 pts
- Urgency (3-6 months): 10 pts
- AI Maturity (None): 5 pts
- **Total: 65 points → WARM LEAD**
- Action: Case study email + Nurture sequence

---

### Scenario 3: Cold Lead for Future Nurture
**Input:**
```
Name: Jana Müller
Company: LocalShop Solutions
Budget: Not specified
Urgency: "Just exploring for now"
Message: "Hi, we're a small e-commerce company with 8 people.
Just exploring what AI automation could do for us.
Nothing urgent right now."
```

**Scoring:**
- Company Size (1-10 empl): 10 pts
- Budget (Unknown): 5 pts
- Urgency (Exploring): 5 pts
- AI Maturity (None): 5 pts
- **Total: 25 points → COLD LEAD**
- Action: Newsletter subscription + Monthly content

---

## CRM Integration

All leads are saved to Airtable with fields:

| Field | Type | Notes |
|-------|------|-------|
| Name | Text | Contact name |
| Email | Email | Primary contact email |
| Company | Text | Company name |
| Message | Text | Original inquiry (first 500 chars) |
| Budget | Select | Budget range selected |
| Company Size | Select | Detected size |
| Urgency | Select | Detected urgency |
| AI Maturity | Select | Detected maturity |
| Lead Score | Number | Total score (0-165) |
| Qualification | Select | hot/warm/cold |
| Tier | Text | Tier name with action |
| Priority | Select | Urgent/Medium/Low |
| Submission Date | Date | When lead was submitted |
| Created | Auto | Airtable creation timestamp |
| Last Modified | Auto | Last update timestamp |

---

## Monitoring & Optimization

### Key Metrics to Track
1. **Lead Distribution:** % Hot vs Warm vs Cold (target: 5-10% hot)
2. **Conversion Rate:** % closing by tier
3. **Average Deal Value:** $ closed by tier
4. **Sales Cycle:** Days from submission to close
5. **Email Open Rates:** By tier/template

### Monthly Review
- Review lead scoring accuracy
- Compare predicted tier vs actual deal size
- Adjust scoring weights if conversion rates are off
- Update detection keywords based on won deals

### Annual Audit
- Full scoring model review
- Tier boundary adjustments based on actual data
- Detection algorithm improvements
- New competitor analysis

---

## Technical Notes

### n8n Nodes Used
1. **Webhook Trigger:** Receives POST from contact form
2. **JavaScript (Parse):** Extracts company size, urgency, maturity
3. **JavaScript (Score):** Calculates points and tier
4. **Conditional:** Routes hot/warm/cold leads
5. **HTTP (Airtable):** Saves lead record
6. **HTTP (Email Service):** Sends tier-specific responses
7. **Slack:** Notifies team of hot leads

### Environment Variables Needed
```env
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TOKEN=keyXXXXXXXXXXXXXX
SLACK_CHANNEL_ID=C1234567890
SLACK_TEAM_CHANNEL_ID=C0987654321
EMAIL_SERVICE_API=https://api.resend.com/emails
EMAIL_API_KEY=re_XXXXXXXXXXXX
N8N_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/ki-agentur-leads
```

---

## Frequently Asked Questions

**Q: What if a lead doesn't specify budget?**
A: Default score = 5 points. Flag in Airtable for sales follow-up to discover budget.

**Q: How often does the scoring model update?**
A: Monthly review of conversion data. Major adjustments quarterly based on performance.

**Q: Can sales manually override the tier?**
A: Yes. Airtable allows manual override in the "Qualification" field for manual adjustments.

**Q: What's the minimum score to be a viable lead?**
A: Any lead with correct email is viable. Cold leads (0-59) go to nurture, not discard.

**Q: How do we handle "unknown" responses?**
A: Sales team follows up with discovery call: "Thanks for reaching out! Quick questions: 1) How many people are on your team? 2) What's your budget range? 3) When do you want to start?"

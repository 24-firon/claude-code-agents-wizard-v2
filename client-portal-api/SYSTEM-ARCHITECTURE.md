# Lead Qualification Automation - System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KI AGENTUR MARKETING WEBSITE                         │
│                        (Next.js 14 - Website Directory)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Contact Form Component                                                       │
│  ├─ Name                                                                      │
│  ├─ Email                                                                     │
│  ├─ Company                                                                   │
│  ├─ Message                                                                   │
│  └─ Budget (enum select)                                                      │
│       │                                                                       │
│       └─ POST /api/contact (route.ts - UPDATED)                             │
│            ├─ Validation (Zod schema)                                        │
│            ├─ Security (rate limit, sanitize)                                │
│            ├─ Send confirmation email                                        │
│            ├─ Send admin notification                                        │
│            │                                                                 │
│            └─ Webhook POST to n8n ═════════════════════════════════════┐     │
│                 (Fire and forget)                                       │     │
└──────────────────────────────────────────────────────────────────────┼──────┘
                                                                       │
                                                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                N8N WORKFLOW                                  │
│                  (Lead Qualification Automation Engine)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. WEBHOOK TRIGGER                                                         │
│     Receives: {name, email, company, message, budget}                       │
│     │                                                                        │
│     ▼                                                                        │
│  2. PARSE LEAD DATA (JavaScript Node)                                       │
│     Extracts:                                                               │
│     ├─ Company Size (from message keywords)                                 │
│     ├─ Project Urgency (ASAP, 1-3mo, 3-6mo, exploring)                    │
│     └─ AI Maturity (none, some, advanced)                                   │
│     │                                                                        │
│     ▼                                                                        │
│  3. LEAD SCORING ENGINE (JavaScript Node) ⭐ CORE LOGIC                     │
│     Calculates Score (0-165 points):                                        │
│     ├─ Company Size: 0-40 pts (1-10, 11-50, 51-200, 200+)                 │
│     ├─ Budget: 0-70 pts (<50k, 50-100k, 100-250k, 250k+)                 │
│     ├─ Urgency: 0-30 pts (ASAP, 1-3mo, 3-6mo, exploring)                 │
│     ├─ AI Maturity: 0-25 pts (none, some, advanced)                        │
│     └─ Determines Tier: HOT (90+), WARM (60-89), COLD (0-59)              │
│     │                                                                        │
│     ├───────────────────────────┬──────────────────────────┬────────────┐  │
│     │                           │                          │            │  │
│     ▼                           ▼                          ▼            ▼  │
│  4a. CONDITIONAL: IS HOT?    4b. CONDITIONAL: IS WARM?  4c. ELSE (COLD)  │
│     │                           │                          │            │  │
│     ├─────────────────┐         │                          │            │  │
│     │                 │         │                          │            │  │
│     ▼                 ▼         ▼                          ▼            │  │
│  Slack Alert      Email Hot   Email Warm              Email Cold       │  │
│  (Hot Lead!)      (20-min     (Case Study)            (Newsletter)      │  │
│                   Booking)                                              │  │
│                                                                         │  │
│     └─────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  PARALLEL: ALL LEADS                                                      │
│     ├─ Save to Airtable (complete record with score, tier, fields)      │
│     └─ Slack Team Notification (all new leads)                          │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
     │                    │                    │                  │
     │                    │                    │                  │
     ▼                    ▼                    ▼                  ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  AIRTABLE    │ │    SLACK     │ │    EMAIL     │ │  EMAIL LOGS  │
│              │ │              │ │              │ │              │
│ Leads Table: │ │ #sales-alerts│ │ Hot Lead:    │ │ Delivery     │
│ ├─ Name      │ │ (Hot)        │ │ Calendly     │ │ Status       │
│ ├─ Email     │ │              │ │              │ │              │
│ ├─ Company   │ │ #team-update │ │ Warm Lead:   │ │ Opens/Clicks │
│ ├─ Message   │ │ (All)        │ │ Case Study   │ │              │
│ ├─ Budget    │ │              │ │              │ │ Bounce Rate  │
│ ├─ Score     │ │              │ │ Cold Lead:   │ │              │
│ ├─ Tier      │ │              │ │ Newsletter   │ │              │
│ ├─ Priority  │ │              │ │              │ │              │
│ └─ Status    │ │              │ │              │ │              │
│              │ │              │ │              │ │              │
│ Updated by:  │ │ Real-time    │ │ Automated    │ │ Provider     │
│ Sales Team   │ │ Alerts       │ │ Responses    │ │ Analytics    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

---

## Data Flow Diagram

```
INCOMING LEAD
     │
     ▼
Contact Form Submission
├─ name: "Maria Schmidt"
├─ email: "maria@techcore.de"
├─ company: "TechCore GmbH"
├─ message: "We have 150 people, need AI automation ASAP. €150K budget..."
└─ budget: "100-250k"

     │
     ▼ (n8n Webhook)

Parse Lead Data
├─ company_size: "51-200" (detected from "150 people")
├─ urgency: "asap" (detected from "ASAP")
└─ ai_maturity: "some" (detected from message keywords)

     │
     ▼

Lead Scoring Engine
├─ company_size (51-200): +30 pts
├─ budget (100-250k): +50 pts
├─ urgency (asap): +30 pts
└─ ai_maturity (some): +15 pts
  ━━━━━━━━━━━━━━━━━━━━━
  Total Score: 125 pts → HOT LEAD ✓

     │
     ├──────────────────┬──────────────────┬──────────────────┐
     │                  │                  │                  │
     ▼                  ▼                  ▼                  ▼
  SAVE TO          SEND HOT          SLACK ALERT          SLACK TEAM
  AIRTABLE         EMAIL             (Sales Channel)      NOTIFICATION
     │                │                  │                  │
  Record:             │                  │                  │
  ├─ Lead_ID        Subject:             │                  │
  ├─ Name            "Schedule Your    Message:             │
  ├─ Email           Free..."          "🔥 HOT LEAD"        │
  ├─ Company                           ├─ Name              │
  ├─ Budget          Body:             ├─ Email    ✓        │
  ├─ Score: 125      "Hi Maria,        ├─ Company           │
  ├─ Tier: Hot       Calendly link"    ├─ Score             │
  ├─ Priority: High                    └─ Tier              │
  └─ Status: New                                            │
                                                            │
     │              │                  │                  │
     └──────────┬───┴──────────────────┴──────────────────┘
                │
                ▼
        SALES TEAM WORKFLOW
        1. Gets Slack alert (instant)
        2. Sees hot lead in Airtable (instant)
        3. Receives calendar email
        4. Calls/emails prospect within 4 hours
        5. Updates Airtable status: "In Progress"
```

---

## System Components

### 1. Website Contact Form (Input Layer)
**Technology**: Next.js 14, TypeScript
**File**: `/website/src/app/api/contact/route.ts`
**Responsibilities**:
- Receive and validate form submissions
- Rate limiting (5 requests/15 min)
- Input sanitization and security checks
- Send confirmation email to user
- Send admin notification
- **Send webhook POST to n8n** (NEW)

**Data Format**:
```json
{
  "name": "string (2-100 chars)",
  "email": "string (valid email)",
  "company": "string (2-100 chars)",
  "message": "string (10-5000 chars)",
  "budget": "enum: <50k | 50-100k | 100-250k | 250k+ | undefined"
}
```

### 2. n8n Workflow (Processing Engine)
**Technology**: n8n cloud/self-hosted
**File**: `n8n-lead-qualification-workflow.json`
**Nodes**: 11 total
**Processing Flow**:

#### a. Input Node
- **Webhook Trigger**: Receives POST from website
- **Triggers**: On form submission
- **Rate**: N/A (handled by website)

#### b. Data Processing Nodes
- **Parse Lead Data**: Extract company size, urgency, AI maturity from message
- **Lead Scoring Engine**: Calculate score (0-165), determine tier

#### c. Routing Nodes
- **Conditional: Is Hot?**: Score >= 90
- **Conditional: Is Warm?**: Score >= 60 and < 90
- **Else**: Cold lead (score < 60)

#### d. Output Nodes
- **Save to Airtable**: Store complete lead record
- **Slack Alerts**: Notify sales team (hot only) or all team
- **Email Service**: Send tier-specific response

**Performance**:
- Processing time: ~500ms
- Reliability: 99.9% uptime (n8n SLA)
- Throughput: Handles 1000+ leads/month on free tier

### 3. Airtable CRM (Storage & Management)
**Technology**: Airtable
**Base**: "KI Agentur Leads"
**Table**: "Leads"
**Schema**: 14 fields
**Access**: Sales team views/updates daily
**Retention**: Unlimited (free tier: 5GB)
**Automations**: Manual updates (sales team can auto-update fields)

**Key Fields**:
```
Primary Key: Email (unique)
├─ Name (Text)
├─ Company (Text)
├─ Message (Long Text, first 500 chars)
├─ Budget (Select: <50k, 50-100k, 100-250k, 250k+)
├─ Company Size (Select: 1-10, 11-50, 51-200, 200+)
├─ Urgency (Select: asap, 1-3mo, 3-6mo, exploring)
├─ AI Maturity (Select: none, some, advanced)
├─ Lead Score (Number: 0-165)
├─ Qualification (Select: hot, warm, cold)
├─ Tier (Text: tier name with action)
├─ Priority (Select: Urgent, Medium, Low)
├─ Submission Date (Date)
└─ Status (Select: New, In Progress, Qualified, Won, Lost)
```

### 4. Slack Notifications (Real-time Alerts)
**Technology**: Slack API
**Channels**:
- `#sales-alerts`: Hot leads only (hot lead alert every 30 min on avg)
- `#team-updates`: All new leads (summary messages)
**Latency**: <30 seconds from form submission
**Message Format**: Rich text with all key lead data
**Features**: @channel mention for hot leads (optional)

### 5. Email Service (Communication)
**Technology**: Resend API or Gmail SMTP
**Templates**: 3 variants (hot/warm/cold)
**Send Rate**: ~1 second per email
**Delivery**: 99%+ (industry standard)
**Tracking**: Opens/clicks if service supports
**Personalization**: {{name}}, {{company}}, {{calendlyUrl}}

**Templates**:
- Hot: "Schedule Your Free Consultation" (Calendly link)
- Warm: "How We Helped Companies Like Yours" (Case study)
- Cold: "Stay Updated on AI Automation" (Newsletter)

---

## Integration Points

### Website → n8n
**Method**: HTTPS POST
**Webhook**: `https://n8n.cloud/webhook/ki-agentur-leads`
**Timing**: Async, non-blocking (fire and forget)
**Failure Handling**: Logs error, doesn't affect user experience
**Headers**: Content-Type: application/json
**Timeout**: 30 seconds

### n8n → Airtable
**Method**: REST API
**Auth**: Bearer token
**Rate Limit**: 5 req/sec (sufficient for lead volume)
**Retries**: Automatic (n8n handles)
**Failures**: Logged in n8n execution logs

### n8n → Slack
**Method**: Slack API via n8n node
**Auth**: Bot token
**Rate Limit**: 1 req/sec (sufficient)
**Retries**: Automatic
**Failures**: Logged in n8n, doesn't block other actions

### n8n → Email Service
**Method**: REST API (Resend) or SMTP (Gmail)
**Auth**: API key or app password
**Rate Limit**: 60/min on Resend free tier
**Retries**: Service dependent
**Failures**: Logged, notifications sent for failures

---

## Scoring Algorithm (Detailed)

```javascript
// Pseudocode for lead scoring
function scoreLeadFunction(lead) {
  let score = 0;

  // 1. Company Size (0-40 points)
  switch(lead.companySize) {
    case '1-10': score += 10; break;
    case '11-50': score += 20; break;
    case '51-200': score += 30; break;
    case '200+': score += 40; break;
    default: score += 15; // unknown
  }

  // 2. Budget (0-70 points) - HIGHEST WEIGHT
  switch(lead.budget) {
    case '<50k': score += 10; break;
    case '50-100k': score += 30; break;
    case '100-250k': score += 50; break;
    case '250k+': score += 70; break;
    default: score += 5; // unknown
  }

  // 3. Urgency (0-30 points)
  switch(lead.urgency) {
    case 'asap': score += 30; break;
    case '1-3 months': score += 20; break;
    case '3-6 months': score += 10; break;
    case 'exploring': score += 5; break;
    default: score += 5; // unknown
  }

  // 4. AI Maturity (0-25 points)
  switch(lead.aiMaturity) {
    case 'none': score += 5; break;
    case 'some': score += 15; break;
    case 'advanced': score += 25; break;
    default: score += 5; // unknown
  }

  // Total: 0-165
  return {
    score: score,
    tier: score >= 90 ? 'hot' : score >= 60 ? 'warm' : 'cold'
  };
}
```

---

## Error Handling & Resilience

### Website Contact Form Errors
- **Validation Error**: Returns 400 with specific error message
- **Rate Limit**: Returns 429 after 5 requests/15 min
- **Email Failure**: Logs error, still returns 201 (doesn't block)
- **n8n Webhook Failure**: Logs error, form submission succeeds (doesn't block)

### n8n Workflow Errors
- **Webhook Parse Error**: Logged, execution fails gracefully
- **Airtable Save Error**: Email still sent, Slack still notified
- **Slack Error**: Doesn't block email or Airtable
- **Email Error**: Doesn't block Airtable or Slack

### Failure Recovery
- **Automatic Retries**: n8n built-in retry logic (3 attempts)
- **Monitoring**: n8n execution logs show all failures
- **Manual Recovery**: Can re-run failed execution in n8n UI
- **Fallback**: If everything fails, lead still in contact form email

### Data Integrity
- **Deduplication**: Email is unique key in Airtable (prevents duplicates)
- **Audit Trail**: Airtable shows created/modified timestamps
- **Backup**: Airtable retains 30-day revision history
- **Logging**: All operations logged in n8n and contact form

---

## Scalability & Limits

### Current Capacity (Free Tier)

| Component | Limit | Usage |
|-----------|-------|-------|
| n8n Cloud Executions | Unlimited | 1000+ leads/mo |
| Airtable Records | 100K (free) | ~100 leads/mo initially |
| Airtable API Calls | 5/sec | ~1 call/lead |
| Slack Messages | Unlimited | ~50 hot alerts/mo |
| Email Service | 100/day (Resend free) | ~50 leads/mo |
| Webhook Requests | Unlimited | 1 per lead |

### Growth Plan

**1000+ leads/month**:
- Upgrade Airtable to Pro: $20/mo
- Upgrade Resend to paid: $24/mo
- n8n stays free (unlimited executions)
- Total cost: ~$50/mo

**10,000+ leads/month**:
- Self-host n8n: $10-20/mo (VPS)
- Airtable: $50/mo (team license)
- Email service: $150/mo (Resend pro)
- Slack: $12/mo (pro)
- Total cost: ~$200/mo

---

## Security Considerations

### Input Security
- Website: Zod schema validation
- Website: Rate limiting (5 req/15 min)
- Website: Input sanitization
- n8n: No additional validation needed

### API Security
- n8n Webhook: Public URL (no auth token needed, can add if desired)
- Airtable: Token-based auth, secret stored in n8n
- Slack: Bot token auth, secret stored in n8n
- Email: API key auth, secret stored in n8n

### Data Privacy
- GDPR: Unsubscribe link in cold lead emails
- Contact data: Stored in Airtable, accessible to sales team
- Retention: Delete leads after 2+ years per GDPR
- PII: Email field is PII, restrict Airtable access to team

### Compliance
- CAN-SPAM: Unsubscribe link in all emails
- Email: "From" address is branded (ki-agentur.de)
- Records: Audit trail in Airtable (who changed what, when)

---

## Performance Metrics

### Response Times
- Form submission → Email received: 30 seconds
- Form submission → Airtable saved: 30 seconds
- Form submission → Slack alert: 30 seconds
- Webhook round-trip: 500ms average

### Reliability
- Website uptime: 99.9% (depends on hosting)
- n8n uptime: 99.9% (cloud SLA)
- Airtable uptime: 99.9% (cloud SLA)
- Email delivery: 99%+ (service dependent)
- Slack delivery: 99%+ (service dependent)

### Cost Analysis
- **Free Tier**: $0/mo, handles ~100 leads/mo
- **Growth (1000/mo)**: ~$50/mo
- **Enterprise (10K/mo)**: ~$200/mo

---

## Monitoring & Observability

### What to Monitor
- n8n execution logs (errors, failures)
- Airtable record count (leads coming in)
- Email delivery rates (bounces, failures)
- Slack message delivery (failures)
- Lead score distribution (unusual patterns)

### Tools
- n8n Dashboard: Built-in execution logs
- Airtable: Built-in audit logs
- Email service: API delivery reports
- Slack: Message delivery logs (basic)

### Alerts
- n8n: Email alert on workflow failure (set up in n8n)
- Airtable: Manual review (no automated alerts)
- Email: Manual review or service dashboard
- Slack: Manual review (no alerts for failed messages)

---

## Disaster Recovery

### Backup Strategy
- **Airtable**: Automatic daily backups (enterprise only) or manual exports
- **n8n**: Automatic backup of workflow definition (can re-import)
- **Email Templates**: Stored in git (version control)
- **Slack History**: Searchable (n8n alerts saved)

### Recovery Procedures
1. **n8n Workflow Down**: Import backup `n8n-lead-qualification-workflow.json`
2. **Airtable Down**: Contact Airtable support (cloud SLA)
3. **Slack Down**: Leads still save to Airtable, Slack reconnects
4. **Email Down**: Check email service status, switch providers if needed

### RTO/RPO Targets
- RTO (Recovery Time): 15 minutes (re-import workflow or failover)
- RPO (Recovery Point): 0 (all leads captured in Airtable)

---

## Architecture Decisions

### Why n8n?
- ✓ Free open-source with cloud hosting
- ✓ No-code workflow builder (non-technical users can edit)
- ✓ Native integrations: Airtable, Slack, Email
- ✓ JavaScript nodes for custom logic (scoring)
- ✓ Good documentation and community

### Why Airtable?
- ✓ Free tier supports 100K records
- ✓ Simple database for non-technical team
- ✓ Built-in views/filters for sales team
- ✓ Mobile app for on-the-go updates
- ✓ Easy data export for analysis

### Why Slack?
- ✓ Already using for team communication
- ✓ Real-time notifications
- ✓ Rich formatting for alerts
- ✓ Native n8n integration
- ✓ Mobile push notifications

### Why Email Service?
- ✓ Better deliverability than transactional email
- ✓ Built-in tracking (opens, clicks)
- ✓ Template support
- ✓ Resend is modern, developer-friendly
- ✓ Free tier sufficient for MVP

---

## Future Enhancements

### Short Term (1-3 months)
- [ ] Add lead enrichment (Clearbit API for company data)
- [ ] Add custom scoring weights per sales team
- [ ] Add SMS notifications for hot leads
- [ ] Add calendar integration (auto-book Calendly)

### Medium Term (3-6 months)
- [ ] AI-powered lead scoring (ML model)
- [ ] Predictive close rate by lead tier
- [ ] Automated follow-up sequences
- [ ] Lead source attribution

### Long Term (6+ months)
- [ ] Full CRM integration (HubSpot/Pipedrive)
- [ ] Real-time lead analytics dashboard
- [ ] Sales pipeline forecasting
- [ ] ROI calculator by lead source

---

## Architecture Diagram (Text Version)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        LAYER 1: INPUT                         ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  Website Contact Form (Next.js)                              ┃
┃  └─ POST /api/contact                                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                               │
                               ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        LAYER 2: PROCESSING                    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  n8n Workflow (Lead Qualification Engine)                    ┃
┃  ├─ Webhook Trigger                                          ┃
┃  ├─ Parse Lead Data                                          ┃
┃  ├─ Lead Scoring Engine                                      ┃
┃  ├─ Conditional Routing (Hot/Warm/Cold)                      ┃
┃  └─ Output Actions (Save, Notify, Email)                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        │                    │                    │
        ▼                    ▼                    ▼
┏━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━┓
┃ LAYER 3: OUTPUT (Parallel Execution) ┃
┣━━━━━━━━━━━━━━┣━━━━━━━━━━━━━━┫━━━━━━━━━━━━━━┫
┃  Airtable    │  │  Slack     │  │  Email     │
┃  (Storage)   │  │  (Alerts)  │  │  (Response)│
┗━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━┛
     │                 │                  │
     ▼                 ▼                  ▼
  Sales Team      Team Updates       Customer Inbox
  Dashboard       Notifications      (Tier-specific)
```

This architecture provides:
- **Scalability**: Each component can scale independently
- **Reliability**: Failures in one component don't block others
- **Maintainability**: Clear separation of concerns
- **Monitoring**: Each layer can be monitored separately
- **Cost**: Free tier sufficient for MVP, scales affordably

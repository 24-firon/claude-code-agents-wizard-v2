# Lead Qualification Automation System - Complete Overview

**KI Agentur Lead Qualification Automation** is a turnkey system that automatically qualifies, scores, and routes leads from your marketing website using n8n workflows, Airtable CRM integration, and intelligent email automation.

## What It Does (In 60 Seconds)

1. **Receives**: Contact form submission from your website
2. **Analyzes**: Extracts company size, budget, urgency, AI readiness from form data
3. **Scores**: Calculates lead quality (0-165 points) automatically
4. **Routes**: Assigns to tier (Hot/Warm/Cold) based on score
5. **Notifies**: Alerts sales team for hot leads via Slack
6. **Responds**: Sends personalized auto-response email
7. **Records**: Saves to Airtable CRM for tracking

**Result**: Your sales team focuses on hot leads, warm leads get nurtured automatically, and no lead falls through the cracks.

---

## Files in This System

| File | Purpose | When You Need It |
|------|---------|------------------|
| `n8n-lead-qualification-workflow.json` | Complete n8n workflow (import directly) | Setup day 1 |
| `lead-scoring-criteria.md` | Detailed scoring algorithm documentation | Understanding how leads are scored |
| `lead-automation-setup-guide.md` | Step-by-step integration instructions | First-time setup |
| `lead-email-templates.md` | 3 HTML email templates (hot/warm/cold) | Email customization |
| `LEAD-QUALIFICATION-README.md` | This file - quick reference | Ongoing reference |

---

## Quick Setup (30 Minutes)

### Before You Start
- [ ] Have n8n Cloud account ready (free at https://n8n.cloud)
- [ ] Have Airtable account ready (free at https://airtable.com)
- [ ] Have Slack workspace with admin access
- [ ] Have email service API credentials (Gmail app password OR Resend API key)

### Step 1: Import Workflow (5 min)
1. Open n8n dashboard
2. Create new workflow
3. Import: `n8n-lead-qualification-workflow.json`
4. Review the 11 nodes to understand the flow

### Step 2: Configure Integrations (15 min)
1. **Airtable**: Create "Leads" table, connect credentials in n8n
2. **Slack**: Create app, connect to n8n with Bot token
3. **Email**: Get API key (Resend or Gmail app password)
4. **Environment variables**: Add to n8n settings

### Step 3: Activate & Test (10 min)
1. Activate workflow in n8n
2. Submit test lead via website contact form
3. Verify in Airtable, Slack, and email inbox
4. Deploy website with `N8N_WEBHOOK_URL` environment variable

---

## How Leads Get Scored

### Four Scoring Dimensions

**1. Company Size** (0-40 points)
- 1-10 employees: 10 pts
- 11-50 employees: 20 pts
- 51-200 employees: 30 pts
- 200+ employees: 40 pts

**2. Budget** (0-70 points) - Most Important!
- <€50K: 10 pts
- €50-100K: 30 pts
- €100-250K: 50 pts
- €250K+: 70 pts

**3. Urgency** (0-30 points)
- ASAP: 30 pts
- 1-3 months: 20 pts
- 3-6 months: 10 pts
- Exploring: 5 pts

**4. AI Maturity** (0-25 points)
- None: 5 pts
- Some: 15 pts
- Advanced: 25 pts

### Qualification Tiers

**HOT LEAD (90-165 points)**
- Profile: €100K+ budget + mid-market/enterprise + ASAP timeline
- Action: Calendar booking email + Slack alert
- Sales response: Within 4 business hours

**WARM LEAD (60-89 points)**
- Profile: €50-100K budget + growing company + 1-3 month timeline
- Action: Case study email + nurture sequence
- Sales response: Follow-up call in 3-5 days

**COLD LEAD (0-59 points)**
- Profile: Startup + exploring budget + no urgency
- Action: Newsletter signup + monthly nurture
- Sales response: Quarterly check-in email

---

## Lead Scoring Examples

### Example 1: Hot Lead
```
Input: "We're TechCore GmbH (150 people). Need to automate customer service
        ASAP with €150K budget. We already use some automation tools."

Scoring:
- Company Size (51-200): 30 pts
- Budget (€100-250K): 50 pts
- Urgency (ASAP): 30 pts
- AI Maturity (Some): 15 pts
─────────────────────
TOTAL: 125 points → HOT LEAD ✓

Action: Send Calendly booking link + Slack alert "🔥 HOT LEAD"
```

### Example 2: Warm Lead
```
Input: "We have 45 people and want to automate reporting. About €80K budget.
        Looking at Q1 next year."

Scoring:
- Company Size (11-50): 20 pts
- Budget (€50-100K): 30 pts
- Urgency (3-6 months): 10 pts
- AI Maturity (None): 5 pts
─────────────────────
TOTAL: 65 points → WARM LEAD ✓

Action: Send case study email + add to nurture sequence
```

### Example 3: Cold Lead
```
Input: "Small e-commerce startup (8 people). Just exploring automation.
        Nothing urgent, just learning for now."

Scoring:
- Company Size (1-10): 10 pts
- Budget (Unknown): 5 pts
- Urgency (Exploring): 5 pts
- AI Maturity (None): 5 pts
─────────────────────
TOTAL: 25 points → COLD LEAD ✓

Action: Send newsletter signup email + add to monthly list
```

---

## The Workflow In Action

```
Contact Form Submission
        ↓
        [Webhook Trigger]
        ↓
        [Parse Lead Data]
        ├─ Extract: name, email, company, message, budget
        ├─ Detect: company size, urgency, AI maturity
        ↓
        [Lead Scoring Engine]
        ├─ Company Size: 10-40 pts
        ├─ Budget: 5-70 pts
        ├─ Urgency: 5-30 pts
        ├─ AI Maturity: 5-25 pts
        ├─ Determine Tier: Hot/Warm/Cold
        ↓
        [Three Parallel Paths]
        ├─ IF Hot Lead (90+)
        │  ├─ Slack Alert "🔥 HOT LEAD"
        │  └─ Send "Schedule Consultation" Email
        │
        ├─ IF Warm Lead (60-89)
        │  └─ Send "Case Study" Email
        │
        └─ IF Cold Lead (0-59)
           └─ Send "Newsletter" Email

        [All Leads]
        ├─ Save to Airtable CRM
        └─ Notify Team in Slack
```

---

## Integration Points

### 1. Website Contact Form → n8n
**File**: `/website/src/app/api/contact/route.ts` (already updated)
**How**: Webhook POST when form submitted
**Data sent**: name, email, company, message, budget

### 2. n8n → Airtable CRM
**Stores**: Complete lead record with score, tier, all fields
**Use**: Sales team views all leads, updates status
**Benefits**: Searchable database, lead history, pipeline tracking

### 3. n8n → Slack
**Notifies**: Sales team of hot leads immediately
**Channels**:
- Sales alerts channel (hot leads only)
- Team updates channel (all leads)
**Format**: Rich formatted message with lead details

### 4. n8n → Email Service
**Sends**: Personalized responses based on tier
**Options**: Gmail SMTP, Resend, SendGrid, or others
**Templates**: 3 variants (hot/warm/cold) in `/lead-email-templates.md`

---

## Daily Operations

### For Sales Team

**Morning Checklist:**
- [ ] Check Slack for hot lead alerts
- [ ] Review Airtable "New" leads
- [ ] Call hot leads first (target: within 4 hours of submission)
- [ ] Update lead status as you work them

**Lead Stages in Airtable:**
1. **New** - Just submitted, auto-qualified
2. **In Progress** - Sales called/emailed
3. **Qualified** - Met requirements, ready for proposal
4. **Won** - Closed deal
5. **Lost** - Won't convert, update reason

**Template Responses:**
- Hot: "Thanks for reaching out! I have your Calendly link in my email. Let's talk within 4 hours."
- Warm: "Thanks! I've sent you some resources. Let's connect in a few days."
- Cold: "Thanks! You're on our monthly newsletter. We'll check in next quarter."

### For Marketing Team

**Weekly Tasks:**
- [ ] Check lead source quality
- [ ] Monitor email open rates by template
- [ ] Adjust website messaging if needed
- [ ] Track conversion rates by lead source

**Monthly Review:**
- [ ] Analyze scoring accuracy
- [ ] Compare predicted tier vs actual deal size
- [ ] Adjust scoring weights if needed
- [ ] Report to leadership: # leads, conversion %, pipeline value

---

## Email Customization

### Update Logo
Replace `ki-agentur.de` with your domain in all templates

### Update Colors
- **Hot**: Blue (#0066ff) → Change to your brand color
- **Warm**: Teal (#00b4db) → Change to your brand color
- **Cold**: Purple (#667eea) → Change to your brand color

### Update CTAs
- **Hot**: Calendly link → Replace with your scheduling tool
- **Warm**: Case study link → Replace with your best case study
- **Cold**: Newsletter link → Replace with your signup form

### Update Company Info
- Replace "KI Agentur" with your company name
- Replace contact emails with your emails
- Update phone numbers, addresses, links

---

## Performance Metrics to Track

### By Lead Tier

| Metric | Target |
|--------|--------|
| Hot Lead Conversion Rate | >30% |
| Warm Lead Conversion Rate | >10% |
| Cold Lead Conversion Rate | >2% |
| Average Deal Size (Hot) | €100K+ |
| Average Deal Size (Warm) | €50-100K |
| Sales Cycle (Hot) | <4 weeks |
| Sales Cycle (Warm) | 4-12 weeks |

### By Email Template

| Metric | Target |
|--------|--------|
| Hot Email Open Rate | >45% |
| Hot Email Click Rate | >15% |
| Warm Email Open Rate | >35% |
| Warm Email Click Rate | >8% |
| Cold Email Open Rate | >20% |
| Newsletter Signup Rate | >5% |

### Overall Pipeline

- Leads per month
- Average lead quality (score)
- % distributed by tier (Target: 5-10% hot, 20-30% warm, 60-75% cold)
- Monthly pipeline value
- Win rate by tier

---

## Common Questions

**Q: Can we adjust the scoring weights?**
A: Yes! Edit the "Lead Scoring Engine" JavaScript node in n8n. Change the point values, save, and re-test. See `lead-scoring-criteria.md` for recommendations.

**Q: What if a lead doesn't specify budget?**
A: Gets 5 points for budget. System flags for sales follow-up: "What's your budget range?"

**Q: Can sales manually override tier?**
A: Yes. Edit "Qualification" field in Airtable. Updates won't re-trigger emails.

**Q: How often should we review scoring accuracy?**
A: Monthly. Compare predicted tier vs actual won deal size. Adjust weights quarterly based on patterns.

**Q: What if n8n goes down?**
A: Contact form still works. n8n webhook is "fire and forget" so doesn't block users. You'll just miss lead routing/emails. Set up n8n uptime monitoring (free options: UptimeRobot, Freshping).

**Q: Can we add more tiers (e.g., "Super Hot")?**
A: Yes. Add new conditional node after "Lead Scoring Engine". Set threshold (e.g., score >= 130), route to different action, update email template.

**Q: How do we handle multiple team members?**
A: Add "Assigned To" field in Airtable. Use routing logic (round-robin) in n8n to distribute leads fairly.

---

## Troubleshooting

### Leads Not Appearing in Airtable
1. Check Airtable token is valid (hasn't expired)
2. Verify table name is exactly "Leads"
3. Check n8n execution logs for Airtable API errors
4. Confirm all field names match exactly

### Slack Alerts Not Sending
1. Verify Bot Token in n8n (should start with `xoxb-`)
2. Check channel ID is correct (should start with `C`)
3. Confirm bot is in the channel (it auto-joins)
4. Test Slack node independently with "Test" button

### Emails Not Sending
1. Check email service credentials (key format, expired?)
2. Verify "From" email is registered with service
3. Test email node independently
4. Check spam folder for emails
5. Review email service logs for delivery failures

### Webhook Not Triggering
1. Verify `N8N_WEBHOOK_URL` in website `.env.local`
2. Check website deployed with webhook code uncommented
3. Verify n8n workflow is "Active" (toggle in top right)
4. Test webhook URL manually with curl:
   ```bash
   curl -X POST https://n8n.cloud/webhook/ki-agentur-leads \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","company":"Test Co","message":"Test message","budget":"100-250k"}'
   ```

---

## Next Steps

1. **This Week**: Import workflow, set up integrations, test with real leads
2. **Week 2**: Train sales team on Airtable CRM, tier system, email templates
3. **Week 3**: Monitor first 10 leads, gather feedback, make adjustments
4. **Week 4**: Review scoring accuracy, optimize, plan monthly reviews
5. **Ongoing**: Weekly lead review, monthly scoring analysis, quarterly optimization

---

## Files & Resources

**Included Files:**
- `n8n-lead-qualification-workflow.json` - Import this into n8n
- `lead-scoring-criteria.md` - Detailed scoring algorithm
- `lead-automation-setup-guide.md` - Complete integration guide
- `lead-email-templates.md` - HTML email templates
- `LEAD-QUALIFICATION-README.md` - This file

**External Resources:**
- n8n Docs: https://docs.n8n.io
- Airtable API: https://airtable.com/api
- Slack API: https://api.slack.com
- Resend Email: https://resend.com/docs

**Support:**
- n8n Community: https://community.n8n.io
- Airtable Help: https://support.airtable.com
- Check execution logs in n8n for specific errors

---

## Success Criteria

You'll know this system is working when:

✓ Hot leads get contacted within 4 hours
✓ Sales can see all leads in Airtable sorted by score
✓ Slack notifications alert team of hot opportunities
✓ Email responses match the lead quality tier
✓ Monthly conversion rates are >30% for hot leads
✓ Team reports saved time on lead qualification

---

## Version & Updates

**Current Version**: 1.0
**Last Updated**: November 2024
**Next Review**: December 2024 (monthly optimization cycle)

---

## Summary

This lead qualification system automates the most repetitive part of sales: qualifying, scoring, and routing leads. It gives your sales team immediate visibility into hot opportunities, ensures warm leads stay nurtured, and builds your cold lead pipeline for the future.

**Total setup time**: 30-45 minutes
**Monthly maintenance**: 2-3 hours for analysis and optimization
**ROI**: Typically pays for itself in 1-2 hot leads closed

Start with the setup guide, import the workflow, and you're live. Good luck!

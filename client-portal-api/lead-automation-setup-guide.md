# Lead Qualification Automation - Setup & Integration Guide

## Quick Start (30 minutes)

This guide walks you through setting up the complete lead qualification system for KI Agentur.

---

## Part 1: n8n Cloud Setup

### Step 1.1: Create n8n Cloud Account (Free)
1. Go to https://n8n.cloud
2. Click "Sign Up" → Create account with email
3. Verify email address
4. Create a new workspace (select "Free" tier)

### Step 1.2: Import the Workflow
1. In n8n dashboard, click "Workflows" → "+ New Workflow"
2. Click "..." menu → "Import Workflow"
3. Upload: `n8n-lead-qualification-workflow.json`
4. Review imported nodes (should show 11 nodes total)
5. Click "Save"

---

## Part 2: Webhook Configuration

### Step 2.1: Get Webhook URL from n8n
1. Open the imported workflow in n8n
2. Find the "Webhook - Contact Form" node (blue node)
3. Click the node
4. Copy the "Webhook URL" (looks like: `https://n8n.cloud/webhook/ki-agentur-leads`)
5. Note this down for Step 2.2

### Step 2.2: Add Webhook to Website API
1. Open `/home/user/claude-code-agents-wizard-v2/website/src/app/api/contact/route.ts`
2. Uncomment the n8n webhook code (lines 86-91):

```typescript
// Uncomment this section:
await fetch(process.env.N8N_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(sanitizedData),
});
```

3. Add environment variable to your `.env.local`:
```env
N8N_WEBHOOK_URL=https://n8n.cloud/webhook/ki-agentur-leads
```

4. Deploy the website update

### Step 2.3: Test the Webhook
1. In n8n, activate the workflow (toggle "Active" in top right)
2. Go to website and submit contact form with test data:
   - Name: Test User
   - Email: test@example.com
   - Company: Test Company
   - Message: "We're a mid-size company (150 employees) looking to automate ASAP. We have €100K budget and some AI experience."
   - Budget: 100-250k
3. n8n workflow should execute
4. Check n8n workflow execution logs to confirm success

---

## Part 3: Airtable Integration (FREE)

### Step 3.1: Create Airtable Base
1. Go to https://airtable.com → Sign up (free)
2. Click "+ Create Base"
3. Name: "KI Agentur Leads"
4. Select "Start from scratch"

### Step 3.2: Create Leads Table
1. Rename default table to "Leads"
2. Add these fields:

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| Name | Single line text | Contact name |
| Email | Email | Primary contact |
| Company | Single line text | Company name |
| Message | Long text | Original inquiry |
| Budget | Single select | <50k, 50-100k, 100-250k, 250k+ |
| Company Size | Single select | 1-10, 11-50, 51-200, 200+ |
| Urgency | Single select | asap, 1-3 months, 3-6 months, exploring |
| AI Maturity | Single select | none, some, advanced |
| Lead Score | Number | 0-165 |
| Qualification | Single select | hot, warm, cold |
| Tier | Single line text | Tier name with action |
| Priority | Single select | Urgent, Medium, Low |
| Submission Date | Date | When submitted |
| Status | Single select | New, In Progress, Qualified, Won, Lost |

3. Delete any default fields not in the list above

### Step 3.3: Get Airtable Credentials
1. Go to https://airtable.com/account/tokens
2. Click "Create new token"
3. Token name: "n8n Integration"
4. Scopes: Check "data.records:read", "data.records:write", "schema.bases:read"
5. Click "Create Token" and copy it (save to safe place)
6. Go to your base → Click "+" → Note the Base ID from URL:
   - URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - Base ID: `appXXXXXXXXXXXXXX`

### Step 3.4: Connect Airtable to n8n
1. In n8n workflow, click the "Save to Airtable" node
2. Click "Create New" next to Airtable credentials
3. Fill in:
   - Credential name: "Airtable KI Agentur"
   - Token: (paste from Step 3.3)
4. Click "Create Credential"
5. Select the credential you just created
6. For "Table", select "Leads"
7. Save the node

---

## Part 4: Email Integration

### Option A: Use Gmail (Recommended for Startups)

#### Step 4A.1: Create Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password
4. Save it (you'll need it for n8n)

#### Step 4A.2: Configure Email Nodes in n8n
1. For "Send Hot Lead Email", "Send Warm Lead Email", "Send Cold Lead Email" nodes:
   - These are currently HTTP requests to a generic email service
   - If using Gmail SMTP, change to n8n's "Gmail" node:

```
Node Type: Gmail
Authentication: Create new Gmail credential
Email: your@gmail.com
App Password: (from Step 4A.1)
To: {{ $json.email }}
Subject: (varies by template)
Attachments: none
```

### Option B: Use Resend (Recommended for Teams)

Resend is a modern email API (free tier: 100 emails/day):

#### Step 4B.1: Create Resend Account
1. Go to https://resend.com
2. Sign up with email
3. Go to "API Keys"
4. Create new API key
5. Copy the key (looks like: `re_XXXXXXXXXXXX`)

#### Step 4B.2: Configure in n8n
For email nodes, use HTTP Request with Resend:

```
Method: POST
URL: https://api.resend.com/emails
Headers:
  - Authorization: Bearer re_XXXXXXXXXXXX
  - Content-Type: application/json

Body:
{
  "from": "leads@ki-agentur.de",
  "to": "{{ $json.email }}",
  "subject": "Subject from template",
  "html": "<html>Email body here</html>"
}
```

---

## Part 5: Slack Integration

### Step 5.1: Create Slack App
1. Go to https://api.slack.com/apps
2. Click "Create New App"
3. Select "From scratch"
4. App name: "KI Agentur Leads"
5. Select your workspace
6. Click "Create App"

### Step 5.2: Enable Permissions
1. Go to "OAuth & Permissions"
2. Under "Bot Token Scopes", add:
   - `chat:write`
   - `channels:read`
3. Click "Install to Workspace"
4. Authorize the app
5. Copy "Bot User OAuth Token" (starts with `xoxb-`)

### Step 5.3: Get Channel IDs
1. In Slack, right-click channel name → "View details"
2. Copy the Channel ID (looks like: `C1234567890`)
3. Do this for:
   - Sales alerts channel (hot leads) → `SLACK_CHANNEL_ID`
   - Team updates channel (all leads) → `SLACK_TEAM_CHANNEL_ID`

### Step 5.4: Connect to n8n
1. In n8n, click either Slack notification node
2. Click "Create New" next to Slack credentials
3. Paste Bot Token from Step 5.2
4. Click "Create Credential"
5. Select the credential
6. For "Channel", enter the Channel ID (without # symbol)
7. Save

---

## Part 6: Environment Variables

Add these to your environment (`.env.local` for website, n8n secrets for workflow):

### Website (.env.local)
```env
# n8n Lead Qualification Webhook
N8N_WEBHOOK_URL=https://n8n.cloud/webhook/ki-agentur-leads
```

### n8n Workflow (Settings → Environment Variables)
```env
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TOKEN=keyXXXXXXXXXXXXXX
SLACK_CHANNEL_ID=C1234567890
SLACK_TEAM_CHANNEL_ID=C0987654321
EMAIL_SERVICE_API=https://api.resend.com/emails
EMAIL_API_KEY=re_XXXXXXXXXXXX
```

---

## Part 7: Testing Procedure

### Test 1: Hot Lead Submission (5 minutes)
1. Go to KI Agentur website contact form
2. Submit:
   ```
   Name: Maria Schmidt
   Email: your-email@example.com
   Company: TechCore GmbH
   Message: "We're a mid-size company with 150 employees looking to
            automate customer service with AI. We have €150K budget
            and need to start ASAP. We already use some automation tools."
   Budget: 100-250k
   ```
3. Check:
   - ✓ Email received with "Schedule Your Free Consultation"
   - ✓ Slack hot lead alert received
   - ✓ Lead saved to Airtable with score 125+
   - ✓ Tier = "Hot Lead - Sales Call"

### Test 2: Warm Lead Submission (5 minutes)
1. Submit form with:
   ```
   Name: Klaus Weber
   Email: warm-test@example.com
   Company: FinanceFlow AG
   Message: "We have 45 people and interested in automation for
            reporting. Budget around €75K. Looking at Q1 next year."
   Budget: 50-100k
   ```
2. Check:
   - ✓ Email received with "How We Helped Companies Like Yours"
   - ✓ NO Slack hot lead alert
   - ✓ Lead saved to Airtable with score 60-89
   - ✓ Tier = "Warm Lead - Email Nurture"

### Test 3: Cold Lead Submission (5 minutes)
1. Submit form with:
   ```
   Name: Jana Müller
   Email: cold-test@example.com
   Company: LocalShop Solutions
   Message: "We're a small e-commerce company just exploring what
            AI could do for us. No rush, just learning."
   Budget: <50k (or skip)
   ```
2. Check:
   - ✓ Email received with "Stay Updated" newsletter
   - ✓ NO Slack alerts
   - ✓ Lead saved to Airtable with score < 60
   - ✓ Tier = "Cold Lead - Newsletter"

### Test 4: Webhook Delivery (2 minutes)
1. In n8n, go to workflow executions
2. Check the last 3 executions (from tests above)
3. Each should show:
   - ✓ Webhook triggered
   - ✓ Lead parsed correctly
   - ✓ Score calculated
   - ✓ Routing executed
   - ✓ All nodes executed without errors

---

## Troubleshooting

### Webhook Not Triggering
**Problem:** Website form submitted but n8n workflow doesn't execute

**Solutions:**
1. Check `N8N_WEBHOOK_URL` in website `.env.local` matches n8n webhook
2. Verify website deployed with the webhook code uncommented
3. Check n8n workflow is "Active" (toggle in top right)
4. In browser, open Network tab and verify POST to webhook URL succeeds
5. Check n8n logs for errors

### Airtable Not Saving
**Problem:** Workflow runs but no record in Airtable

**Solutions:**
1. Check Airtable token is correct and not expired
2. Check Base ID matches your Airtable base
3. Verify all field names exactly match the Airtable table
4. In n8n node, ensure "Table" is set to "Leads"
5. Check n8n execution logs for Airtable API errors

### Slack Alerts Not Sending
**Problem:** Hot leads not triggering Slack notifications

**Solutions:**
1. Verify Bot Token starts with `xoxb-`
2. Check channel ID is correct (should start with `C`)
3. Verify bot app has "chat:write" permission
4. Ensure bot is added to the channel (it's invited automatically)
5. Test Slack node independently by clicking "Test"

### Emails Not Sending
**Problem:** No response emails sent to leads

**Solutions:**
1. Check email service credentials are correct
   - Resend: API key format `re_XXXX...`
   - Gmail: 16-char app password
2. Verify "From" email address is registered with service
3. Check spam folder for test emails
4. Test email node independently by clicking "Test"
5. Check n8n logs for email API errors

---

## Operations & Maintenance

### Daily Tasks
- Check Slack hot lead alerts
- Respond to hot leads with calendar booking within 4 hours
- Monitor warm leads email open rates

### Weekly Tasks
- Review Airtable leads table
- Update lead status (New → In Progress → Qualified/Won/Lost)
- Check conversion rates by lead source

### Monthly Tasks
- Analyze lead scoring accuracy
- Compare predicted tier vs actual deal value
- Review email template performance
- Adjust scoring weights if needed

### Quarterly Tasks
- Full lead pipeline review
- Update scoring model based on data
- Team training on lead qualification process
- Competitor analysis update

---

## Advanced Customization

### Adding Lead Enrichment
To add company data enrichment (size, industry, etc.):

1. Add node before "Save to Airtable"
2. Use Clearbit API (https://clearbit.com - free tier available):
   ```
   HTTP POST to https://api.clearbit.com/v1/companies/find?domain=...
   Add Authorization header with Clearbit API key
   Extract company data (size, industry, funding, etc.)
   ```
3. Merge enriched data into lead record

### Custom Scoring Weights
To change scoring weights based on your business:

1. Edit "Lead Scoring Engine" JavaScript node
2. Modify these score values:
   ```javascript
   const companySizeScores = {
     '1-10': 10,      // ← Adjust these
     '11-50': 20,
     '51-200': 30,
     '200+': 40
   };
   ```
3. Re-test with examples to verify new scores

### Adding More Routing Conditions
To add intermediate tier (e.g., "Super Hot"):

1. Add new conditional node after "Lead Scoring Engine"
2. Check if `score >= 130`
3. Route to different email/Slack/action
4. Save to Airtable with new tier

---

## Deployment Options

### Option 1: n8n Cloud (Recommended for MVP)
- Free tier: Unlimited executions
- Pros: Zero maintenance, always up
- Cons: Limited to 2 users free tier
- Cost: Free → $20/month (pro features)

### Option 2: Self-Hosted n8n (For Scale)
- Docker deployment on your server
- Pros: Full control, no execution limits
- Cons: Requires server maintenance
- Setup time: 30 minutes with Docker

### Option 3: n8n Docker on Railway.app (Balanced)
- Deploy n8n Docker to Railway (free tier available)
- Pros: Managed container, good free tier
- Cons: Limited free tier resources
- Cost: $5/month for production-grade

---

## Support & Resources

### n8n Documentation
- https://docs.n8n.io - Official n8n docs
- https://n8n.io/workflows - Workflow examples
- https://community.n8n.io - Community forum

### Airtable Documentation
- https://airtable.com/api - API reference
- https://support.airtable.com - Help center

### Integration Guides
- Resend: https://resend.com/docs
- Slack API: https://api.slack.com/docs
- Gmail SMTP: https://support.google.com/accounts/answer/185833

### Getting Help
1. Check n8n workflow execution logs (red errors)
2. Test individual nodes with "Test" button
3. Post in n8n community: https://community.n8n.io
4. Contact KI Agentur support for business logic questions

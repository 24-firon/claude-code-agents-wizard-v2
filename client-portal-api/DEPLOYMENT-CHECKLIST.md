# Lead Qualification Automation - Deployment Checklist

Complete this checklist to deploy the lead qualification system. Total time: ~60 minutes.

---

## Pre-Deployment (Day Before)

### Accounts & Services
- [ ] Create n8n Cloud account (free) - https://n8n.cloud
- [ ] Create Airtable account (free) - https://airtable.com
- [ ] Have Slack workspace admin access
- [ ] Have email service credentials (Gmail app password or Resend API key)

### Team Access
- [ ] Sales team has Airtable access
- [ ] Slack users can see #sales-alerts channel
- [ ] DevOps/Dev can deploy website updates
- [ ] Product owner available for testing

### Documentation
- [ ] Print/bookmark this checklist
- [ ] Share LEAD-QUALIFICATION-README.md with team
- [ ] Have scoring criteria visible (lead-scoring-criteria.md)

---

## Phase 1: n8n Setup (15 minutes)

### 1.1 Create n8n Workspace
- [ ] Go to https://n8n.cloud
- [ ] Sign up with email
- [ ] Create workspace (Free tier is fine)
- [ ] Verify email address

### 1.2 Import Workflow
- [ ] In n8n, go to "Workflows"
- [ ] Click "+ New Workflow"
- [ ] Click "..." menu → "Import Workflow"
- [ ] Upload `n8n-lead-qualification-workflow.json`
- [ ] Click "Save"
- [ ] Verify 11 nodes imported successfully:
  - ✓ Webhook - Contact Form
  - ✓ Parse Lead Data
  - ✓ Lead Scoring Engine
  - ✓ Is Hot Lead?
  - ✓ Is Warm Lead?
  - ✓ Save to Airtable
  - ✓ Slack Notification - Hot Lead
  - ✓ Slack Notification - Team
  - ✓ Send Hot Lead Email
  - ✓ Send Warm Lead Email
  - ✓ Send Cold Lead Email

### 1.3 Get Webhook URL
- [ ] Click "Webhook - Contact Form" node
- [ ] Copy the Webhook URL (format: https://n8n.cloud/webhook/...)
- [ ] Save to notepad for Step 2.3

---

## Phase 2: Airtable Setup (15 minutes)

### 2.1 Create Base
- [ ] Go to https://airtable.com
- [ ] Create new base: "KI Agentur Leads"
- [ ] Select "Start from scratch"

### 2.2 Create Leads Table
- [ ] Rename default table to "Leads"
- [ ] Add these fields (in order):
  - [ ] Name (Text)
  - [ ] Email (Email)
  - [ ] Company (Text)
  - [ ] Message (Long text)
  - [ ] Budget (Single select: <50k, 50-100k, 100-250k, 250k+)
  - [ ] Company Size (Single select: 1-10, 11-50, 51-200, 200+)
  - [ ] Urgency (Single select: asap, 1-3 months, 3-6 months, exploring)
  - [ ] AI Maturity (Single select: none, some, advanced)
  - [ ] Lead Score (Number)
  - [ ] Qualification (Single select: hot, warm, cold)
  - [ ] Tier (Text)
  - [ ] Priority (Single select: Urgent, Medium, Low)
  - [ ] Submission Date (Date)
  - [ ] Status (Single select: New, In Progress, Qualified, Won, Lost)
- [ ] Delete any default fields not in the list

### 2.3 Get Airtable Credentials
- [ ] Go to https://airtable.com/account/tokens
- [ ] Create new token:
  - [ ] Name: "n8n Integration"
  - [ ] Scopes: Check "data.records:read", "data.records:write", "schema.bases:read"
  - [ ] Click "Create Token"
- [ ] Copy token and save to safe place
- [ ] Get Base ID from URL:
  - [ ] Open your base
  - [ ] Copy from URL: https://airtable.com/`appXXXXXXXXXXXXXX`/...
  - [ ] Save Base ID

### 2.4 Connect Airtable to n8n
- [ ] In n8n workflow, click "Save to Airtable" node
- [ ] Click "Create New" next to Airtable credentials
- [ ] Enter:
  - [ ] Credential name: "Airtable KI Agentur"
  - [ ] Token: (paste from 2.3)
- [ ] Click "Create Credential"
- [ ] Select the credential you created
- [ ] For "Table", select "Leads"
- [ ] Save the node

---

## Phase 3: Slack Setup (10 minutes)

### 3.1 Create Slack App
- [ ] Go to https://api.slack.com/apps
- [ ] Click "Create New App" → "From scratch"
- [ ] App name: "KI Agentur Leads"
- [ ] Select your workspace
- [ ] Click "Create App"

### 3.2 Configure Permissions
- [ ] Go to "OAuth & Permissions"
- [ ] Under "Bot Token Scopes", add:
  - [ ] chat:write
  - [ ] channels:read
- [ ] Click "Install to Workspace"
- [ ] Authorize the app
- [ ] Copy "Bot User OAuth Token" (starts with xoxb-)
- [ ] Save to safe place

### 3.3 Get Channel IDs
- [ ] In Slack, right-click #sales-alerts channel
- [ ] Select "View details" or "Copy channel ID"
- [ ] Save as `SLACK_CHANNEL_ID`
- [ ] Do same for #team-updates or #general
- [ ] Save as `SLACK_TEAM_CHANNEL_ID`

### 3.4 Connect Slack to n8n
- [ ] In n8n, click either Slack notification node
- [ ] Click "Create New" next to Slack credentials
- [ ] Paste Bot Token from 3.2
- [ ] Click "Create Credential"
- [ ] Select the credential
- [ ] For "Channel", enter channel ID (without # symbol)
- [ ] Test with "Test" button
- [ ] Repeat for second Slack node with different channel
- [ ] Save both nodes

---

## Phase 4: Email Service Setup (10 minutes)

### Option A: Resend (Recommended)

- [ ] Go to https://resend.com
- [ ] Sign up with email
- [ ] Go to "API Keys"
- [ ] Create new API key
- [ ] Copy key (format: re_XXXXXXXXXXXX)
- [ ] Save to safe place
- [ ] In n8n email nodes, update credentials with this key

### Option B: Gmail

- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Select "Mail" and "Windows Computer"
- [ ] Copy 16-character password
- [ ] In n8n, create Gmail credential with password
- [ ] Select credential in all email nodes

### Email Nodes Configuration
- [ ] In n8n, click "Send Hot Lead Email" node
- [ ] Configure email service credentials
- [ ] Verify "To" field is: `{{ $json.email }}`
- [ ] Repeat for "Send Warm Lead Email" node
- [ ] Repeat for "Send Cold Lead Email" node
- [ ] Test with "Test" button on each

---

## Phase 5: Website Integration (15 minutes)

### 5.1 Update Website Code
- [ ] Open `/website/src/app/api/contact/route.ts`
- [ ] Verify the n8n webhook integration is uncommented (lines 86-104)
- [ ] Check the code is implemented correctly:
  ```typescript
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      });
      ...
    } catch (error) {
      console.error('Failed to send to n8n workflow:', ...);
    }
  }
  ```

### 5.2 Set Environment Variable
- [ ] Add to website `.env.local`:
  ```env
  N8N_WEBHOOK_URL=https://n8n.cloud/webhook/ki-agentur-leads
  ```
  (Replace with your actual webhook URL from Phase 1.3)

### 5.3 Deploy Website
- [ ] Run: `npm run build` (verify no errors)
- [ ] Deploy to production
- [ ] Verify deployment successful
- [ ] Test that website contact form still works

---

## Phase 6: Final Configuration (10 minutes)

### 6.1 Add n8n Environment Variables
- [ ] In n8n workflow settings, go to "Environment Variables"
- [ ] Add these (copy from phases above):
  ```env
  AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
  AIRTABLE_TOKEN=keyXXXXXXXXXXXXXX
  SLACK_CHANNEL_ID=C1234567890
  SLACK_TEAM_CHANNEL_ID=C0987654321
  EMAIL_SERVICE_API=https://api.resend.com/emails
  EMAIL_API_KEY=re_XXXXXXXXXXXX
  ```

### 6.2 Activate Workflow
- [ ] In n8n workflow, toggle "Active" in top right
- [ ] Workflow is now LIVE

### 6.3 Test All Integrations
- [ ] Click "Test" button on Airtable node → should succeed
- [ ] Click "Test" button on Slack nodes → should send test messages
- [ ] Click "Test" button on Email nodes → should send test emails

---

## Phase 7: Testing & Validation (15 minutes)

### 7.1 Test Hot Lead
- [ ] Submit contact form with:
  ```
  Name: Maria Schmidt
  Email: test-hot@example.com
  Company: TechCore GmbH
  Budget: 100-250k
  Message: "We're a mid-size company with 150 employees looking to
           automate customer service ASAP. We have €150K budget.
           We already use some automation tools."
  ```
- [ ] Verify:
  - [ ] Email received with "Schedule Your Free Consultation"
  - [ ] Slack hot lead alert sent to #sales-alerts
  - [ ] Lead appears in Airtable with score 120+
  - [ ] Tier = "Hot Lead - Sales Call"

### 7.2 Test Warm Lead
- [ ] Submit form with:
  ```
  Name: Klaus Weber
  Email: test-warm@example.com
  Company: FinanceFlow AG
  Budget: 50-100k
  Message: "We have 45 people and interested in automation for reporting.
           Budget around €80K. Looking at Q1 next year."
  ```
- [ ] Verify:
  - [ ] Email received with "How We Helped Companies Like Yours"
  - [ ] NO hot lead alert (only team notification)
  - [ ] Lead in Airtable with score 60-89
  - [ ] Tier = "Warm Lead - Email Nurture"

### 7.3 Test Cold Lead
- [ ] Submit form with:
  ```
  Name: Jana Müller
  Email: test-cold@example.com
  Company: LocalShop Solutions
  Message: "Small e-commerce company (8 people) just exploring.
           No rush, just learning what's possible."
  ```
- [ ] Verify:
  - [ ] Email received with "Stay Updated" newsletter
  - [ ] NO alerts (quiet routing for cold)
  - [ ] Lead in Airtable with score < 60
  - [ ] Tier = "Cold Lead - Newsletter"

### 7.4 Verify Airtable Records
- [ ] All 3 test leads appear in Airtable
- [ ] Scores calculated correctly
- [ ] All fields populated
- [ ] Status = "New"

### 7.5 Check n8n Logs
- [ ] Go to n8n workflow executions
- [ ] Verify last 3 executions (one per test) all succeeded
- [ ] No red error nodes
- [ ] All nodes executed in correct order

---

## Phase 8: Team Training (20 minutes)

### 8.1 Sales Team
- [ ] Show Airtable lead view
- [ ] Explain: New → In Progress → Qualified → Won/Lost
- [ ] Show Slack hot lead alerts
- [ ] Explain: Call within 4 hours
- [ ] Show email templates
- [ ] Share scoring criteria document

### 8.2 Marketing Team
- [ ] Show lead distribution by tier
- [ ] Explain: Monitor email open rates
- [ ] Show email analytics if available
- [ ] Discuss: Weekly lead source quality review

### 8.3 Management
- [ ] Show dashboard metrics:
  - [ ] Leads per month (trend)
  - [ ] % by tier (should be ~5-10% hot)
  - [ ] Conversion rate by tier
  - [ ] Average deal size by tier
- [ ] Discuss: Monthly optimization cycle

### 8.4 All Team
- [ ] Live demo: Submit contact form
- [ ] Show: Email received → Airtable saved → Slack notified
- [ ] Q&A: Address questions
- [ ] Distribute documentation files

---

## Phase 9: Go-Live (5 minutes)

### 9.1 Final Checks
- [ ] Website deployed with webhook code
- [ ] n8n workflow is Active
- [ ] All integrations tested and working
- [ ] Team trained on new process
- [ ] Airtable base is ready
- [ ] Slack channels are configured

### 9.2 Announcement
- [ ] Send team email: "Lead qualification automation is LIVE"
- [ ] Include link to LEAD-QUALIFICATION-README.md
- [ ] Share Slack channel info
- [ ] Announce: "Starting today, all website leads are auto-qualified"

### 9.3 Monitor First Hour
- [ ] Refresh Airtable every 5 minutes
- [ ] Check Slack for alerts
- [ ] Watch n8n execution logs
- [ ] Be ready to debug if issues arise

### 9.4 Monitor First Day
- [ ] Track: How many leads submitted?
- [ ] Verify: All appeared in Airtable?
- [ ] Check: All emails sent successfully?
- [ ] Confirm: Team received Slack notifications?

---

## Post-Deployment: First Week

### Daily
- [ ] Sales team reviews hot leads (morning)
- [ ] Check Slack alerts working
- [ ] Verify emails being sent
- [ ] Monitor n8n execution logs for errors

### Weekly
- [ ] Team meeting: Review leads submitted
- [ ] Discuss: Any scoring issues?
- [ ] Check: Email open rates
- [ ] Verify: Airtable updates happening

### After 1 Week
- [ ] Gather feedback from team
- [ ] Fix any issues found
- [ ] Adjust email templates if needed
- [ ] Prepare first monthly report

---

## Post-Deployment: Monthly Operations

### First of Month
- [ ] Analyze lead scoring accuracy
- [ ] Review conversion rates by tier
- [ ] Check email template performance
- [ ] Identify any scoring adjustments needed

### Third Friday
- [ ] Sales team reports: # leads, conversion %, pipeline value
- [ ] Marketing team reports: lead source quality, email metrics
- [ ] Discuss: Any process improvements?

### Last Week
- [ ] Implement scoring adjustments (if any)
- [ ] Update email templates (if needed)
- [ ] Plan next month optimizations
- [ ] Document lessons learned

---

## Troubleshooting During Deployment

### Airtable Connection Fails
1. Check token hasn't expired
2. Verify Base ID is correct
3. Ensure table name is exactly "Leads"
4. Check token has correct scopes

### Slack Alerts Not Sending
1. Verify Bot Token is correct format (starts with xoxb-)
2. Check channel ID is correct (starts with C)
3. Confirm bot is in the channel
4. Check bot has chat:write permission

### Emails Not Sending
1. Verify email service credentials are correct
2. Check "From" email is registered with service
3. Test email service independently
4. Check spam folder

### Webhook Not Receiving
1. Verify N8N_WEBHOOK_URL matches workflow
2. Check website deployed with updated code
3. Verify n8n workflow is Active
4. Test webhook manually with curl

### Leads Not Getting Scored
1. Check "Lead Scoring Engine" node for JavaScript errors
2. Verify test lead has budget value
3. Review n8n execution logs
4. Check message field is being parsed

---

## Success Indicators

You're done when you see:

✓ First hot lead comes in, gets Slack alert within 30 seconds
✓ Lead appears in Airtable with correct score and tier
✓ Email is sent to lead within 1 minute
✓ Sales team gets Slack notification
✓ All 3 test leads show in Airtable with correct data
✓ Team reports: "System is working as expected"

---

## Rollback Plan

If something goes wrong:

1. **Disable n8n workflow**: Toggle "Active" to OFF
2. **Contact form still works**: No downtime to users
3. **No leads routed**: They go to manual admin email only
4. **Manually create Airtable records**: For any missed leads
5. **Fix the issue**: Debug with n8n logs
6. **Re-activate workflow**: When ready

This means the system can be disabled in 5 seconds with zero impact to users.

---

## Sign-Off

- [ ] Deployment lead: _________________ Date: _____
- [ ] Sales team manager: _________________ Date: _____
- [ ] DevOps/Engineering: _________________ Date: _____
- [ ] Product owner: _________________ Date: _____

---

## Contact for Support

- **n8n Issues**: Check logs, contact n8n community: https://community.n8n.io
- **Airtable Issues**: https://support.airtable.com
- **Integration Questions**: Review lead-automation-setup-guide.md
- **Scoring Questions**: Review lead-scoring-criteria.md
- **Email Questions**: Review lead-email-templates.md

**Next Review**: 1 month after deployment (monthly optimization cycle)

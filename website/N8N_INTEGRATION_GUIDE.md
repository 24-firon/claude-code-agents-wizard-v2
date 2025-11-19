# n8n Integration Guide for KI Agentur

## Overview

This guide explains how to integrate the KI Agentur backend API with n8n for CRM automation and lead management.

## Why n8n?

- **Visual Workflow Builder**: No-code automation
- **Self-Hosted or Cloud**: Full control over your data
- **300+ Integrations**: Connect to any CRM, email platform, or service
- **Technical Credibility**: Shows we use the tools we recommend

## Integration Points

### 1. Contact Form → CRM

**Flow**: Website Contact Form → n8n → CRM (HubSpot/Pipedrive/Airtable)

```
┌──────────────┐
│ Website Form │
│ (POST /api/  │
│  contact)    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ n8n Webhook  │
│ Trigger      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Filter &     │
│ Validate     │
└──────┬───────┘
       │
       ├─────────────────┐
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Create CRM   │  │ Send Slack   │
│ Contact      │  │ Notification │
└──────┬───────┘  └──────────────┘
       │
       ▼
┌──────────────┐
│ Tag with     │
│ "Website"    │
│ source       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Trigger      │
│ Email        │
│ Sequence     │
└──────────────┘
```

### 2. Newsletter → Email Platform

**Flow**: Newsletter Signup → n8n → ConvertKit/Mailchimp

### 3. Calendly Booking → CRM + Calendar

**Flow**: Calendly → n8n → CRM + Google Calendar + Team Notification

---

## Setup Instructions

### Step 1: Create n8n Workflow

1. **Create New Workflow** in n8n
2. **Name**: "KI Agentur - Contact Form to CRM"
3. **Add Webhook Trigger Node**

### Step 2: Configure Webhook Trigger

**Node Settings**:
- **Webhook URLs**: Production
- **HTTP Method**: POST
- **Path**: `/webhook/contact`
- **Authentication**: None (we validate on API side)

**Full Webhook URL**:
```
https://your-n8n-instance.com/webhook/contact
```

Save this URL to use in environment variables.

### Step 3: Add Validation Node (Function)

**Purpose**: Additional validation and data transformation

**Code Example**:
```javascript
// Access webhook data
const data = $input.first().json;

// Validate required fields
if (!data.email || !data.name || !data.company) {
  throw new Error('Missing required fields');
}

// Transform data for CRM
return {
  json: {
    email: data.email.toLowerCase(),
    name: data.name,
    company: data.company,
    message: data.message,
    budget: data.budget || 'Not specified',
    source: 'Website Contact Form',
    leadScore: calculateLeadScore(data),
    timestamp: new Date().toISOString()
  }
};

// Lead scoring function
function calculateLeadScore(data) {
  let score = 50; // Base score

  // Budget influence
  if (data.budget === '250k+') score += 30;
  else if (data.budget === '100-250k') score += 20;
  else if (data.budget === '50-100k') score += 10;

  // Message length (engagement indicator)
  if (data.message.length > 200) score += 10;

  // Company size (if you add this field)
  if (data.companySize === 'enterprise') score += 20;

  return score;
}
```

### Step 4: Add CRM Node

#### Option A: HubSpot

**Node**: HubSpot
**Operation**: Create Contact
**Resource**: Contact

**Field Mapping**:
```
Email: {{ $json.email }}
First Name: {{ $json.name.split(' ')[0] }}
Last Name: {{ $json.name.split(' ').slice(1).join(' ') }}
Company: {{ $json.company }}
Lead Source: {{ $json.source }}
Lead Score: {{ $json.leadScore }}

# Custom Properties
Budget Range: {{ $json.budget }}
Initial Message: {{ $json.message }}
```

#### Option B: Pipedrive

**Node**: Pipedrive
**Operation**: Create Person

**Field Mapping**:
```
Name: {{ $json.name }}
Email: {{ $json.email }}
Organization: {{ $json.company }}

# Custom Fields
Lead Source: {{ $json.source }}
Budget: {{ $json.budget }}
Lead Score: {{ $json.leadScore }}
```

#### Option C: Airtable

**Node**: Airtable
**Operation**: Create Record
**Table**: Leads

**Field Mapping**:
```
Name: {{ $json.name }}
Email: {{ $json.email }}
Company: {{ $json.company }}
Message: {{ $json.message }}
Budget: {{ $json.budget }}
Source: {{ $json.source }}
Lead Score: {{ $json.leadScore }}
Created: {{ $json.timestamp }}
Status: "New"
```

### Step 5: Add Notification Node (Slack)

**Node**: Slack
**Operation**: Send Message
**Channel**: #leads or #sales

**Message Template**:
```
🎯 *New Lead from Website!*

*Name:* {{ $json.name }}
*Company:* {{ $json.company }}
*Email:* {{ $json.email }}
*Budget:* {{ $json.budget }}
*Lead Score:* {{ $json.leadScore }}/100

*Message:*
{{ $json.message }}

*Added to CRM:* ✅
<Link to CRM contact>
```

### Step 6: Add Email Sequence Trigger (Optional)

**Node**: HTTP Request or CRM-specific node

**Purpose**: Trigger automated follow-up email sequence

---

## Environment Variables Setup

### Backend (.env.local)

```bash
# Add n8n webhook URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/contact
N8N_NEWSLETTER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/newsletter
```

### Backend Code Integration

**In `/api/contact/route.ts`**, uncomment:

```typescript
// Send to n8n for CRM integration
try {
  await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...sanitizedData,
      source: 'website',
      timestamp: new Date().toISOString(),
    }),
  });
} catch (error) {
  // Log but don't fail the request
  console.error('n8n webhook failed:', error);
}
```

---

## Testing

### Test Webhook

**Using cURL**:
```bash
curl -X POST https://your-n8n-instance.com/webhook/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Corp",
    "message": "This is a test",
    "budget": "50-100k",
    "source": "website",
    "timestamp": "2025-11-19T12:00:00Z"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Webhook received"
}
```

### Test Full Flow

1. **Submit contact form** on website
2. **Check n8n execution log** (should show successful run)
3. **Verify CRM** (new contact should be created)
4. **Check Slack** (notification should appear)
5. **Check email** (confirmation sent to user, notification sent to admin)

---

## Advanced Workflows

### Workflow 1: Lead Scoring & Routing

```
Webhook → Calculate Lead Score → Route by Score
                                    │
                ┌───────────────────┼───────────────────┐
                ▼                   ▼                   ▼
            High Score          Medium Score        Low Score
            (80-100)            (50-79)             (0-49)
                │                   │                   │
                ▼                   ▼                   ▼
         Assign to Senior    Assign to Junior    Add to Nurture
         Sales Rep           Sales Rep           Campaign
```

### Workflow 2: Duplicate Detection

```
Webhook → Check if Email Exists in CRM
             │
             ├─ Yes → Update existing contact
             │         Add note about new inquiry
             │
             └─ No → Create new contact
                      Send welcome email
```

### Workflow 3: Multi-Channel Follow-up

```
CRM Contact Created → Wait 1 hour → Send Follow-up Email
                                   → Wait 2 days → Send LinkedIn Message
                                   → Wait 1 week → Schedule Call
```

---

## Monitoring & Maintenance

### n8n Monitoring

**Check Regularly**:
- Execution history (success/failure rate)
- Error logs
- Webhook response times
- CRM sync status

**Set Up Alerts**:
- Workflow failure → Slack/Email notification
- Webhook timeout → Alert to DevOps
- CRM quota exceeded → Alert to team

### Performance Optimization

**Best Practices**:
- Keep workflows simple and focused
- Use batch operations when possible
- Add error handling to all nodes
- Implement retry logic (n8n has built-in)
- Cache CRM lookups to reduce API calls

---

## Troubleshooting

### Webhook Not Receiving Data

**Check**:
1. n8n workflow is activated
2. Webhook URL is correct in `.env.local`
3. n8n instance is accessible from internet
4. Firewall allows incoming webhooks

### CRM Integration Failing

**Check**:
1. CRM API credentials are valid
2. CRM API rate limits not exceeded
3. Required fields in CRM are populated
4. Field mappings match CRM schema

### Data Not Syncing

**Check**:
1. n8n execution log for errors
2. CRM API response codes
3. Field validation in CRM
4. Duplicate detection rules in CRM

---

## Security Considerations

### Webhook Security

**Current**:
- No authentication on n8n webhook (validated on API side)
- HTTPS required
- Rate limiting on API prevents abuse

**Enhanced Security (Optional)**:
```javascript
// Add to n8n webhook validation
const signature = $node["Webhook"].context.headers['x-ki-agentur-signature'];
const secret = $credentials.webhookSecret;

// Verify HMAC signature
const crypto = require('crypto');
const hash = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify($input.first().json))
  .digest('hex');

if (hash !== signature) {
  throw new Error('Invalid signature');
}
```

### Data Privacy

**GDPR Compliance**:
- Store minimal data in n8n
- Set data retention policies in CRM
- Log data access and processing
- Provide data deletion mechanism

---

## Cost Considerations

### n8n Cloud Pricing

- **Starter**: €20/month (5k executions)
- **Pro**: €50/month (50k executions)
- **Self-Hosted**: Free (infrastructure costs only)

### CRM API Limits

**HubSpot Free**:
- 10k API calls/day
- 100 calls/10 seconds

**Pipedrive**:
- Varies by plan
- Typically 10k-100k calls/day

**Airtable**:
- 5 requests/second per base
- 100k records per base

---

## Next Steps

1. ✅ Set up n8n instance (cloud or self-hosted)
2. ✅ Create contact form workflow
3. ✅ Configure CRM integration
4. ✅ Test end-to-end flow
5. ✅ Set up monitoring and alerts
6. ✅ Create newsletter workflow
7. ✅ Create Calendly booking workflow
8. ✅ Implement lead scoring logic
9. ✅ Set up automated follow-up sequences

---

## Support

**n8n Documentation**: https://docs.n8n.io
**n8n Community**: https://community.n8n.io
**KI Agentur Support**: team@kiagentur.com

---

## Conclusion

This n8n integration provides a powerful, flexible automation layer between your website and CRM, enabling:

- **Automated lead capture** from website
- **Intelligent lead routing** based on score
- **Multi-channel notifications** to team
- **Email marketing automation**
- **Calendar booking management**

Built with the same tools we recommend to clients! 🚀

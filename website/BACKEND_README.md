# KI Agentur Backend API Documentation

## Overview

This document covers the backend API routes, integrations, and security measures for the KI Agentur marketing website.

## Technology Stack

- **Framework**: Next.js 14+ App Router with API Routes (serverless functions)
- **Runtime**: Node.js 18+
- **Validation**: Zod for type-safe schema validation
- **Email Service**: Resend for transactional emails
- **Type Safety**: TypeScript strict mode

## Architecture

```
src/
├── app/
│   └── api/                      # API Routes (Next.js App Router)
│       ├── contact/              # Contact form submission
│       │   └── route.ts
│       ├── subscribe/            # Newsletter subscription
│       │   └── route.ts
│       └── webhooks/             # External service webhooks
│           ├── sanity/           # CMS content updates
│           │   └── route.ts
│           └── calendly/         # Calendar bookings
│               └── route.ts
│
└── lib/                          # Backend utilities and services
    ├── validation/               # Zod validation schemas
    │   └── schemas.ts
    ├── email/                    # Email service and templates
    │   ├── service.ts
    │   └── templates.tsx
    └── utils/                    # Utility functions
        ├── rate-limit.ts         # Rate limiting
        ├── sanitize.ts           # Input sanitization
        └── errors.ts             # Error handling
```

## API Routes

### 1. Contact Form API

**Endpoint**: `POST /api/contact`

**Purpose**: Handle contact form submissions with validation, email notifications, and CRM integration.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "company": "Tech Corp",
  "message": "We need AI automation for our platform",
  "budget": "100-250k"  // Optional: "<50k" | "50-100k" | "100-250k" | "250k+"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "contactId": "email-id-123",
    "message": "Thank you for contacting us. We will respond within 24 hours."
  },
  "message": "Contact form submitted successfully"
}
```

**Error Response** (400):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address",
        "code": "invalid_string"
      }
    ]
  }
}
```

**Rate Limit**: 5 requests per 15 minutes per IP

**Security Features**:
- Zod schema validation
- Input sanitization (XSS prevention)
- SQL injection detection
- Rate limiting
- CORS protection

**Email Notifications**:
1. Confirmation email sent to user
2. Admin notification sent to team

---

### 2. Newsletter Subscription API

**Endpoint**: `POST /api/subscribe`

**Purpose**: Handle newsletter signups with double opt-in.

**Request Body**:
```json
{
  "email": "user@example.com",
  "interests": ["ai-automation", "n8n", "claude"]  // Optional
}
```

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "subscriptionId": "email-id-456",
    "email": "user@example.com",
    "message": "Thank you for subscribing! Check your email for confirmation."
  },
  "message": "Newsletter subscription successful"
}
```

**Rate Limit**: 3 requests per 15 minutes per IP

**Email Notifications**:
- Welcome email sent to subscriber

---

### 3. Sanity Webhook

**Endpoint**: `POST /api/webhooks/sanity`

**Purpose**: Receive content update notifications from Sanity CMS and trigger rebuilds.

**Security**:
- HMAC-SHA256 signature verification
- Signature sent in `x-sanity-signature` header

**Webhook Configuration** (in Sanity):
```
URL: https://kiagentur.com/api/webhooks/sanity
Secret: [your-webhook-secret]
Triggers: Create, Update, Delete
Document Types: post, caseStudy, team
```

**Example Payload**:
```json
{
  "_id": "post-123",
  "_type": "post",
  "_operation": "update",
  "slug": {
    "current": "advanced-n8n-patterns"
  },
  "title": "Advanced n8n Workflow Patterns"
}
```

---

### 4. Calendly Webhook

**Endpoint**: `POST /api/webhooks/calendly`

**Purpose**: Receive booking notifications and create CRM entries.

**Security**:
- HMAC-SHA256 signature verification
- Signature sent in `calendly-webhook-signature` header
- Timestamp sent in `calendly-webhook-timestamp` header

**Supported Events**:
- `invitee.created` - New booking created
- `invitee.canceled` - Booking canceled

**Example Payload** (invitee.created):
```json
{
  "event": "invitee.created",
  "event_type": "invitee.created",
  "payload": {
    "invitee": {
      "name": "Jane Smith",
      "email": "jane@company.com",
      "timezone": "Europe/Berlin"
    },
    "scheduled_event": {
      "name": "Strategy Consultation",
      "start_time": "2025-12-01T10:00:00Z",
      "end_time": "2025-12-01T11:00:00Z",
      "location": {
        "join_url": "https://meet.google.com/abc-xyz"
      }
    }
  }
}
```

---

## Environment Variables

### Required Variables

```bash
# Email Service (Resend)
RESEND_API_KEY=re_123456789
FROM_EMAIL=hello@kiagentur.com
ADMIN_EMAIL=team@kiagentur.com
REPLY_TO_EMAIL=hello@kiagentur.com

# Webhook Secrets
SANITY_WEBHOOK_SECRET=your-secure-webhook-secret
CALENDLY_WEBHOOK_SECRET=your-calendly-webhook-secret
```

### Optional Variables

```bash
# n8n Workflow Automation
N8N_WEBHOOK_URL=https://n8n.kiagentur.com/webhook/contact
N8N_NEWSLETTER_WEBHOOK_URL=https://n8n.kiagentur.com/webhook/newsletter

# Email Marketing Platform (ConvertKit)
CONVERTKIT_API_KEY=your-api-key
CONVERTKIT_FORM_ID=your-form-id

# CRM Integration (HubSpot or Pipedrive)
HUBSPOT_API_KEY=your-hubspot-key
PIPEDRIVE_API_TOKEN=your-pipedrive-token
```

### Generating Secure Secrets

```bash
# Generate webhook secret
openssl rand -base64 32

# Example output:
# dGhpcyBpcyBhIHNlY3VyZSBzZWNyZXQK
```

---

## Security Features

### 1. Input Validation

**Zod Schema Validation**:
- All API routes validate input with strict Zod schemas
- Type-safe validation with automatic TypeScript types
- Detailed error messages for validation failures

**Example**:
```typescript
import { contactFormSchema } from '@/lib/validation/schemas';

// Validate and throw on error
const validatedData = contactFormSchema.parse(body);
```

### 2. Input Sanitization

**XSS Prevention**:
- HTML tags stripped from all text inputs
- Dangerous characters removed
- Control characters filtered

**SQL Injection Detection**:
- Pattern matching for SQL keywords
- Automatic blocking of suspicious content

**Example**:
```typescript
import { sanitizeFormInput, validateInputSafety } from '@/lib/utils/sanitize';

const sanitized = sanitizeFormInput(userInput, 'text');
validateInputSafety(sanitized, 'fieldName'); // Throws if suspicious
```

### 3. Rate Limiting

**Simple In-Memory Rate Limiting**:
- 5 requests per 15 minutes for contact form
- 3 requests per 15 minutes for newsletter
- IP-based identification
- Automatic cleanup of expired entries

**Note**: For production with multiple serverless instances, consider upgrading to Redis or Vercel Edge Config.

**Example**:
```typescript
import { checkRateLimit, RATE_LIMITS } from '@/lib/utils/rate-limit';

const result = checkRateLimit(ipAddress, RATE_LIMITS.CONTACT_FORM);
if (!result.allowed) {
  return handleRateLimitError(result.resetTime);
}
```

### 4. CORS Protection

**Configuration**:
- Restricted to allowed origins
- Preflight requests handled with OPTIONS
- Credentials allowed for authenticated requests

### 5. Webhook Security

**Signature Verification**:
- HMAC-SHA256 signature verification for all webhooks
- Prevents unauthorized webhook calls
- Protects against replay attacks (with timestamp)

**Example**:
```typescript
import { createHmac } from 'crypto';

function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return hash === signature;
}
```

### 6. Error Handling

**Secure Error Responses**:
- Generic error messages to clients (no internal details exposed)
- Detailed logging server-side for debugging
- Consistent error response format
- Security event logging for monitoring

**Example**:
```typescript
import { safeErrorHandler } from '@/lib/utils/errors';

try {
  // API logic
} catch (error) {
  return safeErrorHandler(error); // Safe, consistent error response
}
```

---

## Email Service

### Resend Integration

**Features**:
- React email templates
- Type-safe email composition
- Delivery tracking
- Error handling and retries

**Email Templates**:

1. **Contact Confirmation** (`ContactConfirmation`)
   - Sent to user after form submission
   - Branded with KI Agentur colors
   - Sets expectation for response time

2. **Admin Notification** (`AdminNotification`)
   - Sent to team when contact form submitted
   - Includes all lead details
   - Quick reply CTA

3. **Newsletter Welcome** (`NewsletterWelcome`)
   - Sent after newsletter subscription
   - Explains what subscribers will receive
   - Unsubscribe information

**Example Usage**:
```typescript
import { sendContactConfirmation } from '@/lib/email/service';

await sendContactConfirmation({
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Tech Corp',
  message: '...',
});
```

---

## Testing

### Manual Testing

**Contact Form**:
```bash
curl -X POST https://kiagentur.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Corp",
    "message": "This is a test message",
    "budget": "50-100k"
  }'
```

**Newsletter Subscription**:
```bash
curl -X POST https://kiagentur.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "interests": ["ai-automation"]
  }'
```

### Rate Limit Testing

```bash
# Should succeed 5 times, then fail with 429
for i in {1..6}; do
  curl -X POST https://kiagentur.com/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","company":"Test","message":"Test message"}'
  echo ""
done
```

---

## Integration Guidelines

### CRM Integration (via n8n)

**Recommended Approach**:
1. Create n8n workflow with webhook trigger
2. Configure webhook URL in environment variables
3. Add CRM node (HubSpot, Pipedrive, Airtable)
4. Map fields from webhook to CRM

**Example n8n Workflow**:
```
Webhook Trigger
  ↓
Filter (validate data)
  ↓
CRM Node (create contact)
  ↓
Email Node (send notification)
```

**Webhook Payload**:
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "company": "Tech Corp",
  "message": "...",
  "budget": "100-250k",
  "source": "website",
  "timestamp": "2025-11-19T12:00:00Z"
}
```

### Email Platform Integration (ConvertKit)

**Newsletter Subscription**:
```typescript
// In /api/subscribe/route.ts
await fetch(
  `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.CONVERTKIT_API_KEY,
      email: sanitizedEmail,
      tags: validatedData.interests,
    }),
  }
);
```

---

## Performance Considerations

### Serverless Functions

**Cold Starts**:
- Functions may take 1-2 seconds on first invocation
- Subsequent requests are faster (warm state)
- Keep functions lightweight

**Timeout**:
- Default: 10 seconds (Vercel free tier)
- Pro: 60 seconds
- Enterprise: 900 seconds

**Best Practices**:
- Minimize dependencies
- Use connection pooling for databases
- Cache external API responses
- Implement retry logic with exponential backoff

### Rate Limiting

**Current Implementation**:
- In-memory store (simple but limited)
- Resets on cold starts
- Not shared across serverless instances

**Production Upgrade**:
- Use Redis for distributed rate limiting
- Use Vercel Edge Config for global state
- Implement sliding window algorithm

---

## Monitoring and Logging

### Logging

**What's Logged**:
- All API requests (success and failure)
- Rate limit violations
- Security events (suspicious input)
- Email send results
- Webhook receptions

**What's NOT Logged**:
- User passwords (N/A for this site)
- Full email addresses in production logs
- Sensitive form data (sanitized before logging)

### Recommended Monitoring Tools

1. **Vercel Analytics** (built-in)
   - Function invocations
   - Error rates
   - Execution duration

2. **Sentry** (optional)
   - Error tracking
   - Performance monitoring
   - User session replay

3. **Plausible Analytics** (privacy-first)
   - Page views
   - Event tracking
   - Conversion goals

---

## Deployment

### Vercel Deployment

**Automatic Deployment**:
1. Push to `main` branch on GitHub
2. Vercel automatically builds and deploys
3. Environment variables from Vercel dashboard
4. Instant rollback if needed

**Environment Variables Setup**:
1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Add all variables from `.env.example`
4. Redeploy for changes to take effect

**Deployment Checklist**:
- [ ] All environment variables configured
- [ ] Resend API key valid
- [ ] Webhook secrets generated and configured
- [ ] Email addresses verified in Resend
- [ ] Test contact form in production
- [ ] Test newsletter subscription in production
- [ ] Verify rate limiting works
- [ ] Check email delivery
- [ ] Monitor error logs

---

## Troubleshooting

### Contact Form Not Working

**Check**:
1. `RESEND_API_KEY` is set correctly
2. `FROM_EMAIL` is verified in Resend dashboard
3. Rate limit not exceeded (check headers)
4. No validation errors in request body
5. Check Vercel function logs for errors

### Emails Not Sending

**Check**:
1. Resend API key is valid (test with Resend dashboard)
2. `FROM_EMAIL` is verified (Resend requires verification)
3. Recipient email is valid
4. Check Resend dashboard for delivery status
5. Check spam folder

### Rate Limiting Too Strict

**Adjust**:
```typescript
// In src/lib/utils/rate-limit.ts
export const RATE_LIMITS = {
  CONTACT_FORM: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // Increase from 5 to 10
  },
};
```

### Webhook Signature Verification Failing

**Check**:
1. Webhook secret matches in both places
2. Request body is raw (not parsed before verification)
3. Signature header is present
4. Hash algorithm matches (SHA-256)

---

## Future Enhancements

### Phase 2 Features

1. **CRM Direct Integration**
   - Direct API calls to HubSpot/Pipedrive
   - Bidirectional sync
   - Lead scoring automation

2. **Advanced Rate Limiting**
   - Redis-based distributed rate limiting
   - Sliding window algorithm
   - Per-user rate limits (if authentication added)

3. **Email Marketing Automation**
   - Drip campaigns
   - Behavioral triggers
   - A/B testing

4. **Analytics Dashboard**
   - Real-time lead dashboard
   - Conversion funnel visualization
   - ROI tracking

5. **Multi-language Support**
   - Email templates in German
   - Form validation messages in German
   - Localized error messages

---

## Support

**For questions or issues**:
- Review this documentation
- Check Vercel function logs
- Contact: team@kiagentur.com

**Related Documentation**:
- [Architecture Document](/architecture-ki-agentur.md)
- [PRD](/prd-ki-agentur.md)
- [API Design](/architecture-ki-agentur.md#4-api-architecture)

---

## License

© 2025 KI Agentur. All rights reserved.

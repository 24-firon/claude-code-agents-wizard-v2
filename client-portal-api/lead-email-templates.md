# KI Agentur Lead Email Templates

Three customized email templates for hot, warm, and cold leads. These templates are automatically selected based on lead qualification score.

---

## 1. HOT LEAD EMAIL TEMPLATE

**Subject:** Schedule Your Free AI Automation Consultation

**When Used:** Score 90-165 points (Hot leads)

**Goal:** Immediate calendar booking + urgency + value prop

**Send Time:** Within 15 minutes of form submission

**Follow-up:** Calendar reminder email, phone call if no booking within 24h

---

### HTML Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.95;
    }
    .content {
      padding: 30px 20px;
    }
    .greeting {
      font-size: 16px;
      color: #1a1a1a;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }
    .value-prop {
      background-color: #f0f6ff;
      border-left: 4px solid #0066ff;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      line-height: 1.6;
    }
    .benefits {
      margin: 20px 0;
      font-size: 14px;
      color: #555;
    }
    .benefits ul {
      margin: 0;
      padding-left: 20px;
    }
    .benefits li {
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .cta-button {
      display: inline-block;
      background-color: #0066ff;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      margin: 25px 0;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .cta-button:hover {
      background-color: #0052cc;
    }
    .cta-text {
      text-align: center;
      margin: 20px 0;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      font-size: 12px;
      color: #666;
      text-align: center;
      border-top: 1px solid #e0e0e0;
    }
    .footer a {
      color: #0066ff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Fast-Track Your AI Automation Project</h1>
      <p>Let's explore the right solution for {{name}}'s team</p>
    </div>

    <div class="content">
      <p class="greeting">Hi {{name}},</p>

      <p>Thank you for reaching out to KI Agentur! We're thrilled that {{company}} is ready to transform operations with AI automation.</p>

      <div class="value-prop">
        <strong>Here's what makes this the right moment:</strong><br>
        You've got the right team size, clear budget, and urgent timeline. That's the perfect combination for a successful AI automation rollout. We've helped companies like yours achieve measurable results in 6-12 weeks.
      </div>

      <p>Rather than back-and-forth emails, let's jump on a quick 20-minute call to discuss:</p>

      <div class="benefits">
        <ul>
          <li><strong>Your specific automation priorities</strong> - What's the biggest bottleneck?</li>
          <li><strong>Current tech stack</strong> - How does it integrate with what you have?</li>
          <li><strong>Fast-track timeline</strong> - We can outline your 90-day delivery roadmap</li>
          <li><strong>Realistic ROI</strong> - Cost savings and efficiency gains for {{company}}</li>
        </ul>
      </div>

      <div class="cta-text">
        <a href="{{calendlyUrl}}" class="cta-button">Schedule a 20-Minute Consultation</a>
      </div>

      <p style="font-size: 13px; color: #666; text-align: center;">Slots fill up fast—book now for this week if possible</p>

      <p style="margin-top: 30px; font-size: 14px;">In the meantime, here's what you can expect from our consultation:</p>
      <div class="benefits" style="background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
        <ul style="margin: 0; padding-left: 20px;">
          <li>Assessment of automation opportunities specific to {{company}}'s workflow</li>
          <li>Custom proposal with timeline and investment</li>
          <li>Implementation roadmap—exactly how we'll deliver</li>
          <li>No pressure. Just honest conversation about whether AI automation is right for you.</li>
        </ul>
      </div>

      <p style="margin-top: 25px;">Looking forward to connecting!</p>

      <p>
        <strong>Best,</strong><br>
        KI Agentur Sales Team<br>
        <a href="https://ki-agentur.de" style="color: #0066ff; text-decoration: none;">ki-agentur.de</a>
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        This email was sent because {{company}} submitted a contact form on ki-agentur.de
      </p>
      <p style="margin: 0;">
        <a href="https://ki-agentur.de/contact">Contact Preferences</a> |
        <a href="https://ki-agentur.de/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
```

### Plain Text Fallback

```
Hi {{name}},

Thank you for reaching out to KI Agentur! We're thrilled that {{company}} is ready to transform operations with AI automation.

Here's what makes this the right moment:
You've got the right team size, clear budget, and urgent timeline. That's the perfect combination for a successful AI automation rollout. We've helped companies like yours achieve measurable results in 6-12 weeks.

Rather than back-and-forth emails, let's jump on a quick 20-minute call to discuss:

- Your specific automation priorities — What's the biggest bottleneck?
- Current tech stack — How does it integrate with what you have?
- Fast-track timeline — We can outline your 90-day delivery roadmap
- Realistic ROI — Cost savings and efficiency gains for {{company}}

Book a 20-minute consultation: {{calendlyUrl}}

Slots fill up fast—book now for this week if possible

In the meantime, here's what you can expect:
- Assessment of automation opportunities specific to {{company}}'s workflow
- Custom proposal with timeline and investment
- Implementation roadmap—exactly how we'll deliver
- No pressure. Just honest conversation about whether AI automation is right for you.

Looking forward to connecting!

Best,
KI Agentur Sales Team
ki-agentur.de
```

### Template Variables
```json
{
  "name": "{{name}}",
  "company": "{{company}}",
  "calendlyUrl": "https://calendly.com/ki-agentur/consultation"
}
```

---

## 2. WARM LEAD EMAIL TEMPLATE

**Subject:** How We Helped Companies Like {{company}} Automate with AI

**When Used:** Score 60-89 points (Warm leads)

**Goal:** Educational value + social proof + nurture sequence signup

**Send Time:** Within 1 hour of form submission

**Follow-up:** 3-day nurture sequence, then sales call if no engagement

---

### HTML Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
      color: white;
      padding: 25px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 30px 20px;
    }
    .greeting {
      font-size: 15px;
      color: #1a1a1a;
      margin: 0 0 20px 0;
      line-height: 1.6;
    }
    .case-study {
      background-color: #f0f8fb;
      border-left: 4px solid #00b4db;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      line-height: 1.6;
    }
    .case-study-title {
      font-weight: 600;
      color: #0083b0;
      margin-bottom: 8px;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
      text-align: center;
    }
    .stat {
      flex: 1;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 4px;
      margin: 0 5px;
    }
    .stat-number {
      font-size: 22px;
      font-weight: 700;
      color: #00b4db;
      margin: 0;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
      margin: 5px 0 0 0;
    }
    .benefit-section {
      margin: 20px 0;
      font-size: 14px;
      color: #555;
      line-height: 1.6;
    }
    .benefit-section h3 {
      color: #0083b0;
      font-size: 15px;
      margin: 15px 0 10px 0;
    }
    .benefit-section ul {
      margin: 0;
      padding-left: 20px;
    }
    .benefit-section li {
      margin-bottom: 8px;
    }
    .cta-button {
      display: inline-block;
      background-color: #00b4db;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      margin: 15px 0;
      cursor: pointer;
    }
    .cta-text {
      text-align: center;
      margin: 20px 0;
    }
    .next-steps {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      font-size: 13px;
      color: #555;
      line-height: 1.6;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      font-size: 12px;
      color: #666;
      text-align: center;
      border-top: 1px solid #e0e0e0;
    }
    .footer a {
      color: #00b4db;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>See How Companies Like Yours Automate Faster</h1>
    </div>

    <div class="content">
      <p class="greeting">Hi {{name}},</p>

      <p>Thanks for reaching out! I wanted to share a quick story about a company similar to {{company}} that transformed their operations with AI automation.</p>

      <div class="case-study">
        <div class="case-study-title">Case Study: A Mid-Market Services Company</div>
        <p style="margin: 0;">This team was spending 40+ hours per week on repetitive administrative tasks. By implementing AI-powered workflow automation, they freed up their staff for high-value client work.</p>
      </div>

      <div class="stats">
        <div class="stat">
          <p class="stat-number">40<span style="font-size: 16px;">h</span></p>
          <p class="stat-label">Hours saved weekly</p>
        </div>
        <div class="stat">
          <p class="stat-number">35%</p>
          <p class="stat-label">Cost reduction</p>
        </div>
        <div class="stat">
          <p class="stat-number">8<span style="font-size: 16px;">w</span></p>
          <p class="stat-label">Time to ROI</p>
        </div>
      </div>

      <div class="benefit-section">
        <h3>Why companies choose AI automation (like you're exploring):</h3>
        <ul>
          <li>Reduce manual data entry and repetitive workflows</li>
          <li>Improve accuracy and reduce human errors</li>
          <li>Free up your team for strategic, high-value work</li>
          <li>Scale without proportionally increasing staff</li>
        </ul>
      </div>

      <div class="benefit-section">
        <h3>What typically needs automation first:</h3>
        <ul>
          <li>Data entry and form processing</li>
          <li>Customer service workflows and ticketing</li>
          <li>Report generation and scheduling</li>
          <li>Lead qualification and follow-up</li>
          <li>Document management and approval chains</li>
        </ul>
      </div>

      <p>The good news: most of these have 6-8 week implementation timelines and show ROI quickly.</p>

      <div class="next-steps">
        <strong>Here's what happens next:</strong>
        <ol style="margin: 10px 0; padding-left: 20px;">
          <li>I'll send you a 3-day mini-course on AI automation best practices (totally free)</li>
          <li>You'll see exactly how companies like yours approach automation projects</li>
          <li>If it resonates, we'll jump on a quick call to explore if we're a fit</li>
          <li>Zero pressure—just knowledge to help you make the right decision for {{company}}</li>
        </ol>
      </div>

      <div class="cta-text">
        <a href="https://ki-agentur.de/ai-automation-guide" class="cta-button">Get the AI Automation Guide</a>
      </div>

      <p>In the meantime, feel free to reply with any questions. I'm here to help.</p>

      <p>
        <strong>Best,</strong><br>
        The KI Agentur Team<br>
        <a href="https://ki-agentur.de" style="color: #00b4db; text-decoration: none;">ki-agentur.de</a>
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        This email was sent because {{company}} submitted a contact form on ki-agentur.de
      </p>
      <p style="margin: 0;">
        <a href="https://ki-agentur.de/contact">Update Preferences</a> |
        <a href="https://ki-agentur.de/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
```

### Plain Text Fallback

```
Hi {{name}},

Thanks for reaching out! I wanted to share a quick story about a company similar to {{company}} that transformed their operations with AI automation.

CASE STUDY: A Mid-Market Services Company
This team was spending 40+ hours per week on repetitive administrative tasks. By implementing AI-powered workflow automation, they freed up their staff for high-value client work.

RESULTS:
- 40 hours saved every week
- 35% reduction in operational costs
- ROI achieved in just 8 weeks

Why companies choose AI automation (like you're exploring):
- Reduce manual data entry and repetitive workflows
- Improve accuracy and reduce human errors
- Free up your team for strategic, high-value work
- Scale without proportionally increasing staff

What typically needs automation first:
- Data entry and form processing
- Customer service workflows and ticketing
- Report generation and scheduling
- Lead qualification and follow-up
- Document management and approval chains

The good news: most of these have 6-8 week implementation timelines and show ROI quickly.

HERE'S WHAT HAPPENS NEXT:

1. I'll send you a 3-day mini-course on AI automation best practices (totally free)
2. You'll see exactly how companies like yours approach automation projects
3. If it resonates, we'll jump on a quick call to explore if we're a fit
4. Zero pressure—just knowledge to help you make the right decision for {{company}}

Get the AI Automation Guide:
https://ki-agentur.de/ai-automation-guide

In the meantime, feel free to reply with any questions. I'm here to help.

Best,
The KI Agentur Team
ki-agentur.de
```

### Template Variables
```json
{
  "name": "{{name}}",
  "company": "{{company}}"
}
```

---

## 3. COLD LEAD EMAIL TEMPLATE

**Subject:** Stay Updated on AI Automation Trends (Free Insights)

**When Used:** Score 0-59 points (Cold leads)

**Goal:** Newsletter signup + build relationship over time

**Send Time:** Within 2 hours of form submission

**Follow-up:** Monthly newsletter + quarterly check-in email

---

### HTML Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
    }
    .content {
      padding: 30px 20px;
    }
    .greeting {
      font-size: 15px;
      color: #1a1a1a;
      margin: 0 0 15px 0;
      line-height: 1.6;
    }
    .newsletter-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      text-align: center;
    }
    .newsletter-box h2 {
      margin: 0 0 10px 0;
      font-size: 18px;
    }
    .newsletter-box p {
      margin: 0 0 15px 0;
      font-size: 14px;
      opacity: 0.95;
      line-height: 1.5;
    }
    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .newsletter-input {
      padding: 10px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
    }
    .newsletter-button {
      background-color: white;
      color: #667eea;
      padding: 10px;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }
    .content-section {
      margin: 20px 0;
      font-size: 14px;
      color: #555;
      line-height: 1.6;
    }
    .content-section h3 {
      color: #667eea;
      font-size: 15px;
      margin: 15px 0 10px 0;
    }
    .content-section ul {
      margin: 0;
      padding-left: 20px;
    }
    .content-section li {
      margin-bottom: 8px;
    }
    .resource-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 20px 0;
    }
    .resource-item {
      background-color: #f9f9f9;
      padding: 12px;
      border-radius: 4px;
      font-size: 13px;
      border-left: 3px solid #667eea;
    }
    .resource-item strong {
      color: #667eea;
      display: block;
      margin-bottom: 3px;
    }
    .cta-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      font-size: 12px;
      color: #666;
      text-align: center;
      border-top: 1px solid #e0e0e0;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Join 2,000+ Leaders Learning AI Automation</h1>
    </div>

    <div class="content">
      <p class="greeting">Hi {{name}},</p>

      <p>Thanks for getting in touch! We appreciate your interest in AI automation for your business.</p>

      <p>Whether you're just starting to explore AI or planning an automation project for later, we've created something valuable for you:</p>

      <div class="newsletter-box">
        <h2>Free Monthly Insights</h2>
        <p>Get our latest guides, case studies, and automation trends delivered to your inbox. No sales pitch—just practical knowledge to help {{company}} grow.</p>
        <div class="newsletter-form">
          <input type="email" class="newsletter-input" placeholder="Already confirmed: {{email}}" disabled>
          <button class="newsletter-button">You're subscribed! Check your inbox</button>
        </div>
      </div>

      <p style="text-align: center; font-size: 13px; color: #999;">Confirmation email sent to {{email}}</p>

      <div class="content-section">
        <h3>What You'll Receive:</h3>
        <ul>
          <li><strong>Real case studies</strong> - How businesses like {{company}}'s industry automate faster</li>
          <li><strong>Automation playbooks</strong> - Step-by-step guides for common workflows</li>
          <li><strong>AI trends</strong> - What's working in automation (and what's hype)</li>
          <li><strong>ROI calculator</strong> - Estimate savings for your specific use case</li>
        </ul>
      </div>

      <div class="resource-grid">
        <div class="resource-item">
          <strong>Ebook</strong>
          <span>AI Automation 101: A Practical Guide</span>
        </div>
        <div class="resource-item">
          <strong>Templates</strong>
          <span>Automation workflow templates (ready to customize)</span>
        </div>
        <div class="resource-item">
          <strong>Checklist</strong>
          <span>5-step automation readiness assessment</span>
        </div>
        <div class="resource-item">
          <strong>Interviews</strong>
          <span>Insights from founders who shipped automation projects</span>
        </div>
      </div>

      <div class="content-section">
        <h3>When You're Ready to Explore Further:</h3>
        <p>Whether that's in 3 months, 6 months, or next year—when {{company}} is ready to implement AI automation, you'll have learned enough to ask the right questions and move fast.</p>
        <p>In the meantime, just reply to any email if you have questions. We're happy to chat.</p>
      </div>

      <p style="margin-top: 25px;">Welcome aboard!</p>

      <p>
        <strong>Best,</strong><br>
        The KI Agentur Team<br>
        <a href="https://ki-agentur.de" style="color: #667eea; text-decoration: none;">ki-agentur.de</a>
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        You received this email because you contacted KI Agentur via our website.
      </p>
      <p style="margin: 0 0 10px 0;">
        <a href="https://ki-agentur.de/unsubscribe">Unsubscribe from newsletter</a> |
        <a href="https://ki-agentur.de/privacy">Privacy Policy</a>
      </p>
      <p style="margin: 0; font-size: 11px; color: #999;">
        KI Agentur GmbH | Helping businesses automate with AI
      </p>
    </div>
  </div>
</body>
</html>
```

### Plain Text Fallback

```
Hi {{name}},

Thanks for getting in touch! We appreciate your interest in AI automation for your business.

Whether you're just starting to explore AI or planning an automation project for later, we've created something valuable for you:

FREE MONTHLY INSIGHTS

Get our latest guides, case studies, and automation trends delivered to your inbox. No sales pitch—just practical knowledge to help {{company}} grow.

CONFIRMATION EMAIL SENT TO: {{email}}

What You'll Receive:

- Real case studies - How businesses like {{company}}'s industry automate faster
- Automation playbooks - Step-by-step guides for common workflows
- AI trends - What's working in automation (and what's hype)
- ROI calculator - Estimate savings for your specific use case

BONUS RESOURCES:

Ebook: AI Automation 101: A Practical Guide
Templates: Automation workflow templates (ready to customize)
Checklist: 5-step automation readiness assessment
Interviews: Insights from founders who shipped automation projects

When You're Ready to Explore Further:

Whether that's in 3 months, 6 months, or next year—when {{company}} is ready to implement AI automation, you'll have learned enough to ask the right questions and move fast.

In the meantime, just reply to any email if you have questions. We're happy to chat.

Welcome aboard!

Best,
The KI Agentur Team
ki-agentur.de
```

### Template Variables
```json
{
  "name": "{{name}}",
  "company": "{{company}}",
  "email": "{{email}}"
}
```

---

## Email Template Implementation Guide

### Using Templates in n8n

For each email node (Send Hot/Warm/Cold Lead Email), use these settings:

#### Option 1: Gmail/SMTP

```javascript
// In HTTP node or Gmail node
{
  "from": "leads@ki-agentur.de",
  "to": "{{ $json.email }}",
  "subject": "[Template specific subject]",
  "html": "[HTML template here with {{variables}} replaced]",
  "replyTo": "support@ki-agentur.de"
}
```

#### Option 2: Resend Email Service

```bash
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer re_XXXXXXXXXXXX" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "leads@ki-agentur.de",
    "to": "recipient@example.com",
    "subject": "Email subject",
    "html": "<html>...</html>"
  }'
```

### Variable Substitution

Replace these in templates:

| Variable | Source | Example |
|----------|--------|---------|
| `{{name}}` | `$json.name` | "Maria Schmidt" |
| `{{company}}` | `$json.company` | "TechCore GmbH" |
| `{{email}}` | `$json.email` | "maria@techcore.de" |
| `{{calendlyUrl}}` | Environment var | "https://calendly.com/ki-agentur/consultation" |

### Personalization Tips

1. **Name personalization**: Always use {{name}} in greeting
2. **Company context**: Mention {{company}} 2-3 times to feel personal
3. **Urgency matching**: Hot emails emphasize speed, cold emails emphasize learning
4. **CTA clarity**: Only ONE primary button per email (avoid decision paralysis)

### Testing Before Sending

1. **Desktop rendering**: Test in Gmail, Outlook, Apple Mail
2. **Mobile rendering**: Test on iPhone, Android devices
3. **Link testing**: Verify all links work
4. **Variable substitution**: Send test with actual names/companies
5. **Spam check**: Use Mailmodo or similar tool to test deliverability

### A/B Testing Variations

For continuous improvement, create variants:

**Subject Line Test:**
- Hot: "Schedule Your Free AI Automation Consultation" (current)
- Variant: "Let's Talk AI Automation for {{company}}"

**CTA Button Text:**
- "Schedule a 20-Minute Consultation" (current)
- "Book a Free Discovery Call"

**Urgency Language:**
- "Slots fill up fast—book now for this week" (current)
- "Open 24 hours—pick a time that works"

---

## Measuring Email Performance

Track these metrics by template:

| Metric | Target | Tool |
|--------|--------|------|
| Open Rate | Hot: 45%+, Warm: 35%+, Cold: 20%+ | Email service analytics |
| Click Rate | Hot: 15%+, Warm: 8%+, Cold: 3%+ | UTM parameters |
| Conversion Rate | Hot: 30%+, Warm: 10%+, Cold: 2%+ | HubSpot or Pipedrive |
| Response Time | Hot: <4h, Warm: <2d, Cold: <7d | Manual tracking |

Use [Mailmodo](https://www.mailmodo.com) or [Mailgun](https://www.mailgun.com) for detailed email analytics.

---

## Template Compliance

✓ **GDPR Compliant:**
- Unsubscribe link in footer
- Privacy policy link
- Clear reason for email

✓ **CAN-SPAM Compliant (US):**
- Physical address (optional for B2B)
- Unsubscribe option
- Subject line disclaimer not required for B2B

✓ **Best Practices:**
- Mobile-responsive design
- Plain text fallback
- Images with alt text
- Clear font size (minimum 14px)
- Maximum 25% image to text ratio

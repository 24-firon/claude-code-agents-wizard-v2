# Brand Integration Guidelines: KI Agentur Client Portal

**Version**: 1.0 | **Date**: 2025-11-22 | **Status**: Ready for Design Phase | **Author**: Marketing Strategist

---

## Executive Summary

These guidelines apply the KI Agentur premium brand identity specifically to the Client Portal—an enterprise SaaS product for transparency, automation tracking, and project collaboration. The portal maintains our signature gold-on-black aesthetic while adapting for dashboard usability, data visualization, and technical credibility.

**Key Principle**: The portal is where clients *experience* our brand promise ("Your automation project, automated"). Every interaction should reinforce premium quality, technical transparency, and partnership value.

**Reference Documents:**
- KI Agentur Brand Guidelines: `/home/user/claude-code-agents-wizard-v2/brand-guidelines-ki-agentur.md`
- Client Portal PRD: `/home/user/claude-code-agents-wizard-v2/prd-ki-agentur-client-portal.md`

---

## Table of Contents

1. [Brand Application for Portal](#1-brand-application-for-portal)
2. [Messaging Framework](#2-messaging-framework)
3. [Portal UI Copy & Microcopy](#3-portal-ui-copy--microcopy)
4. [Bilingual Content (German + English)](#4-bilingual-content-german--english)
5. [Email Template Guidelines](#5-email-template-guidelines)
6. [Implementation Checklist](#6-implementation-checklist)

---

## 1. Brand Application for Portal

### 1.1 Color Palette Application

#### Primary Brand Colors (Existing)

**KI Gold** - #FFB800 | RGB(255, 184, 0)

**Portal Usage:**
- **Primary CTAs** (buttons: Schedule, Submit, Approve, Download)
- **Active navigation states** (current page, selected filters)
- **Status indicators for success** (workflow completed, milestone achieved)
- **Key metric highlights** (health score, performance improvements)
- **Interactive element focus states** (hover borders, active inputs)
- **Gold accent lines** (section dividers, progress bars)

**Usage Rule:** Use sparingly for maximum premium impact. Average page should have 2-3 gold elements.

**Charcoal Black** - #0A0A0A | RGB(10, 10, 10)

**Portal Usage:**
- **Main dashboard background** (primary surface)
- **Sidebar and header backgrounds**
- **Card backgrounds** (elevated surfaces)
- **Text color** (headings, primary labels)
- **Professional, sophisticated foundation**

**Usage Rule:** Default background. Creates visual authority and focuses attention on data.

#### Portal-Specific Color Extensions

**Dashboard Backgrounds:**
- **Primary (Dark)**: #0A0A0A (main dashboard area)
- **Secondary**: #1A1A1A (cards, elevated surfaces)
- **Tertiary**: #2A2A2A (hover states, nested elements)

**Text Colors:**
- **Primary Text**: #FFFFFF (headings, important labels) - 17.1:1 contrast on black
- **Secondary Text**: #CCCCCC (supporting text, dates) - 5.2:1 contrast on black
- **Tertiary Text**: #999999 (captions, hints) - used sparingly

**Data Visualization Colors** (in addition to main palette):

| Use Case | Color | Code | Context |
|----------|-------|------|---------|
| Success / Completed | Green | #10B981 | Workflow succeeded, milestone completed |
| Warning / At Risk | Amber | #FFA000 | Workflow slow, milestone approaching |
| Error / Blocked | Red | #FF3B30 | Workflow failed, blocker created |
| Info / Neutral | Blue | #0A84FF | Status info, neutral state |
| Neutral Metric | Gray | #CCCCCC | Standard metrics, no special status |

**Data Visualization Principles:**
- Use semantic colors sparingly for status/health
- Default metrics in white text on dark background
- Don't rely on color alone - always include icons, text labels
- Test all visualizations with colorblind-friendly tools
- Maintain professional data viz aesthetic (not overly colorful)

### 1.2 Typography for Portal

**Primary Typeface: Inter** (Same as KI Agentur main brand)

- **Headings (H1-H4)**: All interactive headings in Inter
- **Navigation labels**: Medium (500) weight
- **Section headers**: Semibold (600) weight
- **Data labels**: Regular (400) weight

**Type Scale for Portal:**

| Element | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| **Page Title** (H1) | 32px | Bold (700) | 1.2 | Dashboard name, page header |
| **Section Header** (H2) | 24px | Semibold (600) | 1.3 | Card title, feature group |
| **Sub-header** (H3) | 18px | Medium (500) | 1.4 | Sub-section label |
| **Label** | 14px | Medium (500) | 1.4 | Form label, column header |
| **Body Text** | 16px | Regular (400) | 1.6 | Main content, descriptions |
| **Small Text** | 12px | Regular (400) | 1.5 | Supporting text, captions |
| **Monospace (Code)** | 13px | Regular (400) | 1.6 | API keys, workflow IDs, logs |

**Typography Rules for Portal:**
- Limit to 2-3 font sizes per section (hierarchy clarity)
- Use weight variation more than size variation for emphasis
- Maintain 1.4-1.6 line height for readability
- Never go below 12px for readability on screens
- Tech terms and codes: Use monospace (JetBrains Mono)

### 1.3 Icon Style & System

**Icon Style Direction:** Clean outline icons, 2px stroke weight

**Portal Icon Categories:**

**Navigation Icons:**
- Dashboard (house icon)
- Technical/Logs (database or terminal icon)
- Documents (file/folder icon)
- Timeline (calendar or milestone icon)
- Notifications (bell icon)
- Settings (gear icon)

**Status Icons:**
- Success ✓ (checkmark in green circle)
- In Progress ⟳ (loading spinner, gold)
- Warning ⚠ (triangle in amber)
- Error ✕ (X in red circle)
- Blocked 🔒 (lock icon in red)

**Action Icons:**
- Download (arrow down)
- Upload (arrow up)
- Edit (pencil)
- Delete (trash can)
- Share (share icon)
- Copy (document copy)

**Data Icons:**
- Workflow (connected nodes)
- Integration (network/link icon)
- API (code brackets)
- History (clock)
- Alert (notification)

**Icon Color Rules:**
- **Active/Interactive**: Gold (#FFB800)
- **Success States**: Green (#10B981)
- **Error/Alert**: Red (#FF3B30)
- **Warning**: Amber (#FFA000)
- **Neutral/Default**: White (#FFFFFF) on dark, Gray (#CCCCCC) on hover
- **Disabled**: Gray (#999999)

**Icon Sizing:**
- 16px: Inline icons, form inputs
- 24px: Navigation icons, toolbar buttons
- 32px: Large action buttons
- 48px: Empty state illustrations

### 1.4 Visual Tone for Portal

**Professional + Accessible**
- Premium aesthetic (gold, black, clean spacing)
- Data-focused (no unnecessary decoration)
- High contrast for readability
- Generous whitespace for clarity
- Minimal animations (purposeful only)

**Brand Expression in Portal:**

**What Portal Design Should Communicate:**
- ✅ Technical sophistication (dark theme, clean layout)
- ✅ Enterprise readiness (professional, no playful elements)
- ✅ Data trustworthiness (clear information hierarchy)
- ✅ Premium partnership (gold accents, polished)
- ✅ Automation expertise (clean n8n integration presentation)

**What Portal Design Should Avoid:**
- ❌ Playful or casual tone (this is business-critical)
- ❌ Excessive color (data viz noise)
- ❌ Animation for decoration (distraction)
- ❌ Stock photography (keep data-focused)
- ❌ Unnecessary branding (clients know they're with KI Agentur)

---

## 2. Messaging Framework

### 2.1 Portal Positioning Statement

**For** enterprise CTOs, CEOs, and PMs managing automation projects,

**The KI Agentur Client Portal is** a transparency and automation-tracking platform

**That** replaces status calls with live project dashboards, workflow visibility, and automated insights,

**Unlike** generic project management tools or status email updates,

**We** show exactly how your automation is performing—because we built this portal to demonstrate the value we deliver.

### 2.2 Primary Portal Tagline

> **"Your automation project, automated"**

**Rationale:**
- Memorable, concise positioning
- Emphasizes automation expertise (using our own tools)
- Client-focused benefit
- Premium positioning without arrogance

**Alternative Taglines:**
- "Transparency into your automation" (emphasizes visibility)
- "Automation meets transparency" (both sides of value)
- "See your automation work" (outcomes-focused)

**Portal Tagline Usage:**
- Portal login page (subtle, small)
- Welcome email subject line
- First-time onboarding modal
- Help/support materials
- Mobile app title or tagline

### 2.3 Persona-Specific Value Propositions

#### For CTO / Technical Users

**Primary Value Prop:**
> "Real-time visibility into your automation infrastructure. View live n8n workflows, execution logs, integration status, and performance metrics. No black box—just engineering transparency."

**Key Messages:**
- Live workflow diagrams (visual debugging)
- Execution logs with error details
- Integration status dashboard
- API documentation and developer access
- Audit logs for compliance

**Tone:** Technical, transparent, no-BS

#### For CEO / Executive Users

**Primary Value Prop:**
> "One place to see if your automation investment is working. Project health snapshot, ROI metrics, milestone tracking. No more status calls needed."

**Key Messages:**
- 30-second health score snapshot
- ROI and business impact visibility
- Milestone tracking and timeline
- Weekly summary emails (board-ready)
- Mobile access for on-the-go status checks

**Tone:** Business-focused, confidence-building, results-oriented

#### For PM / Coordination Users

**Primary Value Prop:**
> "Centralized hub for all project documentation, milestones, and progress. Keep everyone aligned without endless meetings."

**Key Messages:**
- Document repository (organized, searchable)
- Milestone tracking and coordination
- Activity feed showing real progress
- Role-based access control
- Version control for documents

**Tone:** Practical, organized, collaborative

### 2.4 Portal Feature Messaging

#### Dashboard Feature

**Headline:** "Project Health at a Glance"

**Description:** "See your automation project status in 30 seconds. Health score automatically updated from live workflow data."

**Key Benefits:**
- Health Score (0-100 calculated from workflow success, milestones, blockers)
- Next Milestone with days remaining
- Blockers count and severity
- Real-time updates (every 30 seconds)
- Mobile-responsive layout

#### Technical/Workflow Logs Feature

**Headline:** "Engineering Transparency"

**Description:** "View live n8n workflow execution with detailed logs, error messages, and performance metrics. See exactly how your automation works."

**Key Benefits:**
- Workflow diagrams and execution logs
- Error details and debugging information
- Performance metrics (execution time, throughput)
- Integration status for connected systems
- API documentation and webhook logs

#### Documents Feature

**Headline:** "Project Documentation, Organized"

**Description:** "Find any project document in seconds. Centralized, searchable, with version control."

**Key Benefits:**
- Organized by project phase (Requirements, Design, Development, Testing, Deployment)
- Full-text search across documents
- Version history and rollback capability
- Role-based access control
- Audit logs for compliance

#### Notifications Feature

**Headline:** "Stay Informed, Not Interrupted"

**Description:** "Get notified when it matters: milestones completed, workflows fail, blockers arise. Weekly summary email so you don't miss critical updates."

**Key Benefits:**
- Real-time notifications for critical events
- Weekly summary emails (customizable)
- In-app notification center
- Email + in-app delivery options
- Customizable notification preferences

### 2.5 Portal Tone of Voice

**Portal voice principles** (different from marketing website):

#### 1. **Clear** (over clever)
- Data must be unambiguous
- No marketing fluff in interface
- Direct language, no jargon
- ✅ "Workflow failed: Salesforce API timeout at 2:45 PM"
- ❌ "Workflow experienced a temporary disruption"

#### 2. **Professional** (over friendly)
- This is business-critical data
- Maintain professional distance
- Factual, not emotional
- ✅ "3 blockers need attention"
- ❌ "Oh no! 3 blockers to fix!"

#### 3. **Empowering** (over blaming)
- Language focuses on solutions
- No blame or shame for errors
- Forward-looking tone
- ✅ "Workflow error detected. View logs to diagnose."
- ❌ "Workflow failed due to user misconfiguration."

#### 4. **Transparency** (over reassurance)
- Show actual data, not sanitized versions
- Honest about problems
- Technical accuracy over smoothing
- ✅ "API response time increased 150% last 7 days"
- ❌ "Minor performance variation detected"

---

## 3. Portal UI Copy & Microcopy

### 3.1 Authentication & Onboarding

#### Login Page Copy

**Headline:**
```
Welcome back to your automation project
```

**Subheadline:**
```
Sign in to view real-time workflow status, project documents, and automation metrics.
```

**Email Input Label:**
```
Email address
```

**Password Input Label:**
```
Password
```

**Sign In Button:**
```
Sign In
```

**Forgot Password Link:**
```
Forgot password? Reset it →
```

**SSO Button (if available):**
```
Sign in with Google
```

**Alternate SSO Button:**
```
Sign in with Microsoft
```

#### First-Time Onboarding Modal

**Headline:**
```
Welcome to your project portal
```

**Body:**
```
This is where you'll track your automation project in real-time.
Your dashboard shows project health, workflow status, and key metrics—updated automatically.

Here's what you can do:
• View live project health score
• Access workflow execution logs
• Download project documents
• Track milestones and progress

Questions? Check our help guide or contact your KI Agentur team.
```

**CTA:**
```
Get Started
```

**Skip Option:**
```
Skip for now
```

#### Password Reset Email Subject

```
Subject: Reset your password
```

**Email Body (Key Section):**
```
Hi [Name],

You requested a password reset for your KI Agentur Client Portal account. Click the button below to create a new password:

[Reset Button: "Set New Password"]

This link expires in 24 hours.

---
The KI Agentur Team
```

### 3.2 Navigation & Sidebar Labels

#### English Navigation Labels

**Main Navigation (Left Sidebar):**

| Label | Icon | Tooltip/Helper Text |
|-------|------|-------------------|
| Dashboard | House icon | "Project health snapshot" |
| Technical | Database icon | "Workflow logs and integration status" |
| Documents | File icon | "Project files and documentation" |
| Timeline | Calendar icon | "Milestones and project schedule" |
| Notifications | Bell icon | "All updates and alerts" |
| Settings | Gear icon | "Account and notification preferences" |

**Header Navigation:**

| Element | Copy |
|---------|------|
| Logo/Home | KI Agentur (links to company site) |
| Project Selector | "Project: [Current Project Name]" |
| Notifications Bell | Badge count: "[X] new" |
| User Menu | "[User Name] ▼" with Logout option |

#### German Navigation Labels

| Label | English | Icon | Tooltip |
|-------|---------|------|---------|
| Dashboard | Dashboard | House | "Projektgesundheit auf einen Blick" |
| Technisch | Technical | Database | "Workflow-Logs und Integrationsstatus" |
| Dokumente | Documents | File | "Projektdateien und Dokumentation" |
| Zeitstrahl | Timeline | Calendar | "Meilensteine und Projektzeitplan" |
| Mitteilungen | Notifications | Bell | "Alle Updates und Benachrichtigungen" |
| Einstellungen | Settings | Gear | "Konto- und Benachrichtigungseinstellungen" |

### 3.3 Dashboard Microcopy

#### Health Score Card

**Title:**
```
Project Health
```

**Score Label:**
```
Health Score
```

**Score Display:**
```
[78] out of 100
```

**Score Explanation (Tooltip):**
```
Calculated from workflow success rate, milestone progress, and blockers.
Updated every 30 seconds.
```

**Score Status Indicators:**

| Score Range | Status | Color | Label |
|-------------|--------|-------|-------|
| 80-100 | On Track | Green | ✓ On Track |
| 60-79 | At Risk | Amber | ⚠ At Risk |
| 0-59 | Blocked | Red | ✕ Blocked |

#### Next Milestone Card

**Title:**
```
Next Milestone
```

**Milestone Name:**
```
[Milestone Name]
```

**Days Remaining Label:**
```
Due in
```

**Days Display:**
```
[X] days
```

**Status (if at risk):**
```
⚠ Off track - 3 days behind schedule
```

**CTA:**
```
View Details →
```

#### Open Blockers Card

**Title:**
```
Blockers
```

**Count Display:**
```
[3] open blockers
```

**Blocker List:**
```
1. [Blocker Title] - Created [Date]
2. [Blocker Title] - Created [Date]
3. [Blocker Title] - Created [Date]
```

**CTA (if blockers > 0):**
```
Review All Blockers →
```

**Empty State (if no blockers):**
```
✓ No blockers - project on track
```

### 3.4 Technical/Logs Feature Copy

#### Workflow Logs Header

**Title:**
```
Workflow Execution Logs
```

**Subtitle:**
```
Live execution history for all project workflows
```

**Filter Label:**
```
Filter by:
```

**Filter Options:**
- All Workflows
- [Specific Workflow Name]
- Status: All / Success / Failed / In Progress
- Date Range: [Last 7 days / Last 30 days / Custom]

#### Workflow Log Entry (Executed Successfully)

**Workflow Name:**
```
[Workflow Name]
```

**Status Badge:**
```
✓ Success (Gold/Green background)
```

**Execution Time:**
```
Completed in [2.5 seconds]
```

**Timestamp:**
```
Nov 22, 2025 at 10:30 AM CET
```

**Details Link:**
```
View Logs →
```

#### Workflow Log Entry (Failed)

**Workflow Name:**
```
[Workflow Name]
```

**Status Badge:**
```
✕ Failed (Red background)
```

**Error Message (Expandable):**
```
Error: Salesforce API timeout
Request to /services/data/v59.0 exceeded 30s timeout
Last attempted: Nov 22, 2025 10:30 AM CET
```

**Action Button:**
```
View Full Logs →
```

**CTA for Quick Action:**
```
Retry Workflow →
```

#### Integration Status

**Title:**
```
System Integration Status
```

**Status Grid (Example):**

| System | Status | Last Sync | Action |
|--------|--------|-----------|--------|
| Salesforce | ✓ Connected | 2 min ago | Disconnect |
| ERP System | ⚠ Warning | 45 min ago | View Details |
| Slack | ✕ Disconnected | – | Reconnect |

**Status Color Key:**
- ✓ Green = Connected, syncing normally
- ⚠ Amber = Connected but degraded performance
- ✕ Red = Disconnected or error

### 3.5 Documents Feature Copy

#### Documents Header

**Title:**
```
Project Documents
```

**Search Label:**
```
Search documents...
```

**Search Placeholder:**
```
Find by title, content, uploader...
```

**Filter Label:**
```
Filter by:
```

**Filter Options:**
- All Folders / Requirements / Design / Development / Testing / Deployment
- Sort: Date Added / Name / Recently Modified

#### Document Upload Section

**Upload Area (Empty State):**
```
Drag documents here or click to browse

Accepted files: PDF, Word, Excel, Presentations, Images, Text
Maximum file size: 50 MB
```

**After Upload:**
```
✓ [Filename] uploaded successfully
Version 1.0 created on Nov 22, 2025
```

#### Document Card

**File Icon + Name:**
```
📄 [Document Name]
```

**Metadata:**
```
Uploaded by [User Name] on Nov 22, 2025
Version 1.0 | Last modified Nov 22, 2025 at 10:30 AM
```

**Status Tag (if applicable):**
```
[Current] or [Archived]
```

**Actions (Hover):**
- Download (↓ icon)
- Share (share icon)
- More Options (... menu)

**Empty State (No Documents):**
```
No documents yet

Upload project documents to keep everything organized in one place.

[Upload Documents Button]
```

### 3.6 Notifications Feature Copy

#### Notification Center Header

**Title:**
```
Notifications
```

**Mark All Read Button:**
```
Mark all as read
```

**Tab Options:**
- All Notifications
- Unread Only

#### Notification Types & Messages

**Workflow Completed Notification**
```
Title: Workflow completed
Message: Order Processing workflow executed successfully
Metadata: 3 minutes ago
Action: View Workflow Logs →
```

**Milestone Completed Notification**
```
Title: Milestone achieved!
Message: Design Phase milestone completed on schedule
Metadata: 1 hour ago
Action: View Timeline →
```

**Workflow Failed Alert**
```
Title: ⚠ Workflow alert
Message: Salesforce sync failed - API timeout
Metadata: 5 minutes ago
Action: View Logs → | Retry →
```

**Blocker Created Alert**
```
Title: ⚠ Blocker created
Message: [Blocker Description]
Metadata: 1 day ago
Action: Review Blocker →
```

**Weekly Summary Email Subject**
```
Subject: Your project status this week
```

**Weekly Summary Email (Key Sections):**
```
Hi [Name],

Here's a quick summary of your [Project Name] automation project this week:

---

HEALTH SNAPSHOT
Health Score: 78/100 (on track)
Status: All systems running normally

WHAT COMPLETED THIS WEEK
✓ Customer Data Sync workflow (52 executions, 98% success rate)
✓ Order Processing workflow (156 executions, 100% success rate)
✓ Design Phase milestone

UPCOMING MILESTONES
→ Testing Phase: Due in 7 days
→ Deployment Phase: Due in 21 days

SYSTEM STATUS
All integrations connected and performing normally
No blockers or alerts

---

Questions? Reply to this email or visit your project portal:
[Portal Link]

— The KI Agentur Team
```

### 3.7 Settings & Account Copy

#### Account Settings Page

**Heading:**
```
Account Settings
```

**Email Section Label:**
```
Email Address
```

**Email Display:**
```
[user@company.com]
[Change Email] [Verify Email]
```

**Password Section Label:**
```
Password
```

**Password Action:**
```
[Change Password]
```

**Session Management Label:**
```
Active Sessions
```

**Session Display:**
```
You have [2] active sessions
[Sign out all other sessions]
```

#### Notification Preferences Page

**Heading:**
```
Notification Preferences
```

**Email Frequency Label:**
```
Email Summary Frequency
```

**Email Frequency Options:**
- Daily digest
- Weekly summary
- Biweekly summary
- Only critical alerts

**Notification Types Label:**
```
What to notify me about:
```

**Notification Type Toggles:**
- ☑ Workflow completions
- ☑ Workflow failures
- ☑ Milestone achievements
- ☑ Blocker created
- ☑ Integration status changes
- ☑ Weekly summary

**Delivery Method Label:**
```
How to notify:
```

**Delivery Options:**
- ☑ Email notifications
- ☑ In-app notifications (notification center)
- [ ] SMS (coming soon)
- [ ] Slack (coming soon)

**Save Button:**
```
Save Preferences
```

**Confirmation Message:**
```
✓ Preferences saved successfully
```

---

## 4. Bilingual Content (German + English)

### 4.1 Key Phrases & Translations

#### Dashboard & Navigation

| English | German | Context |
|---------|--------|---------|
| Dashboard | Dashboard | Page title |
| Project Health | Projektgesundheit | Metric title |
| Health Score | Gesundheitswert | Key metric |
| On Track | Im Plan | Status |
| At Risk | Gefährdet | Status |
| Blocked | Blockiert | Status |
| Next Milestone | Nächster Meilenstein | Upcoming |
| Days Remaining | Verbleibende Tage | Timeline |
| Open Blockers | Offene Blockierungen | Issue count |
| Workflow | Arbeitsablauf / Workflow | Feature |
| Workflow Status | Arbeitsablauf-Status | Data |

#### Technical Features

| English | German | Context |
|---------|--------|---------|
| Technical Logs | Technische Protokolle | Page title |
| Workflow Execution | Arbeitsablauf-Ausführung | Process |
| Execution Logs | Ausführungsprotokolle | Data view |
| Integration Status | Integrationsstatus | System status |
| Connected | Verbunden | Status |
| Failed | Fehlgeschlagen | Status error |
| Error Message | Fehlermeldung | Alert content |
| API Documentation | API-Dokumentation | Developer feature |
| Webhook | Webhook | Technical term |

#### Documents & Files

| English | German | Context |
|---------|--------|---------|
| Documents | Dokumente | Page title |
| Project Documents | Projektdokumente | Category |
| Upload | Hochladen | Action |
| Download | Herunterladen | Action |
| Version | Version | File metadata |
| Version History | Versionsverlauf | Feature |
| Search | Suchen | Feature |
| Folder | Ordner | Organization |
| Current | Aktuell | Status |
| Archived | Archiviert | Status |

#### Notifications & Updates

| English | German | Context |
|---------|--------|---------|
| Notifications | Mitteilungen | Page title |
| Notification Center | Mitteilungszentrum | Feature |
| Mark as Read | Als gelesen markieren | Action |
| Weekly Summary | Wöchentliche Zusammenfassung | Email type |
| Alert | Benachrichtigung / Warnung | Notification type |
| Completed | Abgeschlossen | Status |
| Settings | Einstellungen | Page title |

#### Actions & CTAs

| English | German | Context |
|---------|--------|---------|
| Sign In | Anmelden | Authentication |
| Sign Out | Abmelden | Authentication |
| Save | Speichern | Action |
| Cancel | Abbrechen | Action |
| Delete | Löschen | Action |
| View Details | Details anzeigen | Navigation |
| Download | Herunterladen | Action |
| Share | Teilen | Action |
| Edit | Bearbeiten | Action |
| More Options | Weitere Optionen | Menu |

#### Support & Help

| English | German | Context |
|---------|--------|---------|
| Help | Hilfe | Support |
| Contact Us | Kontaktieren Sie uns | Support channel |
| Getting Started | Erste Schritte | Onboarding |
| Need Help? | Benötigen Sie Hilfe? | Support prompt |
| Reset Password | Passwort zurücksetzen | Authentication |
| Forgot Password | Passwort vergessen? | Authentication |

### 4.2 German Language Guidelines

**Tone & Style for German:**
- Maintain formal "Sie" (not informal "du") for professional context
- Use active voice whenever possible
- Keep sentences concise (German tends toward longer structures)
- Use consistent terminology from glossary above
- Avoid literal translations—adapt for German conventions

**Capitalization Rules (German):**
- Capitalize nouns (German language rule)
- Feature names: "Arbeitsablauf-Status" (hyphenated compound)
- Page titles: "Projektgesundheit" (title case)

**Gender-Neutral Language (German):**
- Use inclusive forms when referring to users
- Example: "Benutzer" (users) rather than "Benutzer und Benutzerin"
- For consistency, use neutral/plural forms where possible

**Common German Compounds (Portal-Specific):**
- Arbeitsablauf = Workflow
- Projektgesundheit = Project Health
- Integrationsstatus = Integration Status
- Ausführungsprotokolle = Execution Logs
- Meilenstein = Milestone
- Blockierung = Blocker
- Versionsverlauf = Version History

### 4.3 Bilingual UI Implementation

**Language Selection:**
- User preference saved in profile (default: browser language)
- Toggle in account settings
- Quick language switcher in header (optional: EN | DE)

**Implementation Strategy:**
1. All UI strings stored in translation file (i18n)
2. German strings reviewed by native speaker
3. Consistent terminology across portal
4. User preference persisted in session
5. Documentation provided in both languages

**Priority Translation Order:**
1. **Critical (MVP)**: Navigation, buttons, core UI copy
2. **Important (Phase 1)**: Help text, tooltips, messages
3. **Nice-to-Have**: Blog content, marketing materials

**Bilingual Email Templates:**
- Subject line: English | German variant
- Email body: User's preferred language
- CTA buttons and links: Both languages (when feasible)

---

## 5. Email Template Guidelines

### 5.1 Welcome Email

#### Subject Line (English)
```
Welcome to your KI Agentur project portal
```

#### Subject Line (German)
```
Willkommen zu Ihrem KI Agentur-Projektportal
```

#### Email Body

**Greeting:**
```
Hi [Name] / Hallo [Name],
```

**Opening:**
```
Your KI Agentur Client Portal is now ready.
This is where you'll monitor your automation project in real-time, access documentation, and stay informed about progress.
```

**Key Features Highlight:**
```
Here's what you can do:

• Dashboard: 30-second project health snapshot (health score, milestones, blockers)
• Technical Logs: View live n8n workflows and integration status
• Documents: Find all project files organized by phase
• Notifications: Get alerts on workflow completions, failures, and milestones
• Timeline: Track all project milestones and due dates
```

**Getting Started:**
```
Getting Started:

1. Sign in with your email and the password in this message:
   Username: [Email]
   Password: [Temporary password]

2. Log in here: [Portal URL]

3. Change your password in Account Settings (you'll be prompted)

4. Explore your dashboard to see your project health score
```

**First Actions:**
```
First steps:
✓ Review your project health score
✓ Download important documents
✓ Set your notification preferences
```

**Support:**
```
Questions?
• View the getting started guide: [Help Link]
• Email us at [Support Email]
• Your KI Agentur team: [Team Contact Info]

We're here to help.
```

**Sign-off:**
```
Welcome aboard,

The KI Agentur Team

---
This is your secure project portal. Only share your login credentials with authorized team members.
```

### 5.2 Milestone Completed Email

#### Subject Line (English)
```
Milestone complete: [Milestone Name] ✓
```

#### Subject Line (German)
```
Meilenstein erreicht: [Meilenstein Name] ✓
```

#### Email Body

**Opening:**
```
Excellent news!

Your [Milestone Name] milestone has been completed successfully.
```

**Key Details:**
```
Milestone: [Milestone Name]
Completed: [Date] at [Time] CET
Status: On Schedule
Next Milestone: [Next Milestone Name] (Due [Date])
```

**Progress Summary:**
```
Project Progress:
Your project health score is [80]/100 – on track!
```

**What's Next:**
```
What's next:
→ [Next Milestone] is scheduled for [Date]
→ [Supporting action or next step]
```

**CTA:**
```
[View on Portal] [Share with Team]
```

**Sign-off:**
```
Great progress! Keep up the momentum.

The KI Agentur Team
```

### 5.3 Workflow Failure Alert Email

#### Subject Line (English)
```
⚠ Alert: Workflow failed - [Workflow Name]
```

#### Subject Line (German)
```
⚠ Warnung: Arbeitsablauf fehlgeschlagen - [Workflow Name]
```

#### Email Body

**Alert Header:**
```
⚠ Workflow Alert

A workflow in your project has failed and requires attention.
```

**Error Details:**
```
Workflow: [Workflow Name]
Status: Failed
Error: [Error Message]
Failed At: [Timestamp]
Impact: [What data/systems affected]
```

**Quick Actions:**
```
Next Steps:
1. View the full error logs: [View Logs Link]
2. Diagnose the issue (see error message above)
3. Retry the workflow: [Retry Button]

Or contact your KI Agentur team for help.
```

**Support:**
```
Need help debugging?
→ Reply to this email
→ Email: [Support Email]
→ View our troubleshooting guide: [Link]
```

**Sign-off:**
```
We're monitoring this issue.

The KI Agentur Team
```

---

## 6. Implementation Checklist

### 6.1 Design Phase Checklist

**Color & Visual**
- [ ] Implement color palette (primary: #FFB800 gold, #0A0A0A black)
- [ ] Create semantic colors for status (green, amber, red, blue)
- [ ] Design dashboard cards with proper hierarchy and contrast
- [ ] Create icon set (24 core icons minimum)
- [ ] Design loading states and transitions
- [ ] Verify WCAG AA accessibility (4.5:1 contrast minimum)

**Typography**
- [ ] Import Inter font (300, 400, 500, 600, 700 weights)
- [ ] Import JetBrains Mono for code/technical content
- [ ] Create type scale (32px down to 12px with proper line heights)
- [ ] Style headings (H1-H3) with proper hierarchy
- [ ] Style body text and labels with proper contrast
- [ ] Test responsive typography on mobile (smaller sizes)

**Components**
- [ ] Design primary CTA button (gold background, white text)
- [ ] Design secondary button (outline gold)
- [ ] Design form inputs (dark background, white text, gold focus)
- [ ] Design form labels with proper styling
- [ ] Design status badges (success/warning/error/neutral)
- [ ] Design navigation sidebar (inactive/active states)
- [ ] Design notification toast messages
- [ ] Design modals/dialogs with proper hierarchy

**Data Visualization**
- [ ] Design health score visualization (0-100 scale with color coding)
- [ ] Design workflow status timeline/log
- [ ] Design metric cards with trending indicators
- [ ] Design integration status grid
- [ ] Design chart/graph styling (if used)
- [ ] Test color blindness with all visualizations

### 6.2 Content/Copy Checklist

**Portal UI Copy**
- [ ] Write all page headlines and descriptions
- [ ] Write navigation labels (English + German)
- [ ] Write button labels (primary CTAs, secondary actions)
- [ ] Write form labels and placeholders
- [ ] Write helper text and tooltips
- [ ] Write empty state messages
- [ ] Write status messages and alerts
- [ ] Write error messages with helpful guidance

**Email Templates**
- [ ] Write welcome email (EN + DE)
- [ ] Write milestone completion email (EN + DE)
- [ ] Write workflow failure alert (EN + DE)
- [ ] Write weekly summary email template
- [ ] Review all copy for tone and clarity
- [ ] Add proper CTA buttons to all emails

**Documentation**
- [ ] Create getting started guide (EN + DE)
- [ ] Document feature overview pages
- [ ] Create FAQ section
- [ ] Document troubleshooting guides
- [ ] Create video tutorials (optional)

### 6.3 Technical Implementation Checklist

**Brand Implementation in Code**
- [ ] Define CSS color variables (#FFB800, #0A0A0A, semantic colors)
- [ ] Set up typography CSS (Inter, JetBrains Mono with fallbacks)
- [ ] Create spacing scale CSS (4px base unit system)
- [ ] Create component library with brand colors
- [ ] Implement focus states (gold outline, 2px)
- [ ] Implement hover states (color transitions, 150ms)
- [ ] Set up form styling (dark input, gold focus border)
- [ ] Create button component variants (primary/secondary/tertiary)

**Internationalization (i18n)**
- [ ] Set up i18n framework (next-intl or similar)
- [ ] Store all UI strings in translation files
- [ ] Create English translation file (complete)
- [ ] Create German translation file (complete)
- [ ] Test language switching on all pages
- [ ] Verify German text doesn't cause layout breaks

**Accessibility**
- [ ] Test color contrast on all UI combinations
- [ ] Test keyboard navigation throughout portal
- [ ] Add proper ARIA labels to interactive elements
- [ ] Test with screen readers
- [ ] Verify focus indicators are visible
- [ ] Test colorblind modes (all simulations)
- [ ] Verify motion/animation preferences respected

**Email Implementation**
- [ ] Create email template components
- [ ] Test email rendering in major clients (Gmail, Outlook, Apple Mail)
- [ ] Implement responsive email design
- [ ] Add logo and branding to email headers
- [ ] Set proper line height and spacing in emails
- [ ] Test link colors (gold on light, white on dark)
- [ ] Verify images load properly

### 6.4 Quality Assurance Checklist

**Visual QA**
- [ ] All gold accents are exactly #FFB800
- [ ] All backgrounds are #0A0A0A where appropriate
- [ ] Typography matches spec (sizes, weights, line heights)
- [ ] Spacing is consistent (uses 8px base unit)
- [ ] Icons are consistent style and size
- [ ] Status colors are consistent (green/amber/red/blue)

**Copy QA**
- [ ] All UI text matches this guide
- [ ] No placeholder text left in production
- [ ] English and German are parallel (matching length/meaning)
- [ ] Tone is consistent throughout portal
- [ ] No marketing jargon in interface
- [ ] Error messages are helpful and actionable
- [ ] CTA text is clear and specific

**Functional QA**
- [ ] All buttons are clickable and responsive
- [ ] Form validation messages appear properly
- [ ] Email templates render correctly in tests
- [ ] Navigation works on all devices
- [ ] Dark theme applies correctly throughout
- [ ] Gold accents appear on all CTA elements
- [ ] Language switcher changes all content
- [ ] No broken links or missing assets

**Accessibility QA**
- [ ] All text meets 4.5:1 contrast minimum
- [ ] Focus states are visible and gold-highlighted
- [ ] Keyboard navigation works throughout
- [ ] Screen reader testing passes on all pages
- [ ] No color-only status indicators (always with icon/text)
- [ ] All form fields have associated labels
- [ ] Motion animations respect prefers-reduced-motion

**Brand Consistency QA**
- [ ] Portal "feels like" KI Agentur brand (premium, technical)
- [ ] Color palette applied consistently
- [ ] Typography matches brand guidelines
- [ ] Tone matches messaging framework
- [ ] Gold accents reinforce premium positioning
- [ ] No elements clash with brand identity
- [ ] Dark theme maintains brand character

---

## 7. Design System Specifications for Developers

### 7.1 CSS Color Variables

```css
/* Primary Brand Colors */
--color-primary: #FFB800;      /* KI Gold */
--color-background: #0A0A0A;   /* Charcoal Black */
--color-surface-primary: #1A1A1A;
--color-surface-secondary: #2A2A2A;

/* Text Colors */
--color-text-primary: #FFFFFF;
--color-text-secondary: #CCCCCC;
--color-text-tertiary: #999999;

/* Semantic Colors */
--color-success: #10B981;
--color-warning: #FFA000;
--color-error: #FF3B30;
--color-info: #0A84FF;

/* Interactive Elements */
--color-button-primary: #FFB800;
--color-button-primary-hover: #FFCC33;
--color-button-primary-pressed: #CC9300;
--color-button-primary-disabled: #CCCCCC;
```

### 7.2 Typography CSS Variables

```css
/* Font Families */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Font Sizes */
--font-size-h1: 32px;
--font-size-h2: 24px;
--font-size-h3: 18px;
--font-size-body: 16px;
--font-size-small: 14px;
--font-size-xs: 12px;

/* Font Weights */
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line Heights */
--line-height-tight: 1.2;
--line-height-normal: 1.4;
--line-height-relaxed: 1.6;
```

### 7.3 Spacing Scale CSS Variables

```css
/* 8px Base Unit */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
--spacing-4xl: 96px;
```

---

## 8. Handoff Notes for Implementation Teams

### For UX/Product Designer

**Key Deliverables Expected:**
- Wireframes for all pages using this brand integration guide
- Component specifications (buttons, inputs, cards, etc.)
- Color specifications with exact hex codes applied
- Typography hierarchy documented for each page
- Responsive breakpoints and mobile adaptations
- Interaction patterns (hover, focus, active states)
- Empty state and error state designs

**Reference Materials:**
- This guide (brand-integration-guidelines-client-portal.md)
- Main KI Agentur brand guidelines (for visual style direction)
- Client Portal PRD (for feature context)

**Design System Needs:**
- Component library with primary brand colors
- Icon set (24+ icons in outline style)
- Button variants (primary, secondary, tertiary)
- Form component styling
- Status badge designs
- Navigation component styles

### For Software Architect/Frontend Developer

**Key Implementation Needs:**
- Color palette CSS variables (provided above)
- Typography system with web fonts
- Component library styled with brand colors
- Dark theme implementation
- Form input styling (dark background, gold focus)
- CTA button styling (gold background)
- Icon integration system
- i18n/internationalization setup (English + German)

**Accessibility Requirements:**
- WCAG AA minimum compliance (4.5:1 contrast)
- Focus states with gold indicators
- Proper ARIA labels
- Semantic HTML structure
- Keyboard navigation support
- Colorblind-friendly implementation

**Performance Considerations:**
- Optimize web font loading (Inter, JetBrains Mono)
- Consider dark theme impact on battery life (good!)
- Lazy load images
- Minimize CSS animations (150-400ms max)

### For Content/Copy Team

**Key Deliverables Expected:**
- All page copy written (headlines, descriptions, labels)
- Navigation labels (English + German)
- Button labels and CTAs
- Help text and tooltips
- Error and success messages
- Empty state messaging
- Email templates (welcome, alerts, weekly summary)
- Getting started documentation

**Tone & Style Requirements:**
- Clear, direct language (no marketing fluff)
- Technical accuracy (for technical audience)
- Professional but helpful (not cold)
- Data-focused (no unnecessary personality)
- Bilingual quality (English and German)

**Review Process:**
- All copy reviewed for tone consistency
- German copy reviewed by native speaker
- Microcopy tested in actual UI context
- Help documentation reviewed for clarity

---

## Summary: Brand Integration Philosophy

The KI Agentur Client Portal should communicate:

1. **Premium Quality** - Gold accents, clean design, professional tone
2. **Technical Transparency** - Live data, no black boxes, engineering-focused
3. **Enterprise Readiness** - Dark theme, serious functionality, business-critical reliability
4. **Partnership Value** - Data that proves the automation is working, proves KI Agentur delivers
5. **Accessibility** - Clear information hierarchy, high contrast, bilingual support

**Remember:** Every element in the portal is proof of our brand promise. Users experience our automation expertise through the portal itself. Make it excellent.

---

**Document Status: READY FOR DESIGN PHASE**

**Next Steps:**
1. UX Designer creates wireframes using these specifications
2. Product Designer creates visual mockups with brand application
3. Software Architect implements CSS/design system
4. Content team writes all UI copy and documentation
5. QA team verifies brand consistency and accessibility

**Questions or clarifications needed?** Contact marketing strategist before design begins.

---

**File Location:** `/home/user/claude-code-agents-wizard-v2/brand-integration-guidelines-client-portal.md`

**Version:** 1.0 | **Date:** 2025-11-22 | **Status:** Final - Ready for Implementation

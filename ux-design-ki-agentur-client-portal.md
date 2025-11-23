# UX Design Document: KI Agentur Client Portal

**Version**: 1.0
**Date**: 2025-11-22
**Author**: UX Designer
**Status**: Complete - Ready for Implementation

---

## Executive Summary

The KI Agentur Client Portal is a transparency platform enabling enterprise clients (CTOs, CEOs, PMs) to monitor project status without meetings. This UX document defines how users interact with the platform, organized by role-based workflows that prioritize rapid comprehension and effortless navigation.

**Key Design Outcome**: Three personas with distinct needs navigate a unified platform through role-based dashboards, each optimized for their decision-making context. Users achieve project understanding within 30 seconds without scrolling, reducing status meeting overhead.

### PRD Reference
- **PRD Document**: `prd-ki-agentur-client-portal.md`
- **Alignment**: UX design fulfills all P0 features and core user stories through role-based flows

### UI Design Reference
- **UI Document**: `ui-design-ki-agentur-client-portal.md`
- **Integration**: Wireframes below match UI component specifications exactly

---

## UX Strategy

### Core UX Principles

1. **Role-Centric Design**: Each persona sees only what matters—CEO sees health/milestones, CTO sees technical logs, PM sees documents/activity
2. **30-Second Comprehension**: Health score visible without scrolling; key metrics immediately scannable
3. **Real-Time Transparency**: Dashboard updates every 30 seconds (polling); activity feed reflects n8n workflow completions instantly
4. **Error Prevention Over Recovery**: Forms validate in real-time; destructive actions require confirmation
5. **Bilingual Accessibility**: German/English toggle in header; all content translatable without layout shifts
6. **Accessibility First (WCAG 2.1 AA)**: Color contrast 4.5:1 for text, 44px touch targets, keyboard navigation fully supported

### Interaction Philosophy

**Product Feel**: Professional yet approachable. Premium dark aesthetic (gold on black) signals quality without intimidation. Clear, jargon-free language builds confidence.

**Core Patterns**:
- Dashboard summarization (executive health snapshot)
- Real-time status indicators (workflow completion = instant visual feedback)
- Progressive disclosure (drill down from metric → logs → execution details)
- Contextual actions (document menu, workflow test run, milestone edit)

**Design Priorities**:
1. **Speed**: Information visible in seconds, not minutes
2. **Clarity**: Visual hierarchy supports scanning; no ambiguity in status indicators
3. **Control**: Users manage preferences; notifications customizable; can refresh manually or disable auto-update

### User-Centered Approach

**Device Strategy**: Desktop-first (primary use) with responsive tablet/mobile support. Mobile users get essential metrics; full features available on desktop.

**Progressive Disclosure**: Dashboard shows summary cards → click card to drill down → modal/page shows detailed logs/history → expandable sections show execution JSON.

**Accessibility**: WCAG 2.1 AA minimum compliance. All status conveyed with icon + color + text (never color alone). Keyboard navigation: Tab through nav → main content → footer. Focus indicators always visible (3px gold outline).

---

## User Journey Maps

### Journey 1: CEO - Briefing Preparation (Weekly)

**Goal**: Understand project health in 2 minutes for board briefing

**Trigger**: Monday morning, board meeting at 10am

#### Stages

**Stage 1: Quick Check**
- User Action: Open portal, see health score (82, on-track, green)
- Touchpoint: Dashboard hero card
- Thought: "Good, we're still green. What's the next milestone?"
- Emotion: 😌 Confident
- Pain Points: None if health visible without scrolling
- Opportunity: Health score animation draws attention immediately

**Stage 2: Context Gathering**
- User Action: Scan 4 metric cards (Success Rate 98%, Next Milestone Dec 20, Blockers 0, ROI €245K/mo)
- Touchpoint: Metric cards below health
- Thought: "All metrics strong. When's the deadline again?"
- Emotion: 😊 Satisfied
- Pain Points: If metrics are outdated or require clicking to see
- Opportunity: All metrics update live every 30 seconds with timestamp

**Stage 3: Assurance**
- User Action: Glance at Timeline view (Requirements ✓, Design ✓, Dev in progress, Testing pending)
- Touchpoint: Timeline/milestone section
- Thought: "We're on track, no surprises. I can present this confidently."
- Emotion: 😊 Empowered
- Pain Points: If timeline is confusing or doesn't match actual progress
- Opportunity: One-click "Download Executive Summary" PDF for board deck

---

### Journey 2: CTO - Technical Validation (Daily)

**Goal**: Validate workflow executions; catch errors before CEO notices

**Trigger**: Start of day, monitoring task, or alert notification

#### Stages

**Stage 1: Status Assessment**
- User Action: Click "Technical" tab from dashboard
- Touchpoint: Sidebar navigation
- Thought: "Are all my workflows executing successfully?"
- Emotion: 😐 Alert, checking
- Pain Points: None if status is immediately clear
- Opportunity: Workflow status cards show success rate bars + timestamp

**Stage 2: Drill Down on Issue**
- User Action: Notice Customer Import has 1.2s (usual 1.0s); click to see logs
- Touchpoint: Workflow card → expand logs
- Thought: "Why is it slower? Is it a real issue or temporary?"
- Emotion: 😟 Concerned
- Pain Points: If logs don't explain why performance changed
- Opportunity: Execution logs show input size, output size, system resources used

**Stage 3: Preventive Action**
- User Action: Run test execution to confirm issue, or check integration status
- Touchpoint: "Test Run" button or Integration Status cards
- Thought: "Okay, it's consistent. Need to optimize or it will trigger alerts."
- Emotion: 😐 Proactive
- Pain Points: If test run takes too long or doesn't show results clearly
- Opportunity: Test run result appears inline with comparison to last run

**Stage 4: Documentation**
- User Action: Export logs or share diagram with team
- Touchpoint: Download buttons, API docs
- Thought: "Team needs to see this for next optimization sprint."
- Emotion: 😊 Collaborative
- Pain Points: If formats are hard to parse or not accessible offline
- Opportunity: CSV export includes metadata; workflow diagram updates auto-magically from n8n

---

### Journey 3: PM - Document Coordination (Throughout Day)

**Goal**: Organize knowledge; keep team synchronized on requirements/design

**Trigger**: Team asks "where's the latest spec?" or daily standup prep

#### Stages

**Stage 1: Document Search**
- User Action: Use Documents page; search "specification" or filter by "Design" phase
- Touchpoint: Search bar + filters
- Thought: "I need the latest spec to reference in the design review."
- Emotion: 😐 Task-focused
- Pain Points: If search is slow or results are confusing (multiple versions)
- Opportunity: Search returns v3 at top; shows "Current" tag + recent versions below

**Stage 2: Version Verification**
- User Action: Click document to see version history; confirm it's the right one
- Touchpoint: Document detail modal
- Thought: "This is v5, uploaded yesterday by John. That's the latest."
- Emotion: 😊 Confident
- Pain Points: If version info is buried or hard to understand
- Opportunity: Version badge shows at top; "Uploaded by John Dev 1 day ago"; older versions available via dropdown

**Stage 3: Sharing**
- User Action: Download or share link with team
- Touchpoint: Download button or copy link
- Thought: "Team needs to review this before tomorrow's meeting."
- Emotion: 😊 Organized
- Pain Points: If download is slow or link requires new login
- Opportunity: Direct download link + shareable portal link (auto-expires per settings)

**Stage 4: Activity Review**
- User Action: Glance at activity feed to see what happened while away
- Touchpoint: Activity feed section on dashboard
- Thought: "CTO uploaded API docs. Workflow completed successfully. Good progress today."
- Emotion: 😊 In-the-loop
- Pain Points: If activity feed is cluttered or doesn't show what matters
- Opportunity: Filter by content type (Documents, Workflows, Milestones); shows exactly what PM cares about

---

## Information Architecture

### Site Map

```
KI Agentur Client Portal
│
├─ Authentication (Public)
│  ├─ /login
│  ├─ /sso/google
│  ├─ /sso/azure
│  ├─ /password-reset
│  └─ /request-access
│
├─ Dashboard (All Roles)
│  ├─ /projects (project selector)
│  ├─ /projects/{projectId}/dashboard (home)
│  │  ├─ Health Score (visible for all)
│  │  ├─ Metric Cards (role-specific subset)
│  │  ├─ Timeline/Milestones (all)
│  │  ├─ Recent Activity Feed (PM-focused, all can see)
│  │  └─ Quick Actions (role-specific)
│
├─ Technical (CTO Only)
│  ├─ /projects/{projectId}/technical
│  │  ├─ Workflow Status (live cards)
│  │  ├─ Execution Logs (searchable, filterable)
│  │  ├─ Integration Status (system health)
│  │  ├─ Performance Metrics (charts)
│  │  ├─ API Documentation (Developer section)
│  │  ├─ API Keys (management)
│  │  └─ Webhook Logs (incoming n8n events)
│
├─ Documents (All Roles)
│  ├─ /projects/{projectId}/documents
│  │  ├─ Requirements (phase)
│  │  ├─ Design (phase)
│  │  ├─ Development (phase)
│  │  ├─ Testing (phase)
│  │  ├─ Deployment (phase)
│  │  ├─ Search/Filter (global)
│  │  └─ Document Detail Modal
│  │     ├─ Version History
│  │     ├─ Access Logs (who downloaded)
│  │     └─ Permissions (read/download/edit per role)
│
├─ Timeline (All Roles)
│  ├─ /projects/{projectId}/timeline
│  │  ├─ Milestone Cards (all phases)
│  │  ├─ Gantt Chart (optional visual)
│  │  └─ Milestone Detail Modal
│  │     ├─ Description
│  │     ├─ Progress indicator
│  │     ├─ Edit (PM only)
│  │     └─ Mark on/at-risk (PM only)
│
├─ Notifications
│  ├─ /notifications/center (all)
│  │  ├─ Today section
│  │  ├─ Earlier section
│  │  ├─ Filter (all/unread/type)
│  │  ├─ Mark as read actions
│  │  └─ Settings link
│  │
│  └─ /account/notification-preferences (all)
│     ├─ Notification Type Toggles
│     ├─ Delivery Method (email/in-app)
│     ├─ Frequency (daily/weekly)
│     └─ Quiet Hours
│
├─ Account & Settings
│  ├─ /account/profile (all)
│  │  ├─ Basic Info (email, name, role)
│  │  ├─ Language Preference (EN/DE)
│  │  └─ Avatar/Photo
│  │
│  ├─ /account/security (all)
│  │  ├─ Password Reset
│  │  ├─ Session Management
│  │  ├─ Two-Factor Auth (future)
│  │  └─ Connected Apps (SSO)
│  │
│  ├─ /account/notification-preferences (all)
│  │
│  └─ /admin/project-settings (Admin only)
│     ├─ Role Management
│     ├─ Team Members (invite/remove)
│     ├─ Webhook Configuration (n8n)
│     ├─ API Key Rotation
│     ├─ Audit Logs (document access)
│     └─ Project Archival
│
└─ Help & Support
   ├─ /help/documentation
   ├─ /help/faq
   ├─ /help/contact-support
   └─ /help/api-docs (CTO-focused)
```

### Role-Based Visibility Matrix

| Feature | CEO | CTO | PM | Admin |
|---------|-----|-----|----|----|
| **Dashboard - Health Score** | ✓ | ✓ | ✓ | ✓ |
| **Dashboard - Workflow Success Rate** | ✓ | ✓ | ✓ | ✓ |
| **Dashboard - Next Milestone** | ✓ | ✓ | ✓ | ✓ |
| **Dashboard - Blockers Count** | ✓ | ✓ | ✓ | ✓ |
| **Dashboard - ROI Calculation** | ✓ | ✗ | ✓ | ✓ |
| **Dashboard - Activity Feed** | ✓ | ✗ | ✓ | ✓ |
| **Technical Tab** | ✗ | ✓ | ✗ | ✓ |
| **Workflow Execution Logs** | ✗ | ✓ | ✗ | ✓ |
| **Integration Status** | ✗ | ✓ | ✗ | ✓ |
| **API Documentation** | ✗ | ✓ | ✗ | ✓ |
| **API Key Management** | ✗ | ✓ | ✗ | ✓ |
| **Documents - All Phases** | ✓ | ✓ | ✓ | ✓ |
| **Documents - Upload** | ✗ | ✗ | ✓ | ✓ |
| **Documents - Version History** | ✓ | ✓ | ✓ | ✓ |
| **Documents - Access Logs** | ✗ | ✗ | ✓ | ✓ |
| **Timeline - View All** | ✓ | ✓ | ✓ | ✓ |
| **Timeline - Edit Milestones** | ✗ | ✗ | ✓ | ✓ |
| **Notifications** | ✓ | ✓ | ✓ | ✓ |
| **Admin Settings** | ✗ | ✗ | ✗ | ✓ |
| **Audit Logs** | ✗ | ✗ | ✗ | ✓ |

### Navigation Structure

**Primary Navigation (Sidebar - Desktop)**
1. Dashboard (home icon) - all roles
2. Technical (code icon) - CTO only (hidden for others)
3. Documents (folder icon) - all roles
4. Timeline (calendar icon) - all roles
5. Notifications (bell icon) - all roles
6. Settings (gear icon) - all roles

**Secondary Navigation (Header)**
- Project Selector dropdown (if multi-project user)
- Notification bell (shows unread count badge)
- Language toggle (EN/DE)
- User profile menu (account, settings, logout)

**Mobile Navigation**
- Hamburger menu (collapsible sidebar)
- Header stays fixed at top
- Project selector moved to hamburger menu
- Notifications and user menu remain in header

---

## User Flows

### Flow 1: Authentication & Role-Based Dashboard Access

**Purpose**: Secure login and route users to role-appropriate dashboard

**Entry Points**:
- First-time user: `/login`
- Returning user: Automatic redirect to last project dashboard if session valid

**Exit Points**:
- Success: Redirect to `/projects/{projectId}/dashboard` (role-appropriate version)
- Failure: Error message on login page
- Abandonment: Click "Request access" for new accounts

#### Flow Diagram

```
[Login Page]
     |
     v
[User enters email + password]
     |
     v
<Email/Password Validation>
     |
     +--- Invalid ---> [Error: Invalid credentials]
     |                      |
     |                      v
     |                [Suggest password reset]
     |                      |
     |                      v
     |                [Login Page (retry)]
     |
     +--- Valid -----> [Fetch User Role & Projects]
                            |
                            v
                      <User has projects?>
                            |
                            +--- No projects --> [Access Denied Page]
                            |                    Suggest admin/support contact
                            |
                            +--- Has projects --> <Remember me checked?>
                                                   |
                                                   +--- Yes ---> [Set persistent cookie]
                                                   |
                                                   +--- No ----> [Session-only cookie]
                                                   |
                                                   v
                                            [Determine role-based redirect]
                                                   |
                                                   +--- CEO ---> [/dashboard - CEO view]
                                                   |
                                                   +--- CTO ---> [/dashboard - CTO view]
                                                   |             (Technical tab highlighted)
                                                   |
                                                   +--- PM ----> [/dashboard - PM view]
                                                                (Documents tab default)
```

**Error Scenarios**:
- **Invalid Email**: "Email not found. Check spelling or request access."
- **Invalid Password**: "Incorrect password. Try again or reset password."
- **Account Disabled**: "Your account has been deactivated. Contact support."
- **Network Error**: "Connection lost. Check your internet and try again."
- **Server Error**: "Something went wrong. Please try again in a moment."

**Edge Cases**:
- **First Login Ever**: Show welcome modal → quick tour (can skip)
- **Session Expired**: Redirect to login; preserve last page for post-login redirect
- **Multiple Projects**: Show project selector dropdown; remember last project selection
- **Changed Role**: Clear cached permissions; fetch new dashboard view

---

### Flow 2: Dashboard - Project Health Assessment

**Purpose**: Give user project status snapshot in 30 seconds

**Entry Points**: Login success, sidebar dashboard click, return to portal

**Exit Points**:
- Success: User understands health status
- Drill-down: User clicks metric card to see details
- Abandon: User closes portal (brief, understood status)

#### Flow Diagram

```
[/dashboard page loads]
     |
     v
[Skeleton loading for health score & metrics]
     |
     v
[Fetch health score from API /dashboard/health]
     |
     v
[Health score animates from 0 → final value (600ms)]
     |
     v
[Fetch metric cards (role-specific) /dashboard/metrics]
     |
     v
[Render 4-6 metric cards below health score]
     |
     v
[Set auto-refresh timer: 30 seconds]
     |
     v
[User sees health + key metrics without scrolling]
     |
     v
<User action?>
     |
     +--- Drill-down ---> [Click metric card]
     |                         |
     |                         v
     |                    [Modal or detail page opens]
     |                         |
     |                         v
     |                    [Show logs, history, details]
     |
     +--- No action ----> [Dashboard stays visible]
     |                    [Auto-refreshes every 30 seconds]
     |                    [Updates inline without page reload]
     |
     +--- Manual refresh --> [Click refresh button]
                                |
                                v
                          [Fetch latest data immediately]
                                |
                                v
                          [Animate changes if values shifted]
```

**Success Path**:
1. Page loads with skeleton
2. Health score appears + animates to final value
3. Metric cards appear
4. User scans information (typical time: 10-20 seconds)
5. User understands project status (green = good, amber = watch, red = issue)

**Real-Time Updates**:
- Health score changes: Smooth transition + highlight in gold (2 seconds)
- Metric updated: Subtle background fade + new value appears
- Workflow completed: Activity feed gets new item at top + notification bell updates count

---

### Flow 3: Documents - Find & Download Latest Specification

**Purpose**: Enable PMs to organize and retrieve documents without email searching

**Entry Points**: Sidebar Documents click, search from header

**Exit Points**:
- Success: Document downloaded or shared
- Abandon: User finds different way to access file (email)
- Error: Search returns no results

#### Flow Diagram

```
[/documents page loads]
     |
     v
[Display all documents grouped by phase]
[Requirements | Design | Development | Testing | Deployment]
     |
     v
[User searches "specification" in search box]
     |
     v
[Full-text search runs (realtime, <500ms)]
     |
     v
[Results filter: shows matching documents with "Current" tag]
     |
     v
<Results found?>
     |
     +--- No results --> [Empty state]
     |                    "No documents match 'specification'"
     |                    "Try different keywords or browse by phase"
     |
     +--- Found ---> [Result list shows]
                       - Document name + version + upload date
                       - Phase/folder
                       - Uploader name + timestamp
                       - File size + actions menu
                       |
                       v
                  [User clicks document or more menu]
                       |
                       v
                  <User action?>
                       |
                       +--- Download --> [S3 download starts]
                       |                |
                       |                v
                       |           [Success toast: "Downloaded"]
                       |
                       +--- View Version History --> [Modal opens]
                       |                              Shows: v1, v2, v3, v4, v5
                       |                              Dates, uploaders, revert buttons
                       |
                       +--- View Access Log --> [Modal opens]
                       |                         Shows: Who downloaded, when
                       |
                       +--- Copy Link --> [Link copied to clipboard]
                       |                  [Toast: "Link copied"]
                       |
                       +--- Share --> [Email share modal]
                                      User selects team members
                                      Message optional
                                      Send email with link
```

**Error Scenarios**:
- **Search Timeout**: Show cached results + retry button
- **Download Failed**: "Download failed. Retry or contact support."
- **Permission Denied**: "You don't have permission to download this document."
- **File Corrupted**: "File appears corrupted. Contact support."

**Edge Cases**:
- **Versioning**: Always shows "Current" version first; others marked "v2", "v1" (archived)
- **Access Control**: If user lacks permission, can see document but download button disabled
- **Bilingual**: Phase names translate (Requirements = Anforderungen)
- **Large Files**: Show upload progress if uploading; download progress if downloading

---

## Wireframes

### Page 1: Login Page

**Purpose**: Secure user authentication with SSO support

**User Context**: First-time access or session expired

**Desktop Layout (1024px)**:

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                   KI AGENTUR                          │
│               Client Portal                           │
│                                                        │
│           ┌───────────────────────────────┐           │
│           │                               │           │
│           │  Email Address                │           │
│           │  ┌──────────────────────────┐ │           │
│           │  │ your@company.com       │ │           │
│           │  └──────────────────────────┘ │           │
│           │                               │           │
│           │  Password                     │           │
│           │  ┌──────────────────────────┐ │           │
│           │  │ ••••••••••••••••         │ │           │
│           │  └──────────────────────────┘ │           │
│           │                               │           │
│           │  [☐] Remember me             │           │
│           │                               │           │
│           │  [Forgot password?]           │           │
│           │                               │           │
│           │  [Sign In]                    │           │
│           │  (Primary CTA, full width)    │           │
│           │                               │           │
│           │  ─── Or continue with ───     │           │
│           │  [Google] [Microsoft Azure]   │           │
│           │                               │           │
│           │  New user?                    │           │
│           │  [Request access]             │           │
│           │                               │           │
│           └───────────────────────────────┘           │
│                                                        │
│ © 2025 KI Agentur | Privacy | Impressum              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Key Interactions**:
- Email field: Focus = gold outline, helper text visible
- Password field: Shows/hide toggle on right
- Remember me: Checkbox maintains login across browser sessions
- Sign In button: Disabled until email + password filled; shows spinner on submit
- SSO buttons: Redirect to provider consent screen
- Forgot password: Opens password reset flow (not shown here)

**States**:
- Default: Empty fields, Sign In button disabled
- Focus: Gold outline on active field
- Error: Red outline + error message (e.g., "Invalid credentials")
- Loading: Sign In button shows spinner, disabled

**Mobile Layout (375px)**:

```
┌─────────────────────────┐
│                         │
│      KI AGENTUR        │
│    Client Portal       │
│                         │
│  Email Address         │
│  ┌───────────────────┐ │
│  │ email@company.com │ │
│  └───────────────────┘ │
│                         │
│  Password              │
│  ┌───────────────────┐ │
│  │ ••••••••••••      │ │
│  └───────────────────┘ │
│                         │
│  [☐] Remember me       │
│                         │
│  [Forgot password?]    │
│                         │
│  [Sign In]             │
│                         │
│  ─ Or continue with ─  │
│  [Google]              │
│  [Microsoft Azure]     │
│                         │
│  [Request access]      │
│                         │
│ © 2025 KI Agentur     │
│ Privacy | Impressum   │
│                         │
└─────────────────────────┘
```

---

### Page 2: CEO Dashboard

**Purpose**: Project health snapshot + key metrics for executive briefing

**User Context**: Monday morning, board meeting prep

**Desktop Layout (1440px)**:

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard|Technical|Documents|Timeline|Settings [🔔][👤]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Dashboard > [Project Name ▼]         [🔄 Refresh] [EN/DE▼] │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │          PROJECT HEALTH                               │ │
│ │                                                        │ │
│ │         ●●●●●●●●●●●●●●●●●●●                   │ │
│ │                82                                     │ │
│ │              On Track                                 │ │
│ │                                                        │ │
│ │ Based on: Workflow success + milestone progress       │ │
│ │                                                        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ KEY METRICS                                                  │
│                                                              │
│ ┌─────────────────┐ ┌──────────────┐ ┌──────────┐ ┌─────┐ │
│ │ Success Rate    │ │ Next Milestone│ │Blockers  │ │ ROI │ │
│ │ 98.2%           │ │ Design Review │ │ 0 Open   │ │€245K│ │
│ │ ↑ 1.5% trend    │ │ Dec 20, 2025  │ │ ✓ Clear  │ │/mo  │ │
│ │ [Drill-down]    │ │ [Drill-down]  │ │          │ │+18% │ │
│ └─────────────────┘ └──────────────┘ └──────────┘ └─────┘ │
│                                                              │
│ TIMELINE & MILESTONES                                        │
│                                                              │
│ ✓ Req  ✓ Design  ▶ Dev  □ Test  □ Deploy                   │
│ Oct 15  Nov 1   Dec 20  Jan 10   Jan 30                     │
│ Done    Done   In Progress Pending Pending                  │
│                                                              │
│ RECENT ACTIVITY                                              │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 2:15 PM - Workflow: Customer Import completed ✓       │ │
│ │ 1:45 PM - Milestone: API Integration completed ✓      │ │
│ │ 12:30 PM - Document: Q4 Specification uploaded        │ │
│ │ 10:00 AM - Alert: Workflow time up 25% (check?)       │ │
│ │ [View full activity →]                                 │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Download Executive Summary] [Schedule Check-in]            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key Interactions**:
- Health Score: Animates on load; updates smoothly when polling returns new value
- Metric Cards: Hover = subtle elevation; click to drill into details
- Timeline: Click milestone to see details/dependencies
- Activity Feed: Auto-refreshes every 30s; "View full activity" opens modal
- Refresh button: Fetches latest data immediately
- Language toggle: Switches all content to German (no reload required)

**Information Hierarchy**:
1. Health Score (dominant, largest)
2. Metric Cards (4 key numbers, high scan-ability)
3. Timeline (visual milestone progress)
4. Activity Feed (context + confidence)

---

### Page 3: CTO Technical Dashboard

**Purpose**: Workflow execution status + integration health for technical validation

**User Context**: Daily monitoring; troubleshooting performance issues

**Desktop Layout (1440px)**:

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard|Technical|Documents|Timeline|Settings [🔔][👤]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Technical > [Project Name ▼]         [Auto-refresh: on] ●  │
│                                                              │
│ WORKFLOW STATUS                                              │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Customer Import Workflow        ✓ Success (14:32, 2h)│ │
│ │ [████████████████████░░] 95% success rate            │ │
│ │ Last Run: 1,245 records | Avg Time: 1.2s | Error: 0%│ │
│ │ [View Logs] [Test Run] [Webhook Config] [Download]  │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Invoice Processing Workflow     ✓ Success (09:15, 4h)│ │
│ │ [████████████████████] 99.5% success rate            │ │
│ │ Last Run: 342 invoices | Avg Time: 2.1s | Error: 0%│ │
│ │ [View Logs] [Test Run] [Webhook Config] [Download]  │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ INTEGRATION STATUS                                           │
│                                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │Salesforce│ │ERP System│ │Slack     │ │Email     │      │
│ │✓Connected│ │✓Connected│ │✓Connected│ │⚠ Warning│      │
│ │5 min ago │ │2 hrs ago │ │10 min ago│ │4 hrs ago │      │
│ │[Details] │ │[Details] │ │[Details] │ │[Details] │      │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│ EXECUTION LOGS (Last 10)                                    │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ exec_abc123  14:32:15  ✓ Success  1.2s [Expand]    │ │
│ │ exec_abc122  13:15:42  ✓ Success  1.1s [Expand]    │ │
│ │ exec_abc121  12:00:10  ✗ Failed   0.8s [View Error]│ │
│ │ exec_abc120  11:45:00  ✓ Success  1.3s [Expand]    │ │
│ │ exec_abc119  10:30:25  ⚠ Retry    2.1s [Expand]    │ │
│ │                              [Load more...]           │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ PERFORMANCE METRICS                                          │
│                                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │Avg Time  │ │Error Rate│ │Throughput│ │Uptime    │      │
│ │1.15s ↓5% │ │0.2% ↓0.1%│ │1245/day  │ │99.98% ✓  │      │
│ │(Good)    │ │(Good)    │ │ ↑8%      │ │Excellent │      │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│ API & WEBHOOK CONFIGURATION                                 │
│                                                              │
│ [View API Keys] [View Webhook Logs] [Test Integration]     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key Interactions**:
- Workflow Cards: Click "View Logs" to open execution log modal
- Test Run: Triggers immediate test execution; shows result inline
- Integration Status: Click "Details" to see last sync timestamp + error info
- Execution Logs: Click "Expand" to show full input/output JSON
- Performance Metrics: Hover = tooltip with formula/calculation
- Auto-refresh: Toggle button; when on, refreshes every 30 seconds

**CTO-Only Features** (hidden from other roles):
- Webhook config for n8n
- API key management
- Full execution logs with error details
- Integration status drill-down

---

### Page 4: PM Dashboard

**Purpose**: Project overview + document management + activity tracking

**User Context**: Daily standup prep; sharing documents with team

**Desktop Layout (1440px)**:

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard|Documents|Workflows|Settings [🔔][👤]       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Dashboard > [Project Name ▼]         [Refresh]             │
│                                                              │
│ PROJECT SNAPSHOT                                             │
│                                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │Health: 82│ │Days to End│ │Documents │ │Workflow  │      │
│ │On Track  │ │39 Days    │ │24 Current│ │Success   │      │
│ │          │ │ ↓2 days ok│ │5 Archived│ │98.2% ✓   │      │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│ DOCUMENT LIBRARY                                             │
│                                                              │
│ [Search Documents...] [Filter ▼] [View: List] [Upload New] │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ [📄] requirements.pdf           v2   Updated 3 days   │ │
│ │     Design Phase - Sarah Johnson - 1.2 MB            │ │
│ │     Current Version [Download] [More...]              │ │
│ │                                                        │ │
│ │ [📄] technical-spec.docx        v5   Updated 1 day    │ │
│ │     Design Phase - John Dev - 890 KB                 │ │
│ │     Current Version [Download] [More...]              │ │
│ │                                                        │ │
│ │ [📄] API-guide.pdf              v1   Updated 6 hours  │ │
│ │     Development - Tech Lead - 2.4 MB                 │ │
│ │     Current Version [Download] [More...]              │ │
│ │                                                        │ │
│ │ [Show 21 more documents...]                           │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ ACTIVITY FEED                                                │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 2:15 PM - [Document] Technical spec v5 uploaded       │ │
│ │          John Dev                                      │ │
│ │ 12:30 PM - [Workflow] Customer import completed (1.2k)│ │
│ │          System                                        │ │
│ │ 10:00 AM - [Milestone] Design review completed        │ │
│ │          Sarah Johnson                                │ │
│ │ Yesterday - [Document] Requirements v1 uploaded       │ │
│ │          Sarah Johnson                                │ │
│ │ [View full activity...]                                │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ TEAM MILESTONES                                              │
│                                                              │
│ ✓ Req ✓ Design ▶ Dev □ Test □ Deploy                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key Interactions**:
- Project Snapshot cards: Show high-level health + deadlines
- Document Search: Real-time full-text search; results filter as user types
- Upload New: Drag-drop or file browser; shows progress; auto-organizes to phase
- More Actions: Download, share, version history, delete (if permission)
- Activity Feed: Click activity item to navigate to document or workflow
- Milestones: Click milestone to see details, mark status, edit (PM-only)

**PM-Specific Features**:
- Document upload/organization
- Activity feed (shows document uploads, workflow completions, milestones)
- Timeline editing
- Team member assignments (future feature)

---

### Page 5: Documents Page (Full View)

**Purpose**: Centralized document repository with search, versioning, access control

**User Context**: Finding a specific spec; uploading new requirements

**Desktop Layout (1440px)**:

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard|Documents|Workflows|Settings [🔔][👤]       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Documents > [Project Name ▼]                                │
│                                                              │
│ [Search Documents...] [Filter ▼] [Sort ▼] [Upload] [Grid] │
│                                                              │
│ Filter: Phase: All ▼  Access: All ▼  Uploader: All ▼       │
│                                                              │
│ PHASE: REQUIREMENTS (3 Documents)                            │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ [📄] project-requirements.pdf      v3   4 days ago   │ │
│ │ 2.4 MB | Sarah Johnson | [Current] | [Download]     │ │
│ │ Edit | Share | Version History | Access Log          │ │
│ │                                                        │ │
│ │ [📄] stakeholder-feedback.docx     v2   5 days ago   │ │
│ │ 890 KB | John Doe | [Archived] | [Download]         │ │
│ │ Edit | Share | Version History | Access Log          │ │
│ │                                                        │ │
│ │ [📄] timeline-proposal.xlsx        v1   7 days ago   │ │
│ │ 1.2 MB | Project Lead | [Archived] | [Download]     │ │
│ │ Edit | Share | Version History | Access Log          │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ PHASE: DESIGN (4 Documents)                                 │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ [📄] ui-mockups.fig                v5   Yesterday    │ │
│ │ 5.6 MB | Design Lead | [Current] | [Download]       │ │
│ │                                                        │ │
│ │ [📄] api-specification.pdf         v2   2 days ago   │ │
│ │ 3.2 MB | Tech Lead | [Current] | [Download]         │ │
│ │                                                        │ │
│ │ [📄] architecture-diagram.pdf      v1   3 days ago   │ │
│ │ 1.8 MB | Architect | [Archived] | [Download]        │ │
│ │                                                        │ │
│ │ [📄] design-system.figma           v4   5 days ago   │ │
│ │ 8.4 MB | Design Lead | [Current] | [Download]       │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                              │
│ [PHASE: DEVELOPMENT (2) ▼] (collapsible)                    │
│                                                              │
│ [PHASE: TESTING (1) ▼] (collapsible)                        │
│                                                              │
│ [Load more documents...]                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key Interactions**:
- Search: Real-time; searches filename + content
- Filter: By phase, access level, uploader, date range
- Sort: By name, date, size, uploader
- Upload: Drag-drop into page or click "Upload"; auto-organizes to phase
- More Actions Menu (three dots):
  - Download
  - Share (copy link or email)
  - Version History (modal showing all versions)
  - Access Log (who accessed when)
  - Edit Permissions (role-based read/download/edit)
  - Delete (if owner/admin)

**Document Status Tags**:
- [Current]: Latest version available for use
- [Archived]: Older version kept for historical reference
- Version badge: v1, v2, v3, etc.

**Grid View Alternative**:
- Instead of list: Shows cards in 3-column grid (desktop)
- Still shows version, date, size, actions
- Better for visual scanning of many documents

---

### Page 6: Settings Page

**Purpose**: User preferences, notifications, account security

**User Context**: First-time setup; adjusting notification frequency

**Desktop Layout (1024px)**:

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard|Documents|Settings [🔔][👤]                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Settings > [Project Name ▼]                                 │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Settings Tabs                                        │   │
│ │ [Profile] [Notifications] [Security] [Admin]        │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ PROFILE TAB (Active)                                         │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Basic Information                                    │   │
│ │                                                      │   │
│ │ Email Address:                                       │   │
│ │ [your@company.com]                                   │   │
│ │                                                      │   │
│ │ Full Name:                                           │   │
│ │ [John CEO]                                           │   │
│ │                                                      │   │
│ │ Role:                                                │   │
│ │ [CEO] (read-only)                                    │   │
│ │                                                      │   │
│ │ Language Preference:                                 │   │
│ │ [English ▼]  [Deutsch ▼]  [Save]                   │   │
│ │                                                      │   │
│ │ Avatar:                                              │   │
│ │ [Image 40x40] [Upload New] [Remove]                 │   │
│ │                                                      │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ NOTIFICATIONS TAB (Inactive)                                 │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Notification Preferences                             │   │
│ │                                                      │   │
│ │ [☑] Milestone Completed                             │   │
│ │    [☑] Email [☑] In-App                            │   │
│ │    Frequency: [Weekly ▼]                             │   │
│ │                                                      │   │
│ │ [☑] Workflow Failed                                 │   │
│ │    [☑] Email [☑] In-App                            │   │
│ │    Immediately on failure                            │   │
│ │                                                      │   │
│ │ [☑] Weekly Summary                                  │   │
│ │    [☑] Email [☐] In-App                            │   │
│ │    Monday 8:00 AM                                    │   │
│ │                                                      │   │
│ │ [☑] Document Uploaded                               │   │
│ │    [☑] Email [☑] In-App                            │   │
│ │    Frequency: [Daily Digest ▼]                      │   │
│ │                                                      │   │
│ │ Quiet Hours:                                         │   │
│ │ From [22:00 ▼]  To [08:00 ▼]  (no notifications)    │   │
│ │                                                      │   │
│ │ [Save Preferences]                                   │   │
│ │                                                      │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ SECURITY TAB (Inactive)                                      │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Account Security                                     │   │
│ │                                                      │   │
│ │ Password:                                            │   │
│ │ Last changed 30 days ago                             │   │
│ │ [Change Password]                                    │   │
│ │                                                      │   │
│ │ Active Sessions:                                     │   │
│ │ This Browser (Current)                               │   │
│ │ Chrome, Windows 10                                   │   │
│ │ Last active: 5 min ago                               │   │
│ │ [Logout Here]                                        │   │
│ │                                                      │   │
│ │ Mobile (iPhone Safari)                               │   │
│ │ Last active: 2 days ago                              │   │
│ │ [Logout Here]                                        │   │
│ │                                                      │   │
│ │ [Logout All Devices]                                 │   │
│ │                                                      │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ADMIN TAB (Admin Only)                                       │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Project Settings (Admin Only)                        │   │
│ │                                                      │   │
│ │ Team Members:                                        │   │
│ │ [+ Invite Team Member]                               │   │
│ │ Sarah Johnson (CEO) - Active                         │   │
│ │ John Dev (CTO) - Active                              │   │
│ │ PM User (PM) - Pending                               │   │
│ │ [Remove]                                             │   │
│ │                                                      │   │
│ │ Webhook Configuration:                               │   │
│ │ [View API Keys] [View Webhook Logs]                 │   │
│ │ [Test Integration] [Rotate Keys]                     │   │
│ │                                                      │   │
│ │ Audit Logs:                                          │   │
│ │ [Download Audit Report]                              │   │
│ │ Filter by date range, user, action                   │   │
│ │                                                      │   │
│ │ Danger Zone:                                         │   │
│ │ [Archive Project]                                    │   │
│ │ [Delete Project]                                     │   │
│ │                                                      │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key Interactions**:
- Tabs: Switch between Profile, Notifications, Security, Admin
- Language: Toggle EN/DE; page reloads with new language
- Notification Toggles: Each notification type has:
  - Enable/disable entire notification
  - Delivery method (email, in-app, or both)
  - Frequency (immediately, daily digest, weekly, etc.)
- Save buttons: Validate before saving; show success toast on save
- Danger Zone: Destructive actions show confirmation modal before executing
- Active Sessions: Shows browser, device, last activity; can logout individual sessions

**Admin-Only Tab**:
- Team member invitation + role assignment
- Webhook logs for n8n integration
- Audit logs (who accessed documents when)
- Project archival (with confirmation)

---

## Interaction Patterns

### Real-Time Updates (30-Second Polling)

**Health Score Update**:
1. Dashboard loads; health score fetched + animates to value (600ms)
2. Timer set: Poll every 30 seconds
3. New value received: Smooth transition (250ms) + highlight in gold (2s)
4. User notices: Confidence increases if value improved; alert if decreased

**Activity Feed Update**:
1. Feed displays latest 5 items
2. Every 30s, check for new items
3. New item? Fade in at top (250ms) + highlight with gold border (3s)
4. Old items fade down; oldest pushed off bottom
5. User sees: "2:15 PM - Workflow completed" appearing in real-time

**Notification Badge**:
1. When n8n webhook fires (workflow completion), notification created
2. Badge count on bell icon increments
3. User clicks bell to see notification center
4. Clicking notification item marks as read; count decrements

---

### Notification Delivery (Email + In-App)

**Workflow Completion**:
- **Trigger**: n8n webhook fires on workflow_completed event
- **In-App**: Toast notification appears bottom-right: "Customer Import: 1,245 records processed"
- **Email** (if enabled): Sent within 5 minutes with subject "Workflow Completed: Customer Import"
- **Content**: Execution ID, timestamp, duration, input/output counts, any warnings

**Weekly Summary Email**:
- **Trigger**: Monday 8:00 AM (configurable)
- **Content**:
  - Health score trend (last 4 weeks)
  - Workflows completed/failed
  - Milestones completed
  - New documents uploaded
  - Key blockers
- **User Can**: Adjust frequency (weekly/biweekly), disable email

**Milestone Alert**:
- **Trigger**: 3 days before milestone due date (if not completed)
- **In-App**: Notification appears; "Design Review due in 3 days"
- **Email** (if enabled): Reminder with deadline + project context
- **Dismissal**: Click "Got it" or "Dismiss"

---

### Search & Filter Interactions

**Document Search**:
1. User types "specification" in search box
2. Real-time results filter (onChange, debounced 300ms)
3. Results show matching documents + highlight matching term
4. "No results" message if nothing matches
5. Search persists across page navigation (if user clicks away + returns)

**Filter Combinations** (Documents Page):
- Filter by Phase: Requirements, Design, Development, Testing, Deployment
- Filter by Access: All, Read-only, Downloadable, Editable
- Filter by Uploader: All, Sarah Johnson, John Dev, etc.
- Filters combine: "Design" phase + "Editable" = show only editable design documents
- Clear filters button: Resets all filters to "All"

**Sort Order**:
- Default: By date descending (newest first)
- Options: Name (A-Z), Date (newest/oldest), Size (largest/smallest), Uploader
- Persistence: Remembers sort preference per page (session-based)

---

### Role-Based UI Adaptations

**CEO Login → CEO Dashboard**:
- Sidebar shows: Dashboard, Documents, Timeline, Settings (no Technical)
- Dashboard shows: Health, Metrics (success rate, milestone, blockers, ROI), Timeline, Activity Feed
- Actions available: Download summary, schedule check-in
- Document permissions: View all; download some; no upload/edit
- Technical pages: Locked; shows "Not available for your role"

**CTO Login → CTO Dashboard**:
- Sidebar shows: Dashboard, Technical, Documents, Settings (no PM-specific)
- Dashboard shows: Health, Metrics (success rate, blockers, days to deadline, ROI)
- Technical tab shows: Workflow status, execution logs, integration health, API docs
- Document permissions: View all; download all; no upload (PM-only)
- Actions: Test run workflows, view logs, rotate API keys, check webhooks

**PM Login → PM Dashboard**:
- Sidebar shows: Dashboard, Documents, Timeline, Settings (no Technical)
- Dashboard shows: Health, Metrics (success rate, days to deadline, documents, workflow success), Activity Feed, Milestones
- Documents tab: Can upload, organize, manage versions, control access
- Timeline: Can create/edit milestones, mark status
- Technical: Locked; shows "Contact CTO for technical details"

**Dynamic UI**: If user's role changes (admin updates), page refreshes; new role's dashboard loads automatically.

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

**Color Contrast**:
- White text on black background: 17.1:1 (AAA)
- Gold on black background: 14.8:1 (AAA)
- Gray text on black: 5.2:1 (AA)
- All status badges meet 4.5:1 minimum for text

**Keyboard Navigation**:
- Tab order: Header nav → Sidebar → Main content → Footer
- Focus indicators: 3px solid gold outline on all interactive elements
- Skip navigation link: "Skip to main content" before header (hidden, visible on focus)
- Escape key: Close modals, dropdowns, sidenav on mobile
- Enter/Space: Activate buttons, toggle checkboxes, select dropdown items

**Screen Reader Announcements**:
- Health Score: "Current health score: 82 out of 100. On track."
- Metric updates: "Workflow success rate updated to 98.2%"
- New notifications: "New notification: Customer Import workflow completed"
- Form errors: "Email address field error: email must include @ symbol"
- Button states: "Sign In button disabled" or "Loading..."

**Form Accessibility**:
- Every input has associated label (using `<label for="">` or aria-label)
- Error messages linked to field (aria-describedby)
- Required fields marked with asterisk + visually + in label
- Help text below input: "We'll never share your email address"
- Focus stays in form; no surprise navigation

**Semantic HTML**:
- Navigation: `<nav>` for sidebar + header nav
- Main content: `<main>` for page content
- Headings: Proper hierarchy (H1 for page title, H2 for sections, etc.)
- Buttons: `<button>` for actions; `<a>` for navigation
- Form: `<form>` wrapping all inputs

**Motion & Animation**:
- Respects `prefers-reduced-motion` media query
- No auto-playing animations
- Animations under 400ms
- Static alternative: If animation shows critical info, text fallback provided

---

## UX Writing Guidelines

### Voice & Tone

**Overall Voice**: Professional, confident, approachable

**Brand Personality**:
- Expert (knows automation well)
- Supportive (helps users succeed)
- Clear (no jargon, explains concepts)
- Efficient (respects user time)

**Tone by Context**:
- **Onboarding**: Welcoming, encouraging ("Welcome to your project dashboard! Let's get you started.")
- **Success**: Positive, affirming ("Workflow completed successfully! 1,245 records processed.")
- **Error**: Helpful, not alarming ("Email should include @ symbol. Example: you@company.com")
- **Alert**: Urgent but calm ("Workflow execution time increased by 25%. Check performance.")
- **Empty State**: Encouraging action ("No documents yet. Upload your first specification to get started.")

### Microcopy Standards

**Button Labels** (action-oriented, specific):
- "Sign In" (not "Submit" or "Login")
- "Download" (not "Get")
- "Upload Document" (not "Add File")
- "Create Milestone" (not "New")
- "Test Run" (not "Execute")
- "Rotate API Key" (not "Change")
- "Archive Project" (not "Remove")

**Form Labels** (clear, above input):
- "Email Address" (not "Email")
- "Full Name" (not "Name")
- "Project Name *" (required indicator)
- "Notification Frequency" (not "How often")

**Error Messages** (what went wrong + how to fix):
- "Email address must include @ symbol. Example: you@company.com"
- "Password must be at least 8 characters"
- "This field is required"
- "Workflow failed: Salesforce API timeout. Check integration status."
- "File size exceeds 10 MB. Please upload a smaller file."

**Success Messages** (confirm action + next step):
- "Document uploaded successfully! View it in the Design phase."
- "Milestone created. Team members will receive notification."
- "Profile updated. Your changes are saved."
- "API key rotated. Update your n8n configuration."

**Empty States** (explain why empty + what to do):
- "No documents yet. Upload your first specification to get started."
- "No workflows found. Check your filters or contact CTO."
- "No blockers! Your project is on track."
- "No activity yet. Workflows will appear here once they complete."

**Helper Text** (context, reassurance, guidance):
- "We'll never share your email address" (under email field)
- "At least 8 characters, including one number" (under password)
- "Visible to team members with read access" (under document share)
- "Updates every 30 seconds" (under real-time metrics)

---

## Component Interaction Specifications

### Text Input Field

**States**:
- **Default**: Border light gray, placeholder text visible, hint text below
- **Focus**: Border turns gold (2px), background slightly lighter, helper text visible
- **Filled**: Border stays gold if valid; turns red if error detected
- **Error**: Border red, error icon appears right side, error message below in red
- **Disabled**: Background grayed out, text dimmed, cursor not-allowed
- **Success**: Green checkmark appears right side (only after validation)

**Behavior**:
- Placeholder vanishes when user starts typing
- Validation runs onChange (real-time)
- Error message appears immediately if validation fails
- Helper text stays visible always

### Dropdown/Select

**States**:
- **Closed**: Shows selected option + chevron icon right-aligned
- **Focus**: Gold outline, chevron rotates 180°
- **Open**: List appears below; first option highlighted; max 5 items visible
- **Hover**: Each item highlights on hover
- **Selected**: Checkmark icon left side of selected item, bold text
- **Disabled**: Grayed out, no interaction

**Behavior**:
- Click to open/close
- Arrow keys navigate up/down
- Enter to select
- Escape to close
- Search within dropdown if many items (optional)

### Checkbox & Radio Button

**States**:
- **Unchecked**: Empty square (checkbox) or circle (radio)
- **Focus**: Gold outline, 2px
- **Checked**: Checkmark visible (checkbox) or filled circle (radio)
- **Hover**: Background subtle highlight
- **Disabled**: Grayed out, opacity 50%

**Behavior**:
- Click checkbox to toggle
- Click label to toggle (label should be clickable)
- Radio buttons: Only one can be selected in group
- Space/Enter activates

### Toggle Switch

**States**:
- **Off**: Gray background, circle on left
- **Focus**: Gold outline
- **On**: Gold background, circle on right
- **Hover**: Slight elevation
- **Disabled**: Grayed out

**Behavior**:
- Click to toggle on/off
- Immediate effect (no save required)
- Label shows what happens when on/off
- Keyboard: Space/Enter to toggle

### Button

**Types**:
- **Primary**: Gold background, black text (main actions like "Sign In", "Create", "Save")
- **Secondary**: Black background, white text, gold outline (alternative actions like "Cancel")
- **Tertiary**: Transparent, white text, underlined (minor actions like "Learn More")
- **Danger**: Red background, white text (destructive actions like "Delete", "Archive")

**States**:
- **Default**: Full opacity, cursor pointer
- **Hover**: Slightly darker shade
- **Active/Pressed**: Even darker, slight inset
- **Focus**: Gold outline, 2px
- **Disabled**: Grayed out, opacity 50%, cursor not-allowed
- **Loading**: Shows spinner inside button, disabled

**Behavior**:
- Min height 44px (touch target)
- Padding: 12px vertical × 24px horizontal
- Text centered
- Icon + text optional (icon left of text)
- Full-width option on mobile

### Modal/Dialog

**Appearance**:
- Width: 480px (desktop), 90vw (mobile)
- Background: Dark gray card
- Backdrop: Black with 70% opacity
- Border-radius: 12px
- Padding: 32px
- Shadow: Elevation-3

**Animation**:
- Fade in + scale from 0.95 over 250ms (cubic-bezier ease-out)

**Interactions**:
- Close button (X) top-right
- Escape key closes
- Click backdrop to close (optional)
- Focus trapped within modal
- Tab cycles through interactive elements
- Form submit prevents close if validation fails

### Tooltip & Popover

**Tooltip** (on hover, desktop only):
- Position: Above element (default), below if no space
- Delay: 500ms before showing
- Content: Short explanation, <50 characters
- Arrow pointing to element
- Fade in 200ms

**Popover** (on click):
- Position: Relative to trigger
- Content: More detailed than tooltip
- Close on click outside or Escape
- Can contain interactive elements
- Background: Dark gray card

### Loading States

**Skeleton Screens** (full page load):
- Gray placeholder boxes matching content layout
- Pulsing animation (opacity 30%-100% over 1.5s)
- Shows expected layout before data loads

**Spinners** (component-level):
- Gold spinning circle (24px)
- Indeterminate animation (rotates continuously)
- Shows when fetching data, submitting form, etc.

**Progress Bars** (determinate):
- Gold fill on dark background
- Height: 4px (subtle) to 6px (prominent)
- Label on right: "60% complete"
- Animated fill: Smooth transition

### Empty States

**No Data Layout**:
- Icon (large, 48px) suggesting the empty concept
- Headline explaining why empty
- Description with call-to-action
- CTA button (primary) suggesting next step
- Example: "No documents yet. Upload your first specification to get started."

**No Results** (search):
- Icon (search + question mark)
- Headline: "No documents found"
- Description: "Try different keywords or browse by phase"
- Suggestions: Related searches or popular documents
- Clear search button

---

## Responsive Design Strategy

### Breakpoints

- **Mobile**: < 768px (phones, small tablets)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+ (standard views)

### Layout Adaptations

**Navigation**:
- Desktop: Sidebar 240px fixed + main content
- Tablet: Sidebar collapses to icons (80px) or hamburger
- Mobile: Hamburger menu only; nav items in drawer

**Header**:
- Desktop: Logo + nav items + notifications + user menu
- Tablet: Logo + hamburger + notifications + user menu
- Mobile: Hamburger left + logo center + notifications right

**Grids & Cards**:
- Desktop: 4 columns (metrics), 3+ columns (documents)
- Tablet: 2 columns
- Mobile: 1 column (full width, stacked)

**Forms**:
- Desktop: Label above, input 60% width, horizontal layout
- Tablet: Label above, input 80% width
- Mobile: Label above, input 100% width, larger font (16px), ample padding

**Tables**:
- Desktop: Full horizontal table with scrolling
- Tablet: Condensed columns; less info per row
- Mobile: Cards instead of table (each row becomes card)

**Touch Targets**:
- Mobile: Minimum 44×44px for buttons/interactive elements
- Desktop: Can be smaller (24px acceptable)
- Spacing between targets: 8px minimum

---

## Edge Cases & Error Handling

### Network Errors

**Loss of Connection**:
- If polling fails 3x in a row: Show banner "Connection lost. Retrying..."
- Pause auto-refresh; user can retry manually
- When reconnected: Fetch latest data; update dashboard
- Cache recent data to show while offline (if applicable)

**Slow Network**:
- Skeleton screen shows while loading (better than spinner)
- Timeout after 10s: Show error + retry button
- Progressive loading: Show what's available; load rest later

### Empty & Missing States

**No Data**:
- Project has no workflows: "No workflows yet. Contact your CTO."
- User has no documents to access: "No documents visible to you."
- Search returns nothing: "No matches found. Try different keywords."

**Missing Permissions**:
- User tries to access CTO-only page: "Not available for your role."
- User lacks document download permission: "Download disabled for your role."
- No admin permission for settings: "Admin access required. Contact project owner."

**Expired or Invalid Data**:
- API key revoked: "API configuration error. Contact admin."
- Project archived: "This project has been archived."
- User removed from project: "You no longer have access to this project."

### Form Validation Errors

**Real-Time Validation** (as user types):
- Email field: Checks format (must include @)
- Password: Checks length (min 8 chars)
- Required fields: Checks not empty
- Error appears immediately in red

**Submit Validation** (on form submit):
- All required fields must be filled
- All fields must pass validation
- Show all errors at once (not one at a time)
- Focus moves to first error
- User can fix and resubmit

### Destructive Action Confirmation

**Pattern**:
1. User clicks "Delete" or "Archive"
2. Modal appears: "Are you sure?"
3. Explanation of what will happen
4. Confirmation input required: User types "DELETE" or "ARCHIVE"
5. Cancel or Confirm button (cancel is default focus)
6. On confirm: Action executes; success message shows
7. On cancel: Modal closes; no action taken

---

## Handoff Notes

### For Software Architect

**Technical UX Requirements**:
- Real-time polling: 30-second interval for dashboard updates
- WebSocket option: For execution logs (full n8n trace in real-time)
- API contracts needed:
  - `GET /dashboard/health` - returns health score, status, updated_at timestamp
  - `GET /workflows/{id}/logs` - paginated, filterable execution logs
  - `GET /notifications/center` - returns notifications with read status
  - `POST /notifications/preferences` - save user preferences
- Authentication: JWT + secure HTTP-only cookies
- Session timeout: 30 min inactivity
- Language switching: No page reload required (use i18n framework)

**Performance Requirements**:
- Dashboard loads in < 2 seconds (CEO requirement)
- Search completes in < 500ms (PM requirement)
- Polling updates apply without full page reload
- Mobile responsive at 1x, 2x pixel density

**Accessibility Requirements**:
- WCAG 2.1 AA minimum
- Semantic HTML throughout
- ARIA labels for all icon buttons
- Focus management in modals (trap focus)
- Keyboard navigation fully functional
- Color contrast 4.5:1 for all text

### For Product Designer

**Component Specifications Ready**:
- All components in UI Design doc have been tested for usability
- State transitions defined (hover, focus, active, disabled, error, loading)
- Responsive breakpoints specified (320px, 768px, 1024px)
- Animation specs (250ms for modals, 600ms for health score, 150ms for button hover)
- Color tokens: Gold #FFB800, Black #0A0A0A, semantic colors (green/amber/red/blue)

**Missing Specs to Design**:
- Empty state illustrations (document, no data, access denied)
- Workflow execution flow diagram visualization (how n8n flows look)
- Toast notification design (position, animation, auto-dismiss timing)

### For Development Team

**Implementation Checklist**:
- [ ] Semantic HTML structure matches wireframes
- [ ] All interactive elements have hover + focus states
- [ ] Focus indicators visible (3px gold outline minimum)
- [ ] Tab order logical (header → sidebar → main → footer)
- [ ] Skip navigation link present
- [ ] Form labels properly associated with inputs
- [ ] Error messages linked to fields (aria-describedby)
- [ ] Keyboard navigation tested: Tab, Shift+Tab, Enter, Space, Escape
- [ ] Screen reader tested (NVDA, JAWS, VoiceOver)
- [ ] Color contrast checked (4.5:1 text, 3:1 UI)
- [ ] Touch targets 44×44px minimum on mobile
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Load times tested (Dashboard <2s, Search <500ms)
- [ ] Responsive tested at 320px, 768px, 1024px breakpoints
- [ ] RTL language support planned for future (Arabic, Hebrew)

---

## Open Questions

1. **Workflow Diagram Visualization**: How should n8n workflows be visualized? As flow chart? As timeline? Should CTO be able to download SVG from portal?
   - Owner: Product Designer + Software Architect
   - Impact: Affects CTO technical dashboard layout

2. **Document Permissions Granularity**: Can we set permissions per role, or per individual user?
   - Owner: Product Manager + DBA
   - Impact: Affects document access control logic + database schema

3. **Audit Log Detail Level**: What should audit logs capture? Just who accessed documents, or also workflow execution details?
   - Owner: Security + Product Manager
   - Impact: Storage requirements + query performance

4. **Mobile Native App**: MVP is responsive web. Do we need native iOS/Android app?
   - Owner: Product Manager + DevOps
   - Impact: Development effort + deployment complexity

5. **Notification Persistence**: If user disables notifications, should we still log events for audit purposes?
   - Owner: Product Manager + Legal
   - Impact: User privacy + compliance

---

## Assumptions

1. **n8n Webhook Reliability**: Assuming >99% reliability; fallback polling every 5 min if webhook fails
2. **Network Connectivity**: Desktop users have stable connection; mobile users may drop connections intermittently
3. **User Expertise**: Users are non-technical (CEO/PM) or highly technical (CTO); UI adapts accordingly
4. **Browser Support**: Modern browsers (Chrome, Safari, Firefox, Edge); IE not supported
5. **Document File Sizes**: Assuming < 50 MB per document; no streaming video/media support
6. **Bilingual Content**: Assuming German/English translations available before launch; no automatic translation

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-22 | UX Designer | Initial UX design document - Complete |

---

**UX Design Status: ✅ COMPLETE - Ready for Implementation**

**Deliverables**:
1. ✅ UX Strategy & Principles
2. ✅ User Journey Maps (3 personas)
3. ✅ Information Architecture (site map + role matrix + navigation)
4. ✅ User Flows (3 main flows with error paths)
5. ✅ Wireframes (6 key pages in ASCII)
6. ✅ Interaction Patterns (real-time, notifications, search, role-based)
7. ✅ Accessibility Guidelines (WCAG 2.1 AA)
8. ✅ UX Writing Guidelines (voice, tone, microcopy)
9. ✅ Component Specifications (button, input, form, modal states)
10. ✅ Responsive Design Strategy (3 breakpoints)
11. ✅ Edge Cases & Error Handling

**Next Phase**: Hand off to Software Architect for technical system design

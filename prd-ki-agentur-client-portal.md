# Product Requirements Document: KI Agentur Client Portal

**Version**: 1.0 | **Date**: 2025-11-22 | **Status**: Ready for Design Phase | **Author**: Senior Product Manager

---

## Executive Summary

KI Agentur Client Portal is a premium, automation-native transparency platform that eliminates status meetings while showcasing live n8n workflows. Enterprise clients (CTOs, CEOs, PMs) access real-time project dashboards, organized documents, and automated notifications. **Goal**: 70% fewer status calls, 95% retention, 70+ NPS.

**Unique Position**: First client portal where every interaction demonstrates automation excellence through live n8n workflow visibility.

---

## User Personas & Core Stories

### CTO Persona: Technical Validation & Integration
**US-T1**: As CTO, I want live access to n8n workflow diagrams so I can validate technical implementation
- AC: Can download current workflow diagram within dashboard (versioned, auto-updated)
- AC: Can view workflow execution logs in real-time (success/error details)
- AC: Receives proactive alert when workflow fails (email + in-app)

**US-T2**: As CTO, I want API documentation & webhook endpoints so my team can integrate independently
- AC: Copy-paste ready API documentation in "Developer" section
- AC: Can generate/revoke API keys for test environments
- AC: Webhook logs show all incoming requests with success/error status

**US-T3**: As CTO, I want integration status dashboard so I can confirm all systems connected
- AC: Dashboard shows green/yellow/red status for each integrated system (Salesforce, ERP, etc.)
- AC: Can drill into each system to see last sync timestamp and error details
- AC: Automated alerts when integration status changes

**US-T4**: As CTO, I want performance metrics so I can optimize workflow efficiency
- AC: Dashboard shows workflow execution time, error rate, throughput per system
- AC: Can compare performance month-over-month
- AC: Receive alert if execution time increases >20% (regression detection)

**US-T5**: As CTO, I want audit logs so I can track data flow through all systems
- AC: Searchable log of all workflow executions with input/output details
- AC: Can filter logs by date range, system, success/failure
- AC: Export logs as CSV for compliance review

### CEO Persona: Executive Health & Confidence
**US-E1**: As CEO, I want instant project health snapshot so I can brief board in 2 minutes
- AC: Dashboard loads in <2 seconds on desktop/mobile
- AC: Single "Health Score" (0-100) visible without scrolling, updated every 30 seconds
- AC: Color-coded status (green = on-track, yellow = at-risk, red = blocked)

**US-E2**: As CEO, I want automated weekly summary emails so I don't need status calls
- AC: Email arrives Monday 8am with previous week's progress, next week's milestones, blockers
- AC: Can customize email frequency (weekly/biweekly) in settings
- AC: Email includes board-ready 1-page summary with key metrics

**US-E3**: As CEO, I want milestone tracking so I know what's coming next
- AC: Timeline view shows all project milestones with projected vs. actual completion dates
- AC: Automatically notified when milestone completes (email + dashboard badge)
- AC: Can mark milestone as "on-track" or "at-risk" for internal notes

**US-E4**: As CEO, I want financial impact visibility so I can justify continued investment
- AC: Dashboard shows ROI calculation (time saved + efficiency gains in euros/month)
- AC: Can view ROI trend over time (monthly comparison)
- AC: Calculation methodology is transparent and editable by admin

**US-E5**: As CEO, I want mobile access so I can check status anywhere
- AC: Dashboard accessible on mobile with full functionality
- AC: Key metrics visible without horizontal scrolling
- AC: Can push notifications enabled for critical alerts (blockers, completions)

### PM Persona: Document Organization & Coordination
**US-P1**: As PM, I want centralized document repository so I stop searching email
- AC: All project documents accessible in "Documents" section, organized by phase
- AC: Search finds any document in <2 seconds (full-text search)
- AC: Can upload/download documents with drag-and-drop interface

**US-P2**: As PM, I want document versioning so I know which version is current
- AC: Each document shows upload date, version number, uploader name
- AC: Can view change history and revert to previous versions
- AC: System automatically tags documents with "Current" / "Archived" status

**US-P3**: As PM, I want milestone coordination so teams stay aligned
- AC: Can create/edit milestones with due dates and description
- AC: Automatic email notification 3 days before milestone due date
- AC: Dashboard shows all team members' milestone assignments (if applicable)

**US-P4**: As PM, I want activity feed so I see project progress in real-time
- AC: Activity feed shows: documents uploaded, workflows completed, milestones achieved
- AC: Can filter feed by document type, person, date range
- AC: Feed updates every 30 seconds without manual refresh

**US-P5**: As PM, I want role-based access control so confidential docs stay secure
- AC: Can set document permissions (read-only, download, edit) per role
- AC: Audit log tracks who accessed which documents and when
- AC: Violating access attempts are logged and can trigger alerts

---

## Feature Specifications (MVP)

### Feature 1: Authentication & Role-Based Access
**Purpose**: Secure login with role-based dashboards (CEO, CTO, PM views)

**Functional Requirements**:
- Email/password login + SSO support (Google, Azure AD)
- Role assignment at user level (CEO, CTO, PM, Admin)
- Role determines: (a) dashboard widgets visible, (b) data shown, (c) actions allowed
- Session timeout after 30 min inactivity, password reset via email

**API Needs**: `/auth/login`, `/auth/sso`, `/auth/me` (current user), `/roles/{userId}`

**Data Model**: `users` table (id, email, password_hash, role, project_id, created_at, last_login)

**Success Metric**: 90%+ of users log in weekly; <1min time to first project access

---

### Feature 2: Executive Dashboard
**Purpose**: 30-second project health snapshot with real-time n8n data

**Functional Requirements**:
- Health Score (0-100) calculated from: workflow success rate + milestone progress + blockers
- Auto-updated from n8n workflow status (poll every 30 seconds)
- Shows: Health Score, Next Milestone, Days to Deadline, Open Blockers count
- Mobile-responsive: all key metrics visible without scrolling

**API Needs**: `/dashboard/health`, `/workflows/status` (from n8n integration)

**Data Model**: `projects` table (id, name, health_score, next_milestone_date, blockers_count, updated_at)

**Success Metric**: <2 second load time; CEO views dashboard 1x/week minimum

---

### Feature 3: Document Management
**Purpose**: Centralized, searchable document repository organized by project phase

**Functional Requirements**:
- Document upload (drag-drop, file browser)
- Auto-organize by folder: Requirements, Design, Development, Testing, Deployment
- Full-text search across all documents
- Version control: show version history, rollback to previous versions
- Access control: set read/download/edit permissions per role
- Audit log: track who accessed which documents when

**API Needs**: `/documents` (CRUD), `/documents/search`, `/documents/{id}/versions`, `/documents/{id}/access-log`

**Data Model**: `documents` table (id, name, folder, uploader_id, created_at, updated_at, file_path, version), `document_permissions` table (id, document_id, role, permission_level)

**Success Metric**: <30 seconds to find any document; <5min to upload new doc

---

### Feature 4: Real-Time n8n Integration
**Purpose**: Live workflow status syncing to automatically populate dashboards

**Functional Requirements**:
- Webhook receives n8n execution events (workflow_started, workflow_completed, workflow_failed)
- Parse workflow metadata: name, execution_id, status, timestamp, error_message
- Update dashboard health score based on workflow success rate
- Show workflow execution logs with timestamps and error details
- Auto-generate activity feed entries on workflow completion

**API Needs**: `POST /webhooks/n8n` (webhook endpoint), `GET /workflows/{id}/logs`

**Data Model**: `workflows` table (id, n8n_id, name, execution_count, success_rate, last_run_timestamp), `workflow_logs` table (id, workflow_id, status, timestamp, error_message, execution_details)

**Success Metric**: Dashboard updates within 60 seconds of workflow completion; 99% webhook reliability

---

### Feature 5: Automated Notifications
**Purpose**: Proactive alerts on milestones, blockers, and completions (email + in-app)

**Functional Requirements**:
- Notification types: Milestone completed, Workflow failed, Blocker created, Weekly summary
- Email template for each type (professional, branded)
- In-app notification badge with persistent notification center
- User can customize: notification frequency, alert types, delivery method
- Notification sent within 5 minutes of trigger event

**API Needs**: `POST /notifications/send`, `GET /notifications/center`, `PATCH /notifications/preferences`

**Data Model**: `notifications` table (id, user_id, type, title, body, created_at, read_at), `notification_preferences` table (id, user_id, notification_type, enabled, delivery_method)

**Success Metric**: 60%+ email open rate; <5min notification latency

---

## Information Architecture

### Pages & URL Structure

| Page | URL | Visible To | Purpose |
|------|-----|-----------|---------|
| Dashboard | `/projects/{project_id}/dashboard` | All roles | Health score, next milestone, open blockers |
| Technical Logs | `/projects/{project_id}/technical` | CTO only | Workflow logs, API docs, integration status |
| Documents | `/projects/{project_id}/documents` | All roles | Upload/download/organize project files |
| Timeline | `/projects/{project_id}/timeline` | All roles | Milestone tracking with dates |
| Notifications | `/notifications/center` | All roles | All notifications with read status |
| Account Settings | `/account/settings` | All roles | Email, password, notification preferences |
| Admin Settings | `/admin/project-settings` | Admin only | Role management, webhook logs |

### Navigation Structure
- **Header**: Logo, Project Selector dropdown, Notifications bell, User profile menu
- **Sidebar**: Dashboard, Technical, Documents, Timeline, Notifications, Settings
- **Mobile**: Hamburger menu collapses sidebar

---

## n8n Integration Specifications

### Webhook Configuration
**Endpoint**: `POST /webhooks/n8n/{projectId}`

**Payload Structure**:
```json
{
  "event": "workflow_completed|workflow_failed|workflow_started",
  "workflow_id": "n8n_workflow_id",
  "workflow_name": "Order Processing",
  "execution_id": "unique_execution_id",
  "timestamp": "2025-11-22T10:30:00Z",
  "status": "success|failed",
  "execution_time_ms": 1250,
  "error_message": "API timeout on Salesforce sync",
  "run_data": { /* full execution details */ }
}
```

### API Authentication
- **Method**: API Key in header `X-API-Key: {projectId}:{secretKey}`
- **Key Rotation**: Admin can rotate key in settings
- **Webhook Signature**: HMAC-SHA256 for request validation

### REST API Endpoints (From Portal to n8n)
- `GET /n8n/workflows/{workflowId}/logs` - Fetch execution history
- `GET /n8n/workflows/{workflowId}/status` - Current workflow status
- `POST /n8n/workflows/{workflowId}/test` - Trigger test execution

---

## MVP Prioritization

### P0 (Must Have - MVP Critical)
- User authentication with email/password + role-based access
- Executive dashboard with health score, milestone tracking, blocker count
- Document upload/download/search functionality
- n8n webhook integration (receive workflow status updates)
- Activity feed showing project progress
- Email notifications on milestone completion + weekly summary

### P1 (Should Have - Phase 2)
- API documentation & developer access key management
- Workflow execution logs with error details
- Document version control & history
- Advanced search filters (by folder, uploader, date range)
- Mobile-optimized responsive design
- Notification preferences customization

### P2 (Nice to Have - Phase 3+)
- Integration status dashboard (showing connected systems)
- Performance metrics & trend analysis
- Audit logs for data access compliance
- Custom branding per client
- ROI calculation & trend reporting
- White-label platform for partner agencies

---

## Key Architecture Decisions

### 1. Real-Time Method: Polling vs. WebSockets
**Decision**: Hybrid approach (polling for most, WebSockets for live execution logs)
- **Rationale**: 30-second polling sufficient for executive dashboard; WebSockets only for technical logs
- **Benefit**: Reduced infrastructure complexity, lower costs, sufficient UX
- **Trade-off**: Not true real-time, but acceptable for portal use case

### 2. Document Storage Strategy
**Decision**: S3-backed storage with local database indexing
- **Rationale**: S3 cost-effective, integrates with existing infrastructure, GDPR-compliant EU regions
- **Benefit**: Scalable, backup/disaster recovery built-in
- **Alternative Rejected**: Client Google Drive integration (less control, SSO complexity)

### 3. Database Choice
**Decision**: PostgreSQL (existing KI Agentur stack)
- **Rationale**: ACID compliance, JSON support for flexible workflow data, proven at scale
- **Benefit**: No new infrastructure, team expertise already exists

### 4. Notification Delivery
**Decision**: SendGrid for emails + in-app notification center
- **Rationale**: Existing KI Agentur email infrastructure
- **Benefit**: High deliverability, webhook tracking for analytics
- **Future**: SMS/Slack notifications in Phase 2

### 5. Frontend Framework
**Decision**: Next.js 14 (existing KI Agentur preference)
- **Rationale**: Server-side rendering for SEO, API routes, fast development
- **Benefit**: Full-stack JavaScript reduces team cognitive load

### 6. Authentication Method
**Decision**: JWT tokens + secure HTTP-only cookies
- **Rationale**: Enterprise SSO-compatible, GDPR-safe
- **Benefit**: Supports Google/Azure AD, Refresh token rotation prevents session hijacking

---

## Launch Plan

### Beta Phase (Jan 2026 - 4 weeks)
**5 Pilot Clients**: Selection criteria:
- Mix of personas (1 CTO-heavy, 1 CEO-heavy, 1 PM-focused, 2 mixed)
- Active projects in final 3 months of delivery
- Known as good feedback providers

**Testing Scope**:
- Weekly feedback calls on usability, feature completeness, bugs
- Measure: Dashboard load time, notification latency, document search speed
- Success Criteria: >4/5 satisfaction on all features, zero critical bugs

**Deliverables**:
- MVP portal deployed to staging environment
- All P0 features tested and working
- n8n webhook integration validated
- Support guide for beta clients

### GA Launch (Feb 2026 - Gradual Rollout)
**Week 1**: Roll out to 10 most active projects
**Week 2**: Roll out to 20 projects
**Week 3**: Roll out to remaining 50 clients

**Go-Live Checklist**:
- ✅ All P0 features tested
- ✅ n8n integration 99% stable (validated in beta)
- ✅ Support documentation complete
- ✅ Admin monitoring dashboard live
- ✅ Backup/disaster recovery tested
- ✅ GDPR compliance verified
- ✅ Security audit completed

**Post-Launch Support**:
- Daily monitoring of deployment + performance metrics
- Weekly client check-ins on adoption & issues
- Bug fixes within 48 hours if blocking clients
- Performance optimization based on analytics

---

## Success Metrics & KPIs

| Metric | Target | Measurement | Owner |
|--------|--------|-------------|-------|
| **Adoption** | 80% of clients log in weekly | Google Analytics (weekly login rate) | Product |
| **Feature Usage** | 60% use document repo, 70% view dashboard | In-app events | Product |
| **Status Meeting Reduction** | 70% fewer scheduled calls | Calendar tracking, client surveys | Sales/Success |
| **Time to Value** | <5 min to understand project status | User session analytics | Design |
| **Performance** | Dashboard <2sec load, search <2sec | Lighthouse audit, server logs | DevOps |
| **Notification Engagement** | 60% email open rate, <5min delivery | SendGrid analytics | Product |
| **Client NPS** | 70+ (from 55 baseline) | Quarterly NPS survey | Success |
| **Client Retention** | 95%+ annual retention | Contract renewals | Sales |

---

## Open Questions Requiring Stakeholder Input

1. **Multi-Tenant Architecture**: Build single-tenant MVP, then rebuild for multi-tenant v2? Or multi-tenant from start?
2. **Notification Frequency**: Daily digest vs. real-time vs. weekly only? Test in beta.
3. **Custom Branding**: Standardized gold/black, or customizable per client?
4. **API Access**: Only for CTOs, or available to all? Define in beta.
5. **Data Retention**: On contract end, delete immediately or 90-day retention period?
6. **Mobile Priority**: Responsive web sufficient, or native iOS app needed?

---

## Assumptions

- N8n webhook reliability >99% (validated with tech team)
- 5 pilot clients available and engaged for 4-week beta
- Current KI Agentur tech stack (Next.js, PostgreSQL, Docker) sufficient
- SSO (Google/Azure AD) integrations doable within MVP timeline
- No HIPAA/GDPR-specific compliance beyond standard EU data residency

---

## Out of Scope (MVP)

- Billing/invoicing features
- Real-time chat or collaboration
- Task management / Kanban boards
- Native mobile apps (responsive web only)
- White-label platform (Year 2)
- Multi-language beyond German/English
- Custom workflow builder for clients
- Video conferencing or meeting scheduling

---

## Dependencies & Risks

| Risk | Probability | Mitigation |
|------|-------------|-----------|
| n8n webhook unreliability | Low | Fallback: polling API every 5 min for dashboard sync |
| Project delays push timeline | Medium | MVP scope is tight; any blocker cuts P1 features |
| Client adoption slow | Low | Beta feedback + walkthroughs will drive adoption |
| SSO integration complexity | Medium | Consider fallback: email/password-only for MVP |
| GDPR compliance gaps | Low | Engage legal team in Week 1 of development |

---

## Version History

| Version | Date | Status | Next Phase |
|---------|------|--------|-----------|
| 1.0 | 2025-11-22 | Ready for Design | UX Designer + Product Designer |

**Vision Document**: `/home/user/claude-code-agents-wizard-v2/product-vision-ki-agentur-client-portal.md`

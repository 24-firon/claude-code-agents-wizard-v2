# Test Plan: KI Agentur Client Portal

**Project**: KI Agentur Client Portal
**Version**: 1.0
**Date**: 2025-11-23
**QA Engineer**: Senior QA Engineer Agent
**Status**: In Progress

---

## 1. Test Scope and Objectives

### In Scope
- All features defined in PRD
- All user flows from UX design
- All UI components from design specification
- API endpoints and integration points
- Security fixes from security report
- Accessibility (WCAG 2.1 AA compliance)
- Cross-browser compatibility (Chrome, Firefox)
- Responsive design (mobile, tablet, desktop)
- Performance metrics
- Error handling and edge cases

### Out of Scope
- Load testing (requires production environment)
- Penetration testing (requires specialized tools)
- n8n integration testing (external service)
- Email delivery testing (requires SendGrid configuration)

### Test Objectives
- Verify all P0 features work as specified in PRD
- Ensure UI matches design specifications
- Validate all user flows complete successfully
- Confirm security fixes are effective
- Ensure cross-browser compatibility
- Validate responsive design across devices
- Measure and validate performance metrics
- Identify and document all bugs and issues

---

## 2. Test Strategy

### 2.1 Build Verification Testing
**Objective**: Verify both frontend and backend build successfully

**Approach**:
- Test frontend production build (Next.js)
- Test backend TypeScript compilation
- Verify database schema/migrations
- Check environment configuration

**Test Cases**:
- TC-BUILD-001: Frontend builds without errors
- TC-BUILD-002: Backend compiles without TypeScript errors
- TC-BUILD-003: Database migrations run successfully
- TC-BUILD-004: Environment variables are properly configured

### 2.2 Functional Testing
**Objective**: Verify all features work according to PRD specifications

**Feature Areas**:
1. Authentication & Authorization
2. Dashboard (CEO, CTO, PM views)
3. Document Management
4. Workflow Status Display
5. Notifications
6. Settings & Profile Management

**Test Cases**: See Section 4 (Detailed Test Cases)

### 2.3 Integration Testing
**Objective**: Verify frontend-backend integration and data flow

**Approach**:
- Test API endpoints with various payloads
- Test authentication flows
- Test data persistence (CRUD operations)
- Test error handling from backend

**Critical Integration Points**:
- Authentication (login, logout, refresh)
- Dashboard data fetching
- Document upload/download
- Webhook receiver (simulated)

### 2.4 Security Testing
**Objective**: Validate security fixes and identify vulnerabilities

**Based on Security Report Findings**:
- ✅ CRIT-001: Rate limiting on /auth/refresh (verify fix)
- ✅ HIGH-001: Refresh token only via cookies (verify fix)
- ✅ HIGH-002: CSRF protection (verify implementation)
- Password validation
- Authorization checks
- Input validation

### 2.5 Accessibility Testing (WCAG 2.1 AA)
**Objective**: Ensure application is accessible to all users

**Approach**:
- Keyboard navigation testing
- Color contrast validation
- ARIA attributes verification
- Focus management testing

**Test Cases**:
- Keyboard navigation through all pages
- Screen reader compatibility (if available)
- Color contrast meets 4.5:1 ratio
- Form labels properly associated

### 2.6 Cross-Browser Testing
**Objective**: Ensure consistent functionality across browsers

**Browsers to Test**:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (if available via emulation)

**Test Cases**:
- Core user flows in each browser
- UI rendering and layout
- Form submissions
- File uploads (if testable)

### 2.7 Responsive Testing
**Objective**: Ensure application works across all device sizes

**Breakpoints to Test**:
- Mobile: 375px, 390px, 414px
- Tablet: 768px, 820px
- Desktop: 1024px, 1440px, 1920px

**Test Cases**:
- Layout at each breakpoint
- Navigation (hamburger menu on mobile)
- Form inputs on mobile
- Tables/data displays

### 2.8 Performance Testing
**Objective**: Ensure fast load times and smooth interactions

**Metrics to Measure**:
- Page load time (target: < 2s)
- API response times (target: < 500ms)
- Build size analysis

**Test Cases**:
- Measure dashboard load time
- Measure API endpoint response times
- Analyze bundle sizes

---

## 3. Test Environment

### Frontend
- Path: `/home/user/claude-code-agents-wizard-v2/client-portal/`
- Framework: Next.js 16
- Build command: `npm run build`
- Dev server: `npm run dev` (http://localhost:3000)

### Backend
- Path: `/home/user/claude-code-agents-wizard-v2/client-portal-api/`
- Framework: Express.js + Prisma
- Build command: `npm run build`
- Dev server: `npm run dev` (http://localhost:3001)

### Database
- Type: PostgreSQL
- Migrations: Prisma migrate
- Seed data: Available for testing

### Test Tools
- Build verification: npm, tsc, Next.js CLI
- Manual testing: Browser DevTools
- Accessibility: Chrome DevTools Lighthouse
- Performance: Chrome DevTools Performance tab

---

## 4. Detailed Test Cases

### 4.1 Build Verification Test Cases

#### TC-BUILD-001: Frontend Production Build
**Preconditions**: Frontend code checked out
**Steps**:
1. Navigate to `/home/user/claude-code-agents-wizard-v2/client-portal/`
2. Run `npm install` (if not already installed)
3. Run `npm run build`
4. Verify build completes without errors
5. Check `.next/` directory is created
6. Verify no TypeScript errors
7. Verify no ESLint errors

**Expected Result**: Build completes successfully with optimized production bundle
**Acceptance Criteria**:
- Zero TypeScript errors
- Zero build errors
- Build time < 120 seconds

---

#### TC-BUILD-002: Backend TypeScript Compilation
**Preconditions**: Backend code checked out
**Steps**:
1. Navigate to `/home/user/claude-code-agents-wizard-v2/client-portal-api/`
2. Run `npm install` (if not already installed)
3. Run `npm run build` or `npx tsc`
4. Verify compilation completes without errors
5. Check `dist/` directory is created
6. Verify no TypeScript errors

**Expected Result**: TypeScript compilation succeeds
**Acceptance Criteria**:
- Zero TypeScript errors
- Compiled JavaScript files in dist/

---

#### TC-BUILD-003: Database Schema Validation
**Preconditions**: Backend code checked out
**Steps**:
1. Navigate to `/home/user/claude-code-agents-wizard-v2/client-portal-api/`
2. Check `prisma/schema.prisma` exists
3. Run `npx prisma validate`
4. Verify schema is valid
5. Check for migration files in `prisma/migrations/`

**Expected Result**: Database schema is valid
**Acceptance Criteria**:
- Schema passes validation
- Migration files exist

---

### 4.2 Authentication Test Cases

#### TC-AUTH-001: User Login with Valid Credentials
**Preconditions**:
- Backend running
- Frontend running
- Test user exists in database

**Steps**:
1. Navigate to `/login`
2. Enter email: `admin@example.com`
3. Enter password: `dev-admin-123`
4. Click "Sign In" button
5. Verify redirect to dashboard
6. Verify user menu shows user info

**Expected Result**: User successfully logs in and is redirected to dashboard
**Acceptance Criteria** (from PRD):
- Login completes within 2 seconds
- User is redirected to role-appropriate dashboard
- Session token is set in cookies

---

#### TC-AUTH-002: User Login with Invalid Credentials
**Preconditions**: Backend running, Frontend running

**Steps**:
1. Navigate to `/login`
2. Enter email: `admin@example.com`
3. Enter password: `wrong-password`
4. Click "Sign In" button
5. Verify error message appears
6. Verify user is NOT redirected

**Expected Result**: Error message displayed, user remains on login page
**Acceptance Criteria**:
- Error message: "Invalid credentials" or similar
- No redirect occurs
- No session token set

---

#### TC-AUTH-003: Rate Limiting on Login Endpoint
**Preconditions**: Backend running

**Steps**:
1. Attempt 6 login requests with invalid credentials within 1 minute
2. Verify 6th request returns 429 status code
3. Verify error message indicates rate limiting

**Expected Result**: After 5 failed attempts, 6th request is rate-limited
**Acceptance Criteria** (from Security Report):
- 429 status code on 6th attempt
- Rate limit: 5 attempts per 15 minutes
- Clear error message

---

#### TC-AUTH-004: CRITICAL FIX - Rate Limiting on /auth/refresh Endpoint
**Preconditions**: Backend running
**Security Fix**: Verify CRIT-001 from security report

**Steps**:
1. Obtain valid refresh token (from login)
2. Attempt 6 refresh requests within 1 minute
3. Verify 6th request returns 429 status code
4. Inspect auth.routes.ts for authRateLimiter on /refresh endpoint

**Expected Result**: Rate limiting is applied to refresh endpoint
**Acceptance Criteria** (from Security Report):
- ✅ `authRateLimiter` middleware applied to `/auth/refresh` route
- 429 status code on exceeding rate limit
- Prevents unlimited refresh attempts

---

#### TC-AUTH-005: HIGH PRIORITY FIX - Refresh Token Only via Cookies
**Preconditions**: Backend running
**Security Fix**: Verify HIGH-001 from security report

**Steps**:
1. Attempt POST to `/auth/refresh` with refresh token in request body
2. Verify request is rejected (not accepted)
3. Attempt POST to `/auth/refresh` with refresh token in cookie
4. Verify request succeeds
5. Inspect auth.controller.ts for proper implementation

**Expected Result**: Refresh tokens only accepted via httpOnly cookies
**Acceptance Criteria** (from Security Report):
- ✅ No `|| req.body.refreshToken` fallback in code
- Refresh token from cookie only
- Request body tokens rejected

---

### 4.3 Dashboard Test Cases

#### TC-DASH-001: CEO Dashboard Loads Successfully
**Preconditions**:
- User logged in as CEO
- Test project data exists

**Steps**:
1. Navigate to `/dashboard`
2. Verify health score displays (0-100)
3. Verify metric cards display (Success Rate, Next Milestone, Blockers, ROI)
4. Verify timeline displays
5. Measure page load time

**Expected Result**: Dashboard loads with all components visible
**Acceptance Criteria** (from PRD):
- Dashboard loads in < 2 seconds
- Health score visible without scrolling
- All CEO-specific metrics visible
- Technical tab NOT visible (CTO-only)

---

#### TC-DASH-002: CTO Dashboard Shows Technical Tab
**Preconditions**: User logged in as CTO

**Steps**:
1. Navigate to `/dashboard`
2. Verify "Technical" tab is visible in sidebar
3. Click "Technical" tab
4. Verify workflow status displays
5. Verify execution logs display
6. Verify integration status displays

**Expected Result**: CTO sees technical tab with workflow/integration data
**Acceptance Criteria** (from PRD):
- Technical tab visible for CTO role
- Workflow status cards display
- Execution logs accessible

---

#### TC-DASH-003: PM Dashboard Shows Document Focus
**Preconditions**: User logged in as PM

**Steps**:
1. Navigate to `/dashboard`
2. Verify Documents section is prominent
3. Verify Activity Feed displays
4. Verify can upload documents (if implemented)

**Expected Result**: PM dashboard emphasizes document management
**Acceptance Criteria** (from PRD):
- Document library visible
- Activity feed shows document uploads
- PM can upload documents

---

### 4.4 Document Management Test Cases

#### TC-DOC-001: View Documents Page
**Preconditions**: User logged in, test documents exist

**Steps**:
1. Navigate to `/documents`
2. Verify documents list displays
3. Verify documents organized by phase
4. Verify search box is present

**Expected Result**: Documents page loads with document list
**Acceptance Criteria** (from PRD):
- All documents visible
- Organized by phase (Requirements, Design, Development, Testing, Deployment)
- Search functionality present

---

#### TC-DOC-002: Search Documents
**Preconditions**: User on /documents page, documents exist

**Steps**:
1. Enter search term in search box
2. Verify results filter in real-time
3. Verify matching documents highlighted
4. Try search with no results

**Expected Result**: Search filters documents in real-time
**Acceptance Criteria** (from PRD):
- Search completes in < 2 seconds
- Results update as user types
- No results message displays appropriately

---

### 4.5 Accessibility Test Cases

#### TC-A11Y-001: Keyboard Navigation - Login Page
**Preconditions**: Frontend running

**Steps**:
1. Navigate to `/login`
2. Press Tab key
3. Verify focus moves to email field
4. Press Tab key
5. Verify focus moves to password field
6. Press Tab key
7. Verify focus moves to Sign In button
8. Press Enter key
9. Verify form submits (with validation errors if empty)

**Expected Result**: All interactive elements accessible via keyboard
**Acceptance Criteria** (from UX Design):
- Tab order is logical
- Focus indicators visible (3px gold outline)
- Enter key submits form

---

#### TC-A11Y-002: Color Contrast
**Preconditions**: Frontend running

**Steps**:
1. Navigate to any page
2. Use Chrome DevTools Lighthouse
3. Run Accessibility audit
4. Check color contrast issues
5. Verify text contrast ratios

**Expected Result**: All text meets WCAG 2.1 AA contrast requirements
**Acceptance Criteria** (from UI Design):
- Body text: 4.5:1 minimum
- Headings: 4.5:1 minimum
- UI components: 3:1 minimum

---

### 4.6 Performance Test Cases

#### TC-PERF-001: Dashboard Load Time
**Preconditions**: User logged in

**Steps**:
1. Clear browser cache
2. Navigate to `/dashboard`
3. Measure load time using Chrome DevTools Performance tab
4. Record: First Contentful Paint (FCP)
5. Record: Largest Contentful Paint (LCP)
6. Record: Time to Interactive (TTI)

**Expected Result**: Dashboard loads within performance targets
**Acceptance Criteria** (from Architecture):
- FCP: < 1.5s
- LCP: < 2.5s
- TTI: < 3.5s
- **CEO Requirement**: < 2s total load time

---

#### TC-PERF-002: API Response Times
**Preconditions**: Backend running

**Steps**:
1. Measure GET `/api/dashboard/health` response time
2. Measure GET `/api/documents` response time
3. Repeat 5 times and calculate average
4. Use browser Network tab or curl with timing

**Expected Result**: API endpoints respond quickly
**Acceptance Criteria** (from Architecture):
- Dashboard health: < 200ms
- Document list: < 300ms
- Search: < 500ms

---

### 4.7 Responsive Design Test Cases

#### TC-RESP-001: Mobile Layout (375px)
**Preconditions**: Frontend running

**Steps**:
1. Open Chrome DevTools
2. Set viewport to 375px × 667px (iPhone SE)
3. Navigate to `/dashboard`
4. Verify layout stacks to single column
5. Verify hamburger menu appears
6. Verify no horizontal scrolling
7. Test all interactive elements (buttons, forms)

**Expected Result**: Mobile layout renders correctly
**Acceptance Criteria** (from UI Design):
- Single column layout
- Hamburger menu visible
- Touch targets 44×44px minimum
- No horizontal scroll

---

#### TC-RESP-002: Tablet Layout (768px)
**Preconditions**: Frontend running

**Steps**:
1. Set viewport to 768px × 1024px (iPad)
2. Navigate to `/dashboard`
3. Verify 2-column layout where appropriate
4. Verify navigation displays correctly
5. Test all interactions

**Expected Result**: Tablet layout renders correctly
**Acceptance Criteria**:
- 2-column grid for metrics
- Navigation accessible
- All features functional

---

#### TC-RESP-003: Desktop Layout (1440px)
**Preconditions**: Frontend running

**Steps**:
1. Set viewport to 1440px × 900px
2. Navigate to `/dashboard`
3. Verify full sidebar navigation
4. Verify multi-column grid
5. Verify all content fits without horizontal scroll

**Expected Result**: Desktop layout renders correctly
**Acceptance Criteria**:
- Sidebar navigation visible
- Multi-column grids for metrics
- Content centered with max-width

---

## 5. Bug Severity Classification

**Critical (P0) - Blocks deployment**:
- Application crashes
- Data loss
- Security vulnerabilities
- Core features completely broken

**High (P1) - Must fix before release**:
- Major features not working
- Significant UX impact
- Workaround is complex

**Medium (P2) - Should fix before release**:
- Minor features not working
- Moderate UX impact
- Easy workaround exists

**Low (P3) - Nice to fix**:
- Cosmetic issues
- Minor UX annoyances
- Suggestions for improvement

---

## 6. Test Execution Schedule

**Day 1**: Build verification + Environment setup
- TC-BUILD-001 through TC-BUILD-004
- Set up test environment
- Verify all dependencies installed

**Day 2**: Authentication + Security testing
- TC-AUTH-001 through TC-AUTH-005
- Verify security fixes (CRIT-001, HIGH-001, HIGH-002)
- Test rate limiting, token handling

**Day 3**: Functional testing - Dashboard + Documents
- TC-DASH-001 through TC-DASH-003
- TC-DOC-001 through TC-DOC-002
- Test role-based views

**Day 4**: Accessibility + Responsive testing
- TC-A11Y-001 through TC-A11Y-002
- TC-RESP-001 through TC-RESP-003
- Test keyboard navigation, color contrast, mobile layouts

**Day 5**: Performance testing + Bug documentation
- TC-PERF-001 through TC-PERF-002
- Measure load times, API response times
- Document all findings

---

## 7. Test Deliverables

1. ✅ **Test Plan** (this document)
2. **Test Execution Report** (results of all test cases)
3. **Bug Reports** (detailed bug list with severity)
4. **Performance Report** (load times, API response times)
5. **Deployment Readiness Assessment**

---

## 8. Entry and Exit Criteria

### Entry Criteria
- ✅ All code committed
- ✅ Security audit complete
- ✅ Frontend and backend buildable
- ✅ Test environment accessible

### Exit Criteria
- All test cases executed
- All P0 bugs fixed
- All P1 bugs fixed or documented
- Performance metrics meet targets
- Accessibility compliance verified
- Deployment readiness report complete

---

## 9. Risks and Assumptions

### Risks
- Limited testing environment (no production-like setup)
- No external service integration testing (n8n, SendGrid)
- Cannot test email delivery without SendGrid API keys
- Cannot perform load testing

### Assumptions
- Test credentials from seed data work
- Frontend and backend can communicate locally
- Database can be seeded with test data
- Security fixes have been applied

---

**Test Plan Status**: ✅ READY FOR EXECUTION

**Created By**: Senior QA Engineer Agent
**Date**: 2025-11-23

# Story 5.6: Validate Staging Deployment

Status: drafted

## Story

As a **stakeholder**,
I want **to verify the staging environment works correctly**,
So that **I can demo and validate features with confidence**.

## Acceptance Criteria

1. **Given** staging deployment is configured (Stories 5.1, 5.2, 5.3, 5.5)
   **When** a PR is created or a non-main branch is pushed
   **Then** within 10 minutes:
   - Application is deployed to staging URL (Vercel Preview + Railway staging)
   - Walking skeleton health check works
   - Observability captures staging events (if Epic 3 complete)

> **Note:** Merges to main trigger PRODUCTION deployment (Story 5.7), not staging.

2. **Given** staging is deployed
   **When** I access the staging URL
   **Then** the web application loads correctly

3. **Given** staging is deployed
   **When** I test the walking skeleton
   **Then** health check flow works end-to-end (web → API → database)

4. **Given** staging is validated
   **When** I update documentation
   **Then** staging URL is documented in README

5. **Given** staging is validated
   **When** I review configuration
   **Then** environment-specific configuration is correct (API URLs, etc.)

## Tasks / Subtasks

- [ ] **Task 1: Trigger staging deployment** (AC: #1)
  - [ ] Create a PR or push to a feature branch
  - [ ] Observe Vercel Preview deployment (auto-triggered)
  - [ ] Observe Railway staging deployment (GitHub Actions)
  - [ ] Time the deployment process
  - [ ] Verify deployment completes within 10 minutes

- [ ] **Task 2: Verify web application accessibility** (AC: #2)
  - [ ] Access staging web URL
  - [ ] Verify page loads without errors
  - [ ] Check browser console for errors
  - [ ] Test on multiple browsers (Chrome, Firefox)

- [ ] **Task 3: Test walking skeleton health check** (AC: #3)
  - [ ] Navigate to `/health` page on staging
  - [ ] Verify health check list displays
  - [ ] Click "Ping" button
  - [ ] Verify new health check record appears
  - [ ] Refresh page and verify data persists

- [ ] **Task 4: Verify API connectivity** (AC: #3)
  - [ ] Call staging API health endpoint directly
  - [ ] Verify response structure matches local
  - [ ] Check response times are acceptable
  - [ ] Verify CORS is configured correctly

- [ ] **Task 5: Verify database connectivity** (AC: #3)
  - [ ] Confirm health check creates database record
  - [ ] Check Supabase dashboard for staging data
  - [ ] Verify connection pooling works (Supavisor)

- [ ] **Task 6: Verify observability integration** (AC: #1)
  - [ ] 6.1 Fix Sentry deployment warnings discovered in Story 5.2:
    - [ ] Add `onRequestError` hook to `instrumentation.ts` (RSC error capture)
    - [ ] Create `app/global-error.tsx` for React rendering error boundary
    - [ ] Migrate `sentry.client.config.ts` → `instrumentation-client.ts` (Turbopack compat)
  - [ ] 6.2 Trigger a test error on staging
  - [ ] 6.3 Check Sentry dashboard for staging environment
  - [ ] 6.4 Verify error includes correct environment tag
  - [ ] 6.5 Verify source maps resolve correctly
  - [ ] 6.6 Verify no Sentry warnings in Vercel build logs

- [ ] **Task 7: Document staging URL in README** (AC: #4)
  - [ ] Add "Live Demo" or "Staging" section to README
  - [ ] Include staging web URL
  - [ ] Include staging API URL (if public)
  - [ ] Add deployment status badge

- [ ] **Task 8: Document environment configuration** (AC: #5)
  - [ ] Document staging-specific environment variables
  - [ ] Document API URL configuration for web
  - [ ] Document any platform-specific quirks
  - [ ] Update `docs/environment-setup.md`

- [ ] **Task 9: Create staging validation checklist** (AC: #1, #3)
  - [ ] Create reusable validation checklist
  - [ ] Document smoke test procedure
  - [ ] Include in deployment documentation
  - [ ] Schedule periodic validation (optional)

## Dev Notes

### Platform Decision (from Story 5-1)

| Target | Platform(s) | Validation Scope |
|--------|-------------|------------------|
| **Primary** | Vercel (web) + Railway (API) | Validate in this story |
| **Secondary** | Railway (both) | Decision gate in Story 5-4b |

**Validation Focus (Primary Target Only):**
- **Web App**: Vercel deployment (`https://[project].vercel.app`)
- **Server App**: Railway deployment (`https://[project].railway.app`)
- **Database**: Supabase TEST project connection

**Note**: This story validates the PRIMARY target. Upon successful completion, proceed to Story 5-4b for the secondary target decision gate.

### Validation Checklist

Use this checklist for each deployment validation:

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Web app loads | 200 OK | | ⬜ |
| Health page displays | Health check list visible | | ⬜ |
| Ping button works | New record created | | ⬜ |
| API health endpoint | `{ status: 'healthy' }` | | ⬜ |
| Database write | Record in health_checks table | | ⬜ |
| Database read | Records returned | | ⬜ |
| Sentry error capture | Error in dashboard | | ⬜ |
| Deployment time | < 10 minutes | | ⬜ |

### Smoke Test Script

```bash
#!/bin/bash
# staging-smoke-test.sh

STAGING_WEB_URL="${STAGING_WEB_URL:-https://staging.example.com}"
STAGING_API_URL="${STAGING_API_URL:-https://api-staging.example.com}"

echo "Testing staging deployment..."

# Test web app
echo "Checking web app..."
if curl -s -o /dev/null -w "%{http_code}" "$STAGING_WEB_URL" | grep -q "200"; then
  echo "✅ Web app: OK"
else
  echo "❌ Web app: FAILED"
  exit 1
fi

# Test API health
echo "Checking API health..."
HEALTH_RESPONSE=$(curl -s "$STAGING_API_URL/api/health")
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
  echo "✅ API health: OK"
else
  echo "❌ API health: FAILED"
  exit 1
fi

echo "All staging checks passed! ✅"
```

### Environment Configuration Verification

| Variable | Staging Value | Notes |
|----------|---------------|-------|
| `DATABASE_URL` | Supabase connection string | Different from local |
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Project-specific |
| `SUPABASE_ANON_KEY` | Public anon key | Same as local |
| `NEXT_PUBLIC_API_URL` | Staging API URL | Must point to staging |
| `SENTRY_DSN` | Staging DSN | Separate environment |
| `NODE_ENV` | `production` | Staging uses production mode |

### Sentry Deployment Warnings (from Story 5.2)

During Vercel deployment in Story 5.2, the following Sentry warnings were identified that should be resolved as part of staging validation:

| Warning | Severity | Fix |
|---------|----------|-----|
| Missing `onRequestError` hook | 🟡 Medium | Add to `instrumentation.ts` for RSC error capture |
| Missing `global-error.js` | 🟡 Medium | Create `app/global-error.tsx` for React error boundary |
| Deprecated `sentry.client.config.ts` | 🟡 Medium | Migrate to `instrumentation-client.ts` for Turbopack compatibility |

**References:**
- Vercel build logs: `dpl_BTkoAyAE1eCBz3yuxbsJ2v9X1zCU`
- Sentry docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

### Known Staging vs Local Differences

Document any expected differences:
- Different Supabase project (or same with environment tag)
- Different API URLs (staging subdomain)
- Possibly different rate limits
- Cold start behavior (if using serverless)

### Dependencies

This story **MUST** be completed after:
- ✅ Story 5.1: Select Staging Platform (COMPLETED - Vercel + Railway selected)
- ⏳ Story 5.2: Configure GitHub Actions Deployment Workflow
- ⏳ Story 5.3: Configure Docker Containerization

Recommended prerequisites:
- ✅ Epic 3: Observability Baseline (COMPLETED - Sentry integration ready for staging)

### Project Structure Notes

- This is a validation story
- Focus on verification and documentation
- Creates reusable smoke test artifacts
- Updates README with staging info

### Expected Outputs

1. Confirmed working staging deployment
2. Updated README with staging URL and badge
3. Updated environment documentation
4. Staging validation checklist
5. Optional: smoke test script in `/tools/` or `/scripts/`

### References

- [Source: docs/epics.md#Story-5.4]
- [Source: docs/architecture.md#Deployment-Targets]
- [Source: docs/PRD.md#FR16] - GitHub Actions staging deployment
- Prerequisites: Stories 5.1, 5.2, 5.3
- Related: Epic 3 (Observability) for Sentry verification

## Dev Agent Record

### Context Reference

5-6-validate-staging-deployment.context.xml

### Agent Model Used

<!-- To be filled by implementing agent -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled after implementation -->

### File List

<!-- To be filled after implementation -->

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-04 | SM Agent (Rincewind) | Initial story draft from Epic 5 |
| 2025-12-04 | Dev Agent (Claude Opus 4.5) | Added platform-specific validation focus per Story 5-1 decision |
| 2025-12-08 | Dev Agent (Claude Opus 4.5) | Expanded Task 6 with Sentry deployment warning fixes discovered during Story 5.2 Vercel deployment |
| 2025-12-09 | TEA Agent (Claude Opus 4.5) | Fixed AC#1 trigger: PR/feature branches (not main merge) |

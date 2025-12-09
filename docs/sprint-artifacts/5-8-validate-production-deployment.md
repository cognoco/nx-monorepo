# Story 5.8: Validate Production Deployment

Status: drafted

## Story

As a **stakeholder**,
I want **to verify the production environment works correctly**,
So that **I have confidence in the full CI/CD pipeline**.

## Acceptance Criteria

1. **Given** production deployment is configured
   **When** a PR is merged to main
   **Then** within 10 minutes:
   - Application is deployed to production URL
   - Walking skeleton health check works
   - Observability captures production events

2. **Given** production is deployed
   **When** I access the production URL
   **Then** the web application loads correctly

3. **Given** production is deployed
   **When** I test the walking skeleton
   **Then** health check flow works end-to-end (web → API → database)

4. **Given** production is validated
   **When** I update documentation
   **Then** production URLs are documented in README
   **And** deployment badge shows status

## Tasks / Subtasks

- [ ] **Task 1: Trigger production deployment** (AC: #1)
  - [ ] Merge a test change to main branch
  - [ ] Observe GitHub Actions workflow execution
  - [ ] Time the deployment process
  - [ ] Verify deployment completes within 10 minutes

- [ ] **Task 2: Verify web application accessibility** (AC: #2)
  - [ ] Access production web URL
  - [ ] Verify page loads without errors
  - [ ] Check browser console for errors
  - [ ] Test on multiple browsers (Chrome, Firefox)

- [ ] **Task 3: Test walking skeleton health check** (AC: #3)
  - [ ] Navigate to `/health` page on production
  - [ ] Verify health check list displays
  - [ ] Click "Ping" button
  - [ ] Verify new health check record appears
  - [ ] Refresh page and verify data persists

- [ ] **Task 4: Verify API connectivity** (AC: #3)
  - [ ] Call production API health endpoint directly
  - [ ] Verify response structure matches local/staging
  - [ ] Check response times are acceptable
  - [ ] Verify CORS is configured correctly

- [ ] **Task 5: Verify database connectivity** (AC: #3)
  - [ ] Confirm health check creates database record
  - [ ] Check Supabase dashboard for production data
  - [ ] Verify connection pooling works (Supavisor)

- [ ] **Task 6: Verify observability integration** (AC: #1)
  - [ ] Trigger a test error on production
  - [ ] Check Sentry dashboard for production environment
  - [ ] Verify error includes correct environment tag
  - [ ] Verify source maps resolve correctly

- [ ] **Task 7: Document production URLs in README** (AC: #4)
  - [ ] Add "Production" section to README
  - [ ] Include production web URL
  - [ ] Include production API URL (if public)
  - [ ] Add deployment status badge

## Dev Notes

### Validation Checklist

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
| Correct environment tag | "production" | | ⬜ |

### Smoke Test Script

```bash
#!/bin/bash
# production-smoke-test.sh

PROD_WEB_URL="${PROD_WEB_URL:-https://your-app.vercel.app}"
PROD_API_URL="${PROD_API_URL:-https://your-api.railway.app}"

echo "Testing production deployment..."

# Test web app
echo "Checking web app..."
if curl -s -o /dev/null -w "%{http_code}" "$PROD_WEB_URL" | grep -q "200"; then
  echo "✅ Web app: OK"
else
  echo "❌ Web app: FAILED"
  exit 1
fi

# Test API health
echo "Checking API health..."
HEALTH_RESPONSE=$(curl -s "$PROD_API_URL/api/health")
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
  echo "✅ API health: OK"
else
  echo "❌ API health: FAILED"
  exit 1
fi

echo "All production checks passed! ✅"
```

### Known Production vs Staging Differences

| Aspect | Staging | Production |
|--------|---------|------------|
| Web URL | Preview URLs (*.vercel.app) | Production URL |
| API URL | Railway staging | Railway production |
| Database | Supabase STAGING | Supabase STAGING (temp) |
| Environment tag | staging | production |
| Error visibility | Full details | Sanitized |

### Dependencies

This story **MUST** be completed after:
- ✅ Story 5.7: Production Deployment Pipeline

### Expected Outputs

1. Confirmed working production deployment
2. Updated README with production URLs and badge
3. Production validation checklist completed
4. Optional: smoke test script in `/tools/` or `/scripts/`

### References

- [Source: docs/epics.md#Story-5.8]
- Prerequisites: Story 5.7

## Dev Agent Record

### Context Reference

N/A - Story created during Epic 5 extension

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
| 2025-12-08 | SM Agent (Rincewind) | Initial story creation during Epic 5 extension |

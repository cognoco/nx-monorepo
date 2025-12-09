# Story 5.5: Environment Infrastructure Alignment

Status: drafted

## Story

As a **DevOps engineer**,
I want **infrastructure aligned with the environment strategy**,
So that **all platforms match our documented architecture**.

## Acceptance Criteria

1. **Given** environment strategy is documented
   **When** I align GitHub infrastructure
   **Then** environments configured:
   - `staging` environment with secrets (VERCEL_*, RAILWAY_*)
   - `production` environment with secrets
   - Auto-created/unused environments deleted

2. **Given** environment strategy is documented
   **When** I align Railway infrastructure
   **Then** environments configured:
   - `staging` environment exists
   - `production` environment exists
   - Environment variables set correctly

3. **Given** environment strategy is documented
   **When** I align Vercel infrastructure
   **Then** configurations verified:
   - Preview deployments auto-deploy on every push (hybrid approach)
   - Production deployments work for main

4. **Given** environment strategy is documented
   **When** I update deployment workflows
   **Then** workflows implement hybrid trigger approach:
   - Vercel: Auto-deploys on push (platform default, no workflow change)
   - Railway: Controlled via GitHub Actions with `workflow_dispatch` for manual trigger
   - `deploy-staging.yml` uses `staging` environment for Railway
   - `deploy-production.yml` uses `production` environment

5. **Given** Supabase project needs alignment
   **When** I rename the project
   **Then** `nx-monorepo-TEST` is renamed to `nx-monorepo-STAGING` in Supabase dashboard

## Tasks / Subtasks

- [ ] **Task 1: Clean up GitHub environments** (AC: #1)
  - [ ] Delete unused environments (Preview, Production placeholders, Railway auto-created)
  - [ ] Verify `staging` environment has correct secrets
  - [ ] Create `production` environment with correct secrets
  - [ ] Configure environment protection rules (optional approval for production)

- [ ] **Task 2: Align Railway environments** (AC: #2)
  - [ ] Verify/create `staging` environment in Railway
  - [ ] Verify/create `production` environment in Railway
  - [ ] Set environment variables for each environment
  - [ ] Disable Railway auto-deploy (controlled via Actions)
  - [ ] Link services to correct environments

- [ ] **Task 3: Verify Vercel configuration (hybrid approach)** (AC: #3)
  - [ ] Verify Preview deployment auto-deploys on push (keep default)
  - [ ] Verify Production deployment is enabled for main
  - [ ] Set environment variables for Preview
  - [ ] Set environment variables for Production

- [ ] **Task 4: Update deployment workflows (hybrid triggers)** (AC: #4)
  - [ ] Update `deploy-staging.yml` - Railway only (Vercel auto-deploys)
  - [ ] Add `workflow_dispatch` for manual Railway staging deployment
  - [ ] Create `deploy-production.yml` for production deployments
  - [ ] Verify Railway deployments only trigger via Actions

- [ ] **Task 5: Rename Supabase project** (AC: #5) - **REQUIRED**
  - [ ] Rename `nx-monorepo-TEST` to `nx-monorepo-STAGING` in Supabase dashboard
  - [ ] Verify project ref (`uvhnqtzufwvaqvbdgcnn`) remains unchanged

## Dev Notes

### Hybrid Deployment Approach

**Decision:** Use hybrid triggers for optimal developer experience.

| Platform | Trigger | Controlled By |
|----------|---------|---------------|
| **Vercel** | Auto-deploy on every push | Vercel (platform default) |
| **Railway** | Controlled deployment | GitHub Actions with `workflow_dispatch` |

**Rationale:**
- Vercel: Instant preview URLs are their sweet spot, very fast feedback
- Railway: More control needed, avoid unnecessary deployments

**Manual Trigger:** Add `workflow_dispatch` to Railway workflows for ad-hoc deployments without PRs.

### GitHub Environment Cleanup

**Delete:**
- `Preview` (Vercel auto-created placeholder)
- `Production` (empty placeholder)
- `@nx-monorepo/server (nx-monorepo / production)` (Railway auto-created)
- `@nx-monorepo/web (nx-monorepo / production)` (Railway auto-created)
- `@nx-monorepo/web-e2e (nx-monorepo / production)` (Railway auto-created)

**Keep/Create:**
- `staging` - Already has secrets, keep and verify
- `production` - Create new with production secrets

### GitHub Secrets Structure

**staging environment:**
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
RAILWAY_TOKEN
```

**production environment:**
```
VERCEL_TOKEN         (can be same as staging)
VERCEL_ORG_ID        (can be same as staging)
VERCEL_PROJECT_ID    (can be same as staging)
RAILWAY_TOKEN        (can be same as staging - different env in Railway)
```

### Railway Environment Configuration

Each Railway environment needs:
```
DATABASE_URL         (Supabase STAGING connection pooler)
DIRECT_URL           (Supabase STAGING direct connection)
SUPABASE_URL         (Supabase STAGING URL)
SUPABASE_SERVICE_ROLE_KEY
NODE_ENV             (production for both staging and production)
CORS_ORIGIN          (staging or production web URL)
SENTRY_DSN_API       (same for both or environment-specific)
```

### Supabase Rename

**Required action:** Rename project in Supabase dashboard.
- Current name: `nx-monorepo-TEST`
- New name: `nx-monorepo-STAGING`
- Project ref remains: `uvhnqtzufwvaqvbdgcnn` (does not change)

### Dependencies

This story **MUST** be completed after:
- ✅ Story 5.4: Environment Strategy Documentation

### Expected Outputs

1. Clean GitHub environments (staging, production only)
2. Railway staging and production environments configured
3. Vercel environment variables verified
4. Updated workflow files

### References

- [Source: docs/epics.md#Story-5.5]
- Prerequisites: Story 5.4

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



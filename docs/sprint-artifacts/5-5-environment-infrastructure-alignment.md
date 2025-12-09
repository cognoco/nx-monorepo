# Story 5.5: Environment Infrastructure Alignment

Status: done

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
   - Unused environments deleted (Railway auto-created, empty placeholders)
   - Vercel status-tracking environments (`nx-monorepo / *`) left intact

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

- [x] **Task 1: Clean up GitHub environments** (AC: #1)
  - [x] Delete unused environments (Preview, Production placeholders, Railway auto-created)
  - [x] Verify `staging` environment has correct secrets
  - [x] Create `production` environment with correct secrets
  - [ ] Configure environment protection rules (optional approval for production)

- [x] **Task 2: Align Railway environments** (AC: #2)
  - [x] Verify/create `staging` environment in Railway
  - [x] Verify/create `production` environment in Railway
  - [x] Set environment variables for each environment (STAGING Supabase)
  - [x] Configure Railway deployment triggers:
    - Staging: Branch disconnected (deploy via Actions only)
    - Production: Connected to `main` (auto-deploy on merge)
  - [x] Link services to correct environments

- [x] **Task 3: Verify Vercel configuration (hybrid approach)** (AC: #3)
  - [x] Verify Preview deployment auto-deploys on push (keep default)
  - [x] Verify Production deployment is enabled for main
  - [x] Set environment variables for Preview (BACKEND_URL → staging)
  - [x] Set environment variables for Production (BACKEND_URL → production)

- [x] **Task 4: Update deployment workflows (hybrid triggers)** (AC: #4)
  - [x] Update `deploy-staging.yml` - Railway only (Vercel auto-deploys)
  - [x] Add `workflow_dispatch` for manual Railway staging deployment
  - [x] Create `deploy-production.yml` for production deployments
  - [x] Configure Railway triggers: staging via Actions, production via auto-deploy on main

- [x] **Task 5: Rename Supabase project** (AC: #5) - **REQUIRED**
  - [x] Rename `nx-monorepo-TEST` to `nx-monorepo-STAGING` in Supabase dashboard
  - [x] Verify project ref (`uvhnqtzufwvaqvbdgcnn`) remains unchanged

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
- `Preview` (Vercel auto-created placeholder) ✅ Deleted
- `Production` (empty placeholder) ✅ Deleted
- `@nx-monorepo/server (nx-monorepo / production)` (Railway auto-created) ✅ Deleted
- `@nx-monorepo/web (nx-monorepo / production)` (Railway auto-created) ✅ Deleted
- `@nx-monorepo/web-e2e (nx-monorepo / production)` (Railway auto-created) ✅ Deleted

**Keep (Vercel status tracking - do NOT delete):**
- `nx-monorepo / staging` - Vercel auto-creates for deployment status on PRs
- `nx-monorepo / production` - Vercel auto-creates for deployment status on main

> **Note:** Vercel automatically recreates these environments for deployment status reporting.
> They are separate from our secret-holding environments and should be left alone.
> See `docs/environment-strategy.md` for full explanation.

**Keep/Create (Our secret storage):**
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

Claude Opus 4 (Mort - Dev Agent)

### Debug Log References

N/A - Implementation completed through interactive session

### Completion Notes List

1. **GitHub Environments:** Deleted unused environments (Railway auto-created, Vercel placeholders). Kept `staging` and `production` for secrets. Left Vercel auto-created status-tracking environments (`nx-monorepo / staging`, `nx-monorepo / production`) intact.

2. **Railway Configuration:**
   - Created `staging` environment by duplicating `production`
   - Set all environment variables to point to Supabase STAGING (`uvhnqtzufwvaqvbdgcnn`)
   - Staging: Disconnected branch (deploy via GitHub Actions only)
   - Production: Connected to `main` (auto-deploy on merge)

3. **Vercel Configuration:**
   - Preview: Auto-deploys on every push (default), BACKEND_URL → staging Railway
   - Production: Auto-deploys on merge to main, BACKEND_URL → production Railway

4. **Supabase:** Renamed `nx-monorepo-TEST` to `nx-monorepo-STAGING` (ref unchanged)

5. **Key Insight:** Railway staging uses Actions because feature branches are dynamic - Railway can't connect to branches that don't exist yet. Production auto-deploys from main because code is already tested.

### File List

**Created:**
- `.github/workflows/deploy-production.yml` - Railway production deployment workflow

**Modified:**
- `.github/workflows/deploy-staging.yml` - Updated to Railway-only, removed Vercel deployment
- `docs/environment-strategy.md` - Added hybrid deployment approach, Vercel auto-created environments section
- `docs/environment-variables-matrix.md` - Updated GitHub environments with actual URLs
- `docs/epics.md` - Clarified auto-created environments note
- `docs/sprint-artifacts/sprint-status.yaml` - Updated story status

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-08 | SM Agent (Rincewind) | Initial story creation during Epic 5 extension |
| 2025-12-09 | Dev Agent (Mort) | Implementation complete - all environments aligned |



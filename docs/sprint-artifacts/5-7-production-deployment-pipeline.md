# Story 5.7: Production Deployment Pipeline

Status: drafted

## Story

As a **DevOps engineer**,
I want **a production deployment pipeline**,
So that **merges to main automatically deploy to production**.

## Acceptance Criteria

1. **Given** staging deployment is validated
   **When** I configure production deployment workflow
   **Then** the workflow:
   - Triggers on push to main branch (after CI passes)
   - Deploys web to Vercel production
   - Deploys API to Railway production environment
   - Runs health checks after deployment
   - Reports deployment status

2. **Given** production workflow is configured
   **When** deployment runs
   **Then** workflow uses GitHub `production` environment secrets

3. **Given** production is deployed
   **When** checking database connectivity
   **Then** connects to Supabase STAGING (temporary until PROD exists)

4. **Given** deployment fails
   **When** rollback is needed
   **Then** rollback possible via Vercel/Railway dashboard

## Tasks / Subtasks

- [ ] **Task 1: Create production deployment workflow** (AC: #1)
  - [ ] Create `.github/workflows/deploy-production.yml`
  - [ ] Configure trigger: push to main (after CI workflow)
  - [ ] Add Vercel production deployment job
  - [ ] Add Railway production deployment job
  - [ ] Add health check verification

- [ ] **Task 2: Configure GitHub production environment** (AC: #2)
  - [ ] Create/verify `production` environment in GitHub
  - [ ] Add required secrets (VERCEL_*, RAILWAY_*)
  - [ ] Configure environment protection rules (optional approval)

- [ ] **Task 3: Configure Railway production environment** (AC: #3)
  - [ ] Create/verify `production` environment in Railway
  - [ ] Set DATABASE_URL to Supabase STAGING (temporary)
  - [ ] Set all required environment variables
  - [ ] Document temporary database mapping

- [ ] **Task 4: Verify Vercel production** (AC: #1)
  - [ ] Verify Vercel production settings
  - [ ] Set BACKEND_URL to Railway production URL
  - [ ] Verify environment variables

- [ ] **Task 5: Document rollback procedures** (AC: #4)
  - [ ] Document Vercel rollback via dashboard
  - [ ] Document Railway rollback via dashboard
  - [ ] Note: Full rollback documentation in Story 5.8

## Dev Notes

### Workflow Structure

```yaml
# deploy-production.yml
name: Deploy to Production

on:
  workflow_run:
    workflows: ["CI"]
    branches: [main]
    types: [completed]
  workflow_dispatch:

jobs:
  deploy-web:
    environment: production
    # Deploy to Vercel production

  deploy-api:
    environment: production
    # Deploy to Railway production

  post-deploy:
    # Health checks and notifications
```

### Environment Variables (Production)

**Vercel (Web):**
```
NEXT_PUBLIC_SUPABASE_URL     (STAGING project for now)
NEXT_PUBLIC_SUPABASE_ANON_KEY
BACKEND_URL                   (Railway production URL)
SENTRY_DSN, SENTRY_ORG, etc.
```

**Railway (API):**
```
DATABASE_URL                  (STAGING pooler connection)
DIRECT_URL                    (STAGING direct connection)
SUPABASE_URL                  (STAGING project URL)
SUPABASE_SERVICE_ROLE_KEY     (STAGING service key)
SENTRY_DSN_API
NODE_ENV=production
CORS_ORIGIN                   (Vercel production URL)
```

### Temporary Database Strategy

Until Supabase PROD is created:
- Production deployment uses STAGING database
- Document this as technical debt
- When PROD exists, only change environment variables

### Dependencies

This story **MUST** be completed after:
- ✅ Story 5.6: Validate Staging Deployment

### Expected Outputs

1. `.github/workflows/deploy-production.yml`
2. Configured GitHub `production` environment
3. Configured Railway `production` environment
4. Basic rollback documentation

### References

- [Source: docs/epics.md#Story-5.7]
- Prerequisites: Story 5.6

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

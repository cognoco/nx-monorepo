# Story 5.2: Configure GitHub Actions Deployment Workflow

Status: ready-for-dev

## Story

As a **DevOps engineer**,
I want **a GitHub Actions workflow for staging deployment**,
So that **merges to main trigger automatic deployments**.

## Acceptance Criteria

1. **Given** staging platform is selected (Story 5.1)
   **When** I create `.github/workflows/deploy-staging.yml`
   **Then** the workflow triggers on push to main branch

2. **Given** the deployment workflow runs
   **When** CI checks pass
   **Then** deployment proceeds to staging environment

3. **Given** deployment completes
   **When** health checks are performed
   **Then** deployment success is verified via health check endpoint

4. **Given** the workflow is configured
   **When** secrets are needed
   **Then** workflow uses GitHub environment secrets (not hardcoded)

5. **Given** deployment is successful
   **When** viewing repository
   **Then** deployment status badge is visible in README

## Tasks / Subtasks

- [ ] **Task 1: Create GitHub environment** (AC: #4)
  - [ ] Create `staging` environment in repository settings
  - [ ] Configure environment protection rules (optional for staging)
  - [ ] Document required secrets for the environment
  - [ ] Add secrets to GitHub environment settings
  - [ ] Reference: See `.env.example` lines 108-138 for multi-environment variable configuration

- [ ] **Task 2: Create deployment workflow file** (AC: #1, #2)
  - [ ] Create `.github/workflows/deploy-staging.yml`
  - [ ] Configure trigger on push to main
  - [ ] Add dependency on CI workflow success
  - [ ] Use `staging` environment for secrets access

- [ ] **Task 3: Implement platform-specific deployment steps** (AC: #2)
  - [ ] Install platform CLI or use official action
  - [ ] Configure authentication with secrets
  - [ ] Add deployment commands for web app
  - [ ] Add deployment commands for server app
  - [ ] Configure environment variables on platform

- [ ] **Task 4: Add health check verification** (AC: #3)
  - [ ] Wait for deployment to complete
  - [ ] Call `/api/health` endpoint on deployed server
  - [ ] Call `/health` page on deployed web app
  - [ ] Fail workflow if health checks fail

- [ ] **Task 5: Configure deployment notifications** (AC: #2)
  - [ ] Add deployment success/failure status output
  - [ ] Configure GitHub deployment status API
  - [ ] Add Slack/Discord notification (optional)

- [ ] **Task 6: Add deployment badge** (AC: #5)
  - [ ] Create deployment status badge
  - [ ] Add badge to README.md
  - [ ] Verify badge updates on deployments

- [ ] **Task 7: Test deployment pipeline** (AC: #1, #2, #3)
  - [ ] Trigger test deployment
  - [ ] Verify workflow completes successfully
  - [ ] Confirm staging URLs are accessible
  - [ ] Verify health check validation works

- [ ] **Task 8: Document deployment workflow** (AC: #4)
  - [ ] Document workflow triggers and conditions
  - [ ] Document required secrets
  - [ ] Document manual deployment trigger (workflow_dispatch)
  - [ ] Add troubleshooting section

## Dev Notes

### Platform Decision (from Story 5-1)

| Target | Platform(s) | Scope |
|--------|-------------|-------|
| **Primary** | Vercel (web) + Railway (API) | Implement in this story |
| **Secondary** | Railway (both) | Decision gate after 5-4 validation |

**Key Constraints:**
- **This story implements PRIMARY target only** (Vercel + Railway)
- Web app: Deploy to Vercel using official GitHub integration or Action
- Server app: Deploy to Railway using Docker container
- Both apps use Supabase TEST project for database

### Forward-Compatibility Considerations

**IMPORTANT**: While implementing the primary target, keep the secondary target (Railway + Railway) in mind:

1. **Environment Variable Naming**: Use generic names that work for any platform:
   - ✅ `STAGING_API_URL` (generic)
   - ❌ `VERCEL_API_URL` (platform-specific)

2. **Workflow Structure**: Design the workflow so Railway web deployment can be added later:
   - Keep Vercel and Railway deployment steps clearly separated
   - Use reusable workflow patterns where possible
   - Document which steps are Vercel-specific vs generic

3. **Health Check Pattern**: Use the same health check verification for both platforms:
   - Generic curl-based checks work everywhere
   - Don't rely on Vercel-specific deployment APIs for validation

4. **Secrets Organization**: Group secrets by purpose, not platform:
   - `STAGING_*` for environment config
   - Platform tokens separate (VERCEL_TOKEN, RAILWAY_TOKEN)

**Secondary Target Enablement**: When/if we implement Railway+Railway:
- Vercel steps become conditional or removed
- Railway web deployment reuses server deployment pattern
- Minimal workflow changes required

### Workflow Structure Template

```yaml
name: Deploy to Staging

on:
  push:
    branches: [main]
  workflow_dispatch:  # Manual trigger

env:
  # Platform-specific environment setup

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging  # Uses staging secrets
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build applications
        run: pnpm exec nx run-many -t build

      # Platform-specific deployment steps

      - name: Verify deployment
        run: |
          # Health check verification
```

### Required Secrets (Primary Target: Vercel + Railway)

**Vercel Secrets:**
| Secret | Description | Source |
|--------|-------------|--------|
| `VERCEL_TOKEN` | Vercel API token | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization/team ID | Vercel Project Settings |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel Project Settings |

**Railway Secrets:**
| Secret | Description | Source |
|--------|-------------|--------|
| `RAILWAY_TOKEN` | Railway API token | Railway Dashboard → Account Settings |
| `RAILWAY_PROJECT_ID` | Railway project ID | Railway Project Settings |
| `RAILWAY_SERVICE_ID` | Railway service ID (for server) | Railway Service Settings |

**Supabase Secrets (shared):**
| Secret | Description | Source |
|--------|-------------|--------|
| `STAGING_DATABASE_URL` | Supabase TEST connection string | Supabase Dashboard → Settings → Database |
| `STAGING_SUPABASE_URL` | Supabase TEST project URL | Supabase Dashboard → Settings → API |
| `STAGING_SUPABASE_ANON_KEY` | Supabase TEST anon key | Supabase Dashboard → Settings → API |
| `STAGING_SENTRY_DSN` | Sentry DSN for staging | Sentry Dashboard |

### Platform-Specific Actions (Primary Target)

**Vercel (Web App):**
```yaml
- name: Deploy Web to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    working-directory: apps/web
```

**Railway (Server App):**
```yaml
- name: Install Railway CLI
  run: npm install -g @railway/cli

- name: Deploy Server to Railway
  run: railway up --service ${{ secrets.RAILWAY_SERVICE_ID }}
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  working-directory: apps/server
```

### Alternative: Vercel Project Link (Simpler Setup)

Instead of using GitHub Actions, Vercel can be connected directly to the repository:
1. Import project in Vercel Dashboard
2. Set "Root Directory" to `apps/web`
3. Vercel auto-deploys on push to main

This may be simpler than the Action approach for the primary target.

### Dependencies

This story **MUST** be completed after:
- ✅ Story 5.1: Select Staging Platform (COMPLETED - Vercel + Railway selected)

This story runs in parallel with:
- Story 5.3: Configure Docker Containerization (server Dockerfile needed for Railway)

This story enables:
- Story 5.4: Validate Staging Deployment

### Existing CI Workflow

From `.github/workflows/ci.yml`:
- Install dependencies with pnpm
- Install Playwright browsers
- Run: `pnpm exec nx run-many -t lint test build typecheck e2e`

Deployment workflow should:
1. Depend on CI passing (or run as part of same workflow)
2. Only proceed if all checks pass
3. Deploy only on main branch

### Project Structure Notes

- Workflow file: `.github/workflows/deploy-staging.yml`
- May need separate deploy steps for web and server
- Environment-specific configuration via secrets
- Health check endpoints ready: `/api/health`, `/health`

### References

- [Source: docs/epics.md#Story-5.2]
- [Source: docs/architecture.md#CI/CD-Pipeline]
- [Source: docs/architecture.md#Deployment-Targets]
- [Source: .github/workflows/ci.yml] - Existing CI workflow
- Prerequisite: Story 5.1 platform selection

## Dev Agent Record

### Context Reference

<!-- Path to story context XML will be added by context workflow -->

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
| 2025-12-04 | Dev Agent (Claude Opus 4.5) | Revised for primary target (Vercel+Railway) per Story 5-1 decision; marked ready-for-dev |

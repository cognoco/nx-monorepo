# Story 5.9: Configure Railway Web Frontend

Status: done

## Story

As a **DevOps engineer**,
I want **the web frontend deployed to Railway**,
So that **we demonstrate dual frontend architecture with deployment portability**.

## Acceptance Criteria

1. **Given** Vercel frontend is validated (Story 5.8)
   **When** I deploy the web frontend to Railway
   **Then**:
   - Railway web service uses `apps/web/Dockerfile`
   - Environment variables point to same Railway backend
   - CORS on backend accepts both Vercel and Railway origins

2. **Given** Railway web service is configured
   **When** deployment completes
   **Then** both frontends (Vercel + Railway) can access the same API

3. **Given** dual frontend is deployed
   **When** I update workflows
   **Then** deployment workflow includes Railway web deployment

## Tasks / Subtasks

- [x] **Task 1: Create Railway web service** (AC: #1)
  - [x] Create new service in Railway project for web frontend
  - [x] Configure to use `apps/web/Dockerfile`
  - [x] Set build context to monorepo root
  - [x] Configure health check endpoint (`/health`)

- [x] **Task 2: Configure Railway web environment variables** (AC: #1)
  - [x] Set `NEXT_PUBLIC_SUPABASE_URL` (Supabase STAGING)
  - [x] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [x] Set `BACKEND_URL` (Railway API URL for Next.js rewrites)
  - [x] Set `NEXT_PUBLIC_API_URL=/api` (use rewrites, not direct API)
  - [x] Set Sentry variables

- [x] **Task 3: Update backend CORS** (AC: #1)
  - [x] Backend already uses CORS_ORIGIN env var supporting multiple origins
  - [x] Verified both Vercel and Railway origins work via env vars

- [x] **Task 4: Update deployment workflows** (AC: #3)
  - [x] Added Railway web deployment to staging workflow
  - [x] Added Railway web deployment to production workflow
  - [x] Verified both web deployments trigger correctly

- [x] **Task 5: Test dual frontend access** (AC: #2)
  - [x] Verified Vercel frontend → Railway API works
  - [x] Verified Railway frontend → Railway API works (staging + production)
  - [x] Verified both create records in same database

## Dev Notes

### Dual Frontend Architecture

```
┌────────────────────┐     ┌────────────────────┐
│  Vercel Frontend   │     │  Railway Frontend  │
│  (auto-deploy)     │     │  (controlled)      │
│  Vercel builder    │     │  Docker container  │
└─────────┬──────────┘     └─────────┬──────────┘
          │                          │
          │    Same BACKEND_URL      │
          └────────────┬─────────────┘
                       ▼
            ┌──────────────────┐
            │  Railway Backend │
            │  (single instance)│
            └────────┬─────────┘
                     ▼
            ┌──────────────────┐
            │ Supabase STAGING │
            └──────────────────┘
```

### Key Insight: Same App, Different Build Systems

| Platform | Build Method | Uses Dockerfile? |
|----------|--------------|------------------|
| **Vercel** | Vercel's native Next.js builder | ❌ No |
| **Railway** | `apps/web/Dockerfile` | ✅ Yes |

The **application code is identical** - only the build artifacts differ.

### CORS Configuration

```typescript
// apps/server/src/main.ts
app.use(cors({
  origin: [
    'https://your-app.vercel.app',      // Vercel frontend
    'https://your-web.railway.app',     // Railway frontend
    'http://localhost:3000',            // Local dev
    /^exp:\/\/.*/,                      // Expo Go (future mobile)
  ]
}));
```

### Railway Web Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://uvhnqtzufwvaqvbdgcnn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
BACKEND_URL=https://[same-railway-api].railway.app
NEXT_PUBLIC_SENTRY_DSN=https://...
NODE_ENV=production
```

### Dependencies

This story **MUST** be completed after:
- ✅ Story 5.8: Validate Production Deployment (Vercel frontend validated)
- ✅ `apps/web/Dockerfile` exists (from Story 5.3)

### Expected Outputs

1. Railway web service created and deployed
2. Backend CORS updated for dual frontend
3. Both frontends working against same backend
4. Updated deployment workflows

### References

- [Source: docs/epics.md#Story-5.9]
- Prerequisites: Story 5.8

## Dev Agent Record

### Context Reference

N/A - Story created during Epic 5 restructuring

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Railway staging build logs: https://railway.com/project/ea2a64e5-576f-4f6b-bd03-17a885087baf
- Issue: Initial deployments used wrong Dockerfile (server instead of web)
- Fix: Created `apps/web/railway.json` with explicit Dockerfile path
- Issue: Client-side requests hit server directly at `/health` instead of `/api/health`
- Fix: Changed `NEXT_PUBLIC_API_URL` from direct server URL to `/api` to use Next.js rewrites

### Completion Notes List

1. **Railway web service created** in both staging and production environments
2. **`apps/web/railway.json`** created to specify Dockerfile path and health check
3. **Key env var fix**: `NEXT_PUBLIC_API_URL=/api` - client requests must go through Next.js rewrites
4. **`BACKEND_URL`** added as Docker build ARG for Next.js rewrite configuration
5. **Dual frontend verified**:
   - Staging: `https://nx-monorepoweb-staging.up.railway.app/api/health` → 200
   - Production: `https://nx-monorepoweb-production.up.railway.app/api/health` → 200

### File List

- `apps/web/railway.json` - Railway service configuration
- `apps/web/Dockerfile` - Added `BACKEND_URL` build ARG
- `.github/workflows/deploy-staging.yml` - Added Railway web deployment
- `.github/workflows/deploy-production.yml` - Added Railway web deployment

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-08 | SM Agent (Rincewind) | Repurposed from "Secondary Target Decision Gate" to "Configure Railway Web Frontend" |
| 2025-12-10 | Claude Opus 4.5 | Implemented and verified Railway web frontend in staging and production |

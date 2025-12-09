# Story 5.9: Configure Railway Web Frontend

Status: drafted

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

- [ ] **Task 1: Create Railway web service** (AC: #1)
  - [ ] Create new service in Railway project for web frontend
  - [ ] Configure to use `apps/web/Dockerfile`
  - [ ] Set build context to monorepo root
  - [ ] Configure health check endpoint

- [ ] **Task 2: Configure Railway web environment variables** (AC: #1)
  - [ ] Set `NEXT_PUBLIC_SUPABASE_URL` (Supabase STAGING)
  - [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Set `BACKEND_URL` (same Railway API URL as Vercel uses)
  - [ ] Set Sentry variables

- [ ] **Task 3: Update backend CORS** (AC: #1)
  - [ ] Add Railway web URL to CORS origins in `apps/server/src/main.ts`
  - [ ] Verify both Vercel and Railway origins work

- [ ] **Task 4: Update deployment workflows** (AC: #3)
  - [ ] Add Railway web deployment to staging workflow
  - [ ] Add Railway web deployment to production workflow
  - [ ] Verify both web deployments trigger correctly

- [ ] **Task 5: Test dual frontend access** (AC: #2)
  - [ ] Verify Vercel frontend → Railway API works
  - [ ] Verify Railway frontend → Railway API works
  - [ ] Verify both create records in same database

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
| 2025-12-08 | SM Agent (Rincewind) | Repurposed from "Secondary Target Decision Gate" to "Configure Railway Web Frontend" |

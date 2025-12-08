## [Deployment Configuration] - Vercel + Railway Nx Monorepo Deployment - 2025-12-08

**Decision:** Use Vercel for web app (via Git integration with custom build command) and Railway for API server (via Dockerfile) with specific configuration to handle Nx monorepo complexities.

**Context:** Deploying an Nx monorepo with Next.js web app and Express API server to cloud platforms required solving several integration challenges:
- Vercel's default build process doesn't understand Nx workspace dependencies
- Nx remote cache conflicts with Vercel's caching for Next.js standalone output
- pnpm 10+ blocks postinstall scripts needed for Prisma client generation
- Railway requires explicit Dockerfile configuration for monorepo projects
- API URL routing between platforms needs careful configuration

**Alternatives Considered:**

1. **Vercel-only deployment (web + serverless API)**
   - Rejected: Express server doesn't map well to serverless functions
   - Problem: Would require significant API refactoring

2. **Railway-only deployment (web + API)**
   - Viable secondary option (see Story 5-1)
   - Deferred: Vercel offers better Next.js-specific optimizations

3. **Vercel + Railway with Nx caching enabled** 
   - Rejected: Nx cache save operation conflicts with `.next/standalone` symlinks
   - Error: "File exists (os error 17)" after successful build

4. **Vercel + Railway with `--skip-nx-cache`** ✅ **CHOSEN**
   - Nx cache disabled for web build to avoid symlink conflicts
   - All other benefits retained (remote cache for dependencies)

**Chosen Approach:** Vercel (web) + Railway (API) with Nx cache disabled for web:build

---

## Vercel Configuration (Web App)

### Dashboard Settings

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Root Directory** | `.` (empty/root) | Required for Nx to resolve `tsconfig.base.json` and workspace packages |
| **Build Command** | See below | Custom command for Prisma + Nx build |
| **Output Directory** | `apps/web/.next` | Standard Next.js output location |
| **Node.js Version** | `22.x` | Match project's `engines.node` requirement |

### Build Command (Final)

```bash
rm -rf apps/web/.next && pnpm exec prisma generate --schema=packages/database/prisma/schema.prisma && pnpm exec nx build web --skip-nx-cache
```

**Command breakdown:**
1. `rm -rf apps/web/.next` — Clear previous build artifacts to prevent Vercel cache conflicts
2. `pnpm exec prisma generate --schema=...` — Generate Prisma client with custom schema path
3. `pnpm exec nx build web --skip-nx-cache` — Build via Nx, skip cache to avoid symlink conflicts

### Environment Variables (Vercel Dashboard)

| Variable | Purpose | Scope |
|----------|---------|-------|
| `BACKEND_URL` | Railway API URL for Next.js rewrites proxy | Preview, Production |
| `DATABASE_URL` | Supabase connection string | Preview, Production |
| `SUPABASE_URL` | Supabase project URL | Preview, Production |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Preview, Production |

**Important:** Do NOT set `NEXT_PUBLIC_API_URL`. Use `BACKEND_URL` instead to leverage Next.js rewrites for cleaner API routing.

### Required package.json Configuration

```json
{
  "engines": {
    "node": "22.x"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "@prisma/client",
      "@prisma/engines",
      "prisma",
      "esbuild",
      "sharp"
    ]
  },
  "devDependencies": {
    "prisma": "^6.17.1"
  }
}
```

**Rationale:**
- `engines.node: "22.x"` — Ensures Vercel uses correct Node version
- `pnpm.onlyBuiltDependencies` — Whitelists packages that need postinstall scripts (pnpm 10+ blocks these by default)
- `prisma` in root devDependencies — Makes CLI available for `pnpm exec prisma` at monorepo root

---

## Railway Configuration (API Server)

### Project Setup

Railway auto-detects and creates services from repo. Configure via `railway.json` at repo root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "apps/server/Dockerfile"
  },
  "deploy": {
    "healthcheckPath": "/api/hello",
    "healthcheckTimeout": 60,
    "restartPolicyMaxRetries": 3
  }
}
```

**Configuration notes:**
- `dockerfilePath` — Points to server's Dockerfile (required for monorepo)
- `healthcheckPath: "/api/hello"` — Use lightweight endpoint, not `/api/health` (which queries database)
- `healthcheckTimeout: 60` — Allow time for cold starts

### Server Binding

The server must bind to `0.0.0.0` (not `localhost`) for Railway's proxy to connect:

```typescript
// apps/server/src/main.ts
const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
```

### Environment Variables (Railway Dashboard)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Supabase connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `PORT` | Auto-set by Railway |

---

## API Routing Architecture

### How Web → API Communication Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                                                                 │
│  fetch('/api/health')  ← Uses relative URL, not absolute       │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel (Next.js)                             │
│                                                                 │
│  next.config.js rewrites:                                       │
│  /api/* → ${BACKEND_URL}/api/*                                  │
│                                                                 │
│  BACKEND_URL = https://nx-monoreposerver-production.up.railway.app
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Railway (Express API)                        │
│                                                                 │
│  /api/health → Returns database health check                    │
│  /api/hello → Returns simple JSON (lightweight health check)    │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Variable Clarification

| Variable | Layer | Purpose |
|----------|-------|---------|
| `BACKEND_URL` | Server-side (Next.js rewrites) | Configures where Next.js proxies `/api/*` requests |
| `NEXT_PUBLIC_API_URL` | Client-side (baked into JS) | Optional override to bypass proxy (NOT recommended for this setup) |

**Recommendation:** Only use `BACKEND_URL`. Do not set `NEXT_PUBLIC_API_URL` — let client code use relative `/api/*` URLs that go through the rewrite proxy.

---

## Known Issues & Workarounds

### Issue 1: Nx Cache Conflict with Next.js Standalone

**Symptom:** Build succeeds but fails with "NX File exists (os error 17)" during cache save.

**Root Cause:** Nx tries to cache `.next/standalone/` directory which contains symlinks. The cache save operation conflicts with existing paths.

**Workaround:** Use `--skip-nx-cache` for web:build target. Dependency builds still use remote cache.

**Future Fix:** Monitor Nx releases for standalone output caching improvements.

### Issue 2: Prisma Client Not Generated

**Symptom:** "Module '@prisma/client' has no exported member 'HealthCheck'"

**Root Cause:** pnpm 10+ blocks postinstall scripts by default. Prisma client generation requires postinstall to download engine binaries.

**Fix:** Add `pnpm.onlyBuiltDependencies` in root `package.json` and explicit `prisma generate` in build command.

### Issue 3: Prisma CLI Not Found

**Symptom:** "Command 'prisma' not found" during Vercel build.

**Root Cause:** In pnpm workspaces, CLI tools are only available in the package where they're declared. Prisma was only in `packages/database/`.

**Fix:** Add `prisma` to root `devDependencies`.

---

## Verification Commands

```bash
# Test Railway API directly
curl https://nx-monoreposerver-production.up.railway.app/api/hello

# Test Vercel → Railway proxy (replace with your deployment URL)
curl https://nx-monorepo-web-git-e5-zwizzly.vercel.app/api/health
```

---

## Warning Signs (for AI agents)

❌ **Do not** set both `BACKEND_URL` and `NEXT_PUBLIC_API_URL`
- **Why**: Client will bypass rewrite and call API directly, potentially with wrong path
- **Instead**: Only set `BACKEND_URL`, let client use relative `/api/*` URLs

❌ **Do not** remove `--skip-nx-cache` from Vercel build command
- **Why**: Cache save will fail with "File exists" error
- **Until**: Nx fixes standalone output caching

❌ **Do not** use `/api/health` as Railway health check endpoint
- **Why**: It queries database, may timeout during cold starts
- **Instead**: Use `/api/hello` (lightweight, no DB)

❌ **Do not** set Vercel Root Directory to `apps/web`
- **Why**: Nx can't resolve `tsconfig.base.json` and workspace packages
- **Instead**: Leave Root Directory empty (monorepo root)

✅ **Do** clear `.next/` before build on Vercel
- Prevents conflicts between Vercel cache and Nx output

✅ **Do** bind server to `0.0.0.0` in production
- Required for Railway proxy to connect to container

---

## References

- Story 5-2: Configure GitHub Actions Deployment Workflow
- Story 5-3: Configure Docker Containerization (Dockerfile)
- Related: module-13 (API URL configuration for local development)
- Next.js Rewrites: https://nextjs.org/docs/app/api-reference/next-config-js/rewrites
- Railway Configuration: https://docs.railway.app/reference/config-as-code
- Nx Remote Caching: https://nx.dev/ci/features/remote-cache

**Date Resolved:** 2025-12-08
**Resolved By:** AI Agent (Claude Opus 4.5) + User (Jørn Jørgensen)

---

### Manifest & Validation Checklist
1. ✅ Add chunk entry in `docs/memories/tech-findings-log/manifest.yaml`
2. ✅ Governing artefact: `docs/sprint-artifacts/5-2-configure-github-actions-deployment-workflow.md` (Story 5.2 deployment configuration)
3. ✅ Set `validation_status: needs_review`, `last_updated_by: claude-opus-4-5`, `last_updated_at: 2025-12-08`
4. ⏳ Run Cogno sync pipeline when available


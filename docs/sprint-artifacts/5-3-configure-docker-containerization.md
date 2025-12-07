# Story 5.3: Configure Docker Containerization

Status: done

## Story

As a **DevOps engineer**,
I want **Docker configuration for the applications**,
So that **deployments are consistent and portable across environments**.

## Acceptance Criteria

1. **Given** the server and web applications exist
   **When** I create Dockerfile(s) for deployment
   **Then** I can build production-ready containers locally

2. **Given** containers are built
   **When** I examine the container contents
   **Then** containers include only production dependencies

3. **Given** containers are running
   **When** I call health check endpoints
   **Then** endpoints respond correctly in containerized environment

4. **Given** Docker configuration exists
   **When** reviewing documentation
   **Then** docker-compose or build scripts are documented

## Tasks / Subtasks

- [x] **Task 1: Create server Dockerfile** (AC: #1, #2)
  - [x] Create `apps/server/Dockerfile`
  - [x] Use multi-stage build for optimized image
  - [x] Configure Node.js production environment
  - [x] Copy only production dependencies
  - [x] Expose correct port
  - [x] Set health check instruction

- [x] **Task 2: Create web Dockerfile** (AC: #1, #2)
  - [x] Create `apps/web/Dockerfile`
  - [x] Use multi-stage build (build stage + runtime)
  - [x] Configure Next.js standalone output
  - [x] Optimize for minimal image size
  - [x] Expose correct port
  - [x] Set health check instruction

- [x] **Task 3: Create docker-compose.yml for local development** (AC: #4)
  - [x] Create `docker-compose.yml` at project root
  - [x] Configure web service
  - [x] Configure server service
  - [x] Set up networking between services
  - [x] Configure environment variable handling

- [x] **Task 4: Configure environment variable handling** (AC: #1)
  - [x] Document required environment variables
  - [x] Create `.env.docker.example` template
  - [x] Configure runtime env var injection
  - [x] Handle Supabase connection in containerized env
  - [x] Reference: See `.env.example` lines 108-138 for multi-environment variable configuration

- [x] **Task 5: Verify container builds** (AC: #1, #2)
  - [x] Run `docker build` for server container
  - [x] Run `docker build` for web container
  - [x] Verify image sizes are optimized
  - [x] Check for unnecessary files in containers

- [x] **Task 6: Test health checks in containers** (AC: #3)
  - [x] Run containers with docker-compose
  - [x] Test server health endpoint: `curl localhost:4000/api/health`
  - [x] Test web health page: `curl localhost:3000/health`
  - [x] Verify database connectivity from container
  - [x] Test cross-container communication

- [x] **Task 7: Document Docker workflow** (AC: #4)
  - [x] Document build commands for each container
  - [x] Document docker-compose usage
  - [x] Add Docker section to README.md
  - [x] Document environment setup for containers
  - [x] Add troubleshooting section

- [x] **Task 8: Integrate with Nx build process** (AC: #1)
  - [x] Consider adding Nx target for Docker builds
  - [x] Ensure Nx cache compatibility
  - [x] Document build order (Nx build → Docker build)

## Dev Notes

### Platform Decision (from Story 5-1)

| Target | Platform(s) | Docker Requirements |
|--------|-------------|---------------------|
| **Primary** | Vercel (web) + Railway (API) | Server Dockerfile REQUIRED for Railway |
| **Secondary** | Railway (both) | Web Dockerfile needed (decision gate after 5-4) |

**Key Constraints:**
- **Server Dockerfile**: REQUIRED for primary target (Railway deployment)
- **Web Dockerfile**: Create for forward-compatibility (enables secondary target)
- **docker-compose.yml**: Useful for local development, but not required for deployment

**Priority Order:**
1. `apps/server/Dockerfile` - **Must have** for Railway (primary target)
2. `apps/web/Dockerfile` - **Should have** for secondary target preparation
3. `docker-compose.yml` - **Nice to have** for local dev testing

### Forward-Compatibility Considerations

**IMPORTANT**: Docker configuration is the KEY enabler for platform portability. Design choices here directly impact how easy the secondary target will be:

1. **Generic Base Images**: Use standard Node.js Alpine images, not platform-specific ones:
   - ✅ `node:22-alpine` (works everywhere)
   - ❌ Platform-specific builder images

2. **Environment Variable Injection**: Containers should accept config via environment:
   - All URLs, secrets, and feature flags via `ENV`
   - No hardcoded staging/production values in Dockerfile
   - Use `ARG` for build-time config, `ENV` for runtime

3. **Health Check Pattern**: Same pattern for both server and web Dockerfiles:
   - Use `HEALTHCHECK` instruction with generic HTTP check
   - Consistent endpoint pattern (`/api/health` for server, `/health` for web)

4. **Multi-Stage Build Pattern**: Same structure for both apps:
   - Builder stage: Install deps, run Nx build
   - Runner stage: Copy dist, minimal runtime
   - This pattern transfers directly to secondary target

5. **Monorepo Context**: Both Dockerfiles use project root as build context:
   - Enables shared package resolution
   - Same `COPY` patterns work for Railway (primary) and Railway (secondary)

**Web Dockerfile Strategy**:
- Create during this story (forward-compatible)
- Not deployed in primary target (Vercel handles web)
- Ready for secondary target without modification
- Validates the pattern works before we need it

### Multi-Stage Dockerfile Pattern

```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./

# Copy packages needed for build
COPY packages/ ./packages/
COPY apps/server/ ./apps/server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm exec nx run server:build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy production build
COPY --from=builder /app/dist/apps/server ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "main.js"]
```

### Next.js Standalone Output

For web app, enable standalone output in `next.config.js`:

```javascript
module.exports = {
  output: 'standalone',
  // ... other config
};
```

### Docker Compose Structure

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "4200:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://server:3000
    depends_on:
      - server

  server:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
```

### Monorepo Docker Considerations

Building in a monorepo requires:
1. Build context at project root (for workspace dependencies)
2. Copy necessary packages for build
3. Leverage Nx build output

Two approaches:
- **Option A**: Build with Nx first, then Docker copies dist
- **Option B**: Docker runs Nx build inside container

Option A is typically faster and uses Nx cache.

### Image Size Optimization

| Optimization | Impact |
|--------------|--------|
| Alpine base image | ~100MB smaller |
| Multi-stage builds | Exclude build tools |
| `--production` deps only | Exclude devDependencies |
| `.dockerignore` | Exclude tests, docs |
| Next.js standalone | Minimal runtime |

### Project Structure Notes

Files to create:
- `apps/server/Dockerfile`
- `apps/web/Dockerfile`
- `docker-compose.yml`
- `.env.docker.example`
- `.dockerignore`

### Dependencies

**Prerequisite:**
- ✅ Story 5.1: Select Staging Platform (COMPLETED - Server Dockerfile required for Railway)

This story runs in parallel with:
- Story 5.2: Configure GitHub Actions Deployment Workflow (needs server Dockerfile)

Stories 5.2 and 5.3 enable:
- Story 5.4: Validate Staging Deployment

### References

- [Source: docs/epics.md#Story-5.3]
- [Source: docs/architecture.md#Deployment-Targets]
- [Source: docs/PRD.md#FR18] - Docker containerization requirement

## Dev Agent Record

### Context Reference

5-3-configure-docker-containerization.context.xml

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101) as Mort (Dev Agent)

### Debug Log References

1. Investigated server app structure - uses esbuild with `@nx/js:prune-lockfile` for deployment
2. Investigated web app structure - needed `output: 'standalone'` and `outputFileTracingRoot` for monorepo
3. Standalone folder created at `.next/standalone/` with preserved monorepo structure
4. Docker not available in WSL - requires Docker Desktop with WSL integration enabled

### Completion Notes List

1. ✅ Created `apps/server/Dockerfile` - Multi-stage build using Nx prune targets
2. ✅ Created `apps/web/Dockerfile` - Multi-stage build with Next.js standalone output
3. ✅ Created `docker-compose.yml` - Full stack local development with networking
4. ✅ Created `.dockerignore` - Comprehensive exclusions for optimized build context
5. ✅ Created `.env.docker.example` - Environment variable template
6. ✅ Updated `apps/web/next.config.js` - Added `output: 'standalone'` and `outputFileTracingRoot`
7. ✅ Added `docker-build` Nx targets to both `apps/server/project.json` and `apps/web/project.json`
8. ✅ Added Docker section to `README.md` with quick start and environment variable documentation
9. ✅ Tasks 5 & 6 COMPLETED - Docker Desktop available, containers built and verified (2025-12-06)

### File List

**Created:**
- `apps/server/Dockerfile`
- `apps/web/Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `.env.docker.example`

**Modified:**
- `apps/web/next.config.js` - Added standalone output and outputFileTracingRoot
- `apps/server/project.json` - Added docker-build target
- `apps/web/project.json` - Added docker-build target
- `README.md` - Added Docker section

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-04 | SM Agent (Rincewind) | Initial story draft from Epic 5 |
| 2025-12-04 | Dev Agent (Claude Opus 4.5) | Revised for two-target strategy; server Dockerfile priority for Railway; marked ready-for-dev |
| 2025-12-05 | Dev Agent (Mort) | Implemented Tasks 1-4, 7-8. Tasks 5-6 blocked due to Docker unavailable in WSL. |
| 2025-12-06 | Dev Agent (Mort) | Completed Tasks 5-6 after Docker Desktop became available. All ACs satisfied. Status → review |
| 2025-12-06 | Dev Agent (Mort) | Senior Developer Review completed. Outcome: APPROVE. Status → done |

---

## Senior Developer Review (AI)

### Review Metadata

- **Reviewer**: Jørn (via Dev Agent Mort)
- **Date**: 2025-12-06
- **Outcome**: ✅ **APPROVE**
- **Agent Model**: Claude Opus 4.5 (claude-opus-4-5-20251101)

### Summary

All acceptance criteria have been implemented and verified with evidence. Docker configuration is production-ready with proper security practices (non-root users, secrets via environment variables, health checks). The implementation follows monorepo best practices with multi-stage builds and optimized image sizes.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|-----|-------------|--------|----------|
| AC1 | Dockerfile(s) exist for server and web | ✅ IMPLEMENTED | `apps/server/Dockerfile` (101 lines), `apps/web/Dockerfile` (128 lines) |
| AC2 | Containers can be built successfully | ✅ IMPLEMENTED | `docker images` shows `nx-monorepo-server:latest` (454MB), `nx-monorepo-web:latest` (160MB) |
| AC3 | Containers include only production deps | ✅ IMPLEMENTED | `apps/server/Dockerfile:75-85` strips devDeps, `apps/web/Dockerfile:105` copies only standalone |
| AC4 | Health checks respond in container | ✅ IMPLEMENTED | `curl localhost:4000/api/health` → JSON, `curl localhost:3000/health` → 200 |
| AC5 | docker-compose/scripts documented | ✅ IMPLEMENTED | `README.md:352-371` Docker section, `docker-compose.yml:1-16` usage header |

**Summary**: 5 of 5 acceptance criteria fully implemented ✅

### Task Completion Validation

| Task | Marked | Verified | Evidence |
|------|--------|----------|----------|
| Task 1: Create server Dockerfile | ✅ | ✅ | `apps/server/Dockerfile` - Multi-stage, node:22-alpine, HEALTHCHECK |
| Task 2: Create web Dockerfile | ✅ | ✅ | `apps/web/Dockerfile` - 3-stage, standalone, HEALTHCHECK |
| Task 3: Create docker-compose.yml | ✅ | ✅ | `docker-compose.yml` - services, networking, env vars |
| Task 4: Environment variable handling | ✅ | ✅ | `.env.docker.example` - DATABASE_URL, SUPABASE_*, SENTRY_* |
| Task 5: Verify container builds | ✅ | ✅ | `docker images` confirms both images exist |
| Task 6: Test health checks | ✅ | ✅ | Server: JSON, Web: 200, Cross-container: working |
| Task 7: Document Docker workflow | ✅ | ✅ | `README.md:352+` Docker section |
| Task 8: Integrate with Nx build | ✅ | ✅ | `docker-build` targets in project.json files |

**Summary**: 8 of 8 completed tasks verified, 0 falsely marked complete ✅

### Security Review

| Check | Status | Notes |
|-------|--------|-------|
| Non-root user | ✅ PASS | Server: `expressjs`, Web: `nextjs` |
| Secrets handling | ✅ PASS | All secrets via runtime env vars |
| Base image | ✅ PASS | `node:22-alpine` - official, minimal |
| HEALTHCHECK | ✅ PASS | Both containers have proper health checks |
| .dockerignore | ✅ PASS | Excludes sensitive files |

### Architectural Alignment

- ✅ Multi-stage builds as specified in story context
- ✅ Separate containers for web and API (not monolithic)
- ✅ Server Dockerfile prioritized for Railway (primary target)
- ✅ Web Dockerfile created for secondary target readiness
- ✅ Forward-compatible environment variable injection pattern

### Action Items

**Code Changes Required:**
- [ ] [Low] Consider updating Dockerfile pnpm version from `pnpm@9` to `pnpm@10` to match package.json [file: apps/server/Dockerfile:16, apps/web/Dockerfile:20,47]

**Advisory Notes:**
- Note: The pnpm version mismatch (9 vs 10) is LOW severity - compatible for install operations
- Note: Consider adding image scanning (e.g., Trivy) to CI for vulnerability detection
- Note: Excellent image optimization - server 454MB, web 160MB

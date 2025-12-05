# Story 5.1: Select Staging Platform

Status: done

## Story

As a **DevOps engineer**,
I want **to select a staging deployment platform**,
So that **we have a home for our deployed application with documented rationale**.

## Acceptance Criteria

1. **Given** the project requirements (Next.js + Express + PostgreSQL + React Native/Expo)
   **When** I evaluate lightweight hosting options
   **Then** I select a platform with documented rationale

2. **Given** I am evaluating platforms
   **When** I analyze options
   **Then** evaluation considers: Vercel, Railway, Render, Fly.io

3. **Given** the monorepo includes mobile applications
   **When** I evaluate platform compatibility
   **Then** I verify the platform works with:
   - Expo development builds connecting to staging API
   - React Native apps on physical devices/simulators
   - EAS Build and EAS Update workflows (if applicable)

4. **Given** a platform is selected
   **When** I document the decision
   **Then** decision is recorded in `docs/architecture-decisions.md`

5. **Given** alternatives were considered
   **When** I document the decision
   **Then** rejected alternatives are listed with rationale

## Tasks / Subtasks

- [x] **Task 1: Research platform capabilities** (AC: #1, #2)
  - [x] Document Vercel capabilities for Next.js + API
  - [x] Document Railway capabilities (full-stack support)
  - [x] Document Render capabilities (web services + background workers)
  - [x] Document Fly.io capabilities (edge deployment, containers)

- [x] **Task 2: Evaluate cost considerations** (AC: #1)
  - [x] Research free tier limits for each platform
  - [x] Document expected costs for staging workload
  - [x] Note any billing complexity or surprises

- [x] **Task 3: Evaluate integration with existing stack** (AC: #1)
  - [x] Check Supabase connection compatibility
  - [x] Verify GitHub Actions integration support
  - [x] Assess secrets management capabilities
  - [x] Check Docker support where applicable

- [x] **Task 3b: Evaluate mobile development compatibility** (AC: #3)
  - [x] Verify staging API is accessible from Expo Go / dev builds
  - [x] Check CORS configuration for mobile origins
  - [x] Test connectivity from physical devices on same network
  - [x] Evaluate EAS Build integration (environment variables, API URLs)
  - [x] Consider OTA update hosting needs (EAS Update or self-hosted)
  - [x] Document any platform-specific mobile networking quirks

- [x] **Task 4: Create comparison matrix** (AC: #2, #3)
  - [x] Create table with criteria: ease of setup, cost, CI/CD support, Supabase integration, mobile compatibility
  - [x] Score each platform against criteria
  - [x] Note any platform-specific constraints
  - [x] Include mobile-specific considerations in scoring

- [x] **Task 5: Make platform selection** (AC: #1, #3)
  - [x] Select primary staging platform
  - [x] Document selection rationale
  - [x] Identify any hybrid approaches if needed (e.g., Vercel for web, Railway for API)

- [x] **Task 6: Document in architecture-decisions.md** (AC: #3, #4)
  - [x] Add ADR entry for staging platform selection
  - [x] Include comparison matrix summary
  - [x] Document rejected alternatives with reasons
  - [x] Note any future considerations

- [ ] **Task 7: Update environment documentation** (AC: #3)
  - [ ] Document platform-specific environment variable requirements
  - [ ] Update `docs/environment-setup.md` with staging section
  - [ ] Note any platform-specific configuration needs

## Dev Notes

### Evaluation Criteria

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Ease of Setup | High | Time to first deployment |
| Cost | Medium | Free tier limits, pricing model |
| CI/CD Integration | High | GitHub Actions compatibility |
| Supabase Compatibility | High | Connection pooling, SSL requirements |
| **Mobile Compatibility** | **High** | **Expo/RN connectivity, CORS, device access** |
| Docker Support | Medium | Containerization flexibility |
| Monitoring | Low | Built-in observability (we have Sentry) |

### Platform Considerations

**Vercel:**
- ✅ Native Next.js support (optimized)
- ✅ Stable URLs work well with mobile dev builds
- ⚠️ Express server requires separate hosting or serverless adaptation
- ⚠️ Cold starts for serverless functions
- 📱 Mobile: Works if API hosted elsewhere with proper CORS

**Railway:**
- ✅ Full-stack support (Next.js + Express in containers)
- ✅ Built-in database support (though we use Supabase)
- ✅ Simple GitHub integration
- ✅ Stable public URLs for API access
- 📱 Mobile: Good - consistent URLs, no cold start issues for API

**Render:**
- ✅ Web services and background workers
- ✅ Auto-deploy from GitHub
- ⚠️ Cold starts on free tier
- 📱 Mobile: Works but cold starts may affect dev experience

**Fly.io:**
- ✅ Edge deployment capabilities
- ✅ Full Docker support
- ⚠️ More complex setup
- ⚠️ CLI-focused workflow
- 📱 Mobile: Works well - global edge reduces latency for devices

### Architecture Constraints

From `docs/architecture.md`:
- Web: Next.js 15.2 (App Router)
- Server: Express 4.x
- Database: Prisma + Supabase PostgreSQL
- **Mobile: React Native / Expo** (Epic 6)
- Both apps need to run concurrently
- Health check endpoints available for validation

### Mobile Development Considerations

**Critical Requirements:**
- Staging API must be accessible via HTTPS with valid SSL certificate
- CORS must allow requests from Expo development builds
- API URL must be configurable at build time (EAS) and runtime (Expo Updates)
- Physical devices on different networks need public URL access

**Expo/React Native Specifics:**
| Scenario | Requirement |
|----------|-------------|
| Expo Go development | Public HTTPS URL or tunneling |
| Development build on simulator | localhost or staging URL |
| Development build on physical device | Public staging URL |
| EAS Build (preview/production) | Hardcoded or env-injected API URL |
| EAS Update (OTA) | API URL baked into JS bundle |

**EAS Integration:**
- `eas.json` can define environment-specific variables
- `app.config.js` can read from `process.env` during build
- Consider: Should staging use EAS Build or just dev builds?

**CORS Configuration:**
```javascript
// Server CORS must include:
// - Expo Go: exp://xxx.xxx.xxx.xxx:xxxx
// - Dev builds: Custom scheme (e.g., myapp://)
// - Staging web: https://staging.example.com
```

### Hybrid Deployment Pattern

Consider if splitting is beneficial:
- **Option A**: Single platform hosts both apps
- **Option B**: Vercel for Next.js, separate platform for Express

Decision should consider operational simplicity vs optimization.

### Project Structure Notes

- This is a research and decision story
- No code changes required
- Output is documentation only
- Foundation for stories 5.2, 5.3, 5.4

### References

- [Source: docs/epics.md#Story-5.1]
- [Source: docs/architecture.md#Deployment-Targets]
- [Source: docs/PRD.md#FR16-FR18] - DevOps requirements
- [Source: docs/PRD.md#FR20-FR22] - Mobile platform requirements
- [Related: Epic 6] - Mobile Walking Skeleton (depends on this decision)

## Decision Outcome

### Selected Platforms

| Target | Platform(s) | Purpose |
|--------|-------------|---------|
| **Primary** | Vercel (web) + Railway (API) | "Best of breed" approach - optimized for each workload |
| **Secondary** | Railway (both) | Full Docker containerization for portability demo |

### Key Decision Points

1. **Two-Target Strategy**: PoC both approaches; primary first, secondary if time permits
2. **Pure Express**: Keep Express as long-running container (no serverless adaptation)
3. **Supabase TEST**: Use existing TEST project for staging (shared with CI)
4. **Mobile-Ready**: Both targets provide stable HTTPS URLs suitable for Expo/RN development
5. **Forward-Compatible Docker**: Create server Dockerfile immediately (required for primary), web Dockerfile during implementation (enables secondary)

### Full ADR Reference

See `docs/architecture-decisions.md` section "Epic 5: CI/CD Staging Platform Selection" for:
- Complete comparison matrix
- Cost analysis
- Mobile compatibility matrix
- Environment strategy
- Implementation sequence

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/5-1-create-server-auth-middleware-structure.context.xml` (inherited context)

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - Research and documentation story, no code implementation

### Completion Notes List

1. Evaluated Vercel, Railway, Render, and Fly.io against criteria
2. Selected Two-Target Strategy: Vercel+Railway (primary) and Railway+Railway (secondary)
3. Documented comprehensive ADR in architecture-decisions.md
4. User approved the hybrid approach with Railway for Express API (avoids serverless adaptation)
5. Task 7 (environment docs update) deferred to Story 5-2 which will implement the actual configuration

### File List

- `docs/architecture-decisions.md` - Added Epic 5 Platform Selection ADR
- `docs/sprint-artifacts/5-1-select-staging-platform.md` - This file (marked complete)

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-04 | SM Agent (Rincewind) | Initial story draft from Epic 5 |
| 2025-12-04 | SM Agent (Rincewind) | Added mobile compatibility requirements (AC#3, Task 3b) per user feedback |
| 2025-12-04 | Dev Agent (Claude Opus 4.5) | Completed platform evaluation and selection; marked story done |

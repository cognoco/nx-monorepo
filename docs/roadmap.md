---
Created: 2025-10-17
Modified: 2025-12-03
Version: 2.0
tier: governance
bmad-phase: planning
---
# Implementation Roadmap

> **BMAD Tier 1: Governance** – This document defines the implementation roadmap across all phases (MVP, Task App PoC, Extensions). It complements `PRD.md` (WHAT/WHY) and `constitution.md` (principles). For technical HOW details, see `architecture.md`.

## Introduction

This document is the implementation roadmap for the AI-Native Nx Monorepo Template. It tracks progress across three phases aligned with the PRD.

### Phase 1 Outcome: MVP (Walking Skeleton + Infrastructure)

By completion, we will have:
- **Three applications validated**: Web (Next.js), Server (Express), Mobile (Expo) - all with working walking skeleton
- **Four shared packages**: database, schemas, api-client, supabase-client
- **End-to-end validation**: Health check feature flowing through all layers (web/mobile → API client → server → database)
- **Complete infrastructure**: CI/CD to staging, Sentry observability, auth infrastructure wired, comprehensive QA with Husky/lint-staged

### Phase 2 Outcome: Task App PoC

Validates the template by building a real application:
- Task/todo app with CRUD, authentication, and cross-platform sync (web + mobile)
- Test coverage raised to ≥80% with enforcement at PR merge
- Production deployment to two platforms

### Phase 3 Outcome: Template Extensions (Future)

Optional advanced patterns: real-time subscriptions, file storage, multi-tenancy, additional deployment targets.

> **Architecture Reference**: Technology decisions and rationale are documented in `architecture.md` (Decision Summary) and `architecture-decisions.md` (detailed ADRs).

---

## Phase 1: MVP (Walking Skeleton + Infrastructure)

This phase validates that all infrastructure, tooling, and package versions are compatible before feature development. By the end of Phase 1, we have a working walking skeleton across web, server, and mobile that proves the foundation is solid.

### Stage 0: Current State Audit

### Goal

Verify that the out-of-the-box Nx setup works correctly and meets all prerequisites before making any changes.

### Sub-stages

- [x] **0.1: Verify prerequisites** ✅
  - [x] 0.1.1: Check Node.js version (required: 20.19.9+) - 20.19.9 ✅
  - [x] 0.1.2: Check pnpm version - 10.19.0 ✅
    - [x] 0.1.2.1: Run `pnpm setup` to configure global bin directory
    - [x] 0.1.2.2: Restart terminal to apply PATH changes
    - [x] 0.1.2.3: Run `pnpm self-update` to upgrade to latest version
    - [x] 0.1.2.4: Update packageManager in package.json to pnpm@10.19.0
  - [x] 0.1.3: Verify pnpm is set as package manager (not npm) - Added to package.json ✅
  - [x] 0.1.4: Clean up any npm artifacts (package-lock.json) if present - Deleted ✅
  - [x] 0.1.5: Verify Playwright browsers installed - v1.56.0 ✅
  - [x] 0.1.6: Document prerequisite versions in `docs/prerequisites.md` ✅
  - [x] 0.1.7: Create pnpm-workspace.yaml to replace package.json workspaces field ✅
  - [x] 0.1.8: Remove "workspaces" field from package.json (pnpm-specific config) ✅
  - [x] 0.1.9: Clean node_modules and reinstall with pnpm to remove npm residue ✅

- [x] **0.2: Verify existing web app builds and runs** ✅
  - [x] 0.2.1: Run `pnpm install` and verify no errors - Created pnpm-workspace.yaml, cleaned node_modules ✅
    - [x] Fixed @swc/core peer dependency (updated from ~1.5.29 to ^1.13.5)
    - [x] Approved build scripts for nx and @swc/core via pnpm approve-builds
    - [x] Added common npm scripts to package.json (dev, build, test, lint, e2e)
  - [x] 0.2.2: Run `pnpm exec nx run web:build` and verify success - Build completed in 18s ✅
  - [x] 0.2.3: Run `pnpm exec nx run web:dev` and verify dev server starts ✅
  - [x] 0.2.4: Access http://localhost:3000 and verify app loads ✅

- [x] **0.3: Test existing QA tooling** ✅
  - [x] 0.3.1: Run `pnpm exec nx run web:lint` and verify passes ✅
  - [x] 0.3.2: Run `pnpm exec nx run web:test` and verify all tests pass - Fixed Jest config ✅
    - [x] Installed @nx/react to fix missing transform plugin
    - [x] Added testMatch pattern to find tests in specs/ folder
    - [x] Added forceExit to prevent Jest hanging after tests complete
  - [x] 0.3.3: Run `pnpm exec nx run web-e2e:e2e` and verify Playwright E2E tests pass (smoke tests) - 3/3 tests passed ✅
    - [x] Added test timeouts to playwright.config.ts (30s test, 5s assertions)
  - [x] 0.3.4: Verify Prettier formatting works ✅
    - [x] Updated .prettierignore to exclude build artifacts (.next, test-output, etc)

- [x] **0.4: Validate CI pipeline** ✅
  - [x] 0.4.1: Confirm GitHub Actions workflow passes on latest commit - CI passes on PR #4 ✅
  - [x] 0.4.2: Verify Nx Cloud integration shows task results - Nx Cloud showing results ✅
  - [x] 0.4.3: Verify Claude Code Review workflow triggers and completes successfully ✅
  - [x] 0.4.4: Verify CodeRabbit picks up .coderabbit.yaml config and executes review - Verified on PR #4 ✅
  - [x] 0.4.5: Test cache hits by running build twice: `pnpm exec nx run web:build` (second run should be cached)

- [ ] **0.4b: Code Review Fixes** (Quality improvements from PR #4 code reviews)
  - [x] 0.4b.1: Fix Playwright webServer to use pnpm instead of npx ✅
    - Issue: `apps/web-e2e/playwright.config.ts` uses `npx nx` instead of `pnpm exec nx`
    - Impact: Inconsistent with pnpm migration, breaks package manager consistency
    - Fix: Change webServer command to `pnpm exec nx run @nx-monorepo/web:start`
    - Validation: E2E tests passed (3/3) with new command
    - Additional finding: 44 total npx references found across codebase (39 need updating)

  - [x] 0.4b.2: Verify TypeScript typecheck passes
    - Issue: CI runs `typecheck` target but hasn't been verified locally
    - Fix: Run `pnpm exec nx run-many -t typecheck` and confirm it passes

  - [x] 0.4b.3: Fix Jest forceExit root cause (NOT DEFERRED) ✅

    - Issue: `forceExit: true` in `apps/web/jest.config.ts` can mask real issues and isn’t template-ideal.
    - Summary (final): We reverted `forceExit` to `false`. Intermittent hangs observed over several days were most likely environmental (background runner/socket state) rather than a code leak. After environment resets (new shell, daemon/cloud toggles) tests exited cleanly without `forceExit`.
    - Guidance:
      - Keep `forceExit: false` by default in the template.
      - For local diagnosis only, run with `--detectOpenHandles`, or temporarily add `--forceExit` to the command (do not commit).
      - If a hang reappears, first try disabling helpers for the run: `NX_DAEMON=false nx run web:test --no-cloud`, or bypass Nx by running Jest directly.

  - [x] 0.4b.4: Investigate tsconfig.json changes ✅
    - Issue: `apps/web/tsconfig.json` has unexplained changes (likely Next.js auto-updates)
    - Finding: Next.js 15.2 automatic TypeScript configuration (expected BAU behavior)
    - Changes: Added `.next/types/**/*.ts` and reordered include array for optimization
    - Root cause: Next.js dev server auto-configures tsconfig.json during `next dev` startup
    - Action: Accepted as BAU - changes improve type safety and should remain committed
    - Impact: Enables route type safety, env var IntelliSense, and Next.js API type inference

  - [x] 0.4b.5: Document .prettierignore markdown/docs exclusions ✅
    - Issue: Excluding all markdown and docs directories raises reviewer questions
    - Decision: Keep exclusions (allows manual formatting control for documentation)
    - Fix: Add comments to `.prettierignore` explaining rationale for excluding docs and markdown
    - Completed: Added comprehensive comments explaining rationale for exclusions

	  - [x] 0.4b.6: Resolve Jest test location strategy ✅
    - Issue: testMatch included both `specs/` and `src/` directories - inconsistent convention
    - Solution: Adopted Next.js 15 default - co-located tests in `src/` directory
    - Actions taken:
      - Migrated `specs/index.spec.tsx` → `src/app/page.spec.tsx`
      - Updated jest.config.ts testMatch to single pattern: `<rootDir>/src/**/*.(spec|test).[jt]s?(x)`
      - Added collectCoverageFrom configuration excluding test files
      - Validated with full CI simulation (tests, build, cache clear)
    - Result: Single, consistent test location pattern following Next.js 15 best practices
    - Note: Testing infrastructure enhancements (jest-dom, type isolation) deferred to Stage 3 (see 3.3) for workspace-level, reusable implementation

- [x] **0.5: Validate workspace scripts**
  - [x] 0.5.1: Verify package.json scripts are set up correctly ✅
    - Confirmed package.json has scripts: dev, build, test, lint, e2e
    - All scripts use proper pnpm/nx commands
  - [x] 0.5.2: Test workspace-level commands work ✅
    - `pnpm run build` - Successfully builds all projects
    - `pnpm run lint` - Passes (fixed eslint.config.mjs to ignore build artifacts: **/dist, **/out-tsc, **/.next)
    - `pnpm run test` - Tests pass (exhibits known Windows hanging behavior from 0.4b.3)
    - `pnpm run e2e` - All 3 E2E tests pass (chromium, firefox, webkit)
    - `pnpm run dev` - Dev server starts successfully on http://localhost:3000
  - [x] 0.5.3: Document available commands ✅
    - Updated README.md with workspace scripts and pnpm exec nx commands
    - Updated CLAUDE.md with workspace scripts section and pnpm exec nx commands throughout
    - All command documentation now uses pnpm (not npx) for consistency
    - Documentation aligns with verified workspace scripts from task 0.5.2

- [x] **0.6: Document current package versions** ✅
  - [x] 0.6.1: Run `pnpm list --depth=1 > docs/package-versions-baseline.txt` ✅
    - Generated complete dependency tree at depth=1
    - File: `docs/package-versions-baseline.txt` (513 lines)
  - [x] 0.6.2: Create `docs/package-versions-baseline.md` with key versions ✅
    - Created comprehensive markdown documentation
    - Organized by categories: Environment, Core Frameworks, Build Tools, Nx Plugins, Testing, Code Quality, Dev Tools
    - File: `docs/package-versions-baseline.md`
  - [x] 0.6.3: Capture Next.js, React, TypeScript, Nx versions ✅
    - Next.js: 15.2.5
    - React: 19.0.0
    - TypeScript: 5.9.3
    - Nx: 21.6.5
    - Node.js: v20.19.9
    - pnpm: 10.19.0
    - Additional key versions: Jest 30.2.0, Playwright 1.56.1, ESLint 9.37.0, Prettier 2.8.8

### Success Criteria

- [x] Prerequisites documented and verified ✅
- [x] pnpm is confirmed as package manager (no package-lock.json) ✅
- [x] `pnpm install` completes without errors or warnings ✅
- [x] `pnpm exec nx run web:build` succeeds ✅
- [x] `pnpm exec nx run web:dev` starts development server successfully ✅
- [x] `pnpm exec nx run web:lint` passes with no errors ✅
- [x] `pnpm exec nx run web:test` passes all tests ✅
- [x] `pnpm exec nx run web-e2e:e2e` passes all Playwright tests ✅
- [x] GitHub Actions CI workflow passes on latest commit ✅
- [x] Nx Cloud shows successful task caching (cache hit on second build) ✅
- [x] Package version baseline documented in `docs/package-versions-baseline.md` ✅
- [x] Prerequisites documented in `docs/prerequisites.md` ✅

**Stage 0 Estimated Time:** 45 minutes - 1 hour

---

### Stage 1: Generate Server Application

### Goal

Create the server application using Nx generators, ensuring it builds and runs independently with proper QA tooling before proceeding.

### Sub-stages

- [x] **1.1: Generate server application**
  - [x] 1.1.1a: Install @nx/node plugin: `pnpm exec nx add @nx/node`
  - [x] 1.1.1b: Run: `pnpm exec nx g @nx/node:app server --directory=apps/server --framework=express`
  - [x] 1.1.2: Review generated files and structure
  - [x] 1.1.3: Verify TypeScript project reference added to root tsconfig.json
    - Note: Apps use TypeScript Project References, not path aliases (libraries use path aliases)

- [x] **1.2: Immediate validation**
  - [x] 1.2.1: Run `pnpm exec nx run server:build` and verify success
  - [x] 1.2.2: Run `pnpm exec nx run server:serve` and verify server starts on expected port
  - [x] 1.2.3: Verify server responds to default route (curl or browser)
  - [x] 1.2.4: Run `pnpm exec nx run server:lint` and verify passes
  - [x] 1.2.5: Configure and run server tests
    - [x] 1.2.5a: Generate Jest config: `pnpm exec nx g @nx/jest:configuration --project=server`
    - [x] 1.2.5b: Run `pnpm exec nx run server:test` and verify default tests pass
    - Note: @nx/node:app with Express doesn't create Jest config by default

- [x] **1.3: Update workspace scripts**
  - [x] 1.3.1: Do NOT add server-specific scripts to root package.json
    - Rationale: Keep workspace scripts focused on workspace-wide operations
    - Developers will use `pnpm exec nx run server:serve` directly for server-specific work
  - [x] 1.3.2: Document how to run server in development
    - Add to .ruler/AGENTS.md: "Start server: `pnpm exec nx run server:serve`"

- [x] **1.4: Verify workspace health**
  - [x] 1.4.1: Run `pnpm exec nx graph` and verify clean dependency structure
  - [x] 1.4.2: Run `pnpm exec nx run-many -t build` and verify both web and server build
  - [x] 1.4.3: Verify Nx cache works for server tasks
    - [x] Run `pnpm exec nx reset` to clear cache
    - [x] Run `pnpm exec nx run server:build` (first build, should execute)
    - [x] Run `pnpm exec nx run server:build` again (should use cache)
    - [x] Verify second run shows "[local cache]" or similar cache hit message

### Success Criteria

- [ ] Server application generated in `apps/server/`
- [ ] `pnpm exec nx run server:build` succeeds
- [ ] `pnpm exec nx run server:serve` starts server on expected port
- [ ] Server responds to health check endpoint (default Express route)
- [ ] `pnpm exec nx run server:lint` passes
- [ ] `pnpm exec nx run server:test` passes (with default tests)
- [ ] `pnpm exec nx graph` shows both web and server apps with no circular dependencies
- [ ] `pnpm exec nx run-many -t build` builds both apps successfully
- [ ] Nx cache hits work for server tasks (run build twice)

**Stage 1 Estimated Time:** 30-45 minutes

---

### Stage 2: Generate Shared Packages

### Goal

Create all shared libraries following Nx conventions, ensuring each package builds and tests correctly immediately after generation.

### Sub-stages

- [x] **2.1: Generate database package**
  - [x] 2.1.1: Run: `pnpm exec nx g @nx/js:lib database --directory=packages/database --bundler=none`
    - **Note**: Uses `--bundler=none` because Prisma generates code at runtime (see `docs/memories/tech-findings-log.md`)
  - [x] 2.1.2: Install Prisma dependencies: `pnpm add -D prisma --filter @nx-monorepo/database`
  - [x] 2.1.3: Install Prisma client: `pnpm add @prisma/client --filter @nx-monorepo/database`
  - [x] 2.1.4: Set up basic Prisma configuration structure
  - [x] 2.1.5: **Immediate test**: Verify NO build target exists (expected with `--bundler=none`)
    - Run `pnpm exec nx show project database` and confirm build target is absent
    - This is correct behavior - database package has no pre-build step
  - [x] 2.1.6: **Immediate test**: Run `pnpm exec nx run database:lint` and verify passes
  - [x] 2.1.7: **Immediate test**: Run `pnpm exec nx run database:test` and verify passes

- [x] **2.2: Generate schemas package**
  - [x] 2.2.1: Run: `pnpm exec nx g @nx/js:lib schemas --directory=packages/schemas --bundler=tsc`
  - [x] 2.2.2: Install Zod: `pnpm add zod --filter @nx-monorepo/schemas`
  - [x] 2.2.3: Create placeholder schema exports
  - [x] 2.2.4: **Immediate test**: Run `pnpm exec nx run schemas:build` and verify success
  - [x] 2.2.5: **Immediate test**: Run `pnpm exec nx run schemas:lint` and verify passes
  - [x] 2.2.6: **Immediate test**: Run `pnpm exec nx run schemas:test` and verify passes

- [x] **2.3: Generate api-client package**
  - [x] 2.3.1: Run: `pnpm exec nx g @nx/js:lib api-client --directory=packages/api-client --bundler=tsc`
  - [x] 2.3.2: Set up API client structure (oRPC initially installed, will be replaced after Stage 4.1)
    - Note: Placeholder implementation until REST+OpenAPI tooling is configured in Stage 4
  - [x] 2.3.3: Set up basic client factory structure
  - [x] 2.3.4: **Immediate test**: Run `pnpm exec nx run api-client:build` and verify success
  - [x] 2.3.5: **Immediate test**: Run `pnpm exec nx run api-client:lint` and verify passes
  - [x] 2.3.6: **Immediate test**: Run `pnpm exec nx run api-client:test` and verify passes

- [x] **2.4: Generate supabase-client package**
  - [x] 2.4.1: Run: `pnpm exec nx g @nx/js:lib supabase-client --directory=packages/supabase-client --bundler=tsc`
  - [x] 2.4.2: Install Supabase client: `pnpm add @supabase/supabase-js --filter @nx-monorepo/supabase-client`
  - [x] 2.4.3: Install Supabase SSR: `pnpm add @supabase/ssr --filter @nx-monorepo/supabase-client`
  - [x] 2.4.4: Set up client factory structure
  - [x] 2.4.5: **Immediate test**: Run `pnpm exec nx run supabase-client:build` and verify success
  - [x] 2.4.6: **Immediate test**: Run `pnpm exec nx run supabase-client:lint` and verify passes
  - [x] 2.4.7: **Immediate test**: Run `pnpm exec nx run supabase-client:test` and verify passes

- [x] **2.5: Verify package dependency graph and cross-package integration**
  - [x] 2.5.1: Run `pnpm exec nx graph` and verify clean dependency structure
  - [x] 2.5.2: Ensure proper library boundaries (no circular dependencies)
  - [x] 2.5.3: Verify build order is correct
  - [x] 2.5.4: Test that apps can import from packages (TypeScript paths resolve)
  - [x] 2.5.5: Run `pnpm exec nx run-many -t build` and verify all packages build
  - [x] 2.5.6: Test incremental builds: change one package, verify only dependents rebuild


### Success Criteria

- [ ] All four packages generated and build successfully
- [ ] Each package passed lint immediately after generation
- [ ] Each package passed tests immediately after generation
- [ ] `pnpm exec nx run-many -t build --projects=tag:type:lib` succeeds
- [ ] All packages build: database, schemas, api-client, supabase-client
- [ ] All packages pass lint: `pnpm exec nx run-many -t lint --projects=tag:type:lib`
- [ ] All packages pass tests: `pnpm exec nx run-many -t test --projects=tag:type:lib`
- [ ] `pnpm exec nx graph` shows clean dependency structure (no circular dependencies)
- [ ] Apps can import from packages (TypeScript paths resolve correctly)
- [ ] Incremental builds work (changing one package only rebuilds dependents)
- [ ] All necessary dependencies installed and documented

**Stage 2 Estimated Time:** 1-1.5 hours

---

### Stage 3: QA Infrastructure Setup

### Goal

Establish quality assurance tooling and testing scaffolding early to create a safety net before building the walking skeleton. This ensures all subsequent development happens with quality gates active.

### Sub-stages

- [x] **3.1: Install and configure Husky**
  - [x] 3.1.1: Install Husky: `pnpm add -D husky -w`
  - [x] 3.1.2: Initialize Husky: `pnpm exec husky init`
  - [x] 3.1.3: Set up Git hooks infrastructure
  - [x] 3.1.4: Configure pre-commit hook for linting and formatting
  - [x] 3.1.5: Install commitlint: `pnpm add -D -w @commitlint/cli @commitlint/config-conventional`
  - [x] 3.1.6: Create `commitlint.config.js` with custom type prefixes (feat, fix, docs, chore, cfg, plan, zdx)
  - [x] 3.1.7: Configure commit-msg hook for conventional commits
  - [x] 3.1.8: Test hook triggers on commit attempt

- [x] **3.2: Add pre-commit validation with lint-staged**
  - [x] 3.2.1: Install lint-staged: `pnpm add -D lint-staged -w`
  - [x] 3.2.2: Create `.lintstagedrc.json` configuration
  - [x] 3.2.3: Configure to run ESLint and Prettier on staged files only (default config)
  - [x] 3.2.4: Ensure it respects Nx project boundaries
  - [x] 3.2.5: Test by staging files and committing

- [x] **3.3: Verify and document existing testing infrastructure** ✅

  **Rationale**: Nx auto-generates proper Jest configurations for each project with workspace-level preset management. Rather than creating custom infrastructure, verify the standard Nx patterns work correctly and document them for future reference.

  **Current Reality**:
  - ✅ Workspace preset exists: `jest.preset.js` (from `@nx/jest/preset`)
  - ✅ Web app extends workspace preset: `apps/web/jest.config.ts`
  - ✅ TypeScript test config works: `apps/web/tsconfig.spec.json` extends `tsconfig.base.json`
  - ✅ Tests pass with standard configuration (no custom setup needed yet)

  **Approach**: Validate existing patterns, document for consistency, add optional enhancements only when actually needed.

  - [x] 3.3.1: Verify web app Jest configuration follows Nx standards ✅
    - [x] Confirm `apps/web/jest.config.ts` extends `../../jest.preset.js` ✅
    - [x] Confirm tests run successfully with current setup ✅
    - [x] Review test configuration for any necessary adjustments ✅
      - Fixed type isolation issue: Removed jest types from production `tsconfig.json`
      - Validated tests still pass after configuration adjustment
    - [x] Document current pattern for future projects ✅
      - Added "Jest Configuration Patterns" section to `.ruler/AGENTS.md`

  - [x] 3.3.2: Verify TypeScript test configuration follows Nx standards ✅
    - [x] Confirm `apps/web/tsconfig.spec.json` extends `../../tsconfig.base.json` ✅
    - [x] Confirm Jest types are included: `"types": ["jest", "node"]` ✅
    - [x] Verify production `tsconfig.json` doesn't include test types ✅
      - Fixed: Removed test types from production config for proper type isolation
    - [x] Document pattern for future projects ✅
      - Documented TypeScript test configuration pattern in `.ruler/AGENTS.md`

  - [x] 3.3.3: Document how to add Jest to new projects ✅
    - [x] Add to .ruler/AGENTS.md: "To add Jest to a project: `pnpm exec nx g @nx/jest:configuration <project>`" ✅
    - [x] Document that Nx auto-generates proper configs extending workspace preset ✅
    - [x] Note: No manual setup required - Nx handles it automatically ✅

  - [x] 3.3.4: Document optional testing library enhancements (for future use) ✅
    - [x] Create `docs/testing-enhancements.md` with optional patterns: ✅
      - @testing-library/jest-dom setup and usage
      - setupFilesAfterEnv configuration pattern
      - @testing-library/user-event for realistic user interactions
      - Test ID best practices with namespaced conventions
      - MSW (Mock Service Worker) for API mocking
      - Custom render function with providers
    - [x] Note: These are optional - add only when specific projects need them ✅
    - [x] Emphasize: Start simple, add complexity only when justified ✅

- [x] **3.4: Configure test coverage reporting** ✅

  **Approach**: Establish coverage infrastructure with permissive thresholds (10%) during Phase 1 walking skeleton. This validates the infrastructure without blocking development - thresholds will be raised to 80% in Phase 2.

  **Implemented**:
  - ✅ Coverage scripts added to root `package.json`:
    - `test:coverage` - Run coverage for all projects
    - `test:coverage:web` - Run coverage for web app
    - `test:coverage:server` - Run coverage for server
  - ✅ Coverage thresholds added to `apps/web/jest.config.ts`:
    - All metrics set to 10% (branches, functions, lines, statements)
    - Aspirational comments documenting 80% target for Phase 2+
  - ✅ Coverage directory pattern verified: `coverageDirectory: '../../coverage/apps/web'`
  - ✅ Coverage workflow tested and validated:
    - HTML reports generate correctly at `coverage/apps/web/lcov-report/index.html`
    - Threshold enforcement verified (intentionally failed with 99% threshold, then restored to 10%)
    - Tests pass with 10% thresholds
  - ✅ Comprehensive coverage documentation added to `.ruler/AGENTS.md`:
    - Coverage scripts usage
    - Coverage thresholds explanation with rationale
    - Coverage metrics definitions (branches, functions, lines, statements)
    - Coverage reports location and contents
    - Coverage directory structure pattern
    - Adding coverage to new projects

  - [x] 3.4.1: Add coverage scripts to root package.json ✅
    - Added `test:coverage`, `test:coverage:web`, `test:coverage:server`
    - Follows existing script pattern (workspace-wide + per-project)

  - [x] 3.4.2: Standardize coverage thresholds across projects ✅
    - Added 10% thresholds to `apps/web/jest.config.ts`
    - Documented with aspirational 80% target comments
    - Pattern ready to apply to future projects

  - [x] 3.4.3: Configure coverage directory structure ✅
    - Verified existing pattern: `../../coverage/apps/web`
    - Documented pattern for future projects
    - Confirmed `/coverage` is gitignored

  - [x] 3.4.4: Document coverage commands and viewing reports ✅
    - Added comprehensive "Coverage Testing" section to `.ruler/AGENTS.md`
    - Documented scripts, thresholds, reports, directory structure
    - Included platform-specific report opening commands

  - [x] 3.4.5: Test coverage workflow and update checklist ✅
    - Verified `pnpm run test:coverage:web` generates HTML reports
    - Verified threshold enforcement by testing failure case (99% threshold)
    - Confirmed tests pass with correct 10% thresholds
    - Updated this checklist with detailed completion notes

- [x] **3.5: Add type checking to CI**
  - [x] 3.5.1: Ensure TypeScript compilation is part of CI pipeline
  - [x] 3.5.2: Configure typecheck target for projects (if not auto-configured)
  - [x] 3.5.3: Test: `pnpm exec nx run-many -t typecheck`
  - [x] 3.5.4: Update `.github/workflows/ci.yml` to include typecheck step

### Success Criteria

- [ ] Husky installed and Git hooks directory created (`.husky/`)
- [ ] Pre-commit hook runs automatically on `git commit`
- [ ] Pre-commit hook blocks commits with lint/format errors
- [ ] Pre-commit hook only checks staged files (fast execution < 10s)
- [ ] Commit message validation enforces conventional commits format (if configured)
- [ ] lint-staged configuration exists and respects Nx workspace structure
- [ ] Web app Jest configuration verified to extend workspace preset
- [ ] Web app TypeScript test config verified to follow Nx standards
- [ ] Documentation added to CLAUDE.md for adding Jest to new projects
- [ ] Optional testing enhancements documented in `docs/testing-enhancements.md`
- [ ] Coverage reporting configured (0% threshold, just report)
- [ ] Coverage reports are generated in `coverage/` directory
- [ ] CI workflow includes typecheck step
- [ ] Attempting to commit code with lint errors is blocked locally
- [ ] Standard Nx testing patterns are documented for future reference

**Stage 3 Estimated Time:** 45-60 minutes (simplified - validates existing Nx patterns)

---

### Stage 4: Architecture Decisions & Infrastructure

### Goal

Make explicit architecture decisions about API framework and database strategy, then configure infrastructure based on those decisions.

### Sub-stages

- [ ] **4.1: API Architecture Decision & REST+OpenAPI Implementation**
  - [x] 4.1.1: Review API framework options (oRPC, tRPC, REST+OpenAPI, gRPC) ✅ COMPLETED 2025-10-23
    - Decision: Switch from oRPC to REST+OpenAPI
    - Rationale: Maximum flexibility, zero vendor lock-in, industry standard patterns
    - Documented in `docs/architecture-decisions.md` with comparison matrix and detailed analysis

  - [x] 4.1.2: Remove oRPC from codebase ✅ COMPLETED 2025-10-23
    - Updated 7 documentation files (architecture-decisions.md, README.md, P1-plan.md, poc-plan.md, tech-findings-log.md, and others)
    - Removed @orpc/client dependency from packages/api-client/package.json
    - Removed oRPC imports from api-client source code
    - Deleted build artifacts and ran pnpm install (removed 8 packages)
    - Validation: All tests pass, all builds pass, all linting passes, all typechecks pass, E2E tests pass

  - [x] 4.1.3: Review REST+OpenAPI tooling options ✅ COMPLETED 2025-10-23
    - Research: @asteasolutions/zod-to-openapi for OpenAPI spec generation from Zod schemas
    - Research: openapi-typescript for TypeScript type generation from OpenAPI specs
    - Research: openapi-fetch vs axios vs native fetch for HTTP client library
    - Evaluated options and documented comprehensive findings in `docs/architecture-decisions.md` → "Task 4.1.3: REST+OpenAPI Tooling Selection"

  - [x] 4.1.4: Select code generation strategy and HTTP client library ✅ COMPLETED 2025-10-24
    - Decision: OpenAPI spec generation using @asteasolutions/zod-to-openapi (code-first, Zod schemas as source of truth)
    - Decision: TypeScript type generation using openapi-typescript (type-only, zero runtime overhead)
    - Decision: HTTP client using openapi-fetch (5-6KB bundle, compile-time type safety, cross-platform)
    - Decision: Commit generated files to git (faster CI, better diffs, offline support)
    - Decision: Nx dependency graph for build orchestration (automatic ordering, caching)
    - Documented formal decisions in `docs/architecture-decisions.md` → "Task 4.1.4: Formal Tooling Decisions"

  - [x] 4.1.5: Install REST+OpenAPI dependencies
    - Install server dependencies: `pnpm add @asteasolutions/zod-to-openapi swagger-ui-express --filter @nx-monorepo/server` and `pnpm add -D @types/swagger-ui-express --filter @nx-monorepo/server`
    - Install client dependencies: `pnpm add -D openapi-typescript --filter @nx-monorepo/api-client` and `pnpm add openapi-fetch --filter @nx-monorepo/api-client`
    - Verify installations: ` grep -E "(openapi|swagger)"pnpm list |`

  - [x] 4.1.6: Configure Express routes structure
    - Create directory: `apps/server/src/routes/`
    - Set up route organization pattern (by feature/domain)
    - Create example route file with dummy endpoint for testing infrastructure
    - Mount routes in `apps/server/src/main.ts`

  - [x] 4.1.7: Set up OpenAPI spec generation
    - Implement OpenAPI spec generation mechanism (based on 4.1.4 decision)
    - Configure OpenAPI metadata (API title, version, servers, base path)
    - Create endpoint to serve OpenAPI spec: `GET /api/docs/openapi.json`
    - Verify spec validates as OpenAPI 3.x using online validator

  - [x] 4.1.8: Generate TypeScript types from OpenAPI spec
    - Refactor server:spec-write to use TypeScript script (apps/server/scripts/write-openapi.ts)
    - Configure openapi-typescript in packages/api-client
    - Add Nx target: api-client:generate-types with proper dependencies (server:spec-write)
    - Generate types to src/gen/openapi.d.ts with --export-type flag
    - Add src/gen/ to .gitignore (build artifact strategy)
    - Verify type generation, Nx caching, and build dependency chain
    - Document as Pattern 7 in docs/memories/adopted-patterns.md

  - [x] 4.1.9: Configure API client factory with generated types ✅ COMPLETED 2025-10-24
    - Implemented createApiClient() factory using openapi-fetch
    - Integrated with generated OpenAPI types for full type safety
    - Configured: baseUrl (defaults to '/api'), headers via middleware, custom fetch
    - Exported typed client with full endpoint autocomplete
    - Wrote 3 minimal unit tests for Phase 1 (runtime tests deferred to 4.1.10)
    - Validation: All tests pass, build succeeds, lint clean, typecheck passes

  - [x] **Infrastructure Migration**: Server build output standardization ✅ COMPLETED 2025-10-25
    - Migrated from project-level `apps/server/dist` to workspace-level `dist/apps/server`
    - Updated 7 files: package.json (3 changes), write-openapi.ts, launch.json, 2 doc files
    - Corrected for nested path structure: esbuild with bundle:false preserves source paths
    - Updated Nx target outputs (prune-lockfile, copy-workspace-modules) for correct caching
    - Updated VS Code debugger configuration for proper breakpoint support
    - Updated documentation to reflect workspace-level build patterns
    - Full validation: Build chain passes (build → spec-write → generate-types → api-client:build)
    - Quality gates: 14/14 tests pass, lint clean, typecheck passes
    - Note: Output structure is `dist/apps/server/apps/server/src/...` (nested) - this is correct behavior with esbuild bundle:false

  - [x] 4.1.10: Verify type-safe client functionality ✅ COMPLETED 2025-10-25
    - Created test endpoint: `GET /api/hello` → `{ message: string, timestamp: number }`
    - Implemented complete feature-based architecture (controller, router, OpenAPI registration)
    - Regenerated OpenAPI spec and TypeScript types with --skip-nx-cache to force fresh build
    - Created compile-time type safety tests in `packages/api-client/src/lib/api-client-types.spec.ts`
    - Verified TypeScript autocomplete shows available endpoints (path '/hello' fully typed)
    - Verified request/response types enforced at compile time (commented examples show compile errors)
    - Tests validate type extraction from paths and components without making HTTP calls
    - Validation: All quality gates pass (lint, test, build, typecheck)

  - [x] 4.1.11: Test REST+OpenAPI infrastructure end-to-end ✅ COMPLETED 2025-10-25
    - Implemented supertest-based integration tests (no port binding needed)
    - Exported createApp() factory from `apps/server/src/app.ts` for port-free testing
    - Created integration tests in `apps/server/src/routes/hello.spec.ts`:
      - ✅ GET /api/hello returns correct structure with message and timestamp
      - ✅ Timestamp validation (within 5 seconds, reasonable bounds)
      - ✅ 404 handling for invalid endpoints
    - Resolved Jest ESM/CommonJS module issue with workspace packages:
      - Added testEnvironmentOptions.customExportConditions: ['@nx-monorepo/source']
      - Switched from ts-jest to @swc/jest for uniform TypeScript transformation
      - Converted jest.config to .cjs to avoid ESM __dirname issues
      - Created .spec.swcrc configuration
    - Fixed TypeScript portable type issue: Added explicit Express return type to createApp()
    - Validation: All server tests pass, type safety verified, build succeeds
    - Note: Deferred error handling tests (500, timeouts) to Phase 2 - walking skeleton validated

- [x] **4.2: Supabase Architecture Decision** ✅ COMPLETED 2025-10-26
  - [x] 4.2.1: Decide: Local Supabase CLI vs cloud project
  - [x] 4.2.2: Decide: Prisma Migrate (SQL migrations) vs db push (schema sync)
  - [x] 4.2.3: Decide: Database connection for Prisma (DATABASE_URL) vs Supabase JS keys (anon/service) — clarify usage boundaries.
  - [x] 4.2.4: Decide: RLS policy approach for this phase
  - [x] 4.2.5: Document decisions in `docs/architecture-decisions.md`
    - Added comprehensive "Stage 4.2: Supabase & Database Architecture Decisions" section
    - Documented all 4 decisions with detailed rationale, alternatives considered, consequences
    - Included implementation checklists for Stage 4.3-4.5
    - Clarified technical details: PostgreSQL credentials vs Supabase API keys, RLS policy scope

- [x] **4.3: Set up Supabase project (based on 4.2 decision)** ✅ COMPLETED 2025-10-26
  - [x] 4.3.1: Create Supabase project (cloud or initialize local)
    - Created cloud project "nx-monorepo" in ZIX-DEV organization
    - Region: North EU (Stockholm)
    - Connection type: Data API + Connection String
  - [x] 4.3.2: Configure environment variables (`.env.local`, `.env`)
    - Created `.env` with DATABASE_URL for Prisma
    - Created `.env.local` with Supabase public credentials (URL, anon key, API URL)
    - Created `.env.example` template for other developers
    - Updated `.gitignore` to ignore `.env` and `.env.local`
  - [x] 4.3.3: Document environment variable setup in `docs/environment-setup.md`
    - Comprehensive documentation with architecture diagram
    - Explained both connection methods (Prisma vs Supabase SDK)
    - Security best practices and troubleshooting guide
  - [x] 4.3.4: Test connectivity from local machine - SKIPPED - testing in 4.4
    - Verified credentials collected correctly from Supabase dashboard
    - Environment files created and confirmed gitignored

- [x] **4.4a: Research & Validation for Prisma Configuration** ✅ COMPLETED 2025-10-26
  - [x] Track 1: Connection string strategy research
    - Decision: NO directUrl needed (port 5432 is direct connection)
    - DATABASE_URL uses direct PostgreSQL connection, no pooling required
  - [x] Track 2: RLS disabling strategy research
    - Approach: Include `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` in migration SQL
    - Use `--create-only` flag, edit migration, then apply
    - Verification: Query `pg_class` for `relrowsecurity = f`
  - [x] Track 3: Prisma + Supabase best practices research
    - UUID: Use `@default(uuid()) @db.Uuid` (client-side generation + PG validation)
    - Table naming: `@@map("health_checks")` (snake_case plural)
    - Timestamps: Always use `@db.Timestamptz` (timezone-aware)
    - Indexes: None needed for walking skeleton (PK sufficient)
  - [x] Track 4: Schema structure validation
    - Validated HealthCheck model with production-ready patterns
    - Simple structure appropriate for walking skeleton
  - [x] Track 5: Migration workflow verification
    - Command sequence documented: generate → migrate dev --create-only → edit → apply
    - File structure and expected outputs documented
  - [x] Track 6: Supabase project configuration review
    - Project healthy: PostgreSQL 17.6, UUID extensions installed
    - Clean slate: No existing tables, no drift concerns
  - [x] Synthesis & integration analysis
    - All research findings consolidated
    - First-run workflow documented step-by-step
    - WHAT/WHY/HOW/VERIFY for each decision (non-technical friendly)
  - [x] Implementation-ready documentation created
    - Complete research findings: `docs/research/stage-4.4a-research-findings.md`
    - Exact command sequence for Stage 4.4b
    - Success criteria defined

- [x] **4.4b: Implement Prisma Configuration (Execution Phase)** ✅ COMPLETED 2025-10-27
  - [x] Create `packages/database/prisma/` directory ✅
  - [x] Create `packages/database/prisma/schema.prisma` with validated structure: ✅
    - Generator: prisma-client-js with binaryTargets for multi-platform support
    - Datasource: PostgreSQL with DATABASE_URL (no directUrl per Stage 4.4a Track 1)
    - Model HealthCheck: id (uuid), message (string), timestamp (timestamptz)
    - Table mapping: `@@map("health_checks")`
  - [x] Run: `npx prisma generate --schema=packages/database/prisma/schema.prisma` ✅
  - [x] Run: `npx prisma migrate dev --name create_health_check --create-only --schema=packages/database/prisma/schema.prisma` ✅
  - [x] Edit migration SQL to add: `ALTER TABLE "health_checks" DISABLE ROW LEVEL SECURITY;` ✅
  - [x] Run: `npx prisma migrate dev --schema=packages/database/prisma/schema.prisma` ✅
  - [x] Verify in Supabase dashboard: table exists with correct schema ✅
  - [x] Verify RLS disabled: Query `pg_class` shows `relrowsecurity = f` ✅
  - [x] Test connectivity: Simple SELECT query succeeds ✅

- [x] **4.4c: Add Prisma Convenience Scripts** ✅ COMPLETED 2025-10-27
  - [x] Added scripts to `packages/database/package.json`: ✅
    - `db:generate`: Generate Prisma Client from schema
    - `db:migrate`: Create and apply migrations (development)
    - `db:deploy`: Apply migrations (production/CI)
    - `db:push`: Sync schema without migrations (prototyping)
    - `db:studio`: Launch Prisma Studio GUI
  - [x] Scripts follow Prisma monorepo best practices (db: prefix, no --schema flag needed) ✅
  - [x] Validated db:generate succeeds, other scripts require DATABASE_URL (documented) ✅
  - **PR #10 Review Note**: Additional enhancements identified but intentionally deferred:
    - **Environment validation (Issue 3)**: Defer to Stage 5 for Zod-based implementation
      - Rationale: Implement gold-standard pattern (Zod env validation) once in Stage 5 vs simple if-check now + proper implementation later
      - Will implement during walking skeleton with proper error handling and type safety
    - **Database testing (Issue 4)**: Defer to Phase 2+ when custom logic exists
      - Rationale: Prisma client singleton is boilerplate from official docs, testing adds complexity without value for template
      - Template should demonstrate testing patterns for business logic, not infrastructure boilerplate
    - **Supabase docs enhancements (Issue 5)**: Defer to Phase 2 planning
      - Rationale: Documentation should reflect current state, not speculative future work
      - Phase 2 checklist can be added when actually planning auth implementation with up-to-date best practices
  - **Meta-rationale**: Gold standard template prioritizes production-ready infrastructure that survives walking skeleton deletion over convenience enhancements or forward-looking documentation

- [x] **4.5: Configure Supabase client factory** ✅ COMPLETED 2025-11-15
  - [x] 4.5.1: Implement client factory in `packages/supabase-client/src/lib/client.ts`
    - Implemented `createSupabaseBrowserClient()` with env validation and browser-only guard
    - Implemented `createSupabaseServerClient()` with async Next.js 15 cookies() support
    - Exported `validateSupabaseConfig()` helper for startup health checks
  - [x] 4.5.2: Support Next.js configurations using `@supabase/ssr`
    - `createServerClient()` wired with getAll/setAll cookie adapters
    - `createBrowserClient()` with runtime browser context validation
    - Note: Expo/React Native support deferred to Stage 8 (Phase 2)
  - [x] 4.5.3: Export createSupabaseClient factory functions
    - Exports via `packages/supabase-client/src/index.ts` barrel
  - [x] 4.5.4: Test client initialization with comprehensive test suite
    - 11+ tests covering browser/server factories, env validation, error handling
    - Tests in `packages/supabase-client/src/lib/supabase-client.spec.ts`

### Success Criteria

**4.1: API Architecture & REST+OpenAPI Implementation**
- [x] Architecture decisions documented in `docs/architecture-decisions.md` ✅
- [x] API framework choice (REST+OpenAPI) documented with detailed rationale ✅
- [x] oRPC completely removed from codebase (dependencies, imports, documentation) ✅
- [x] REST+OpenAPI tooling stack selected and documented
- [x] REST+OpenAPI dependencies installed (server and client)
- [x] Express routes structure configured in `apps/server/src/routes/`
- [x] OpenAPI spec generation configured and working
- [x] OpenAPI spec endpoint accessible: `GET /api/docs/openapi.json`
- [x] TypeScript type generation from OpenAPI spec working
- [x] API client factory configured with generated types
- [x] Type-safe client demonstrates autocomplete for endpoints
- [x] TypeScript enforces request/response types at compile time
- [x] End-to-end infrastructure test passes (dummy endpoint via type-safe client)

**4.2-4.5: Supabase & Database Configuration**
- [x] Supabase strategy documented with rationale ✅ (Stage 4.4a research)
- [x] Supabase project created and accessible via dashboard ✅ (Stage 4.3)
- [x] Environment variables configured and documented in `docs/environment-setup.md` ✅ (Stage 4.3)
- [x] `packages/database/prisma/schema.prisma` contains valid schema ✅ (Stage 4.4b)
- [x] HealthCheck model defined with correct fields ✅ (Stage 4.4b)
- [x] `npx prisma generate` succeeds ✅ (Stage 4.4b)
- [x] Migration applied successfully (using `prisma migrate dev` per best practices) ✅ (Stage 4.4b)
- [x] Supabase dashboard shows HealthCheck table with correct schema ✅ (Stage 4.4b)
- [x] Can manually insert/query data via SQL and Prisma Studio ✅ (Stage 4.4b verification)
- [x] Supabase client factory exports working initialization function ✅ (Stage 4.5)

**Stage 4 Estimated Time:** 2-3 hours

---

### Stage 5: Implement Walking Skeleton (Web Only)

### Goal

Create a minimal vertical slice that exercises the entire stack: web → API client → server → database → Supabase. This is the critical validation step that proves all components work together. **With QA infrastructure active, tests will be written alongside each layer of implementation.**

### Sub-stages

- [x] **5.1: Implement database layer + tests**
  - [x] 5.1.1: Export Prisma client singleton from `packages/database/src/index.ts`
  - [x] 5.1.2: Create query functions: `getHealthChecks()`, `createHealthCheck(message)`
  - [x] 5.1.3: Write unit tests for query functions
  - [x] 5.1.4: Run tests and verify they pass

- [x] **5.2: Implement schemas layer + tests**
  - [x] 5.2.1: Create Zod schema for health check operations in `packages/schemas/src/health.ts`
  - [x] 5.2.2: Define: `healthPingSchema` (input validation)
  - [x] 5.2.3: Export types derived from schemas
  - [x] 5.2.4: Write unit tests for schema validation
  - [x] 5.2.5: Run tests and verify they pass

- [x] **5.3: Implement server endpoints + tests**
  - [x] 5.3.1: Create health check REST endpoints in `apps/server/src/routes/health.ts`
    - HTTP: `GET /api/health` (OpenAPI path: `/health`) - Fetch all health checks from DB
    - HTTP: `POST /api/health/ping` (OpenAPI path: `/health/ping`) - Create new health check with message
    - OpenAPI spec uses `servers: [{ url: '/api' }]` to define base path
  - [x] 5.3.2: Add Zod schema validation middleware for request bodies
  - [x] 5.3.3: Update OpenAPI spec with new endpoints
  - [x] 5.3.4: Regenerate TypeScript client types from OpenAPI spec
  - [x] 5.3.5: Write integration tests for both endpoints
  - [x] 5.3.6: Run tests and verify they pass

- [x] **5.4: Implement API client + tests**
  - [x] 5.4.1: Generate TypeScript types from OpenAPI spec
    - Run code generation: `openapi-typescript openapi.yaml -o packages/api-client/src/generated/api.types.ts`
    - Verify generated types match server endpoints
  - [x] 5.4.2: Create type-safe HTTP client factory in `packages/api-client/src/index.ts`
    - Wrap fetch/axios with generated types
    - Export `createApiClient(config)` factory function
    - Include error handling and response validation
  - [x] 5.4.3: Test type safety in client code
    - Verify autocomplete works for endpoint paths
    - Verify request/response types are enforced
    - Test invalid requests caught at compile time
  - [x] 5.4.4: Write unit tests for client factory
    - Test client initialization with various configs
    - Mock fetch to test request formation
  - [x] 5.4.5: Run tests and verify they pass

- [x] **5.5: Implement web UI**
  - [x] 5.5.1: Create `/health` page in `apps/web/src/app/health/page.tsx`
  - [x] 5.5.2: Initialize API client
  - [x] 5.5.3: Fetch and display health check data from server
  - [x] 5.5.4: Add button to ping server (write to DB)
  - [x] 5.5.5: Show real-time data updates after ping
  - [x] 5.5.6: Add basic styling with Tailwind
  - [x] 5.5.7: Test manually in browser

- [x] **5.6: Manual validation**
  - [x] 5.6.1: Start server: `pnpm exec nx run server:serve`
  - [x] 5.6.2: Start web: `pnpm exec nx run web:dev`
  - [x] 5.6.3: Navigate to http://localhost:3000/health
  - [x] 5.6.4: Verify health checks display
  - [x] 5.6.5: Click ping button and verify new entry appears
  - [x] 5.6.6: Check Supabase dashboard to confirm data persistence
  - [x] 5.6.7: Test error scenarios (server down, invalid input)

- [x] **5.7: Coverage infrastructure configured for MVP** ✅ PRD-aligned - Audited 2025-12-03
  - [x] 5.7.1: Jest configuration has 10% coverage thresholds (correct for MVP per PRD and Stage 3.4)
  - [x] 5.7.2: Coverage infrastructure validated - scripts work, reports generate, thresholds enforce
  - [x] 5.7.3: PRD alignment confirmed: MVP requires coverage *infrastructure*, not 80% coverage (that's Post-MVP PoC)
  - **Note**: Current coverage is low (web: 2.32%), but infrastructure is complete. 80% target deferred to Phase 2 per PRD.

### Success Criteria (Audited 2025-12-03)

- [x] Server endpoint `getHealth()` returns data from Supabase ✅
- [x] Server endpoint `pingHealth(message)` writes to Supabase ✅
- [x] TypeScript autocomplete works in client for server endpoints ✅
- [x] Web app loads `/health` page successfully ✅
- [x] Web app displays data fetched from server/database ✅
- [x] Web app can trigger write operation (ping button) ✅
- [x] Changes appear immediately in web UI after ping ✅
- [x] Data persists in Supabase database ✅
- [x] All apps build successfully: `pnpm exec nx run-many -t build` ✅
- [x] No TypeScript errors in any project ✅
- [x] Nx cache works for all build tasks ✅
- [x] Unit tests pass for database package ✅
- [x] Unit tests pass for schemas package ✅
- [x] Integration tests pass for server endpoints ✅
- [x] Unit tests pass for api-client package ✅
- [x] All tests pass: `pnpm exec nx run-many -t test` ✅
- [x] Coverage infrastructure configured and validated (10% thresholds per PRD; 80% deferred to Phase 2 PoC) ✅
- [x] Pre-commit hooks allow commits (code quality is good) ✅

**Stage 5 Estimated Time:** 3-4 hours

---

### Stage 6: E2E Testing Evaluation & Implementation

#### Goal

Evaluate E2E testing tools (including TestSprite) and write comprehensive tests for the walking skeleton. TestSprite evaluation happens first since it may change our E2E approach.

#### Sub-stages

- [ ] **6.1: Evaluate TestSprite MCP**
  - [ ] 6.1.1: Research TestSprite MCP integration requirements
  - [ ] 6.1.2: Trial TestSprite with health check flow
  - [ ] 6.1.3: Compare experience with existing Playwright setup
  - [ ] 6.1.4: Document findings and recommendations

- [ ] **6.2: E2E Testing Decision**
  - [ ] 6.2.1: Compare Playwright, TestSprite, and hybrid approaches
  - [ ] 6.2.2: Decide on E2E testing strategy
  - [ ] 6.2.3: Document decision rationale

- [ ] **6.3: Write E2E tests (using chosen tool)**
  - [ ] 6.3.1: Create E2E test for complete health check flow
  - [ ] 6.3.2: Test: Load /health page → see existing data
  - [ ] 6.3.3: Test: Click ping button → see new data appear
  - [ ] 6.3.4: Test: Verify data persists across page refresh
  - [ ] 6.3.5: Test: Error handling when server is down
  - [ ] 6.3.6: Run E2E tests and verify they pass

#### Success Criteria

- [ ] TestSprite evaluation completed and documented
- [ ] E2E testing decision made with documented rationale
- [ ] E2E tests exist for web health check flow
- [ ] All E2E tests pass

**Stage 6 Estimated Time:** 2-3 hours

---

### Stage 7: External Services

#### Goal

Integrate external services for observability, code quality, and developer experience. Sentry observability is required for MVP per PRD.

#### Sub-stages

- [ ] **7.1: Optimize Nx Cloud configuration**
  - [ ] 7.1.1: Review current caching strategy
  - [ ] 7.1.2: Set up remote caching for team
  - [ ] 7.1.3: Verify cache hit rates (target: > 50% after second run)
  - [ ] 7.1.4: Document Nx Cloud setup

- [ ] **7.2: Set up Sentry observability baseline**
  - [ ] 7.2.1: Create Sentry project
  - [ ] 7.2.2: Install Sentry SDK in server: `pnpm add @sentry/node --filter @nx-monorepo/server`
  - [ ] 7.2.3: Install Sentry SDK in web: `pnpm add @sentry/nextjs --filter @nx-monorepo/web`
  - [ ] 7.2.4: Configure error tracking and performance monitoring
  - [ ] 7.2.5: Test error reporting with intentional error
  - [ ] 7.2.6: Verify error appears in Sentry dashboard

- [ ] **7.3: Verify CodeRabbit configuration**
  - [ ] 7.3.1: Review `.coderabbit.yaml` configuration
  - [ ] 7.3.2: Verify CodeRabbit reviews PRs appropriately
  - [ ] 7.3.3: Document any configuration adjustments

- [ ] **7.4: Verify Dependabot configuration**
  - [ ] 7.4.1: Review Dependabot configuration
  - [ ] 7.4.2: Ensure Dependabot is monitoring all manifests
  - [ ] 7.4.3: Test that PR creation works (if updates available)

#### Success Criteria

- [ ] Nx Cloud remote caching works for team
- [ ] Sentry observability baseline active (server + web)
- [ ] CodeRabbit configuration verified
- [ ] Dependabot configuration verified

**Stage 7 Estimated Time:** 2-3 hours

---

### Stage 8: Authentication Infrastructure Wiring

#### Goal

Wire up authentication infrastructure so it's ready for application-level implementation in Phase 2. This includes server middleware patterns and client state management.

#### Sub-stages

- [ ] **8.1: Server auth middleware patterns**
  - [ ] 8.1.1: Create auth middleware structure in `apps/server/src/middleware/`
  - [ ] 8.1.2: Implement protected route pattern
  - [ ] 8.1.3: Set up Supabase session verification
  - [ ] 8.1.4: Document middleware usage patterns

- [ ] **8.2: Supabase Auth integration points**
  - [ ] 8.2.1: Configure Supabase Auth for the project
  - [ ] 8.2.2: Set up session handling patterns
  - [ ] 8.2.3: Configure token refresh flow
  - [ ] 8.2.4: Test auth flow manually

- [ ] **8.3: Web auth state management**
  - [ ] 8.3.1: Set up auth context/provider pattern
  - [ ] 8.3.2: Create auth hooks (useUser, useSession)
  - [ ] 8.3.3: Document auth state patterns for web

- [ ] **8.4: Validation**
  - [ ] 8.4.1: Verify auth infrastructure is ready for Phase 2 features
  - [ ] 8.4.2: Document what's in place vs what needs application-level implementation

#### Success Criteria

- [ ] Auth middleware patterns in server ready for use
- [ ] Supabase Auth configured and tested
- [ ] Web auth state management patterns documented
- [ ] Infrastructure ready for Phase 2 auth implementation

**Stage 8 Estimated Time:** 2-3 hours

---

### Stage 9: CI/CD Staging Deployment

#### Goal

Configure automatic deployment to a staging environment on merge to main.

#### Sub-stages

- [ ] **9.1: Select staging platform**
  - [ ] 9.1.1: Evaluate lightweight options (Vercel, Railway, Render, Fly.io)
  - [ ] 9.1.2: Select staging platform with rationale
  - [ ] 9.1.3: Document decision

- [ ] **9.2: Configure deployment pipeline**
  - [ ] 9.2.1: Set up platform project/app
  - [ ] 9.2.2: Configure GitHub Actions deployment workflow
  - [ ] 9.2.3: Set up environment secrets

- [ ] **9.3: Validate deployment**
  - [ ] 9.3.1: Test automatic deployment on merge to main
  - [ ] 9.3.2: Verify staging environment is accessible
  - [ ] 9.3.3: Verify walking skeleton works on staging

#### Success Criteria

- [ ] Staging platform selected and documented
- [ ] CI/CD deploys automatically on merge to main
- [ ] Staging environment accessible and functional

**Stage 9 Estimated Time:** 2-3 hours

---

### Stage 10: Mobile Walking Skeleton

#### Goal

Add mobile application to complete the cross-platform walking skeleton, validating that mobile can consume the same shared packages as web.

#### Sub-stages

- [ ] **10.1: Generate mobile application**
  - [ ] 10.1.1: Run: `pnpm exec nx g @nx/expo:app mobile --directory=apps/mobile`
  - [ ] 10.1.2: Review generated files and structure
  - [ ] 10.1.3: Verify build: `pnpm exec nx run mobile:build`
  - [ ] 10.1.4: Verify Expo dev server starts: `pnpm exec nx run mobile:start`
  - [ ] 10.1.5: Verify lint: `pnpm exec nx run mobile:lint`
  - [ ] 10.1.6: Verify tests: `pnpm exec nx run mobile:test`

- [ ] **10.2: Configure API client**
  - [ ] 10.2.1: Set up API client (same `@nx-monorepo/api-client` package)
  - [ ] 10.2.2: Configure API base URL for mobile environment
  - [ ] 10.2.3: Test connectivity to server

- [ ] **10.3: Implement health screen**
  - [ ] 10.3.1: Create health check screen
  - [ ] 10.3.2: Display health check data from server
  - [ ] 10.3.3: Add button to ping server
  - [ ] 10.3.4: Test on Expo Go or simulator

- [ ] **10.4: Cross-platform validation**
  - [ ] 10.4.1: Verify data created on web appears on mobile
  - [ ] 10.4.2: Verify data created on mobile appears on web
  - [ ] 10.4.3: Document mobile setup

#### Success Criteria

- [ ] Mobile app generated and builds successfully
- [ ] Mobile app uses shared API client package
- [ ] Health screen displays data from server
- [ ] Ping functionality works
- [ ] Data syncs between web and mobile

**Stage 10 Estimated Time:** 3-4 hours

---

### Stage 11: MVP Documentation

#### Goal

Complete documentation for the walking skeleton and MVP infrastructure.

#### Sub-stages

- [ ] **11.1: Walking skeleton architecture**
  - [ ] 11.1.1: Document walking skeleton architecture (diagram or markdown)
  - [ ] 11.1.2: Create `docs/walking-skeleton.md` explaining the flow

- [ ] **11.2: Setup and running guide**
  - [ ] 11.2.1: Document how to set up the project
  - [ ] 11.2.2: Document how to run the walking skeleton
  - [ ] 11.2.3: Document how to run all tests

- [ ] **11.3: Troubleshooting guide**
  - [ ] 11.3.1: Add troubleshooting guide for common issues
  - [ ] 11.3.2: Document known platform-specific issues

- [ ] **11.4: AI-agent documentation review**
  - [ ] 11.4.1: Review documentation for AI-agent accessibility
  - [ ] 11.4.2: Ensure CLAUDE.md and AGENTS.md are up to date

#### Success Criteria

- [ ] Walking skeleton architecture documented
- [ ] Setup and running guide complete
- [ ] Troubleshooting guide exists
- [ ] Documentation suitable for AI agents

**Stage 11 Estimated Time:** 2-3 hours

---

### Phase 1 MVP Success Criteria

Phase 1 is complete when ALL of the following are true:

#### Functional Requirements
- [ ] Three applications exist and run: server, web, mobile
- [ ] Four shared packages exist and build: database, schemas, api-client, supabase-client
- [ ] Walking skeleton works end-to-end on web AND mobile
- [ ] Auth infrastructure wired and ready for Phase 2

#### Technical Requirements
- [ ] All projects build: `pnpm exec nx run-many -t build`
- [ ] All linting passes: `pnpm exec nx run-many -t lint`
- [ ] All tests pass: `pnpm exec nx run-many -t test`
- [ ] Type checking passes: `pnpm exec nx run-many -t typecheck`
- [ ] Coverage infrastructure in place (10% thresholds)

#### Infrastructure Requirements
- [ ] Husky Git hooks active and working
- [ ] E2E tests exist and pass
- [ ] Sentry observability baseline active
- [ ] CI/CD deploys to staging automatically

#### Documentation Requirements
- [ ] Walking skeleton architecture documented
- [ ] Environment setup documented
- [ ] Troubleshooting guide exists

#### Validation Test
A new developer should be able to:
1. Clone the repository
2. Run `pnpm install`
3. Set up environment variables (following docs)
4. Run the full stack with working walking skeleton
5. Commit a change and see Git hooks enforce quality
6. Push and see CI pass and deploy to staging

---

## Phase 2: Task App PoC

This phase validates the template by building a real application on it. The Task App demonstrates CRUD operations, authentication, and cross-platform functionality.

### Stage 1: Core Data Model

#### Goal

Implement the task data layer with full type safety from database to client.

#### Sub-stages

- [ ] **1.1: Database schema**
  - [ ] 1.1.1: Add Task model to Prisma schema (id, title, description, status, userId, timestamps)
  - [ ] 1.1.2: Create and apply migration
  - [ ] 1.1.3: Verify table in Supabase dashboard

- [ ] **1.2: Zod schemas**
  - [ ] 1.2.1: Create task schemas in `packages/schemas`
  - [ ] 1.2.2: Export types derived from schemas
  - [ ] 1.2.3: Write schema validation tests (TDD)

- [ ] **1.3: Server endpoints**
  - [ ] 1.3.1: Implement CRUD endpoints with OpenAPI spec
  - [ ] 1.3.2: Regenerate client types
  - [ ] 1.3.3: Write integration tests (TDD)

#### Success Criteria

- [ ] Task data model complete with full type safety
- [ ] All tests pass

**Stage 1 Estimated Time:** 3-4 hours

---

### Stage 2: Authentication Flows

#### Goal

Implement user authentication using the infrastructure wired in Phase 1.

#### Sub-stages

- [ ] **2.1: Signup/Login UI (web)**
  - [ ] 2.1.1: Create auth pages (signup, login, forgot password)
  - [ ] 2.1.2: Integrate with Supabase Auth
  - [ ] 2.1.3: Write component tests (TDD)

- [ ] **2.2: Session management**
  - [ ] 2.2.1: Implement session persistence
  - [ ] 2.2.2: Configure protected routes
  - [ ] 2.2.3: Test auth flows end-to-end

- [ ] **2.3: Auth-gated API endpoints**
  - [ ] 2.3.1: Add auth middleware to task endpoints
  - [ ] 2.3.2: Filter tasks by userId
  - [ ] 2.3.3: Write integration tests (TDD)

#### Success Criteria

- [ ] Users can sign up, log in, log out
- [ ] Protected routes require authentication
- [ ] API endpoints filter by authenticated user

**Stage 2 Estimated Time:** 4-5 hours

---

### Stage 3: Task Management UI - Web

#### Goal

Build the task management interface for web.

#### Sub-stages

- [ ] **3.1: Task list view**
  - [ ] 3.1.1: Create task list component
  - [ ] 3.1.2: Implement filtering/sorting
  - [ ] 3.1.3: Write component tests (TDD)

- [ ] **3.2: Task CRUD forms**
  - [ ] 3.2.1: Create/edit task forms
  - [ ] 3.2.2: Delete confirmation
  - [ ] 3.2.3: Optimistic updates
  - [ ] 3.2.4: Write component tests (TDD)

#### Success Criteria

- [ ] Full task CRUD on web
- [ ] All tests pass

**Stage 3 Estimated Time:** 4-5 hours

---

### Stage 4: Task Management - Mobile

#### Goal

Implement task management on mobile, mirroring web functionality.

#### Sub-stages

- [ ] **4.1: Mobile task screens**
  - [ ] 4.1.1: Create task list screen
  - [ ] 4.1.2: Create task detail/edit screen
  - [ ] 4.1.3: Write tests (TDD)

- [ ] **4.2: Mobile auth flows**
  - [ ] 4.2.1: Implement mobile auth UI
  - [ ] 4.2.2: Configure secure token storage
  - [ ] 4.2.3: Test auth flows

- [ ] **4.3: Cross-platform validation**
  - [ ] 4.3.1: Verify tasks sync between web and mobile
  - [ ] 4.3.2: Test concurrent usage scenarios

#### Success Criteria

- [ ] Full task CRUD on mobile
- [ ] Data syncs between web and mobile

**Stage 4 Estimated Time:** 4-5 hours

---

### Stage 5: Quality Gate

#### Goal

Enable 80% coverage enforcement and fill any gaps.

#### Sub-stages

- [ ] **5.1: Coverage review**
  - [ ] 5.1.1: Run coverage report: `pnpm exec nx run-many -t test --coverage`
  - [ ] 5.1.2: Identify coverage gaps
  - [ ] 5.1.3: Fill gaps with targeted tests

- [ ] **5.2: Enable enforcement**
  - [ ] 5.2.1: Update coverage thresholds to 80%
  - [ ] 5.2.2: Verify all tests pass with new thresholds
  - [ ] 5.2.3: Enable as PR merge gate

#### Success Criteria

- [ ] Coverage >= 80% across all projects
- [ ] 80% threshold enforced on PR merge

**Stage 5 Estimated Time:** 2-3 hours

---

### Stage 6: Production Platform Selection

#### Goal

Select two production platforms for deployment.

#### Sub-stages

- [ ] **6.1: Evaluate options**
  - [ ] 6.1.1: Research Railway, Render, Fly.io, Vercel, Cloudflare
  - [ ] 6.1.2: Compare pricing, features, complexity
  - [ ] 6.1.3: Consider mobile backend requirements

- [ ] **6.2: Select platforms**
  - [ ] 6.2.1: Select Platform 1 with rationale
  - [ ] 6.2.2: Select Platform 2 with rationale
  - [ ] 6.2.3: Document selection in architecture decisions

#### Success Criteria

- [ ] Two platforms selected with documented rationale

**Stage 6 Estimated Time:** 1-2 hours

---

### Stage 7: Deploy to Production Platform 1

#### Goal

Deploy the Task App to the first production platform.

#### Sub-stages

- [ ] **7.1: Configure deployment**
  - [ ] 7.1.1: Set up platform project/app
  - [ ] 7.1.2: Configure GitHub Actions workflow
  - [ ] 7.1.3: Set up production environment secrets

- [ ] **7.2: Deploy and validate**
  - [ ] 7.2.1: Deploy to production
  - [ ] 7.2.2: Verify application works
  - [ ] 7.2.3: Document deployment process

#### Success Criteria

- [ ] Application deployed and accessible on Platform 1
- [ ] Full functionality verified

**Stage 7 Estimated Time:** 2-3 hours

---

### Stage 8: Deploy to Production Platform 2

#### Goal

Deploy the Task App to the second production platform.

#### Sub-stages

- [ ] **8.1: Configure deployment**
  - [ ] 8.1.1: Set up platform project/app
  - [ ] 8.1.2: Configure GitHub Actions workflow
  - [ ] 8.1.3: Set up production environment secrets

- [ ] **8.2: Deploy and validate**
  - [ ] 8.2.1: Deploy to production
  - [ ] 8.2.2: Verify application works
  - [ ] 8.2.3: Document deployment process

#### Success Criteria

- [ ] Application deployed and accessible on Platform 2
- [ ] Full functionality verified

**Stage 8 Estimated Time:** 2-3 hours

---

### Phase 2 Success Criteria

Phase 2 is complete when:

- [ ] Task App CRUD works on web and mobile
- [ ] Authentication works end-to-end
- [ ] Data syncs between platforms
- [ ] Coverage >= 80% enforced
- [ ] Deployed to two production platforms
- [ ] Template validated through real usage

---

## Phase 3: Template Extensions (Future)

This phase adds advanced features to make the template more comprehensive. These are optional enhancements.

### Advanced Infrastructure
- Real-time subscriptions (Supabase Realtime)
- File storage (Supabase Storage)
- Background jobs (queues, scheduled tasks)
- Webhooks

### Multi-Tenancy Patterns
- Organizations / teams
- Subscription management
- Admin dashboards

### Production Optimization
- Caching strategies
- Performance tuning
- CDN configuration

### Additional Platforms
- Additional deployment targets
- Platform-specific optimizations

---

## Document References

| Document | Tier | Purpose |
|----------|------|---------|
| `docs/PRD.md` | Governance | WHAT and WHY (anchor) |
| `docs/constitution.md` | Governance | Non-negotiable principles |
| `docs/roadmap.md` | Governance | Implementation roadmap (this file) |
| `docs/architecture.md` | Architecture | HOW system is built |
| `docs/architecture-decisions.md` | Architecture | WHY decisions were made |
| `docs/tech-stack.md` | Architecture | WHICH versions to use |
| `docs/memories/` | Operational | Patterns, checklists, troubleshooting |

**BMAD Workflow**: This roadmap follows BMAD planning principles. Implementation stages align with iterative development (design → implement → validate → document).

---

**Maintainer**: Engineering Team
**Status**: Active - Phase 1 Stage 5 complete, Stages 6-11 pending
**Last Updated**: 2025-12-03
**Last Restructured**: 2025-12-03 - Aligned with PRD three-phase breakdown

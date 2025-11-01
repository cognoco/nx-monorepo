# Tasks: Walking Skeleton Health Check

**Input**: Design documents from `/specs/001-walking-skeleton/`
**Prerequisites**: plan.md (implementation plan), spec.md (user stories), data-model.md (HealthCheck entity), contracts/ (API specs)

**Tests**: TDD approach per constitutional requirement - tests included for all implementation tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is an Nx monorepo with the following structure:
- **Apps**: `apps/web/` (Next.js), `apps/server/` (Express)
- **Packages**: `packages/database/`, `packages/schemas/`, `packages/api-client/`, `packages/supabase-client/`
- **Tests**: Co-located in `src/` next to source files (`.spec.ts` or `.spec.tsx`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure (already complete from previous stages)

No tasks - infrastructure already exists from Phase 1 Stages 0-4.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T001 Verify Supabase project is provisioned and connection strings are in .env
- [ ] T002 Generate Prisma Client from schema in packages/database/prisma/schema.prisma using `pnpm exec nx run @nx-monorepo/database:db:generate`
- [ ] T003 Verify Prisma Client imports without errors in packages/database/src/lib/prisma-client.ts
- [ ] T004 [P] Read docs/memories/adopted-patterns.md and docs/memories/testing-reference.md, then configure Jest for packages/database with co-located test support
- [ ] T005 [P] Read docs/memories/adopted-patterns.md and docs/memories/testing-reference.md, then configure Jest for packages/schemas with co-located test support
- [ ] T006 [P] Read docs/memories/adopted-patterns.md and docs/memories/testing-reference.md, then configure Jest for apps/server with integration test support

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View System Health Status (Priority: P1) 🎯 MVP

**Goal**: Implement GET /api/health endpoint to retrieve all health check records from database, proving end-to-end read pipeline works (Supabase → Prisma → Express → API Client → Web UI).

**Independent Test**: Navigate to http://localhost:3000/health and observe that data from the database displays in the browser. Clicking refresh shows the same data (proves persistence).

### Database Layer for User Story 1 (TDD Cycle 1)

- [ ] T007 [US1] Write unit test for HealthCheck model in packages/database/src/health.spec.ts (should fail - model doesn't exist yet)
- [ ] T008 [US1] Define HealthCheck model in packages/database/prisma/schema.prisma with id, message, timestamp fields
- [ ] T009 [US1] Create migration for health_checks table using `pnpm exec nx run @nx-monorepo/database:db:migrate -- --name=create_health_check`
- [ ] T010 [US1] Apply migration to Supabase using `pnpm exec nx run @nx-monorepo/database:db:deploy`
- [ ] T011 [US1] Write unit test for getHealthChecks() function in packages/database/src/health.spec.ts (should fail - function doesn't exist)
- [ ] T012 [US1] Implement getHealthChecks() function in packages/database/src/health.ts to query all health checks ordered by timestamp DESC
- [ ] T013 [US1] Export getHealthChecks from packages/database/src/index.ts
- [ ] T014 [US1] Run tests and verify getHealthChecks() passes unit tests

### Server Layer for User Story 1 (TDD Cycle 3 - partial)

- [ ] T015 [US1] Write integration test for GET /api/health endpoint in apps/server/src/routes/health.routes.spec.ts (should fail - route doesn't exist)
- [ ] T016 [US1] Create health.routes.ts in apps/server/src/routes/ and implement GET /api/health route using getHealthChecks()
- [ ] T017 [US1] Create apps/server/src/routes/health.openapi.ts with OpenAPI registration function using @asteasolutions/zod-to-openapi, register in apps/server/src/openapi/register.ts
- [ ] T018 [US1] Register health router in apps/server/src/routes/index.ts (route aggregator)
- [ ] T019 [US1] Generate OpenAPI spec using `pnpm exec nx run server:spec-write` and verify path `/health` exists with `servers: [{ url: '/api' }]` (optionally validate with Spectral: `pnpm exec nx run server:spec-validate`)
- [ ] T020 [US1] Run integration tests and verify GET /api/health passes

### API Client Layer for User Story 1 (TDD Cycle 4 - partial)

- [ ] T021 [US1] Generate TypeScript types from OpenAPI spec using `pnpm exec nx run api-client:generate-types`
- [ ] T022 [US1] Write unit test for createApiClient factory in packages/api-client/src/index.spec.ts (should fail - factory doesn't exist)
- [ ] T023 [US1] Implement createApiClient() factory in packages/api-client/src/index.ts using openapi-fetch
- [ ] T024 [US1] Export createApiClient and generated types from packages/api-client/src/index.ts
- [ ] T025 [US1] Run tests and verify createApiClient() passes unit tests

### Web UI Layer for User Story 1 (TDD Cycle 5 - partial, manual testing acceptable)

- [ ] T026 [US1] Create /health page at apps/web/src/app/health/page.tsx
- [ ] T027 [US1] Implement health check list display using createApiClient().GET('/health') (with baseUrl configured as 'http://localhost:3001/api')
- [ ] T028 [US1] Add Tailwind CSS styling for health check list (basic utility classes only, no custom CSS, minimal layout)
- [ ] T029 [US1] Add loading state while fetching health checks
- [ ] T030 [US1] Add "use client" directive if needed for interactive features
- [ ] T031 [US1] Manual test: Start server (`pnpm exec nx run server:serve`) and web app (`pnpm exec nx run web:dev`)
- [ ] T032 [US1] Manual test: Navigate to http://localhost:3000/health and verify page loads without errors
- [ ] T033 [US1] Manual test: Verify empty state message displays when database has no records

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. You can view health check records from the database in the web UI.

---

## Phase 4: User Story 2 - Ping System Health (Priority: P2)

**Goal**: Implement POST /api/health/ping endpoint to create new health check records, proving end-to-end write pipeline works (Web UI → API Client → Express → Zod validation → Prisma → Supabase).

**Independent Test**: Click "Ping" button on /health page and observe that a new record appears immediately in the UI and persists in the Supabase database after refresh.

### Schemas Layer for User Story 2 (TDD Cycle 2)

- [ ] T034 [US2] Write unit test for healthPingSchema in packages/schemas/src/health.schema.spec.ts (should fail - schema doesn't exist)
- [ ] T035 [US2] Define healthPingSchema in packages/schemas/src/health.schema.ts with optional message field
- [ ] T036 [US2] Export healthPingSchema and TypeScript types from packages/schemas/src/index.ts
- [ ] T037 [US2] Run tests and verify healthPingSchema passes validation tests (valid: {}, valid: {message: "test"}, invalid: {message: 123})

### Database Layer for User Story 2 (TDD Cycle 1 - continued)

- [ ] T038 [US2] Write unit test for createHealthCheck() function in packages/database/src/health.spec.ts (should fail - function doesn't exist)
- [ ] T039 [US2] Implement createHealthCheck(message?) function in packages/database/src/health.ts to insert health check with optional message
- [ ] T040 [US2] Export createHealthCheck from packages/database/src/index.ts
- [ ] T041 [US2] Run tests and verify createHealthCheck() passes unit tests

### Server Layer for User Story 2 (TDD Cycle 3 - continued)

- [ ] T042 [US2] Write integration test for POST /api/health/ping endpoint in apps/server/src/routes/health.routes.spec.ts (should fail - route doesn't exist)
- [ ] T043 [US2] Implement POST /api/health/ping route in apps/server/src/routes/health.routes.ts using healthPingSchema for validation
- [ ] T044 [US2] Add OpenAPI metadata for POST /api/health/ping with 201 response and 400 validation error
- [ ] T045 [US2] Regenerate OpenAPI spec using `pnpm exec nx run server:spec-write` and verify path `/health/ping` exists with `servers: [{ url: '/api' }]` (optionally validate with Spectral: `pnpm exec nx run server:spec-validate`)
- [ ] T046 [US2] Run integration tests and verify POST /api/health/ping passes (test with and without message in request body)

### API Client Layer for User Story 2 (TDD Cycle 4 - continued)

- [ ] T047 [US2] Regenerate TypeScript types from OpenAPI spec using `pnpm exec nx run api-client:generate-types`
- [ ] T048 [US2] Verify POST method is available in generated types with correct request/response shapes

### Web UI Layer for User Story 2 (TDD Cycle 5 - continued)

- [ ] T049 [US2] Add "Ping" button to apps/web/src/app/health/page.tsx
- [ ] T050 [US2] Implement button click handler using createApiClient().POST('/health/ping', {body: {}}) (with baseUrl configured as 'http://localhost:3001/api')
- [ ] T051 [US2] Add optimistic UI update to show new record immediately after clicking Ping
- [ ] T052 [US2] Add error handling for failed POST requests
- [ ] T053 [US2] Manual test: Click "Ping" button and verify new health check appears in list within 1 second
- [ ] T054 [US2] Manual test: Refresh page and verify new record persists
- [ ] T055 [US2] Manual test: Open Supabase dashboard Table Editor and verify new record exists in health_checks table

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. You can view health checks (US1) and create new ones (US2).

---

## Phase 5: User Story 3 - Handle System Errors Gracefully (Priority: P3)

**Goal**: Add clear error messages when the system fails to prove error boundaries and validation are working correctly.

**Independent Test**: Stop the server and observe clear error message in web UI. Restart server and observe data loads correctly again.

### Server Error Handling for User Story 3

- [ ] T056 [US3] Create standardized error response middleware in apps/server/src/middleware/error-handler.ts
- [ ] T057 [US3] Add try-catch error handling to GET /api/health route in apps/server/src/routes/health.routes.ts
- [ ] T058 [US3] Add try-catch error handling to POST /api/health/ping route in apps/server/src/routes/health.routes.ts
- [ ] T059 [US3] Return 500 response with error object {error, message, statusCode} for database failures
- [ ] T060 [US3] Return 400 response with validation error details {error, message, statusCode, details[]} for Zod validation failures
- [ ] T061 [US3] Write integration test for error responses in apps/server/src/routes/health.routes.spec.ts

### Web UI Error Handling for User Story 3

- [ ] T062 [US3] Add error state to apps/web/src/app/health/page.tsx for GET /api/health failures
- [ ] T063 [US3] Display user-friendly error message when server is unavailable (connection refused)
- [ ] T064 [US3] Display user-friendly error message when database connection fails (500 response)
- [ ] T065 [US3] Add error state for POST /api/health/ping failures
- [ ] T066 [US3] Display validation error messages when POST request body is invalid
- [ ] T067 [US3] Manual test: Stop server and verify web UI shows "Unable to connect to server" message
- [ ] T068 [US3] Manual test: Restart server and verify data loads correctly again

**Checkpoint**: All user stories should now be independently functional with proper error handling.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and verification before infrastructure validation is complete

- [ ] T069 [P] Add walking skeleton cleanup checklist to docs/memories/walking-skeleton-cleanup.md
- [ ] T070 [P] Add WALKING SKELETON comments to all throwaway code files for easy identification
- [ ] T071 Verify test coverage is >= 60% for packages/database using `pnpm exec nx run database:test -- --coverage`
- [ ] T072 Verify test coverage is >= 60% for packages/schemas using `pnpm exec nx run schemas:test -- --coverage`
- [ ] T073 Verify test coverage is >= 60% for packages/api-client using `pnpm exec nx run api-client:test -- --coverage`
- [ ] T074 Run all linting checks using `pnpm exec nx run-many -t lint`
- [ ] T075 Run all typechecks using `pnpm exec nx run-many -t typecheck`
- [ ] T076 Run all tests using `pnpm exec nx run-many -t test`
- [ ] T077 Run all builds using `pnpm exec nx run-many -t build`
- [ ] T078 Verify Nx dependency graph is clean using `pnpm exec nx graph`. Note: Nx Cloud temporarily disabled - skip remote cache verification for 001-walking-skeleton (SC-022 deferred)
- [ ] T079 Test pre-commit hooks by staging a change and running `git commit`
- [ ] T080 Verify TypeScript autocomplete works for API client methods in VS Code
- [ ] T081 Verify end-to-end type safety by creating integration test that validates type flow: Prisma schema → Zod validation → OpenAPI spec → Generated types → API client → Web UI component props
- [ ] T082 Execute quickstart.md validation steps 1-8 to ensure complete infrastructure validation
- [ ] T083 Document any residual risks or known issues in specs/001-walking-skeleton/spec.md
- [ ] T084 Update docs/P1-plan.md Stage 5 status to "Complete"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Already complete - no tasks required
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - MVP)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 3 (P3)**: Can start after US1 and US2 complete - Adds error handling to existing functionality

### Within Each User Story

- TDD cycle: Tests MUST be written and FAIL before implementation
- Database layer before server layer (Prisma queries needed by routes)
- Server layer before API client (OpenAPI spec generated from server)
- API client before web UI (typed client methods used by components)
- Core implementation before error handling
- Story complete before moving to next priority

### Parallel Opportunities

- **Foundational Phase**: T004, T005, T006 (Jest configs) can run in parallel
- **Within US1**: None - sequential TDD cycles required
- **Within US2**: None - sequential TDD cycles required
- **Within US3**: T056-T061 (server errors) and T062-T068 (UI errors) could run in parallel if different developers
- **Polish Phase**: T069, T070 can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all Jest configuration tasks together:
Task: "Configure Jest for packages/database with co-located test support"
Task: "Configure Jest for packages/schemas with co-located test support"
Task: "Configure Jest for apps/server with integration test support"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (already done)
2. Complete Phase 2: Foundational (T001-T006)
3. Complete Phase 3: User Story 1 (T007-T033)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (T007-T033) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (T034-T055) → Test independently → Deploy/Demo
4. Add User Story 3 (T056-T068) → Test independently → Deploy/Demo
5. Polish Phase (T069-T083) → Final verification
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T006)
2. Once Foundational is done:
   - Developer A: User Story 1 (T007-T033)
   - Developer B: User Story 2 (T034-T055) - must wait for US1 to complete T019 (OpenAPI spec)
   - Developer C: Can prepare Jest configurations and documentation
3. After US1 and US2 complete:
   - Developer A: User Story 3 server errors (T056-T061)
   - Developer B: User Story 3 UI errors (T062-T068)
4. Team: Polish phase together (T069-T083)

---

## Notes

- **[P]** tasks = different files, no dependencies
- **[Story]** label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD approach**: Verify tests fail (Red) before implementing (Green)
- Commit after each logical group of tasks (e.g., after completing database layer for US1)
- Stop at any checkpoint to validate story independently
- **Walking skeleton code**: Mark all files with `// WALKING SKELETON: Delete after infrastructure validation`
- **Coverage threshold**: Must achieve >= 60% for packages/database, packages/schemas, packages/api-client
- **Manual testing**: quickstart.md provides comprehensive validation steps
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Summary Statistics

**Total Tasks**: 84 tasks
- Phase 1 (Setup): 0 tasks (already complete)
- Phase 2 (Foundational): 6 tasks
- Phase 3 (US1 - MVP): 27 tasks
- Phase 4 (US2): 22 tasks
- Phase 5 (US3): 13 tasks
- Phase 6 (Polish): 16 tasks

**Parallel Opportunities**: 5 tasks marked [P] (6%)

**User Story Distribution**:
- US1 (P1 - MVP): 27 tasks (GET /health read pipeline)
- US2 (P2): 22 tasks (POST /health/ping write pipeline)
- US3 (P3): 13 tasks (Error handling)

**TDD Cycle Coverage**:
- All implementation tasks have corresponding test tasks
- Tests written before implementation (Red → Green)
- Estimated 62 total tests across database, schemas, api-client, and server layers

**Suggested MVP Scope**: Phase 2 (Foundational) + Phase 3 (US1) = 33 tasks
**Estimated Time**: 3-4 hours per plan.md Stage 5 estimate

---

## Policy Checklist

**Internal Governance Gate**: ✅ **PASSED**

**Gate Execution**: `node tools/gates/run-internal-alignment.mjs`
**Status**: Pass (0 violations)
**Phase**: Phase 1
**Features Evaluated**: specs/001-walking-skeleton

**Documents Checked**:
- ✅ docs/architecture-decisions.md
- ✅ docs/memories/adopted-patterns.md
- ✅ docs/tech-stack.md
- ✅ docs/P1-plan.md

**Violations**: None

**Waived Violations** (documented exceptions with approved scope):
1. PHASE1_DB_URL (.env.example) - Phase 1 uses direct PostgreSQL connection (5432) per architectural decision
2. PRISMA_DIRECTURL (packages/database/prisma/schema.prisma) - Phase 1 Prisma datasource configuration per established pattern
3. MSW_REQUIRED (apps/web/package.json) - MSW will be added when writing integration tests per TDD approach

**Alignment Summary**:
- All tasks align with established architectural decisions (REST+OpenAPI, Supabase+Prisma, Nx monorepo)
- All tasks follow adopted patterns (co-located tests, TypeScript config, Jest patterns, OpenAPI workflow)
- All tasks use pinned tech stack versions (Next.js 15.2, React 19, Prisma 6, Jest 30)
- All tasks follow Phase 1 Stage 5 requirements (walking skeleton, TDD cycles, 60% coverage)

**Ready for Implementation**: ✅ Yes - All governance checks passed, tasks are immediately executable
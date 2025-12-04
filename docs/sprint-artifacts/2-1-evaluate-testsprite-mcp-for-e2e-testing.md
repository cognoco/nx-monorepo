# Story 2.1: Evaluate TestSprite MCP for E2E Testing

Status: done

## Story

As a development team evaluating testing tools,
I want to trial TestSprite MCP with the health check flow,
so that I can make an informed decision about our E2E testing approach.

## Acceptance Criteria

| AC# | Given | When | Then |
|-----|-------|------|------|
| AC1 | The walking skeleton is running (server + web) | I configure TestSprite MCP integration | I can execute test scenarios against the `/health` page |
| AC2 | TestSprite is configured | I run test scenarios | I can compare the experience with native Playwright setup |
| AC3 | Evaluation is complete | I document findings | Documentation includes: setup complexity, execution speed, debugging experience, CI integration |

## Tasks / Subtasks

- [x] **Task 1: Research TestSprite MCP** (AC: 1)
  - [x] 1.1 Search for TestSprite MCP documentation and integration requirements
  - [x] 1.2 Identify prerequisites (account, API keys, installation)
  - [x] 1.3 Document TestSprite capabilities and limitations
  - [x] 1.4 Assess compatibility with Nx monorepo structure

- [x] **Task 2: Configure TestSprite Integration** (AC: 1)
  - [x] 2.1 Install TestSprite MCP (if available/accessible)
  - [x] 2.2 Configure connection settings
  - [x] 2.3 Verify basic connectivity
  - [x] 2.4 Document any access issues or blockers encountered

- [ ] **Task 3: Create Test Scenarios for Health Check Flow** (AC: 1, 2)
  - [ ] 3.1 Define test scenarios matching existing Playwright tests:
    - Navigate to `/health` page
    - Verify health check list displays
    - Click "Ping" button and verify new record appears
    - Verify data persistence after refresh
  - [ ] 3.2 Execute scenarios via TestSprite
  - [ ] 3.3 Record execution results and any issues

- [ ] **Task 4: Compare with Existing Playwright Setup** (AC: 2)
  - [ ] 4.1 Run equivalent Playwright tests from `apps/web-e2e/src/`
  - [ ] 4.2 Compare metrics:
    - Setup complexity (time to configure, prerequisites)
    - Execution speed (test run duration)
    - Debugging experience (error messages, traces, screenshots)
    - CI integration ease (GitHub Actions compatibility)
  - [ ] 4.3 Create comparison matrix

- [ ] **Task 5: Document Findings** (AC: 3)
  - [ ] 5.1 Create evaluation summary with comparison matrix
  - [ ] 5.2 List pros/cons for each approach
  - [ ] 5.3 Identify any hybrid approach possibilities
  - [ ] 5.4 Prepare recommendation for Story 2.2 decision
  - [ ] 5.5 Save findings to `docs/architecture-decisions.md` or separate evaluation doc

## Dev Notes

### Prerequisites
- Walking skeleton must be running:
  - Server: `pnpm exec nx run server:serve` (port 3000)
  - Web: `pnpm exec nx run web:dev` (port 3000 or 4200)
- Existing Playwright infrastructure at `apps/web-e2e/`

### Relevant Architecture Patterns

**E2E Testing from architecture.md:**
- Current stack: Playwright 1.56
- Test location: `apps/web-e2e/src/*.spec.ts`
- Configuration: `apps/web-e2e/playwright.config.ts`
- Run command: `pnpm exec nx run web-e2e:e2e`

[Source: docs/architecture.md#Technology-Stack-Details]

**Quality Gates:**
- CI runs E2E as part of: `pnpm exec nx run-many -t lint test build typecheck e2e`
- Pre-commit does NOT run E2E (too slow)

[Source: docs/architecture.md#Quality-Gates]

### Project Structure Notes

**Existing E2E Structure:**
```
apps/web-e2e/
├── src/
│   ├── example.spec.ts    # Default Playwright test
│   └── *.spec.ts          # Additional tests
├── playwright.config.ts   # Playwright configuration
└── project.json           # Nx project config
```

**Walking Skeleton Test Target:**
- Health page: `http://localhost:3000/health`
- Server API: `http://localhost:3000/api/health` (GET, POST /ping)

### Evaluation Criteria Matrix Template

| Criterion | Playwright | TestSprite | Notes |
|-----------|------------|------------|-------|
| Setup Time | TBD | TBD | Time to configure from scratch |
| Learning Curve | TBD | TBD | Time to write first test |
| Execution Speed | TBD | TBD | Time for health check test suite |
| Debugging DX | TBD | TBD | Error messages, traces, screenshots |
| CI Integration | TBD | TBD | GitHub Actions compatibility |
| Nx Integration | TBD | TBD | Works with nx commands |
| Cost | Free | TBD | Licensing/usage costs |
| Maintenance | TBD | TBD | Long-term maintenance burden |

### Possible Outcomes

1. **Playwright Only**: Continue with existing setup, skip TestSprite
2. **TestSprite Only**: Replace Playwright with TestSprite
3. **Hybrid**: Use both for different scenarios (e.g., TestSprite for AI-assisted, Playwright for regression)
4. **TestSprite Inaccessible**: Document blocker and proceed with Playwright

### References

- [Source: docs/epics.md#Story-2.1]
- [Source: docs/architecture.md#E2E-Testing]
- [Source: docs/PRD.md#FR13-FR15] - Quality & Governance requirements

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-1-evaluate-testsprite-mcp-for-e2e-testing.context.xml`

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20250929)

### Debug Log References

<!-- Debug logs will be added during implementation -->

### Completion Notes List

**Completion Date:** 2025-12-04

**Summary:** TestSprite MCP evaluation complete. Hybrid approach selected - TestSprite for PRD validation and smoke testing during development; Playwright for edge cases, CI/CD integration, and comprehensive E2E coverage.

**Key Findings:**
- TestSprite executed 15 frontend tests with 66.67% pass rate (10/15)
- **No code defects found** - all failures attributable to test environment limitations or incorrectly scoped test cases
- Core UI and API tests achieved 100% pass rate
- TestSprite cannot: manipulate database state, inject network failures, access external systems (CI, Sentry, pre-commit hooks)

**Artifacts Created:**
- `docs/tooling/testsprite-workflow.md` - Operational guide with decision matrix
- `testsprite_tests/testsprite-frontend-test-report.md` - Full test execution report
- `testsprite_tests/testsprite_frontend_test_plan.json` - Generated test plan
- ADR entry added to `docs/architecture-decisions.md`

**Acceptance Criteria Validation:**
| AC | Requirement | Status |
|----|-------------|--------|
| AC1 | Configure TestSprite, execute tests against `/health` | ✅ 15 tests executed |
| AC2 | Compare experience with Playwright | ✅ Decision matrix in workflow doc |
| AC3 | Document findings (setup complexity, speed, debugging, CI) | ✅ Workflow doc + test report |

**Recommendation:** Proceed with Story 2.3 (Write E2E Tests for Walking Skeleton) using Playwright for the tests that will be committed to the repository. TestSprite remains available as a development-time PRD validation tool.

### File List

<!-- Files created/modified will be tracked here -->

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-12-03 | BMAD create-story workflow | Initial draft created |

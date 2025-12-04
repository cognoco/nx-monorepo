# Story 2.2: E2E Testing Decision and Strategy

Status: done

## Story

As a technical architect,
I want to document our E2E testing strategy decision,
so that the team has clear guidance on testing approach.

## Acceptance Criteria

| AC# | Given | When | Then |
|-----|-------|------|------|
| AC1 | TestSprite evaluation is complete | I analyze findings against project requirements | I select: Playwright, TestSprite, or hybrid approach |
| AC2 | Decision is made | I document the decision | Decision is documented in `docs/architecture-decisions.md` with rationale |
| AC3 | Documentation complete | I apply configuration changes | Any configuration changes are applied to the repository |

## Tasks / Subtasks

- [x] **Task 1: Analyze TestSprite Evaluation Findings** (AC: 1)
  - [x] 1.1 Review test execution results (pass/fail rates)
  - [x] 1.2 Identify TestSprite strengths (PRD validation, API testing, fast feedback)
  - [x] 1.3 Identify TestSprite limitations (state manipulation, network injection, CI integration)
  - [x] 1.4 Compare against Playwright capabilities

- [x] **Task 2: Make Strategic Decision** (AC: 1)
  - [x] 2.1 Evaluate Playwright-only approach
  - [x] 2.2 Evaluate TestSprite-only approach
  - [x] 2.3 Evaluate hybrid approach
  - [x] 2.4 Select optimal strategy based on project requirements

- [x] **Task 3: Document Decision in ADR** (AC: 2)
  - [x] 3.1 Create new section in `docs/architecture-decisions.md`
  - [x] 3.2 Document decision summary with rationale
  - [x] 3.3 Document use case matrix (when to use each tool)
  - [x] 3.4 Document artifact location strategy
  - [x] 3.5 Include migration path and future considerations

- [x] **Task 4: Apply Configuration Changes** (AC: 3)
  - [x] 4.1 Verify Playwright configuration unchanged (primary E2E tool)
  - [x] 4.2 Verify TestSprite artifacts gitignored (development-only)
  - [x] 4.3 Confirm no CI workflow changes needed

## Dev Notes

### Prerequisites
- Story 2.1 complete (TestSprite evaluation done)
- Test execution report available at `testsprite_tests/testsprite-frontend-test-report.md`

### Decision Factors Considered
- Maintenance overhead
- CI/CD integration requirements
- Debugging experience
- Edge case coverage needs
- Development velocity

### References
- [Source: docs/epics.md#Story-2.2]
- [Source: docs/architecture-decisions.md#Stage-6]

## Dev Agent Record

### Context Reference

- Story 2.1 completion notes
- `testsprite_tests/testsprite-frontend-test-report.md`

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20250929)

### Debug Log References

N/A - Decision documentation task

### Completion Notes List

**Completion Date:** 2025-12-04

**Summary:** Hybrid E2E testing approach selected and formally documented.

**Decision Made:**
- **Primary E2E Tool**: Playwright (for CI/CD and committed tests)
- **Development Tool**: TestSprite MCP (for PRD validation and smoke testing)
- **Strategy**: Complementary tools, not competing

**Key Rationale:**
- TestSprite excels at PRD validation and API contract testing (100% API test pass rate)
- TestSprite cannot manipulate state or inject failures (needed for edge cases)
- Playwright provides CI/CD integration and comprehensive coverage
- Hybrid approach gives best of both worlds

**Artifacts Updated:**
- `docs/architecture-decisions.md` - New "Stage 6: E2E Testing Strategy" section added
- `docs/tooling/testsprite-workflow.md` - Operational guide (created in Story 2.1)

**Configuration Changes:**
- None required - both tools already configured appropriately
- Playwright tests: `apps/web-e2e/src/*.spec.ts` (committed)
- TestSprite artifacts: `testsprite_tests/` (gitignored)

### File List

- `docs/architecture-decisions.md` (modified - ADR added)

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-12-04 | Claude Opus 4.5 | Story completed - decision documented in ADR |
| 2025-12-03 | BMAD create-story workflow | Initial draft created |

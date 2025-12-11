# Story 5b.1: Create Upgrade Branch and Run Nx Migrate

**Status:** ready-for-dev

---

## User Story

As a DevOps engineer,
I want to initiate the Nx upgrade in an isolated branch,
So that we can safely test the upgrade without affecting main.

---

## Acceptance Criteria

**Given** the main branch is stable
**When** I create the upgrade branch and run Nx migrate
**Then** the branch `e5b/expo-prep` exists

**And** `pnpm exec nx migrate 22.2.0` completes successfully
**And** migrations.json file is generated (if any migrations needed)
**And** No immediate breaking errors in migration output

---

## Implementation Details

### Tasks / Subtasks

- [ ] **Task 1:** Verify main branch is stable
  - [ ] Confirm all tests pass on main
  - [ ] Confirm CI is green
  - [ ] Pull latest changes

- [ ] **Task 2:** Create upgrade branch
  - [ ] `git checkout -b e5b/expo-prep` (or checkout existing branch)
  - [ ] Push branch to remote

- [ ] **Task 3:** Run Nx migrate command
  - [ ] Execute `pnpm exec nx migrate 22.2.0`
  - [ ] Capture and document output
  - [ ] Review any warnings or errors

- [ ] **Task 4:** Analyze migrations.json
  - [ ] Review generated migrations.json contents
  - [ ] Document which migrations will be applied
  - [ ] Identify any that need manual review

- [ ] **Task 5:** Document migration plan
  - [ ] Create summary of migration impact
  - [ ] Note any concerns for next story

### Technical Summary

This story initializes the Nx 22.x upgrade process by running the migrate command which:
1. Analyzes current workspace configuration
2. Generates `migrations.json` with required code changes
3. Updates `package.json` with target versions (but doesn't install yet)

The actual migrations and dependency installation happen in Story 5b.2.

### Project Structure Notes

- **Files to modify:** `package.json` (version updates), `migrations.json` (generated)
- **Expected test locations:** N/A (infrastructure story)
- **Estimated effort:** 1 story point (~1-2 hours)
- **Prerequisites:** None

### Key Code References

- `package.json` - Current Nx version: 21.6.5
- `nx.json` - Workspace configuration
- `docs/tech-stack.md` - Version inventory
- `docs/sprint-artifacts/epic-5b-nx-upgrade-analysis.md` - Research findings

---

## Context References

**Tech-Spec:** See `docs/sprint-artifacts/epic-5b-nx-upgrade-analysis.md` for:
- Complete research on SDK 54 requirements
- Nx 22.2.0+ requirement rationale
- Version compatibility matrix
- Risk assessment

**Architecture:**
- `docs/architecture-decisions.md` - Monorepo tooling decisions
- `docs/tech-stack.md` - Version pinning policy

---

## Handover Context

- **Assigned Persona:** 🏗️ Architect (Vimes)
- **From:** Epic start - analysis complete (see `docs/sprint-artifacts/epic-5b-nx-upgrade-analysis.md`)
- **Artifacts produced:** Branch created, migrations.json generated, migration output documented
- **Handover to:** 💻 Dev (Mort) for Story 5b.2
- **Context for next:** Review migrations.json contents; proceed with `nx migrate --run-migrations`

---

## Dev Agent Record

### Agent Model Used

<!-- Will be populated during dev-story execution -->

### Debug Log References

<!-- Will be populated during dev-story execution -->

### Completion Notes

<!-- Will be populated during dev-story execution -->

### Files Modified

<!-- Will be populated during dev-story execution -->

### Test Results

<!-- Will be populated during dev-story execution -->

---

## Review Notes

<!-- Will be populated during code review -->

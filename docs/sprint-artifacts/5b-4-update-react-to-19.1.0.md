# Story 5b.4: Update React to 19.1.0

**Status:** ready-for-dev

---

## User Story

As a developer,
I want React aligned at 19.1.0 across the monorepo,
So that web and mobile share the same React version.

---

## Acceptance Criteria

**Given** tests pass with Nx 22.x
**When** I update React version
**Then** package.json has:
  - `react`: 19.1.0 (from 19.0.1)
  - `react-dom`: 19.1.0 (from 19.0.1)

**And** `@types/react` and `@types/react-dom` are compatible
**And** `pnpm install` completes without peer dependency errors
**And** Web app builds and runs correctly
**And** All tests still pass

---

## Implementation Details

### Tasks / Subtasks

- [ ] **Task 1:** Research React 19.1 changes
  - [ ] Review React 19.1.0 release notes
  - [ ] Identify any breaking changes
  - [ ] Check @testing-library/react compatibility

- [ ] **Task 2:** Update React dependencies
  - [ ] Update `react` to 19.1.0
  - [ ] Update `react-dom` to 19.1.0
  - [ ] Run `pnpm install`

- [ ] **Task 3:** Update TypeScript types (if needed)
  - [ ] Check if `@types/react` 19.0.x is compatible
  - [ ] Update if newer version available and needed
  - [ ] Same for `@types/react-dom`

- [ ] **Task 4:** Verify web app
  - [ ] Build web app: `pnpm exec nx run web:build`
  - [ ] Run web app: `pnpm exec nx run web:dev`
  - [ ] Verify health check page works

- [ ] **Task 5:** Run tests
  - [ ] Run all tests: `pnpm exec nx run-many -t test`
  - [ ] Verify no React-related regressions

- [ ] **Task 6:** Update documentation
  - [ ] Update `docs/tech-stack.md` with new React version

### Technical Summary

This is a **minor version bump** (19.0.1 → 19.1.0) which should be low risk.

**Why 19.1.0?**
- Expo SDK 54 bundles React 19.1.0
- Aligning now prevents version conflicts when mobile app is added in Epic 6
- Enables maximum code sharing between web and mobile

**Version Matrix After Update:**

| Package | Before | After |
|---------|--------|-------|
| react | 19.0.1 | 19.1.0 |
| react-dom | 19.0.1 | 19.1.0 |
| @types/react | 19.0.1 | TBD (check compatibility) |
| @types/react-dom | 19.0.1 | TBD (check compatibility) |

### Project Structure Notes

- **Files to modify:** `package.json`, `docs/tech-stack.md`
- **Expected test locations:** `apps/web/src/**/*.spec.tsx`
- **Estimated effort:** 1 story point (~1-2 hours)
- **Prerequisites:** Story 5b.3 complete

### Key Code References

- `package.json` - React dependencies at root
- `apps/web/src/` - React components
- `docs/tech-stack.md` - Version documentation

---

## Context References

**Tech-Spec:** See `docs/sprint-artifacts/epic-5b-nx-upgrade-analysis.md` for:
- React version alignment strategy
- SDK 54 React requirement

**Architecture:**
- `docs/tech-stack.md` - Version pinning policy (React uses exact pins)

---

## Handover Context

- **Assigned Persona:** 💻 Dev (Mort)
- **From:** 🧪 TEA (Vetinari) - Story 5b.3 (tests passing)
- **Artifacts produced:** React 19.1.0 in package.json, docs/tech-stack.md updated
- **Handover to:** 💻 Dev (Mort) for Story 5b.5
- **Context for next:** Local tests pass; verify CI pipeline behaves the same

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

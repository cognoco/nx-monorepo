# Story 5b.3: Run Full Test Suite and Fix Breaking Changes

**Status:** ready-for-dev

---

## User Story

As a developer,
I want all existing tests to pass after the Nx upgrade,
So that we have confidence the upgrade didn't break functionality.

---

## Acceptance Criteria

**Given** all @nx/* plugins are updated
**When** I run the full test suite
**Then** all tests pass: `pnpm exec nx run-many -t test`

**And** all builds pass: `pnpm exec nx run-many -t build`
**And** all lint checks pass: `pnpm exec nx run-many -t lint`
**And** typecheck passes: `pnpm exec nx run-many -t typecheck`

**If failures occur:**
**Then** breaking changes are identified and fixed
**And** fixes are documented in commit messages

---

## Implementation Details

### Tasks / Subtasks

- [ ] **Task 1:** Run lint checks
  - [ ] Execute `pnpm exec nx run-many -t lint`
  - [ ] Document any ESLint config changes needed
  - [ ] Fix lint errors

- [ ] **Task 2:** Run TypeScript typechecks
  - [ ] Execute `pnpm exec nx run-many -t typecheck`
  - [ ] Identify any type-related breaking changes
  - [ ] Fix type errors

- [ ] **Task 3:** Run build
  - [ ] Execute `pnpm exec nx run-many -t build`
  - [ ] Verify all projects build successfully
  - [ ] Fix build errors

- [ ] **Task 4:** Run unit tests
  - [ ] Execute `pnpm exec nx run-many -t test`
  - [ ] If Windows + hanging: use `NX_DAEMON=false`
  - [ ] Identify failing tests
  - [ ] Fix test failures (may require Jest config updates)

- [ ] **Task 5:** Validate Next.js 16 compatibility
  - [ ] Verify `next build` completes successfully
  - [ ] Verify `next dev` starts without errors
  - [ ] Test Sentry integration still works with Next.js 16
  - [ ] Verify rewrites configuration functions correctly
  - [ ] Check for Next.js 16 deprecation warnings in console

- [ ] **Task 6:** Document fixes
  - [ ] Create commit for each category of fix
  - [ ] Document any patterns for future upgrades

### Technical Summary

Nx 22.x may introduce breaking changes in:

1. **Next.js 16 (IMPORTANT)** - Nx migrate automatically upgraded Next.js 15.2.6 → 16.0.8:
   - Major version upgrade with potential breaking changes
   - Sentry integration needs verification
   - `next.config.js` may have SVGR config added by migration
   - Rewrites and middleware behavior may differ
   - See: https://nextjs.org/blog/next-16

2. **Jest Configuration** - Nx 22.2 has Jest-specific migrations that may affect:
   - `jest.config.ts` files (ESM → CJS conversion)
   - `jest.preset.js` usage
   - Transform configurations

3. **ESLint Configuration** - Flat config updates may affect:
   - `.eslintrc.*` files
   - Plugin resolutions
   - `eslint-config-next` upgraded to 16.0.8

4. **TypeScript Configuration** - Path resolution may change:
   - `tsconfig.base.json`
   - Project-level `tsconfig.json`
   - Redundant project references removed by migration

### Project Structure Notes

- **Files to modify:** Various based on failures (jest.config.ts, tsconfig.json, etc.)
- **Expected test locations:** All `*.spec.ts` and `*.spec.tsx` files in `src/` directories
- **Estimated effort:** 3 story points (~4-8 hours depending on failures)
- **Prerequisites:** Story 5b.2 complete

### Key Code References

- `apps/web/jest.config.ts` - Web app Jest configuration
- `apps/server/jest.config.ts` - Server Jest configuration
- `packages/*/jest.config.ts` - Package Jest configurations
- `tsconfig.base.json` - Root TypeScript paths

### Troubleshooting Guide

**Jest Hanging on Windows:**
```bash
# Try with daemon disabled
NX_DAEMON=false pnpm exec nx run-many -t test

# Or disable Nx Cloud for this run
pnpm exec nx run-many -t test --no-cloud
```

**Jest Transform Errors:**
Check that `@swc/jest` is compatible with Jest 30.2.0

**Path Resolution Errors:**
Verify `tsconfig.base.json` paths match project structure

---

## Context References

**Tech-Spec:** See `docs/sprint-artifacts/epic-5b-nx-upgrade-analysis.md` for:
- Risk assessment of breaking changes
- Known Jest configuration issues

**Architecture:**
- `docs/memories/testing-reference.md` - Jest configuration patterns
- `docs/memories/troubleshooting.md` - Common solutions

---

## Handover Context

- **Assigned Persona:** 🧪 TEA (Vetinari) | 💻 Dev (Mort) for fixes
- **From:** 💻 Dev (Mort) - Story 5b.2 (plugins updated)
- **Artifacts produced:** All tests green, all builds passing, fixes documented in commits
- **Handover to:** 💻 Dev (Mort) for Story 5b.4
- **Context for next:** Test infrastructure stable; proceed with React version alignment
- **Known concerns:**
  - Windows Jest hanging issue may surface; use `NX_DAEMON=false` if needed
  - **Next.js 16 upgrade was automatic** (via nx migrate) - needs explicit validation
  - Sentry + Next.js 16 compatibility unverified

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

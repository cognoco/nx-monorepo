# Story 5b.2: Execute Migrations and Update All @nx/* Plugins

**Status:** ready-for-dev

---

## User Story

As a DevOps engineer,
I want all @nx/* plugins updated to match Nx 22.2.0,
So that the workspace has consistent tooling versions.

---

## Acceptance Criteria

**Given** migrations.json exists from Story 5b.1
**When** I run migrations and update plugins
**Then** the following are updated in package.json:
  - `nx`: 22.2.0 (or latest 22.x)
  - All `@nx/*` packages: matching version

**And** `pnpm install` completes without errors
**And** `pnpm exec nx migrate --run-migrations` completes
**And** Version pinning policy is maintained (all @nx/* match)

---

## Implementation Details

### Tasks / Subtasks

- [ ] **Task 1:** Review migrations.json from 5b.1
  - [ ] Understand which migrations will run
  - [ ] Identify any high-risk migrations
  - [ ] Plan rollback if needed

- [ ] **Task 2:** Install updated dependencies
  - [ ] Run `pnpm install`
  - [ ] Verify no peer dependency conflicts
  - [ ] Check for any warnings

- [ ] **Task 3:** Execute migrations
  - [ ] Run `pnpm exec nx migrate --run-migrations`
  - [ ] Monitor output for errors
  - [ ] Document any manual interventions

- [ ] **Task 4:** Verify @nx/* version alignment
  - [ ] Check all @nx/* packages in package.json
  - [ ] Confirm all versions match
  - [ ] Fix any drift

- [ ] **Task 5:** Clean up
  - [ ] Delete migrations.json after successful run
  - [ ] Commit changes with descriptive message

### Technical Summary

This story executes the migrations prepared in 5b.1. The key packages affected are:

| Package | From | To |
|---------|------|-----|
| nx | 21.6.5 | 22.2.0+ |
| @nx/devkit | 21.6.5 | 22.2.0+ |
| @nx/esbuild | 21.6.5 | 22.2.0+ |
| @nx/eslint | 21.6.5 | 22.2.0+ |
| @nx/eslint-plugin | 21.6.5 | 22.2.0+ |
| @nx/jest | 21.6.5 | 22.2.0+ |
| @nx/js | 21.6.5 | 22.2.0+ |
| @nx/next | 21.6.5 | 22.2.0+ |
| @nx/node | 21.6.5 | 22.2.0+ |
| @nx/playwright | 21.6.5 | 22.2.0+ |
| @nx/react | 21.6.5 | 22.2.0+ |
| @nx/workspace | 21.6.5 | 22.2.0+ |

### Project Structure Notes

- **Files to modify:** `package.json`, `pnpm-lock.yaml`, any files touched by migrations
- **Expected test locations:** N/A (infrastructure story)
- **Estimated effort:** 2 story points (~2-4 hours)
- **Prerequisites:** Story 5b.1 complete

### Key Code References

- `package.json` - All @nx/* dependencies
- `migrations.json` - Generated migration plan
- `nx.json` - May be modified by migrations
- Individual `project.json` files - May be modified by migrations

---

## Context References

**Tech-Spec:** See `docs/sprint-artifacts/epic-5b-nx-upgrade-analysis.md` for:
- Version alignment strategy
- @nx/* plugin list
- Risk assessment

**Architecture:**
- `docs/tech-stack.md` - Critical Rule: All @nx/* packages must match core nx version

---

## Handover Context

- **Assigned Persona:** 💻 Dev (Mort) | 🏗️ Architect (Vimes) oversight
- **From:** 🏗️ Architect (Vimes) - Story 5b.1 (migrations.json ready)
- **Artifacts produced:** Updated package.json, lock file refreshed, migrations executed
- **Handover to:** 🧪 TEA (Vetinari) for Story 5b.3
- **Context for next:** All @nx/* versions now at 22.x; expect potential Jest config changes; run full test suite

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

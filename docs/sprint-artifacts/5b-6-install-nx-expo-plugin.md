# Story 5b.6: Install @nx/expo Plugin

**Status:** ready-for-dev

---

## User Story

As a mobile developer,
I want the @nx/expo plugin installed,
So that we can generate and manage Expo applications.

---

## Acceptance Criteria

**Given** Nx 22.x is validated
**When** I install the @nx/expo plugin
**Then** `nx add @nx/expo` completes successfully

**And** @nx/expo version matches other @nx/* packages (22.2.0+)
**And** `pnpm exec nx list @nx/expo` shows available generators
**And** No peer dependency conflicts

---

## Implementation Details

### Tasks / Subtasks

- [ ] **Task 1:** Install @nx/expo plugin
  - [ ] Run `nx add @nx/expo`
  - [ ] Verify installation succeeds
  - [ ] Check for any warnings

- [ ] **Task 2:** Verify version alignment
  - [ ] Confirm @nx/expo version matches other @nx/* (22.2.0+)
  - [ ] Check package.json for consistency

- [ ] **Task 3:** Verify generators available
  - [ ] Run `pnpm exec nx list @nx/expo`
  - [ ] Confirm generators are listed:
    - [ ] application
    - [ ] library
    - [ ] component

- [ ] **Task 4:** Check peer dependencies
  - [ ] Verify no peer dependency conflicts
  - [ ] Check for Expo-related peer deps

- [ ] **Task 5:** Test generator (dry run)
  - [ ] Run `pnpm exec nx g @nx/expo:app --help`
  - [ ] Verify generator options are visible
  - [ ] **DO NOT** actually generate app (that's Epic 6)

### Technical Summary

The @nx/expo plugin provides:

| Generator | Purpose |
|-----------|---------|
| `@nx/expo:application` | Generate new Expo app |
| `@nx/expo:library` | Generate Expo-compatible library |
| `@nx/expo:component` | Generate React Native component |

**Critical Dependency Chain:**
```
@nx/expo 22.2.0+ → expo >= 54.0.0 → React Native 0.81 → React 19.1.0
```

This story installs the plugin only. The actual mobile app generation happens in Epic 6.

### Project Structure Notes

- **Files to modify:** `package.json` (add @nx/expo)
- **Expected test locations:** N/A (plugin installation)
- **Estimated effort:** 1 story point (~30 min - 1 hour)
- **Prerequisites:** Story 5b.5 complete

### Key Code References

- `package.json` - New @nx/expo dependency
- `nx.json` - Plugin may add configuration

---

## Context References

**Tech-Spec:** See `docs/sprint-artifacts/epic-5b-nx-upgrade-analysis.md` for:
- @nx/expo requirement (expo >= 54.0.0)
- Plugin compatibility analysis

**Architecture:**
- `docs/architecture.md` - Mobile architecture plan
- NX MCP documentation on @nx/expo

---

## Handover Context

- **Assigned Persona:** 🏗️ Architect (Vimes) | 💻 Dev (Mort) support
- **From:** 💻 Dev (Mort) - Story 5b.5 (CI validated)
- **Artifacts produced:** @nx/expo plugin installed, generators verified available
- **Handover to:** 💻 Dev (Mort) for Story 5b.7
- **Context for next:** Plugin ready; install Expo CLI and EAS CLI tooling

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

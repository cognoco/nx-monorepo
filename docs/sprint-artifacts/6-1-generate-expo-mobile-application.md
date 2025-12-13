# Story 6.1: Generate Expo Mobile Application

**Status:** drafted

---

## User Story

As a mobile developer,
I want an Expo mobile app in the monorepo,
So that I can build cross-platform mobile experiences.

---

## Acceptance Criteria

1. **Given** Epic 5b is complete (Nx 22.x + @nx/expo installed)
   **When** I generate the mobile app with `pnpm exec nx g @nx/expo:application mobile --directory=apps/mobile`
   **Then** the app is created with correct structure in `apps/mobile/`

2. **Given** the mobile app is generated
   **When** I run `pnpm exec nx run mobile:start`
   **Then** Expo dev server launches successfully

3. **Given** the mobile app is generated
   **When** I run `pnpm exec nx run mobile:lint`
   **Then** lint passes with no errors

4. **Given** the mobile app is generated
   **When** I run `pnpm exec nx run mobile:test`
   **Then** default tests pass

5. **Given** the mobile app is generated
   **When** I verify TypeScript path aliases
   **Then** shared packages (`@nx-monorepo/*`) are importable

---

## Tasks / Subtasks

- [ ] **Task 1: Generate Expo Application** (AC: 1)
  - [ ] 1.1 Run `pnpm exec nx g @nx/expo:application mobile --directory=apps/mobile`
  - [ ] 1.2 Verify app structure created in `apps/mobile/`
  - [ ] 1.3 Verify `project.json` has expected targets (start, build, lint, test, etc.)
  - [ ] 1.4 Verify `app.json`/`app.config.js` created with valid Expo config

- [ ] **Task 2: Apply Post-Generation Fixes** (AC: 1, 3, 4)
  - [ ] 2.1 Check and apply post-generation checklist (`docs/memories/post-generation-checklist/`)
  - [ ] 2.2 Verify Jest configuration aligns with workspace patterns
  - [ ] 2.3 Verify TypeScript configuration uses `bundler` resolution (or appropriate for Expo)
  - [ ] 2.4 Add testing enhancement libraries if needed (`@testing-library/react-native`)
  - [ ] 2.5 Verify `tsconfig.json` extends `tsconfig.base.json` for path aliases

- [ ] **Task 3: Validate Expo Dev Server** (AC: 2)
  - [ ] 3.1 Run `pnpm exec nx run mobile:start`
  - [ ] 3.2 Verify Expo CLI launches without errors
  - [ ] 3.3 Verify QR code displayed for Expo Go
  - [ ] 3.4 Test basic navigation in Expo Go (if possible) or web preview

- [ ] **Task 4: Validate Quality Gates** (AC: 3, 4)
  - [ ] 4.1 Run `pnpm exec nx run mobile:lint` - verify passes
  - [ ] 4.2 Run `pnpm exec nx run mobile:test` - verify default tests pass
  - [ ] 4.3 Run `pnpm exec nx run mobile:typecheck` - verify no TypeScript errors (if target exists)

- [ ] **Task 5: Verify Monorepo Integration** (AC: 5)
  - [ ] 5.1 Add test import of `@nx-monorepo/schemas` in a mobile file
  - [ ] 5.2 Verify TypeScript resolves path alias without errors
  - [ ] 5.3 Run `pnpm exec nx graph` - verify mobile app appears in dependency graph
  - [ ] 5.4 Remove test import (cleanup)

- [ ] **Task 6: Update CI/CD** (AC: all)
  - [ ] 6.1 Verify `.github/workflows/ci.yml` includes mobile targets (or add if missing)
  - [ ] 6.2 Push changes and verify CI pipeline passes with new mobile project

---

## Dev Notes

### Architecture Context

**SDK Version:** Expo SDK 54 (54.0.29) - Required by @nx/expo 22.2.0 plugin
**React Native:** 0.81.5
**React:** 19.1.0 (aligned with web app)
**Navigation:** expo-router v6 (file-based routing)
**Architecture:** Legacy Architecture (SDK 54 is last version supporting it; SDK 55 will require New Architecture)

**Key Decision:** Use Legacy Architecture for the walking skeleton to maximize compatibility and library support. New Architecture migration planned for SDK 55 upgrade.

### Expected Project Structure

```
apps/mobile/
├── app/                    # Expo Router routes
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Home screen (/)
│   └── +not-found.tsx      # 404 handler
├── assets/                 # Static assets (images, fonts)
├── app.json                # Expo configuration
├── babel.config.js         # Babel configuration
├── metro.config.js         # Metro bundler (auto-configured)
├── package.json            # Mobile-specific dependencies
├── project.json            # Nx project configuration
├── tsconfig.json           # TypeScript config (extends base)
└── jest.config.ts          # Jest configuration
```

### Metro Configuration

Since SDK 52, Expo automatically configures Metro for monorepos when using `expo/metro-config`. **No manual watchFolders configuration required.**

If `@nx/expo` generator includes `withNxMetro` wrapper, it should be compatible. Validate during Task 1.

### Generator Command Reference

```bash
# Primary command (use this)
pnpm exec nx g @nx/expo:application mobile --directory=apps/mobile

# Alternative syntax (same result)
pnpm exec nx g @nx/expo:app mobile --directory=apps/mobile
```

### Validation Commands

```bash
# After generation - quality gates
pnpm exec nx run mobile:lint
pnpm exec nx run mobile:test
pnpm exec nx run mobile:start

# Monorepo health
pnpm exec nx graph                    # Verify dependency graph
pnpm why react                        # Verify single React version
pnpm why react-native                 # Verify single RN version
```

### Project Structure Notes

- **Test location:** Co-located in `src/` or `app/` (following workspace convention)
- **Path aliases:** Must work via `tsconfig.base.json` paths
- **Nx plugin:** @nx/expo 22.2.0 configured in `nx.json` with all target names

### Open Questions to Validate

| Question | Expected | Validate During |
|----------|----------|-----------------|
| Does `withNxMetro` wrapper work with auto-config? | Yes | Task 1.4 |
| Are path aliases working out-of-box? | Yes | Task 5.1-5.2 |
| Does @nx/expo generate jest.config? | Yes | Task 2.2 |
| What testing libraries are included? | Minimal | Task 2.4 |

### References

- [Source: docs/sprint-artifacts/epic-6-design-decisions.md] - SDK 54 decisions, Metro config, architecture strategy
- [Source: docs/sprint-artifacts/epic-5b-nx-upgrade-analysis.md] - Nx 22 upgrade analysis, @nx/expo requirements
- [Source: docs/epics.md#Epic-6] - Acceptance criteria and user story
- [Source: docs/architecture.md#Project-Structure] - Monorepo dependency flow
- [Source: docs/memories/post-generation-checklist/] - Post-generation fixes

### Learnings from Previous Story

**From Story 5b.9 (Epic 5b Final Validation):**

- **Fresh clone note:** After fresh install, Prisma client generation needed: `pnpm --filter @nx-monorepo/database db:generate`
- **Test baseline:** 222 tests passing across 6 projects (expect this story to add mobile tests)
- **CI status:** Green on main after Epic 5b merge
- **Infrastructure ready:** Nx 22.2.0+, @nx/expo 22.2.0, React 19.1.0, Expo SDK 54 all installed and validated
- **Expo CLI verified:** `npx expo --version` returns version info
- **EAS CLI verified:** `eas whoami` confirms authenticated user

[Source: docs/sprint-artifacts/5b-9-final-validation-and-merge-to-main.md#Dev-Agent-Record]

---

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-13 | SM Agent (Rincewind) | Story drafted from Epic 6 requirements with SDK 54 context from Epic 5b |

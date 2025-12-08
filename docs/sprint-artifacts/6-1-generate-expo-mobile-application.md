# Story 6.1: Generate Expo Mobile Application

Status: ready-for-dev

## Story

As a mobile developer,
I want an Expo mobile app in the monorepo,
so that I can build cross-platform mobile experiences.

## Acceptance Criteria

1. **Given** the Nx workspace exists  
   **When** I generate the mobile app with `pnpm exec nx g @nx/expo:app mobile --directory=apps/mobile`  
   **Then** the app is created with correct structure

2. **Given** the mobile app is generated  
   **When** I run `pnpm exec nx run mobile:start`  
   **Then** Expo dev server launches and QR code is displayed

3. **Given** the mobile app is generated  
   **When** I run `pnpm exec nx run mobile:lint`  
   **Then** linting passes with no errors

4. **Given** the mobile app is generated  
   **When** I run `pnpm exec nx run mobile:test`  
   **Then** default tests pass

5. **Given** Nx @nx/expo plugin doesn't support SDK 53  
   **When** I use the fallback approach  
   **Then** I can generate with `create-expo-app` and manually integrate into Nx

6. **Given** the mobile app uses Expo Router  
   **When** I inspect the project structure  
   **Then** routes are in the `app/` directory following file-based routing

7. **Given** Metro bundler needs monorepo support  
   **When** I configure `metro.config.js`  
   **Then** the config includes `watchFolders` and `nodeModulesPaths` for workspace root

## Tasks / Subtasks

- [ ] **Task 1: Verify Nx Plugin Compatibility** (AC: 1, 5)
  - [ ] Check @nx/expo version in Nx 21.6.5
  - [ ] Verify SDK 53 / React Native 0.79 support
  - [ ] Document findings in story notes

- [ ] **Task 2: Generate Mobile Application** (AC: 1, 2)
  - [ ] Run `pnpm exec nx g @nx/expo:app mobile --directory=apps/mobile`
  - [ ] OR (if fallback needed): Run `npx create-expo-app apps/mobile --template blank-typescript`
  - [ ] Verify app structure created correctly

- [ ] **Task 3: Configure for Expo SDK 53** (AC: 1, 6)
  - [ ] Ensure `expo: ~53.0.0` in package.json
  - [ ] Ensure `react: 19.0.0` matches web app exactly
  - [ ] Ensure `react-native: ~0.79.0` per SDK 53 requirements
  - [ ] Configure Expo Router if not default

- [ ] **Task 4: Configure Metro for Monorepo** (AC: 7)
  - [ ] Update `metro.config.js` with monorepo support:
    ```javascript
    const projectRoot = __dirname;
    const monorepoRoot = path.resolve(projectRoot, '../..');
    config.watchFolders = [monorepoRoot];
    config.resolver.nodeModulesPaths = [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ];
    ```
  - [ ] Validate Metro config works with Nx wrapper (if present)

- [ ] **Task 5: Follow Post-Generation Checklist** (AC: 1, 3, 4)
  - [ ] Review `docs/memories/post-generation-checklist.md`
  - [ ] Apply any necessary fixes to generated code
  - [ ] Verify TypeScript configuration

- [ ] **Task 6: Verify All Nx Targets** (AC: 2, 3, 4)
  - [ ] Run `pnpm exec nx run mobile:start` - verify Expo server starts
  - [ ] Run `pnpm exec nx run mobile:lint` - verify passes
  - [ ] Run `pnpm exec nx run mobile:test` - verify default tests pass

- [ ] **Task 7: Validate No Duplicate Dependencies** (AC: 1)
  - [ ] Run `pnpm why react` - ensure single version (19.0.0)
  - [ ] Run `pnpm why react-native` - ensure single version
  - [ ] Document any resolution issues

- [ ] **Task 8: Update CI Workflow (if needed)** (AC: 3, 4)
  - [ ] Check if `.github/workflows/ci.yml` needs mobile targets
  - [ ] Add mobile:lint and mobile:test to affected targets if missing

## Dev Notes

### Key Design Decisions

From `docs/sprint-artifacts/epic-6-design-decisions.md`:

| Decision | Choice | Notes |
|----------|--------|-------|
| **SDK Version** | Expo SDK 53 | React 19.0.0 matches web exactly |
| **Navigation** | Expo Router | File-based routing, out-of-box scaffolding |
| **Generation** | @nx/expo:app | Fallback: create-expo-app + manual integration |
| **Metro Config** | Monorepo support | watchFolders + nodeModulesPaths |

### Project Structure (Expected)

```
apps/mobile/
├── app/                        # Expo Router routes
│   ├── _layout.tsx             # Root layout
│   ├── index.tsx               # Home screen (/)
│   └── +not-found.tsx          # 404 handler
├── src/
│   ├── components/             # Reusable components
│   └── lib/                    # Utilities
├── app.json                    # Expo configuration
├── app.config.ts               # Dynamic Expo config
├── babel.config.js             # Babel configuration
├── metro.config.js             # Metro bundler config
├── tsconfig.json               # TypeScript config
├── jest.config.ts              # Jest configuration
└── project.json                # Nx project configuration
```

### Walking Skeleton Principle

**Use out-of-box scaffolding.** Do NOT:
- Add custom navigation patterns (tabs, drawers)
- Add state management libraries
- Add offline-first patterns
- Add custom theming

### Open Questions to Resolve

| Question | Resolution Path |
|----------|-----------------|
| Does @nx/expo support SDK 53? | Test during generation |
| Does Nx Metro wrapper conflict with monorepo config? | Validate after generation |

### Testing Standards

- Co-locate tests in `src/` next to source files (`.spec.tsx`)
- Use Jest for unit tests
- Follow patterns from `docs/memories/testing-reference.md`

### References

- [Source: docs/sprint-artifacts/epic-6-design-decisions.md#D1-D4]
- [Source: docs/sprint-artifacts/tech-spec-epic-6.md#AC-6.1]
- [Source: docs/epics.md#Story-6.1]
- [Source: docs/memories/post-generation-checklist.md]
- [Expo Monorepo Guide](https://docs.expo.dev/guides/monorepos)

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/6-1-generate-expo-mobile-application.context.xml` (generated 2025-12-05)

### Agent Model Used

<!-- To be filled by dev agent -->

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-12-05 | SM Agent | Initial draft from epic-6 contexting |


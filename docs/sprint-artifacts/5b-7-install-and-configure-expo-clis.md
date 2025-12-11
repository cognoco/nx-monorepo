# Story 5b.7: Install and Configure Expo CLIs

**Status:** ready-for-dev

---

## User Story

As a mobile developer,
I want the Expo and EAS CLIs properly installed and configured,
So that I can run development commands and cloud builds.

---

## Acceptance Criteria

**Given** @nx/expo plugin is installed
**When** I install and configure the CLIs
**Then** the following are working:

**Expo CLI (bundled with expo package):**
- `npx expo --version` returns version info
- `npx expo doctor` runs successfully

**EAS CLI (separate global install):**
- `npm install -g eas-cli` completes successfully
- `eas --version` returns version info
- `eas login` authenticates with Expo account
- `eas whoami` confirms logged-in user

**And** EAS project is initialized (if needed): `eas init`
**And** CLI versions are documented in `docs/tech-stack.md`

---

## Implementation Details

### Tasks / Subtasks

- [ ] **Task 1:** Verify Expo CLI availability
  - [ ] Expo CLI is bundled with `expo` package
  - [ ] Run `npx expo --version`
  - [ ] Run `npx expo doctor` to check setup

- [ ] **Task 2:** Install EAS CLI
  - [ ] Run `npm install -g eas-cli`
  - [ ] Alternatively: Add to devDependencies for CI consistency
  - [ ] Verify with `eas --version`

- [ ] **Task 3:** Configure EAS authentication
  - [ ] Run `eas login`
  - [ ] Authenticate with Expo account
  - [ ] Verify with `eas whoami`

- [ ] **Task 4:** Initialize EAS project (if needed)
  - [ ] Run `eas init` when mobile app exists (Epic 6)
  - [ ] Note: May defer to Epic 6 if no app yet

- [ ] **Task 5:** Document CLI setup
  - [ ] Update `docs/tech-stack.md` with CLI versions
  - [ ] Add CLI commands reference to documentation

- [ ] **Task 6:** Consider CI configuration
  - [ ] Document EAS CLI setup for CI
  - [ ] Note authentication requirements for CI builds

### Technical Summary

**Two CLIs, Two Purposes:**

| CLI | Installation | Purpose |
|-----|--------------|---------|
| **Expo CLI** | Bundled with `expo` package | Local development: `expo start`, `expo install`, `expo doctor` |
| **EAS CLI** | Global or devDependency | Cloud services: builds, updates, submissions |

**Expo CLI Commands:**
```bash
npx expo start          # Start Metro bundler
npx expo install        # Install compatible packages
npx expo doctor         # Diagnose project issues
npx expo prebuild       # Generate native directories
```

**EAS CLI Commands:**
```bash
eas login               # Authenticate with Expo account
eas init                # Initialize EAS project
eas build               # Create cloud builds
eas update              # Push OTA updates
eas submit              # Submit to app stores
```

### Project Structure Notes

- **Files to modify:** `docs/tech-stack.md`, potentially `package.json` (if adding eas-cli as devDep)
- **Expected test locations:** N/A (tooling installation)
- **Estimated effort:** 1 story point (~1-2 hours)
- **Prerequisites:** Story 5b.6 complete

### Key Code References

- `package.json` - May add eas-cli
- `docs/tech-stack.md` - CLI documentation
- Future: `eas.json` - EAS configuration (Epic 6)

---

## Context References

**Tech-Spec:** See `docs/sprint-artifacts/epic-5b-nx-upgrade-analysis.md` for:
- Expo SDK 54 tooling requirements

**Architecture:**
- Expo official documentation: https://docs.expo.dev/more/expo-cli/
- EAS documentation: https://docs.expo.dev/eas/

---

## Handover Context

- **Assigned Persona:** 💻 Dev (Mort)
- **From:** 🏗️ Architect (Vimes) - Story 5b.6 (@nx/expo installed)
- **Artifacts produced:** Expo CLI verified, EAS CLI installed and authenticated, docs/tech-stack.md updated
- **Handover to:** 📚 Tech Writer (Twoflower) for Story 5b.8
- **Context for next:** All tooling installed; document the upgrade for team awareness

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

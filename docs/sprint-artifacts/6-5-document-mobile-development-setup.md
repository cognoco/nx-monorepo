# Story 6.5: Document Mobile Development Setup

Status: ready-for-dev

## Story

As a new mobile developer,
I want documentation for mobile development,
so that I can get started quickly.

## Acceptance Criteria

1. **Given** mobile walking skeleton is complete (Stories 6.1-6.4)  
   **When** I create/update mobile documentation  
   **Then** documentation covers simulator/emulator setup

2. **Given** documentation exists  
   **When** a developer reads iOS setup section  
   **Then** they can run mobile app on iOS Simulator in <15 minutes

3. **Given** documentation exists  
   **When** a developer reads Android setup section  
   **Then** they can run mobile app on Android Emulator

4. **Given** documentation covers Expo workflow  
   **When** a developer reads the commands section  
   **Then** they understand all Expo/Nx commands needed

5. **Given** documentation covers networking  
   **When** a developer reads networking section  
   **Then** they understand localhost differences per platform

6. **Given** documentation covers staging  
   **When** a developer wants to test against staging API  
   **Then** instructions explain how to configure API URL

7. **Given** documentation is complete  
   **When** it is added to the project  
   **Then** it exists in `docs/` or `apps/mobile/README.md`

## Tasks / Subtasks

- [ ] **Task 1: Create Mobile README** (AC: 7)
  - [ ] Create `apps/mobile/README.md`
  - [ ] Add overview of mobile app purpose
  - [ ] Link to relevant project documentation

- [ ] **Task 2: Document Prerequisites** (AC: 2, 3)
  - [ ] Node.js version requirement
  - [ ] pnpm installation
  - [ ] Expo CLI (global or via npx)
  - [ ] Xcode requirement for iOS (macOS only)
  - [ ] Android Studio / SDK for Android

- [ ] **Task 3: Document iOS Simulator Setup** (AC: 2)
  - [ ] Xcode installation from App Store
  - [ ] Command to open iOS Simulator: `open -a Simulator`
  - [ ] Selecting simulator device
  - [ ] Running app: `pnpm exec nx run mobile:start` → press `i`

- [ ] **Task 4: Document Android Emulator Setup** (AC: 3)
  - [ ] Android Studio installation
  - [ ] Creating AVD (Android Virtual Device)
  - [ ] Starting emulator
  - [ ] Running app: `pnpm exec nx run mobile:start` → press `a`

- [ ] **Task 5: Document Expo Commands** (AC: 4)
  - [ ] Document all Nx targets:
    - `pnpm exec nx run mobile:start` - Start Expo dev server
    - `pnpm exec nx run mobile:lint` - Run linter
    - `pnpm exec nx run mobile:test` - Run tests
  - [ ] Document Expo Go app usage
  - [ ] Document QR code scanning workflow

- [ ] **Task 6: Document Networking Configuration** (AC: 5)
  - [ ] Localhost for iOS Simulator: `http://localhost:4000/api`
  - [ ] Localhost for Android Emulator: `http://10.0.2.2:4000/api`
  - [ ] Physical device requirement: public HTTPS URL
  - [ ] Explain why Android uses 10.0.2.2

- [ ] **Task 7: Document Staging API Configuration** (AC: 6)
  - [ ] Environment variable: `API_URL`
  - [ ] app.config.ts extras configuration
  - [ ] Example: `API_URL=https://staging-api.railway.app pnpm exec nx run mobile:start`

- [ ] **Task 8: Add Troubleshooting Section**
  - [ ] Common Metro bundler issues
  - [ ] Network connectivity issues
  - [ ] iOS Simulator startup issues
  - [ ] Android Emulator startup issues
  - [ ] TypeScript path resolution issues

- [ ] **Task 9: Update Project Documentation** (AC: 7)
  - [ ] Add mobile section to main README.md if appropriate
  - [ ] Update `docs/index.md` with mobile documentation reference
  - [ ] Cross-reference from architecture.md mobile section

- [ ] **Task 10: Validate Documentation** (AC: 2, 3)
  - [ ] Have someone unfamiliar with mobile follow the docs
  - [ ] Time the setup process (target: <15 minutes)
  - [ ] Note any gaps or unclear instructions
  - [ ] Iterate on documentation based on feedback

## Dev Notes

### Documentation Structure

```markdown
# Mobile App (apps/mobile)

## Overview
Brief description of mobile app purpose in the monorepo.

## Prerequisites
- Node.js 22+
- pnpm
- For iOS: macOS with Xcode 15+
- For Android: Android Studio with SDK

## Quick Start
1. Start server: `pnpm exec nx run server:serve`
2. Start mobile: `pnpm exec nx run mobile:start`
3. Press `i` for iOS or `a` for Android

## iOS Simulator Setup
[Detailed instructions]

## Android Emulator Setup
[Detailed instructions]

## Expo Commands
[Command reference]

## Networking
[Platform-specific localhost info]

## Testing Against Staging
[API URL configuration]

## Troubleshooting
[Common issues and solutions]
```

### Key Information to Include

| Topic | Key Points |
|-------|------------|
| **iOS Setup** | Xcode, Simulator, `press i` |
| **Android Setup** | Android Studio, AVD, `press a` |
| **Networking** | localhost vs 10.0.2.2 |
| **Staging** | API_URL environment variable |
| **Expo Go** | Physical device testing |

### Success Criteria for Documentation

- New developer can run mobile app in <15 minutes
- No missing prerequisites
- Clear command reference
- Troubleshooting covers common issues

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-6.md#AC-6.5]
- [Source: docs/epics.md#Story-6.5]
- [Expo Documentation](https://docs.expo.dev/)
- [Nx Expo Plugin](https://nx.dev/technologies/react/expo/introduction)

### Post-Epic Documentation Updates

After Epic 6 completion, also update:
- `docs/architecture.md` - Add Mobile Architecture section
- `docs/tech-stack.md` - Add Mobile Stack versions
- `docs/memories/` - Add mobile patterns and troubleshooting

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/6-5-document-mobile-development-setup.context.xml` (generated 2025-12-05)

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


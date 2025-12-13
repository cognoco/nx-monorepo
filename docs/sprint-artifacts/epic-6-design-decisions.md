# Epic 6: Mobile Walking Skeleton - Design Decisions

**Date:** 2025-12-05 (Original) | 2025-12-12 (Revised after Epic 5b)
**Decision Makers:** Jørn (Product Owner / Lead Developer)
**Status:** Approved - Ready for Implementation

---

## Purpose

This document captures architectural decisions for Epic 6 mobile development. **Revised December 12, 2025** to reflect infrastructure changes from Epic 5b (Nx 22 upgrade, SDK 54 installation, React 19.1.0 alignment).

**Related Documents:**
- `docs/sprint-artifacts/tech-spec-epic-6.md` - Technical specification
- `docs/sprint-artifacts/epic-5b-nx-upgrade-analysis.md` - Epic 5b upgrade analysis
- `docs/epics.md` (Epic 6 section) - User stories and acceptance criteria
- `docs/architecture-decisions.md` - Strategic architectural decisions
- `docs/tech-stack.md` - Version pinning reference

---

## Epic 5b Foundation (NEW)

Epic 5b (completed December 12, 2025) established the mobile development infrastructure:

| Component | Version | Status |
|-----------|---------|--------|
| Nx | 22.2.0 | ✅ Upgraded and validated |
| @nx/expo | 22.2.0 | ✅ Installed and generators verified |
| Expo SDK | ~54.0.0 | ✅ Installed (54.0.29) |
| React Native | 0.81.5 | ✅ Installed |
| React | 19.1.0 | ✅ Aligned across web and mobile |
| expo-router | ~6.0.17 | ✅ Bundled with SDK 54 |
| Expo CLI | 54.0.19 | ✅ Bundled with expo package |
| EAS CLI | 16.28.0 | ✅ Global install, authenticated |

**Key Configuration from Epic 5b:**
- pnpm overrides enforce React 19.1.0 across monorepo
- @nx/expo plugin configured in `nx.json` with all target names
- 222 tests passing (no regressions from upgrade)
- CI/CD validated with Nx Cloud

---

## Decision Summary

| Decision | Choice | Confidence | Validation Status |
|----------|--------|------------|-------------------|
| D1: Expo SDK Version | **SDK 54 (Stable)** | High | ✅ Installed in Epic 5b |
| D2: Navigation Framework | **Expo Router v6** | High | ✅ Bundled with SDK 54 |
| D3: Nx Generation | **@nx/expo:application** | High | ✅ Plugin installed in Epic 5b |
| D4: Metro Bundler Config | **Automatic** (SDK 52+) | High | ✅ Verified via Expo docs |
| D5: API Client | **openapi-fetch** (existing) | Medium | Needs runtime verification |
| D6: New Architecture | **Legacy** (SDK 54 last support) | High | Strategic decision |

---

## D1: Expo SDK Version

### Decision
Use **Expo SDK 54** (stable release, December 2025).

### Version Matrix (Authoritative)

| Expo SDK | React Native | React | RN Web | Min Node.js |
|----------|--------------|-------|--------|-------------|
| **54.0.0** | **0.81** | **19.1.0** | 0.21.0 | 20.19.x |
| 53.0.0 | 0.79 | 19.0.0 | 0.20.0 | 20.18.x |
| 52.0.0 | 0.76 | 18.3.1 | 0.19.13 | 20.18.x |

### Rationale

1. **@nx/expo 22.2.0 requires SDK 54** - SDK 53 is NOT supported by the current @nx/expo plugin
2. **React 19.1.0 alignment** - Our web app uses React 19.1.0; SDK 54's React 19.1.0 is an exact match
3. **Last Legacy Architecture support** - SDK 55 will require New Architecture; SDK 54 allows gradual migration
4. **Precompiled React Native for iOS** - Faster build times (up to 10x for clean builds)

### SDK 54 Key Features

- **React Compiler available** (experimental, opt-in via `experiments.reactCompiler`)
- **iOS 26 Liquid Glass** support
- **Android edge-to-edge** enabled by default
- **Precompiled React Native** for iOS (faster builds)

### Sources
- [Expo SDK 54 Changelog](https://expo.dev/changelog/sdk-54)
- [Expo Versions Reference](https://docs.expo.dev/versions/latest)

### Package Versions (Already in package.json)

```json
{
  "expo": "~54.0.0",
  "react-native": "0.81.5",
  "react": "19.1.0",
  "expo-router": "~6.0.17"
}
```

---

## D2: Navigation Framework

### Decision
Use **Expo Router v6** (file-based routing).

### Rationale

1. **Officially recommended by Expo** for new projects
2. **Familiar mental model**: Same file-based routing as Next.js App Router (which we use)
3. **Bundled with SDK 54**: expo-router ~6.0.17 included automatically
4. **Built-in features**: Deep linking, typed routes, offline-first

### What's New in expo-router v6

- **Native tabs** (experimental) - Platform-native system tabs via `expo-router/unstable-native-tabs`
- **Link previews** - Enhanced sharing experience
- **React 19.1 support** - Full compatibility with latest React features

### Implementation Guidance

For the walking skeleton, use **out-of-the-box Expo Router scaffolding**. Do not introduce custom navigation patterns yet.

```
apps/mobile/
├── app/                    # Expo Router routes
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Home/Health check screen (/)
│   └── +not-found.tsx      # 404 handler
```

### Sources
- [Expo Router Introduction](https://docs.expo.dev/router/introduction)
- [Expo Router v6 Reference](https://docs.expo.dev/versions/latest/sdk/router)

---

## D3: Nx Generation Approach

### Decision
Use **`@nx/expo:application` generator** (primary and only approach).

### Status: READY TO USE

Epic 5b installed and verified the @nx/expo plugin. No fallback plan needed.

**Verified generators available:**
- `@nx/expo:application` - Generate Expo application
- `@nx/expo:library` - Generate Expo library
- `@nx/expo:component` - Generate component
- `@nx/expo:init` - Initialize Expo
- `@nx/expo:convert-to-inferred` - Convert to inferred targets

### Command

```bash
pnpm exec nx g @nx/expo:application mobile --directory=apps/mobile
```

### @nx/expo Plugin Configuration (Already in nx.json)

```json
{
  "plugin": "@nx/expo/plugin",
  "options": {
    "startTargetName": "start",
    "buildTargetName": "build",
    "prebuildTargetName": "prebuild",
    "serveTargetName": "serve",
    "installTargetName": "install",
    "exportTargetName": "export",
    "submitTargetName": "submit",
    "runIosTargetName": "run-ios",
    "runAndroidTargetName": "run-android",
    "buildDepsTargetName": "build-deps",
    "watchDepsTargetName": "watch-deps"
  }
}
```

### Post-Generation Checklist Reference
Follow Cogno post-generation checklist after generation. Note: `@nx/expo:application` checklist to be created during Epic 6 implementation.

---

## D4: Metro Bundler Configuration

### Decision
**Use automatic Metro configuration** (SDK 52+ feature).

### Rationale

Since SDK 52, Expo automatically configures Metro for monorepos when using `expo/metro-config`. **No manual configuration required.**

From [Expo Monorepo Documentation](https://docs.expo.dev/guides/monorepos):
> "Since SDK 52, Expo configures Metro automatically for monorepos. You don't have to manually configure Metro when using monorepos if you use `expo/metro-config`."

### What Expo Handles Automatically

- `watchFolders` - Watches all files within the monorepo
- `resolver.nodeModulesPaths` - Resolves packages from workspace node_modules
- `resolver.disableHierarchicalLookup` - Proper monorepo resolution

### Basic metro.config.js (If Generated)

```javascript
// apps/mobile/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

**Note:** If @nx/expo generator includes `withNxMetro` wrapper, it should be compatible with automatic monorepo support. Validate during Story 6.1.

### Optional: Enhanced Module Resolution

For stricter dependency resolution, enable in `app.json`:

```json
{
  "expo": {
    "experiments": {
      "autolinkingModuleResolution": true
    }
  }
}
```

This prevents mismatches between native modules and JavaScript modules.

### Critical Validation

After setup, verify single React/React Native versions:
```bash
pnpm why react
pnpm why react-native
```

Expected: Single version each (19.1.0 and 0.81.5).

### Sources
- [Expo Monorepo Guide](https://docs.expo.dev/guides/monorepos)
- [Customizing Metro](https://docs.expo.dev/guides/customizing-metro)

---

## D5: API Client Approach

### Decision
Use existing **`openapi-fetch`** from `@nx-monorepo/api-client` without modification.

### Rationale
- `openapi-fetch` uses native `fetch` API
- React Native provides global `fetch` implementation
- Zero additional dependencies
- Type safety preserved from OpenAPI spec

### Environment URL Configuration

| Environment | API_URL | Notes |
|-------------|---------|-------|
| iOS Simulator | `http://localhost:4000/api` | Same as web dev |
| Android Emulator | `http://10.0.2.2:4000/api` | Android's localhost alias |
| Physical Device (Dev Build) | Railway staging URL | Must be public HTTPS |
| Production | Production API URL | Future consideration |

### Configuration Pattern

```typescript
// apps/mobile/src/lib/api.ts
import createClient from 'openapi-fetch';
import type { paths } from '@nx-monorepo/api-client';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl
  ?? 'http://localhost:4000/api';

export const apiClient = createClient<paths>({
  baseUrl: API_URL,
});
```

### Validation Required
Test API calls during Story 6.2 to confirm `openapi-fetch` works in React Native without patches.

---

## D6: New Architecture Strategy (NEW)

### Decision
Use **Legacy Architecture** for Epic 6 walking skeleton.

### Rationale

1. **SDK 54 is the last version supporting Legacy Architecture** - SDK 55 will require New Architecture
2. **Walking skeleton priority**: Validate infrastructure first, migrate architecture later
3. **Library compatibility**: Not all libraries support New Architecture yet (e.g., NativeWind with Reanimated v4)

### Future Migration Path

| Milestone | Architecture | Timeline |
|-----------|--------------|----------|
| Epic 6 (Walking Skeleton) | Legacy | Now |
| Feature Development | Legacy | Q1 2026 |
| SDK 55 Upgrade | New Architecture | When SDK 55 stable |

### Key Consideration

From Expo changelog:
> "SDK 54 is the final release to include Legacy Architecture support. In React Native 0.82, it will no longer be possible to opt out of the new architecture."

**Action:** Monitor New Architecture compatibility for key dependencies before SDK 55 upgrade.

---

## Walking Skeleton Approach

### Guiding Principle
**Use out-of-the-box scaffolding. Do not over-engineer navigation or architecture patterns.**

### What to Build
1. Generate Expo app with `@nx/expo:application`
2. Use default Expo Router structure
3. Modify home screen (`app/index.tsx`) to display health checks
4. Add "Ping" button to create health check
5. Configure API client with correct URL
6. Validate cross-platform sync (web creates ping → mobile sees it)

### What NOT to Build
- Custom navigation patterns (tabs, drawers, complex stacks)
- State management libraries (Redux, Zustand, MobX)
- Offline-first/caching patterns
- Platform-specific native modules
- Custom theming system
- New Architecture migration

---

## Post-Implementation Actions

After Epic 6 implementation validates these decisions:

### 1. Update `docs/tech-stack.md`
Verify mobile stack section includes:
- Expo SDK 54.0.x
- React Native 0.81.5
- expo-router ~6.x
- expo-constants

### 2. Update `docs/architecture-decisions.md`
Add Epic 6 section:
- Mobile app generation approach
- Metro automatic configuration
- API client cross-platform validation
- New Architecture strategy

### 3. Create/Update Memory Files
- `docs/memories/mobile-patterns.md` - Mobile-specific patterns (NEW)
- `docs/memories/adopted-patterns.md` - Add mobile test patterns
- `docs/memories/troubleshooting.md` - Add mobile troubleshooting

---

## Open Questions Status

| Question | Status | Resolution |
|----------|--------|------------|
| @nx/expo SDK 54 compatibility? | ✅ RESOLVED | SDK 54 required; plugin installed in 5b.6 |
| Metro config with Nx wrapper compatible? | ✅ RESOLVED | Auto-configured since SDK 52 |
| TypeScript path aliases work in Metro? | ⚠️ VERIFY | Should work via tsconfig.base.json paths; test in 6.1 |
| openapi-fetch works in RN without patches? | ⚠️ VERIFY | Test API calls in Story 6.2 |
| Expo Go vs Dev Build for development? | ⚠️ DECIDE | Recommend Dev Build for monorepo; Expo Go has limitations |

---

## Known Warnings (Expected)

### Jest Version Warning
`expo-doctor` shows Jest 30 vs expected 29.7 warning. This is **expected and intentional** - our project uses Jest 30 as part of Nx 22.x upgrade.

### Detox Peer Dependency Warning
Pre-existing detox warning for `expect@29.x.x` vs Jest 30's `expect@30.2.0`. Will be addressed when mobile E2E testing is configured.

---

## Document History

| Date | Author | Change |
|------|--------|--------|
| 2025-12-05 | AI Agent (SM persona) | Initial creation from architectural walkthrough |
| 2025-12-12 | AI Agent (Architect persona) | **Major revision** after Epic 5b completion: Updated SDK from 53→54, React from 19.0→19.1, expo-router from v4→v6, Nx from 21.6→22.2, simplified Metro config, added New Architecture strategy, updated open questions status |

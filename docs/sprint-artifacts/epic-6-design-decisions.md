# Epic 6: Mobile Walking Skeleton - Design Decisions

**Date:** 2025-12-05
**Decision Makers:** Jørn (Product Owner / Lead Developer)
**Status:** Approved - Ready for Implementation

---

## Purpose

This document captures architectural decisions made during Epic 6 technical contexting. These decisions were validated through research of current Expo/React Native documentation and should be formalized into `docs/architecture.md`, `docs/tech-stack.md`, and memory files after implementation validates them.

**Related Documents:**
- `docs/sprint-artifacts/tech-spec-epic-6.md` - Technical specification
- `docs/epics.md` (Epic 6 section) - User stories and acceptance criteria
- `docs/architecture.md` - To be updated post-implementation
- `docs/tech-stack.md` - To be updated post-implementation

---

## Decision Summary

| Decision | Choice | Confidence | Validation Status |
|----------|--------|------------|-------------------|
| D1: Expo SDK Version | **SDK 53 (Stable)** | High | Researched - Dec 2025 |
| D2: Navigation Framework | **Expo Router** | High | Researched - Expo recommended |
| D3: Nx Generation | **@nx/expo:app** (verify compatibility) | Medium | Needs validation in Story 6.1 |
| D4: Metro Bundler Config | Custom monorepo config | High | Documented from Expo guides |
| D5: API Client | **openapi-fetch** (existing) | High | Expected to work (fetch-based) |

---

## D1: Expo SDK Version

### Decision
Use **Expo SDK 53** (current stable production release).

### Rationale

| SDK | React Native | React | Status | Our Web React |
|-----|--------------|-------|--------|---------------|
| SDK 54 | 0.81 | **19.1.0** | Beta | ❌ Mismatch |
| **SDK 53** | 0.79 | **19.0.0** | **Stable** | ✅ **Exact match** |
| SDK 52 | 0.76 | 18.3.1 | Previous | ❌ Major mismatch |

**Critical constraint:** Our web app uses React 19.0.0. SDK 53's React 19.0.0 is an exact match, avoiding duplicate React errors in monorepo.

### Sources
- [Expo SDK 53 Documentation](https://docs.expo.dev/versions/v53.0.0/)
- [Expo SDK 54 Documentation](https://docs.expo.dev/versions/v54.0.0/)

### Package Versions to Add to tech-stack.md (Post-Implementation)

```json
{
  "expo": "~53.0.0",
  "react-native": "0.79.x",
  "react": "19.0.0",
  "expo-router": "~4.x"
}
```

---

## D2: Navigation Framework

### Decision
Use **Expo Router** (file-based routing).

### Rationale

1. **Officially recommended by Expo** for new projects
2. **Familiar mental model**: Same file-based routing as Next.js App Router (which we use)
3. **Built-in features**: Deep linking, protected routes (`Stack.Protected`), offline-first
4. **Simpler for walking skeleton**: Minimal configuration needed

### Alternative Considered
- **React Navigation (imperative)**: More mature but more boilerplate, different mental model

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
- [Expo Navigation Recommendation](https://docs.expo.dev/develop/file-based-routing)

---

## D3: Nx Generation Approach

### Decision
Use **`@nx/expo:app` generator** as the primary approach.

### Validation Required
Story 6.1 must verify that `@nx/expo` plugin in Nx 21.6.5 supports Expo SDK 53.

### Fallback Plan
If Nx plugin doesn't support SDK 53 yet:
1. Generate with `npx create-expo-app --template blank-typescript`
2. Manually integrate into Nx workspace (create `project.json`, configure targets)
3. Document the manual integration process

### Command (Primary)

```bash
pnpm exec nx g @nx/expo:app mobile --directory=apps/mobile
```

### Post-Generation Checklist Reference
Follow `docs/memories/post-generation-checklist.md` after generation.

---

## D4: Metro Bundler Configuration

### Decision
Configure Metro for monorepo support following Expo's official guidance.

### Required Configuration

```javascript
// apps/mobile/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
```

**Note:** If using `@nx/expo`, the generator may include `withNxMetro` wrapper. Validate that the above configuration is compatible.

### Critical Warning
From Expo documentation:
> "Duplicate React Native versions in a single monorepo are not supported. Duplicate React versions in a single app will cause runtime errors."

**Validation:** Run `pnpm why react-native` and `pnpm why react` after setup to verify single versions.

### Sources
- [Expo Monorepo Guide](https://docs.expo.dev/guides/monorepos)

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
| Physical Device (Expo Go) | Railway staging URL | Must be public HTTPS |
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

---

## Walking Skeleton Approach

### Guiding Principle
**Use out-of-the-box scaffolding. Do not over-engineer navigation or architecture patterns.**

### What to Build
1. Generate Expo app with default Expo Router structure
2. Modify home screen (`app/index.tsx`) to display health checks
3. Add "Ping" button to create health check
4. Configure API client with correct URL
5. Validate cross-platform sync

### What NOT to Build
- Custom navigation patterns (tabs, drawers, complex stacks)
- State management libraries (Redux, Zustand, MobX)
- Offline-first/caching patterns
- Platform-specific native modules
- Custom theming system

---

## Post-Implementation Actions

After Epic 6 implementation validates these decisions:

### 1. Update `docs/tech-stack.md`
Add Mobile Stack section with pinned versions:
- Expo SDK
- React Native
- expo-router
- expo-constants

### 2. Update `docs/architecture.md`
Add Mobile Architecture section:
- Expo Router navigation approach
- Metro bundler monorepo configuration
- API client configuration pattern
- Environment URL handling

### 3. Create/Update Memory Files
- `docs/memories/mobile-patterns.md` - Mobile-specific patterns
- `docs/memories/adopted-patterns.md` - Add mobile test patterns
- `docs/memories/troubleshooting.md` - Add mobile troubleshooting

### 4. Update Epic 6 Stories
Incorporate validated patterns into story acceptance criteria.

---

## Open Questions (To Resolve During Implementation)

| Question | Resolution Path | Story |
|----------|-----------------|-------|
| Nx @nx/expo SDK 53 compatibility? | Test during generation | 6.1 |
| Metro config with Nx wrapper compatible? | Validate during setup | 6.1 |
| TypeScript path aliases work in Metro? | Test import resolution | 6.2 |
| openapi-fetch works in RN without patches? | Test API calls | 6.2 |

---

## Document History

| Date | Author | Change |
|------|--------|--------|
| 2025-12-05 | AI Agent (SM persona) | Initial creation from architectural walkthrough |



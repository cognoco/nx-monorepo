# Epic Technical Specification: Mobile Walking Skeleton

Date: 2025-12-05
Author: Jørn
Epic ID: 6
Status: Draft (Contexted)

---

> **Related Document:** See `docs/sprint-artifacts/epic-6-design-decisions.md` for detailed architectural decisions and version rationale made during technical contexting.

## Overview

Epic 6 delivers the mobile application foundation that proves cross-platform code sharing works as designed. By implementing a React Native/Expo mobile app that shares the API client, type definitions, and schemas with the web application, this epic validates the core architectural promise: business logic implemented once can execute identically across all platforms.

The mobile walking skeleton mirrors the web health check experience—fetching health check records from the database and creating new ones via the "Ping" button—demonstrating that the shared infrastructure packages (`@nx-monorepo/api-client`, `@nx-monorepo/schemas`) work seamlessly in a mobile context without modification.

This epic is critical for the template's value proposition: proving that a single human orchestrator directing AI coding agents can build true cross-platform applications with shared business logic, not just separate mobile and web codebases that happen to live in the same repository.

## Objectives and Scope

### In Scope

- **Mobile Application Generation**: Create Expo mobile app using Nx generators (`@nx/expo:app`)
- **API Client Integration**: Configure `@nx-monorepo/api-client` for React Native environment
- **Health Check Screen**: Implement screen displaying health checks with "Ping" functionality
- **Cross-Platform Validation**: Prove data sync between web and mobile (same database, same API)
- **Mobile Development Documentation**: Setup guides for simulators, emulators, and local development
- **Nx Integration**: Ensure `nx run mobile:lint`, `nx run mobile:test`, `nx run mobile:start` work correctly

### Out of Scope

- **Authentication UI**: No login/signup screens (deferred to Epic 9 - Phase 2)
- **Push Notifications**: Infrastructure not required for walking skeleton
- **Offline Support**: No offline-first or caching patterns (Phase 3+)
- **App Store Deployment**: No production mobile builds (PoC scope only)
- **Platform-Specific Features**: No iOS/Android native modules
- **State Management Libraries**: No Redux/Zustand (useState sufficient for walking skeleton)

### Success Criteria

1. Mobile app launches on iOS simulator and Android emulator
2. Health check list displays data from shared Supabase database
3. "Ping" button creates new health check visible on both web and mobile
4. TypeScript autocomplete works for API endpoints in mobile codebase
5. All Nx targets pass: `lint`, `test`, `start`
6. New developer can follow docs to run mobile app in <15 minutes

## System Architecture Alignment

### Dependency Flow Integration

The mobile app integrates into the existing dependency graph:

```
apps/web ────────┐
                 ├──► packages/api-client ──► packages/schemas
apps/mobile ─────┘                                   ↑
                                                     │
apps/server ──► packages/database ───────────────────┘
                      │
                      └──► packages/supabase-client
```

### Architecture Principles Applied

| Principle | Application to Mobile |
|-----------|----------------------|
| **Type Safety End-to-End** | Mobile uses same `openapi-fetch` client with generated types |
| **Unidirectional Dependencies** | Mobile imports from packages, never from `apps/web` |
| **API Server as Security Boundary** | Mobile calls Express API, not direct database access |
| **Shared Schema Source of Truth** | Zod schemas in `@nx-monorepo/schemas` validate mobile requests |

### Mobile-Specific Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Expo SDK 53 (Stable)** | Production-ready; React 19.0.0 matches web exactly (see `epic-6-design-decisions.md`) |
| **Expo Router (File-Based)** | Officially recommended by Expo; familiar Next.js-like mental model |
| **Expo Managed Workflow** | Simpler setup, no native code required for walking skeleton |
| **Same API Client** | Validates cross-platform type safety (PR FR20) |
| **No Auth in Epic 6** | Walking skeleton validates infrastructure, not business logic |
| **Staging API URL** | Mobile development requires public HTTPS endpoint (Railway) |
| **Out-of-Box Scaffolding** | Walking skeleton uses default patterns; no custom navigation yet |

## Detailed Design

### Services and Modules

| Module | Location | Responsibility |
|--------|----------|----------------|
| **Mobile App** | `apps/mobile/` | Expo application entry point, navigation, screens |
| **Health Check Screen** | `apps/mobile/src/screens/HealthScreen.tsx` | Display health checks, handle ping button |
| **API Configuration** | `apps/mobile/src/lib/api.ts` | Configure `openapi-fetch` client for mobile |
| **Environment Config** | `apps/mobile/app.config.ts` | Expo config with environment variables |

### Project Structure

> **Decision:** Using Expo Router (file-based routing). See `epic-6-design-decisions.md`.

```
apps/mobile/
├── app/                        # Expo Router routes (file-based)
│   ├── _layout.tsx             # Root layout (providers, navigation config)
│   ├── index.tsx               # Home/Health check screen (/)
│   └── +not-found.tsx          # 404 handler
├── src/
│   ├── components/             # Reusable components
│   │   └── HealthCheckList.tsx # Health check list component
│   └── lib/
│       └── api.ts              # API client configuration
├── app.json                    # Expo configuration
├── app.config.ts               # Dynamic Expo config
├── babel.config.js             # Babel configuration
├── metro.config.js             # Metro bundler config (monorepo support)
├── tsconfig.json               # TypeScript configuration
├── jest.config.ts              # Jest configuration
└── project.json                # Nx project configuration
```

**Note:** For the walking skeleton, use the out-of-the-box Expo Router structure. Do not introduce custom navigation patterns (tabs, drawers, complex stacks) yet.

### Data Models and Contracts

Mobile reuses existing schemas from `@nx-monorepo/schemas`:

```typescript
// packages/schemas/src/lib/health.schema.ts (existing)
import { z } from 'zod';

export const HealthCheckSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  timestamp: z.string().datetime(),
});

export const CreateHealthCheckSchema = z.object({
  message: z.string().min(1).max(500),
});

export type HealthCheck = z.infer<typeof HealthCheckSchema>;
export type CreateHealthCheck = z.infer<typeof CreateHealthCheckSchema>;
```

### APIs and Interfaces

Mobile consumes existing REST+OpenAPI endpoints:

| Method | Path | Request | Response | Mobile Usage |
|--------|------|---------|----------|--------------|
| `GET` | `/api/health` | - | `{ data: HealthCheck[] }` | Fetch health check list |
| `POST` | `/api/health` | `CreateHealthCheck` | `{ data: HealthCheck }` | Create new health check (Ping) |

**API Client Configuration (Mobile-Specific):**

```typescript
// apps/mobile/src/lib/api.ts
import createClient from 'openapi-fetch';
import type { paths } from '@nx-monorepo/api-client';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl 
  ?? 'https://your-api.railway.app/api';

export const apiClient = createClient<paths>({
  baseUrl: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Workflows and Sequencing

**Health Check Flow (Mobile):**

```
1. User opens mobile app
   ↓
2. HealthScreen mounts
   ↓
3. useEffect triggers: apiClient.GET('/api/health')
   ↓
4. Express API → Prisma → Supabase PostgreSQL
   ↓
5. JSON response returns to mobile
   ↓
6. State updates, FlatList renders health checks
   ↓
7. User taps "Ping" button
   ↓
8. apiClient.POST('/api/health', { body: { message: 'Mobile ping' } })
   ↓
9. New record created in database
   ↓
10. Refetch list, new record appears
```

**Cross-Platform Sync Flow:**

```
Web App                    Mobile App
   │                           │
   │ POST /api/health          │
   ├─────────────────────────► │
   │                           │
   │      ← 201 Created        │
   │                           │ (User refreshes)
   │                           │ GET /api/health
   │                           ├──►
   │                           │
   │                           │ ← Returns all records
   │                           │   (including web-created)
   │                           │
   │ (User refreshes)          │
   │ GET /api/health           │
   ├─────────────────────────► │
   │                           │
   │ ← Returns all records     │
   │   (including mobile-created)
```

## Non-Functional Requirements

### Performance

| Metric | Target | Rationale |
|--------|--------|-----------|
| **App startup** | <3 seconds (dev mode) | Acceptable for Expo Go development |
| **API response display** | <500ms | Same target as web (same API) |
| **List rendering** | 60 FPS scroll | FlatList with proper key extraction |

**Note:** Production performance targets deferred to Phase 2 (EAS Build optimization).

### Security

| Aspect | Implementation |
|--------|----------------|
| **No Auth in Epic 6** | Walking skeleton doesn't require authentication |
| **HTTPS Required** | Mobile requires valid SSL (Railway provides) |
| **No Sensitive Storage** | No tokens to store yet (auth in Epic 9) |
| **CORS Configuration** | Server allows Expo origins (already configured) |

### Reliability/Availability

| Aspect | Implementation |
|--------|----------------|
| **Error States** | Display user-friendly error messages on API failure |
| **Loading States** | Show ActivityIndicator during API calls |
| **Network Handling** | Graceful degradation message if no connectivity |
| **Retry Pattern** | Manual refresh via pull-to-refresh |

### Observability

| Aspect | Implementation |
|--------|----------------|
| **Console Logging** | `console.log` for development debugging |
| **Sentry Integration** | Deferred to Epic 3 completion (mobile Sentry in Epic 6 stretch goal) |
| **Error Boundaries** | React error boundary for crash capture |

## Dependencies and Integrations

### Package Dependencies

> **Note:** See `docs/sprint-artifacts/epic-6-design-decisions.md` for detailed rationale on version choices.

**Core Expo/React Native:**

```json
{
  "expo": "~53.0.0",
  "react-native": "~0.79.0",
  "react": "19.0.0",
  "expo-router": "~4.0.0"
}
```

**Shared Packages (Workspace):**

```json
{
  "@nx-monorepo/api-client": "workspace:*",
  "@nx-monorepo/schemas": "workspace:*"
}
```

**Type-Safe HTTP Client:**

```json
{
  "openapi-fetch": "^0.14.0"
}
```

### External Service Dependencies

| Service | Purpose | Endpoint |
|---------|---------|----------|
| **Express API** | Data operations | `https://your-api.railway.app/api` (staging) or `http://localhost:4000/api` (dev) |
| **Supabase** | Database (via API) | Indirect (through Express) |

### Development Tool Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| **Expo Go** | Latest | Development testing on physical devices |
| **iOS Simulator** | Xcode 15+ | iOS development testing |
| **Android Emulator** | API 34+ | Android development testing |
| **Nx** | 21.6.x | Monorepo orchestration |

### Mobile-Specific Considerations

**Metro Bundler Configuration:**

```javascript
// apps/mobile/metro.config.js
const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const workspaceRoot = path.resolve(__dirname, '../..');

// Enable monorepo support
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = withNxMetro(config, {
  debug: false,
  extensions: [],
  watchFolders: [],
});
```

**API URL for Different Environments:**

| Environment | API URL | How to Configure |
|-------------|---------|------------------|
| **Local (Simulator)** | `http://localhost:4000/api` | Default for iOS Simulator |
| **Local (Android Emulator)** | `http://10.0.2.2:4000/api` | Android special localhost alias |
| **Staging** | `https://your-api.railway.app/api` | Environment variable |
| **Expo Go (Physical Device)** | Railway staging URL | Must be public HTTPS |

## Acceptance Criteria (Authoritative)

### AC-6.1: Generate Expo Mobile Application

1. **Given** the Nx workspace exists
   **When** I run `pnpm exec nx g @nx/expo:app mobile --directory=apps/mobile`
   **Then** the app is created with correct Nx project structure

2. **Given** the mobile app is generated
   **When** I run `pnpm exec nx run mobile:start`
   **Then** Expo dev server launches and QR code is displayed

3. **Given** the mobile app is generated
   **When** I run `pnpm exec nx run mobile:lint`
   **Then** linting passes with no errors

4. **Given** the mobile app is generated
   **When** I run `pnpm exec nx run mobile:test`
   **Then** default tests pass

### AC-6.2: Configure API Client for Mobile

5. **Given** mobile app exists
   **When** I import `@nx-monorepo/api-client`
   **Then** TypeScript resolves the import without errors

6. **Given** API client is imported
   **When** I configure base URL for mobile environment
   **Then** client correctly points to local dev server or staging

7. **Given** API client is configured
   **When** I use `apiClient.GET('/api/health')`
   **Then** TypeScript provides autocomplete for path, params, and response types

### AC-6.3: Implement Mobile Health Check Screen

8. **Given** API client is working
   **When** mobile app opens to health screen
   **Then** health check list is fetched and displayed

9. **Given** health check list is displayed
   **When** I tap the "Ping" button
   **Then** new health check is created and appears in list

10. **Given** multiple health checks exist
    **When** I scroll the list
    **Then** scrolling is smooth (60 FPS) using FlatList

11. **Given** API call is in progress
    **When** user sees the screen
    **Then** loading indicator is displayed

12. **Given** API call fails (server down)
    **When** user sees the screen
    **Then** error message is displayed clearly

### AC-6.4: Validate Cross-Platform Sync

13. **Given** health check is created on web
    **When** I refresh mobile app
    **Then** the web-created record appears in mobile list

14. **Given** health check is created on mobile
    **When** I refresh web app
    **Then** the mobile-created record appears in web list

### AC-6.5: Document Mobile Development Setup

15. **Given** documentation is created
    **When** a new developer follows the guide
    **Then** they can run mobile app on iOS Simulator in <15 minutes

16. **Given** documentation is created
    **When** a new developer follows the guide
    **Then** they can run mobile app on Android Emulator

17. **Given** documentation exists
    **When** developer wants to test against staging API
    **Then** instructions explain how to configure API URL

## Traceability Mapping

| AC | Spec Section | Component/API | Test Approach |
|----|--------------|---------------|---------------|
| AC-6.1 (1-4) | Services and Modules | `apps/mobile/*` | Nx target execution verification |
| AC-6.2 (5-7) | APIs and Interfaces | `apps/mobile/src/lib/api.ts` | TypeScript compilation + API call test |
| AC-6.3 (8-12) | Workflows and Sequencing | `HealthScreen.tsx` | Component test + manual E2E |
| AC-6.4 (13-14) | Cross-Platform Sync Flow | Database sync | Manual validation with documentation |
| AC-6.5 (15-17) | Dependencies | `docs/mobile-setup.md` | Documentation review + test run |

### PRD Functional Requirements Coverage

| FR | Requirement | Story Coverage |
|----|-------------|----------------|
| **FR20** | Mobile shares API client, types, auth patterns | Stories 6.2, 6.3 |
| **FR21** | Mobile walking skeleton mirrors web | Stories 6.3, 6.4 |
| **FR22** | Mobile development documentation | Story 6.5 |

## Risks, Assumptions, Open Questions

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **R1**: Metro bundler issues with monorepo | High | Medium | Follow Nx/Expo docs; test early |
| **R2**: TypeScript path alias issues in RN | Medium | Medium | Configure Metro resolver correctly |
| **R3**: API client incompatibility with RN | High | Low | openapi-fetch uses native fetch (RN compatible) |
| **R4**: Expo SDK version conflicts | Medium | Medium | Pin versions in tech-stack.md |

### Assumptions

| Assumption | Validation Plan |
|------------|-----------------|
| **A1**: `openapi-fetch` works in React Native | Story 6.2 validates during API configuration |
| **A2**: Expo SDK 53 supports workspace dependencies | Story 6.1 validates during app generation |
| **A3**: Railway staging API is accessible from Expo Go | Story 6.3 validates during implementation |
| **A4**: FlatList provides adequate performance | Story 6.3 validates during list implementation |
| **A5**: React 19.0.0 (matching web) works with SDK 53 | Story 6.1 validates during generation |

### Open Questions

| Question | Owner | Resolution Path |
|----------|-------|-----------------|
| **Q1**: ~~Should we use Expo Router or traditional navigation?~~ | Dev | ✅ **RESOLVED**: Use Expo Router (see `epic-6-design-decisions.md`) |
| **Q2**: How to handle API URL in EAS builds? | Dev | Document in Story 6.5 (app.config.ts extras) |
| **Q3**: Should Epic 6 include Sentry mobile integration? | PM | Deferred to Epic 3 extension (stretch goal) |
| **Q4**: Does @nx/expo support SDK 53? | Dev | Validate in Story 6.1; fallback to manual integration if needed |

## Test Strategy Summary

### Unit Tests (Jest)

| Component | Test Focus | Location |
|-----------|------------|----------|
| `HealthCheckList` | Rendering, item display | `apps/mobile/src/components/HealthCheckList.spec.tsx` |
| `api.ts` | Client configuration | `apps/mobile/src/lib/api.spec.ts` |

### Integration Tests

| Test | Coverage |
|------|----------|
| API client → server | Call real API, verify response typing |
| Screen data flow | Mock API, verify state updates |

### E2E Tests (Manual for Epic 6)

| Test Case | Validation Method |
|-----------|-------------------|
| App launches on iOS Simulator | Manual observation |
| App launches on Android Emulator | Manual observation |
| Health check list displays | Manual observation |
| Ping creates new record | Manual observation + database verification |
| Cross-platform sync | Create on web, verify on mobile (and vice versa) |

### Test Environment

| Environment | API Target | Database |
|-------------|------------|----------|
| **Local Dev** | `http://localhost:4000/api` | Supabase DEV |
| **Staging** | Railway URL | Supabase TEST |

---

**Document Status:** Draft
**Ready for:** Story creation workflow


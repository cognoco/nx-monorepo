# Story 6.2: Configure API Client for Mobile

Status: ready-for-dev

## Story

As a mobile developer,
I want the API client working in the mobile app,
so that I can make type-safe API calls from mobile.

## Acceptance Criteria

1. **Given** mobile app is generated (Story 6.1 complete)  
   **When** I import `@nx-monorepo/api-client`  
   **Then** TypeScript resolves the import without errors

2. **Given** API client is imported  
   **When** I configure base URL for mobile environment  
   **Then** client correctly points to local dev server or staging

3. **Given** API client is configured  
   **When** I use `apiClient.GET('/api/health')`  
   **Then** TypeScript provides autocomplete for path, params, and response types

4. **Given** API client is configured for iOS Simulator  
   **When** I make API calls  
   **Then** calls reach `http://localhost:4000/api` successfully

5. **Given** API client is configured for Android Emulator  
   **When** I make API calls  
   **Then** calls reach `http://10.0.2.2:4000/api` (Android localhost alias)

6. **Given** networking configuration is documented  
   **When** a developer reads the docs  
   **Then** they understand localhost differences per platform

## Tasks / Subtasks

- [ ] **Task 1: Verify Package Import Resolution** (AC: 1)
  - [ ] Import `@nx-monorepo/api-client` in a test file
  - [ ] Verify TypeScript path alias resolves correctly
  - [ ] Verify Metro bundler resolves the import at runtime

- [ ] **Task 2: Create API Client Configuration** (AC: 2, 3)
  - [ ] Create `apps/mobile/src/lib/api.ts`:
    ```typescript
    import createClient from 'openapi-fetch';
    import type { paths } from '@nx-monorepo/api-client';
    import Constants from 'expo-constants';

    const API_URL = Constants.expoConfig?.extra?.apiUrl 
      ?? 'http://localhost:4000/api';

    export const apiClient = createClient<paths>({
      baseUrl: API_URL,
    });
    ```
  - [ ] Install `expo-constants` if not already present

- [ ] **Task 3: Configure Environment Variables** (AC: 2, 4, 5)
  - [ ] Update `app.config.ts` with environment-aware API URL:
    ```typescript
    export default {
      expo: {
        // ... other config
        extra: {
          apiUrl: process.env.API_URL ?? 'http://localhost:4000/api',
        },
      },
    };
    ```
  - [ ] Document platform-specific URL handling

- [ ] **Task 4: Validate Type Safety** (AC: 3)
  - [ ] Create a simple test component that uses `apiClient.GET`
  - [ ] Verify TypeScript autocomplete works for:
    - Path (`'/api/health'`)
    - Response type (`HealthCheck[]`)
  - [ ] Verify compilation passes with strict TypeScript

- [ ] **Task 5: Test API Connectivity** (AC: 4, 5)
  - [ ] Start local Express server (`pnpm exec nx run server:serve`)
  - [ ] Test API call from iOS Simulator
  - [ ] Test API call from Android Emulator (using 10.0.2.2)
  - [ ] Document any CORS or network issues encountered

- [ ] **Task 6: Document Networking Configuration** (AC: 6)
  - [ ] Add networking notes to `apps/mobile/README.md` or dev notes
  - [ ] Document iOS Simulator → localhost:4000
  - [ ] Document Android Emulator → 10.0.2.2:4000
  - [ ] Document physical device → staging URL requirement

- [ ] **Task 7: Write Unit Test for API Configuration** (AC: 1, 2, 3)
  - [ ] Create `apps/mobile/src/lib/api.spec.ts`
  - [ ] Test that client is created with correct baseUrl
  - [ ] Mock `expo-constants` for test isolation

## Dev Notes

### Key Design Decisions

From `docs/sprint-artifacts/epic-6-design-decisions.md` (D5):

| Decision | Choice | Notes |
|----------|--------|-------|
| **API Client** | openapi-fetch | Uses native fetch, RN compatible |
| **Base URL Config** | expo-constants | Dynamic via app.config.ts |
| **Type Source** | @nx-monorepo/api-client | Generated from OpenAPI spec |

### Environment URL Configuration

| Environment | API_URL | Notes |
|-------------|---------|-------|
| iOS Simulator | `http://localhost:4000/api` | Same as web dev |
| Android Emulator | `http://10.0.2.2:4000/api` | Android's localhost alias |
| Physical Device (Expo Go) | Railway staging URL | Must be public HTTPS |
| Production | Production API URL | Future consideration |

### API Client Pattern (From Web)

The mobile API client should mirror the web pattern:

```typescript
// Web pattern (apps/web/src/lib/api.ts)
import createClient from 'openapi-fetch';
import type { paths } from '@nx-monorepo/api-client';

export const apiClient = createClient<paths>({
  baseUrl: '/api', // Relative for web
});
```

### Potential Issues

| Issue | Mitigation |
|-------|------------|
| Metro can't resolve workspace package | Check Metro nodeModulesPaths config |
| TypeScript path alias not working | Verify tsconfig.json extends base |
| Android can't reach localhost | Use 10.0.2.2 alias |

### Testing Standards

- Test file: `apps/mobile/src/lib/api.spec.ts`
- Mock external dependencies (expo-constants)
- Verify type exports work correctly

### References

- [Source: docs/sprint-artifacts/epic-6-design-decisions.md#D5]
- [Source: docs/sprint-artifacts/tech-spec-epic-6.md#AC-6.2]
- [Source: docs/epics.md#Story-6.2]
- [Source: packages/api-client/src/index.ts]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/6-2-configure-api-client-for-mobile.context.xml` (generated 2025-12-05)

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


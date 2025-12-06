# Story 6.3: Implement Mobile Health Check Screen

Status: ready-for-dev

## Story

As a mobile developer,
I want a health check screen mirroring the web experience,
so that I can validate end-to-end mobile connectivity.

## Acceptance Criteria

1. **Given** API client is configured (Story 6.2 complete)  
   **When** mobile app opens to health screen  
   **Then** health check list is fetched and displayed

2. **Given** health check list is displayed  
   **When** I tap the "Ping" button  
   **Then** new health check is created and appears in list

3. **Given** multiple health checks exist  
   **When** I scroll the list  
   **Then** scrolling is smooth (60 FPS) using FlatList

4. **Given** API call is in progress  
   **When** user sees the screen  
   **Then** loading indicator is displayed (ActivityIndicator)

5. **Given** API call fails (server down)  
   **When** user sees the screen  
   **Then** error message is displayed clearly

6. **Given** screen works on iOS simulator  
   **When** I test the health check flow  
   **Then** all functionality works as expected

7. **Given** screen works on Android emulator  
   **When** I test the health check flow  
   **Then** all functionality works as expected

8. **Given** data created on mobile  
   **When** I check the web app  
   **Then** the mobile-created record appears (cross-platform sync)

## Tasks / Subtasks

- [ ] **Task 1: Implement Home Screen with Health Checks** (AC: 1, 3)
  - [ ] Modify `apps/mobile/app/index.tsx` to be health check screen
  - [ ] Use FlatList for rendering health check items
  - [ ] Implement proper key extraction for list items
  - [ ] Style with basic React Native components

- [ ] **Task 2: Implement Data Fetching** (AC: 1, 4)
  - [ ] Use `useEffect` to fetch health checks on mount
  - [ ] Call `apiClient.GET('/api/health')`
  - [ ] Store results in component state
  - [ ] Display ActivityIndicator while loading

- [ ] **Task 3: Implement Ping Button** (AC: 2)
  - [ ] Add "Ping" button component
  - [ ] On press, call `apiClient.POST('/api/health', { body: { message: 'Mobile ping' } })`
  - [ ] Refetch list after successful ping
  - [ ] Show loading state on button during submission

- [ ] **Task 4: Implement Error Handling** (AC: 5)
  - [ ] Catch API errors in fetch and ping operations
  - [ ] Display user-friendly error message
  - [ ] Allow retry via pull-to-refresh or button

- [ ] **Task 5: Create Health Check List Component** (AC: 1, 3)
  - [ ] Create `apps/mobile/src/components/HealthCheckList.tsx`
  - [ ] Render individual health check items (id, message, timestamp)
  - [ ] Format timestamp for mobile display
  - [ ] Ensure 60 FPS scroll performance

- [ ] **Task 6: Test on iOS Simulator** (AC: 6)
  - [ ] Start server: `pnpm exec nx run server:serve`
  - [ ] Start mobile: `pnpm exec nx run mobile:start`
  - [ ] Open in iOS Simulator
  - [ ] Test all functionality
  - [ ] Document any platform-specific issues

- [ ] **Task 7: Test on Android Emulator** (AC: 7)
  - [ ] Ensure API URL uses 10.0.2.2 for Android
  - [ ] Open in Android Emulator
  - [ ] Test all functionality
  - [ ] Document any platform-specific issues

- [ ] **Task 8: Validate Cross-Platform Sync** (AC: 8)
  - [ ] Create health check on mobile
  - [ ] Refresh web app
  - [ ] Verify record appears
  - [ ] Document observation

- [ ] **Task 9: Write Component Tests** (AC: 1, 2, 3, 4, 5)
  - [ ] Create `apps/mobile/src/components/HealthCheckList.spec.tsx`
  - [ ] Test rendering with mock data
  - [ ] Test loading state
  - [ ] Test error state
  - [ ] Mock API client for isolation

## Dev Notes

### Walking Skeleton Principle

**Use minimal, functional components.** Do NOT:
- Add complex state management
- Add caching/offline support
- Add custom animations
- Over-engineer UI

### Implementation Pattern

Mirror the web health check component pattern:

```typescript
// apps/mobile/app/index.tsx
import { useEffect, useState } from 'react';
import { View, FlatList, Button, ActivityIndicator, Text } from 'react-native';
import { apiClient } from '../src/lib/api';

export default function HealthScreen() {
  const [healthChecks, setHealthChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthChecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await apiClient.GET('/api/health');
      if (error) throw new Error('Failed to fetch');
      setHealthChecks(data?.data ?? []);
    } catch (e) {
      setError('Failed to load health checks');
    } finally {
      setLoading(false);
    }
  };

  const handlePing = async () => {
    try {
      await apiClient.POST('/api/health', { 
        body: { message: 'Mobile ping' } 
      });
      fetchHealthChecks(); // Refetch after ping
    } catch (e) {
      setError('Failed to create ping');
    }
  };

  useEffect(() => {
    fetchHealthChecks();
  }, []);

  // ... render logic
}
```

### API Endpoints Used

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | `/api/health` | - | `{ data: HealthCheck[] }` |
| POST | `/api/health` | `{ message: string }` | `{ data: HealthCheck }` |

### React Native Components to Use

| Component | Purpose |
|-----------|---------|
| `FlatList` | Efficient scrolling list |
| `ActivityIndicator` | Loading state |
| `Button` / `Pressable` | Ping action |
| `Text` | Display text |
| `View` | Layout container |

### Testing Standards

- Co-locate tests: `HealthCheckList.spec.tsx`
- Mock API client for isolation
- Test loading, success, and error states
- Follow `docs/memories/testing-reference.md`

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-6.md#AC-6.3]
- [Source: docs/sprint-artifacts/tech-spec-epic-6.md#Workflows-and-Sequencing]
- [Source: docs/epics.md#Story-6.3]
- [Source: apps/web/src/components/] (web health check pattern)

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/6-3-implement-mobile-health-check-screen.context.xml` (generated 2025-12-05)

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


# Story 3.4: Verify Observability End-to-End

Status: drafted

## Story

As an operations team member,
I want to verify that error tracking works across all surfaces,
so that I have confidence in our observability infrastructure.

## Acceptance Criteria

1. **AC1**: Given Sentry is integrated in server and web, when I trigger intentional errors in each application, then errors appear in Sentry dashboard within 1 minute
2. **AC2**: Errors include: stack trace, environment, user context (if available)
3. **AC3**: Performance transactions show in dashboard for both client and server
4. **AC4**: Server errors triggered from client requests correlate correctly
5. **AC5**: Documentation exists for observability setup and dashboards
6. **AC6**: Test scenarios are documented and repeatable

## Tasks / Subtasks

- [ ] Task 1: Create Test Error Endpoints (AC: #1)
  - [ ] 1.1: Create `GET /api/test/error` in server that throws Error
  - [ ] 1.2: Create `GET /api/test/unhandled` in server for unhandled promise rejection
  - [ ] 1.3: These endpoints should be development-only or protected

- [ ] Task 2: Create Test Error Components (AC: #1)
  - [ ] 2.1: Create test page `apps/web/src/app/test/error/page.tsx`
  - [ ] 2.2: Add button that triggers client-side error
  - [ ] 2.3: Add button that triggers API error (via fetch to test endpoint)
  - [ ] 2.4: Mark page as development-only

- [ ] Task 3: Execute Server Error Tests (AC: #1, #2, #3)
  - [ ] 3.1: Start server with valid SENTRY_DSN_SERVER
  - [ ] 3.2: Call `GET /api/test/error`
  - [ ] 3.3: Verify error appears in Sentry within 60 seconds
  - [ ] 3.4: Verify stack trace is readable (source maps working)
  - [ ] 3.5: Verify environment tag is correct
  - [ ] 3.6: Verify performance transaction for the request

- [ ] Task 4: Execute Client Error Tests (AC: #1, #2, #3)
  - [ ] 4.1: Start web app with valid NEXT_PUBLIC_SENTRY_DSN
  - [ ] 4.2: Navigate to test error page
  - [ ] 4.3: Trigger client-side error
  - [ ] 4.4: Verify error appears in Sentry within 60 seconds
  - [ ] 4.5: Verify stack trace is readable
  - [ ] 4.6: Verify browser context (URL, user agent) captured

- [ ] Task 5: Test Cross-Service Correlation (AC: #4)
  - [ ] 5.1: Trigger API error from web client
  - [ ] 5.2: Verify both client and server events appear
  - [ ] 5.3: Check for trace correlation between events
  - [ ] 5.4: Document correlation ID propagation (if implemented)

- [ ] Task 6: Verify Performance Tracking (AC: #3)
  - [ ] 6.1: Navigate to multiple pages in web app
  - [ ] 6.2: Verify page load transactions in Sentry Performance
  - [ ] 6.3: Call multiple API endpoints
  - [ ] 6.4: Verify server transactions in Sentry Performance
  - [ ] 6.5: Check Core Web Vitals metrics appear

- [ ] Task 7: Create Observability Documentation (AC: #5)
  - [ ] 7.1: Create `docs/observability.md`
  - [ ] 7.2: Document Sentry project setup summary
  - [ ] 7.3: Document dashboard navigation guide
  - [ ] 7.4: Document how to filter by environment
  - [ ] 7.5: Document alerting configuration (future enhancement notes)
  - [ ] 7.6: Include screenshots or screen recording references

- [ ] Task 8: Document Test Scenarios (AC: #6)
  - [ ] 8.1: Create observability test checklist in docs
  - [ ] 8.2: Document each test scenario with expected outcome
  - [ ] 8.3: Include troubleshooting for common verification failures
  - [ ] 8.4: Add to `docs/memories/troubleshooting.md` if applicable

- [ ] Task 9: Cleanup Test Artifacts
  - [ ] 9.1: Ensure test endpoints are not exposed in production
  - [ ] 9.2: Add environment checks or remove test routes
  - [ ] 9.3: Update `.env.example` with test configuration notes

## Dev Notes

### Architecture Context

- **Verification Story**: This is primarily manual testing and documentation
- **No New Code**: Validates existing integrations from 3.2 and 3.3
- **Documentation Focus**: Creates operational reference material

### Project Structure Notes

- Test endpoints: `apps/server/src/routes/test.ts` (dev only)
- Test page: `apps/web/src/app/test/error/page.tsx` (dev only)
- Documentation: `docs/observability.md`

### Verification Checklist

| Test | Server | Web | Expected |
|------|--------|-----|----------|
| Error capture | ✓ | ✓ | Appears in Issues tab |
| Stack trace | ✓ | ✓ | Readable with source maps |
| Environment | ✓ | ✓ | Tagged correctly |
| Performance | ✓ | ✓ | Transactions visible |
| Correlation | ✓ | ✓ | Trace ID connects events |

### Environment Requirements

- Valid Sentry DSN credentials configured
- Both server and web running locally or in staging
- Access to Sentry dashboard for verification

### Test Endpoint Pattern

```typescript
// apps/server/src/routes/test.ts (development only)
import { Router } from 'express';

export const testRouter = Router();

if (process.env.NODE_ENV !== 'production') {
  testRouter.get('/error', (req, res) => {
    throw new Error('Test error for Sentry verification');
  });
}
```

### Dependencies

- **Requires**: Stories 3.1, 3.2, 3.3 complete
- **Blocking**: None (validation story)

### References

- [Source: docs/epics.md#Story-3.4-Verify-Observability-End-to-End]
- [Source: docs/architecture.md#Integration-Architecture]
- [Sentry Testing Guide](https://docs.sentry.io/product/sentry-basics/integrate-frontend/verify/)

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

claude-opus-4-5-20251101

### Debug Log References

### Completion Notes List

### File List


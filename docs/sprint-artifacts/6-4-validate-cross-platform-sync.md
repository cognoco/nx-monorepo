# Story 6.4: Validate Cross-Platform Sync

Status: ready-for-dev

## Story

As a product owner,
I want to verify data syncs between web and mobile,
so that I have confidence in cross-platform functionality.

## Acceptance Criteria

1. **Given** both web and mobile apps are running  
   **When** I create a health check on web  
   **Then** refreshing mobile shows the new record

2. **Given** both web and mobile apps are running  
   **When** I create a health check on mobile  
   **Then** refreshing web shows the new record

3. **Given** validation is performed  
   **When** I document the results  
   **Then** documentation includes screenshots or recording

4. **Given** sync issues are encountered  
   **When** I document findings  
   **Then** known limitations are clearly documented

5. **Given** cross-platform sync works  
   **When** I check the database  
   **Then** both web and mobile records exist with correct source identifiers

## Tasks / Subtasks

- [ ] **Task 1: Setup Validation Environment** (AC: 1, 2)
  - [ ] Start Express server: `pnpm exec nx run server:serve`
  - [ ] Start web app: `pnpm exec nx run web:dev`
  - [ ] Start mobile app: `pnpm exec nx run mobile:start`
  - [ ] Open iOS Simulator and/or Android Emulator
  - [ ] Open web app in browser

- [ ] **Task 2: Test Web → Mobile Sync** (AC: 1)
  - [ ] In web app, click "Ping" to create new health check
  - [ ] Note the message/timestamp of created record
  - [ ] In mobile app, pull to refresh or restart
  - [ ] Verify the web-created record appears in mobile list
  - [ ] Take screenshot of both showing same data

- [ ] **Task 3: Test Mobile → Web Sync** (AC: 2)
  - [ ] In mobile app, tap "Ping" to create new health check
  - [ ] Note the message/timestamp of created record
  - [ ] In web app, refresh the page
  - [ ] Verify the mobile-created record appears in web list
  - [ ] Take screenshot of both showing same data

- [ ] **Task 4: Verify Database Consistency** (AC: 5)
  - [ ] Query database directly (Supabase dashboard or Prisma Studio)
  - [ ] Verify all records from both web and mobile exist
  - [ ] Note any differences in record format

- [ ] **Task 5: Document Sync Behavior** (AC: 3, 4)
  - [ ] Create validation report with:
    - Screenshots of web and mobile showing synced data
    - Latency observations (how long until sync visible)
    - Any refresh requirements noted
  - [ ] Document in dev notes or separate validation doc

- [ ] **Task 6: Test Edge Cases** (AC: 4)
  - [ ] Test rapid creation on both platforms
  - [ ] Test with server briefly unavailable
  - [ ] Document any race conditions or issues

- [ ] **Task 7: Document Known Limitations** (AC: 4)
  - [ ] Note if manual refresh is required
  - [ ] Note any latency between create and visibility
  - [ ] Note platform-specific behaviors

## Dev Notes

### Validation Flow Diagram

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

### This is Manual Validation

This story is primarily **manual testing and documentation**. There are no automated tests to write - the goal is to validate that the infrastructure works and document the behavior.

### Expected Behavior

- Records created on any platform should appear on all platforms after refresh
- No real-time sync expected (manual refresh required)
- Same database means same data
- Type safety from shared schemas ensures consistent data format

### What to Document

| Item | Location |
|------|----------|
| Validation screenshots | Story completion notes |
| Latency observations | Dev notes |
| Known limitations | Story completion notes |
| Platform-specific behaviors | Story completion notes |

### Success Evidence

To mark this story as done, provide:
1. ✅ Screenshot: Web showing mobile-created record
2. ✅ Screenshot: Mobile showing web-created record
3. ✅ Database query showing both records
4. ✅ List of any limitations discovered

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-6.md#AC-6.4]
- [Source: docs/sprint-artifacts/tech-spec-epic-6.md#Cross-Platform-Sync-Flow]
- [Source: docs/epics.md#Story-6.4]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/6-4-validate-cross-platform-sync.context.xml` (generated 2025-12-05)

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


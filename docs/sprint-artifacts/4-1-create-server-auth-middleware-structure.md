# Story 4.1: Create Server Auth Middleware Structure

Status: ready-for-dev

## Story

As a **backend developer**,
I want **auth middleware patterns in the Express server**,
So that **I can easily protect API endpoints in Phase 2**.

## Acceptance Criteria

1. **Given** the Express server exists at `apps/server`
   **When** I create auth middleware in `apps/server/src/middleware/`
   **Then** reusable middleware functions exist for:
   - Extracting JWT from Authorization header
   - Validating token with Supabase
   - Attaching user context to request object

2. **Given** the middleware is created
   **When** I review the code
   **Then** middleware is documented with JSDoc comments and usage examples

3. **Given** this is infrastructure preparation
   **When** I complete this story
   **Then** middleware is NOT applied to any routes (prepared for Phase 2 only)

4. **Given** the middleware exports
   **When** I import from the middleware module
   **Then** I can access `requireAuth` middleware function

## Tasks / Subtasks

- [ ] **Task 1: Create middleware directory structure** (AC: #1)
  - [ ] Create `apps/server/src/middleware/` directory
  - [ ] Create `apps/server/src/middleware/auth.ts` file
  - [ ] Create `apps/server/src/middleware/index.ts` barrel export

- [ ] **Task 2: Implement JWT extraction** (AC: #1)
  - [ ] Create function to extract Bearer token from Authorization header
  - [ ] Handle missing/malformed Authorization header gracefully
  - [ ] Return null or throw typed error for invalid headers

- [ ] **Task 3: Implement token validation with Supabase** (AC: #1)
  - [ ] Import Supabase admin client from `@nx-monorepo/supabase-client`
  - [ ] Implement `validateToken(token: string)` function
  - [ ] Use `supabase.auth.getUser(token)` for JWT validation
  - [ ] Return user object or null on invalid token

- [ ] **Task 4: Implement request context attachment** (AC: #1)
  - [ ] Define TypeScript interface for authenticated request (`AuthenticatedRequest`)
  - [ ] Extend Express Request type with user context
  - [ ] Attach validated user to `req.user` property

- [ ] **Task 5: Create requireAuth middleware** (AC: #1, #4)
  - [ ] Implement `requireAuth` Express middleware function
  - [ ] Chain: extract token → validate → attach user → next()
  - [ ] Return 401 Unauthorized for invalid/missing auth
  - [ ] Export from barrel file

- [ ] **Task 6: Add comprehensive documentation** (AC: #2)
  - [ ] Add JSDoc comments to all exported functions
  - [ ] Include usage examples in comments
  - [ ] Document error responses and status codes

- [ ] **Task 7: Write unit tests** (AC: #1, #2, #4)
  - [ ] Create `apps/server/src/middleware/auth.spec.ts`
  - [ ] Test JWT extraction (valid, missing, malformed)
  - [ ] Test token validation (mock Supabase client)
  - [ ] Test requireAuth middleware integration
  - [ ] Verify tests pass: `pnpm exec nx run server:test`

- [ ] **Task 8: Verify middleware is NOT applied** (AC: #3)
  - [ ] Confirm no routes use the middleware yet
  - [ ] Document in code comments that application is deferred to Phase 2

## Dev Notes

### Architecture Alignment

This story implements infrastructure patterns from `docs/architecture.md` Security Architecture section:

```
┌─────────────┐
│   Browser   │ ───── Supabase SDK (auth only)
│ (Untrusted) │ ───── openapi-fetch client
└──────┬──────┘
       │ HTTP requests (authenticated)
       ↓
┌─────────────────┐
│  Express API    │ ◄─── Security boundary (THIS STORY)
│   (Trusted)     │      - Authentication checks
│                 │      - Authorization logic
└───────┬─────────┘
```

**Key principle**: Express API server is the security boundary. All authentication validation happens here before data access.

### Technical Implementation Notes

**Token validation approach:**
- Use Supabase service role client for server-side validation
- `supabase.auth.getUser(token)` validates JWT and returns user
- This approach is more secure than client-side validation

**TypeScript typing:**
```typescript
// Example interface structure
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    // ... other user properties from Supabase
  };
}
```

**Error response format:**
Follow RFC 7807 Problem Details pattern from architecture.md:
```typescript
return res.status(401).json({
  error: "Unauthorized",
  code: "AUTH_REQUIRED",
  details: "Valid JWT token required"
});
```

### Project Structure Notes

- Middleware location: `apps/server/src/middleware/auth.ts`
- Pattern follows router organization from `adopted-patterns/module-05`
- Uses Supabase client from `@nx-monorepo/supabase-client`

### Testing Strategy

- Mock `@nx-monorepo/supabase-client` in tests
- Test edge cases: expired token, malformed token, missing header
- Follow co-located test pattern: `auth.spec.ts` next to `auth.ts`

### References

- [Source: docs/architecture.md#Security-Architecture]
- [Source: docs/PRD.md#FR10] - Supabase client factories for server contexts
- [Source: docs/epics.md#Story-4.1]
- [Source: docs/memories/adopted-patterns/] - Router organization patterns

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/4-1-create-server-auth-middleware-structure.context.xml`

### Agent Model Used

<!-- To be filled by implementing agent -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled after implementation -->

### File List

<!-- To be filled after implementation -->

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-04 | PM Agent (Ridcully) | Initial story draft from Epic 4 |


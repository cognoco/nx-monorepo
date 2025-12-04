# Story 4.3: Create Web Auth State Management Patterns

Status: ready-for-dev

## Story

As a **frontend developer**,
I want **auth state management patterns for Next.js**,
So that **I have a foundation for building auth UI in Phase 2**.

## Acceptance Criteria

1. **Given** Supabase client factories exist in `@nx-monorepo/supabase-client`
   **When** I create auth utilities in `apps/web`
   **Then** I have documented patterns for getting current session/user

2. **Given** auth utilities are created
   **When** I review the patterns
   **Then** I have documented patterns for subscribing to auth state changes

3. **Given** auth utilities are created
   **When** I review the patterns
   **Then** I have documented patterns for protecting routes with Next.js middleware

4. **Given** this is infrastructure preparation
   **When** I review the implementation
   **Then** patterns are documented but NOT wired into routes
   **And** example code exists but is not active

## Tasks / Subtasks

- [ ] **Task 1: Create auth utilities directory** (AC: #1)
  - [ ] Create `apps/web/src/lib/` directory if not exists
  - [ ] Create `apps/web/src/lib/auth.ts` file
  - [ ] Import Supabase client from `@nx-monorepo/supabase-client`

- [ ] **Task 2: Implement session retrieval patterns** (AC: #1)
  - [ ] Create `getSession()` utility for Server Components
  - [ ] Create `getUser()` utility for Server Components
  - [ ] Document when to use each pattern
  - [ ] Add JSDoc with usage examples

- [ ] **Task 3: Implement auth state subscription pattern** (AC: #2)
  - [ ] Create `useAuthStateChange()` hook pattern for Client Components
  - [ ] Document Supabase `onAuthStateChange` usage
  - [ ] Include cleanup/unsubscribe pattern
  - [ ] Add example code with comments

- [ ] **Task 4: Create route protection middleware pattern** (AC: #3)
  - [ ] Create `apps/web/src/middleware.ts` (Next.js middleware file)
  - [ ] Implement session check logic (NOT active - commented out)
  - [ ] Document protected route patterns
  - [ ] Include redirect logic examples

- [ ] **Task 5: Document Server Component auth patterns** (AC: #1, #2)
  - [ ] Document how to check auth in Server Components
  - [ ] Document how to pass user context to Client Components
  - [ ] Include code examples for layout.tsx patterns

- [ ] **Task 6: Document Route Handler auth patterns** (AC: #1)
  - [ ] Document auth in API Route Handlers (app/api/*)
  - [ ] Show pattern for protected Route Handlers
  - [ ] Reference server middleware from Story 4.1

- [ ] **Task 7: Ensure patterns are NOT wired** (AC: #4)
  - [ ] Verify middleware matcher excludes all routes (or is commented)
  - [ ] Verify no routes actively check auth
  - [ ] Add clear comments: "Enable in Phase 2"

- [ ] **Task 8: Write documentation** (AC: #1, #2, #3, #4)
  - [ ] Add inline documentation in auth.ts
  - [ ] Update or create docs/guides/auth-patterns.md
  - [ ] Reference Next.js 15 App Router specifics

- [ ] **Task 9: Write unit tests for utilities** (AC: #1, #2)
  - [ ] Create `apps/web/src/lib/auth.spec.ts`
  - [ ] Test session retrieval (mock Supabase client)
  - [ ] Test hook patterns where possible
  - [ ] Verify tests pass: `pnpm exec nx run web:test`

## Dev Notes

### Next.js 15 App Router Specifics

This project uses Next.js 15 with the App Router. Auth patterns differ significantly from Pages Router:

**Server Components (default in App Router):**
```typescript
// app/dashboard/page.tsx
import { getSession } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');  // Server-side redirect
  }
  return <Dashboard user={session.user} />;
}
```

**Client Components:**
```typescript
'use client';
import { useAuthStateChange } from '@/lib/auth';

export function AuthProvider({ children }) {
  const { user, loading } = useAuthStateChange();
  // ...
}
```

### Supabase Client Usage

Reference existing factories from `@nx-monorepo/supabase-client`:
- `createBrowserClient()` - For Client Components
- `createServerClient()` - For Server Components and Route Handlers

### Middleware Pattern (Next.js 15)

```typescript
// apps/web/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // TODO: Enable auth checks in Phase 2
  // const session = await getSessionFromCookies(request);
  // if (!session && isProtectedRoute(request.nextUrl.pathname)) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: [],  // Empty = no routes matched (disabled for Phase 1)
};
```

### Project Structure Notes

- Auth utilities: `apps/web/src/lib/auth.ts`
- Middleware: `apps/web/src/middleware.ts`
- This story can run in parallel with 4-1 and 4-2

### References

- [Source: docs/architecture.md#Security-Architecture]
- [Source: docs/architecture.md#Implementation-Patterns] - Lifecycle patterns
- [Source: docs/PRD.md#FR10] - Supabase client factories
- [Source: docs/epics.md#Story-4.3]
- [Next.js 15 Auth Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- [Supabase Next.js Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/4-3-create-web-auth-state-management-patterns.context.xml`

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


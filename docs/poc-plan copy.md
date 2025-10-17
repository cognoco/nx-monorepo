---
Created: 2025-10-16T20:18
Modified: 2025-10-17T10:45
---
# Nx Monorepo Architecture Foundation

## Overview

This plan outlines building a **reusable Nx monorepo template** that establishes a production-ready foundation for full-stack SaaS applications. The goal is to validate that our selected technologies integrate correctly, establish working scaffolding for linting and testing, and ensure functional CI/CD pipelines.

### Purpose

This POC/template serves dual purposes:
1. **Validation**: Prove that web app, server, and database communicate correctly via our selected tech stack
2. **Reusability**: Create a generic foundation that can be cloned for future SaaS projects

### Key Principle

Keep the implementation **generic and minimal**. This is infrastructure validation, not product development. Once validated, the sample application will be removed and replaced with actual product features.

### Technology Stack

- **Web Framework**: Next.js 15 with React 19
- **API Layer**: oRPC with Zod validation
- **Database & Auth**: Supabase (PostgreSQL + authentication)
- **ORM**: Prisma (configured for Supabase)
- **Styling**: Tailwind CSS and ShadCN
- **Package Manager**: pnpm (v9+)
- **Monorepo**: Nx with buildable libraries
- **Linting & Formatting**: ESLint 9 + Prettier
- **Testing**: Jest (unit), Playwright (E2E when implemented)
- **Mobile Framework**: React Native with Expo Router (decision deferred - see Phase 3)

## Phase 0: Requirements Definition

**Goal**: Define what the POC must validate.

### Core Validation Checklist

The POC must demonstrate:

- ✅ Todo CRUD operations (simple data model)
- ✅ User authentication via Supabase Auth
- ✅ Database operations via Prisma connected to Supabase
- ✅ Type-safe API using oRPC with Zod validation
- ✅ Web UI (Next.js) consuming the API
- ✅ Shared validation schemas (Zod) used across server and client
- ✅ Shared database client (Prisma) accessible from server
- ✅ Shared API client (oRPC factory) used by web app
- ✅ Nx module boundaries enforced
- ✅ Lint and typecheck gates passing
- ✅ Unit tests for shared packages
- ✅ CI pipeline (GitHub Actions) running quality gates

### Manual Verification Checklist

Tests that prove the architecture works:

1. Database connection and migrations work (Prisma + Supabase)
2. API endpoints respond correctly (oRPC server)
3. Web UI performs CRUD operations
4. User can sign up and log in (Supabase Auth)
5. Protected routes require authentication
6. Shared packages (database, schemas, api-client) build independently
7. Nx affected commands correctly identify changed projects
8. CI pipeline passes on pull requests

### Explicitly Out of Scope

- Product-specific features or business logic
- Production deployment configuration
- Performance optimization
- Comprehensive E2E test coverage (deferred until architecture validated)
- Mobile app (decision point in Phase 3)

## Phase 1: Nx-Native Scaffolding (2-3 hours)

**Goal**: Generate Nx-idiomatic structure for full-stack SaaS application.

**Approach**: Use Nx generators exclusively to establish the monorepo structure.

### Step 1.1: Generate Applications

```bash
# Backend API (Node.js with Express)
npx nx g @nx/node:app server --directory=apps/server --framework=express

# Web frontend
npx nx g @nx/next:app web --directory=apps/web

# Remove boilerplate apps
rm -rf apps/nx-test apps/nx-test-e2e
```

**Note**: Mobile app generation deferred to Phase 3 (decision point).

**Manual checkpoint**: `npx nx run-many -t build` succeeds for all apps

### Step 1.2: Generate Shared Libraries

Nx buildable libraries enable independent compilation and caching:

```bash
# Database library (buildable, publishable to other apps)
npx nx g @nx/node:lib database --directory=packages/database --buildable

# Schemas library (buildable, pure TypeScript)
npx nx g @nx/js:lib schemas --directory=packages/schemas --buildable

# API client library (buildable)
npx nx g @nx/node:lib api-client --directory=packages/api-client --buildable

# Supabase client library (buildable, shared configuration)
npx nx g @nx/js:lib supabase-client --directory=packages/supabase-client --buildable
```

**Note**: Additional libraries can be added as needed:
- `packages/ui` - Shared UI components
- `packages/utils` - Shared utilities
- Feature-specific libraries for domain logic

**Manual checkpoint**: `npx nx graph` shows clean dependency graph

### Step 1.3: Configure Tooling (Nx Defaults + Supabase)

**Keep Nx defaults** (already configured):

- ✅ ESLint setup (Nx way)
- ✅ Jest configuration
- ✅ Build caching
- ✅ Playwright for E2E

**Install project-specific tooling**:

```bash
# Install Prisma for database package
pnpm add -D prisma --filter @nx-test/database
pnpm add @prisma/client --filter @nx-test/database

# Supabase CLI - use npx (no installation needed)
# Note: Supabase CLI cannot be installed via npm
# Use npx for all Supabase CLI commands: npx supabase <command>

# Login to Supabase (using access token method)
# 1. Go to https://supabase.com/dashboard/account/tokens
# 2. Create a new access token
# 3. Login: npx supabase login --token <your-access-token>

# Initialize Supabase in the project
npx supabase init
# When prompted to generate settings for Deno answer: N

# Install Supabase client libraries
pnpm add @supabase/supabase-js --filter @nx-test/supabase-client
pnpm add @supabase/ssr --filter @nx-test/supabase-client

# Install oRPC for server
pnpm add @orpc/server --filter @nx-test/server
pnpm add @orpc/client --filter @nx-test/api-client

# Note: Expo Router skipped (no mobile app in Phase 1)
```

**Manual checkpoint**:

- [ ] `pnpm install` completes successfully
- [ ] `npx nx run-many -t lint test` passes (even with empty implementations)
- [ ] All packages build successfully: `npx nx run-many -t build`

### Step 1.4: Add Placeholder Files

Minimal setup to prove structure works:

**Database Package** (`packages/database`):

- `prisma/schema.prisma` - Prisma schema pointing to Supabase
- `src/index.ts` - Export Prisma client singleton

**Schemas Package** (`packages/schemas`):

- `src/todo.ts` - Placeholder Zod schemas for todo operations
- `src/auth.ts` - Placeholder Zod schemas for auth (if needed)
- `src/index.ts` - Re-export all schemas

**API Client Package** (`packages/api-client`):

- `src/index.ts` - Placeholder oRPC client factory
- `src/types.ts` - Shared TypeScript types

**Supabase Client Package** (`packages/supabase-client`):

- `src/index.ts` - Supabase client factory function
- `src/types/database.types.ts` - Generated Supabase database types (placeholder)
- `src/utils.ts` - Shared Supabase utilities

**Server App** (`apps/server`):

- `src/main.ts` - Placeholder Express + oRPC server setup
- `src/routes/` - Placeholder route structure

**Web App** (`apps/web`):

- `src/app/page.tsx` - Placeholder homepage
- `src/app/todos/page.tsx` - Placeholder todos page
- `src/lib/supabase.ts` - Supabase client initialization using `@nx-test/supabase-client` factory

**Manual checkpoint**: `pnpm dev` starts all apps (even if they don't do anything yet)

## Phase 2: Vertical Slice Implementation

Build functionality incrementally using vertical slices.

### Slice 1: Database + Schemas (2 hours)

**Goal**: Shared packages work correctly.

**Why this order**: Nx emphasizes library dependencies. Prove they work first.

#### Tasks

1. Set up Supabase project and get connection string
2. Complete Supabase client factory in `packages/supabase-client/src/index.ts`:
   - Export `createSupabaseClient(config)` factory function
   - Export database types (placeholder initially, generated from Supabase later)
   - Export shared utilities (e.g., `getSupabaseUrl()`)
3. Complete Prisma schema in `packages/database/prisma/schema.prisma`:
   - Todo model (id, text, completed, userId, createdAt, updatedAt)
   - Use Supabase's built-in auth.users table for user references
4. Configure Prisma client export in `packages/database/src/index.ts`
5. Create initial migration and push to Supabase
6. Complete Zod schemas in `packages/schemas/src/todo.ts`:
   - `todoCreateSchema` - For creating todos
   - `todoUpdateSchema` - For updating todos
   - `todoDeleteSchema` - For deleting todos
7. Add unit tests for schema validation
8. Configure Nx dependency graph

#### Manual Checkpoints

- [ ] `pnpm --filter @nx-test/supabase-client build` succeeds
- [ ] `pnpm --filter @nx-test/database db:push` works
- [ ] Supabase dashboard shows `Todo` table
- [ ] `pnpm --filter @nx-test/schemas test` passes
- [ ] `npx nx graph` shows correct dependencies including supabase-client

#### Completion Criteria

- Supabase client factory can be imported from `@nx-test/supabase-client`
- Prisma client can be imported from `@nx-test/database`
- Zod schemas can be imported from `@nx-test/schemas`
- All tests pass

### Slice 2: Server API (3-4 hours)

**Goal**: Backend works with type-safe oRPC.

#### Tasks

1. Set up oRPC server in `apps/server/src/main.ts`
2. Create todo service in `apps/server/src/services/todo.service.ts`:
   - `createTodo(input)` - Create new todo
   - `getTodos()` - Get all todos for authenticated user
   - `updateTodo(id, input)` - Update todo
   - `deleteTodo(id)` - Delete todo
3. Connect to Prisma client from `@nx-test/database`
4. Use Zod schemas from `@nx-test/schemas` for validation
5. Add authentication middleware using Supabase JWT validation
6. Create oRPC router and export type
7. Add unit tests for todo service
8. Add integration tests for API endpoints

#### Manual Checkpoints

- [ ] `pnpm --filter server dev` starts server on expected port
- [ ] Curl/Postman can hit health check endpoint
- [ ] Can create todo via API (with auth token)
- [ ] Can list todos via API (with auth token)
- [ ] Unauthenticated requests are rejected
- [ ] `pnpm --filter server test` passes
- [ ] `npx nx affected:graph` shows server depends on database & schemas

#### Completion Criteria

- Server exposes working oRPC endpoints
- Authentication is required for protected routes
- All CRUD operations work
- All tests pass

### Slice 3: API Client Package (1-2 hours)

**Goal**: Shared oRPC client works for both web and mobile.

#### Tasks

1. Create oRPC client factory in `packages/api-client/src/index.ts`
2. Support both web (Next.js) and native (Expo) configurations:
   - Web: Use fetch with credentials
   - Native: Use fetch with manual cookie handling
3. Export AppRouter type from server
4. Add TanStack Query integration helpers
5. Add tests for client initialization

#### Manual Checkpoints

- [ ] Client can be initialized with web config
- [ ] Client can be initialized with native config
- [ ] TypeScript autocomplete works for all endpoints
- [ ] `pnpm --filter @nx-test/api-client test` passes

#### Completion Criteria

- API client package exports working factory function
- Type safety is enforced across client and server
- All tests pass

### Slice 4: Web Frontend (3-4 hours)

**Goal**: User-facing web application works.

#### Tasks

1. Set up Supabase client in `apps/web/src/lib/supabase.ts` using `@nx-test/supabase-client` factory
2. Create API client instance in `apps/web/src/lib/api.ts` using `@nx-test/api-client`
3. Implement todo UI in `apps/web/src/app/todos/page.tsx`:
   - Display list of todos
   - Create new todo form
   - Toggle todo completion
   - Delete todo button
4. Add authentication pages:
   - `apps/web/src/app/login/page.tsx`
   - `apps/web/src/app/signup/page.tsx`
5. Implement auth flow with Supabase Auth
6. Add protected route middleware
7. Add Playwright E2E tests:
   - Sign up flow
   - Login flow
   - Todo CRUD operations

#### Manual Checkpoints

- [ ] `pnpm dev` runs both server and web concurrently
- [ ] Can access login page
- [ ] Can create account via signup page
- [ ] Can log in with created account
- [ ] Unauthenticated users are redirected to login
- [ ] Can create todo via web UI
- [ ] Can mark todo as complete via web UI
- [ ] Can delete todo via web UI
- [ ] Changes are persisted to database
- [ ] `pnpm --filter web-e2e e2e` passes

#### Completion Criteria

- Full authentication flow works
- Full todo CRUD works in browser
- E2E tests pass
- UI is responsive and styled with Tailwind

## Phase 3: Mobile App Decision Point

**Goal**: Decide whether to include mobile app in the POC/template.

### Decision Criteria

Before implementing mobile:
1. Web app + server + database integration must be fully validated
2. All quality gates passing (lint, typecheck, unit tests for packages)
3. CI pipeline functional
4. Nx buildable library pattern proven

### If Mobile App Approved

**Estimated effort**: 4-5 hours

Implement Slice 5 using Expo Router:
- Set up Supabase client for React Native with AsyncStorage
- Create API client instance using `@nx-test/api-client`
- Configure Expo Router navigation
- Implement authentication screens (login, signup)
- Implement todo screens with tab navigation
- Test cross-platform package compatibility
- Validate data syncs between web and mobile

**Success criteria**:
- Full authentication flow works on mobile
- Full todo CRUD works on mobile
- Expo Router navigation works correctly
- Shared packages support both platforms

### If Mobile App Deferred

Document the decision and proceed to Phase 4 (documentation and template finalization).

**Note**: The current product roadmap does not require mobile, making this decision optional for the initial POC/template.

## Success Criteria

### POC Validation Complete When:

1. ✅ Users can sign up and log in (web) via Supabase Auth
2. ✅ Authenticated users can create, read, update, delete todos
3. ✅ Data is persisted to Supabase database via Prisma
4. ✅ API is type-safe using oRPC and Zod
5. ✅ Shared packages work correctly across apps
6. ✅ All tests pass (unit and integration)

## Estimated Timeline

| Phase                         | Estimated Time  | Cumulative    |
| ----------------------------- | --------------- | ------------- |
| Phase 0: Functional Inventory | 1 hour          | 1 hour        |
| Phase 1: Scaffolding          | 2-3 hours       | 3-4 hours     |
| Slice 1: Database + Schemas   | 2 hours         | 5-6 hours     |
| Slice 2: Server API           | 3-4 hours       | 8-10 hours    |
| Slice 3: API Client           | 1-2 hours       | 9-12 hours    |
| Slice 4: Web Frontend         | 3-4 hours       | 12-16 hours   |
| Slice 5: Mobile App           | 4-5 hours       | 16-21 hours   |
| **Total**                     | **16-21 hours** | **~2-3 days** |

## Notes

- **Manual testing is required** at each checkpoint to verify functionality
- **Document all Nx commands and patterns** for team wiki/knowledge base
- **Keep implementation generic** - this is template scaffolding, not product development
- **Tech stack selections** are based on production requirements and team expertise

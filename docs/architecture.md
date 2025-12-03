# Architecture

This document defines **HOW** the AI-Native Nx Monorepo Template is built and **HOW** features should be implemented. It is derived from PRD.md and constitution.md, with detailed rationale in architecture-decisions.md.

**Audience**: AI coding agents (primary), architects, developers
**Last Updated**: 2025-12-03
**Stack Verification**: See `docs/tech-stack.md` (verified 2025-12-03)

---

## Before You Start (Quick Reference)

This document covers **HOW** the system is built. For related guidance, consult:

| Topic | Document | Key Sections |
|-------|----------|--------------|
| **TDD Methodology** | `constitution.md` Section I | AI-adapted TDD with batch test writing, scope-appropriate cycles |
| **All Core Principles** | `constitution.md` | 11 non-negotiable principles governing all work |
| **Product Philosophy** | `PRD.md` "What Makes This Special" | AI-Native Architecture, Building-Block Philosophy |
| **WHY Decisions Were Made** | `architecture-decisions.md` | Full rationale for API, database, tooling choices |
| **Version Pinning** | `tech-stack.md` | Exact versions, compatibility matrix, upgrade policy |
| **Agent Execution Rules** | `.ruler/AGENTS.md` | MCP server usage, sub-agent policy, git workflow |
| **Operational Patterns** | `docs/memories/` | Adopted patterns, post-generation checklist, troubleshooting |
| **Step-by-Step Playbooks** | `docs/guides/implementation-guide/` | Retry patterns, adding libraries, API endpoints *(embryo)* |

**Navigation tip**: Use `docs/index.md` for the complete documentation hierarchy and cross-reference guidelines.

---

## Executive Summary

The AI-Native Nx Monorepo Template provides production-ready infrastructure for type-safe, full-stack applications with shared business logic across web, server, and mobile platforms. The architecture follows a building-block philosophy—providing reusable infrastructure patterns rather than opinionated business logic—enabling AI coding agents to work effectively within explicit boundaries and type-safe contracts. A walking skeleton validates all layers end-to-end before feature development begins.

> **Document Status**: This architecture document describes the **existing** brownfield codebase. It is maintained as the authoritative reference for implementation patterns, not a proposal for future design.

---

## Decision Summary

| Category | Decision | Rationale |
|----------|----------|-----------|
| **Build System** | Nx + pnpm | Intelligent caching, task graph, distributed execution |
| **API Framework** | REST+OpenAPI (code-first) | Zero vendor lock-in, AI-agent optimized, mobile-ready |
| **API Toolchain** | zod-to-openapi → openapi-typescript → openapi-fetch | Single source of truth, type-safe client |
| **Web Framework** | Next.js (App Router) | RSC, streaming, modern React patterns |
| **Server Framework** | Express | Mature, extensive ecosystem, well-documented |
| **Database** | Prisma + Supabase PostgreSQL | Type safety, migrations, connection pooling |
| **Auth Strategy** | Supabase Auth | Platform-handled, secure, minimal code |
| **Unit Testing** | Jest | Industry standard, comprehensive ecosystem |
| **E2E Testing** | Playwright | Fast, reliable, cross-browser |
| **Type System** | TypeScript (strict) | Compile-time safety, no `as` casting |

**Version inventory**: See `docs/tech-stack.md` for exact versions and compatibility matrix
**Detailed rationale**: See `docs/architecture-decisions.md`

---

## Project Structure

```
nx-monorepo/
├── apps/                          # Applications (what you build)
│   ├── web/                       # Next.js web application
│   │   ├── src/
│   │   │   ├── app/               # App Router pages
│   │   │   └── components/        # React components (tests co-located)
│   │   ├── project.json
│   │   ├── jest.config.ts
│   │   └── tsconfig.*.json
│   ├── web-e2e/                   # Playwright E2E tests
│   │   ├── src/*.spec.ts
│   │   └── playwright.config.ts
│   └── server/                    # Express API server
│       ├── src/
│       │   ├── main.ts            # Entry point
│       │   ├── routes/            # REST+OpenAPI endpoints
│       │   └── openapi/           # OpenAPI infrastructure
│       └── project.json
├── packages/                      # Shared libraries (buildable)
│   ├── database/                  # Prisma client + utilities
│   │   ├── src/
│   │   │   ├── index.ts           # Public API
│   │   │   └── client.ts          # Prisma singleton
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── migrations/
│   ├── schemas/                   # Zod schemas + TypeScript types
│   │   └── src/lib/*.schema.ts
│   ├── api-client/                # REST API client
│   │   ├── src/
│   │   │   ├── index.ts           # Client factory
│   │   │   └── generated/         # OpenAPI-generated types
│   │   └── project.json
│   └── supabase-client/           # Supabase client factories
│       └── src/index.ts           # Browser/server factories
├── docs/                          # Project documentation
│   ├── index.md                   # Documentation index
│   ├── PRD.md                     # Product requirements
│   ├── architecture.md            # This file
│   ├── architecture-decisions.md  # ADR details
│   ├── tech-stack.md              # Version inventory
│   └── memories/                  # Cogno operational memory
└── .ruler/
    └── AGENTS.md                  # Agent rules → CLAUDE.md
```

### Dependency Flow (Enforced)

```
apps/web ────┐
             ├──► packages/api-client ──► packages/schemas
apps/mobile ─┘                                   ↑
                                                 │
apps/server ──► packages/database ──────────────┘
                      │
                      └──► packages/supabase-client
```

**Rules**:
1. Applications depend on packages, never reverse
2. No app-to-app imports
3. No circular dependencies
4. All packages buildable with proper TypeScript exports

**Verify**: `pnpm exec nx graph`

---

## Technology Stack Details

### Core Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Web** | Next.js 15.2 + React 19 | Server components, streaming, App Router |
| **Server** | Express 4.x | REST API with OpenAPI specification |
| **Database** | Prisma 6.x + Supabase | Type-safe ORM with managed PostgreSQL |
| **Testing** | Jest 30 + Playwright 1.56 | Unit/integration + E2E |
| **Build** | Nx 21.6 + pnpm 10.19 | Monorepo orchestration with caching |

> **⚠️ Known Incompatibilities**: Before mixing tools or versions, see `tech-stack.md` "Known Incompatibilities" section for combinations that cause failures (e.g., Jest 30 + mixed transformers, Nx version mismatches).

### Integration Architecture

```
┌─────────────────────────────────────────┐
│ Supabase Cloud                          │
│  ├─ PostgreSQL Database                 │
│  └─ Auth Service                        │
└─────────────────────────────────────────┘
           ↑                    ↑
    DATABASE_URL         SUPABASE_URL + Keys
           ↑                    ↑
    ┌──────┴─────┐      ┌──────┴───────┐
    │   Prisma   │      │ Supabase SDK │
    │   (ORM)    │      │   (Auth)     │
    └──────┬─────┘      └──────┬───────┘
           ↑                    ↑
    apps/server            apps/web
```

**Connection strategy**:
- Server uses Prisma via `DATABASE_URL` for all data operations
- Web/Mobile use Supabase SDK for authentication ONLY
- All data flows through Express API (never direct client → database)

---

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents. Each pattern MUST be followed exactly.

### Naming Patterns

| Element | Convention | Example |
|---------|------------|---------|
| **Packages** | `@nx-monorepo/<name>` | `@nx-monorepo/api-client` |
| **Database tables** | snake_case with `@@map()` | `health_checks` |
| **Prisma models** | PascalCase | `HealthCheck` |
| **API routes** | kebab-case | `/api/health-check` |
| **Test files** | `*.spec.ts` / `*.spec.tsx` | `Button.spec.tsx` |
| **Integration tests** | `*.integration.spec.ts` | `health.integration.spec.ts` |

### Structure Patterns

| Pattern | Rule | Reference |
|---------|------|-----------|
| **Test location** | Co-located in `src/` next to source | `adopted-patterns/module-01` |
| **Router organization** | Path-agnostic routers, mount in main.ts | `adopted-patterns/module-05` |
| **Prisma singleton** | Single instance via globalThis | `adopted-patterns/module-10` |

### Format Patterns

| Format | Standard |
|--------|----------|
| **API responses** | `{ data, error }` or RFC 7807 Problem Details |
| **Timestamps** | ISO 8601 with timezone (`@db.Timestamptz`) |
| **Primary keys** | UUID (`@id @default(uuid()) @db.Uuid`) |

### Communication Patterns

| Pattern | Implementation |
|---------|----------------|
| **API contracts** | Zod schemas → OpenAPI spec → TypeScript types |
| **HTTP client** | `openapi-fetch` with typed paths |
| **Error handling** | Check `if (error)` before accessing `data` |

### Lifecycle Patterns

| State | Approach |
|-------|----------|
| **Loading** | React Server Components + Suspense |
| **Mutations** | `useTransition` or `useOptimistic` |
| **Error boundaries** | Fatal errors; inline messages for validation |
| **Retries** | Manual exponential backoff (no built-in) |

> **State Diagrams**: Visual diagrams showing UI state transitions (loading → success/error → retry) are planned for a future UX patterns guide. See `docs/guides/implementation-guide/` for retry logic examples.

### Location Patterns

| Element | Location |
|---------|----------|
| **Zod schemas** | `packages/schemas/src/lib/*.schema.ts` |
| **OpenAPI registration** | `apps/server/src/routes/*.openapi.ts` |
| **Route handlers** | `apps/server/src/routes/*.ts` |
| **Generated types** | `packages/api-client/src/generated/` |

### Consistency Patterns

| Area | Standard |
|------|----------|
| **TypeScript** | `bundler` resolution (prod), `nodenext` (tests) |
| **Module system** | ESM everywhere, CommonJS for Jest |
| **Line endings** | LF (`.gitattributes` enforced) |

**Detailed patterns**: See `docs/memories/adopted-patterns/`

---

## Consistency Rules

### Code Organization

- **Applications**: Feature-based folders under `src/` (e.g., `src/features/tasks/`, `src/features/auth/`)
- **Packages**: Barrel exports via `index.ts`
- **Never export implementation details**, only public interfaces

```
# Feature-based folder example (apps/web)
src/
├── app/                    # Next.js App Router (pages)
├── features/               # Feature modules
│   ├── tasks/
│   │   ├── components/     # Task-specific components
│   │   ├── hooks/          # Task-specific hooks
│   │   └── utils/          # Task-specific utilities
│   └── auth/
│       ├── components/
│       └── hooks/
└── components/             # Shared/generic components
```

### Error Handling

```typescript
// API Layer - structured errors
return res.status(400).json({
  error: "Validation failed",
  code: "VALIDATION_ERROR",
  details: result.error.errors
});

// Client Layer - check before access
const { data, error } = await client.GET('/resource');
if (error) {
  // Handle typed error
}
```

### Logging Strategy

- Correlation IDs for request tracing
- Business + technical context in comments
- No sensitive data in logs

```typescript
// Correlation ID middleware example (apps/server)
import { randomUUID } from 'crypto';

export function correlationIdMiddleware(req, res, next) {
  req.correlationId = req.headers['x-correlation-id'] || randomUUID();
  res.setHeader('x-correlation-id', req.correlationId);
  next();
}

// Usage in logging
console.log(`[${req.correlationId}] Processing request: ${req.method} ${req.path}`);
```

---

## Data Architecture

### Prisma Schema Conventions

```prisma
model HealthCheck {
  id        String   @id @default(uuid()) @db.Uuid
  message   String   @db.Text
  timestamp DateTime @default(now()) @db.Timestamptz

  @@map("health_checks")  // Explicit table mapping
}
```

### Type Generation Pipeline

```
Zod Schema (source)
     ↓
OpenAPI Specification (runtime generated)
     ↓
TypeScript Types (build-time generated)
     ↓
Type-Safe Client (compile-time validated)
```

### Nx Task Dependencies

```
packages/schemas:build
     ↓
apps/server:build → apps/server:spec-write
                          ↓
              packages/api-client:generate-types
                          ↓
              packages/api-client:build
                          ↓
                   apps/web:build
```

---

## API Contracts

### OpenAPI Code-First Pattern

**1. Define Zod schema** (`packages/schemas`):
```typescript
export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  completed: z.boolean().default(false),
}).openapi('CreateTaskRequest');
```

**2. Register with OpenAPI** (`apps/server/src/routes/tasks.openapi.ts`):
```typescript
registry.registerPath({
  method: 'post',
  path: '/tasks',
  request: { body: { content: { 'application/json': { schema: CreateTaskSchema } } } },
  responses: { 201: { /* ... */ } },
});
```

**3. Implement handler** (`apps/server/src/routes/tasks.ts`):
```typescript
export const tasksRouter = Router();
tasksRouter.post('/', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  // Implementation...
});
```

**4. Use type-safe client**:
```typescript
const { data, error } = await apiClient.POST('/api/tasks', {
  body: { title: 'Buy groceries', completed: false }
});  // Fully typed!
```

> **CRUD Examples**: The above demonstrates the POST pattern. Full CRUD examples (GET, PUT, DELETE) will be documented during PoC implementation when real business entities are built on this infrastructure.

---

## Security Architecture

### Security Boundary

```
┌─────────────┐
│   Browser   │ ───── Supabase SDK (auth only)
│ (Untrusted) │ ───── openapi-fetch client
└──────┬──────┘
       │ HTTP requests (authenticated)
       ↓
┌─────────────────┐
│  Express API    │ ◄─── Security boundary
│   (Trusted)     │      - Authentication checks
│                 │      - Authorization logic
│                 │      - Input validation (Zod)
└───────┬─────────┘
        │ Prisma queries
        ↓
┌─────────────────┐
│  PostgreSQL DB  │ ◄─── RLS enabled (defense-in-depth)
│   (Protected)   │
└─────────────────┘
```

### Row Level Security (RLS)

- **Enabled** on all tables (defense-in-depth)
- **Service role key** bypasses RLS for API server
- **No policy logic** needed—API server controls access
- **Protects against** accidental Data API exposure

### Input Validation

All API inputs validated with Zod schemas before processing:
```typescript
const result = Schema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.errors });
}
```

---

## Performance Considerations

From PRD Non-Functional Requirements:

| Metric | Target |
|--------|--------|
| **Nx cache hit rate** | >50% after initial run |
| **Full CI pipeline** | <10 minutes |
| **API response (simple)** | <200ms |
| **Build** | Incremental, affected-only |

### Optimization Patterns

- **Nx caching**: Remote via Nx Cloud
- **Database**: Selective field loading, appropriate indexing
- **Frontend**: Automatic code splitting
- **API**: Connection pooling via Supavisor

### Caching Strategy

**Current state**: No application-level caching implemented. The template relies on:
- Nx remote caching (build artifacts)
- Supavisor connection pooling (database connections)
- Standard HTTP caching (browser-controlled)

**Future consideration**: Add Redis or HTTP cache headers based on production performance profiling.

---

## Deployment Architecture

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
- Install dependencies (pnpm)
- Install Playwright browsers
- Run: pnpm exec nx run-many -t lint test build typecheck e2e
```

### Quality Gates

| Stage | Checks |
|-------|--------|
| **Pre-commit** | lint-staged, affected tests |
| **CI** | Full lint, all tests, build, typecheck, E2E |
| **PR merge** | All CI passes, code review, no conflicts |

### Pre-commit Hooks

```bash
# .husky/pre-commit
pnpm exec lint-staged
NX_DAEMON=false pnpm exec nx affected -t test --base=HEAD~1
```

**NX_DAEMON=false**: Prevents Jest hanging on Windows.

### Deployment Targets

This template is **deployment-agnostic** by design. The architecture avoids vendor-specific APIs to support multiple deployment strategies:

| Target | Web (Next.js) | Server (Express) | Notes |
|--------|---------------|------------------|-------|
| **Vercel + Functions** | Vercel | Vercel Serverless | Simplest setup, cold starts possible |
| **Vercel + Container** | Vercel | Railway/Render/Fly.io | Best for long-running processes |
| **Self-hosted** | Docker | Docker | Full control, requires infrastructure |

**Validation scope**: One or two deployment targets will be tested and documented during PoC implementation.

---

## Development Environment

### Prerequisites

- Node.js 20+
- pnpm 10.19+
- Git with LF line endings

### Setup Commands

```bash
# Clone and install
git clone <repo>
cd nx-monorepo
pnpm install

# Configure environment
cp .env.example .env.local
# Edit with Supabase credentials

# Validate infrastructure
pnpm exec nx run-many -t lint test build

# Start development
pnpm run dev
```

### Common Operations

| Task | Command |
|------|---------|
| **Build all** | `pnpm exec nx run-many -t build` |
| **Test affected** | `pnpm exec nx affected -t test` |
| **Lint** | `pnpm exec nx run-many -t lint` |
| **Dev server** | `pnpm run dev` |
| **View graph** | `pnpm exec nx graph` |

---

## Architecture Decision Records (ADRs)

| ADR | Category | Decision | Status |
|-----|----------|----------|--------|
| ADR-001 | API Framework | REST+OpenAPI over RPC frameworks | Accepted |
| ADR-002 | API Toolchain | zod-to-openapi → openapi-typescript → openapi-fetch | Accepted |
| ADR-003 | Database | Prisma + Supabase with dual-connection | Accepted |
| ADR-004 | RLS Strategy | Enabled with service_role bypass | Accepted |
| ADR-005 | Testing | Jest 30 + Playwright | Accepted |
| ADR-006 | Module Resolution | `bundler` (prod) / `nodenext` (tests) | Accepted |

**Full rationale**: See `docs/architecture-decisions.md`

---

## Core Principles Reference

These principles from PRD/constitution govern all architectural decisions. For authoritative definitions and rationale, see `constitution.md`.

1. **AI-Native Architecture** - Explicit patterns, structured formats, discoverable conventions (see PRD.md "What Makes This Special")
2. **Building-Block Philosophy** - Infrastructure patterns, not business logic
3. **Type Safety End-to-End** - Zod → OpenAPI → TypeScript, no `as` casting
4. **Production-Ready from Day One** - Quality gates, CI/CD, observability
5. **No Vendor Lock-in** - Provider-agnostic, multiple deployment targets
6. **Monorepo Standards Over Framework Defaults** - Post-generation checklist mandatory
7. **External Validation Mandatory** - MCP research before material changes
8. **Governance Alignment Mandatory** - Check docs before proposing solutions

---

## PRD Traceability

This table maps key PRD requirements to their architectural implementation. For complete requirements, see `docs/PRD.md`.

### Functional Requirements

| PRD ID | Requirement | Architecture Section | Notes |
|--------|-------------|---------------------|-------|
| **FR1** | Nx workspace configuration | Project Structure | Multi-app, multi-package structure |
| **FR2** | Walking skeleton validation | Executive Summary | Health check exercises all layers |
| **FR3** | Unidirectional dependency flow | Project Structure → Dependency Flow | Enforced via `nx graph` |
| **FR4** | TypeScript strict mode | Consistency Patterns | `bundler`/`nodenext` resolution |
| **FR5** | Documentation sync | Document References | Tier hierarchy in `docs/index.md` |
| **FR6** | Workspace scripts | Development Environment → Common Operations | `pnpm run` shortcuts |
| **FR7** | Zod schemas as source of truth | API Contracts, Data Architecture | Zod → OpenAPI → TypeScript |
| **FR8** | Prisma + PostgreSQL | Data Architecture | UUID, timestamptz, snake_case |
| **FR9** | Type-safe API client | API Contracts | `openapi-fetch` client |
| **FR10** | Supabase client factories | Integration Architecture | Browser/server context support |
| **FR11** | Environment validation | Development Environment | Fail-fast on missing config |
| **FR12-14** | Quality gates | Deployment Architecture → Quality Gates | Pre-commit, CI, coverage |
| **FR15** | Nx Cloud caching | Optimization Patterns | Remote caching enabled |
| **FR16-18** | CI/CD + observability | Deployment Architecture | GitHub Actions, health endpoints |
| **FR20-22** | Mobile parity | — | *Deferred to PoC implementation* |
| **FR23-28** | Task App PoC | — | *Out of MVP scope* |

### Non-Functional Requirements

| NFR Category | Architecture Section | Coverage |
|--------------|---------------------|----------|
| **Performance** | Performance Considerations | Metrics, optimization patterns, caching strategy |
| **Security** | Security Architecture | Trust boundary, RLS, input validation |
| **Type Safety** | Implementation Patterns, Data Architecture | End-to-end type flow |
| **Scalability** | Project Structure → Dependency Flow | 6-8 apps, 8-10 packages supported |
| **Deployment** | Deployment Architecture → Deployment Targets | Multi-platform flexibility |

---

## Document References

| Document | Purpose |
|----------|---------|
| `docs/PRD.md` | WHAT and WHY (source of truth) |
| `docs/architecture-decisions.md` | WHY decisions were made |
| `docs/tech-stack.md` | WHICH versions to use |
| `docs/memories/adopted-patterns/` | Implementation patterns (operational) |
| `docs/memories/post-generation-checklist/` | After `nx g` commands |
| `docs/memories/troubleshooting/` | Common issues and solutions |
| `.ruler/AGENTS.md` | Agent execution rules |

---

**Maintainer**: Architecture Team
**Status**: Canonical
**Version**: 2.0.0

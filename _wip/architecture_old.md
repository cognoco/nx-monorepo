---
title: Architecture Reference
purpose: Canonical architectural principles, patterns, and implementation guidance for the AI-Native Nx Monorepo Template
audience: AI agents, architects, developers
created: 2025-11-18
last-updated: 2025-11-18
status: Canonical
supersedes: [".specify/memory/constitution.md", "docs/architecture-decisions.md (technical sections)"]
---

# AI-Native Nx Monorepo Template - Architecture Reference

## Document Purpose

This document provides the canonical architectural principles, patterns, and implementation guidance for building on the AI-Native Nx Monorepo Template. It consolidates core architectural decisions, development patterns, and quality standards that define **HOW** the system is designed and **HOW** features should be implemented.

**Audience:**
- **Primary**: AI coding agents making implementation decisions
- **Secondary**: Architects reviewing system design and changes
- **Tertiary**: Developers understanding system architecture

**Scope:**
- Architectural principles and patterns (HOW we build)
- Technology choices and rationale (WHAT we use and WHY)
- Development standards and quality gates (HOW we maintain quality)
- Implementation guidance for common scenarios

**Out of Scope:**
- Roadmap and timeline (see `P1-plan.md`)
- Version inventory and pinning strategy (see `tech-stack.md`)
- Operational procedures and agent rules (see `.ruler/AGENTS.md`)
- Detailed troubleshooting steps (see `docs/memories/troubleshooting/`)
- Pattern implementation checklists (see `docs/memories/adopted-patterns/`)

---

## Table of Contents

1. [Introduction](#introduction)
2. [Core Architectural Principles](#core-architectural-principles)
3. [Monorepo Structure & Boundaries](#monorepo-structure--boundaries)
4. [Type Safety Architecture](#type-safety-architecture)
5. [Technology Stack & Decisions](#technology-stack--decisions)
6. [Development Patterns](#development-patterns)
7. [Testing Strategy](#testing-strategy)
8. [Security Architecture](#security-architecture)
9. [Build & Deployment](#build--deployment)
10. [Quality Gates & Governance](#quality-gates--governance)

---

## Introduction

### What Makes This Special

The AI-Native Nx Monorepo Template is fundamentally different from traditional monorepo templates. It's designed specifically for **AI-first development workflows** where AI coding agents serve as the primary development workforce, with human architects providing strategic direction.

**Key differentiators:**

1. **AI-Native Architecture**
   - Explicit architectural decisions documented in structured, parseable formats
   - Clear separation of concerns with type-safe contracts and boundaries
   - Consistent patterns that AI agents can discover and apply reliably

2. **Production-Ready from Day One**
   - Complete CI/CD infrastructure with automated quality gates
   - End-to-end type safety from database schema through API contracts to UI components
   - Comprehensive testing strategy validated through walking skeleton

3. **Building-Block Philosophy**
   - Reusable infrastructure patterns, not opinionated business logic
   - Clear separation: template provides building blocks, applications implement features
   - Scales seamlessly without architectural refactoring

### The Walking Skeleton Approach

This template uses a "walking skeleton" methodology to validate infrastructure before feature development:

**What it validates:**
- Multiple applications can share code through buildable libraries
- Type safety flows end-to-end (database → API → UI)
- Testing strategy covers all levels (unit, integration, E2E)
- CI/CD pipeline enforces quality gates
- Development workflow is smooth and productive

**Current implementation:**
- Health check feature exercises all architectural layers
- Web app → API client → Server → Database (Prisma) → Supabase
- Proves plumbing works before investing in feature development

The walking skeleton is throwaway code—its only purpose is infrastructure validation. Once validated, we can confidently build real features knowing the foundation is solid.

---

## Core Architectural Principles

### Principle 1: Test-Driven Development - AI-Adapted

**Traditional TDD adapted for AI coding workflows while maintaining core testing discipline.**

**Core requirements:**
- Write ALL tests for a feature BEFORE writing implementation code
- Run tests to verify they fail (Red phase - proves tests are valid)
- Implement feature to make tests pass (Green phase)
- Refactor during code review cycle
- No code ships without corresponding tests

**AI-adapted practices:**
- **Batch test writing**: Write complete test suite for feature at once (not one test at a time)
- **Complete implementations**: Implement full feature after tests exist (not minimal code increments)
- **Scope-appropriate cycles**: Determine TDD cycle boundary based on task scope and natural code boundaries
- **Explicit cycle declaration**: State your chosen scope before starting

**Implementation:**
- Jest + jest-dom + user-event + MSW for UI packages (web, mobile)
- Co-located tests in `src/` directory next to source code
- Coverage thresholds: 10% during Phase 1 (infrastructure), 80% in Phase 2+ (features)
- Pre-commit hooks enforce test execution before commit

**Rationale:** Maintains TDD's core value (tests prove intent before implementation) while adapting mechanics to AI agent's batch-oriented, complete-implementation workflow.

---

### Principle 2: Type Safety End-to-End

**Single source of truth with compile-time validation across all layers.**

**Flow:**
```
Zod Schema (source) → OpenAPI Spec → TypeScript Types → Type-Safe Client → UI/Mobile
       ↓
  Prisma Schema → Generated Types → Type-Safe Data Access → API Server
```

**Implementation:**
- Define API contracts as Zod schemas in `packages/schemas` (single source of truth)
- Generate OpenAPI specification from Zod schemas using `@asteasolutions/zod-to-openapi`
- Generate TypeScript types from OpenAPI spec using `openapi-typescript`
- Use Prisma for database layer with PostgreSQL-specific types
- All projects use TypeScript strict mode (`strict: true`)

**Benefits:**
- Compile-time type safety prevents runtime errors
- Generated types eliminate drift between documentation and implementation
- AI agents get full autocomplete and type checking
- Refactoring is safe and automated

**Rationale:** Type safety is non-negotiable. The cost of maintaining type safety is far lower than the cost of debugging runtime type errors in production.

---

### Principle 3: Monorepo Standards Over Framework Defaults

**Framework generators create working code but violate monorepo-wide standards.**

**Critical rule:** Post-generation checklist execution is mandatory, not optional.

**Common conflicts:**
- Test location: Generators default to `__tests__/`, we use co-located `src/**/*.spec.ts`
- TypeScript module resolution: Generators use outdated `node10`, we use `bundler` (production) and `nodenext` (tests)
- Configuration inheritance: Generators duplicate config, we use workspace presets

**Process:**
1. Before `nx g` command: Read `docs/memories/adopted-patterns/` for standards
2. Run generator: Accept scaffolded code
3. After `nx g` command: Execute ALL steps in `docs/memories/post-generation-checklist/`
4. Validate: Run lint, test, build targets to verify

**Rationale:** Consistency across 10+ monorepo projects is more valuable than individual framework convenience. Standards prevent cognitive overhead and enable AI-driven development.

---

### Principle 4: Configuration-Driven Consistency

**Explicit configuration prevents silent failures and platform-specific bugs.**

**Patterns:**
- TypeScript uses dual module resolution: `bundler` for production, `nodenext` for tests
- Jest uses workspace preset inheritance with per-project customization
- Prisma uses PostgreSQL-specific types and explicit table mapping
- Git uses `.gitattributes` for line endings (no platform-specific surprises)

**Anti-pattern:** Relying on framework defaults creates implicit dependencies that break when environments change.

**Rationale:** Configuration is architecture. Explicit values document intent and prevent "works on my machine" issues.

---

### Principle 5: Building-Block Philosophy

**Template provides reusable infrastructure patterns, not opinionated business logic.**

**Template responsibilities:**
- Shared infrastructure packages (database, schemas, api-client, auth)
- Authentication infrastructure and security patterns
- Testing frameworks and CI/CD pipelines
- API contract generation and type-safe client tooling
- Database access layer and migration patterns
- Observability baseline and deployment patterns

**Application responsibilities:**
- Authentication UI and user flows
- Domain models and business logic
- Application-specific validation rules
- Deployment platform selections and configurations
- Performance optimization for specific use cases

**Separation principle:** Clear boundaries enable applications to evolve independently while maintaining shared infrastructure standards.

**Rationale:** Reusable patterns scale. Business logic doesn't.

---

### Principle 6: External Validation is Mandatory

**All material planning and architecture decisions MUST be validated against external best practices.**

**Material changes include:**
- New external libraries/frameworks
- Cross-project architecture/build/test/config changes
- Public API contracts or data models
- Security/infrastructure decisions
- Database schema or ORM configuration

**Validation sources:**
- Context7 MCP: Current official documentation
- Exa MCP: Real production code examples
- Web search: Industry standards and consensus

**Process:**
- Plans without research validation covering material changes are INCOMPLETE
- Must not proceed to implementation without external validation or explicit user approval
- Research findings documented in `specs/<feature>/research-validation.md`

**Rationale:** Examining existing code alone misses critical issues. The walking skeleton retrospective proved 3 production bugs were prevented only through MCP research.

---

### Principle 7: Governance Alignment is Mandatory

**All plans MUST verify alignment with existing internal governance.**

**Governance documents:**
- `docs/architecture-decisions.md` - Strategic architectural choices
- `docs/memories/adopted-patterns/` - Monorepo standards and patterns
- `docs/tech-stack.md` - Version pinning and compatibility
- `docs/P1-plan.md` - Current phase/stage requirements

**Process:**
- Verify alignment BEFORE proposing solutions
- Plans that contradict governance require explicit justification
- Exceptions documented in per-feature exceptions docket
- Exceptions are scoped, time-bound, and reviewable

**Rationale:** Prevents planning drift by requiring verification against institutional knowledge before design begins.

---

### Principle 8: Business-Accessible Code Communication

**Write code that product managers and non-technical stakeholders can read.**

**Practices:**
- Use business-domain language in variable names and function names
- Explain business purpose AND technical implementation in comments
- Document trade-offs that affect business decisions

**Example:**
```typescript
// ❌ Technical-only comment
// Validates JWT token signature using HMAC-SHA256

// ✅ Business + Technical comment
// Ensures only logged-in users can access this endpoint
// (Validates JWT authentication token signature using HMAC-SHA256)
```

**Rationale:** Code is documentation. Business stakeholders should understand logic without reverse-engineering. Reduces communication overhead between engineering and product teams.

---

## Monorepo Structure & Boundaries

### Directory Architecture

```
nx-monorepo/
├── apps/                      # Applications (what you build)
│   ├── web/                   # Next.js web application
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router pages
│   │   │   └── components/    # React components (tests co-located)
│   │   ├── project.json       # Nx project configuration
│   │   ├── jest.config.ts     # Jest configuration
│   │   └── tsconfig.*.json    # TypeScript configurations
│   ├── web-e2e/               # Playwright E2E tests for web
│   │   ├── src/*.spec.ts      # E2E test specs
│   │   └── playwright.config.ts
│   └── server/                # Express API server
│       ├── src/
│       │   ├── main.ts        # Server entry point
│       │   ├── routes/        # REST+OpenAPI endpoints
│       │   └── openapi/       # OpenAPI infrastructure
│       └── project.json
├── packages/                  # Shared libraries (buildable)
│   ├── database/              # Prisma client + utilities
│   │   ├── src/
│   │   │   ├── index.ts       # Public API
│   │   │   └── client.ts      # Prisma singleton
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Database schema
│   │   │   └── migrations/    # Migration history
│   │   └── project.json
│   ├── schemas/               # Zod schemas + TypeScript types
│   │   ├── src/lib/*.schema.ts
│   │   └── project.json
│   ├── api-client/            # REST API client
│   │   ├── src/
│   │   │   ├── index.ts       # API client factory
│   │   │   └── generated/     # OpenAPI-generated types (gitignored)
│   │   └── project.json
│   └── supabase-client/       # Supabase client factories
│       ├── src/index.ts       # Browser/server factories
│       └── project.json
├── docs/                      # Project documentation
│   ├── architecture.md        # This file
│   ├── PRD.md                 # Product requirements
│   ├── P1-plan.md             # Implementation plan
│   ├── tech-stack.md          # Version inventory
│   └── memories/              # Institutional knowledge (Cogno)
└── .ruler/                    # AI agent instructions
    └── AGENTS.md              # Source for agent rules
```

### Dependency Flow (Enforced)

```
apps/web ────┐
             ├──> packages/api-client ──> packages/schemas
apps/mobile ─┘                                    ↑
                                                  │
apps/server ──> packages/database ───────────────┘
                       │
                       └──> packages/supabase-client
```

**Rules:**
1. **Unidirectional**: Applications depend on packages, never the reverse
2. **No app-to-app imports**: Applications cannot import from other applications
3. **No circular dependencies**: Package dependency graph must be acyclic
4. **Buildable libraries**: All packages must compile independently with proper TypeScript exports

**Verification:**
```bash
pnpm exec nx graph  # Visualize dependency graph
```

### Package Naming Convention

All packages use scoped naming: `@nx-monorepo/<package-name>`

**Import pattern:**
```typescript
import { createApiClient } from '@nx-monorepo/api-client';
import { userSchema } from '@nx-monorepo/schemas';
import { prisma } from '@nx-monorepo/database';
```

TypeScript path aliases configured in `tsconfig.base.json` and managed automatically by Nx.

---

## Type Safety Architecture

### The Type Generation Pipeline

**Single Source of Truth: Zod Schemas**

```typescript
// packages/schemas/src/lib/health.schema.ts
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const HealthResponseSchema = z.object({
  status: z.literal('ok').openapi({ example: 'ok' }),
  timestamp: z.number().openapi({ example: 1729800000000 }),
  message: z.string().openapi({ example: 'Server is running' }),
}).openapi('HealthCheckResponse');
```

**Step 1: Runtime OpenAPI Generation**

Server generates OpenAPI spec at runtime from Zod schemas:

```typescript
// apps/server/src/openapi/registry.ts
import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

export const registry = new OpenAPIRegistry();

export function buildOpenApiDocument(): OpenAPIObject {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: '3.1.0',
    info: { title: 'API', version: '1.0.0' },
    servers: [{ url: '/api' }],
  });
}
```

**Step 2: OpenAPI Spec as Build Artifact**

Nx target writes spec to `dist/apps/server/openapi.json`:

```json
{
  "targets": {
    "spec-write": {
      "executor": "nx:run-commands",
      "dependsOn": ["build"],
      "outputs": ["{workspaceRoot}/dist/apps/server/openapi.json"]
    }
  }
}
```

**Step 3: TypeScript Type Generation**

`openapi-typescript` generates types from spec:

```json
{
  "targets": {
    "generate-types": {
      "executor": "nx:run-commands",
      "command": "openapi-typescript ../../dist/apps/server/openapi.json -o src/generated/api.d.ts",
      "dependsOn": ["^spec-write"]
    }
  }
}
```

**Step 4: Type-Safe HTTP Client**

`openapi-fetch` provides compile-time type safety:

```typescript
import createClient from 'openapi-fetch';
import type { paths } from './generated/api';

const client = createClient<paths>({ baseUrl: process.env.API_URL });

// Fully typed - autocomplete for paths, params, responses
const { data, error } = await client.GET('/health');
```

### Nx Task Graph

```
packages/schemas (Zod schemas)
     ↓
apps/server:build (compile)
     ↓
apps/server:spec-write (generate OpenAPI JSON)
     ↓
packages/api-client:generate-types (TypeScript types)
     ↓
packages/api-client:build (compile)
     ↓
apps/web:build (consume types)
```

**Benefits:**
- Single command rebuilds everything: `pnpm exec nx run-many -t build`
- Nx caching works correctly (inputs/outputs configured)
- Type errors caught at compile time, not runtime

### Database Type Safety

**Prisma generates types from database schema:**

```prisma
// packages/database/prisma/schema.prisma
model HealthCheck {
  id        String   @id @default(uuid()) @db.Uuid
  message   String   @db.Text
  timestamp DateTime @default(now()) @db.Timestamptz

  @@map("health_checks")
}
```

**Generated types:**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fully typed - autocomplete for fields, methods
const check = await prisma.healthCheck.create({
  data: { message: 'OK' }  // TypeScript knows 'message' field exists
});
```

**Type flow:**
1. Define Prisma schema
2. Run `prisma generate` to create types
3. Import `@prisma/client` in code
4. Get full type safety for all database operations

---

## Technology Stack & Decisions

### Core Technologies

**Web Stack:**
- Next.js 15.2 (App Router, React Server Components)
- React 19 (latest concurrent features)
- Tailwind CSS (utility-first styling)

**Server Stack:**
- Express 4.x (mature HTTP server)
- REST+OpenAPI (type-safe API contracts)
- Zod (runtime validation)

**Database Stack:**
- Supabase (managed PostgreSQL)
- Prisma 6.x (ORM with type generation)
- Dual-connection strategy (Supavisor pooler)

**Testing Stack:**
- Jest 30 (unit/integration testing)
- Playwright 1.56 (E2E browser testing)
- Testing Library (React component testing)

**Tooling:**
- Nx 21.6 (monorepo build system)
- TypeScript 5.9 (strict mode)
- ESLint 9 (flat config)
- Prettier (code formatting)
- pnpm 10.19 (fast package manager)

**Complete version inventory:** See `docs/tech-stack.md`

### Decision: REST+OpenAPI Over RPC Frameworks

**Selected: REST+OpenAPI with code-first generation**

**Toolchain:**
- `@asteasolutions/zod-to-openapi` (v8.1) - Generate OpenAPI from Zod
- `openapi-typescript` (v7.10) - Generate TypeScript types from OpenAPI
- `openapi-fetch` (v0.14) - Type-safe HTTP client (5-6KB bundle)

**Why REST+OpenAPI:**
1. **Zero vendor lock-in** - Industry standard with infinite tooling options
2. **AI-agent optimized** - OpenAPI is MCP standard with vast training data
3. **Future-proof** - Works with any backend language, any HTTP client
4. **Mobile-ready** - Battle-tested in React Native with universal fetch support
5. **Maximum flexibility** - Can switch technologies without client changes

**Alternatives considered:**
- oRPC: Simpler setup but vendor lock-in, small ecosystem, limited AI training data
- tRPC: Excellent Next.js integration but React Native polyfills required
- ts-rest: Good Nx integration but zero React Native validation
- Hono RPC: Requires replacing Express (non-starter)

**Rationale:** Walking skeleton phase is ideal time to establish best practices. REST+OpenAPI's maximum flexibility and zero vendor lock-in outweigh RPC frameworks' short-term velocity gains.

**Research source:** `docs/architecture-decisions.md` - Comprehensive framework evaluation with scoring matrix

### Decision: Supabase + Prisma Architecture

**Connection Strategy:**

```
┌─────────────────────────────────────────┐
│ Supabase Cloud Project                  │
│  ├─ PostgreSQL Database (data storage)  │
│  └─ Auth Service (login/signup)         │
└─────────────────────────────────────────┘
           ↑                    ↑
    DATABASE_URL         SUPABASE_URL + Keys
    (PostgreSQL)         (HTTP API)
           ↑                    ↑
    ┌──────┴─────┐      ┌──────┴───────┐
    │   Prisma   │      │ Supabase SDK │
    │    (ORM)   │      │   (Auth)     │
    └──────┬─────┘      └──────┬───────┘
           ↑                    ↑
    ┌──────┴──────┐    ┌───────┴────────┐
    │ apps/server │    │   apps/web     │
    │  (Express)  │◄───│   (Next.js)    │
    └─────────────┘    └────────────────┘
```

**Dual-connection approach:**
1. **Server uses Prisma** (via `DATABASE_URL`) for all database operations
2. **Web/Mobile use Supabase SDK** (via `SUPABASE_URL` + keys) for authentication ONLY
3. **Data operations** flow through Express API (never direct client → database)

**Database URLs:**
```bash
# Transaction Mode (Port 6543) - Prisma queries
DATABASE_URL="postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:6543/postgres"

# Session Mode (Port 5432) - Prisma migrations
DIRECT_URL="postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

**Supavisor connection pooler:**
- Better scalability with connection pooling
- Follows 2025 Supabase + Prisma best practices
- Transaction mode for queries, session mode for migrations

**Row Level Security (RLS):**
- RLS enabled on all tables for defense-in-depth
- Server uses service_role key (bypasses RLS)
- Protection against accidental Data API exposure

**Why this architecture:**
1. **Clear security boundary** - API server controls all data access
2. **Consistent pattern** - Web and mobile apps identical (both call same API)
3. **Flexibility** - Can switch databases without touching client apps
4. **Testability** - Easy to mock API, not database

**Research source:** `docs/architecture-decisions.md` - Stage 4.2 (Supabase & Database Architecture)

### Decision Matrix

| Decision | Choice | Rationale | Alternatives Considered |
|----------|--------|-----------|-------------------------|
| **API Framework** | REST+OpenAPI | No vendor lock-in, AI-friendly, mobile-ready | oRPC (too new), tRPC (mobile polyfills), ts-rest (no mobile validation) |
| **Spec Generation** | Code-First (Zod) | Single source of truth, runtime validation | Spec-first (manual YAML), tsoa (decorator coupling) |
| **Database** | Prisma + Supabase | Type safety, migrations, connection pooling | Drizzle (less mature), TypeORM (no generated types) |
| **Schema Mgmt** | Prisma Migrate | Production-grade history, reproducible | db push (no history), manual SQL (error prone) |
| **Auth Strategy** | Supabase Auth | Secure, handled by platform | NextAuth (more code), Clerk (more code), Custom (security risk) |
| **Testing** | Jest + Playwright | Industry standard, comprehensive | Vitest (ecosystem gaps), Cypress (slower execution) |
| **Build System** | Nx | Caching, task graph, distributed execution | Turborepo (less structure), Lerna (slower) |

---

## Development Patterns

### Pattern 1: Co-Located Tests

**Standard: Tests live in `src/` next to source code**

```
apps/web/src/
├── app/
│   ├── page.tsx
│   └── page.spec.tsx        # ✅ Co-located test
├── components/
│   ├── Button.tsx
│   └── Button.spec.tsx      # ✅ Co-located test
└── utils/
    ├── format.ts
    └── format.spec.ts       # ✅ Co-located test
```

**Not this:**
```
apps/web/
├── src/
│   └── components/Button.tsx
└── __tests__/               # ❌ Separate test directory
    └── Button.spec.tsx
```

**Rationale:**
- Tests close to implementation improve discoverability
- Easier to maintain tests when refactoring
- Follows Next.js 15 recommended conventions
- Nx generators default to separate directories - must fix post-generation

**Reference:** `docs/memories/adopted-patterns/module-01-pattern-1-test-file-location.md`

### Pattern 2: TypeScript Dual Module Resolution

**Standard: `bundler` for production, `nodenext` for tests**

**Base config (`tsconfig.base.json`):**
```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
```

**Test config (`tsconfig.spec.json`):**
```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext"
  }
}
```

**Why bundler for production:**
- Matches bundler-everywhere architecture (Next.js, esbuild, Metro)
- Allows extension-less imports: `import { x } from './file'`
- More ergonomic developer experience

**Why nodenext for tests:**
- Jest runs in Node.js runtime with ts-jest transpilation
- `bundler` requires `module: "preserve"` which is incompatible with Jest
- `nodenext` is detection-based and works with both ESM and CJS

**Post-generation fix:**
Nx generators default to `node10` (outdated). Always update to `nodenext` after generating test configs.

**Reference:** `docs/memories/adopted-patterns/module-02-pattern-2-typescript-module-resolution.md`

### Pattern 3: Express Path-Agnostic Routers

**Standard: Routers don't know their mount path**

**Router implementation:**
```typescript
// apps/server/src/routes/health.ts
import { Router } from 'express';

export const healthRouter = Router();

// ✅ Path-agnostic - relative to mount point
healthRouter.get('/', getHealthStatus);
healthRouter.post('/ping', pingHealth);
```

**Mount in main.ts:**
```typescript
// apps/server/src/main.ts
import { healthRouter } from './routes/health';

app.use('/api/health', healthRouter);  // Mount point defined here
```

**Why path-agnostic:**
- Routers are reusable and composable
- Easy to reorganize API structure without changing router code
- Scales to nested routing without hardcoded paths

**Anti-pattern:**
```typescript
// ❌ Path-aware - hardcodes mount point
healthRouter.get('/api/health', getHealthStatus);  // Don't do this
```

**Reference:** `docs/memories/adopted-patterns/module-05-pattern-5-express-route-organization-path-agnostic-routers.md`

### Pattern 4: Prisma Conventions

**Standard: PostgreSQL-specific types with snake_case naming**

```prisma
model HealthCheck {
  id        String   @id @default(uuid()) @db.Uuid
  message   String   @db.Text
  timestamp DateTime @default(now()) @db.Timestamptz
  
  @@map("health_checks")  // Explicit table name mapping
}
```

**Conventions:**
- Primary keys: `@id @default(uuid()) @db.Uuid`
- Timestamps: `@default(now()) @db.Timestamptz`
- Table names: snake_case with `@@map()`
- Field names: camelCase in schema, snake_case in database

**Why Supabase-compatible naming:**
- Supabase dashboard expects snake_case
- PostgreSQL convention is snake_case
- Prisma handles camelCase ↔ snake_case mapping automatically

**Reference:** `docs/memories/adopted-patterns/module-09-pattern-8-prisma-schema-conventions.md`

### Pattern 5: Prisma Client Singleton

**Standard: Single Prisma instance across application**

```typescript
// packages/database/src/lib/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Why singleton:**
- Prevents connection pool exhaustion
- Hot reload in development doesn't create new clients
- Recommended pattern by Prisma official docs

**Usage:**
```typescript
import { prisma } from '@nx-monorepo/database';

const users = await prisma.user.findMany();
```

**Reference:** `docs/memories/adopted-patterns/module-10-pattern-9-prisma-client-singleton.md`

### Pattern 6: Lifecycle Management (Loading, Errors, Retries)

**Standard: Explicit state handling with type-safe clients**

**Loading States:**
- Use React Server Components (RSC) with Suspense for initial data load
- Use `useTransition` or `useOptimistic` for mutations
- Avoid manual `isLoading` state where possible (prefer framework primitives)

**Client-Side Data Fetching (if needed):**
```typescript
// Manual loading state (when not using SWR/TanStack Query)
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function loadData() {
  try {
    setIsLoading(true);
    setError(null);
    const { data, error } = await client.GET('/resource');
    
    if (error) throw new Error(error.message);
    return data;
  } catch (e) {
    setError(e.message);
  } finally {
    setIsLoading(false);
  }
}
```

**Error Handling Strategy:**
1. **API Layer**: Returns RFC 7807 Problem Details or structured JSON
   - `{ error: "Not Found", code: "RESOURCE_NOT_FOUND", details: ... }`
2. **Client Layer**: `openapi-fetch` returns typed error objects (not exceptions)
   - Check `if (error)` before accessing data
3. **UI Layer**: Error Boundaries for fatal errors, inline messages for validation errors

**Retry Logic:**
`openapi-fetch` is minimal and does **not** include built-in retries.

**Implementation Guidance:**
- **Queries**: Wrap `openapi-fetch` in a utility or use `openapi-react-query` (Phase 2) if retries are critical.
- **Manual Retry**:
```typescript
async function fetchWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i))); // Exponential backoff
    }
  }
}
```

**Rationale:**
- Keeps bundle size small (no heavy query library in walking skeleton)
- Forces explicit error handling (no swallowing exceptions)
- Aligns with "platform primitive" preference (Suspense, Error Boundaries)

---

## Testing Strategy

### Three-Tier Testing Approach

**1. Unit Tests (Jest)**
- **Purpose:** Isolated component and function testing
- **Location:** Co-located in `src/` next to source files
- **Naming:** `*.spec.ts` or `*.spec.tsx`
- **Coverage target:** ≥80% (Phase 2+)

**Example:**
```typescript
// apps/web/src/components/Button.spec.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

**2. Integration Tests (Jest)**
- **Purpose:** Cross-layer interactions (API → database)
- **Location:** Co-located in `src/` next to integration points
- **Naming:** `*.integration.spec.ts`
- **Focus:** Request/response cycles, database operations, external service interactions

**Example:**
```typescript
// apps/server/src/routes/health.integration.spec.ts
import request from 'supertest';
import { app } from '../main';
import { prisma } from '@nx-monorepo/database';

describe('Health API', () => {
  it('stores health ping in database', async () => {
    const response = await request(app).post('/api/health/ping');
    
    expect(response.status).toBe(200);
    
    const pings = await prisma.healthCheck.findMany();
    expect(pings).toHaveLength(1);
  });
});
```

**3. E2E Tests (Playwright)**
- **Purpose:** Full browser-based user journeys
- **Location:** Separate `apps/web-e2e/src/` directory
- **Naming:** `*.spec.ts`
- **Focus:** Complete user workflows across all layers

**Example:**
```typescript
// apps/web-e2e/src/health-check.spec.ts
import { test, expect } from '@playwright/test';

test('health check page displays status', async ({ page }) => {
  await page.goto('/health');
  
  await expect(page.locator('[data-testid="health-status"]'))
    .toContainText('Server is running');
});
```

### Jest Configuration Hierarchy

**Workspace preset (`jest.preset.js`):**
```javascript
module.exports = {
  coverageDirectory: '../../coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['@swc/jest', { /* config */ }],
  },
};
```

**Project config (`apps/web/jest.config.ts`):**
```typescript
export default {
  displayName: 'web',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',  // Override for React tests
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
};
```

**Benefits:**
- Shared configuration reduces duplication
- Per-project customization where needed
- Easy to update workspace-wide settings

### Coverage Strategy

**Phase 1 (Current):**
- Tests exist and pass
- Coverage measured but not enforced
- Target: ≥10% to validate infrastructure

**Phase 2 (Post-MVP):**
- Coverage enforced at ≥80%
- Pre-commit hooks report coverage warnings
- PR merge gates block coverage decreases

**Coverage commands:**
```bash
# Run tests with coverage
pnpm exec nx run web:test --coverage

# View coverage report
open coverage/apps/web/lcov-report/index.html
```

**Reference:** `docs/memories/testing-reference/` modules

---

## Security Architecture

### API Server as Security Boundary

**Principle: All data access flows through API server**

```
┌─────────────┐
│   Browser   │ ───── Supabase SDK (auth only)
│  (Untrusted)│ ───── openapi-fetch client
└──────┬──────┘
       │ HTTP requests (authenticated)
       ↓
┌─────────────────┐
│  Express API    │ ◄─── Security boundary enforced here
│  (Trusted)      │      - Authentication checks
│                 │      - Authorization logic
│                 │      - Input validation
└───────┬─────────┘
        │ Prisma queries
        ↓
┌─────────────────┐
│  PostgreSQL DB  │
│  (Protected)    │
└─────────────────┘
```

**Security layers:**
1. **Authentication** - Supabase SDK handles login/signup/sessions
2. **Authorization** - API server validates permissions before data access
3. **Validation** - Zod schemas validate all inputs
4. **Database protection** - RLS enabled as defense-in-depth

### Authentication Architecture

**Client-side (Web/Mobile):**
```typescript
import { createSupabaseBrowserClient } from '@nx-monorepo/supabase-client';

const supabase = createSupabaseBrowserClient();

// Sign in
await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Get session
const { data: { session } } = await supabase.auth.getSession();
```

**Server-side (API):**
```typescript
import { createSupabaseServerClient } from '@nx-monorepo/supabase-client';

export async function authMiddleware(req, res, next) {
  const supabase = createSupabaseServerClient();
  
  const { data: { user }, error } = await supabase.auth.getUser(
    req.headers.authorization?.replace('Bearer ', '')
  );
  
  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  req.user = user;
  next();
}
```

### Row Level Security (RLS)

**Strategy: Enabled with service_role bypass**

```sql
-- Enable RLS (defense-in-depth)
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;

-- No policies needed - service_role key bypasses RLS
-- Protects against accidental Data API exposure
```

**Why enabled:**
- Defense-in-depth security (database-level safety net)
- Protection against accidental Supabase Data API exposure
- Follows Supabase + Prisma best practices
- Minimal complexity (no policy logic needed)

**How it works:**
- Prisma connects as PostgreSQL superuser (bypasses RLS automatically)
- Supabase SDK with service_role key bypasses RLS through PostgREST
- API server gets full access, accidental exposure is blocked

**Reference:** `docs/architecture-decisions.md` - Stage 4.2 (RLS strategy)

### Input Validation

**All API inputs validated with Zod schemas:**

```typescript
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  completed: z.boolean().optional().default(false),
});

app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  const task = await prisma.task.create({ data: result.data });
  res.status(201).json(task);
});
```

**Benefits:**
- Runtime validation prevents invalid data
- Type safety from validation schemas
- Clear error messages for clients
- SQL injection prevention (Prisma escapes all inputs)

---

## Build & Deployment

### Nx Task Orchestration

**Nx automatically manages task dependencies:**

```bash
# Build everything in correct order
pnpm exec nx run-many -t build

# Build only affected projects
pnpm exec nx affected -t build
```

**Task graph example:**
```
packages/schemas:build
     ↓
apps/server:build → apps/server:spec-write
     ↓                     ↓
     └────────► packages/api-client:generate-types
                           ↓
                packages/api-client:build
                           ↓
                    apps/web:build
```

**Benefits:**
- Automatic build ordering
- Parallel execution where possible
- Intelligent caching (only rebuild what changed)
- Distributed task execution (via Nx Cloud)

### CI/CD Pipeline

**GitHub Actions workflow (`.github/workflows/ci.yml`):**

```yaml
- name: Install dependencies
  run: npm ci --legacy-peer-deps

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run quality gates
  run: pnpm exec nx run-many -t lint test build typecheck e2e
```

**Quality gates enforced:**
1. **Linting** - ESLint checks code quality
2. **Testing** - Jest unit/integration tests
3. **Building** - TypeScript compilation
4. **Type checking** - Strict type validation
5. **E2E** - Playwright browser tests

**Self-healing CI:**
```bash
# If failures occur, attempt fix
pnpm exec nx fix-ci
```

### Pre-Commit Hooks

**Husky + lint-staged enforce quality before commit:**

```bash
# .husky/pre-commit
pnpm exec lint-staged
NX_DAEMON=false pnpm exec nx affected -t test --base=HEAD~1
```

**What runs:**
- **lint-staged**: ESLint + Prettier on staged files only
- **Affected tests**: Tests only for changed projects (not entire workspace)

**Why NX_DAEMON=false:**
- Prevents Jest hanging on Windows
- Applies to all platforms for consistency
- 5-10 second overhead acceptable for reliability

**Benefits:**
- Catches issues before they enter version control
- Fast (only checks affected code)
- Scales as monorepo grows

---

## Quality Gates & Governance

### Mandatory Quality Gates

**Pre-commit (automated):**
- Lint staged files (ESLint + Prettier)
- Run tests for affected projects
- Commit blocked on failures

**CI (automated):**
- Full lint across workspace
- All tests (unit + integration + E2E)
- Build verification
- Type checking
- Coverage reporting (measured, not enforced in Phase 1)

**PR merge (enforced):**
- All CI checks pass
- Code review approved
- No merge conflicts
- Branch up to date with main

### Documentation Alignment

**Memory system (Cogno):**
- Location: `docs/memories/`
- Purpose: Institutional knowledge and patterns
- Structure: Layered with core summaries and detailed modules

**Governance cascade:**
```
docs/*.md (canonical governance)
     ↓
docs/memories/zdx-cogno-architecture.md (system design)
     ↓
docs/memories/README.md + modules (operational guidance)
     ↓
.ruler/AGENTS.md (agent execution rules)
```

**Critical rules:**
1. Always read `docs/memories/adopted-patterns/` before `nx g` commands
2. Execute ALL steps in `docs/memories/post-generation-checklist/` after generation
3. Document technical decisions in `docs/memories/tech-findings-log/`
4. NEVER edit `CLAUDE.md` directly (edit `.ruler/AGENTS.md` instead)

### Version Management

**Pinning strategy:**
- **Exact**: Testing/tooling (Jest, Nx, Playwright, ESLint)
- **Tilde (~)**: Frameworks (TypeScript, Next.js) - patch updates only
- **Caret (^)**: Libraries (Express, Prisma) - minor + patch updates

**Agent rules:**
1. MUST use exact versions specified in `package.json`
2. MUST read `docs/tech-stack.md` before suggesting version changes
3. MUST verify compatibility using Context7 MCP and web search
4. MAY suggest updates with rationale, but MUST NOT update without approval

**Critical synchronization:**
- All `@nx/*` packages must match `nx` core version exactly
- All `jest-*` packages must match `jest` core version exactly
- `prisma` CLI and `@prisma/client` should match

**Reference:** `docs/tech-stack.md` - Complete version inventory and pinning rationale

### Verification Protocol

**Before marking task complete:**
1. Run validation commands and capture outputs
2. Attempt 4+ remediation cycles for failures
3. Document verification in delivery notes
4. Escalate unresolved blockers immediately
5. **ADMIT FAILURE rather than claiming premature success**

**Validation commands:**
```bash
pnpm exec nx affected -t lint test build
pnpm exec nx run-many -t typecheck
pnpm exec nx run-many -t e2e
```

---

## Implementation Guidance

### Adding a New API Endpoint

**Step-by-step process:**

1. **Define Zod schema** (in `packages/schemas`):
   ```typescript
   export const CreateTaskSchema = z.object({
     title: z.string().min(1).max(200),
     completed: z.boolean().default(false),
   }).openapi('CreateTaskRequest');
   ```

2. **Create OpenAPI registration** (`apps/server/src/routes/tasks.openapi.ts`):
   ```typescript
   registry.registerPath({
     method: 'post',
     path: '/tasks',
     request: { body: { content: { 'application/json': { schema: CreateTaskSchema } } } },
     responses: { 201: { /* ... */ } },
   });
   ```

3. **Implement route handler** (`apps/server/src/routes/tasks.ts`):
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

4. **Register in aggregator** (`apps/server/src/openapi/register.ts`):
   ```typescript
   import { registerTasksOpenApi } from '../routes/tasks.openapi';
   registerTasksOpenApi();  // Add to initOpenApi()
   ```

5. **Verify**:
   ```bash
   pnpm exec nx run server:spec-write    # Generate OpenAPI
   pnpm exec nx run api-client:generate-types  # Generate types
   pnpm exec nx run server:serve         # Start server
   ```

6. **Use in client**:
   ```typescript
   import { apiClient } from '@nx-monorepo/api-client';
   
   const { data, error } = await apiClient.POST('/api/tasks', {
     body: { title: 'Buy groceries', completed: false }
   });  // Fully typed!
   ```

### Adding a New Shared Library

**Step-by-step process:**

1. **Generate library** (choose appropriate plugin):
   ```bash
   # TypeScript-only library
   pnpm exec nx g @nx/js:library my-lib --directory=packages/my-lib --bundler=tsc
   
   # Node.js-specific library
   pnpm exec nx g @nx/node:library my-lib --directory=packages/my-lib --bundler=tsc
   ```

2. **Execute post-generation checklist**:
   - Read `docs/memories/post-generation-checklist/`
   - Update TypeScript module resolution in test configs
   - Verify test location matches Pattern 1 (co-located in `src/`)
   - Validate Jest configuration matches Pattern 3

3. **Implement and export**:
   ```typescript
   // packages/my-lib/src/lib/my-lib.ts
   export function myFunction() {
     return 'Hello from my-lib';
   }
   
   // packages/my-lib/src/index.ts
   export * from './lib/my-lib';
   ```

4. **Add dependencies to consumers**:
   ```json
   {
     "dependencies": {
       "@nx-monorepo/my-lib": "workspace:*"
     }
   }
   ```

5. **Verify build**:
   ```bash
   pnpm exec nx run my-lib:build
   pnpm exec nx run my-lib:test
   pnpm exec nx run my-lib:lint
   ```

6. **Check dependency graph**:
   ```bash
   pnpm exec nx graph  # Verify no circular dependencies
   ```

### Troubleshooting Common Issues

**Issue: Tests hang on Windows**

Solution: Use `NX_DAEMON=false` environment variable:
```bash
NX_DAEMON=false pnpm exec nx run-many -t test
```

**Reference:** `docs/memories/troubleshooting/` for comprehensive troubleshooting guide

**Issue: TypeScript path resolution errors**

Verify:
1. Dependency declared in `package.json`
2. Package has been built: `pnpm exec nx run <package>:build`
3. Module resolution correct in `tsconfig.spec.json`

**Issue: OpenAPI types not generated**

Verify task order:
```bash
pnpm exec nx run server:spec-write      # Must run first
pnpm exec nx run api-client:generate-types  # Depends on spec-write
```

---

## References

### Internal Documentation

- `docs/PRD.md` - Product requirements and vision
- `docs/P1-plan.md` - Implementation plan and roadmap
- `docs/tech-stack.md` - Version inventory and compatibility
- `docs/memories/adopted-patterns/` - Development patterns
- `docs/memories/testing-reference/` - Testing configuration
- `docs/memories/post-generation-checklist/` - Post-generator fixes
- `docs/memories/tech-findings-log/` - Technical decisions log
- `.ruler/AGENTS.md` - AI agent operational rules

### External Resources

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAPI Specification 3.1](https://spec.openapis.org/oas/v3.1.0)

---

## Document Maintenance

**This document should be updated when:**
- Core architectural principles change
- Major technology decisions are made
- New development patterns are established
- Quality gates or governance processes evolve

**Cascade maintenance:**
When this document changes, verify alignment with:
1. `docs/PRD.md` (product vision)
2. `docs/memories/zdx-cogno-architecture.md` (Cogno system design)
3. `docs/memories/adopted-patterns/` (implementation patterns)
4. `.ruler/AGENTS.md` (agent execution rules)

**Last Updated:** 2025-11-18
**Status:** Canonical
**Maintainer:** Architecture Team

---

**Version:** 1.0.0
**Ratified:** 2025-11-18
**Next Review:** 2026-02-18 (quarterly)


# Code Style & Conventions

## Critical Rules (NON-NEGOTIABLE)

### TDD - AI-Adapted (constitution.md §I)
- Write ALL tests BEFORE implementation code
- Batch test writing allowed (not one test at a time)
- Run tests to verify they fail (Red), then implement (Green)
- No code ships without tests

### Quality Gates (constitution.md §II)
- Pre-commit: `lint-staged` + `nx affected -t test`
- CI: `pnpm exec nx run-many -t lint test build typecheck e2e`
- Never bypass quality gates

### Memory System (constitution.md §IV)
- READ `docs/memories/adopted-patterns/` BEFORE `nx g` commands
- EXECUTE `docs/memories/post-generation-checklist/` AFTER generation
- NEVER edit `CLAUDE.md` directly — only `.ruler/AGENTS.md`

## TypeScript Conventions

### Module Resolution
- **Production**: `moduleResolution: "bundler"` (tsconfig.base.json)
- **Tests**: `moduleResolution: "nodenext"` (tsconfig.spec.json)
- **Always**: `strict: true`, no `as` casting

### Package Imports
```typescript
import { schema } from '@nx-monorepo/schemas';
import { prisma } from '@nx-monorepo/database';
import { createApiClient } from '@nx-monorepo/api-client';
```

## Test Conventions

### Location (MANDATORY)
Tests MUST be co-located in `src/` next to source files:
```
src/
├── components/
│   ├── Button.tsx
│   └── Button.spec.tsx  ← co-located test
```
❌ Never use `__tests__/` or `specs/` directories

### Naming
- Unit/component tests: `*.spec.ts` or `*.spec.tsx`
- Integration tests: `*.integration.spec.ts`

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Packages | `@nx-monorepo/<name>` | `@nx-monorepo/api-client` |
| DB tables | snake_case + `@@map()` | `health_checks` |
| Prisma models | PascalCase | `HealthCheck` |
| API routes | kebab-case | `/api/health-check` |

## API Contracts

### Type Flow (Single Source of Truth)
```
Zod Schema → OpenAPI Spec → TypeScript Types → Type-Safe Client
```

### Error Handling
```typescript
const { data, error } = await client.GET('/resource');
if (error) { /* handle typed error */ }
```

## Key Patterns by File Type

| When generating... | Must follow... |
|--------------------|----------------|
| Any Nx project | `adopted-patterns/` + `post-generation-checklist/` |
| Jest config | Extend `jest.preset.js`, use `@swc/jest` |
| TypeScript config | Production = bundler, Tests = nodenext |
| Prisma models | UUID pk, timestamptz, snake_case tables |

**Authoritative sources:** constitution.md, adopted-patterns/, tech-stack.md
**Last synced:** 2025-12-04

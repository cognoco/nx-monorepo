# Implementation Guide

> **Status**: EMBRYO - This guide is a placeholder awaiting full development.

## Document History

This implementation guide was identified as a gap during the architecture document consolidation (2025-12-02). During an architecture validation review, Vimes (Architect Agent) compared `docs/architecture.md` against the legacy `_wip/architecture_old.md` and found that 94% of the old document's content had been correctly relocated to its proper tier per the documentation hierarchy (`docs/index.md`).

Two items were identified as "partial gaps" — content that existed in the old monolithic architecture document but had no designated home in the tiered structure:

1. **Retry Logic Code Example** — Implementation guidance for `openapi-fetch` retry patterns
2. **Adding a Shared Library Guide** — Step-by-step process for `nx g` with post-generation checklist

Rather than polluting `architecture.md` (which is scoped to HOW, not step-by-step playbooks), these items are seeded here as the embryo of the planned implementation guide.

---

## Planned Scope

When fully developed, this guide should cover:
- How-to playbooks for common development tasks
- Code examples for patterns referenced in `architecture.md`
- Step-by-step guides for API, database, frontend, and security implementations

**See**: `docs/index.md` (Tier 2: Architecture → `implementation-guide/` planned)

---

## Seeded Content

### 1. Retry Logic for openapi-fetch

**Context**: `openapi-fetch` is minimal and does NOT include built-in retries. This pattern provides manual retry with exponential backoff.

**Source**: Migrated from `_wip/architecture_old.md` lines 856-872 during 2025-12-02 consolidation.

```typescript
/**
 * Wraps an async function with retry logic using exponential backoff.
 *
 * Use this when network reliability is critical and the operation is idempotent.
 * DO NOT use for non-idempotent operations (POST creating resources) without
 * additional safeguards (idempotency keys).
 *
 * @param fn - Async function to retry
 * @param retries - Maximum retry attempts (default: 3)
 * @returns Result of fn() on success
 * @throws Last error after all retries exhausted
 */
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      // Exponential backoff: 1s, 2s, 4s...
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Unreachable');
}

// Usage with openapi-fetch
const result = await fetchWithRetry(() =>
  apiClient.GET('/api/health')
);
```

**Related**: `architecture.md` Lifecycle Patterns mentions "Manual exponential backoff (no built-in)" — this is the implementation.

---

### 2. Adding a New Shared Library

**Context**: Step-by-step guide for creating buildable packages in the monorepo.

**Source**: Migrated from `_wip/architecture_old.md` lines 1360-1410 during 2025-12-02 consolidation.

#### Prerequisites

Before creating a new library, determine:
- **TypeScript-only vs Node-specific**: Use `@nx/js:library` for pure TypeScript, `@nx/node:library` for Node.js runtime dependencies
- **Bundler strategy**: Always use `--bundler=tsc` for buildable libraries (see `adopted-patterns/` for exceptions)

#### Step-by-Step Process

1. **Read memory system first** (MANDATORY):
   ```bash
   # Check adopted patterns before generation
   cat docs/memories/adopted-patterns/adopted-patterns.core.md
   ```

2. **Generate the library**:
   ```bash
   # TypeScript-only library
   pnpm exec nx g @nx/js:library my-lib --directory=packages/my-lib --bundler=tsc

   # Node.js-specific library
   pnpm exec nx g @nx/node:library my-lib --directory=packages/my-lib --bundler=tsc
   ```

3. **Execute post-generation checklist** (MANDATORY):
   - Read `docs/memories/post-generation-checklist/`
   - Update TypeScript module resolution in `tsconfig.spec.json` to `nodenext`
   - Verify test location matches Pattern 1 (co-located in `src/`)
   - Validate Jest configuration matches Pattern 3

4. **Implement and export**:
   ```typescript
   // packages/my-lib/src/lib/my-lib.ts
   export function myFunction() {
     return 'Hello from my-lib';
   }

   // packages/my-lib/src/index.ts (barrel export)
   export * from './lib/my-lib';
   ```

5. **Add to consumers** (if needed):
   ```json
   {
     "dependencies": {
       "@nx-monorepo/my-lib": "workspace:*"
     }
   }
   ```

6. **Verify**:
   ```bash
   pnpm exec nx run my-lib:build
   pnpm exec nx run my-lib:test
   pnpm exec nx run my-lib:lint
   pnpm exec nx graph  # Verify no circular dependencies
   ```

**Related**:
- `architecture.md` Decision Summary references buildable libraries
- `adopted-patterns/` contains patterns that override generator defaults
- `post-generation-checklist/` contains mandatory post-generation fixes

---

## Future Development

When expanding this guide, consider:
- Adding API endpoint (currently in `architecture.md` lines 289-328)
- Database migrations workflow
- Authentication flow implementation
- E2E test patterns
- Deployment playbooks

Each section should follow the pattern: Context → Prerequisites → Step-by-Step → Verification → Related Docs.

---

**Created**: 2025-12-02
**Status**: Embryo
**Next Action**: Expand during Phase 2 implementation work

# Memory Topic Index

Use this index to locate relevant Cogno content quickly during task execution. For each topic area, start with the listed memory cores and modules, then drill into manifests for precise chunk IDs.

> **Note**: For strategic architectural decisions, see `docs/architecture.md` (Tier 2). This index covers Tier 3 operational patterns.

---

## Architecture & Design
- **Tier 2 Reference**: `docs/architecture.md` (Decision Summary, Implementation Patterns, Project Structure)
- **Tier 2 Reference**: `docs/architecture-decisions.md` (detailed ADRs with rationale)
- `adopted-patterns`: All patterns (operational implementation details)
- Synonyms: system design, patterns, structure, conventions, ADRs

## API & Integration
- **Tier 2 Reference**: `docs/architecture.md` → API Contracts section
- `adopted-patterns`: Pattern 5 (Router Organization), Pattern 6 (OpenAPI Spec), Pattern 7 (TypeScript Types)
- `tech-findings-log`: REST+OpenAPI toolchain entries
- Synonyms: REST, OpenAPI, endpoints, routes, api-client, type-safe client

## Styling & Theming
- `adopted-patterns`: Pattern 5 (Component Styling), Pattern 12 (Dark Mode Implementation)
- `tech-findings-log`: `module-20-next-themes-compatibility.md`
- Synonyms: theming, dark mode, color schemes, UI themes, appearance

## State Management & Context
- `adopted-patterns`: Pattern 8 (State Management)
- `tech-findings-log`: Entries covering React Context, Zustand, or shared state integrations (see manifest tags `state-management`, `context-api`)
- Synonyms: global state, context API, shared state

## Testing & QA
- `testing-reference`: all modules (Jest, MSW, Playwright, coverage)
- `tech-findings-log`: `module-04-testing-jest-workspace-package-resolution-esm-commonjs-2025-10-25.md`, `module-09-testing-jest-hanging-on-windows-in-pre-commit-hooks-2025-10-28.md`
- Synonyms: tests, spec files, unit tests, integration tests, E2E, QA

## TypeScript & Module Resolution
- `adopted-patterns`: Pattern 2 (TypeScript Module Resolution), Pattern 4 (TS configuration for applications)
- `tech-findings-log`: `module-10-typescript-configuration-nx-modern-pattern-workspaces-project-references-not-manual-paths-2025-11-01.md`
- Synonyms: tsconfig, project references, path aliases, moduleResolution

## Generators & Post-Generation Fixes
- `post-generation-checklist`: Generator-specific sections (Next.js, Node, libraries)
- `tech-findings-log`: Entries tagged `generators`, `nx`, `post-generation`
- Synonyms: scaffolds, codegen, Nx generators, post-gen fixes

## Nx Caching & Build Configuration
- `tech-findings-log`: `module-12-nx-configuration-nx-dependson-syntax-string-form-vs-object-form-2025-11-02.md`, `module-20-nx-configuration-custom-target-cache-inputs-2025-12-05.md`
- `adopted-patterns`: Pattern 6 (OpenAPI Spec Generation - includes `spec-write` target configuration)
- Synonyms: cache invalidation, inputs, outputs, dependsOn, custom targets, CI cache

## Supabase & Database
- **Tier 2 Reference**: `docs/architecture.md` → Data Architecture section
- `adopted-patterns`: Pattern 8 (Prisma Schema), Pattern 10 (Prisma Singleton), Pattern 13 (Database Environment Management), Pattern 14 (Migration Management & Rollback)
- `tech-findings-log`: `module-15-database-configuration-supabase-pooler-hostname-discovery-2025-11-04.md`, `module-16-database-configuration-ipv6-requirement-and-free-tier-workaround-2025-11-04.md`
- Synonyms: Prisma, Supabase, database config, migrations, schema, ORM

## Security & Authentication
- **Tier 2 Reference**: `docs/architecture.md` → Security Architecture section
- `tech-findings-log`: RLS policy entries
- Synonyms: auth, RLS, row-level security, JWT, sessions

## Deployment & CI/CD
- **Tier 2 Reference**: `docs/architecture.md` → Deployment Architecture section
- `tech-findings-log`: CI/CD related entries
- Synonyms: build, deploy, CI, GitHub Actions, quality gates

---

**Adding new topics?** Keep entries concise, list the primary core/modules, and include key synonyms to aid search. For strategic decisions, reference `docs/architecture.md` sections. Remember to update manifests and cross-references accordingly.

**Last Updated**: 2025-12-05


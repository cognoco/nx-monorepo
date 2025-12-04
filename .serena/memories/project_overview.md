# Project Overview

## What This Is
**AI-Native Nx Monorepo Template** — A production-ready foundation for type-safe, full-stack applications with shared business logic across web, server, and mobile. Designed for AI-first development where AI coding agents are the primary workforce.

> "The template front-loads foundational architectural, tooling, and governance decisions, delivering not just basic scaffolding but a complete production infrastructure." — PRD.md

## Current State
- **Phase**: 1 (MVP Walking Skeleton)
- **Stage**: 5 complete — Walking skeleton validated end-to-end (web → API → server → database)
- **Next**: Stage 6 (E2E testing evaluation)

## Architecture Snapshot

### Applications
| App | Technology | Purpose |
|-----|------------|---------|
| `apps/web` | Next.js 15.2 + React 19 | Web application with App Router |
| `apps/server` | Express + REST+OpenAPI | API server with type-safe endpoints |
| `apps/web-e2e` | Playwright | E2E browser testing |

### Shared Packages
| Package | Purpose |
|---------|---------|
| `packages/database` | Prisma client + migrations |
| `packages/schemas` | Zod schemas → TypeScript types |
| `packages/api-client` | OpenAPI-generated type-safe client |
| `packages/supabase-client` | Browser/server client factories |

### Dependency Flow
```
apps/web ──► packages/api-client ──► packages/schemas
apps/server ──► packages/database ──► packages/supabase-client
```
Rule: Apps depend on packages, never reverse. No circular dependencies.

## Key Tooling
- **Build**: Nx 21.6.5 + pnpm 10.19
- **Language**: TypeScript 5.9 (strict mode)
- **Testing**: Jest 30 (unit), Playwright 1.56 (E2E)
- **Quality**: ESLint 9, Prettier, Husky pre-commit hooks

## Governance Layer
- **Cogno** (`docs/memories/`) — Operational patterns and checklists
- **Canonical docs** (`docs/`) — PRD, constitution, architecture, roadmap
- Always check `docs/index.md` to locate authoritative sources

**Authoritative sources:** PRD.md, roadmap.md, architecture.md, README.md
**Last synced:** 2025-12-04

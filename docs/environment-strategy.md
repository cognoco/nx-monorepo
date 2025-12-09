---
title: Environment Strategy
purpose: Formal architecture for deployment environments across all platforms
audience: DevOps, developers, AI agents
created: 2025-12-08
last-updated: 2025-12-08
---

# Environment Strategy

This document defines the formal environment architecture for the nx-monorepo template, covering all deployment platforms and their relationships.

---

## Executive Summary

| Environment | Trigger | Web | API | Database | Purpose |
|-------------|---------|-----|-----|----------|---------|
| **Local Dev** | Manual | localhost:3000 | localhost:4000 | Supabase DEV | Developer workstation |
| **CI Testing** | PR/Push | N/A | N/A | Local PostgreSQL | Automated tests |
| **Staging** | PR to main / non-main branches | Vercel Preview | Railway `staging` | Supabase STAGING | Pre-merge validation, demos |
| **Production** | Merge to main | Vercel Production | Railway `production` | Supabase STAGING* | Live system |

*Production uses STAGING database until Supabase PROD is created

---

## Environment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ENVIRONMENT ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LOCAL DEVELOPMENT                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Web: localhost:3000 (Next.js dev server)                            │   │
│  │ API: localhost:4000 (Express dev server)                            │   │
│  │ DB:  Supabase DEV project (pjbnwtsufqpgsdlxydbo)                    │   │
│  │ Config: .env.development.local                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  CI TESTING (GitHub Actions)                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Web: Build only (no deployment)                                     │   │
│  │ API: Build only (no deployment)                                     │   │
│  │ DB:  Local PostgreSQL container (isolated, hermetic)                │   │
│  │ Config: Inline in workflow                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  STAGING (PRs / Non-main branches)                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Web: Vercel Preview URLs (*.vercel.app)                             │   │
│  │ API: Railway staging environment (*.up.railway.app)                 │   │
│  │ DB:  Supabase STAGING project (uvhnqtzufwvaqvbdgcnn)                │   │
│  │ Config: GitHub staging environment + platform dashboards            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│  PRODUCTION (Main branch merges)                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Web: Vercel Production (custom domain or *.vercel.app)              │   │
│  │ API: Railway production environment (*.up.railway.app)              │   │
│  │ DB:  Supabase STAGING → PROD (when created)                         │   │
│  │ Config: GitHub production environment + platform dashboards         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Platform Mapping

### Supabase Projects

| Project | Ref | Region | Purpose | Used By |
|---------|-----|--------|---------|---------|
| **nx-monorepo-DEV** | `pjbnwtsufqpgsdlxydbo` | eu-north-1 | Local development | Developers only |
| **nx-monorepo-STAGING** | `uvhnqtzufwvaqvbdgcnn` | eu-north-1 | Staging + Prod (temp) | Staging, Production |
| **nx-monorepo-PROD** | TBD | TBD | Production (future) | Production |

### GitHub Environments

| Environment | Purpose | Secrets | Protection Rules |
|-------------|---------|---------|------------------|
| `staging` | Preview deployments | VERCEL_*, RAILWAY_* | None (auto-deploy) |
| `production` | Production deployments | VERCEL_*, RAILWAY_* | Optional approval |

### Vercel Configuration

| Deployment Type | Trigger | URL Pattern | Environment |
|-----------------|---------|-------------|-------------|
| Preview | PR / non-main push | `*.vercel.app` (unique per deploy) | Staging vars |
| Production | main branch | Primary domain or `project.vercel.app` | Production vars |

### Railway Configuration

| Environment | Purpose | Service | URL |
|-------------|---------|---------|-----|
| `staging` | Staging API | @nx-monorepo/server | `*.up.railway.app` |
| `production` | Production API | @nx-monorepo/server | `*.up.railway.app` |

---

## CI Database Strategy

### Local PostgreSQL for CI Tests

**We use a local PostgreSQL container in CI, not Supabase.**

#### Rationale

| Factor | Local PostgreSQL | Supabase |
|--------|-----------------|----------|
| **Isolation** | ✅ Hermetic - parallel PRs can't conflict | ❌ Shared state between runs |
| **Speed** | ✅ ~100ms latency | ❌ ~500ms+ network latency |
| **Cost** | ✅ Free (GitHub Actions) | ❌ Consumes free tier limits |
| **Data Cleanliness** | ✅ Fresh every run | ❌ Test data accumulates |
| **Reliability** | ✅ No network dependencies | ❌ Network failures = CI failures |

#### Validation Layers

This creates a defense-in-depth testing strategy:

```
CI (Local PostgreSQL)        → Validates CODE works
                               - Unit tests
                               - Integration tests
                               - Type checking
                               - Linting

Staging (Supabase STAGING)   → Validates INFRASTRUCTURE works
                               - Supabase connection pooling
                               - RLS policies (if any)
                               - Prisma + Supavisor interaction
                               - Real network conditions

Production (Supabase STAGING/PROD) → Validates FULL PATH works
                               - Production configuration
                               - Production secrets
                               - Full deployment pipeline
```

---

## Naming Conventions

### Platform Name Mapping

| Concept | GitHub | Vercel | Railway | Supabase |
|---------|--------|--------|---------|----------|
| Pre-production | `staging` | Preview | `staging` | STAGING |
| Live production | `production` | Production | `production` | PROD |

**Note:** Vercel uses "Preview" for what we call "staging" - we accept this naming difference.

### File Naming

| Context | Local File | Connects To | Purpose |
|---------|------------|-------------|---------|
| Development | `.env.development.local` | DEV Supabase | Local development |
| Testing | `.env.test.local` | STAGING Supabase | Running local tests |
| Template | `.env.example` | (none) | Template for all variables |

> **Why `.env.test.local` connects to STAGING:**
>
> The file naming follows the `NODE_ENV` convention, not the database naming. When you run tests (`NODE_ENV=test`), the code automatically loads `.env.test.local`. This file happens to point to our STAGING Supabase instance because:
> 1. **Test isolation**: STAGING provides a shared, persistent database for integration testing
> 2. **CI parity**: Local tests can validate against the same schema that CI/staging uses
> 3. **Convention compliance**: Jest and other tools expect `NODE_ENV=test`
>
> The "test" in `.env.test.local` refers to the **execution context** (running tests), not the database environment. See `packages/test-utils/src/lib/load-database-env.ts` for the loading logic.

---

## Workflow Triggers

### deploy-staging.yml

```yaml
triggers:
  - PR to main (Vercel auto-detects)
  - Push to non-main branches (Vercel auto-detects)
  - Manual dispatch

deploys_to:
  - Vercel: Preview
  - Railway: staging environment
```

### deploy-production.yml

```yaml
triggers:
  - Push to main (after CI passes)
  - Manual dispatch

deploys_to:
  - Vercel: Production
  - Railway: production environment
```

---

## Secrets Management

### Secret Categories

| Category | Where Stored | Examples |
|----------|--------------|----------|
| **Platform API tokens** | GitHub Secrets (per environment) | VERCEL_TOKEN, RAILWAY_TOKEN |
| **Database credentials** | Platform dashboards | DATABASE_URL, DIRECT_URL |
| **Supabase keys** | Platform dashboards | SUPABASE_ANON_KEY, SERVICE_ROLE_KEY |
| **Observability** | Platform dashboards | SENTRY_DSN, SENTRY_AUTH_TOKEN |

### GitHub Secrets Structure

```
Repository level:
  - CLAUDE_CODE_OAUTH_TOKEN (existing)

staging environment:
  - VERCEL_TOKEN
  - VERCEL_ORG_ID
  - VERCEL_PROJECT_ID
  - RAILWAY_TOKEN

production environment:
  - VERCEL_TOKEN (can share with staging)
  - VERCEL_ORG_ID (can share with staging)
  - VERCEL_PROJECT_ID (can share with staging)
  - RAILWAY_TOKEN (can share with staging)
```

---

## Future: Production Database

When ready for production Supabase:

1. Create `nx-monorepo-PROD` project in Supabase
2. Run migrations: `prisma migrate deploy`
3. Update GitHub `production` environment secrets
4. Update Railway `production` environment variables
5. Update Vercel production environment variables
6. No code changes required

---

## Related Documentation

- [Environment Variables Matrix](./environment-variables-matrix.md) - Detailed variable traceability
- [Architecture Decisions - Epic 5](./architecture-decisions.md#epic-5-cicd-staging--production-deployment) - Platform selection rationale
- [Guides: Environment Setup](./guides/environment-setup.md) - Developer setup guide

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-08 | SM Agent (Rincewind) | Initial document created during Story 5.4 |



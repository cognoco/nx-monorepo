---
title: Environment Variables Matrix
purpose: Traceability matrix for all environment variables across platforms and environments
audience: DevOps, developers, AI agents
created: 2025-12-08
last-updated: 2025-12-08
---

# Environment Variables Matrix

This document provides a complete traceability matrix for all environment variables used in the nx-monorepo template.

---

## Quick Reference

### Variable Categories

| Category | Prefix | Exposure | Examples |
|----------|--------|----------|----------|
| Public (Browser-safe) | `NEXT_PUBLIC_*`, `EXPO_PUBLIC_*` | Client bundles | API URLs, Supabase URL/anon key |
| Server-side | No prefix | Server only | DATABASE_URL, SERVICE_ROLE_KEY |
| Build-time | Various | Build process | SENTRY_AUTH_TOKEN |

---

## Full Variable Matrix

### Database Variables

| Variable | Used By | Local Dev | CI | Staging | Production | Type |
|----------|---------|-----------|-----|---------|------------|------|
| `DATABASE_URL` | apps/server | Supabase DEV pooler | Local PG | Supabase STAGING pooler | Supabase STAGING* pooler | Secret |
| `DIRECT_URL` | Prisma migrations | Supabase DEV direct | N/A | Supabase STAGING direct | Supabase STAGING* direct | Secret |

*Production uses STAGING until PROD Supabase is created

**Format:**
```bash
# Transaction mode (queries) - Port 6543
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session mode (migrations) - Port 5432
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"
```

---

### Supabase Client Variables

| Variable | Used By | Local Dev | CI | Staging | Production | Type |
|----------|---------|-----------|-----|---------|------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | apps/web | DEV URL | N/A | STAGING URL | STAGING* URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | apps/web | DEV key | N/A | STAGING key | STAGING* key | Public |
| `SUPABASE_URL` | apps/server | DEV URL | N/A | STAGING URL | STAGING* URL | Server |
| `SUPABASE_SERVICE_ROLE_KEY` | apps/server | DEV key | N/A | STAGING key | STAGING* key | Secret |

**Supabase Project References:**

| Project | Ref | Purpose |
|---------|-----|---------|
| DEV | `pjbnwtsufqpgsdlxydbo` | Local development |
| STAGING | `uvhnqtzufwvaqvbdgcnn` | Staging + Production (temporary) |
| PROD | TBD | Production (future) |

---

### API Configuration Variables

| Variable | Used By | Local Dev | CI | Staging | Production | Type |
|----------|---------|-----------|-----|---------|------------|------|
| `NEXT_PUBLIC_API_URL` | apps/web (legacy) | `http://localhost:4000/api` | N/A | Not used | Not used | Public |
| `BACKEND_URL` | apps/web (Vercel rewrites) | N/A | N/A | Railway staging URL | Railway prod URL | Server |
| `CORS_ORIGIN` | apps/server | `localhost:3000,3001,3002` | N/A | Vercel preview URL | Vercel prod URL | Server |
| `HOST` | apps/server | `localhost` | `localhost` | `0.0.0.0` | `0.0.0.0` | Server |
| `PORT` | apps/server | `4000` | `4000` | Railway assigned | Railway assigned | Server |

**Note:** For Vercel deployments, use `BACKEND_URL` (server-side rewrite) instead of `NEXT_PUBLIC_API_URL` (client-side). See `docs/guides/environment-setup.md` for rationale.

---

### Observability Variables

| Variable | Used By | Local Dev | CI | Staging | Production | Type |
|----------|---------|-----------|-----|---------|------------|------|
| `SENTRY_DSN_API` | apps/server | Optional | N/A | Yes | Yes | Server |
| `NEXT_PUBLIC_SENTRY_DSN` | apps/web | Optional | N/A | Yes | Yes | Public |
| `SENTRY_ORG` | Build process | Yes | Yes | Yes | Yes | Build |
| `SENTRY_PROJECT` | Build process | Yes | Yes | Yes | Yes | Build |
| `SENTRY_AUTH_TOKEN` | Build process | Yes | Yes | Yes | Yes | Secret |

**Sentry Configuration:**
- Organization: `zwizzly`
- Project: `nx-monorepo`
- Same DSN can be used across environments (tagged by environment)

---

### Node/Runtime Variables

| Variable | Used By | Local Dev | CI | Staging | Production | Type |
|----------|---------|-----------|-----|---------|------------|------|
| `NODE_ENV` | All apps | `development` | `test` | `production` | `production` | Server |
| `CI` | Build scripts | Not set | `true` | Not set | Not set | Build |

---

## Platform-Specific Configuration

### GitHub Environments

| Environment | Variables | Secrets |
|-------------|-----------|---------|
| `staging` | `STAGING_API_URL` | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `RAILWAY_TOKEN` |
| `production` | (TBD) | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `RAILWAY_TOKEN` |

### Vercel Environment Variables

**Preview (Staging):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://uvhnqtzufwvaqvbdgcnn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
BACKEND_URL=https://[railway-staging-url].railway.app
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_ORG=zwizzly
SENTRY_PROJECT=nx-monorepo
SENTRY_AUTH_TOKEN=sntryu_...
```

**Production:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://uvhnqtzufwvaqvbdgcnn.supabase.co  # STAGING until PROD
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
BACKEND_URL=https://[railway-production-url].railway.app
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_ORG=zwizzly
SENTRY_PROJECT=nx-monorepo
SENTRY_AUTH_TOKEN=sntryu_...
```

### Railway Environment Variables

**Staging:**
```bash
DATABASE_URL=postgresql://postgres.uvhnqtzufwvaqvbdgcnn:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.uvhnqtzufwvaqvbdgcnn:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://uvhnqtzufwvaqvbdgcnn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SENTRY_DSN_API=https://...
NODE_ENV=production
CORS_ORIGIN=https://[vercel-preview-url].vercel.app
```

**Production:**
```bash
DATABASE_URL=postgresql://postgres.uvhnqtzufwvaqvbdgcnn:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true  # STAGING until PROD
DIRECT_URL=postgresql://postgres.uvhnqtzufwvaqvbdgcnn:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://uvhnqtzufwvaqvbdgcnn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SENTRY_DSN_API=https://...
NODE_ENV=production
CORS_ORIGIN=https://[vercel-production-url].vercel.app
```

---

## CI Workflow Variables

**`.github/workflows/ci.yml`:**
```yaml
env:
  DATABASE_URL: postgresql://prisma:prisma@localhost:5432/tests?schema=public
  DIRECT_URL: postgresql://prisma:prisma@localhost:5432/tests?schema=public
  CI: true
```

**Note:** CI uses local PostgreSQL container, not Supabase. This provides isolation and speed.

---

## Local Development Files

### `.env.development.local`
```bash
# Supabase DEV project
DATABASE_URL=postgresql://postgres.pjbnwtsufqpgsdlxydbo:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.pjbnwtsufqpgsdlxydbo:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://pjbnwtsufqpgsdlxydbo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_URL=https://pjbnwtsufqpgsdlxydbo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### `.env.test.local`

> **Note**: This file is named "test" because it's loaded when `NODE_ENV=test` (i.e., when running tests), not because of the database it connects to. It connects to the STAGING Supabase instance.

```bash
# Supabase STAGING project (loaded when NODE_ENV=test)
DATABASE_URL=postgresql://postgres.uvhnqtzufwvaqvbdgcnn:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.uvhnqtzufwvaqvbdgcnn:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://uvhnqtzufwvaqvbdgcnn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## Migration Checklist: Adding Production Supabase

When creating `nx-monorepo-PROD` Supabase project:

### 1. Create Project
- [ ] Create new Supabase project in appropriate organization
- [ ] Note project ref and region
- [ ] Save database password securely

### 2. Run Migrations
```bash
# Set production DATABASE_URL temporarily
export DATABASE_URL="postgresql://postgres.[PROD-REF]:[PASSWORD]@..."
pnpm --filter @nx-monorepo/database prisma migrate deploy
```

### 3. Update Vercel (Production)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` → PROD URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` → PROD key

### 4. Update Railway (Production)
- [ ] `DATABASE_URL` → PROD pooler connection
- [ ] `DIRECT_URL` → PROD direct connection
- [ ] `SUPABASE_URL` → PROD URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` → PROD service key

### 5. Verify
- [ ] Deploy to production
- [ ] Verify health check works
- [ ] Verify data is isolated from staging

---

## Related Documentation

- [Environment Strategy](./environment-strategy.md) - High-level architecture
- [Guides: Environment Setup](./guides/environment-setup.md) - Developer setup
- [.env.example](../.env.example) - Template with all variables

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-08 | SM Agent (Rincewind) | Initial matrix created during Story 5.4 |



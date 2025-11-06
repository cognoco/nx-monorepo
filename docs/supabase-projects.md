# Supabase Projects and Organizations

## Current State (As of Phase 5 - Migration Synchronization Complete)

This document provides a reference inventory of Supabase projects used in this monorepo.

### Development Project

- **Project ID**: `pjbnwtsufqpgsdlxydbo`
- **Organization**: ZIX-DEV
- **Organization ID**: `cispguvwukegvvxmeyzt`
- **Region**: `eu-north-1`
- **Pooler Hostname**: `aws-1-eu-north-1.pooler.supabase.com`
- **Status**: Active (primary development database)
- **Purpose**: Local development, rapid iteration, schema experimentation
- **Cost**: Free tier
- **Dashboard**: https://supabase.com/dashboard/project/pjbnwtsufqpgsdlxydbo

**Environment File**: `.env.development.local`

**Connection Details**:
```env
# Transaction mode pooler (port 6543)
DATABASE_URL="postgresql://postgres.pjbnwtsufqpgsdlxydbo:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session mode pooler (port 5432)
DIRECT_URL="postgresql://postgres.pjbnwtsufqpgsdlxydbo:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"

# Public API credentials
NEXT_PUBLIC_SUPABASE_URL="https://pjbnwtsufqpgsdlxydbo.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Schema Status**:
- ✅ Migrations applied: `20251027072808_create_health_check`
- ✅ Tables: `health_checks`, `_prisma_migrations`
- ✅ Row Level Security enabled on `health_checks`

---

### Test Project

- **Project ID**: `uvhnqtzufwvaqvbdgcnn`
- **Organization**: ZIX-DEV
- **Organization ID**: `cispguvwukegvvxmeyzt`
- **Region**: `eu-north-1`
- **Pooler Hostname**: `aws-1-eu-north-1.pooler.supabase.com` (may differ from dev)
- **Status**: Active (dedicated CI/CD testing database)
- **Purpose**: Automated testing, CI/CD pipelines, clean test data
- **Cost**: Free tier
- **Dashboard**: https://supabase.com/dashboard/project/uvhnqtzufwvaqvbdgcnn

**Environment File**: `.env.test.local`

**Connection Details**:
```env
# Transaction mode pooler (port 6543)
DATABASE_URL="postgresql://postgres.uvhnqtzufwvaqvbdgcnn:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session mode pooler (port 5432)
DIRECT_URL="postgresql://postgres.uvhnqtzufwvaqvbdgcnn:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"

# Public API credentials
NEXT_PUBLIC_SUPABASE_URL="https://uvhnqtzufwvaqvbdgcnn.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Schema Status**:
- ✅ Migrations applied: `20251027072808_create_health_check`
- ✅ Tables: `health_checks`, `_prisma_migrations`
- ✅ Row Level Security enabled on `health_checks`
- ✅ Schema synchronized with development project

---

### Production Project (Deferred)

- **Project ID**: *Not yet created*
- **Organization**: PIX (planned)
- **Organization ID**: `awsygvccihdrkwwgkksi`
- **Region**: `eu-north-1` (to match dev/test)
- **Status**: Deferred until needed
- **Purpose**: Real production deployment (post-walking skeleton)
- **Cost**: Free tier initially, upgrade to paid plan when needed

**Environment File**: `.env.production.local` (not yet created)

**Rationale for Deferral**:
- Phase 1 goal is walking skeleton validation, not production deployment
- Two projects (dev + test) sufficient for development and CI/CD
- Production project will be created in PIX org when ready for real deployment
- This approach avoids premature infrastructure and separates concerns cleanly

**When to Create**:
- After walking skeleton is complete and validated
- Before first real production deployment
- When PIX organization billing is configured
- Following the same setup process as dev/test projects

---

## Organizations

### ZIX-DEV

- **Organization ID**: `cispguvwukegvvxmeyzt`
- **Plan**: Free tier
- **Purpose**: Development and testing environments
- **Projects**:
  - `pjbnwtsufqpgsdlxydbo` (Development)
  - `uvhnqtzufwvaqvbdgcnn` (Test)
- **Total Cost**: $0/month (both projects on free tier)

### PIX

- **Organization ID**: `awsygvccihdrkwwgkksi`
- **Plan**: Free tier (upgrade to paid when production is deployed)
- **Purpose**: Production environment (future)
- **Projects**: None (production project deferred)
- **Total Cost**: $0/month (no projects yet)

---

## Architecture Decision: Two Separate Projects

**Decision**: Use two separate Supabase projects instead of branches or a single project.

**Rationale**:
- ✅ **Complete isolation**: Dev changes cannot affect test database
- ✅ **Independent credentials**: Separate API keys, connection strings per environment
- ✅ **Free tier compatible**: Both projects remain on free tier
- ✅ **Schema parity**: Migrations ensure both have identical schemas
- ✅ **CI/CD safety**: Test environment unaffected by dev experimentation
- ✅ **Reset flexibility**: Can reset dev database without affecting tests

**Alternative Considered - Supabase Branches**:
- ❌ Cost: ~$9.68/month for persistent test branch
- ❌ Complexity: Branch management adds operational overhead
- ❌ Free tier: No cost savings for our current scale
- ✅ Schema sync: Auto-applies migrations (but we handle this with CI anyway)

**Conclusion**: Two free-tier projects provide better isolation at zero cost.

---

## Critical: Pooler Hostname Variability

**⚠️ IMPORTANT**: Pooler hostnames are assigned by Supabase and CANNOT be predicted!

**Development Project**: `aws-1-eu-north-1.pooler.supabase.com`
**Test Project**: `aws-1-eu-north-1.pooler.supabase.com` (currently same, but may differ)

**Common Mistake**: Assuming hostnames are always `aws-0` or always match between projects

**Reality**: Hostnames can be:
- `aws-0-eu-north-1.pooler.supabase.com`
- `aws-1-eu-north-1.pooler.supabase.com`
- `aws-2-eu-north-1.pooler.supabase.com`
- `aws-3-eu-north-1.pooler.supabase.com`
- etc.

**How to Find**:
1. Go to Supabase Dashboard → Settings → Database → Connection string
2. Select "Session pooler" tab
3. Copy the EXACT hostname shown

**Symptom of Wrong Hostname**: `Error: Tenant or user not found`

**See**: `docs/memories/tech-findings-log.md` - Supabase Pooler Hostname Discovery

---

## Migration Status

Both databases have synchronized schemas via Prisma migrations.

**Applied Migrations**:
1. `20251027072808_create_health_check` - Creates health_checks table with RLS

**Migration Workflow**:
```bash
# Development (create and apply)
pnpm run db:migrate:dev

# Development and Test (apply existing)
pnpm run db:migrate:deploy:dev
pnpm run db:migrate:deploy:test
```

**Verification** (Phase 5 - Completed 2025-11-04):
- ✅ Dev database: 1 migration applied
- ✅ Test database: 1 migration applied
- ✅ Both have identical schemas
- ✅ Both have RLS enabled on health_checks

---

## Cost Summary

| Environment  | Project ID            | Organization | Cost/Month |
|--------------|-----------------------|--------------|------------|
| Development  | pjbnwtsufqpgsdlxydbo  | ZIX-DEV      | $0         |
| Test         | uvhnqtzufwvaqvbdgcnn  | ZIX-DEV      | $0         |
| Production   | *Deferred*            | PIX (future) | $0         |
| **Total**    |                       |              | **$0**     |

**Future Production Cost** (when created):
- Base: ~$25/month (pro plan)
- Usage: Varies based on storage, bandwidth, compute
- Estimate: $30-50/month for small production app

---

## Access Management

**Who Needs Access**:
- All developers need access to ZIX-DEV organization
- Only leads need access to PIX organization (production)

**How to Request Access**:
1. Ask team lead to invite you to ZIX-DEV organization
2. Accept invitation email from Supabase
3. Verify access: https://supabase.com/dashboard

**After Access Granted**:
1. Follow `docs/environment-setup.md` to configure local environment
2. Copy connection strings from dashboard for each project
3. Run validation: `pnpm run validate:env`

---

## References

- **Architecture Decision**: Documented in Phase 0 research (Option 1C selected)
- **Environment Setup**: See `docs/environment-setup.md` for developer onboarding
- **Connection Patterns**: See `docs/memories/adopted-patterns.md` Pattern 13
- **Migration Management**: See `docs/memories/adopted-patterns.md` Pattern 14
- **Pooler Hostname Discovery**: See `docs/memories/tech-findings-log.md`
- **Phase 5 Completion**: See `docs/memories/tech-findings-log.md`

**Last Updated**: 2025-11-04 (Phase 5 - Migration Synchronization Complete)

**Verified**: 2025-11-04 via Supabase MCP `list_tables` and Prisma CLI `migrate deploy`

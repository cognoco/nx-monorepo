# CI Database Strategy

## TL;DR

CI tests use **local PostgreSQL container**, not Supabase. Staging validates infrastructure separately.

## Rationale

| Factor | Local PostgreSQL | Supabase |
|--------|------------------|----------|
| **Isolation** | ✅ Hermetic per-run | ❌ Shared state risks |
| **Speed** | ✅ ~100ms connection | ❌ ~500ms+ network |
| **Cost** | ✅ Free (container) | ❌ Consumes tier limits |
| **Reliability** | ✅ No network dependency | ❌ Network/service outages |
| **Schema control** | ✅ Fresh per test run | ❌ May have test data |

## Three-Tier Validation

```
CI (Local PostgreSQL)     →  Validates CODE logic
    ↓
Staging (Supabase STAGING) →  Validates INFRASTRUCTURE integration
    ↓
Production (Supabase PROD) →  Validates FULL deployment path
```

**Why this separation:**
- CI catches code bugs fast (seconds, not minutes)
- Staging catches Supabase-specific issues (auth, RLS, pooler)
- Production validates the complete deployment pipeline

## CI Database Configuration

**GitHub Actions** uses PostgreSQL service container:

```yaml
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: test
    ports:
      - 5432:5432
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

**CI Environment Variables**:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/test"
```

## When to Use Each Environment

| Test Type | Database | Rationale |
|-----------|----------|-----------|
| Unit tests | Mocked/None | No DB needed |
| Integration tests (CI) | Local PostgreSQL | Fast, isolated |
| Integration tests (local dev) | Supabase DEV | Match real behavior |
| Staging validation | Supabase STAGING | Infrastructure verification |
| E2E tests | Depends on context | See E2E module |

## Anti-Patterns

❌ **Don't use Supabase in CI** for speed-critical test runs
❌ **Don't skip staging validation** assuming CI tests are sufficient
❌ **Don't share test databases** between CI runs (isolation matters)

## Reference

- **Full architecture**: [docs/environment-strategy.md](../../../environment-strategy.md#ci-database-strategy)
- **Variable matrix**: [docs/environment-variables-matrix.md](../../../environment-variables-matrix.md)
- **Governing document**: `docs/environment-strategy.md` (CI Database Strategy section)

---

**Last Validated**: 2025-12-09

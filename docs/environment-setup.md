# Environment Setup Guide

## Overview

This project uses **two separate Supabase PostgreSQL databases** for development and testing:

- **Development** (`.env.development.local`): For local development and prototyping
- **Test** (`.env.test.local`): For CI/CD testing with clean, isolated data

Both projects are already created and configured. You just need to set up your local environment files with the correct credentials.

**Estimated setup time:** 10-15 minutes

---

## Prerequisites

Before you begin, ensure you have:

1. **Access to Supabase projects**:
   - Organization: ZIX-DEV
   - Development project: `pjbnwtsufqpgsdlxydbo`
   - Test project: `uvhnqtzufwvaqvbdgcnn`
   - If you don't have access, ask a team member to invite you

2. **Tools installed**:
   - Node.js and pnpm
   - Git

3. **Repository cloned**:
   ```bash
   git clone <repository-url>
   cd nx-monorepo
   pnpm install
   ```

---

## Quick Setup (Recommended)

### Step 1: Create Environment Files

```bash
# From repository root
cp .env.example .env.development.local
cp .env.example .env.test.local
```

### Step 2: Get Credentials from Supabase Dashboard

You need to fill in 4 variables for each environment:
- `DATABASE_URL` - Pooled connection for queries (port 6543)
- `DIRECT_URL` - Pooled connection for migrations (port 5432)
- `NEXT_PUBLIC_SUPABASE_URL` - Public API URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key

**For Development Database:**

1. Navigate to: https://supabase.com/dashboard/project/pjbnwtsufqpgsdlxydbo

2. **Set/Reset Database Password** (if needed):
   - Go to: **Settings** → **Database** → **Database Settings**
   - Scroll to "Database Password" section
   - Click "Reset Database Password"
   - **⚠️ IMPORTANT**: Use only letters and numbers (e.g., `MyPassword123`)
   - **Avoid special characters** (`!@#$%^&*`) - they may cause connection issues
   - Save the password securely (you'll need it for connection strings)

3. **Get Database Credentials:**
   - Go to: **Settings** → **Database** → **Connection string**
   - Select **"Session pooler"** tab
   - Copy the connection string shown
   - **⚠️ CRITICAL**: Note the exact hostname (e.g., `aws-1-eu-north-1`, `aws-2-eu-north-1`)
   - **DO NOT assume `aws-0`** - the hostname varies by project assignment!

4. **Get API Credentials:**
   - Go to: **Settings** → **API**
   - Copy `URL` → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon` `public` key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Fill in `.env.development.local`:**
   ```env
   # Replace [PASSWORD] with your actual password from connection string
   # Replace aws-X with EXACT hostname from dashboard (e.g., aws-1, aws-2)
   DATABASE_URL="postgresql://postgres.pjbnwtsufqpgsdlxydbo:[PASSWORD]@aws-X-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.pjbnwtsufqpgsdlxydbo:[PASSWORD]@aws-X-eu-north-1.pooler.supabase.com:5432/postgres"

   NEXT_PUBLIC_SUPABASE_URL="https://pjbnwtsufqpgsdlxydbo.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

   NEXT_PUBLIC_API_URL="http://localhost:4000/api"
   ```

**For Test Database:**

Repeat the same process for the test project:

1. Navigate to: https://supabase.com/dashboard/project/uvhnqtzufwvaqvbdgcnn
2. Follow the same steps as above (get connection string, API credentials)
3. **⚠️ IMPORTANT**: Test project may have a DIFFERENT hostname than dev (e.g., dev uses `aws-1`, test uses `aws-2`)
4. Fill in `.env.test.local` with test project credentials

### Step 3: Verify Setup

```bash
# Validate environment files
pnpm run validate:env

# Test database connectivity (development)
pnpm run db:push:dev

# Test database connectivity (test)
pnpm run db:push:test
```

**Expected output:**
```
✅ Environment validation passed
✅ Database connection successful
```

If you see errors, jump to the [Troubleshooting](#troubleshooting) section.

---

## Understanding the Connection Strings

### DATABASE_URL (Transaction Mode - Port 6543)

Used by Prisma for application queries (SELECT, INSERT, UPDATE, DELETE).

**Format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-X-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Key components:**
- `postgres.[PROJECT-REF]` - Username format for transaction mode
- `aws-X-[REGION].pooler.supabase.com` - Pooler hostname (X varies: 0, 1, 2, etc.)
- `6543` - Transaction mode port
- `?pgbouncer=true` - Required parameter for pooled connection

### DIRECT_URL (Session Mode - Port 5432)

Used by Prisma for schema operations (migrations, introspection).

**Format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-X-[REGION].pooler.supabase.com:5432/postgres
```

**Key differences from DATABASE_URL:**
- Port `5432` instead of `6543`
- No `?pgbouncer=true` parameter
- Same pooler hostname as DATABASE_URL
- Supports full PostgreSQL protocol (required for migrations)

### Critical: Pooler Hostname Discovery

**⚠️ The pooler hostname varies by project and CANNOT be predicted!**

**Common mistake:** Assuming hostname is always `aws-0-eu-north-1`

**Reality:** Could be `aws-1-eu-north-1`, `aws-2-eu-north-1`, `aws-3-eu-north-1`, etc.

**How to find the correct hostname:**
1. Go to Supabase Dashboard → Project Settings → Database → Connection string
2. Select "Session pooler" tab
3. Copy the EXACT hostname from the displayed connection string
4. Use this hostname for BOTH `DATABASE_URL` and `DIRECT_URL`

**Symptom of wrong hostname:**
```
Error: Tenant or user not found
```

**Why this matters:**
- Supabase assigns pooler hostnames based on internal load balancing
- Different projects in same region may use different pooler nodes
- Must be copied from dashboard, cannot be inferred

**See also:** `docs/memories/tech-findings-log.md` - Supabase Pooler Hostname Discovery

---

## Validation

After setting up your environment files, run these checks:

### 1. Environment Variable Validation

```bash
pnpm run validate:env
```

This checks that all required variables are present and non-empty.

**Troubleshooting validation errors:**
- `Missing or empty: DATABASE_URL` → Variable not set or has no value
- `Invalid format: DATABASE_URL` → Check connection string format
- See `.env.example` for correct format

### 2. Database Connectivity Test

```bash
# Test development database
pnpm run db:push:dev

# Test test database
pnpm run db:push:test
```

**Expected output:**
```
The database is already in sync with the Prisma schema.
```

**If connection fails:**
- Check hostname is correct (see [Pooler Hostname Discovery](#critical-pooler-hostname-discovery))
- Verify password doesn't have special characters that need escaping
- Confirm Supabase project is active (not paused)

### 3. Start Development Server

```bash
# Start web app (uses development database)
pnpm run dev
```

Navigate to http://localhost:3000 and verify the app loads.

```bash
# Start API server (uses development database)
pnpm exec nx serve server
```

Test the health check endpoint: http://localhost:4000/api/health

**Expected response:**
```json
{
  "healthChecks": [
    {
      "id": "...",
      "message": "...",
      "timestamp": "..."
    }
  ]
}
```

---

## Troubleshooting

### "Tenant or user not found" Error

**Most common cause:** Wrong pooler hostname

**Fix:**
1. Go to Supabase Dashboard → Settings → Database → Connection string
2. Select "Session pooler" tab
3. Copy the EXACT hostname (e.g., `aws-1-eu-north-1.pooler.supabase.com`)
4. Update both `DATABASE_URL` and `DIRECT_URL` in your `.env` file
5. Try again: `pnpm run db:push:dev`

**See:** `docs/memories/tech-findings-log.md` - Supabase Pooler Hostname Discovery

### "Can't reach database server" Error

**Possible causes:**
1. **Network connectivity**: Check internet connection
2. **Firewall blocking**: Corporate firewall may block PostgreSQL ports (5432, 6543)
3. **Project paused**: Check project status in Supabase dashboard

**Fixes:**
- Try from different network (mobile hotspot)
- Verify project shows "Active" status in dashboard
- Check if you can reach the pooler: `nc -zv aws-1-eu-north-1.pooler.supabase.com 6543`

### Environment Variables Not Loading

**Symptom:** App says "DATABASE_URL is not defined"

**Check:**
1. File exists: `ls -la .env.development.local`
2. File has correct name (not `.env.dev.local` or `.env.local`)
3. No spaces around `=` sign in variables
4. NODE_ENV matches file: `NODE_ENV=development` → `.env.development.local`

**Pattern 13 in `docs/memories/adopted-patterns.md`** documents the complete environment loading strategy.

### Password Contains Special Characters

If you encounter connection errors like "authentication failed" or "invalid password", your database password may contain special characters that cause issues in connection strings.

**Solution**: Reset your database password to use only letters and numbers:
1. Go to Supabase Dashboard → Settings → Database → Database Settings
2. Click "Reset Database Password"
3. Use only alphanumeric characters (e.g., `MySecurePassword123`)
4. Update your `.env.*.local` files with the new password

**Note**: URL encoding special characters (e.g., `!` → `%21`) is theoretically possible but has proven unreliable in practice. The simplest and most reliable approach is to avoid special characters entirely.

### Different Hostname for Dev and Test

**This is normal!** Each Supabase project may be assigned to a different pooler node.

**Example:**
- Dev: `aws-1-eu-north-1.pooler.supabase.com`
- Test: `aws-2-eu-north-1.pooler.supabase.com`

Always copy the hostname from the dashboard for each project individually.

### "Migration failed" Error

If migrations fail, you may have schema drift between your local schema and the database:

```bash
# Reset development database to match schema
pnpm run db:push:dev

# Or apply pending migrations
pnpm run db:migrate:deploy:dev
```

**Warning:** `db:push` will overwrite database schema. Use with caution if you have data.

For detailed migration management, see `docs/memories/adopted-patterns.md` Pattern 14.

---

## Understanding the Architecture

### Why Two Separate Projects?

**Development Project (`pjbnwtsufqpgsdlxydbo`):**
- Personal workspace for rapid iteration
- Schema changes happen frequently
- Data can be messy or test data
- Can be reset anytime without affecting team

**Test Project (`uvhnqtzufwvaqvbdgcnn`):**
- Dedicated CI/CD environment
- Clean slate for automated tests
- Matches production schema (migrations applied)
- Isolated from development changes

**Benefits:**
- ✅ Complete data isolation (dev changes don't break tests)
- ✅ Test environment matches production more closely
- ✅ Can reset dev database without affecting CI/CD
- ✅ Clear separation of concerns

### Why Use Pooler for Both Connections?

**Traditional Supabase setup:**
- DATABASE_URL: Use pooler (port 6543)
- DIRECT_URL: Use direct connection to `db.[ref].supabase.co` (port 5432)

**Our setup:**
- DATABASE_URL: Use pooler (port 6543)
- DIRECT_URL: Use pooler (port 5432)

**Why we use pooler for both:**
- Direct connection requires IPv6 support
- Many development environments lack IPv6 (WSL2, Docker, some ISPs)
- Pooler provides IPv4 compatibility for both ports
- Session mode pooler (port 5432) supports migrations

**See:** `docs/memories/tech-findings-log.md` - IPv6 Requirement and Free Tier Workaround

### Migration Strategy

Migrations are managed per-environment:

```bash
# Development
pnpm run db:migrate:dev         # Create new migration
pnpm run db:migrate:deploy:dev  # Apply migrations

# Test
pnpm run db:migrate:deploy:test # Apply migrations (read-only for test)

# View migrations
ls packages/database/prisma/migrations/
```

**Workflow:**
1. Create migration on development (`db:migrate:dev`)
2. Test locally on development database
3. Commit migration files to git
4. CI applies migration to test database automatically
5. Verify tests pass
6. Deploy migration to production (future)

**See:** `docs/memories/adopted-patterns.md` Pattern 14 for migration rollback procedures.

---

## Project Information Reference

### Development Project
- **Project ID:** `pjbnwtsufqpgsdlxydbo`
- **Organization:** ZIX-DEV
- **Region:** `eu-north-1`
- **Dashboard:** https://supabase.com/dashboard/project/pjbnwtsufqpgsdlxydbo
- **Cost:** Free tier

### Test Project
- **Project ID:** `uvhnqtzufwvaqvbdgcnn`
- **Organization:** ZIX-DEV
- **Region:** `eu-north-1`
- **Dashboard:** https://supabase.com/dashboard/project/uvhnqtzufwvaqvbdgcnn
- **Cost:** Free tier

**Detailed project information:** See `docs/supabase-projects.md`

---

## Security Best Practices

**DO:**
- ✅ Keep all `.env.*.local` files in `.gitignore` (already configured)
- ✅ Use different credentials for each environment
- ✅ Run validation before committing code changes
- ✅ Rotate credentials if you suspect compromise
- ✅ Request access from team if you don't have it

**DO NOT:**
- ❌ Commit `.env.*.local` files to git
- ❌ Share credentials via email, Slack, or insecure channels
- ❌ Use test credentials in development (or vice versa)
- ❌ Hardcode credentials in source code
- ❌ Share your personal `.env` files with other developers

**If credentials are compromised:**
1. Immediately notify team lead
2. Reset database password in Supabase dashboard
3. Regenerate API keys if exposed
4. Update your local `.env` files
5. Document incident for security review

---

## Next Steps

After environment setup is complete:

1. **Verify everything works:**
   ```bash
   pnpm run validate:env
   pnpm run db:push:dev
   pnpm run dev
   ```

2. **Read the project README:**
   - See `README.md` for architecture overview
   - Review common commands and workflow

3. **Understand adopted patterns:**
   - Read `docs/memories/adopted-patterns.md`
   - Especially Pattern 13 (Environment Management) and Pattern 14 (Migrations)

4. **Start developing:**
   ```bash
   pnpm run dev        # Start web app
   pnpm exec nx serve server  # Start API server
   pnpm run test       # Run tests
   ```

5. **When making schema changes:**
   - Create migration: `pnpm run db:migrate:dev`
   - Review migration file before committing
   - Test on dev database first
   - See Pattern 14 for migration best practices

---

## Additional Resources

- **`.env.example`**: Template showing required variables with placeholders
- **`docs/supabase-projects.md`**: Detailed project information and credentials
- **`docs/memories/adopted-patterns.md`**:
  - Pattern 13: Database Environment Management
  - Pattern 14: Migration Management and Rollback
- **`docs/memories/tech-findings-log.md`**:
  - Supabase Pooler Hostname Discovery
  - IPv6 Requirement and Free Tier Workaround
  - Phase 5 Completion: Multi-Environment Migration Synchronization
- **`README.md`**: Project overview, commands, and workflow

**Questions or stuck?** Ask in team chat or create an issue in the repository.

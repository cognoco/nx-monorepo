# Nx Cloud Remote Caching

This guide covers Nx Cloud remote caching setup, verification, and troubleshooting for this monorepo.

## Overview

Nx Cloud provides remote caching that significantly speeds up builds across:
- **Local development**: Same code builds instantly after first run
- **Team sharing**: Your teammate's cached builds benefit you (and vice versa)
- **CI/CD**: GitHub Actions reuses cached builds from local development

## Configuration

### Current Setup

Remote caching is enabled via `nxCloudId` in `nx.json`:

```json
{
  "nxCloudId": "68f123c9e2ac117d7d820de4"
}
```

**Dashboard**: https://cloud.nx.app

### How It Works

1. After a task runs, Nx computes a hash based on:
   - Source file contents (not timestamps)
   - Dependencies
   - Environment configuration
   - `inputs` and `outputs` defined in project.json

2. Nx uploads the task output + hash to Nx Cloud

3. On subsequent runs (locally, by teammates, or in CI):
   - Nx checks if the hash exists in remote cache
   - If found, downloads outputs instead of re-running

## Verifying Remote Cache

### Check Connection Status

```bash
pnpm exec nx connect
```

Expected output:
```
NX   ✔ This workspace already has Nx Cloud set up
```

### Test Remote Cache Hits

```bash
# 1. Run a build (populates cache)
pnpm exec nx run schemas:build

# 2. Clear ALL local caches and outputs
rm -rf .nx dist packages/*/dist
NX_DAEMON=false pnpm exec nx reset

# 3. Rebuild (should show [remote cache])
pnpm exec nx run schemas:build
```

Expected output:
```
> nx run @nx-monorepo/schemas:build  [remote cache]
Nx read the output from the cache instead of running the command for 1 out of 1 tasks.
Nx Cloud made it possible to reuse @nx-monorepo/schemas
```

## Cache Behavior

| Scenario | Cache Type | Notes |
|----------|-----------|-------|
| Same code, same machine | Local | Fastest, no network |
| Same code, different machine | Remote | Downloads from Nx Cloud |
| Changed source file | Miss | Content hash changed |
| Changed test file only | Hit (build) | `production` input excludes tests |
| `touch` file (no content change) | Hit | Nx uses content hashes, not timestamps |

## Cache Configuration

### Named Inputs (nx.json)

```json
"namedInputs": {
  "default": ["{projectRoot}/**/*", "sharedGlobals"],
  "production": [
    "default",
    "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
    "!{projectRoot}/jest.config.[jt]s"
  ],
  "sharedGlobals": ["{workspaceRoot}/.github/workflows/ci.yml"]
}
```

**Key points:**
- `production` excludes test files from build cache
- Changing CI workflow invalidates all caches (intentional)
- Test file changes don't invalidate production builds

### Project-Level Configuration

For custom targets, configure `inputs`, `outputs`, and `cache`:

```json
// project.json
{
  "targets": {
    "custom-task": {
      "executor": "nx:run-commands",
      "options": { "command": "..." },
      "cache": true,
      "inputs": ["production", "^production"],
      "outputs": ["{projectRoot}/dist"]
    }
  }
}
```

## CI Integration

### Current Setup

GitHub Actions automatically uses remote cache via `nxCloudId`:

```yaml
# .github/workflows/ci.yml
- run: pnpm exec nx run-many -t lint test build typecheck e2e
```

### Optional: Task Distribution

For large workspaces, enable distributed task execution:

```yaml
# Uncomment in ci.yml
- run: pnpm exec nx start-ci-run --distribute-on="3 linux-medium-js"
```

## Troubleshooting

### Low Cache Hit Rate

1. **Check inputs configuration**: Too broad inputs invalidate cache unnecessarily
   ```bash
   # View what inputs affect a task
   pnpm exec nx show project schemas --json | jq '.targets.build.inputs'
   ```

2. **Verify namedInputs**: Ensure test files are excluded from production
   ```json
   "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)"
   ```

### No Remote Cache Hits

1. **Check connection**:
   ```bash
   pnpm exec nx connect
   ```

2. **Verify nxCloudId** is set in `nx.json`

3. **Check dashboard**: https://cloud.nx.app for error messages

### Cache Not Updating

1. **Clear stale cache**:
   ```bash
   NX_DAEMON=false pnpm exec nx reset
   ```

2. **Bypass cache for one run**:
   ```bash
   pnpm exec nx run schemas:build --skip-nx-cache
   ```

### Daemon Issues (Windows)

If Jest hangs or tests don't complete:

```bash
# Disable daemon for this command
NX_DAEMON=false pnpm exec nx run-many -t test
```

## Common Commands

```bash
# View cache status for a run
pnpm exec nx run-many -t build --verbose

# Clear local cache
pnpm exec nx reset

# Bypass cache
pnpm exec nx run project:target --skip-nx-cache

# Check connection
pnpm exec nx connect

# View project cache config
pnpm exec nx show project <project-name>
```

## References

- [Nx Cloud Documentation](https://nx.dev/ci/features/remote-cache)
- [nx.json Reference](https://nx.dev/reference/nx-json)
- [Cache Task Results](https://nx.dev/features/cache-task-results)
- Dashboard: https://cloud.nx.app

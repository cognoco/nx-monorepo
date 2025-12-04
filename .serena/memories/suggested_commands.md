# Suggested Commands

## Daily Development

### Start Development Servers
```bash
pnpm run dev                    # Web + server in parallel
pnpm exec nx run web:dev        # Web only (port 3000)
pnpm exec nx run server:serve   # Server only (port 3333)
```

### Quality Checks
```bash
pnpm exec nx run-many -t lint   # Lint all projects
pnpm exec nx run-many -t test   # Run all tests
pnpm exec nx run-many -t build  # Build all projects
pnpm exec nx affected -t test   # Test only changed projects
```

### Formatting
```bash
pnpm run format:check           # Check formatting
pnpm run format:write           # Fix formatting
```

## Targeted Operations

### Single Project
```bash
pnpm exec nx run <project>:<target>
# Examples:
pnpm exec nx run web:test
pnpm exec nx run server:build
pnpm exec nx run api-client:lint
```

### E2E Testing
```bash
pnpm exec nx run web-e2e:e2e    # Run Playwright tests
```

## Database & Prisma

```bash
pnpm run db:generate            # Regenerate Prisma client
pnpm run db:migrate:dev         # Create + apply migrations (dev)
pnpm run db:push:dev            # Sync schema without migrations
pnpm run db:studio:dev          # Open Prisma Studio GUI
```

## Code Generation

### Before generating, READ:
- `docs/memories/adopted-patterns/`
- `docs/memories/post-generation-checklist/`

```bash
pnpm exec nx g @nx/js:lib <name> --directory=packages/<name> --bundler=tsc
pnpm exec nx g @nx/node:app <name> --directory=apps/<name>
pnpm exec nx g @nx/jest:configuration --project=<name>
```

## Troubleshooting

### Jest Hanging (Windows)
```bash
NX_DAEMON=false pnpm exec nx run-many -t test     # Try first
pnpm exec nx run-many -t test --no-cloud          # Try second
```

### Clear Nx Cache
```bash
pnpm exec nx reset              # Clear all caches
```

### View Dependency Graph
```bash
pnpm exec nx graph              # Visual dependency graph
pnpm exec nx show project <name> # Project details
```

## CI Simulation

```bash
pnpm exec nx run-many -t lint test build typecheck e2e
```

## Environment Validation

```bash
pnpm run validate:env           # Check environment variables
pnpm run validate:governance    # Run policy-as-code checks
```

**Authoritative sources:** package.json, AGENTS.md, README.md
**Last synced:** 2025-12-04

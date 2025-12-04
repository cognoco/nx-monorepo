# Post-Task Checklist

Execute this checklist after completing any significant task.

## 1. Governance Sync
- [ ] If changes touch architecture, tooling, or conventions → cite the relevant canonical doc (`docs/index.md`) and update matching Cogno module

## 2. Code Quality
- [ ] **Format**: `pnpm run format:check` (fix with `format:write` if needed)
- [ ] **Lint**: `pnpm exec nx affected -t lint`
- [ ] **Types**: `pnpm exec nx affected -t typecheck`

## 3. Testing
- [ ] **Unit/Integration**: `pnpm exec nx affected -t test`
- [ ] **E2E** (if user-facing flows changed): `pnpm exec nx affected -t e2e`
- [ ] **Database** (if schema changed): `pnpm run db:generate` + verify Prisma generates cleanly

## 4. Build Validation
- [ ] `pnpm exec nx affected -t build`
- [ ] If dependencies changed: `pnpm exec nx graph` — confirm no circular edges

## 5. Git Hygiene
- [ ] `git status` / `git diff` — review changes
- [ ] **NEVER commit unless explicitly requested** (AGENTS.md rule)
- [ ] Summarize key changes for user

## 6. Documentation
- [ ] Update README, docs, or Cogno memories if task introduced new knowledge
- [ ] If new pattern established → add to `adopted-patterns/`

## 7. Serena Maintenance (Major Refactors Only)
- [ ] After large structural changes: `serena project index` to refresh symbol caches

## 8. Handoff
- [ ] Report test/command results to user
- [ ] Note any skipped steps with rationale
- [ ] List recommended next actions

## Quick Reference

| Check | Command |
|-------|---------|
| Format | `pnpm run format:check` |
| Lint | `pnpm exec nx affected -t lint` |
| Test | `pnpm exec nx affected -t test` |
| Build | `pnpm exec nx affected -t build` |
| Types | `pnpm exec nx affected -t typecheck` |
| Graph | `pnpm exec nx graph` |

**Authoritative sources:** constitution.md §II-III, AGENTS.md
**Last synced:** 2025-12-04

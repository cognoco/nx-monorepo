## Agent Proposal Review — 001 Walking Skeleton

### Scope
Evaluate agent proposals in `specs/001-walking-skeleton` against canonical guidance in `docs/` and `docs/memories/`, validate key items with official docs, and provide actionable recommendations.

### Sources Reviewed
- Feature docs: `specs/001-walking-skeleton/spec.md`, `plan.md`, `research.md`, `research-validation.md`, `quickstart.md`, `data-model.md`, `contracts/`
- Canonical docs: `docs/memories/adopted-patterns.md`, `post-generation-checklist.md`, `testing-reference.md`, `tech-findings-log.md`, plus `docs/architecture-decisions.md`, `docs/P1-plan.md`, `docs/tech-stack.md`
- External validation (official docs):
  - Prisma: PgBouncer/Pooler + `directUrl` for migrations; Supabase integration patterns
  - Supabase: RLS policies, `bypassrls` role capability

### Executive Summary
- Adopt Supabase pooler + Prisma `directUrl` as the new standard. Update memory docs accordingly.
- Keep RLS disabled for Phase 1 to align with architecture decisions; correct “service_role bypass for Prisma” wording.
- Resolve two doc conflicts: generated types strategy (gitignore vs commit) and Phase 1 coverage threshold (10% vs 60%).
- Add the missing per‑feature exceptions file if deviations remain during Phase 1.

---

## Detailed Findings

### 1) Prisma + Supabase Pooling with directUrl
- What the agent proposed (summary): Use Supavisor pooler for `DATABASE_URL` (port 6543) and add `directUrl` (port 5432) for Prisma Migrate; update env vars and `schema.prisma`.
- Canonical baseline currently says “no directUrl” and uses direct 5432 (Pattern 8), which conflicts with the proposal.
- External validation: Prisma recommends using a pooler for application traffic and a direct connection for migrations with `directUrl`. This is the current best practice with PgBouncer/Supavisor.
- Pros: Better scalability, fewer connection issues, aligned with 2025 guidance.
- Cons: Requires doc updates and env/schema changes; small setup cost.
- Downstream impact: `.env` gains `DIRECT_URL`; `schema.prisma` `datasource db` adds `directUrl`; quickstart steps change; no Nx target impact.
- Recommendation: APPROVE. Update `docs/memories/adopted-patterns.md` (Pattern 8) to adopt pooler+directUrl; adjust `docs/architecture-decisions.md` Stage 4.2 language accordingly. Ensure `quickstart.md` reflects the final source of truth.

### 2) RLS Strategy (Enable + “service_role bypass”)
- What the agent proposed: Enable RLS on walking skeleton tables and rely on Supabase `service_role` to bypass.
- Canonical baseline: Phase 1 explicitly disables RLS (API server is the security boundary); enabling was deferred.
- Technical correction: `service_role` is a PostgREST/HTTP key, not a Postgres role used by Prisma. Prisma connects via SQL using a database role; to bypass RLS in SQL you either run as superuser or grant `BYPASSRLS` to a DB role (or write policies for that role). The proposal conflates these.
- Pros (in general): Defense‑in‑depth when clients query via PostgREST.
- Cons for Phase 1: Contradicts current architecture decision; risks breakage/confusion; adds complexity without value for the throwaway feature.
- Downstream impact: Quickstart and migrations would need policy management; education burden for Phase 1.
- Recommendation: REJECT for Phase 1. Keep RLS disabled as documented. If enabling later, document proper SQL role approach (not `service_role`), or keep RLS strictly for PostgREST access paths.

### 3) Tailwind 4.x Upgrade
- Proposal: Upgrade Tailwind 3.4.3 → 4.1.x for Next 15 optimizations.
- Baseline: Pinned versions in `docs/tech-stack.md` favor stability during Phase 1.
- Pros: New features and potential perf.
- Cons: Migration overhead; diverges from pinning policy during infrastructure validation.
- Recommendation: DEFER to a dedicated upgrade PR after Phase 1; validate with CI and app smoke tests.

### 4) MSW 2.0 Examples
- Proposal: Ensure MSW 2.0 usage (new `http` and `HttpResponse`).
- Baseline: Pattern 10 already shows MSW 2.0 style. No conflict.
- Recommendation: CONFIRM usage in affected projects; no further doc change needed.

### 5) Generated OpenAPI Types — Strategy Conflict
- Conflict: Pattern 7 says “gitignore generated types” while architecture decisions suggest “commit generated files”.
- Impact: Confusing developer workflow; potential CI drift.
- Recommendation: PICK ONE approach. Given Nx artifact pipelines and lower PR noise, prefer “gitignore generated types.” If you prefer “commit generated types,” update Pattern 7 and targets consistently. Avoid split guidance.

### 6) Coverage Thresholds — Conflict
- Conflict: Spec sets Phase 1 threshold at 60% while Testing Reference documents 10% for Phase 1 with 80% target later.
- Impact: Inconsistent requirements and potentially failing gates.
- Recommendation: PICK ONE for Phase 1 and align docs/configs. Suggest keeping 10% for infra validation; raise thresholds post‑skeleton.

---

## Governance & Policy Adherence

### What went well
- External validation performed; parallel research documented in `research*.md`.
- Nx usage and workspace boundaries respected; TDD/verification checklists present.

### What could be improved
- “0 conflicts” assertion is inaccurate: Pooling+directUrl and RLS enablement conflict with Pattern 8 and Stage 4.2; coverage threshold conflicts exist.
- Missing per‑feature exceptions file promised by the spec. If deviating before memory updates are merged, add an entry to the global docket `specs/exceptions.md` documenting scope, rationale, and expiry.
- Memory System process: When changing standards (Pattern 8), first update `docs/memories/*` or record an approved exception before claiming full alignment.

---

## Actionable Checklist
1) Supabase + Prisma
   - Update `docs/memories/adopted-patterns.md` (Pattern 8) to adopt pooler+`directUrl`.
   - Update Stage 4.2 wording to reflect new connection strategy.
   - Ensure `schema.prisma` uses `directUrl` and `.env` includes `DIRECT_URL`.

2) RLS
   - Revert Phase 1 docs/spec/data-model/quickstart to “RLS DISABLED” for walking skeleton tables.
   - Remove references implying `service_role` affects Prisma; if planning RLS later, document correct SQL role approach or PostgREST‑only scope.

3) Generated types strategy
   - Decide “gitignore vs commit” and update both Pattern 7 and architecture decisions to match.

4) Coverage thresholds
   - Choose Phase 1 threshold (recommend 10%) and align spec, testing-reference, and Jest configs.

5) Exceptions & governance
   - If any deviation remains before memory updates land, add an entry to `specs/exceptions.md` with scope, rationale, and expiry.

---

## Citations (internal)
- RLS enabled in proposals: `specs/001-walking-skeleton/data-model.md` and `quickstart.md`
- Pooling+directUrl proposal: `specs/001-walking-skeleton/research.md`, `quickstart.md`
- Pattern 8 baseline (no directUrl, RLS disabled): `docs/memories/adopted-patterns.md`
- Phase 1 RLS decision (disabled): `docs/architecture-decisions.md`
- Generated types strategy conflict: Pattern 7 vs architecture decisions
- Coverage threshold conflict: `specs/001-walking-skeleton/spec.md` vs `docs/memories/testing-reference.md`

## References (official docs)
- Prisma — Connection pooling and `directUrl` with PgBouncer: [Prisma docs on pooling and PgBouncer](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/pooling#pgbouncer)
- Prisma — Supabase + `directUrl` guidance: [Prisma + Supabase integration](https://www.prisma.io/docs/orm/overview/databases/supabase)
- Prisma — `directUrl` for Migrate with external poolers: [Prisma datasource `directUrl`](https://www.prisma.io/docs/orm/prisma-schema/connection-management#direct-database-url)
- Supabase — RLS policies and `bypassrls` role capability: [Supabase RLS guide](https://supabase.com/docs/guides/auth/row-level-security)



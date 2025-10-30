# Exceptions Docket (Walking Skeleton)

# Template example:
# - rule: PHASE1_DB_URL
# - principle: XI. Governance Alignment is Mandatory
# - rationale: N/A (example placeholder)
# - scope: N/A
# - approval: <owner/date>
# - expiry: <date>

## Active Exceptions

### Exception 1: MSW Dependency

- rule: MSW_REQUIRED
- principle: XI. Governance Alignment is Mandatory
- rationale: MSW (Mock Service Worker) is not required until Phase 1 Stage 5 when implementing the walking skeleton feature that needs API mocking. Adding it prematurely would violate the walking skeleton principle of implementing only what's needed for the current stage.
- scope: apps/web/package.json devDependencies
- approval: Phase 1 architectural decision / 2025-10-30
- expiry: Phase 1 Stage 5 completion (walking skeleton implementation)




package speckit.governance

# NOTE: This Rego policy is a project-owned policy-as-code artifact.
# AI agent commands SHOULD NOT embed project rules; gates should
# invoke a generic runner that loads this policy bundle.

# Input shape (example):
# input := {
#   "phase": "phase1",
#   "workspace": {
#     "envExample": "...",
#     "schemaPrisma": "...",
#     "webJestConfig": "...",
#     "webPackageJson": {"devDependencies": {...}}
#   }
# }

deny[{
  "rule": "PHASE1_DB_URL",
  "message": "Phase 1: DATABASE_URL must be direct (5432); pgbouncer params/DIRECT_URL not allowed",
}] {
  input.phase == "phase1"
  contains(lower(input.workspace.envExample), "pgbouncer")
}

deny[{
  "rule": "PRISMA_DIRECTURL",
  "message": "Phase 1: Prisma datasource must not use directUrl",
}] {
  input.phase == "phase1"
  contains(lower(input.workspace.schemaPrisma), "directurl")
}

deny[{
  "rule": "PHASE1_COVERAGE",
  "message": "Phase 1: coverageThreshold must be 10%",
}] {
  input.phase == "phase1"
  not contains(input.workspace.webJestConfig, "branches: 10")
}

deny[{
  "rule": "MSW_REQUIRED",
  "message": "UI packages must include MSW in devDependencies",
}] {
  devdeps := input.workspace.webPackageJson.devDependencies
  devdeps == null or devdeps["msw"] == null
}





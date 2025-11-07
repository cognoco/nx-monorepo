## Plan Summary (Agent Context)
- Objective: Maintain file-based memory as canonical source while mirroring curated chunks to ByteRover for faster retrieval.
- Retrieval Rules: When ByteRover MCP available, query it first; on error or low confidence, fall back to local manifest-driven lookup of layered docs.
- Write Path: Always update local chunks + manifest; enqueue sync to ByteRover with retries and remote ID tracking to keep parity.
- Structural Changes: Split large docs into lightweight core summaries plus modular chunks to reduce default context load and simplify syncing.
- Scope: Implement staged rollout covering architecture definitions, ByteRover PoC, doc refactor, sync automation, workflow bundles, and operational playbooks.

## Stage 1 - System Design
- [X] Task 1.1: Finalize dual-system principles (file-based master, ByteRover mirror, fallback rules)
  - Decisions: Files + manifest remain canonical; ByteRover-first read with confidence fallback; synchronous mirror attempt after writes; on failure or no MCP access log in sync backlog and mark manifest `sync_status=pending`.
- [X] Task 1.2: Define layered documentation structure (core summaries, modular chunks, metadata schema)
  - Decision: Use option 1 (core index file + flat module files) per memory document with TL;DR in core and focused shards in modules.
- [X] Task 1.3: Draft memory manifest format (chunk IDs, tags, checksums, last-sync status)

## Stage 2 – Memory Content Updates
- [x] Task 2.1: Apply core + module structure (with TL;DR overlays) to every memory document in `docs/memories/`
  - Consolidated the memory README back into a single document while retaining manifests for other large references.
- [x] Task 2.2: Generate/refresh manifest metadata for all memory chunks (tags, summaries, anchors)
- [x] Task 2.3: Update agent instructions/prompts to reference new core sections and manifest metadata across the board
  - Added constitution loading rule and dual-memory retrieval order to `AGENTS.md`.
- [x] Task 2.4: Repair contributor templates (e.g., `module-17-pattern-template.md`) to provide a complete scaffold aligned with required metadata fields.
- [x] Task 2.5: Extend every "How to Update" module with a post-edit checklist covering manifest updates, checksum regeneration, ByteRover upload, and backlog logging.
- [x] Task 2.6: Align troubleshooting guidance—especially the Windows/Jest entry—with adopted patterns (only `NX_DAEMON=false`, reference `tsconfig.spec.json` conventions).
- [x] Task 2.7: Update `AGENTS.md` with the ByteRover confidence threshold (≥0.4) and backlog logging expectations.

## Stage 3 – ByteRover Ingestion
- [x] Task 3.1: Provision ByteRover spaces and connect preferred MCP clients (Space `nx-monorepo` active; MCP clients configured; rule: space name matches repo)
- [ ] Task 3.2 (Framework): Implement initial ingestion script to chunk existing memories and upload to ByteRover
  - Define checksum algorithm (SHA256 of module contents) and document mapping from manifest tags → ByteRover metadata.
  - Build script that walks manifests, populates `checksum`, attempts upload, captures `byterover_id`, and sets `sync_status` accordingly.
  - On any failure, append a row to `docs/memories/memory-sync-backlog.md` and leave the manifest entry flagged `pending`.
- [ ] Task 3.3 (Framework): Validate retrieval/fallback behavior with and without ByteRover connectivity
  - Run a ByteRover-enabled read to confirm ≥0.4 confidence threshold flow; repeat with MCP disabled to verify manifest/core fallback logging.

## Stage 4 – Sync Automation & Reliability
- [ ] Task 4.1 (Framework): Build sync pipeline (manifest diff → ByteRover upload/delete with retries, backlog replay helpers)
- [ ] Task 4.2 (Framework): Record ByteRover identifiers in manifest and handle reconciliation/drift detection (include `pnpm run memory:sync -- --chunk` helper)
- [ ] Task 4.3 (Framework): Add automated tests/health checks plus a documented cadence for backlog processing and index regeneration scripts

## Stage 5 – Role Bundles & Retrieval Tooling
- [ ] Task 5.1: Curate minimal local bundles per workflow (generation, testing, troubleshooting)
- [ ] Task 5.2: Mirror bundle tags/spaces inside ByteRover for scoped retrieval
- [ ] Task 5.3: (Optional) Implement local search CLI/service for manifest-backed fallback queries

## Stage 6 – Rollout & Operationalization
- [ ] Task 6.1: Run acceptance sessions covering common agent workflows with/without ByteRover
- [ ] Task 6.2: Document runbooks (memory creation, sync failure recovery, onboarding)
- [ ] Task 6.3: Schedule periodic audits comparing ByteRover vs master files and adjust tooling


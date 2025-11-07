## Memory System Architecture Spec

### Purpose
- Establish master/mirror rules between file-based memory and ByteRover.
- Provide deterministic guidance for agents regardless of MCP access.
- Supply clear data structures for manifests, sync backlogs, and telemetry.

### Canonical Data Model
1. **File Chunk** (Markdown module) + **Per-memory YAML manifest entry** = canonical record.
2. **Workspace JSON index** is generated from manifests (never edited manually).
3. **ByteRover entry** mirrors the canonical record when sync succeeds.

### Read Workflow
1. Attempt ByteRover retrieval (requires MCP access).
   - Use `byterover-retrieve-knowledge` with manifest chunk identifiers/tags.
   - Accept results with confidence ≥ `0.4`; otherwise treat as miss.
   - All read/write operations must target the ByteRover space whose name matches the repo/project identifier (e.g., `nx-monorepo`).
2. On miss or MCP unavailability:
   - Load core summary file.
   - Resolve module path via per-memory manifest and open only required module(s).
3. Agents must document which source was used in execution logs.

### Write Workflow
1. Update or create module file(s); regenerate TL;DR excerpt in core summary if needed.
2. Mutate per-memory manifest entry:
   - Fields: `chunk_id`, `title`, `module_path`, `tags`, `checksum`, `last_updated_by`, `last_updated_at`, `sync_status` (`synced`, `pending`, `failed`).
3. Trigger synchronous ByteRover mirror attempt:
   - Package payload from manifest + module content.
   - On success: record `byterover_id`, set `sync_status: synced`, update `last_synced_at`.
4. On failure (network, auth, no MCP access):
   - Append backlog row to `docs/memories/memory-sync-backlog.md` (chunk ID, reason, timestamp, agent ID).
   - Update manifest entry to `sync_status: pending` and clear `byterover_id`.
5. Regenerate workspace JSON index.

### Backlog Processing
- Dedicated maintenance task reads `docs/memories/memory-sync-backlog.md`, replays entries, and removes successful rows.
- Automation should emit alerts if backlog exceeds threshold (e.g., 10 pending items or >48h age).

### Layered Documentation Layout
```
docs/memories/
  README.md                     # consolidated on-ramp (no manifest)
  adopted-patterns/
    adopted-patterns.core.md
    manifest.yaml
    module-01-test-location.md
    module-02-typescript-resolution.md
    ...
```
- Core files contain TL;DR, quick links, and change logs.
- Modules hold detailed patterns or findings (one topic per file unless tightly coupled).
- Manifests list every module with metadata required for ByteRover sync.
- Some documents (e.g., the memory README, architecture spec) remain single files intentionally; tooling should index them directly without manifests.

### Workspace JSON Index (`docs/memories/memory-index.json`)
- Auto-generated; structure example:
```json
{
  "adopted-patterns": {
    "core": "docs/memories/adopted-patterns/adopted-patterns.core.md",
    "manifest": "docs/memories/adopted-patterns/manifest.yaml",
    "chunks": ["ap-pattern-01", "ap-pattern-02"]
  },
  "tech-findings-log": {
    "core": "docs/memories/tech-findings-log/tech-findings-log.core.md",
    "manifest": "docs/memories/tech-findings-log/manifest.yaml",
    "chunks": ["tfl-entry-20251020"]
  }
}
```
- Regenerated via sync script; never edited manually.

### Telemetry & Tooling Hooks
- Sync script should emit structured logs (JSON lines) for each operation.
- Consider metrics: `sync_success_total`, `sync_failure_total`, `pending_chunks`.
- Provide CLI command: `pnpm run memory:sync --chunk <chunk_id>` for manual retries.

### Open Questions / Follow-ups
- Define checksum algorithm (likely SHA256 of module content).
- Confirm ByteRover tag schema to align with manifest tags.
- Decide on automated schedule for backlog processing (cron vs. manual).


## Entry Template

```markdown
## [Category] - [Topic] - [Date]

**Decision:** [What was decided]

**Context:** [Problem being solved and relevant background]

**Alternatives Considered:**
1. Option A — Rejected because [...]
2. Option B — Rejected because [...]

**Chosen Approach:** [Summary of the winning option]

**Technical Rationale:**
- [Key reasoning bullet 1]
- [Key reasoning bullet 2]
- [Performance / compatibility implications]

**Implementation Details:**
- Location: [File(s) or package(s)]
- Commands: [Setup or migration commands]
- Configuration: [Important config snippets]

**Warning Signs (for AI agents):**
- If you see [...], do not [...]

**References:**
- [Link to ADRs, docs, issues]

### Manifest & Sync Checklist
1. Add/update the chunk entry in `docs/memories/tech-findings-log/manifest.yaml` (`id`, `title`, `file`, `tags`).
2. Set `checksum: null`, `sync_status: pending`, and `byterover_id: null` before running the ingestion script.
3. Run the ByteRover ingestion pipeline (`pnpm run memory:sync -- --chunk <chunk_id>` once implemented).
4. If upload fails, append a row to `docs/memories/memory-sync-backlog.md` noting chunk id, failure reason, timestamp (UTC), and agent id.
5. After a successful sync, record the new `checksum`, `byterover_id`, and `last_synced_at` in the manifest.
```

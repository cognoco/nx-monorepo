## Pattern Template

Use this template when adding new patterns:

```markdown
## Pattern N: [Pattern Name]

**Our Standard**: [One sentence describing the canonical approach]

### Pattern

[Code examples, configuration snippets, or command sequences]

### Applies To

[Which apps/packages this pattern governs]

### Rationale

- [Why this pattern exists]
- [Problems it prevents]
- [Alternatives that were considered and rejected]

### When Adding/Updating [Components]

⚠️ Generators may [describe misconfiguration or missing steps]

**Required action:**
1. [Step-by-step fixes or validation steps]
2. [Additional context-specific guidance]

### Verification

1. `pnpm exec nx run <project>:test`
2. `pnpm exec nx run <project>:build`
3. Document verification notes in delivery summary.

### Manifest & Sync Checklist

1. Add or update the entry in `docs/memories/adopted-patterns/manifest.yaml` with the new chunk `id`, `title`, `file`, and `tags`.
2. Set `checksum: null`, `sync_status: pending`, and `byterover_id: null` until the ingestion script updates them.
3. Run the ByteRover ingestion pipeline (`pnpm run memory:sync -- --chunk <chunk_id>`, once available).
4. On upload failure, append a row to `docs/memories/memory-sync-backlog.md` with the chunk id, reason, timestamp (UTC, ISO 8601), and your agent identifier.

### Last Validated

[Date] (Nx [version], Jest [version], Node [version])

**References**: [Link to related docs, ADRs, or troubleshooting entries]
```

## How to Update This Document

When should you add a new checklist?

✅ **DO add** when:
- You discover a generator creates code that needs fixing
- The fix is required for consistency with adopted patterns
- The fix will apply to future uses of the same generator
- Skipping the fix would cause problems

❌ **DON'T add** when:
- It's a one-time edge case
- It's optional configuration (belongs in `docs/testing-enhancements.md`)
- It's already handled automatically by the generator

**Authoring process:**
1. Add new section using the template below
2. Test the checklist with a fresh generation
3. Update corresponding pattern in `adopted-patterns.md` if needed
4. Update `last-updated` date in frontmatter

**Post-update checklist:**
1. Create or update the manifest entry with the correct chunk `id`, `title`, `file`, and `tags`.
2. Reset `checksum` to `null`, set `sync_status: pending`, and clear `byterover_id`.
3. Execute the ingestion pipeline (`pnpm run memory:sync -- --chunk <chunk_id>`, once available) to push updates to ByteRover.
4. On failure, record the attempt in `docs/memories/memory-sync-backlog.md` with chunk id, reason, timestamp (UTC, ISO 8601), and agent id.
5. After a successful sync, update the manifest with the generated `checksum`, `byterover_id`, and `last_synced_at`.

---

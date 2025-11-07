## Overview

This document provides comprehensive testing configuration patterns for the nx-monorepo. These patterns have been established through empirical testing and ensure consistency across all projects.

**⚠️ CRITICAL**: Testing (especially Jest) is a **very problematic area** with version compatibility issues and complex configuration interactions. Always follow the patterns documented here.

### Maintenance Checklist
1. When adding or modifying a section, update `docs/memories/testing-reference/manifest.yaml` with the chunk `id`, `title`, `file`, and `tags`.
2. Reset `checksum` to `null`, mark `sync_status: pending`, and clear `byterover_id` prior to syncing.
3. Run the ingestion pipeline (`pnpm run memory:sync -- --chunk <chunk_id>` once available) to mirror the update to ByteRover.
4. Record any sync failure in `docs/memories/memory-sync-backlog.md` (chunk id, reason, timestamp UTC, agent id) and leave the manifest entry pending until resolved.
5. After a successful sync, update the manifest with the new `checksum`, `byterover_id`, and `last_synced_at` values.

---

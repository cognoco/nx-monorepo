## Overview

This document provides troubleshooting solutions for common development issues in the nx-monorepo. These solutions have been validated through empirical testing.

### Maintenance Checklist
1. Update the relevant entry in `docs/memories/troubleshooting/manifest.yaml` with correct `id`, `title`, `file`, and `tags` whenever you add or modify a section.
2. Reset `checksum` to `null`, set `sync_status: pending`, and clear `byterover_id` before rerunning the ingestion script.
3. Run `pnpm run memory:sync -- --chunk <chunk_id>` (when available) to mirror changes to ByteRover.
4. Log any sync failure in `docs/memories/memory-sync-backlog.md` including chunk id, reason, timestamp (UTC), and agent id; leave the manifest entry pending until resolved.
5. After a successful sync, populate the manifest with the new `checksum`, `byterover_id`, and `last_synced_at`.

---

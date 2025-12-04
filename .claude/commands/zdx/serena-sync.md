# Sync Serena Memories with Documentation Stack

**Context:** This project has a tiered documentation hierarchy and a separate quick-orientation layer:

**Documentation Hierarchy (Authoritative):**
```
TIER 1 (Governance):    PRD.md, constitution.md, roadmap.md
TIER 2 (Architecture):  architecture.md, architecture-decisions.md, tech-stack.md
TIER 3 (Operational):   docs/memories/ (Cogno), .ruler/AGENTS.md
```

**Quick Orientation Layer:**
- **Serena** (`.serena/memories/`) — Compressed summaries optimized for rapid AI context loading. NOT authoritative — these are convenience summaries that reference the canonical sources above.

**Purpose of Serena Memories:** Enable an AI agent to quickly orient to the project without reading the full documentation stack. Think "executive summary" not "replica."

**Task:** Review and update Serena's memories to be accurate, compressed orientation summaries of the full documentation hierarchy.

---

## Instructions

### 1. Understand the documentation hierarchy
- Read `docs/index.md` for the canonical documentation map
- This establishes what sources each Serena memory should summarize

### 2. Review key authoritative sources
- **Tier 1:** Skim `docs/PRD.md`, `docs/constitution.md`, `docs/roadmap.md`
- **Tier 2:** Skim `docs/architecture.md`, `docs/architecture-decisions.md`, `docs/tech-stack.md`
- **Tier 3:** Skim `docs/memories/README.md`, `.ruler/AGENTS.md`, `docs/memories/adopted-patterns.md`
- Focus on extracting key points an AI needs for rapid orientation

### 3. List and read current Serena memories
- Use Serena's `list_memories` tool to see what exists
- Read each memory using `read_memory`
- Assess: Is it current? Is it useful? Does it cover the right scope?

### 4. Update each Serena memory using `write_memory`

| Memory | Should Summarize | Key Sources |
|--------|------------------|-------------|
| `project_overview.md` | Project identity, purpose, current state, architecture overview | PRD.md, README.md, roadmap.md, architecture.md |
| `code_style_and_conventions.md` | Critical patterns and conventions that MUST be followed | constitution.md, adopted-patterns.md, tech-stack.md |
| `suggested_commands.md` | Essential commands for daily work | package.json scripts, AGENTS.md commands section |
| `after_task.md` | Post-task checklist for quality gates | AGENTS.md workflow, Cogno post-generation-checklist |

### 5. Format guidelines for each memory
- Keep under 100 lines (quick-reference, not comprehensive)
- Lead with the most critical information
- End each section with: `**Authoritative source:** [filename]` pointer
- Use bullet points and tables for scannability
- Include "last synced" date at the bottom

### 6. Consider if additional memories are needed
- `common_gotchas.md` — Top 5-10 things that break (from troubleshooting.md, tech-findings-log.md)
- Only add if it provides distinct orientation value

### 7. Report
- List what was updated and what changed
- Note any memories added or removed
- Flag any conflicts or ambiguities found in source documentation
- Include the "last synced" date for tracking

---

## Constraints

- Serena memories are summaries, NOT duplicates — keep them compressed
- Always reference authoritative sources for details
- Do NOT update any documentation in `docs/` — only update `.serena/memories/`
- When sources conflict, flag for human review rather than choosing

---

## Quality Check

After updating, a new AI agent reading only Serena memories should be able to:
- Understand what this project is and its current state
- Know the critical patterns they must follow
- Find the right commands for common tasks
- Execute a proper post-task checklist

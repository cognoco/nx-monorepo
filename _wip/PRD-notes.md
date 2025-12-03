# PRD Merge Session Notes - In Progress

**Date Started:** 2025-11-18
**Session Status:** In Progress - Executive Summary Complete
**Next Session:** Continue with remaining sections

---

## Context & Objectives

### Mission
Merge two PRD drafts (docs/_alt1/PRD.md and docs/_alt4/PRD.md) into final docs/PRD.md that combines Alt1's rich context with Alt4's structural discipline, using BMAD template as authoritative structure.

### Source Files
- **Alt1** (`docs/_alt1/PRD.md`): 854 lines, very detailed, comprehensive
- **Alt4** (`docs/_alt4/PRD.md`): 214 lines, concise, well-structured
- **Template** (`.bmad/bmm/workflows/2-plan-workflows/prd/prd-template.md`): BMAD standard structure

### User Profile
- **Role:** Product Manager and Enterprise Architect
- **Technical Level:** High (not a developer but deeply technical)
- **Communication Style:** Explanatory but not dumbed down; numbered options preferred
- **Key Requirement:** Maintain continuity across sessions with comprehensive notes

---

## Strategic Decisions Made

### 1. Architectural Philosophy Placement (Q1)
**Decision:** Keep in PRD but pare down significantly

**Key Principle:** Separate three concerns:
1. **Business case/rationale** → Executive Summary or Project Classification
2. **Requirements** → NFR sections (e.g., scalability thresholds)
3. **Philosophy/Principles** → Streamlined section with core principles only

**What to KEEP in Philosophy:**
- Building-block architecture (composable, flexible, AI-optimized)
- Clear separation: template provides infrastructure, apps implement features
- Core principles only (WHY, not HOW)

**What to MOVE elsewhere:**
- Type safety flow diagrams → architecture.md (technical HOW)
- Security/Performance checklists → NFR sections (requirements)
- "Why this matters for AI agents" → Executive Summary/Project Classification (business case)
- Scalability numbers → NFR sections (requirements)

### 2. AI-First Development Context (Q2)
**Decision:** Keep but as business case/product positioning

**Placement:** Project Classification "Domain Context" or "Market Context"

**Focus:** Explain WHY this template exists (market gap for AI-first teams), NOT HOW to use AI agents (operational workflow)

**Critical Insight:** Avoid confusing AI agent frameworks (BMAD, Cogno) with the template itself. The template is AI-READY, not AI-DEPENDENT.

### 3. Requirements Structure (Q3)
**Decision:** Numbered FRs (FR1-FRn) grouped by theme (Alt4 approach)

**Rationale:** 
- Cleaner requirements traceability
- Status tracking belongs in project management tools, not PRD
- No detailed epic breakdowns or planning in PRD

**Planning Level:** High-level roadmap only (phases: MVP complete, MVP remaining, Post-MVP PoC)
- Indicative scope per phase, not prescriptive ordering
- Epic/story breakdown happens later via BMAD workflows

---

## Critical Distinctions - NEVER Confuse These

### Template vs. AI Agent Frameworks
**WRONG:** "Template provides Cogno memory system, post-generation checklists, quality gates for AI workflows"
**RIGHT:** "Template is structured to work seamlessly with AI agent frameworks through explicit documentation and consistent conventions"

**The template:**
- Provides structured documentation AI agents can parse
- Has consistent conventions AI agents can follow
- Defines clear boundaries AI agents can navigate
- Is READY for AI frameworks

**The template does NOT:**
- Include AI frameworks (Cogno, BMAD)
- Provide agent rules or memory management
- Implement AI-specific tooling

### Philosophy vs. Requirements vs. Implementation
**Philosophy:** Core principles (WHY we build this way)
**Requirements:** What the template must do (WHAT features/capabilities)
**Implementation:** Technical design patterns (HOW we build it) → Goes in architecture.md

---

## Completed Sections

### Executive Summary ✅
**Structure:** 4 paragraphs + "What Makes This Special"

**P1:** Product definition - what it is, who it's for
**P2:** Differentiation - AI-ready architecture
**P3:** Comprehensive scope - foundational decisions, complete infrastructure
**P4:** MVP validation (technical quality via walking skeleton) + PoC validation (orchestration model via Task App)

**What Makes This Special:** 3 themed sections, 14 bullets total
- AI-Native Architecture (4 bullets)
- Production-Ready from Day One (5 bullets)
- Building-Block Philosophy (5 bullets)

**Key Changes from Originals:**
- Clarified "foundational" decisions, not "every" decision
- Separated MVP technical validation from PoC orchestration validation
- Removed specific AI framework mentions (Cogno, BMAD)
- Removed "co-located" from testing (deferred to architecture)
- Removed product names (Sentry) from observability

---

## Sections Remaining

### Next Up: Scope of PRD (WHAT vs HOW)
**Source:** Alt4 has excellent section defining boundaries
**Purpose:** Clarify what PRD defines vs. what gets deferred to architecture.md

### Then: Project Classification
**Must Include:**
- Technical Type, Domain, Complexity
- Domain Context (AI-first market positioning)
- Clear statement: this is a meta-product (template itself is the deliverable)

### Then: Canonical Architectural Boundaries
**Source:** Alt4's concise WHAT list
**Purpose:** Authoritative list of non-negotiable architectural choices
**Examples:** Nx+pnpm, Next.js 15.2, Prisma+Supabase, REST+OpenAPI, etc.

### Then: Success Criteria
**Must Resolve Ambiguity:** MVP vs PoC expectations
**Approach:** Balance Alt1's quantitative metrics with Alt4's qualitative focus

### Then: Product Scope
**Must Resolve Ambiguities:**
1. Authentication scope (what's "wiring" in MVP vs UI in PoC?)
2. Testing coverage (MVP expectations vs PoC 80%)
3. Mobile timing (Stage 8 in MVP vs scaffolding only?)
4. Sentry integration (Stage 7 vs MVP baseline?)
5. CI/CD deployment (staging in MVP, production platforms in PoC?)

### Then: Architectural Philosophy
**Pare down to core principles only**
**Move technical details to NFRs or architecture.md**

### Then: Functional Requirements
**Format:** Numbered FRs (FR1-FRn) grouped by theme
**No epic breakdowns or sequencing**

### Then: Non-Functional Requirements
**Sections:** Performance, Security, Scalability, Accessibility, Integration
**Include:** Security/Performance checklists moved from Philosophy section

### Then: Out of Scope
**Source:** Alt1 has good explicit boundaries section
**Purpose:** Clear "NOT in MVP" statements

### Then: Implementation Planning
**High-level roadmap only:** Phase 1 (MVP), Phase 2 (PoC), Phase 3 (Future)
**No detailed sequencing:** Just indicative scope per phase
**Handoff:** "Epic/story breakdown via BMAD workflows"

---

## Five Critical Ambiguities to Resolve

When we reach Product Scope and Functional Requirements, must explicitly resolve:

1. **Authentication Scope:**
   - Alt1: "Auth wiring in MVP (FR15), UI in Task App"
   - Alt4: "Baseline authentication wiring in MVP"
   - Question: What exactly is "wiring"?

2. **Testing Coverage:**
   - Alt1: "Coverage targets enforced Phase 2+"
   - Alt4: "Smoke-level tests in MVP, ≥80% in PoC"
   - Question: MVP coverage expectations?

3. **Mobile Timing:**
   - Alt1: "Stage 8 within MVP"
   - Alt4: "Scaffolding in MVP, implementation in PoC"
   - Question: Mobile scope for MVP?

4. **Sentry Integration:**
   - Alt1: "Stage 7 (External Services)"
   - Alt4: "MVP baseline"
   - Question: When is Sentry actually done?

5. **CI/CD Deployment:**
   - Alt1: "Staging auto-deployment in MVP"
   - Alt4: "Staging in MVP, production (2 platforms) in PoC"
   - Question: Deployment timing alignment?

---

## Key Phrases & Terminology

### Approved Language
- "Foundational architectural, tooling, and governance decisions" (not "every")
- "AI-ready" or "architected to work with AI frameworks" (not "AI-native" if implying frameworks)
- "One or two lightweight hosting platforms" (not specific numbers like "3-6 apps")
- "Walking skeleton validates all layers" + "remains as permanent validation harness"
- "Template provides building blocks, applications implement features"

### Avoid
- Specific product names in high-level sections (mention in requirements/references only)
- Specific numbers for scalability (say "seamlessly as monorepo grows")
- Mentioning AI frameworks (Cogno, BMAD) as if they're part of template
- "Co-located tests" in executive content (architectural detail)
- Epic/story sequencing in PRD (deferred to BMAD workflows)

---

## Before Continuing Next Session

**MUST DO:**
1. Re-read `docs/_alt1/PRD.md` (854 lines) - internalize comprehensive detail
2. Re-read `docs/_alt4/PRD.md` (214 lines) - internalize structural discipline
3. Review this notes file completely
4. Check current `docs/PRD.md` to see what's completed

**Context to Internalize:**
- Alt1 is too verbose (bleeds into HOW territory)
- Alt4 is too terse (missing essential context)
- Target: ~400-500 lines (balanced)
- BMAD template is authoritative structure
- Jørn is PM/Architect, explain but don't dumb down
- Use numbered options when suitable

**Next Section:** Scope of PRD (WHAT vs HOW)

---

## Session Management

### Completed
- [x] Phase 1: Structural outline and strategic decisions
- [x] Phase 2: Executive Summary section complete

### In Progress
- [ ] Phase 2: Remaining sections (8 more to go)

### Remaining Phases
- [ ] Phase 3: Resolve critical ambiguities
- [ ] Phase 4: Content placement decisions (architecture.md split)
- [ ] Phase 5: Consistency & completeness check
- [ ] Phase 6: Final review & validation

---

## Important Context About the Product

**This is a meta-product:** The template itself is the deliverable, not the applications built on it.

**Three user levels:**
1. **Primary:** AI coding agents (consume structured docs, follow patterns)
2. **Secondary:** Human orchestrators (architects/PMs directing AI agents)
3. **Tertiary:** Developers using template to bootstrap projects

**The Vision:** Small teams (1-5 people) with high technical literacy but no coding skills can build production apps by orchestrating AI agents using this template.

**Walking Skeleton Philosophy:** Permanent validation harness that stays in template. New users clone, validate all layers work, then replace with real features. Proves infrastructure before feature work.

**PoC Purpose:** Not to prove technical quality (MVP does that), but to prove the orchestration model works (single human + AI agents = production features).

---

_End of notes. Next session: continue with "Scope of PRD (WHAT vs HOW)" section._


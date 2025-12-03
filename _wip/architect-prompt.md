# Architect Task: Architectural Consolidation & Validation (Pre-Stage 7)

## Context

You are working on the **nx-monorepo** project - a gold standard Nx monorepo template designed as a production-ready foundation for multi-platform applications.

### Current State
- **Phase 1 Stage 5**: Complete (walking skeleton fully implemented)
- **Next**: Stages 6-8 will complete the template
- **Challenge**: Architecture guidance is scattered across multiple documents
- **Goal**: Consolidate into BMAD-standard architecture specification BEFORE building Stages 7-8

### Why This Matters
Stages 7-8 will BUILD ON the current foundation. If the architectural foundation has flaws or inconsistencies, we'll compound them. This consolidation and validation ensures:
1. Clean, sound foundation before adding functionality
2. Clear architectural guidance for future development
3. BMAD-aware documentation that supports AI-assisted development
4. Alignment between documented architecture and as-built implementation

### The Template's Future
After completion, this template will:
1. Serve as foundation for a throwaway PoC (to-do app)
2. Be used for real production applications
3. Need to support BMAD-guided application development
4. Provide architectural constraints for applications built ON it

## Your Mission

Create two BMAD-standard documents that consolidate scattered architectural guidance:

### 1. `docs/architecture.md`
Comprehensive BMAD-standard architecture specification

### 2. `docs/tech-spec.md`
Technical specification for the template infrastructure

Both documents should follow BMAD standard templates and naming conventions.

---

## Task Breakdown

### Preparation: Review and Internalize Source Materials

**Read and analyze**:

1. **All documents at the root of `docs/`**
2. **All memories in `docs/memories/*` and subfolders**
3. **Memories in Serena MCP**
4. **`README.md`**
5. **User guides in `docs/guides`** (made for human users - for context only)
6. **Walking Skeleton Implementation** (as-built reference):
   - The actual codebase

---

### Task 0: Present Clarification Questions to User

**CRITICAL**: After reviewing source materials but BEFORE creating any documents, present clarification questions to the user.

**Purpose**: Ensure you understand the user's expectations, resolve ambiguities, and confirm your interpretation of the source materials.

**Questions to Ask** (customize based on what you find during your analysis):

1. **Scope Clarification**:
   - "I've reviewed the source materials. Should `architecture.md` include [specific area you're unsure about]?"
   - "The template will support mobile apps in the future. Should architecture.md document mobile architecture patterns now, or wait until mobile is implemented?"
   - "Should I document [specific technical area] in architecture.md or tech-spec.md?"

2. **Level of Detail**:
   - "How detailed should the implementation patterns be? Should I include code examples, or keep it conceptual?"
   - "For consistency rules, should I document every pattern I find, or focus on the most critical ones?"

3. **Conflicting Information**:
   - "I found different approaches in [source A] vs [source B] for [specific area]. Which should I follow?"
   - "The constitution says [X], but the implementation does [Y]. Should I document the as-built approach or the constitutional principle?"

4. **Future vs Current State**:
   - "Should the architecture document the CURRENT state (walking skeleton only) or the PLANNED state (after Stages 7-8)?"
   - "How should I handle areas that are planned but not yet implemented?"

5. **Validation Scope**:
   - "For validation, should I check ONLY the walking skeleton, or also review other infrastructure (CI/CD, tooling, etc.)?"
   - "What severity threshold should trigger a 'blocking' issue vs 'should fix' vs 'nice to have'?"

6. **Document Relationship**:
   - "After creating architecture.md and tech-spec.md, which existing docs should be deprecated/removed vs kept as supplementary?"
   - "Should architecture.md replace architecture-decisions.md, or complement it?"

**Format your questions clearly**:
- Group related questions together
- Provide context for each question
- Offer your preliminary recommendation where appropriate
- Number questions for easy reference

**Wait for user responses before proceeding to document creation.**

---

### Task 1: Create `docs/architecture.md`

**Purpose**: Consolidated BMAD-standard architecture specification for the monorepo template

**Template Structure** (from `.bmad/bmm/workflows/3-solutioning/architecture/architecture-template.md`):

**Key Principles**:
- Duplicate content into `architecture.md` - do not reference existing docs, they will be removed!
- Express scattered guidance in BMAD's structured format
- Maintain strategic rationale from source documents
- Ensure implementation patterns prevent AI agent conflicts
- Document both WHAT was built and WHY
- Create single source of truth for architectural guidance

---

### Task 2: Create `docs/tech-spec.md`

**Purpose**: Technical specification for the template infrastructure (walking skeleton + infrastructure)

**Template Structure** (from `.bmad/bmm/workflows/2-plan-workflows/tech-spec/tech-spec-template.md`):

**Key Principles**:
- Duplicate content into `tech-spec.md` - do not reference existing docs, they will be removed!
- Focus on infrastructure and tooling (not application features)
- Document template patterns that applications will follow
- Include constraints and known issues
- Reference architecture.md for detailed architectural patterns

---

### Task 3: Validate As-Built vs Architecture

**Purpose**: Ensure walking skeleton implementation aligns with documented architecture

**Approach**:
1. Review implemented code against `docs/architecture.md`
2. Check for architectural violations or deviations
3. Verify patterns are consistently applied
4. Identify technical debt or improvement opportunities

**Areas to Validate**:
- **Monorepo Structure**: Does it match documented patterns?
- **Dependency Flows**: Are dependency rules followed? (apps → packages, no circular deps)
- **TypeScript Configuration**: Matches adopted patterns?
- **Testing Patterns**: Co-located tests in `src/`? Configuration consistent?
- **Type Safety**: End-to-end type flow working correctly?
- **API Contracts**: REST+OpenAPI implementation matches specification?

**Validation Tools**:
- Derive from `README.md`.

**Document Findings**:
Create `docs/validation-report.md` with:
- ✅ Validated aspects (what's correctly implemented)
- ⚠️ Minor issues (non-blocking improvements)
- 🚨 Major issues (architectural violations requiring fixes)
- 📋 Recommendations (prioritized by impact)

---

### Task 4: Refactoring Recommendations (If Needed)

If validation reveals issues, provide:

**Priority 1 (Blocking)**: Must fix before Stage 7
- Architectural violations
- Pattern inconsistencies that will propagate
- Type safety breaks

**Priority 2 (Important)**: Should fix soon
- Technical debt that will grow
- Missing documentation
- Incomplete patterns

**Priority 3 (Nice to have)**: Can defer
- Optimizations
- Enhancements
- Non-critical improvements

---

## Deliverables

1. **`docs/architecture.md`** - BMAD-standard architecture specification
2. **`docs/tech-spec.md`** - Technical specification for template
3. **`docs/validation-report.md`** - As-built validation findings
4. **Refactoring recommendations** (if issues found) - Prioritized action items

---

## Success Criteria

✅ **architecture.md** follows BMAD template structure
✅ **architecture.md** consolidates all scattered architectural guidance
✅ **tech-spec.md** documents template infrastructure comprehensively
✅ **Validation report** systematically reviews as-built implementation
✅ **All documents** use BMAD standard naming (no "template-" prefix)
✅ **Clear distinction** between governance docs (architecture-decisions.md) and operational spec (architecture.md)
✅ **Ready for Stage 7-8** with clean, validated foundation

---

## Important Notes

### BMAD Conventions to Follow
- **Location**: All artifacts in `docs/` (per `.bmad/bmm/config.yaml`)
- **Naming**: Standard BMAD names (`architecture.md`, `tech-spec.md`)
- **Structure**: Follow BMAD template sections exactly
- **Style**: Operational/prescriptive (tells implementers HOW to build)

### What NOT to Do
- ❌ Don't modify existing governance documents
- ❌ Don't create "template-" prefixed files
- ❌ Don't duplicate content without consolidation
- ❌ Don't propose refactoring without validation evidence

### Context Management
- Read source materials systematically
- Use symbolic tools to explore implementation
- Consolidate incrementally (don't try to hold everything in context)
- Reference Cogno memories for established patterns

---

## Questions to Consider During Work

1. **Completeness**: Does the architecture spec cover all necessary areas for AI agents to implement consistently?
2. **Consistency**: Do the documented patterns match what's actually implemented?
3. **Clarity**: Can a new AI agent read this and understand how to add features to the template?
4. **Correctness**: Are there architectural flaws that should be fixed before building more?
5. **Traceability**: Can we map implementation decisions back to strategic rationale?

---

## Getting Started

1. **Read BMAD architecture template**: `.bmad/bmm/workflows/3-solutioning/architecture/architecture-template.md`
2. **Read BMAD tech-spec template**: `.bmad/bmm/workflows/2-plan-workflows/tech-spec/tech-spec-template.md`
3. **Review source materials**: Start with `docs/architecture-decisions.md` and `docs/constitution.md`
4. **Explore implementation**: Use symbolic tools to understand walking skeleton structure
5. **Create architecture.md**: Consolidate guidance into BMAD format
6. **Create tech-spec.md**: Document template infrastructure
7. **Validate**: Review as-built vs documented architecture
8. **Report findings**: Document validation results and recommendations

---

**Ready to create the architectural foundation for Stages 7-8?**

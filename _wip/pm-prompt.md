# PM Task: Reverse-Engineer PRD from Existing Documentation

## Context

You are working on the **nx-monorepo** project - a gold standard Nx monorepo template designed as a production-ready foundation for multi-platform applications.

### Current State
- **Phase 1 Stage 5**: Complete (walking skeleton fully implemented)
- **Documentation**: Extensive documentation exists, but NOT in BMAD PRD format
- **Challenge**: Need to reverse-engineer a BMAD-standard PRD from existing docs
- **Goal**: Create `docs/PRD.md` that captures product vision, requirements, and goals in BMAD format

### Why This Matters

BMAD workflows expect a PRD as the strategic foundation for:
1. **Architecture workflow**: References PRD to understand requirements
2. **Story creation**: Derives user stories from PRD functional requirements
3. **Validation**: Ensures implementation matches documented vision
4. **Future applications**: Provides template for applications built ON this template

The template IS a product (a development foundation), and needs a PRD that captures its vision, requirements, and goals.

### The Template's Nature

This is a **meta-product**: a foundation for building other products. The PRD should reflect:
- **Direct users**: Developers using the template
- **Indirect users**: End-users of applications built ON the template
- **Product goal**: Provide production-ready infrastructure for rapid multi-platform development

---

## Your Mission

Create `docs/PRD.md` - a BMAD-standard Product Requirements Document reverse-engineered from existing documentation.

**Key Insight**: You're not creating requirements from scratch. You're **extracting and consolidating** requirements that already exist but are scattered across multiple documents.

---

## Task: Create `docs/PRD.md`

**Template Structure** (from `.bmad/bmm/workflows/2-plan-workflows/prd/prd-template.md`):

## Source Materials to Extract From

### 1. **`docs/P1-plan.md` and `docs/poc-plan.md`**
Extract:
- Project vision and goals
- Success criteria per stage
- Functional requirements (what each stage delivers)
- Timeline and milestones
- **NOTE:** `docs/poc-plan.md` is an older version, not kept fully up to date - if discrepancies found, `P1-plan.md`is master.

### 2. **`docs/architecture-decisions.md`**
Extract:
- Strategic decisions (WHY certain technologies were chosen)
- Requirements driving those decisions
- Trade-offs considered

### 3. **`docs/constitution.md`**
Extract:
- Quality requirements (TDD, verification, quality gates)
- Non-negotiable standards
- Governance requirements

### 4. **`README.md`**
Extract:
- Project overview and purpose
- Target users (developers)
- Getting started requirements

### 5. **`CLAUDE.md`**
Extract:
- Project overview
- Technology stack requirements
- Development workflow requirements

### 6. **`docs/tech-stack.md`**
Extract:
- Technology requirements
- Version compatibility constraints
- Dependency requirements

### 7. **`docs/memories/adopted-patterns.md`**
Extract:
- Pattern requirements (test location, configuration)
- Consistency requirements

### 8. **Walking Skeleton Implementation**
Validate:
- Actual functional requirements delivered
- Working features as proof of requirements

---

## Task Breakdown

### Preparation: Review Source Materials

**Read and analyze all source materials listed above** to understand:
- Product vision and goals
- Existing requirements (functional and non-functional)
- Target users and their needs
- Implementation status and validation

---

### Task 0: Present Clarification Questions to User

**CRITICAL**: After reviewing source materials but BEFORE creating the PRD, present clarification questions to the user.

**Purpose**: Ensure you understand the product vision, resolve ambiguities about scope and requirements, and confirm your interpretation of extracted requirements.

**Example Questions to Ask** (customize based on what you find during your analysis):

1. **Product Vision and Scope**:
   - "Based on my review, the template's primary goal is [your understanding]. Is this accurate?"
   - "Should the PRD focus on the CURRENT template capabilities (walking skeleton) or the PLANNED capabilities (after Stages 7-8 completion)?"
   - "Is mobile app support in scope for this PRD, or should it be mentioned as 'future consideration'?"

2. **Target Users**:
   - "I've identified two user groups: developers using the template, and end-users of apps built on it. Are there other user groups I should include?"
   - "What developer experience level should this template target (junior, mid, senior, all levels)?"

3. **Functional Requirements**:
   - "I'm planning to map P1-plan.md stages to Epic structure. Should each stage become an epic, or should I group them differently?"
   - "Should I include infrastructure that's implemented but marked as 'walking skeleton' (to be deleted) in the PRD?"
   - "The PoC phase (to-do app) - should that be in the PRD as a requirement, or is that outside PRD scope?"

4. **Non-Functional Requirements**:
   - "I see test coverage target of ≥80%. Are there other specific NFR targets I should document (build time, startup time, etc.)?"
   - "What's the expected scale for this template (number of apps, number of packages, team size)?"

5. **Success Metrics**:
   - "How should we measure success for this template? Time-to-first-feature? Developer satisfaction? Adoption metrics?"
   - "Are there specific quality gates that define 'production-ready'?"

6. **Out of Scope**:
   - "Should I explicitly call out what's NOT included (authentication, authorization, specific features)?"
   - "What about production deployment, monitoring, observability - in scope or out of scope?"

7. **Timeline and Milestones**:
   - "Should the PRD include the phase breakdown from P1-plan.md, or just describe the final deliverable?"
   - "How should I handle the transition from 'template completion' to 'PoC validation' to 'real project'?"

8. **Requirements Conflicts**:
   - "I found [specific conflict between source documents]. Which should take precedence?"
   - "The constitution emphasizes [X], but the implementation shows [Y]. Should I document as-is or as-intended?"

**Format your questions clearly**:
- Group related questions together
- Provide context showing what you found in source materials
- Offer your preliminary recommendation where appropriate
- Number questions for easy reference

**Wait for user responses before proceeding to PRD creation.**

---

## Approach (After Clarifications)

### Step 1: Extract Vision and Goals
Using `README.md`, `CLAUDE.md`, and `P1-plan.md` introduction:
- What is this template?
- Who is it for?
- What problem does it solve?

### Step 2: Identify Target Users
From documentation, identify:
- Primary users: Developers using the template
- Secondary users: End users of applications built on template
- User needs and pain points

### Step 3: Map Functional Requirements to Epics
Review `P1-plan.md` stages and map to epic structure:
- Each stage roughly maps to an epic
- Extract requirements from stage descriptions
- Use walking skeleton as validation of requirements

### Step 4: Extract Non-Functional Requirements
From `constitution.md`, `tech-stack.md`, and `architecture-decisions.md`:
- Performance requirements
- Quality requirements
- Scalability requirements
- Security requirements

### Step 5: Define Success Criteria
From `P1-plan.md` success criteria:
- Per-phase success criteria
- Overall template success criteria

### Step 6: Document Dependencies and Risks
From `tech-stack.md` and `docs/memories/tech-findings-log.md`:
- External dependencies
- Version constraints
- Known risks and mitigations

---

## Key Principles

### Extraction, Not Invention
- Don't create new requirements
- Extract what's already documented or implemented
- Validate against walking skeleton

### BMAD Format
- Follow BMAD PRD template structure exactly
- Use BMAD terminology and conventions
- Ensure compatibility with BMAD workflows

### Completeness
- Capture all functional requirements
- Include all non-functional requirements
- Document all dependencies and constraints

### Traceability
- Requirements should trace back to source documents
- Document which source material provided each requirement
- Ensure consistency with implementation

### Template-Appropriate
- Remember: this is a product that IS a template
- Users are developers, not end-users
- Requirements are infrastructure, not features

---

## Success Criteria

✅ **PRD.md** follows BMAD template structure exactly
✅ **All functional requirements** extracted from existing docs
✅ **All non-functional requirements** documented
✅ **Requirements validated** against walking skeleton implementation
✅ **Epics align** with P1-plan.md stages
✅ **Success criteria** match documented goals
✅ **Dependencies and risks** comprehensively documented
✅ **BMAD-compatible** for downstream workflows (architecture, story creation)

---

## Deliverable

**`docs/PRD.md`** - BMAD-standard Product Requirements Document

This PRD will serve as the strategic foundation for:
- `docs/architecture.md` (architect will reference it)
- Epic and story creation (PM will reference it)
- Validation workflows (ensuring implementation matches requirements)
- Template documentation (explaining what the template provides)

---

## Important Notes

### Audience for This PRD
- **AI Agents**: Will use this to understand template requirements
- **Developers**: Will reference this to understand template capabilities
- **Template Maintainers**: Will use this to guide future development

### Relationship with Other Docs
- `docs/PRD.md` = WHAT we're building (requirements)
- `docs/architecture.md` = HOW we're building it (technical approach)
- `docs/P1-plan.md` = WHEN and in what order (implementation plan)
- `docs/constitution.md` = Governance principles (non-negotiable standards)

### What Makes This Unique
This is a **reverse-engineered PRD** - usually PRDs come first, but here:
1. Template was built iteratively
2. Requirements emerged through implementation
3. Documentation captured decisions along the way
4. Now we're consolidating into standard PRD format

This is **completely valid** - we're just formalizing what already exists.

---

## Getting Started

1. **Read BMAD PRD template**: `.bmad/bmm/workflows/2-plan-workflows/prd/prd-template.md`
2. **Review source materials**: Start with `docs/P1-plan.md` and `README.md`
3. **Extract vision and goals**: Understand the "why" of the template
4. **Map functional requirements**: Stage-by-stage requirements
5. **Extract non-functional requirements**: Quality, performance, scalability
6. **Document dependencies**: Technology stack and constraints
7. **Validate against implementation**: Walking skeleton proves requirements
8. **Create PRD.md**: Consolidate into BMAD format

---

**Ready to reverse-engineer the PRD?**

# AgentOS Standards Setup - Proposed Approach

## Executive Summary

This document outlines the proposed restructuring of AgentOS standards for this NX monorepo project, moving away from the default backend/frontend dichotomy to better align with the monorepo's architectural paradigm.

## Understanding of AgentOS

**AgentOS** is an AI-powered development system that uses:
- **Standards files**: Modular markdown files defining coding conventions
- **Injection system**: Context-aware inclusion of standards into agent prompts using `{{standards/path/*}}` syntax
- **Profile-based configuration**: Base installation with customizable profiles

The key principle is **specific, actionable guidance** over vague best practices, with standards injected contextually based on the task at hand.

---

## Critical Analysis: Backend/Frontend Structure vs. NX Monorepo

### The Mismatch

The default `backend/`/`frontend/` structure assumes a **traditional full-stack dichotomy**, but your NX monorepo has a **different architectural paradigm**:

**Your Project Structure:**
- `apps/` - Deployable applications (web, mobile, backend)
- `packages/` - Shared libraries (API, types, UI components)
- **Cross-cutting concerns**: Testing, linting, building managed by NX

**Problems with default structure:**
1. **API package** (`packages/api`) blurs frontend/backend line - it's consumed by both
2. **Shared libraries** don't fit cleanly into backend/frontend categories
3. **NX-specific patterns** (affected commands, project graph, workspace conventions) have no home
4. **Mobile app** doesn't fit frontend/backend paradigm well
5. **Monorepo-wide standards** (like dependency management, module boundaries) are architectural, not frontend/backend

---

## Recommended Structure for NX Monorepo

I recommend **restructuring** your standards to align with your NX architecture:

```
standards/
├── global/                 # Universal standards (all projects)
│   ├── coding-style.md
│   ├── commenting.md
│   ├── conventions.md
│   ├── error-handling.md
│   └── git-workflow.md
│
├── nx/                     # NX monorepo-specific standards
│   ├── project-structure.md
│   ├── module-boundaries.md
│   ├── dependency-management.md
│   ├── workspace-conventions.md
│   └── affected-workflows.md
│
├── packages/               # Shared library standards
│   ├── api-design.md      # oRPC + Zod patterns
│   ├── type-safety.md
│   ├── validation.md
│   └── library-exports.md
│
├── web/                    # Next.js + React standards
│   ├── components.md
│   ├── app-router.md
│   ├── server-components.md
│   ├── styling.md         # Tailwind patterns
│   └── accessibility.md
│
├── mobile/                 # React Native standards (future)
│   ├── components.md
│   ├── navigation.md
│   └── platform-specific.md
│
├── backend/                # Server-side app standards (future)
│   ├── api-routes.md
│   ├── database.md
│   └── authentication.md
│
└── testing/
    ├── unit-testing.md    # Jest patterns
    ├── e2e-testing.md     # Playwright patterns
    └── test-organization.md
```

---

## High-Level Content Recommendations

### 1. **Global Standards** (`global/`)
Should focus on **universal** coding practices:
- **coding-style.md**: TypeScript conventions, naming, DRY principles
- **error-handling.md**: Consistent error patterns across all code
- **git-workflow.md**: Commit conventions (Conventional Commits mentioned in CLAUDE.md)
- **conventions.md**: File naming, project naming
- Add: **tech-stack.md** - Currently has placeholders, should document:
  - Next.js 15, React 19
  - oRPC + Zod for API
  - pnpm as package manager
  - Jest + Playwright for testing

### 2. **NX-Specific Standards** (`nx/`) - **NEW**
Critical for monorepo success:
- **project-structure.md**: Where apps vs packages live, naming conventions
- **module-boundaries.md**: How to use `@nx/enforce-module-boundaries` properly
- **dependency-management.md**: When to use workspace deps vs external deps
- **affected-workflows.md**: Best practices for `nx affected` commands
- **task-orchestration.md**: How to configure targets, dependencies

### 3. **Packages Standards** (`packages/`) - **NEW**
Focused on **shared code quality**:
- **api-design.md**: oRPC patterns, router organization, procedure naming
- **type-safety.md**: Zod schema patterns, TypeScript strict mode usage
- **validation.md**: Input validation strategies
- **library-exports.md**: What to expose, barrel files, public API design

### 4. **Web Standards** (`web/`)
Replaces generic "frontend", specific to **Next.js + React**:
- **app-router.md**: Page structure, layouts, route organization
- **server-components.md**: Server vs client components, when to use each
- **components.md**: React 19 patterns (from current frontend/components.md)
- **styling.md**: Tailwind CSS patterns, responsive design
- **accessibility.md**: WCAG standards, semantic HTML
- **performance.md**: React 19 optimizations, lazy loading, memoization

### 5. **Testing Standards** (`testing/`)
Currently has one file, should expand to:
- **unit-testing.md**: Jest patterns, Testing Library best practices
- **e2e-testing.md**: Playwright patterns, page objects, selectors
- **test-organization.md**: Where tests live, naming, coverage expectations
- **mocking.md**: How to mock dependencies, API calls

### 6. **Backend/Mobile** (Future)
Keep structure but populate when needed

---

## Specific Content Examples (Following AgentOS Best Practices)

### Example: `nx/module-boundaries.md`
```markdown
## NX Module Boundary Standards

### Import Rules
- Apps can import from packages, NOT from other apps
- Packages can import from other packages with explicit dependencies
- Use `@nx-test/` prefix for all internal imports

### Enforcement
```typescript
// ✅ GOOD: App importing from package
import { api } from '@nx-test/api';

// ❌ BAD: App importing from another app
import { something } from '@nx-test/frontend';
```

### Configure in `.eslintrc.json`
```json
{
  "rules": {
    "@nx/enforce-module-boundaries": ["error"]
  }
}
```
```

### Example: `packages/api-design.md`
```markdown
## oRPC API Design Standards

### Router Organization
- Group related procedures in themed routers
- Export routers from `index.ts` using router composition
- Use Zod for all input/output validation

### Procedure Naming
- Queries: `get`, `list`, `find` (GET semantics)
- Mutations: `create`, `update`, `delete` (POST/PUT/DELETE semantics)

### Example
```typescript
import { z } from 'zod';
import { orpc } from '@orpc/server';

// ✅ GOOD: Clear naming, Zod validation
export const userRouter = orpc.router({
  getUser: orpc
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ name: z.string(), email: z.string().email() }))
    .query(async ({ input }) => {
      // Implementation
    }),
});
```
```

---

## Injection Point Strategy

Given the new structure, you'll use:

**For web development tasks:**
```
{{standards/global/*}}
{{standards/nx/project-structure}}
{{standards/nx/module-boundaries}}
{{standards/web/*}}
{{standards/testing/unit-testing}}
```

**For API/package development:**
```
{{standards/global/*}}
{{standards/nx/project-structure}}
{{standards/packages/*}}
{{standards/testing/unit-testing}}
```

**For E2E testing:**
```
{{standards/global/*}}
{{standards/testing/e2e-testing}}
{{standards/web/accessibility}}
```

This allows **granular, context-aware** injection based on the task type.

---

## Implementation Plan

1. **Restructure directories** as outlined above
2. **Migrate existing content**:
   - `global/*` → Keep, update tech-stack.md
   - `frontend/*` → Move to `web/`, adapt for Next.js specifics
   - `backend/*` → Keep structure, mark as "future"
   - `testing/*` → Expand with new files
3. **Create new NX and packages standards** from scratch
4. **Make content specific**: Replace placeholders in tech-stack.md, add concrete examples
5. **Update injection points** in AgentOS workflows to use new structure

---

## Next Steps

1. **Restructure the standards directories** as outlined?
2. **Start populating specific files** (e.g., `nx/module-boundaries.md`, `packages/api-design.md`)?
3. **Update tech-stack.md** with your actual stack details?
4. **Review AgentOS config** to set up proper injection points?

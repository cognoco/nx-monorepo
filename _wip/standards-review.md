# Default Profile Standards Review

## Summary

Reviewed all standards from the default AgentOS profile to determine:
1. Which global/ and testing/ standards are appropriate for NX-Monorepo profile
2. Whether non-excluded backend/ standards should remain
3. How to adapt frontend/ standards for our web/ folder

---

## 1. Global Standards Review (6 files)

### ✅ **coding-style.md** - KEEP AS-IS
**Content**: Naming conventions, DRY, small functions, meaningful names, remove dead code
**Assessment**: Universally applicable. Good practices for any codebase.
**Recommendation**: Inherit from default, no override needed.

### ✅ **commenting.md** - KEEP AS-IS
**Content**: Self-documenting code, minimal comments, evergreen comments only
**Assessment**: Sound advice. Aligns with modern best practices.
**Recommendation**: Inherit from default, no override needed.

### ✅ **conventions.md** - KEEP AS-IS
**Content**: Project structure, documentation, version control, environment config, dependency management, code review
**Assessment**: All relevant to monorepo development. Could potentially enhance with NX-specific conventions later.
**Recommendation**: Inherit from default. Consider future override to add NX-specific conventions.

### ✅ **error-handling.md** - KEEP AS-IS
**Content**: User-friendly messages, fail fast, specific exceptions, centralized handling, graceful degradation
**Assessment**: Excellent general principles applicable across all code.
**Recommendation**: Inherit from default, no override needed.

### ⚠️ **tech-stack.md** - OVERRIDE REQUIRED
**Content**: Template with placeholders for framework, runtime, database, testing, etc.
**Assessment**: THIS MUST BE CUSTOMIZED for your actual stack. Currently just has [e.g., ...] examples.
**Recommendation**: **MUST override with actual tech stack** (Next.js 15, React 19, oRPC, Zod, pnpm, Jest, Playwright, etc.)

### ✅ **validation.md** - KEEP AS-IS
**Content**: Server-side validation, client-side for UX, fail early, specific errors, allowlists, sanitize input
**Assessment**: Critical security practices. Especially relevant given Zod usage for validation.
**Recommendation**: Inherit from default. Could enhance later with Zod-specific patterns in packages/validation.md

---

## 2. Testing Standards Review (1 file)

### ⚠️ **test-writing.md** - CONSIDER ENHANCING
**Content**:
- Write minimal tests during development
- Test only core user flows
- Defer edge case testing
- Test behavior not implementation
- Clear test names, mock external deps, fast execution

**Assessment**:
- The "minimal testing" approach is opinionated and might not fit all teams
- Some teams prefer TDD or more comprehensive testing
- The general principles (test behavior, clear names, mock deps) are sound
- Missing Jest/Playwright-specific guidance
- Missing guidance on E2E vs unit test distinction

**Recommendation**: **OVERRIDE with enhanced version** that includes:
- Jest-specific patterns (describe/it/expect, Testing Library best practices)
- Playwright E2E patterns (page objects, locators)
- When to write unit vs integration vs E2E tests
- NX-specific testing patterns (test affected changes)
- Keep or adjust the "minimal testing" philosophy based on team preference

---

## 3. Backend Standards Review (Non-Excluded Files)

We excluded `backend/api.md` but kept these three:

### ❌ **migrations.md** - PROBABLY EXCLUDE
**Content**: Database migration best practices (reversible, small changes, zero-downtime, version control)
**Assessment**:
- Your project currently has no database layer mentioned
- If you add a database later, this becomes relevant
- Monorepo backend apps might not all use migrations
**Recommendation**: **EXCLUDE for now**. Add back when/if database is introduced.

### ❌ **models.md** - PROBABLY EXCLUDE
**Content**: Database model best practices (naming, timestamps, constraints, indexes, validation)
**Assessment**:
- Only relevant if you have database models
- Current stack (Next.js + oRPC) doesn't necessarily imply database usage
**Recommendation**: **EXCLUDE for now**. Add back when/if database is introduced.

### ❌ **queries.md** - PROBABLY EXCLUDE
**Content**: Database query best practices (prevent SQL injection, avoid N+1, select needed data, indexes, transactions)
**Assessment**:
- Only relevant with database queries
- Not applicable to current oRPC API layer
**Recommendation**: **EXCLUDE for now**. Add back when/if database is introduced.

**Note**: If you plan to add a database soon (PostgreSQL, Prisma, etc.), you could keep these and just mark them as "future" standards.

---

## 4. Frontend Standards Review (Excluded Files for Web Adaptation)

### ✅ **accessibility.md** - ADAPT FOR WEB
**Content**: Semantic HTML, keyboard nav, color contrast, alt text, screen reader testing, ARIA, headings, focus management
**Assessment**:
- All content is highly relevant for Next.js/React web applications
- Excellent foundation for accessibility standards
- Should be enhanced with Next.js-specific considerations (Image component alt text, Link accessibility)
**Recommendation**: **COPY to web/accessibility.md with Next.js enhancements**

Suggested enhancements:
- Next.js `<Image>` requires alt prop
- `<Link>` accessibility (descriptive text, not "click here")
- App Router metadata for page titles/descriptions
- Server Components and accessibility considerations

### ✅ **components.md** - ADAPT FOR WEB
**Content**: Single responsibility, reusability, composability, clear interface, encapsulation, consistent naming, state management, minimal props, documentation
**Assessment**:
- Perfect foundation for React components
- All principles apply to React 19 and Next.js
- Should be enhanced with React 19 and Next.js App Router specifics
**Recommendation**: **COPY to web/components.md with React 19/Next.js enhancements**

Suggested enhancements:
- Server Components vs Client Components (use client directive)
- React 19 features (useTransition, useOptimistic, etc.)
- Next.js component patterns (layouts, templates, loading, error)
- Props drilling vs Context vs state management
- TypeScript component typing patterns

### ✅ **css.md** - ADAPT FOR WEB
**Content**: Consistent methodology, avoid overriding framework styles, maintain design system, minimize custom CSS, performance (purging)
**Assessment**:
- Good general CSS principles
- Needs Tailwind-specific guidance since that's your CSS framework
- Short file - could be significantly enhanced
**Recommendation**: **COPY to web/styling.md (rename) with Tailwind-specific patterns**

Suggested enhancements:
- Tailwind utility-first patterns
- When to use @apply vs utilities
- Custom Tailwind configuration (theme extension)
- Dark mode patterns with Tailwind
- Responsive utility patterns (sm:, md:, lg:)
- PostCSS configuration notes

### ✅ **responsive.md** - ADAPT FOR WEB
**Content**: Mobile-first, standard breakpoints, fluid layouts, relative units, test across devices, touch-friendly, performance, readable typography, content priority
**Assessment**:
- Excellent responsive design principles
- Should be enhanced with Tailwind breakpoint specifics
- Could add Next.js Image responsive patterns
**Recommendation**: **COPY to web/responsive.md with Tailwind/Next.js enhancements**

Suggested enhancements:
- Tailwind breakpoint system (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)
- Next.js `<Image>` responsive patterns (sizes, fill, priority)
- Container queries (Tailwind 3.4+)
- Mobile navigation patterns for App Router

---

## Recommendations Summary

### Global Standards
| File | Action | Reason |
|------|--------|--------|
| coding-style.md | ✅ Inherit | Universal best practices |
| commenting.md | ✅ Inherit | Sound advice |
| conventions.md | ✅ Inherit | Broadly applicable |
| error-handling.md | ✅ Inherit | Universal principles |
| tech-stack.md | ⚠️ Override | Must fill in actual stack |
| validation.md | ✅ Inherit | Good foundation |

### Testing Standards
| File | Action | Reason |
|------|--------|--------|
| test-writing.md | ⚠️ Override/Enhance | Add Jest/Playwright specifics, NX patterns |

### Backend Standards
| File | Action | Reason |
|------|--------|--------|
| api.md | ❌ Already excluded | Using packages/api-design.md instead |
| migrations.md | ❌ Exclude | No database currently |
| models.md | ❌ Exclude | No database currently |
| queries.md | ❌ Exclude | No database currently |

### Frontend → Web Standards
| File | Action | Reason |
|------|--------|--------|
| accessibility.md | ✅ Copy & enhance | Great foundation, add Next.js specifics |
| components.md | ✅ Copy & enhance | Add React 19/Server Components guidance |
| css.md | ✅ Copy & enhance (rename to styling.md) | Add Tailwind patterns |
| responsive.md | ✅ Copy & enhance | Add Tailwind breakpoints, Next.js Image |

---

## Action Plan

### Phase 1: Update profile-config.yml
Add migrations/models/queries to exclusion list:
```yaml
exclude_inherited_files:
  - standards/backend/api.md
  - standards/backend/migrations.md
  - standards/backend/models.md
  - standards/backend/queries.md
  - standards/frontend/components.md
  - standards/frontend/css.md
  - standards/frontend/accessibility.md
  - standards/frontend/responsive.md
```

### Phase 2: Override Required Files
1. Create `global/tech-stack.md` with actual stack details
2. Create enhanced `testing/test-writing.md` with Jest/Playwright patterns

### Phase 3: Create Web Standards
1. Copy and enhance `web/accessibility.md`
2. Copy and enhance `web/components.md`
3. Copy and enhance `web/styling.md` (renamed from css.md)
4. Copy and enhance `web/responsive.md`

### Phase 4: Create New Standards (from notes.md proposal)
1. Create NX-specific standards in `nx/`
2. Create package standards in `packages/`
3. Create additional web standards (app-router.md, server-components.md, performance.md)

---

## Next Steps

Would you like me to:
1. **Update profile-config.yml** with the expanded exclusion list?
2. **Create the overridden tech-stack.md** with your actual stack?
3. **Create enhanced testing standards** with Jest/Playwright patterns?
4. **Adapt the frontend standards to web/** with Next.js/Tailwind enhancements?
5. **Create the new NX and packages standards** from scratch?

Or would you prefer to review this analysis first and provide guidance on priorities?

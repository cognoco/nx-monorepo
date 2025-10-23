---
Created: 2025-10-21
Modified: 2025-10-23T16:04
Version: 1
---

# Architecture Decisions: API Framework Selection

## Executive Summary

**Recommendation: Adopt REST+OpenAPI for API layer**

After comprehensive evaluation of 5 API framework candidates (oRPC, tRPC, ts-rest, Hono RPC, REST+OpenAPI), **REST+OpenAPI emerges as the best fit** for this Nx monorepo project with Express backend, Next.js web app, and future Expo mobile app.

**Key Decision Factors:**
- ✅ **Maximum flexibility**: Zero vendor lock-in, framework-agnostic architecture
- ✅ **AI-agent friendly**: OpenAPI is MCP standard with vast LLM training data
- ✅ **React Native support**: Battle-tested in production with universal HTTP client support
- ✅ **Future-proof**: Industry standard with mature tooling ecosystem
- ✅ **Express compatible**: Works with existing backend (no framework replacement needed)

**Alternative: oRPC** is recommended if rapid prototyping velocity outweighs long-term flexibility and ecosystem maturity.

---

## Comparison Matrix

### Weighted Scoring

Criteria weights based on project requirements:
- **AI-Agent Friendliness** (⭐⭐⭐): 30% - Critical for 80% AI coding workflow
- **Mobile Support** (⭐⭐⭐): 30% - React Native/Expo is Phase 2 requirement
- **Migration Path** (⭐⭐⭐): 20% - Risk mitigation, flexibility for unknowns
- **Learning Curve** (⭐⭐): 8% - Team ramp-up time (architects/PMs, not pro devs)
- **Simplicity** (⭐⭐): 7% - Minimize troubleshooting complexity
- **Ecosystem** (⭐⭐): 5% - Community support, examples, plugins

### Candidate Scores (out of 10)

| Framework | AI-Agent | Mobile | Migration¹ | Learning² | Simplicity | Ecosystem | **Weighted Total** |
|-----------|----------|--------|------------|-----------|------------|-----------|-------------------|
| **REST+OpenAPI** | 10 | 10 | 8 | 7 | 6 | 10 | **9.2** ⭐ |
| **oRPC** | 6 | 10 | 4 | 6 | 8 | 4 | **6.5** |
| **tRPC** | 9 | 6 | 4 | 7 | 7 | 9 | **6.8** |
| **ts-rest** | 6 | 2 | 4 | 8 | 8 | 5 | **4.65** |
| ~~Hono RPC~~ | 6 | 4 | 2 | 8 | 7 | 7 | ❌ **ELIMINATED** |

¹ *Migration score = inverted difficulty (lower lock-in = higher score)*
² *Learning curve = inverted hours (faster learning = higher score)*

**Note:** Hono RPC eliminated due to Express incompatibility (requires replacing entire backend framework).

---

## Detailed Framework Analysis

### 1. oRPC - **VIABLE ALTERNATIVE**

**Summary:** Modern RPC framework (Sept 2024) with end-to-end type safety, built-in OpenAPI support, and first-class React Native adapter.

#### Strengths
- ✅ **React Native ready**: Documented adapter (`@orpc/client/fetch`) with production examples
- ✅ **OpenAPI native**: Auto-generates Swagger docs, enables REST interop
- ✅ **Express integration**: `@orpc/server/node` adapter with minimal setup
- ✅ **Monorepo-first**: TypeScript Project References documented
- ✅ **Type-safe errors**: Inferred error types on client
- ✅ **AI-friendly docs**: 746 code snippets, LLM-optimized markdown
- ✅ **Quick setup**: Minimal configuration needed for Express integration

#### Weaknesses
- ⚠️ **Young project**: Only 13 months old (created Sept 2024)
- ⚠️ **Small community**: 3.6k GitHub stars vs tRPC's 38k
- ⚠️ **Limited AI training data**: Too new for GPT-4 cutoff (April 2023)
- ⚠️ **Fewer Stack Overflow resources**: ~50 questions vs tRPC's 1,200+

#### Scoring Breakdown
- **AI-Agent Friendliness**: 8/10 - Excellent docs, but too new for broad AI training data
- **Mobile Support**: 10/10 - First-class React Native adapter, documented examples
- **Migration Path**: 6/10 - OpenAPI provides escape hatch, can run alongside REST
- **Learning Curve**: 8/10 - 4-8 hours to proficiency
- **Simplicity**: 8/10 - Minimal boilerplate, clear mental model
- **Ecosystem**: 6/10 - Growing but small (293 dependent projects)

#### When to Consider oRPC Instead of REST+OpenAPI
1. **Rapid prototyping priority**: When time-to-first-endpoint matters more than long-term flexibility
2. **TypeScript-only stack**: When certain you'll never need non-TypeScript backend or external API consumers
3. **RPC mental model preference**: Team strongly prefers function-call style over HTTP semantics
4. **Small project scope**: When API will remain simple and migration cost stays low
5. **Comfort with newer tech**: Team willing to accept smaller ecosystem for modern DX

---

### 2. REST+OpenAPI - **RECOMMENDED** ⭐

**Summary:** Traditional REST APIs with modern TypeScript tooling (openapi-typescript + openapi-fetch) for automated type generation.

#### Strengths
- ✅ **Perfect AI-agent support**: OpenAPI is MCP standard, vast LLM training data
- ✅ **Universal mobile support**: React Native native fetch, axios ecosystem
- ✅ **Maximum flexibility**: Zero vendor lock-in, framework-agnostic
- ✅ **Mature tooling**: openapi-typescript (1.7M weekly downloads), orval (490K)
- ✅ **Public API ready**: Automatic documentation, SDK generation
- ✅ **Multi-language backend**: Can rewrite server in Go/Python/Rust later

#### Weaknesses
- ⚠️ **Build-time dependency**: Requires code generation pipeline
- ⚠️ **Schema maintenance**: OpenAPI spec must stay in sync with implementation
- ⚠️ **More boilerplate**: Setup overhead vs RPC frameworks
- ⚠️ **Manual updates**: After API changes, regenerate types + update client code

#### Scoring Breakdown
- **AI-Agent Friendliness**: 10/10 - OpenAPI is the gold standard for LLM tool integration
- **Mobile Support**: 10/10 - Battle-tested for React Native
- **Migration Path**: 8/10 - Trivial to escape (industry standard)
- **Learning Curve**: 6/10 - 16-26 hours (OpenAPI spec + codegen learning)
- **Simplicity**: 6/10 - Indirection from code generation
- **Ecosystem**: 10/10 - Infinite (every HTTP client works)

#### Why REST+OpenAPI is Recommended
REST+OpenAPI is the best choice for:
- ✅ **Zero vendor lock-in**: Industry standard with infinite tooling options
- ✅ **Future-proof architecture**: Works with any backend language, any HTTP client
- ✅ **AI-agent optimized**: OpenAPI is MCP standard, vast training data
- ✅ **Production-proven**: Battle-tested at massive scale (Google, Microsoft, AWS APIs)
- ✅ **Public API ready**: Automatic documentation, SDK generation for any language
- ✅ **Mature ecosystem**: Extensive tooling for validation, testing, mocking, monitoring

---

### 3. tRPC - **VIABLE BUT SUBOPTIMAL**

**Summary:** Mature RPC framework (2020) with excellent Next.js integration but problematic React Native support.

#### Why Not tRPC
- ❌ **Mobile friction**: Requires manual polyfills for React Native (TextDecoder, Streams)
- ❌ **No native OpenAPI**: Requires third-party `trpc-openapi` plugin
- ❌ **Higher lock-in**: Migration difficulty 6/10 vs oRPC's 4/10
- ✅ **Best ecosystem**: 38k stars, 1.17M weekly downloads
- ✅ **Best AI training data**: Created 2020, widely used by 2022-2023

#### Verdict
tRPC would excel for **Next.js + Express only**, but React Native support gaps make it suboptimal for multi-platform vision. If mobile is truly deferred indefinitely, tRPC becomes more attractive.

---

### 4. ts-rest - **TOO RISKY FOR MOBILE**

**Summary:** Contract-first REST framework with excellent Nx integration but unvalidated React Native support.

#### Why Not ts-rest
- ❌ **CRITICAL GAP**: Zero React Native documentation, examples, or community validation
- ❌ **Small AI training data**: Only 3.1k stars, no Stack Overflow presence
- ✅ **Best Nx integration**: Dedicated monorepo docs, solves affected builds problem
- ⚠️ **Unknown mobile risk**: Fetch-based client *should* work but **zero production evidence**

#### Verdict
Excellent for **web-only Nx monorepos**, but mobile requirement makes ts-rest too risky. Would require pioneering React Native integration without community support.

---

### 5. Hono RPC - **ELIMINATED** ❌

**Summary:** Framework-specific RPC requiring full Hono server (incompatible with Express).

#### Why Eliminated
- ❌ **Dealbreaker**: Cannot work with Express - requires replacing entire backend
- ❌ **Mobile issues**: Unresolved module resolution errors in React Native
- ❌ **High migration cost**: Would need to rewrite existing server

#### Verdict
**Non-starter** - violates "use what we have" principle. Would require abandoning Express backend generated in Stage 1.

---

## Decision Rationale

### Why REST+OpenAPI Over oRPC?

**Context-Specific Factors:**

1. **Walking Skeleton Phase**: Currently validating infrastructure
   - REST+OpenAPI: Establishes industry-standard patterns from day one
   - oRPC: Faster initial setup but creates technical debt if migration needed later
   - **Winner: REST+OpenAPI** (avoids future rework)

2. **Team Composition**: Architects/PMs, not professional developers
   - REST+OpenAPI: HTTP semantics are universal knowledge, worth the initial learning investment
   - oRPC: Simpler initially but framework-specific patterns don't transfer to other projects
   - **Winner: REST+OpenAPI** (transferable knowledge)

3. **AI-Assisted Development**: 80% AI coding
   - REST+OpenAPI: OpenAPI is MCP standard, AI agents have extensive training data
   - oRPC: Too new (Sept 2024) for comprehensive AI training data
   - **Winner: REST+OpenAPI** (superior AI tooling support)

4. **Mobile Timeline**: Phase 2 (not immediate)
   - REST+OpenAPI: Battle-tested in production React Native apps with infinite HTTP client options
   - oRPC: Documented adapter but smaller community validation
   - **Winner: REST+OpenAPI** (proven at scale)

5. **Risk Mitigation**: Unknown unknowns
   - REST+OpenAPI: Maximum flexibility - no vendor lock-in, no migration needed
   - oRPC: Provides OpenAPI escape hatch but migration still requires work
   - **Winner: REST+OpenAPI** (zero lock-in risk)

**Weighted Decision:**
- **Long-term flexibility**: REST+OpenAPI wins decisively (zero lock-in)
- **AI tooling support**: REST+OpenAPI wins (MCP standard)
- **Ecosystem maturity**: REST+OpenAPI wins (industry standard)
- **Mobile support**: Tie (both work, REST more proven)
- **Setup complexity**: oRPC wins (simpler initial setup) - but this is short-term thinking

**Final Verdict:** REST+OpenAPI's **maximum flexibility** and **zero vendor lock-in** outweigh oRPC's short-term velocity gains. The walking skeleton phase is the ideal time to establish best practices - choosing REST+OpenAPI avoids accumulating technical debt that would require migration work later.

---

## Implementation Guidance

### Recommended Path: REST+OpenAPI

#### Stage 4.1 Next Steps

1. **Choose OpenAPI generation strategy** (30 minutes)
   - **Recommended**: Code-first with `@asteasolutions/zod-to-openapi` (leverages existing Zod schemas from Stage 2.2)
   - Alternative: Spec-first with manual YAML editing (more control, more maintenance)
   - Get team buy-in on REST+OpenAPI approach and tooling choices

2. **Install tooling** (30 minutes)
   ```bash
   # Server: OpenAPI generation from Zod schemas
   pnpm add @asteasolutions/zod-to-openapi swagger-ui-express --filter @nx-monorepo/server
   pnpm add -D @types/swagger-ui-express --filter @nx-monorepo/server

   # API Client: Type generation and HTTP client
   pnpm add openapi-fetch --filter @nx-monorepo/api-client
   pnpm add -D openapi-typescript --filter @nx-monorepo/api-client

   # Remove oRPC dependencies
   pnpm remove @orpc/client --filter @nx-monorepo/api-client
   ```

3. **Set up generation pipeline** (4-6 hours)
   - Configure OpenAPI spec generation in server (using zod-to-openapi)
   - Add Nx target: `generate-types` in api-client (runs openapi-typescript)
   - Set up Swagger UI at `/api-docs` endpoint
   - Serve OpenAPI spec at `/openapi.json`

4. **Create minimal proof-of-concept** (2-4 hours)
   - Define health check endpoint with Zod schema validation
   - Generate OpenAPI spec from endpoint + schema
   - Generate TypeScript types in api-client
   - Create type-safe client wrapper
   - Verify end-to-end type safety from server to client

5. **Document decision** (30 minutes)
   - Add this file to version control
   - Update `docs/memories/tech-findings-log.md` with REST+OpenAPI patterns
   - Note OpenAPI generation workflow in `adopted-patterns.md`

#### No Migration Needed

REST+OpenAPI is the destination architecture - no future migration required. This is the industry standard that will serve the project indefinitely.

---

### Historical Alternative: oRPC (Not Recommended)

> ⚠️ **DECISION UPDATE (2025-10-23)**: This alternative was **NOT chosen**. REST+OpenAPI is the official architecture decision. This section is preserved for historical context and to document the decision-making process. Do not use these implementation steps.

If choosing oRPC over REST+OpenAPI (for rapid prototyping):

#### Stage 4.1 Next Steps

1. **Validate oRPC tradeoffs** (30 minutes)
   - Confirm team accepts vendor lock-in risk
   - Accept smaller ecosystem and AI training data limitations
   - Understand migration to REST may be needed later

2. **Install server dependencies** (15 minutes)
   ```bash
   pnpm add @orpc/server --filter @nx-monorepo/server
   pnpm add @orpc/client --filter @nx-monorepo/api-client
   ```

3. **Create minimal proof-of-concept** (2-4 hours)
   - Set up basic oRPC router in Express server
   - Create health check endpoint
   - Configure api-client to consume router type
   - Verify type inference works across packages

4. **Plan migration path** (30 minutes)
   - Document how to migrate to REST+OpenAPI later using oRPC's OpenAPI generation
   - Accept migration cost of 2-3 weeks when/if needed
   - Note this as technical debt in project documentation

---

## Appendices

### A. Research Methodology

**Tools Used:**
- Context7 MCP: Latest official documentation
- Exa Code Search: Real-world monorepo examples
- Perplexity AI: Recent framework comparisons (2025)
- Web Search: Community sentiment, mobile support issues
- Nx MCP: Nx-specific integration patterns

**Evaluation Timeline:** October 21, 2025 (2 hours comprehensive research)

---

### B. Key Research Sources

**oRPC:**
- Official docs: https://orpc.unnoq.com/
- GitHub: https://github.com/unnoq/orpc (3.6k stars)
- v1 Announcement: https://orpc.unnoq.com/blog/v1-announcement
- Mobile adapter: https://orpc.unnoq.com/docs/adapters/react-native

**tRPC:**
- Official docs: https://trpc.io/
- GitHub: https://github.com/trpc/trpc (38k stars)
- React Native polyfills: Community Discord threads, GitHub issues

**ts-rest:**
- Official docs: https://ts-rest.com/
- Nx guide: https://ts-rest.com/docs/guides/nx
- GitHub: https://github.com/ts-rest/ts-rest (3.1k stars)

**REST + OpenAPI:**
- openapi-typescript: https://openapi-ts.pages.dev/
- openapi-fetch: https://openapi-ts.pages.dev/openapi-fetch/
- @asteasolutions/zod-to-openapi: https://github.com/asteasolutions/zod-to-openapi

---

### C. Decision Change Protocol

**When to Revisit This Decision:**

Trigger events:
1. oRPC ceases active maintenance (no releases for 6+ months)
2. Mobile Phase 2 discovers critical oRPC React Native issues
3. Public API requirement emerges (may need REST + OpenAPI)
4. Backend rewrite in non-TypeScript language planned

**Review Cadence:**
- After Phase 1 completion (walking skeleton done)
- After Phase 2 completion (mobile app integrated)
- Annually or when major framework updates released

---

### D. Alternative Frameworks Not Evaluated

**Excluded from evaluation:**
- **GraphQL** (Apollo, Relay): Too complex for walking skeleton, schema management overhead
- **gRPC**: Not HTTP-friendly for web/mobile browsers, requires protobuf
- **Elysia**: Built specifically for Bun runtime, not compatible with Node.js/Express
- **Feathers.js**: Real-time focus, heavier than needed
- **NestJS built-in REST**: NestJS adoption requires replacing Express

**Rationale:** These frameworks either don't fit the Express + Next.js + React Native stack or add unnecessary complexity for the walking skeleton phase.

---

## Changelog

- **2025-10-23**: Decision reversed to REST+OpenAPI after removing sunk cost bias and re-evaluating architecture goals
  - Recommendation: REST+OpenAPI (primary), oRPC (alternative for rapid prototyping)
  - Rationale: Maximum flexibility and zero vendor lock-in outweigh short-term velocity gains
  - Updated: All scoring, decision rationale, and implementation guidance

- **2025-10-21**: Initial decision document created (Stage 4.1 research)
  - Evaluated: oRPC, tRPC, ts-rest, Hono RPC, REST+OpenAPI
  - Initial recommendation: oRPC (influenced by sunk cost bias)
  - Eliminated: Hono RPC (Express incompatibility)

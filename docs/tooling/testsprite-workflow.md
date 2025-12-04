# TestSprite Workflow Guide

This guide covers the operational workflow for using TestSprite MCP to generate and execute AI-driven E2E tests.

## Overview

**TestSprite** is an AI testing tool that generates Python Playwright tests from PRDs (Product Requirements Documents) and executes them in the cloud against your local development servers.

### When to Use TestSprite

| Use Case | TestSprite | Playwright |
|----------|------------|------------|
| PRD validation before implementation | ✅ | |
| Quick smoke testing during development | ✅ | |
| API contract verification | ✅ | |
| Edge cases (empty state, error state) | | ✅ |
| Network interception/failure injection | | ✅ |
| Visual regression testing | | ✅ |
| CI/CD integration | | ✅ |
| Complex multi-step user flows | | ✅ |

**Key insight**: TestSprite is complementary to Playwright, not a replacement. Use TestSprite for fast feedback during development; use Playwright for comprehensive E2E coverage in CI.

---

## Prerequisites

1. **TestSprite Account**: Sign up at testsprite.com
2. **API Key**: Generate from TestSprite dashboard
3. **MCP Server**: Configure TestSprite MCP in Claude Code settings with your API key
4. **Local Servers Running**: Your application must be accessible on localhost

---

## The TestSprite Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    TestSprite Workflow                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Write Accurate PRD                                       │
│         │                                                    │
│         ▼                                                    │
│  2. Generate Code Summary                                    │
│         │                                                    │
│         ▼                                                    │
│  3. Generate Standardized PRD                                │
│         │                                                    │
│         ▼                                                    │
│  4. Bootstrap Tests (configure ports, paths)                 │
│         │                                                    │
│         ▼                                                    │
│  5. Generate Test Plan                                       │
│         │                                                    │
│         ▼                                                    │
│  6. Execute Tests & Generate Report                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Step 1: Write an Accurate PRD

**This is the most critical step.** PRD accuracy directly determines test success rate.

**Required elements for a good PRD:**

```markdown
# Feature PRD - [Feature Name]

## Base URL
- Development: `http://localhost:PORT`

## Endpoints / Pages

### 1. [Endpoint/Page Name]
**URL**: `/exact/path`
**Method**: GET/POST/etc (for APIs)

**Request** (for APIs):
- Headers: Content-Type, etc.
- Body schema with exact field names

**Response** (for APIs):
{
  "exactFieldName": "type and format"
}

**Elements** (for pages):
- Exact text that appears on screen
- Button labels, heading text
- Component behavior descriptions

**Expected Behavior**:
- What happens on success
- What happens on error
- Loading states
```

**PRD mistakes that cause test failures:**
- ❌ Saying response is `[...]` when it's actually `{ "data": [...] }`
- ❌ Wrong endpoint paths (`/api/health` vs `/api/health/ping`)
- ❌ Missing response wrapper objects
- ❌ Ambiguous UI element descriptions

### Step 2: Generate Code Summary

```
MCP Tool: testsprite_generate_code_summary
Parameter: projectRootPath = "/absolute/path/to/project"
```

Creates `testsprite_tests/tmp/code_summary.json` with tech stack and features.

### Step 3: Generate Standardized PRD

```
MCP Tool: testsprite_generate_standardized_prd
Parameter: projectPath = "/absolute/path/to/project"
```

**Note**: Requires your PRD file to exist in `testsprite_tests/tmp/prd_files/`.

### Step 4: Bootstrap Tests

```
MCP Tool: testsprite_bootstrap_tests
Parameters:
  - projectPath: "/absolute/path/to/project"
  - localPort: 3000 (or your app's port)
  - type: "frontend" or "backend"
  - testScope: "codebase" or "diff"
```

This configures the TestSprite tunnel to your local server.

### Step 5: Generate Test Plan

For frontend:
```
MCP Tool: testsprite_generate_frontend_test_plan
Parameters:
  - projectPath: "/absolute/path/to/project"
  - needLogin: true/false
```

For backend:
```
MCP Tool: testsprite_generate_backend_test_plan
Parameter: projectPath = "/absolute/path/to/project"
```

Creates `testsprite_tests/testsprite_*_test_plan.json`.

### Step 6: Execute Tests

```
MCP Tool: testsprite_generate_code_and_execute
Parameters:
  - projectPath: "/absolute/path/to/project"
  - projectName: "nx-monorepo" (root directory name)
  - testIds: [] (empty for all, or specific IDs)
  - additionalInstruction: "" (optional guidance)
```

Generates Python test files, executes in cloud, produces `raw_report.md`.

---

## Understanding Test Results

### Pass/Fail Interpretation

| Result | Meaning |
|--------|---------|
| ✅ Passed | Feature works as documented in PRD |
| ❌ Failed (PRD issue) | PRD was ambiguous or inaccurate |
| ❌ Failed (Bug) | Implementation doesn't match PRD |
| ❌ Failed (Limitation) | Test requires capability TestSprite lacks |

### Common Limitation Failures

These failures indicate TestSprite limitations, not code bugs:

- **"Cannot verify empty state"** - TestSprite can't clear database
- **"Cannot simulate API failure"** - TestSprite can't inject network errors
- **"Cannot trigger CI pipeline"** - TestSprite can't access external systems
- **"Cannot access source files"** - TestSprite only interacts via UI/API

**Action**: Move these test cases to Playwright or manual verification.

---

## Project Structure

TestSprite creates files in `testsprite_tests/` (gitignored):

```
testsprite_tests/
├── tmp/
│   ├── prd_files/           # Your PRD documents
│   │   ├── backend-prd.md
│   │   └── frontend-prd.md
│   ├── code_summary.json    # Generated tech stack summary
│   └── raw_report.md        # Test execution results
├── TC001_*.py               # Generated Python test files
├── TC002_*.py
├── testsprite_*_test_plan.json
└── *-test-report.md         # Final analysis reports
```

---

## Troubleshooting

### MCP Server Disconnects

**Symptom**: Tool calls fail with connection errors.

**Solution**: Use `/mcp` command in Claude Code to reconnect, then retry.

### 0% Pass Rate

**Symptom**: All tests fail on first run.

**Cause**: PRD doesn't accurately describe the implementation.

**Solution**:
1. Check actual API responses with `curl`
2. Compare response format to PRD
3. Update PRD with exact field names, paths, wrapper objects
4. Delete `testsprite_tests/` and re-run full workflow

### Tests Hang or Timeout

**Symptom**: Tests don't complete.

**Cause**: Local server not accessible or wrong port.

**Solution**:
1. Verify server is running: `curl http://localhost:PORT`
2. Check bootstrap used correct port
3. Ensure no firewall blocking localhost

### Wrong Port Used

**Common ports in this project**:
- Next.js web: `3000` (target: `web:dev`)
- Express server: `4000` (target: `server:serve`)

---

## Integration with Existing Testing

TestSprite complements but doesn't replace the existing test infrastructure:

| Layer | Tool | Location |
|-------|------|----------|
| Unit Tests | Jest | `src/**/*.spec.ts` |
| Integration Tests | Jest | `src/**/*.spec.ts` |
| E2E Tests (comprehensive) | Playwright | `apps/web-e2e/src/` |
| E2E Tests (PRD validation) | TestSprite | `testsprite_tests/` (gitignored) |

**Recommended workflow**:
1. Write PRD for new feature
2. Run TestSprite to validate PRD accuracy
3. Implement feature
4. Run TestSprite again to catch implementation drift
5. Write Playwright tests for edge cases and CI
6. Commit Playwright tests (not TestSprite artifacts)

---

## Quick Reference

| Task | MCP Tool |
|------|----------|
| Analyze codebase | `testsprite_generate_code_summary` |
| Create standard PRD | `testsprite_generate_standardized_prd` |
| Configure tunnel | `testsprite_bootstrap_tests` |
| Generate frontend tests | `testsprite_generate_frontend_test_plan` |
| Generate backend tests | `testsprite_generate_backend_test_plan` |
| Execute tests | `testsprite_generate_code_and_execute` |
| Re-run tests | `testsprite_rerun_tests` |

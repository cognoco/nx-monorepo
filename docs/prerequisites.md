---
Created: 2025-10-17T16:16
Modified: 2025-10-17T16:16
---
# Prerequisites

This document lists all required tools and their verified versions for this project.

## System Requirements

### Node.js
- **Required:** v20.x or later
- **Verified:** v22.20.0 ✅
- **Installation:** https://nodejs.org/ or use nvm/nvm-windows

### pnpm
- **Required:** v8.x or later
- **Verified:** v10.13.1 ✅
- **Installation:** `npm install -g pnpm` or https://pnpm.io/installation

### Playwright
- **Required:** v1.36.0 or later
- **Verified:** v1.56.0 ✅
- **Installation:** Included in project dependencies, browsers auto-installed

## Configuration

### Package Manager
- **Set in package.json:** `"packageManager": "pnpm@10.13.1"`
- This ensures all team members use the same package manager version

### npm Artifacts
- **Status:** package-lock.json removed ✅
- Only pnpm-lock.yaml should be used for dependency locking

## Verification Commands

To verify your local environment matches these requirements:

```bash
# Check Node.js version
node --version
# Expected: v20.x or later

# Check pnpm version
pnpm --version
# Expected: v8.x or later

# Check Playwright version
npx playwright --version
# Expected: v1.36.0 or later

# Verify package manager setting
cat package.json | findstr "packageManager"
# Expected: "packageManager": "pnpm@10.13.1"
```

## Next Steps

After verifying prerequisites:
1. Run `pnpm install` to install dependencies
2. Run `nx run web:build` to verify the project builds
3. Run `nx run web:dev` to start the development server

---

**Last Updated:** 2025-10-17
**Phase 1 - Stage 0.1:** Prerequisites Verification

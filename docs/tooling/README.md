# Tooling Documentation

This directory contains operational guides for development tools used in this monorepo.

## Available Guides

- [**Serena Workflow**](./serena-workflow.md) - Complete operational guide for Serena MCP (semantic code navigation)
  - Setup: CLI commands for indexing and project activation
  - Usage: How to interact with Serena during development
  - Maintenance: When to re-index, integration with Cogno
  - Troubleshooting: Common issues and solutions

- [**TestSprite Workflow**](./testsprite-workflow.md) - AI-generated E2E testing via TestSprite MCP
  - When to use: PRD validation, smoke testing during development
  - Workflow: PRD → Code Summary → Bootstrap → Test Plan → Execute → Report
  - PRD quality: Critical requirements for accurate test generation
  - Limitations: What TestSprite can and cannot test
  - Integration: How TestSprite complements Playwright

## Future Documentation

As additional tooling is integrated (e.g., cascade validation scripts, custom generators), operational guides will be added here.

---

**Note**: This directory contains **operational how-to guides**, not architectural decisions. For architecture and patterns, see `docs/memories/`.

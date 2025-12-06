# Docker / WSL Environment Issues

## Governing Reference

- **Document**: `docs/architecture-decisions.md`, Section: "Epic 5: CI/CD Staging Deployment"
- **Alignment**: Docker containerization is required for Railway deployment. This module documents WSL-specific environmental constraints that block local Docker validation.

## TL;DR

Docker Desktop with WSL2 integration can become unavailable due to service crashes or misconfiguration. When this happens, Docker commands fail with errors indicating the daemon is not running. **Agents MUST halt and notify the user** rather than attempting to debug Docker infrastructure.

## Symptom Pattern

**Error messages indicating Docker unavailability:**

```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

```
docker: command not found
```

```
error during connect: Get "http://%2F%2F.%2Fpipe%2Fdocker_engine/...": open //./pipe/docker_engine: The system cannot find the file specified.
```

```
The command 'docker' could not be found
```

**Context indicators:**
- Platform is WSL2 (Linux kernel on Windows)
- Docker Desktop is the expected Docker provider
- Commands like `docker ps`, `docker build`, `docker compose` fail
- `which docker` returns nothing or a broken path

## Agent Protocol

**CRITICAL: When Docker commands fail with the above symptoms, agents MUST:**

1. **HALT immediately** - Do not attempt to fix Docker infrastructure
2. **Notify user** with this message:

   > Docker appears to be unavailable in WSL. This is typically caused by Docker Desktop not running or WSL integration being disconnected.
   >
   > **Please check:**
   > 1. Is Docker Desktop running on Windows?
   > 2. Is WSL integration enabled in Docker Desktop settings?
   > 3. Try restarting Docker Desktop if needed.
   >
   > Let me know when Docker is available and I'll continue.

3. **Wait for user confirmation** before continuing Docker-related work
4. **Do NOT attempt** any of the following:
   - Installing Docker in WSL
   - Modifying Docker configuration
   - Restarting services
   - Diagnosing networking issues

## Why This Protocol Exists

Docker Desktop on Windows with WSL2 integration is a complex stack:
- Windows → Docker Desktop → WSL2 → Linux → Docker CLI

When any layer fails, the symptoms appear in WSL as "Docker not found" or "daemon not running." The actual fix almost always requires **user action on the Windows side** (restarting Docker Desktop, enabling WSL integration, etc.).

Agents attempting to debug this:
- Waste time on infrastructure issues outside their scope
- May make incorrect assumptions about the environment
- Cannot access Windows-side controls

## Verification Commands

After user confirms Docker is restored, verify with:

```bash
docker --version
docker ps
docker compose version
```

All three should succeed before resuming Docker-related tasks.

## Related Stories

- **Story 5.3**: Configure Docker Containerization - Tasks 5 & 6 blocked by this issue
- **Story 5.4**: Validate Staging Deployment - Depends on Docker availability

## Last Validated

- **Date**: 2025-12-06
- **Context**: Story 5.3 implementation blocked by Docker Desktop crash
- **Author**: Dev Agent (Mort)

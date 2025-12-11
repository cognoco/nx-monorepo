# =============================================================================
# Server Dockerfile - Multi-stage build for production deployment
# =============================================================================
# Build context: Project root (for monorepo workspace access)
# Usage: docker build -f apps/server/Dockerfile -t nx-monorepo-server .
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Builder - Install dependencies and build application
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm via corepack (Node.js built-in package manager manager)
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy workspace configuration files first (for better layer caching)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy Nx and TypeScript configuration
COPY nx.json tsconfig.json tsconfig.base.json ./

# Copy the server app and its workspace dependencies
COPY apps/server/ ./apps/server/
COPY packages/ ./packages/

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Generate Prisma Client (required before build - creates TypeScript types from schema)
# Using npx with specific version to match lockfile (npx defaults to latest which is Prisma 7 with breaking changes)
RUN npx prisma@6.17.1 generate --schema=packages/database/prisma/schema.prisma

# Disable Nx daemon in Docker (file watchers/IPC can be problematic in containers)
ENV NX_DAEMON=false

# Disable all Nx caching in Docker builds to avoid "File exists" race condition
# Root cause: Nx's cache.js tries to write task outputs after build completes,
# but Docker's overlay filesystem causes EEXIST errors during parallel cache writes.
# This is fine - Docker images are ephemeral, we don't need build caching inside them.
ENV NX_SKIP_NX_CACHE=true

# Sync workspace (required for non-interactive builds)
RUN pnpm exec nx sync

# Build the server and run Nx prune target
# This generates: pruned pnpm-lock.yaml + workspace_modules with only production deps
RUN pnpm exec nx run server:prune

# -----------------------------------------------------------------------------
# Stage 2: Production - Minimal runtime image
# -----------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install pnpm via corepack (needed for production install)
RUN corepack enable && corepack prepare pnpm@10 --activate

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy the pruned build output and clean package.json in one layer
# Nx prune generates a self-contained deployment package
COPY --from=builder /app/dist/apps/server ./
COPY --from=builder /app/packages/database/prisma ./prisma/

# Strip devDependencies from package.json, install deps, generate Prisma client, and set ownership
# All in one RUN to avoid layer duplication from chown
# Note: Using node instead of jq for JSON manipulation to avoid Alpine package dependency issues
#       (jq installation can fail if Alpine package mirrors have transient TLS errors)
RUN node -e "const p=require('./package.json'); delete p.devDependencies; delete p.nx; require('fs').writeFileSync('package.json', JSON.stringify(p, null, 2));" && \
    # Install production dependencies only
    pnpm install --prod --ignore-scripts && \
    # Generate Prisma client - pin version to match lockfile (Prisma 7 has breaking schema changes)
    npx prisma@6.17.1 generate --schema=prisma/schema.prisma && \
    # Set ownership LAST in same layer to avoid copy-on-write duplication
    chown -R expressjs:nodejs /app

# Switch to non-root user
USER expressjs

# Expose the server port (default: 4000, configurable via PORT env var)
EXPOSE 4000

# Health check - verify the server is responding
# Uses wget (available in alpine) instead of curl
# Note: Use 127.0.0.1 instead of localhost to avoid IPv6 resolution issues in Alpine
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT:-4000}/api/health || exit 1

# Start the server
CMD ["node", "main.js"]

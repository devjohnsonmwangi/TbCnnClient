# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build frontend (using environment variables from Cloud Run)
RUN pnpm build

# Production image - minimal footprint
FROM node:18-alpine

# Install http-server globally
RUN npm install -g http-server

WORKDIR /app

# Copy dist folder from builder
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser
USER appuser

# Port (Cloud Run sets PORT env var, defaults to 8080)
EXPOSE 8080

# Health check to ensure container is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start http-server with:
# -p 8080: listen on port 8080
# -c-1: disable caching HTTP headers (client-side caching)
# --gzip: enable gzip compression
# -f index.html: SPA fallback - serve index.html for all unknown routes
CMD ["http-server", "dist", "-p", "8080", "-c-1", "--gzip", "-f", "index.html"]

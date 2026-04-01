#!/bin/bash
# GCP Cloud Run Deployment Script
# This script builds and deploys the frontend to Google Cloud Run with proper SPA routing

set -e

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-your-gcp-project}"
SERVICE_NAME="eafia-frontend"
REGION="us-central1"
API_URL="${API_URL:-https://api.yourdomain.com}"
FRONTEND_URL="https://${REGION}-${PROJECT_ID}.cloudfunctions.net"

echo "=========================================="
echo "E-Afya Frontend - GCP Cloud Run Deployment"
echo "=========================================="
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo "API URL: $API_URL"
echo ""

# Check prerequisites
echo "Checking prerequisites..."
command -v gcloud &> /dev/null || { echo "gcloud CLI not installed"; exit 1; }
command -v pnpm &> /dev/null || { echo "pnpm not installed"; exit 1; }
echo "✓ Prerequisites met"
echo ""

# Build frontend
echo "Building frontend..."
cd "$(dirname "$0")"
export VITE_API_BASE_URL=$API_URL
export VITE_ENV=production
pnpm install --frozen-lockfile
pnpm build
echo "✓ Frontend build complete"
echo ""

# Create Dockerfile
echo "Creating Cloud Run Dockerfile..."
cat > Dockerfile << 'DOCKERFILE_EOF'
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage
FROM node:18-alpine

# Install lightweight HTTP server with SPA fallback
RUN npm install -g http-server

WORKDIR /app
COPY --from=builder /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/index.html || exit 1

# Use PORT environment variable (Cloud Run default: 8080)
EXPOSE 8080

# Start server with SPA fallback
CMD ["http-server", "dist", "-p", "8080", "-c-1", "--gzip", "-f", "index.html"]
DOCKERFILE_EOF
echo "✓ Dockerfile created"
echo ""

# Authenticate with GCP
echo "Authenticating with GCP..."
gcloud auth configure-docker
gcloud config set project $PROJECT_ID
echo "✓ GCP authentication configured"
echo ""

# Build and push Docker image
echo "Building and pushing Docker image..."
IMAGE_URL="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"
docker build --tag $IMAGE_URL .
docker push $IMAGE_URL
echo "✓ Image pushed: $IMAGE_URL"
echo ""

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_URL \
  --region $REGION \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600 \
  --allow-unauthenticated \
  --set-env-vars "VITE_API_BASE_URL=$API_URL" \
  --no-traffic \
  --quiet \
  2>&1 | tee deployment.log

SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo "=========================================="
echo "✓ Deployment successful!"
echo "=========================================="
echo "Service URL: $SERVICE_URL"
echo "API URL: $API_URL"
echo ""
echo "Next steps:"
echo "1. Test the service: curl $SERVICE_URL"
echo "2. Verify routing: curl $SERVICE_URL/how-it-works"
echo "3. Monitor logs: gcloud run logs read $SERVICE_NAME --region $REGION --tail 50"
echo ""
echo "To promote traffic to this revision:"
echo "  gcloud run services update-traffic $SERVICE_NAME --to-revisions LATEST=100 --region $REGION"
echo ""

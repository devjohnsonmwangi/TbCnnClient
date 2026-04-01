# E-Afya TB Detection - GCP Cloud Run Deployment Guide

## Quick Start (5 minutes)

```bash
# 1. Set your configuration
export GCP_PROJECT_ID="your-gcp-project"
export API_URL="https://api.yourdomain.com"  # Your backend API URL
export REGION="us-central1"

# 2. Navigate to frontend directory
cd Eafia/client

# 3. Deploy with one command
chmod +x deploy-cloud-run.sh
./deploy-cloud-run.sh
```

**That's it!** Your frontend will be live at the URL shown.

---

## Detailed Setup

### Prerequisites

1. **GCP Account & Project**
   - Have an active GCP project
   - Enable Cloud Run API: `gcloud services enable run.googleapis.com`
   - Enable Container Registry: `gcloud services enable containerregistry.googleapis.com`

2. **Local Tools**
   ```bash
   # Install Google Cloud SDK
   # https://cloud.google.com/sdk/docs/install
   
   # Install Docker
   # https://docs.docker.com/install
   
   # Verify installations
   gcloud --version
   docker --version
   ```

3. **Authentication**
   ```bash
   gcloud auth login
   gcloud config set project YOUR-PROJECT-ID
   gcloud auth configure-docker
   ```

### Step 1: Prepare Frontend Build

```bash
cd Eafia/client

# Set production environment variables
export VITE_API_BASE_URL="https://your-backend-url.com"
export VITE_ENV="production"

# Install and build
pnpm install --frozen-lockfile
pnpm build

# Verify build succeeded (check dist folder exists)
ls -la dist/index.html
```

### Step 2: Create Dockerfile

The `Dockerfile` is already included in the frontend directory with SPA fallback configured. It:
- Uses multi-stage build for minimal image size
- Includes `http-server` with SPA fallback flag `-f index.html`
- Runs health checks
- Runs as non-root user for security

### Step 3: Build and Push Image

```bash
# Set variables
export PROJECT_ID="your-gcp-project"
export SERVICE_NAME="eafia-frontend"
export IMAGE_URL="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"

# Build image
docker build -t $IMAGE_URL .

# Push to Google Container Registry
docker push $IMAGE_URL
```

Or use Cloud Build (recommended - no local Docker needed):
```bash
gcloud builds submit --tag=$IMAGE_URL
```

### Step 4: Deploy to Cloud Run

```bash
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_URL \
  --region us-central1 \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --allow-unauthenticated \
  --set-env-vars "VITE_API_BASE_URL=https://your-backend-url.com"
```

### Step 5: Test the Deployment

```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe eafia-frontend \
  --region us-central1 --format 'value(status.url)')

echo "Service URL: $SERVICE_URL"

# Test endpoints
curl $SERVICE_URL                              # Should return HTML
curl $SERVICE_URL/how-it-works                 # Should return HTML (SPA routing)
curl $SERVICE_URL/login                        # Should return HTML (SPA routing)
curl -I $SERVICE_URL/index.html                # Should return 200
```

---

## Configuration Options

### Option A: Environment Variables at Build Time

```bash
# Set before building Docker image
export VITE_API_BASE_URL="https://api.yourdomain.com"
docker build -t gcr.io/$PROJECT/eafia-frontend .
```

### Option B: Environment Variables at Runtime

Pass to Cloud Run during deployment:
```bash
gcloud run deploy eafia-frontend \
  --set-env-vars VITE_API_BASE_URL=https://api.yourdomain.com
```

**This is recommended** - allows changing API URL without rebuilding.

### Option C: Auto-Detection

Leave `VITE_API_BASE_URL` empty and the frontend automatically detects:
- Development: uses localhost:3000
- Production: tries `https://your-domain.com:3000`

---

## Solving the 404 Error

### Problem
Getting "404: NOT_FOUND" errors, especially on page refresh

### Root Causes
1. **Frontend pointing to wrong API** - Check:
   ```bash
   # Check deployed frontend is sending API requests to correct URL
   # Open browser DevTools (F12) → Network tab
   # Look at API calls - should they be going to your backend?
   ```

2. **SPA routing not configured** - Check:
   ```bash
   # Test SPA fallback
   curl https://service-url/how-it-works
   # Should return HTML (not 404)
   ```

### Solutions

**Fix 1: Set API URL**
```bash
# Redeploy with correct API URL
gcloud run deploy eafia-frontend \
  --image gcr.io/$PROJECT/eafia-frontend \
  --set-env-vars VITE_API_BASE_URL=https://your-real-backend.com
```

**Fix 2: Enable SPA Fallback**

The Dockerfile already has this configured with:
```dockerfile
CMD ["http-server", "dist", "-p", "8080", "-c-1", "--gzip", "-f", "index.html"]
```

The `-f index.html` flag enables SPA fallback.

**Fix 3: Verify Backend is Running**

If API calls return 404, verify backend:
```bash
# Test backend health
curl https://your-backend-url/health

# Check CORS if API on different domain
curl -H "Origin: https://your-frontend.com" \
     https://your-backend-url/health
```

If backend returns 404, ensure:
1. Backend is running and accessible
2. Backend API endpoints exist
3. Backend CORS allows frontend domain

---

## Advanced Configuration

### Custom Domain

```bash
# Map custom domain to Cloud Run service
gcloud beta run domain-mappings create \
  --service eafia-frontend \
  --domain your-domain.com \
  --region us-central1

# Get DNS record
gcloud beta run domain-mappings describe your-domain.com --region us-central1
# Add the CNAME record to your DNS provider
```

### HTTPS with SSL Certificate

Cloud Run automatically provides HTTPS with Google-managed certificates.

For custom domains, update your DNS records as shown above.

### Scaling Configuration

```bash
gcloud run services update eafia-frontend \
  --min-instances 1 \
  --max-instances 10 \
  --region us-central1
```

### Memory and CPU Configuration

```bash
gcloud run services update eafia-frontend \
  --memory 512Mi \ 
  --cpu 1 \
  --region us-central1
```

---

## Monitoring & Troubleshooting

### View Logs

```bash
# Real-time logs
gcloud run logs read eafia-frontend --limit 50 --follow

# Logs for specific time period
gcloud run logs read eafia-frontend --limit 50
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "404: NOT_FOUND" on page refresh | Verify SPA fallback configured (Dockerfile has `-f index.html`) |
| API calls failing | Check API URL in build or environment variables |
| Page loads but no styling | Check if dist/index.html has CSS links |
| Large response times | Increase memory: `--memory 1Gi` |
| Service keeps restarting | Check health check, increase memory |

### Health Check

```bash
# Cloud Run performs health checks automatically
# Check health check configuration
gcloud run services describe eafia-frontend --region us-central1
```

### Metrics

```bash
# View CPU and memory usage
gcloud monitoring metrics-descriptors list \
  --filter="run.googleapis.com"
```

---

## Rollback & Revisions

```bash
# List all revisions
gcloud run revisions list --service eafia-frontend

# Rollback to previous revision
gcloud run services update-traffic eafia-frontend \
  --to-revisions REVISION_NAME=100

# View traffic split
gcloud run services describe eafia-frontend
```

---

## Cost Optimization

1. **Set min-instances to 0** (scale down when idle)
   ```bash
   gcloud run services update eafia-frontend --min-instances 0
   ```

2. **Use appropriate memory** - 256Mi for frontend is often sufficient
   ```bash
   gcloud run services update eafia-frontend --memory 256Mi
   ```

3. **Monitor usage**
   ```bash
   gcloud billing accounts list
   gcloud billing accounts describe ACCOUNT_ID
   ```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]
    paths:
      - 'Eafia/client/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          export_default_credentials: true
      
      - name: Configure Docker
        run: gcloud auth configure-docker
      
      - name: Build and push
        run: |
          cd Eafia/client
          docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/eafia-frontend .
          docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/eafia-frontend
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy eafia-frontend \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/eafia-frontend \
            --region us-central1 \
            --set-env-vars VITE_API_BASE_URL=${{ secrets.API_URL }}
```

---

## Automated Deployment Script

Use the provided `deploy-cloud-run.sh`:

```bash
chmod +x deploy-cloud-run.sh
API_URL=https://api.yourdomain.com ./deploy-cloud-run.sh
```

---

## Post-Deployment Checklist

- [ ] Service URL is accessible
- [ ] Home page loads without 404
- [ ] Navigation to `/how-it-works` works
- [ ] Page refresh doesn't cause 404
- [ ] Login page loads
- [ ] API calls show in DevTools Network tab
- [ ] API calls go to correct backend URL
- [ ] CORS errors don't appear in console
- [ ] App is responsive on mobile
- [ ] Custom domain (if configured) works
- [ ] HTTPS certificate is valid
- [ ] Logs don't show errors

---

## Support & References

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Container Registry Documentation](https://cloud.google.com/container-registry)
- [Vite Production Guide](https://vitejs.dev/guide/build.html)
- [HTTP Server with SPA](https://github.com/http-party/http-server#spa)

---

**Last Updated:** April 1, 2026
**Status:** Production Ready
**Version:** 1.0

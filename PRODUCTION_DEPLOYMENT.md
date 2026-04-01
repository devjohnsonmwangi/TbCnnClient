# Production Deployment Guide - TB Detection Frontend

## Overview
This guide covers deploying the E-Afya TB Detection frontend to production, with special attention to the two critical issues that cause 404 errors:
1. **API URL Configuration** - Frontend must know where to find the backend API
2. **SPA Routing Fallback** - All routes must fall back to index.html to prevent 404s on refresh

## The 404 Problem

**Symptom:** 404 NOT_FOUND errors when accessing the app, especially on page refresh or direct navigation
**Root Causes:**
1. Frontend tries to call `http://localhost:3000` (doesn't exist in production)
2. Server returns 404 for routes like `/how-it-works` instead of serving index.html

## Solution 1: API URL Configuration

### For Local Development
1. API auto-detects to `localhost:3000` - no configuration needed

### For Production - Three Options

#### Option A: Auto-Detection (Recommended)
```bash
# Leave VITE_API_BASE_URL empty in .env
VITE_API_BASE_URL=
```
**How it works:** Frontend auto-detects when not on localhost and tries `https://domain.com:3000` or `http://domain.com:3000`

**Perfect for:** Same domain deployment (frontend and backend on same server)

#### Option B: Explicit URL
```bash
# Set in your production .env file or CI/CD secrets
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_BASE_URL=https://yourdomain.com:3000
VITE_API_BASE_URL=https://yourdomain.com/api
```

**Perfect for:** API on different domain or custom port/path

#### Option C: Environment-Specific Build
```bash
# Create separate .env files
cat > .env.production << 'EOF'
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENV=production
DEBUG_REDUX=false
EOF

# Build with production env
npm run build
```

## Solution 2: SPA Routing Fallback Configuration

When a user navigates to `/how-it-works` or refreshes the page on any route, the server must serve `index.html` instead of returning 404. Configure one of the options below:

### Option 1: Google Cloud Run (Recommended for GCP)
Create a file named `run.sh` in your frontend root:
```bash
#!/bin/bash
cd /workspace/Eafia/client

# Set environment variables if needed
export VITE_API_BASE_URL="${API_URL:-https://$(hostname):3000}"
export VITE_ENV="production"

# Build frontend
pnpm build

# Install simple HTTP server with SPA fallback
npm install -g http-server

# Serve with SPA fallback: any unknown route serves index.html
http-server dist -p ${PORT:-8080} -c-1 --gzip -f index.html
```

Make it executable:
```bash
chmod +x run.sh
```

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /webapp

# Copy files
COPY ./Eafia/client /webapp

# Install dependencies
RUN npm install -g pnpm http-server
RUN pnpm install --frozen-lockfile

# Build
ARG VITE_API_BASE_URL=
ARG VITE_ENV=production
RUN pnpm build

# Expose port
EXPOSE 8080

# Run with SPA fallback
CMD ["http-server", "dist", "-p", "8080", "-c-1", "--gzip", "-f", "index.html"]
```

Deploy to Cloud Run:
```bash
gcloud run deploy eafia-frontend \
  --source . \
  --port 8080 \
  --allow-unauthenticated \
  --set-env-vars VITE_API_BASE_URL=https://your-backend-url
```

### Option 2: Nginx Configuration
Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA fallback: all other requests serve index.html
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY ./Eafia/client .
RUN npm install -g pnpm && pnpm install --frozen-lockfile && pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and push:
```bash
docker build --build-arg VITE_API_BASE_URL=https://your-api.com -t your-registry/eafia-frontend .
docker push your-registry/eafia-frontend
```

### Option 3: Apache (.htaccess)
If hosting on Apache, create `.htaccess` in the `dist` folder:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Compression and caching
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

<FilesMatch "\.(js|css)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

<FilesMatch "\.html$">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
</FilesMatch>
```

### Option 4: Vercel (Zero-Config)
Vercel automatically handles SPA routing. Just set environment variables:
```bash
vercel env add VITE_API_BASE_URL https://your-backend-url
vercel deploy
```

### Option 5: Netlify (Zero-Config)
Create `_redirects` file in `public` folder:
```
/*    /index.html   200
```

Set environment variable in Netlify UI:
```
VITE_API_BASE_URL=https://your-backend-url
```

## Complete Deployment Checklist

### Pre-Deployment
- [ ] Determine your API URL (same domain or different?)
- [ ] Set `VITE_API_BASE_URL` in production environment
- [ ] Test locally with production settings: `VITE_API_BASE_URL=http://localhost:3000 pnpm build`
- [ ] Verify build succeeds: `pnpm build` (should show 0 errors)
- [ ] Test built app locally: `pnpm preview`

### Deployment Setup
- [ ] Choose deployment platform (GCP, AWS, Netlify, Vercel, etc.)
- [ ] Configure SPA fallback (use option above for your platform)
- [ ] Set up environment variables
- [ ] Configure CORS on backend if API is on different domain:
  ```typescript
  // In backend main.ts
  app.enableCors({
    origin: 'https://your-frontend-domain.com',
    credentials: true,
  });
  ```

### Post-Deployment
- [ ] Test home page loads
- [ ] Test navigation to `/how-it-works` (should work)
- [ ] Refresh page on `/how-it-works` (should NOT show 404)
- [ ] Test login page
- [ ] Test API calls (open DevTools → Network tab → login)
- [ ] Verify API calls go to correct URL
- [ ] Test on mobile browsers

### Monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Monitor API request failures
- [ ] Check logs for 404 errors
- [ ] Monitor build size and performance metrics

## Troubleshooting

### Issue: Still getting 404 on page refresh
**Solution:**
1. Verify SPA fallback is configured for your platform
2. Check that all routes in `App.tsx` are client-side (not API routes)
3. Ensure `index.html` is being served as fallback

### Issue: API calls failing (network errors)
**Solution:**
1. Open DevTools (F12) → Network tab
2. Check what URL is being called
3. Verify it matches your backend URL
4. Check CORS headers on backend
5. Test API directly: `curl https://your-api-url/health`

### Issue: CORS errors
**Solution:**
Add to backend CORS configuration:
```typescript
app.enableCors({
  origin: 'https://your-frontend-domain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### Issue: 404 with correct URL in error logs
**Solution:** This usually means the route doesn't exist in the backend. Check:
1. Backend API is running
2. All required endpoints exist in backend (`/auth/login`, `/patients`, etc.)
3. Backend is compiled and dist folder exists

## Environment Variable Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.yourdomain.com` |
| `VITE_ENV` | Environment name | `production`, `staging`, `development` |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `90000` |
| `DEBUG_REDUX` | Enable Redux DevTools | `false` |
| `VITE_ENABLE_TB_DETECTION` | Enable TB feature | `true` |

## Performance Optimization

Add these headers to your deployment:

```
# Cache control
/*.html → no-cache
/*.js   → 1 year (Vite adds hash)
/*.css  → 1 year (Vite adds hash)
/img/*  → 1 year

# Compression
Enable gzip/brotli
```

Vite automatically adds hashes to JS/CSS files, making aggressive caching safe.

## Quick Reference: Build & Deploy

```bash
# Build for production
VITE_API_BASE_URL=https://your-api.com pnpm build

# Test locally
pnpm preview

# Deploy to chosen platform...
# (see options above)
```

---

**Last Updated:** April 1, 2026
**Status:** Production Ready

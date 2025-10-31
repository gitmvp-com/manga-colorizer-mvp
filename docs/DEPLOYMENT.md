# 🚀 Deployment Guide

This guide covers deploying the Manga Colorizer to various platforms.

## Table of Contents

- [Vercel (Recommended)](#vercel-recommended)
- [Netlify](#netlify)
- [Docker](#docker)
- [Traditional VPS](#traditional-vps)
- [Environment Variables](#environment-variables)

---

## Vercel (Recommended)

Vercel is the easiest deployment option for Next.js applications.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitmvp-com/manga-colorizer-mvp)

### Manual Deployment

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

4. **Add Environment Variables**

```bash
vercel env add OPENROUTER_API_KEY
```

Or add them in the Vercel dashboard:
- Go to your project settings
- Navigate to "Environment Variables"
- Add `OPENROUTER_API_KEY` with your API key

5. **Deploy to Production**

```bash
vercel --prod
```

### Vercel Configuration

The project includes a `next.config.ts` that works out of the box with Vercel.

---

## Netlify

### Deploy to Netlify

1. **Connect Repository**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub account
   - Select the `manga-colorizer-mvp` repository

2. **Build Settings**

```yaml
Build command: npm run build
Publish directory: .next
```

3. **Add Environment Variables**

In Netlify dashboard:
- Go to Site settings > Environment variables
- Add:
  - Key: `OPENROUTER_API_KEY`
  - Value: Your OpenRouter API key

4. **Deploy**

Click "Deploy site"

### netlify.toml (Optional)

Create a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Docker

### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  manga-colorizer:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
    restart: unless-stopped
```

### Build and Run

```bash
# Build the image
docker build -t manga-colorizer .

# Run the container
docker run -p 3000:3000 -e OPENROUTER_API_KEY=your_key manga-colorizer

# Or use docker-compose
docker-compose up -d
```

---

## Traditional VPS

Deploy to a VPS (DigitalOcean, AWS EC2, Linode, etc.)

### Prerequisites

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+
- Nginx (for reverse proxy)
- PM2 (for process management)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### 2. Clone and Install

```bash
# Clone repository
git clone https://github.com/gitmvp-com/manga-colorizer-mvp.git
cd manga-colorizer-mvp

# Install dependencies
npm install

# Create .env.local
echo "OPENROUTER_API_KEY=your_key_here" > .env.local

# Build the application
npm run build
```

### 3. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'manga-colorizer',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G'
  }]
};
```

Start with PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx Configuration

Create `/etc/nginx/sites-available/manga-colorizer`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 10M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/manga-colorizer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key | `sk-or-v1-...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` |

### Setting Environment Variables

#### Vercel/Netlify
Use the dashboard to add environment variables.

#### Docker
```bash
docker run -e OPENROUTER_API_KEY=your_key ...
```

#### VPS
Add to `.env.local`:
```env
OPENROUTER_API_KEY=your_key_here
```

---

## Performance Optimization

### 1. Enable Caching

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};
```

### 2. Image Optimization

Next.js automatically optimizes images. No additional configuration needed.

### 3. CDN Integration

For static assets, use a CDN:
- Vercel: Built-in Edge Network
- Cloudflare: Add your domain to Cloudflare
- AWS CloudFront: Configure distribution

---

## Monitoring

### Vercel Analytics

Enable in `vercel.json`:

```json
{
  "analytics": {
    "enable": true
  }
}
```

### PM2 Monitoring

```bash
pm2 monit
pm2 logs manga-colorizer
```

### Custom Monitoring

Integrate services like:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user analytics

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Memory Issues

Increase Node.js memory:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

### Environment Variables Not Loading

- Ensure `.env.local` is in the root directory
- Restart the server after adding variables
- Check variable names (case-sensitive)
- For Vercel/Netlify, verify in dashboard

---

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use HTTPS** - Always use SSL in production
3. **Rate Limiting** - Implement API rate limiting
4. **Input Validation** - Validate all user inputs
5. **CORS** - Configure CORS appropriately
6. **Updates** - Keep dependencies updated

---

## Scaling

### Horizontal Scaling

- Use PM2 cluster mode (already configured)
- Deploy multiple instances behind load balancer
- Use serverless functions (Vercel automatically scales)

### Database (Future)

When adding database:
- Use connection pooling
- Enable read replicas
- Implement caching (Redis)

---

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/gitmvp-com/manga-colorizer-mvp/issues)
- Review [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Ask in [Discussions](https://github.com/gitmvp-com/manga-colorizer-mvp/discussions)

---

**Happy Deploying! 🚀**
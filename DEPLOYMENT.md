# sPdfHub - Netlify Deployment Guide

## 🚀 Quick Deployment to Netlify

### Option 1: Deploy via Netlify Dashboard

1. **Prepare your repository:**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Ensure all files are committed

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "New site from Git"
   - Choose your repository

3. **Build Configuration:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `20`

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Option 3: Drag and Drop Deployment

1. **Build locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy:**
   - Go to [netlify.com/drop](https://netlify.com/drop)
   - Drag the `dist` folder to the deployment area

## 📁 Project Structure for Netlify

```
sPdfHub/
├── client/                 # React frontend source
│   ├── src/
│   └── index.html
├── dist/                   # Built files (auto-generated)
├── public/                 # Static assets
│   ├── robots.txt
│   ├── sitemap.xml
│   └── ads.txt
├── netlify.toml           # Netlify configuration
├── _redirects             # URL redirects for SPA
└── vite.config.netlify.ts # Netlify-optimized Vite config
```

## ⚙️ Configuration Files

### netlify.toml
- Build settings and environment variables
- Redirect rules for SPA routing
- Security headers
- Cache optimization

### _redirects
- Fallback routing for React Router
- Ensures all routes serve index.html

## 🔧 Environment Variables (Optional)

If you need environment variables:

1. In Netlify Dashboard: Site Settings → Environment Variables
2. Add variables with `VITE_` prefix for frontend access

Example:
```
VITE_APP_VERSION=1.0.0
VITE_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxx
```

## 📈 Google AdSense Setup

1. **Update ads.txt:**
   - Edit `public/ads.txt` with your AdSense publisher ID

2. **Add AdSense code:**
   - The app already has placeholder ad spaces
   - Replace with your actual AdSense units after approval

## 🌐 Custom Domain (Optional)

1. In Netlify Dashboard: Domain Settings
2. Add your custom domain
3. Update sitemap.xml and robots.txt with your domain

## 🔍 SEO Optimization

- ✅ Meta tags configured
- ✅ Open Graph tags included  
- ✅ Sitemap.xml generated
- ✅ Robots.txt configured
- ✅ Fast loading with code splitting

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **PDF tools not working:**
   - Ensure pdf-lib is installed
   - Check browser console for errors

3. **Routing issues:**
   - Verify _redirects file is in build output
   - Check netlify.toml redirect rules

## 📊 Performance Tips

- ✅ Code splitting implemented
- ✅ Image optimization recommended
- ✅ Gzip compression enabled
- ✅ Caching headers configured

## 🔒 Security

- ✅ Security headers configured
- ✅ XSS protection enabled
- ✅ Content type validation
- ✅ Frame options set

Your sPdfHub is now ready for production deployment on Netlify! 🎉
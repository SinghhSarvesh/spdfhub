#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building sPdfHub for Netlify deployment...\n');

// Step 1: Clean previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// Step 2: Build with Vite
console.log('📦 Building with Vite...');
try {
  execSync('npx vite build --config vite.config.netlify.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 3: Copy static files
console.log('📂 Copying static files...');
const staticFiles = [
  '_redirects',
  'public/robots.txt',
  'public/sitemap.xml', 
  'public/ads.txt'
];

staticFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const filename = path.basename(file);
    fs.copyFileSync(file, path.join('dist', filename));
    console.log(`✅ Copied ${filename}`);
  }
});

// Step 4: Create additional SEO files
console.log('🔍 Creating SEO files...');

// Create a basic favicon if none exists
if (!fs.existsSync('dist/favicon.ico')) {
  // Create a placeholder favicon.ico (you should replace this with a real one)
  fs.writeFileSync('dist/favicon.ico', '');
  console.log('✅ Created placeholder favicon.ico');
}

console.log('\n✨ Build completed successfully!');
console.log('\n📋 Next steps for Netlify deployment:');
console.log('1. Push your code to GitHub/GitLab/Bitbucket');
console.log('2. Connect your repository to Netlify');
console.log('3. Set build command: npm run build:netlify');
console.log('4. Set publish directory: dist');
console.log('5. Deploy!');
console.log('\n🌐 Your app will be available at: https://your-site-name.netlify.app');
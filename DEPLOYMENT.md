# Backend Deployment Guide

## Option 1: Deploy to Railway (Recommended)

### Step 1: Prepare the Backend
1. Make sure you have the `server/package.json` file
2. The server is configured to work with Railway

### Step 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `OD-AUTOMATION` repository
5. Set the **Root Directory** to `server`
6. Click "Deploy"

### Step 3: Configure Environment Variables
In Railway dashboard:
1. Go to your project → Variables tab
2. Add these environment variables:
   ```
   NODE_ENV=production
   EMAIL_USER=odautomation01@gmail.com
   EMAIL_PASS=mvrh ylun pkxh gtnz
   ```

### Step 4: Get Your Backend URL
1. Railway will provide a URL like: `https://your-app-name.railway.app`
2. Copy this URL

### Step 5: Update Frontend Environment Variable
1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Update `REACT_APP_API_URL` with your Railway URL:
   ```
   REACT_APP_API_URL=https://your-app-name.railway.app
   ```
4. Redeploy your Vercel app

### Step 6: Test
Your app should now work with both frontend and backend deployed!

## Option 2: Deploy Backend to Vercel (Alternative)

### Step 1: Create Separate Vercel Project
1. Go to [Vercel.com](https://vercel.com)
2. Create a new project
3. Import your GitHub repository
4. Set **Root Directory** to `server`
5. Set **Framework Preset** to "Other"

### Step 2: Configure Environment Variables
In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these:
   ```
   NODE_ENV=production
   EMAIL_USER=odautomation01@gmail.com
   EMAIL_PASS=mvrh ylun pkxh gtnz
   ```

### Step 3: Deploy
1. Click "Deploy"
2. Vercel will provide a URL like: `https://your-backend-name.vercel.app`

### Step 4: Update Frontend
1. Go to your frontend Vercel project
2. Settings → Environment Variables
3. Update `REACT_APP_API_URL` with your backend Vercel URL

### ⚠️ Important Notes for Vercel Backend:
- **Data will reset** on each function call (serverless limitation)
- **No persistent sessions** (authentication resets)
- **Best for testing** - Railway is better for production

## Option 3: Deploy to Render
If Railway doesn't work, try Render:
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set Root Directory to `server`
5. Add environment variables
6. Deploy and update `REACT_APP_API_URL` 
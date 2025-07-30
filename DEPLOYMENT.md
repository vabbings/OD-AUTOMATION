# Backend Deployment Guide

## Deploy to Railway

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

## Alternative: Deploy to Render
If Railway doesn't work, try Render:
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set Root Directory to `server`
5. Add environment variables
6. Deploy and update `REACT_APP_API_URL` 
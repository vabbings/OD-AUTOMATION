# Unified Vercel Deployment Guide

## Deploy Both Frontend and Backend Together

### Step 1: Prepare Your Repository
Your repository is already configured for unified deployment with:
- `vercel.json` in root directory
- `client/` for frontend
- `server/` for backend

### Step 2: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `OD-AUTOMATION`
4. **Don't change any settings** - Vercel will auto-detect the configuration
5. Click "Deploy"

### Step 3: Configure Environment Variables
In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:
   ```
   NODE_ENV=production
   EMAIL_USER=odautomation01@gmail.com
   EMAIL_PASS=mvrh ylun pkxh gtnz
   ```

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will build both frontend and backend
3. You'll get a single URL like: `https://od-automation.vercel.app`

### Step 5: Test Your App
- Frontend: `https://od-automation.vercel.app`
- Backend API: `https://od-automation.vercel.app/api/...`

## How It Works
- **Frontend**: Served from `/` (React app)
- **Backend**: API routes from `/api/*` (Express server)
- **Same Domain**: No CORS issues, no environment variables needed

## Benefits
✅ **Single deployment** - Both frontend and backend together
✅ **Same domain** - No CORS configuration needed
✅ **Simpler setup** - No separate environment variables
✅ **Better performance** - No cross-domain requests

## ⚠️ Important Notes
- **Data resets** on serverless function calls (same as Railway)
- **Auth resets** when serverless restarts
- **Best for development/testing** - For production with persistent data, consider Railway backend + Vercel frontend

## Alternative: Separate Deployments
If you prefer separate deployments:
- **Frontend**: Vercel (client directory)
- **Backend**: Railway (server directory)
- **Environment Variable**: `REACT_APP_API_URL` pointing to Railway URL 
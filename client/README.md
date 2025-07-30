# OD Automation Frontend

This is the React frontend for the OD Automation System.

## Local Development

```bash
npm install
npm start
```

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Deployment Steps

1. **Connect Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to: `client`

2. **Build Settings:**
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables:**
   Add these in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Important Notes

- The frontend uses relative API calls (`/api/*`) which will be proxied to your backend
- Make sure your backend is deployed and accessible
- Update the `REACT_APP_API_URL` environment variable with your backend URL

### Troubleshooting

- If API calls fail, check that your backend URL is correct in environment variables
- Ensure your backend CORS settings allow requests from your Vercel domain
- Check Vercel build logs for any build errors 
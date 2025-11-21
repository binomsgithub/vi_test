# Deployment Guide for Render.com

This guide will walk you through deploying the Voice Intelligence Dashboard to Render.com.

## Prerequisites

1. **GitHub Account**: Your code must be in a GitHub repository
2. **Render.com Account**: Sign up at [render.com](https://render.com) (free tier available)
3. **Node.js**: Ensure your local Node.js version is 18+ (Render will use this)

## Step-by-Step Deployment

### 1. Push Code to GitHub

If you haven't already, initialize git and push to GitHub:

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Voice Intelligence Dashboard"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Create Render Account and Connect GitHub

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select your repository from the list

### 3. Configure the Web Service

Render will auto-detect the `render.yaml` file, but you can also configure manually:

**Service Settings:**
- **Name**: `voice-intelligence-dashboard` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (root of repo)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 4. Set Environment Variables

In the Render dashboard, go to **Environment** tab and add:

**Required:**
- `NODE_ENV` = `production` (usually set automatically)
- `SESSION_SECRET` = Generate a secure random string:
  ```bash
  openssl rand -hex 32
  ```
  Or use an online generator: https://randomkeygen.com/

**Optional (for future use):**
- You can add other environment variables as needed

### 5. Deploy

1. Click "Create Web Service"
2. Render will:
   - Clone your repository
   - Run `npm install && npm run build`
   - Run `npm start`
   - Assign a URL (e.g., `https://voice-intelligence-dashboard.onrender.com`)

### 6. Verify Deployment

1. Wait for the build to complete (usually 2-5 minutes)
2. Click on your service URL
3. You should see the login page
4. Login with:
   - Username: `poweruser`
   - Password: `m5c8!!wi}vx`

## Troubleshooting

### Build Fails

**Check build logs:**
- Go to Render dashboard → Your service → Logs
- Look for error messages

**Common issues:**
- Missing dependencies: Check `package.json` files
- TypeScript errors: Should be fixed, but check `frontend/tsconfig.json`
- Build script errors: Verify `package.json` scripts

### App Doesn't Load

**Check runtime logs:**
- Go to Render dashboard → Your service → Logs
- Look for server errors

**Common issues:**
- Port not set: Server should use `process.env.PORT`
- Static files not found: Check `backend/client-build/` exists
- API routes not working: Check CORS and session settings

### Session/Cookie Issues

**If login doesn't persist:**
- Check `SESSION_SECRET` is set correctly
- Verify cookie settings in `server.js`:
  - `secure: true` in production
  - `sameSite: "none"` for cross-origin (if needed)

## Local Production Testing

Before deploying, test locally:

```bash
# Build the app
npm run build

# Set environment variables
export NODE_ENV=production
export SESSION_SECRET=your-test-secret-here
export PORT=3000

# Start the server
npm start

# Visit http://localhost:3000
```

## Updating the Deployment

After making changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. Render will automatically detect the push and redeploy (if auto-deploy is enabled)

3. Or manually trigger deployment from Render dashboard

## Monitoring

- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor CPU, memory, and request metrics
- **Alerts**: Set up alerts for downtime or errors

## Cost

- **Free Tier**: 
  - 750 hours/month free
  - Services spin down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds

- **Paid Plans**: 
  - Always-on services
  - Better performance
  - More resources

## Security Notes

- **SESSION_SECRET**: Keep this secret! Never commit it to git
- **Credentials**: The hardcoded username/password is for demo only
- **HTTPS**: Render provides HTTPS automatically
- **Environment Variables**: All secrets should be in Render dashboard, not in code

## Next Steps

After successful deployment:

1. ✅ Test all pages and features
2. ✅ Verify API endpoints work
3. ✅ Test authentication flow
4. ✅ Check mobile responsiveness
5. ✅ Monitor logs for errors
6. ✅ Set up custom domain (optional)
7. ✅ Configure backups (if using database later)

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check application logs in Render dashboard


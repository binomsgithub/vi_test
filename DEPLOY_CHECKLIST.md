# Pre-Deployment Checklist

## ✅ Code Preparation

- [x] Build process works (`npm run build`)
- [x] Production server configuration (`server.js`)
- [x] Environment variables configured
- [x] Static file serving set up
- [x] API routes protected with authentication
- [x] CORS configured for production
- [x] Session security configured

## 📋 Before Deploying to Render

### 1. Git Repository Setup
- [ ] Code is in a GitHub repository
- [ ] All files are committed
- [ ] `.gitignore` includes `backend/client-build/`
- [ ] `render.yaml` is in the root directory
- [ ] Root `package.json` exists with build/start scripts

### 2. Environment Variables to Set in Render
- [ ] `NODE_ENV` = `production` (auto-set by render.yaml)
- [ ] `SESSION_SECRET` = (generate with `openssl rand -hex 32`)

### 3. Render.com Setup
- [ ] Create Render.com account
- [ ] Connect GitHub account
- [ ] Create new Web Service
- [ ] Select your repository
- [ ] Verify `render.yaml` is detected
- [ ] Set `SESSION_SECRET` environment variable
- [ ] Review build and start commands

### 4. Test After Deployment
- [ ] App loads at Render URL
- [ ] Login page appears
- [ ] Can login with credentials (poweruser / m5c8!!wi}vx)
- [ ] All dashboard pages load
- [ ] API endpoints work
- [ ] Filters work
- [ ] Charts render correctly
- [ ] Tables display data

## 🚀 Quick Deploy Commands

### Generate SESSION_SECRET:
```bash
openssl rand -hex 32
```

### Test Build Locally:
```bash
npm run build
NODE_ENV=production SESSION_SECRET=test-secret npm start
```

### Push to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 📝 Render.com Configuration Summary

**Service Type**: Web Service
**Build Command**: `npm install && npm run build`
**Start Command**: `npm start`
**Environment**: Node
**Auto-Deploy**: Enabled (from render.yaml)

**Environment Variables**:
- `NODE_ENV`: production
- `SESSION_SECRET`: [Your generated secret]

## ⚠️ Important Notes

1. **First Deploy**: May take 5-10 minutes
2. **Free Tier**: Service spins down after 15 min inactivity
3. **Cold Start**: First request after spin-down takes ~30 seconds
4. **Logs**: Check Render dashboard for any errors
5. **HTTPS**: Automatically provided by Render


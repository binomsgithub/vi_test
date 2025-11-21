# 🚀 Quick Start - Deploy to Render.com

## Prerequisites
- GitHub account
- Render.com account (sign up at https://render.com)

## Step 1: Initialize Git (if not done)

```bash
# Run the setup script
./setup-git.sh

# Or manually:
git init
git add .
git commit -m "Initial commit - Voice Intelligence Dashboard"
```

## Step 2: Push to GitHub

1. Create a new repository on GitHub (don't initialize with README)
2. Copy the repository URL
3. Run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Render

1. **Go to Render.com** → Sign up/Login
2. **Click "New"** → **"Web Service"**
3. **Connect GitHub** (if not already connected)
4. **Select your repository**
5. **Configure**:
   - Render will auto-detect `render.yaml`
   - Service name: `voice-intelligence-dashboard` (or your choice)
   - Plan: Free (or paid if preferred)
6. **Set Environment Variable**:
   - Go to **Environment** tab
   - Add: `SESSION_SECRET` = (generate with command below)
7. **Click "Create Web Service"**

## Generate SESSION_SECRET

```bash
openssl rand -hex 32
```

Or use: https://randomkeygen.com/

## Step 4: Wait for Deployment

- Build takes 2-5 minutes
- Watch the logs in Render dashboard
- When complete, click the service URL

## Step 5: Test

1. Visit your Render URL (e.g., `https://voice-intelligence-dashboard.onrender.com`)
2. You should see the login page
3. Login with:
   - **Username**: `poweruser`
   - **Password**: `m5c8!!wi}vx`
4. Test all pages and features

## ✅ Verification Checklist

- [ ] App loads at Render URL
- [ ] Login page appears
- [ ] Can login successfully
- [ ] All dashboard pages load
- [ ] API endpoints work (check Network tab)
- [ ] Filters work
- [ ] Charts render
- [ ] Tables show data

## 🆘 Troubleshooting

**Build fails?**
- Check Render logs
- Verify `package.json` scripts
- Ensure all dependencies are in `package.json`

**App doesn't load?**
- Check runtime logs
- Verify `SESSION_SECRET` is set
- Check server is listening on correct port

**Login doesn't work?**
- Check `SESSION_SECRET` is set correctly
- Verify cookies are enabled in browser
- Check server logs for errors

## 📚 More Help

- See `DEPLOYMENT.md` for detailed guide
- See `DEPLOY_CHECKLIST.md` for pre-deployment checklist
- Render Docs: https://render.com/docs

## 🎉 Success!

Once deployed, your app will be live at your Render URL. 

**Note**: On free tier, service spins down after 15 min inactivity. First request after spin-down takes ~30 seconds.


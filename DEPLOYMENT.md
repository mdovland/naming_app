# Deployment Guide - Domain Name Checker

This guide will help you deploy the domain checker app so your team can access it from anywhere!

## 🎯 What You Get After Deployment

- ✅ **Shared access** - Everyone on your team uses the same URL
- ✅ **Synced data** - All domain checks and favorites are shared in real-time
- ✅ **Persistent storage** - Data saved in a file on the server
- ✅ **HTTPS** - Secure access with automatic SSL
- ✅ **Free hosting** - No cost for small teams

---

## 🚀 Option 1: Railway.app (Recommended - Easiest)

Railway is the easiest deployment option with a generous free tier.

### Step 1: Prerequisites

1. **GitHub Account** - Create one at https://github.com if you don't have one
2. **Railway Account** - Sign up at https://railway.app (use "Login with GitHub")

### Step 2: Push Code to GitHub

```bash
# Navigate to your project
cd /Users/michaeldovland/Code/domain

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Domain checker app"

# Create a new repository on GitHub (https://github.com/new)
# Name it: domain-checker

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/domain-checker.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Railway

1. **Go to Railway Dashboard**: https://railway.app/dashboard

2. **Click "New Project"**

3. **Select "Deploy from GitHub repo"**

4. **Choose your `domain-checker` repository**

5. **Railway will auto-detect and deploy!**

### Step 4: Configure Environment Variables

1. In Railway dashboard, click on your project
2. Go to **"Variables"** tab
3. Add these environment variables:
   ```
   RAPIDAPI_KEY=1f25d4305fmsh00084aa35f5cc2ep12ad21jsn87610490bf72
   RAPIDAPI_HOST=domainr.p.rapidapi.com
   PORT=3001
   ```

4. Click **"Save"**

### Step 5: Add Persistent Volume (Important!)

1. In Railway dashboard, click **"Settings"**
2. Scroll to **"Volumes"**
3. Click **"Add Volume"**
4. Set:
   - **Mount Path**: `/app/data`
   - **Size**: 1GB (more than enough)
5. Click **"Add"**

This ensures your domain data persists across deployments!

### Step 6: Get Your URL

1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. You'll get a URL like: `your-app.up.railway.app`
4. **Share this URL with your team!** 🎉

### Step 7: Verify It Works

1. Visit your Railway URL
2. Add some test domains
3. Mark some as favorites
4. Open the URL in another browser/incognito
5. You should see the same domains!

---

## 🚀 Option 2: Render.com (Alternative)

Render is another excellent free hosting option.

### Step 1: Prerequisites

- GitHub account with your code pushed (see Railway Step 2)
- Render account at https://render.com

### Step 2: Create Web Service

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure**:
   - **Name**: `domain-checker`
   - **Environment**: `Node`
   - **Build Command**:
     ```
     cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build && cp -r dist ../backend/public
     ```
   - **Start Command**:
     ```
     cd backend && node dist/index.js
     ```

5. **Environment Variables** (click "Advanced"):
   ```
   RAPIDAPI_KEY=1f25d4305fmsh00084aa35f5cc2ep12ad21jsn87610490bf72
   RAPIDAPI_HOST=domainr.p.rapidapi.com
   PORT=3001
   ```

6. **Add Disk** (for persistent storage):
   - Click "Add Disk"
   - **Mount Path**: `/app/backend/data`
   - **Size**: 1GB

7. **Click "Create Web Service"**

8. **Wait 5-10 minutes** for deployment

9. **Your URL** will be something like: `domain-checker.onrender.com`

---

## 🚀 Option 3: Fly.io (For Advanced Users)

If you're comfortable with command line:

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app
flyctl launch

# Add volume for persistent storage
flyctl volumes create data --size 1

# Update fly.toml to mount volume
# Add under [mounts]:
  source = "data"
  destination = "/app/data"

# Set environment variables
flyctl secrets set RAPIDAPI_KEY=1f25d4305fmsh00084aa35f5cc2ep12ad21jsn87610490bf72
flyctl secrets set RAPIDAPI_HOST=domainr.p.rapidapi.com

# Deploy
flyctl deploy
```

---

## 🔐 Security Notes

### Environment Variables

**NEVER commit `.env` file to git!** It contains your API key.

The `.gitignore` is already configured to exclude:
- `backend/.env`
- `backend/data/*.json`

### API Key Security

Your RapidAPI key is already configured in Railway/Render environment variables. This is secure - it's never exposed to the client.

---

## 📊 Usage Limits

With the free RapidAPI tier (10,000 requests/month):
- Each domain check = 4 requests (one per TLD: .com, .ai, .se, .no)
- You can check **~2,500 unique domains per month**
- That's about **83 domains per day**

If you need more, RapidAPI has affordable paid tiers.

---

## 🔧 Updating the App

### Railway / Render (Auto-deploy)

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Railway/Render will **automatically redeploy**!
4. Wait 2-3 minutes
5. Refresh your browser

### Manual Deploy (if auto-deploy is off)

Railway: Click "Deploy" button in dashboard
Render: Click "Manual Deploy" → "Deploy latest commit"

---

## 🐛 Troubleshooting

### "Failed to load domains from server"

- Check that Railway/Render service is running (green status)
- Check environment variables are set correctly
- Check deployment logs for errors

### Domains not persisting after restart

- Verify volume/disk is mounted correctly
- Check mount path matches: `/app/data` (Railway) or `/app/backend/data` (Render)

### API errors (403/429)

- Verify `RAPIDAPI_KEY` environment variable is set
- Check you're subscribed to Domainr API on RapidAPI
- Check rate limits - wait a few minutes if you hit 429

### "Module not found" errors

- Clear build cache and redeploy
- Check `package.json` has all dependencies

---

## 💡 Tips

### Team Collaboration

- Share the Railway/Render URL with your team via email/Slack
- Bookmark it for easy access
- Everyone will see the same domains and favorites in real-time!

### Backups

Your domain data is stored in `/app/data/domains.json`. To backup:

1. Go to Railway dashboard → Click on service
2. Use Railway CLI to download:
   ```bash
   railway run cat /app/data/domains.json > backup.json
   ```

Or just export to CSV from the UI regularly!

### Custom Domain (Optional)

Both Railway and Render support custom domains:
- Railway: Settings → Networking → Custom Domain
- Render: Settings → Custom Domain

Example: `domains.yourcompany.com`

---

## 📝 Summary

✅ **Deployed** - Your app is live on the internet
✅ **Shared** - Team can access from anywhere
✅ **Persistent** - Data saved across restarts
✅ **Free** - No hosting costs for small teams
✅ **Auto-updates** - Push to GitHub = auto-deploy

**Your team can now:**
- Add domain suggestions together
- See all checked domains in real-time
- Collaborate on shortlists
- Export shared results

🎉 **You're all set!** Share your deployment URL with your team and start finding that perfect domain name!

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- RapidAPI Docs: https://docs.rapidapi.com

Good luck finding the perfect name for your Nordic AI company! 🇳🇴🇸🇪🇩🇰🇫🇮

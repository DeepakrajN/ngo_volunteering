# Vercel Deployment Guide

## Prerequisites
- GitHub account (already done ✅)
- Vercel account (https://vercel.com/)
- MongoDB Atlas account or MongoDB connection string (https://www.mongodb.com/cloud/atlas)

## Step 1: Prepare for Deployment

### MongoDB Setup
1. If you don't have MongoDB, sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your MongoDB connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

## Step 2: Deploy to Vercel

### Option A: From Vercel Dashboard (Easiest)
1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New..." → "Project"
3. Select your `ngo_volunteering` repository
4. Click "Import"
5. **PROJECT SETTINGS:**
   - Framework: **Select "Other"** (since we have a custom Express setup)
   - Root Directory: **./ngo volunteer/** (if needed)
   - Build Command: **npm run build**
   - Output Directory: **client/build**
   - Install Command: **npm install && npm install --prefix client**
6. **ENVIRONMENT VARIABLES:**
   - Add the following variables in "Environment Variables":
     ```
     MONGODB_URI = your-mongodb-connection-string
     NODE_ENV = production
     PORT = (leave empty - Vercel sets this automatically)
     ```
7. Click "Deploy"

### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from your project directory
cd "d:\ngo volunteer\ngo volunteer"
vercel

# Follow the prompts and add environment variables when asked
```

## Step 3: Configure Environment Variables in Vercel

After deployment, you need to set up environment variables:

1. Go to your project on Vercel dashboard
2. Click "Settings"
3. Go to "Environment Variables"
4. Add these variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`

## Step 4: Test Your Deployment

- Visit your Vercel URL (e.g., `https://ngo-volunteering.vercel.app`)
- Test the homepage and registration flow
- Test API endpoints by visiting `/api/*` routes

## Troubleshooting

### "Cannot find module" errors
- Make sure all dependencies are installed: `npm install && npm install --prefix client`
- Check that the installation command in Vercel settings includes both root and client installations

### MongoDB Connection Fails
- Verify your `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist allows Vercel's IPs (should be set to 0.0.0.0/0 or add Vercel IP ranges)
- Make sure the database user has correct permissions

### Build Fails
- Check the build logs in Vercel dashboard
- Verify `client/build` exists after `npm run build`
- Try building locally first: `npm run build`

### CORS Issues
- The CORS is already configured to accept all origins
- If issues persist, update `.env` variables in Vercel dashboard

## Important Notes

1. **First Build**: Your first deployment might take 2-5 minutes as dependencies are installed
2. **Database**: Make sure your MongoDB connection string works before deploying
3. **Node Version**: Vercel uses Node 18+ by default, which is compatible with your project
4. **Environment Variables**: Be sure to set them BEFORE deployment or redeploy after adding them

## Additional Configuration (if needed)

If you encounter issues, you can modify:
- `vercel.json` - Deployment configuration
- `server.js` - API configuration
- Build settings in Vercel dashboard

## Monitoring Your Deployment

After deployment:
1. Go to your project in Vercel dashboard
2. Check "Deployments" tab for build/deployment status
3. Check "Logs" for runtime errors
4. Monitor CPU and memory usage

## Redeploy After Changes

Your app will automatically redeploy when you push to GitHub. To manually trigger:
- Push changes to main branch
- OR click "Redeploy" in Vercel dashboard

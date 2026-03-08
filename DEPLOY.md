# Deploy to GitHub Pages

## Quick Deploy

Run these commands:

```bash
# 1. Build the project
npm run build

# 2. Deploy to gh-pages branch
npx gh-pages -d dist
```

## GitHub Settings

After deploying:

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select: **Deploy from a branch**
4. **Branch:** Select `gh-pages`
5. **Folder:** Select `/ (root)`
6. Click **Save**

## Your Site URL

After 1-2 minutes, visit:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## Update Deployment

Whenever you make changes:

```bash
# Build and deploy
npm run build
npx gh-pages -d dist
```

## Troubleshooting

**Blank screen:**
- Wait 2 minutes after deployment
- Clear browser cache (Ctrl+Shift+R)
- Check browser console (F12) for errors

**404 error:**
- Verify you selected the correct branch (gh-pages)
- Verify you selected the correct folder (/ (root))
- Wait a few more minutes for GitHub to process

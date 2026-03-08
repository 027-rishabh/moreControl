# moreControl - Deployment Instructions

## Deploy to GitHub Pages

### Step 1: Run the deploy script

```bash
cd /home/rishabhsingh/rProjects/reactProjects/moreControl
./deploy.sh
```

Or manually:

```bash
npm run build
npx gh-pages -d dist
```

### Step 2: Configure GitHub Pages

1. Go to: **https://github.com/027-rishabh/moreControl/settings/pages**

2. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   
3. Under **Branch**:
   - **Branch:** gh-pages
   - **Folder:** / (root)

4. Click **Save**

### Step 3: Wait for deployment

- Wait 1-2 minutes
- Your site will be live at: **https://027-rishabh.github.io/moreControl/**

---

## Update Deployment

Whenever you make changes:

```bash
./deploy.sh
```

Or:

```bash
npm run build
npx gh-pages -d dist
```

---

## Troubleshooting

### Blank screen
- Wait 2 minutes
- Hard refresh: Ctrl+Shift+R
- Check browser console (F12)

### 404 Error
- Verify branch is set to `gh-pages`
- Verify folder is set to `/ (root)`
- Wait a few more minutes

---

## Your Site

**URL:** https://027-rishabh.github.io/moreControl/

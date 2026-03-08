#!/bin/bash

echo "======================================"
echo "  moreControl - GitHub Pages Deploy"
echo "======================================"
echo ""

# Build
echo "Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo ""
echo "Build complete!"
echo ""

# Deploy
echo "Deploying to gh-pages branch..."
npx gh-pages -d dist

if [ $? -ne 0 ]; then
    echo "Deployment failed!"
    exit 1
fi

echo ""
echo "======================================"
echo "  Deployment Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Go to: https://github.com/027-rishabh/moreControl/settings/pages"
echo "2. Source: Deploy from a branch"
echo "3. Branch: gh-pages"
echo "4. Folder: / (root)"
echo "5. Click Save"
echo ""
echo "Wait 1-2 minutes, then visit:"
echo "https://027-rishabh.github.io/moreControl/"
echo ""

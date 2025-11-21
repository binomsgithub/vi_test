#!/bin/bash

# Script to initialize git repository and prepare for deployment

echo "🚀 Setting up Git repository for deployment..."

# Check if git is initialized
if [ -d ".git" ]; then
    echo "✅ Git repository already initialized"
else
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
fi

# Check if .gitignore exists and is correct
if grep -q "backend/client-build" .gitignore 2>/dev/null; then
    echo "✅ .gitignore includes client-build"
else
    echo "⚠️  Warning: .gitignore may not include client-build"
fi

echo ""
echo "📝 Next steps:"
echo "1. Review and stage your files:"
echo "   git add ."
echo ""
echo "2. Make your first commit:"
echo "   git commit -m 'Initial commit - Voice Intelligence Dashboard ready for deployment'"
echo ""
echo "3. Create a new repository on GitHub, then:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "4. Go to Render.com and:"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set SESSION_SECRET environment variable"
echo "   - Deploy!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"


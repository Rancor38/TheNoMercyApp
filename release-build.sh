#!/bin/bash

# No Mercy Tracker - GitHub Release Updater
# This script builds the app and prepares files for the releases repository

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 No Mercy Tracker Release Builder${NC}"
echo "=========================================="

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}📦 Building version: $VERSION${NC}"

# Build the app
echo -e "${YELLOW}⚙️ Building application...${NC}"
npm run install-app

# Check if build was successful
BUILD_DIR="../TheNoMercyApp-Built"
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build failed - output directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo -e "${YELLOW}📁 Built files location: $BUILD_DIR${NC}"

# List what was built
echo -e "${YELLOW}📋 Generated files:${NC}"
ls -la "$BUILD_DIR"

echo -e "${GREEN}🎉 Release build complete!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "   1. Copy files from $BUILD_DIR to your releases repository"
echo "   2. Update version tags and release notes"
echo "   3. Push to GitHub releases"

echo -e "${BLUE}💡 Tip: You can now distribute these files to users!${NC}"

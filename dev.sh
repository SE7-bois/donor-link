#!/bin/bash

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Donor Link Development Environment${NC}"
echo -e "${BLUE}📦 Convex Backend${NC} and ${GREEN}⚡ Next.js Frontend${NC}"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local file not found${NC}"
    echo "Make sure to set up your environment variables!"
    echo ""
fi

# Start both services in parallel using concurrently
pnpm run dev:full 
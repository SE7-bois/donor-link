@echo off
echo 🚀 Starting Donor Link Development Environment
echo 📦 Convex Backend and ⚡ Next.js Frontend
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠️  Warning: .env.local file not found
    echo Make sure to set up your environment variables!
    echo.
)

REM Start both services in parallel
pnpm run dev:full 
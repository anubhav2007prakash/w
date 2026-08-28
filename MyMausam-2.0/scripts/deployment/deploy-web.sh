#!/usr/bin/env bash
set -e
echo "Building and optimizing Next.js web application..."
cd apps/web
npm run build
echo "Next.js build complete."

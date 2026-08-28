#!/usr/bin/env bash
set -e

echo "Setting up MyMausam 2.0 Environment..."
cd apps/web && npm install
cd ../../backend/python && pip install -r requirements.txt
cd ../..
echo "MyMausam 2.0 environment setup complete!"

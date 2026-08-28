#!/usr/bin/env bash
set -e
echo "Installing root & workspace dependencies..."
npm install
cd apps/web && npm install
cd ../../backend/python && pip install -r requirements.txt
echo "Dependencies installed successfully."

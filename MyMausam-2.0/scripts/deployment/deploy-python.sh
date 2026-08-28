#!/usr/bin/env bash
set -e
echo "Building Python backend container..."
docker build -t mymausam-backend:latest ./backend/python
echo "Python backend container built."

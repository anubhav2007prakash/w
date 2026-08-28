#!/usr/bin/env bash
set -e
echo "Deploying Firebase rules and Cloud Functions..."
firebase deploy --only firestore,storage,functions
echo "Firebase deployment complete."

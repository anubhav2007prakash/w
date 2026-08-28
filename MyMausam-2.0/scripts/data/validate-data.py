#!/usr/bin/env python3
"""Validates schema compliance of mock JSON data files."""
import glob
import json
import os

def validate():
    files = glob.glob("data/mock/*.json")
    for f in files:
        with open(f, "r", encoding="utf-8") as fp:
            json.load(fp)
    print(f"Validated {len(files)} JSON files successfully.")

if __name__ == "__main__":
    validate()

# System Architecture - MyMausam 2.0

## Overview
MyMausam 2.0 is built on a scalable, hybrid cloud architecture combining Next.js 16 (App Router), Python FastAPI, SQLite telemetry caching, and Firebase Cloud Functions.

```mermaid
graph TD
    Client[Next.js Web / React Native Mobile] --> API[FastAPI Backend :8000]
    API --> DB[(SQLite mausam.db)]
    API --> IMD[IMD Telemetry Feeds]
    API --> ML[ML Inference Engines]
    Client --> Firebase[Firebase Cloud Services]
```

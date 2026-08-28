# 🌤️ MyMausam 2.0

> **Next-Generation Hyper-Local Weather Intelligence & Multilingual Telemetry Platform**  
> Developed by **AeroCoders**

---

## 🚀 Overview

**MyMausam 2.0** provides real-time, hyper-local meteorological forecasts, India Meteorological Department (IMD) telemetry, radar reflectivity, cyclone trackers, lightning detection (DAMINI), agromet farmer advisories, aviation METAR/TAF reports, and multilingual voice assistance.

---

## 🏗️ Architecture

```
MyMausam-2.0/
├── apps/
│   └── web/                   # Next.js 15+ App Router frontend (Tailwind v4, Leaflet, Glassmorphic UI)
├── backend/
│   ├── python/                # FastAPI backend & telemetry endpoints (SQLite/mausam.db)
│   │   ├── app/
│   │   │   ├── api/           # API routes (weather, alerts, radar, lightning, aviation, agromet)
│   │   │   ├── services/      # Meteorological computation & weather data generators
│   │   │   ├── database.py    # SQLite connection & query handlers
│   │   │   ├── main.py        # FastAPI entrypoint with CORS
│   │   │   └── mausam.db      # Pre-seeded SQLite database
│   │   └── requirements.txt
│   └── firebase/              # Firebase Cloud Functions & security rules
└── data/
    └── mausam.db              # Database backup
```

---

## ⚡ Quick Start

### 1. Web Application (Frontend)
```bash
cd apps/web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Python API Backend
```bash
cd backend/python
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Interactive API docs available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

## ✨ Features

- **Hyper-Local Current Weather & Hourly Forecasts**: Real-time temperature, humidity, wind compass, AQI metrics, and hourly breakdowns.
- **IMD Warnings & Flash Alerts**: Color-coded yellow/orange/red alerts.
- **Radar & Doppler Reflectivity**: Interactive storm cell telemetry and precipitation tracking.
- **Severe Weather Trackers**: Live Cyclone tracking (Bay of Bengal / Arabian Sea) and Lightning Nowcast.
- **Agromet Farmer Advisories**: District crop recommendations and weather precautions.
- **Aviation Meteorology**: METAR / TAF reports and flight category indices.
- **Route Nowcast**: Weather predictions along highway waypoints (e.g. Delhi to Jaipur).
- **MausamMitra Assistant**: Multilingual voice synthesis and persona-tailored weather insights.

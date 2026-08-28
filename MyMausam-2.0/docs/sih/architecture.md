# MyMausam 2.0 — SIH System Architecture

## Monorepo Structure
```
MyMausam-2.0/
├── apps/web/         ← Next.js 16 frontend
├── apps/mobile/      ← React Native / Expo mobile app
├── backend/python/   ← FastAPI backend API
├── backend/firebase/ ← Cloud Functions + Firestore rules
├── packages/         ← Shared TypeScript types, constants, validation
├── data/             ← Mock data and JSON schemas
├── ml-models/        ← Trained model binaries and metadata cards
├── scripts/          ← Setup, deployment, ML training scripts
└── docs/             ← Technical and SIH documentation
```

## Technology Stack Summary
| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| Mobile | React Native (Expo) |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Database | SQLite (local cache), Firebase Firestore (real-time) |
| ML | XGBoost, RandomForest, LSTM (TensorFlow) |
| AI | Gemini API / OpenAI + LangChain prompt engineering |
| DevOps | Docker, GitHub Actions CI/CD |
| Maps | Leaflet.js + MapMyIndia API |

# SIH Implementation Plan — MyMausam 2.0

## Sprint 1 (Days 1–8): Foundation
- [x] Set up monorepo with Turborepo + pnpm workspaces.
- [x] Scaffold Next.js 16 frontend with 18 feature routes.
- [x] Build FastAPI backend with SQLite cache.
- [x] Pre-seed `mausam.db` with locations, alerts, and crowd reports.

## Sprint 2 (Days 9–16): Features
- [x] Integrate IMD radar telemetry and alert feed parsers.
- [x] Build Doppler Radar map with Leaflet.js.
- [x] Implement 8-persona personalization engine.
- [x] Build WeatherGPT chat with LLM prompt injection.

## Sprint 3 (Days 17–24): ML & Polish
- [x] Train XGBoost solar irradiance model.
- [x] Train RandomForest energy demand forecast model.
- [x] Build Solar Estimator UI with real-time ML inference.
- [x] Glassmorphism UI polish and mobile responsiveness.

## Sprint 4 (Days 25–30): Testing & Demo
- [x] Unit and integration tests (≥80% coverage).
- [x] Docker Compose configuration for one-command deployment.
- [x] SIH presentation slides and live demo preparation.

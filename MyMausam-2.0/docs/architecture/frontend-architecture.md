# Frontend Architecture

Built on Next.js 16 with Tailwind CSS v4 and React Context for hyper-local meteorological telemetry display.

## Key Modules
- `apps/web/src/app`: 18 feature routes including Doppler Radar, Lightning, Agromet, Aviation, Marine, Cyclone, and Solar Estimator.
- `apps/web/src/components`: 15 modular UI components with glassmorphism aesthetics.
- `apps/web/src/context`: `WeatherContext` state provider managing active locations, telemetry feeds, and persona switching.

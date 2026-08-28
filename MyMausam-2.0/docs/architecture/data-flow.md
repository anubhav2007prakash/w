# Data Flow Pipeline

1. **Ingestion**: Meteorological observations and radar telemetry arrive from IMD radar stations and SQLite cache.
2. **Processing**: Normalization, anomaly detection, and ML irradiance synthesis.
3. **Serving**: FastAPI exposes cached JSON telemetry over HTTP/WebSocket.
4. **Rendering**: Next.js App Router renders glassmorphic widgets and interactive maps.

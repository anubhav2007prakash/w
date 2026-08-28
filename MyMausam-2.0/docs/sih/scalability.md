# Scalability — MyMausam 2.0

## Architecture Scalability

### Frontend
- Next.js static export (21 pre-rendered pages) served from CDN — scales to millions of users with zero compute.
- Incremental Static Regeneration (ISR) refreshes weather pages every 5 minutes without rebuilding.

### Backend API
- FastAPI (ASGI) supports async request handling — single instance handles 2,000+ concurrent connections.
- Horizontal scaling via Docker Swarm or Kubernetes; each pod is fully stateless.
- SQLite cache can be replaced with Redis for distributed multi-pod caching.

### Database
- Firebase Firestore scales automatically to 1M+ concurrent connections.
- Read throughput: 1M reads/day on Spark (free) tier; unlimited on Blaze.

### ML Inference
- XGBoost and RandomForest models are lightweight (< 5MB) — inline inference < 10ms.
- LSTM models served via TensorFlow Serving with GPU acceleration for high-volume deployments.

## Geographic Scalability
- IMD data feeds cover all 36 states/UTs — no region-specific code required.
- Multi-language support planned for 22 Indian scheduled languages.

# Backend Architecture

Python 3.11+ FastAPI application structured with layered domain boundaries:
- `app/api`: REST router controllers.
- `app/services`: Business logic & meteorological data synthesis.
- `app/ml`: Predictive models (Solar, Energy load, Weather anomaly).
- `app/database.py`: Thread-safe SQLite connection manager with dictionary row factories.

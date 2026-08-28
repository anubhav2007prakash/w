# MyMausam 2.0 REST API Reference

Base URL: `http://127.0.0.1:8000/api`

Interactive Swagger UI documentation is available at `/docs`.

## Endpoints Summary
- `GET /weather/current`: Current weather & AQI
- `GET /weather/hourly`: 24-hour breakdown
- `GET /weather/forecast`: 7-day synoptic forecast
- `GET /weather/alerts`: Active IMD emergency warnings
- `GET /locations`: All supported cities
- `GET /radar`: Doppler weather radar telemetry
- `GET /rain-alert/timeline`: 2-hour rain nowcast
- `GET /cyclone`: Bay of Bengal & Arabian Sea cyclone tracker
- `GET /lightning`: Real-time lightning strikes
- `GET /aviation`: METAR/TAF aerodrome weather
- `GET /agromet`: Farmer crop advisories
- `GET /route-nowcast`: Route highway weather
- `POST /chatbot/query`: WeatherGPT natural language Q&A
- `GET /solar/estimate`: Rooftop solar PV yield estimation
- `GET /energy/optimization`: Grid demand and consumption optimization

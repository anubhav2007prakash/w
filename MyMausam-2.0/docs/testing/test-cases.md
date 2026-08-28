# Test Cases — MyMausam 2.0

## API Test Cases

### TC-001: Weather Current Endpoint
- **Input**: `GET /api/weather/current?location=Ghaziabad`
- **Expected**: `200 OK`, JSON with `temperature`, `condition`, `humidity`, `aqi`.
- **Validation**: `temperature` is a float between -10 and 55°C.

### TC-002: Alerts Endpoint
- **Input**: `GET /api/weather/alerts`
- **Expected**: `200 OK`, array of alert objects, each containing `severity` in `["green","yellow","orange","red"]`.

### TC-003: Solar Estimate
- **Input**: `GET /api/solar/estimate?area_sqft=500&location=Delhi`
- **Expected**: `200 OK`, `daily_generation_kwh > 0`.

### TC-004: Chatbot Query
- **Input**: `POST /api/chatbot/query` with `{"query": "Will it rain tomorrow?", "persona": "citizen"}`
- **Expected**: `200 OK`, `response` is a non-empty string.

### TC-005: Energy Optimization
- **Input**: `GET /api/energy/optimization`
- **Expected**: `200 OK`, `renewable_percentage` between 0 and 100.

## Frontend Test Cases

### TC-101: Home Page Renders
- Open `http://localhost:3000`, page should display temperature, condition, and AQI without console errors.

### TC-102: Radar Map Loads
- Navigate to `/radar`, Leaflet map should initialize with India centered view.

### TC-103: Persona Switcher
- Click through all 8 persona buttons, each should update the displayed recommendations.

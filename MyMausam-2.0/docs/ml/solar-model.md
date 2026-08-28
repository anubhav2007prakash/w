# Solar Irradiance Prediction Model

XGBoost Regressor trained on historical solar resource atlas data for all 29 Indian states.
Predicts Global Horizontal Irradiance (GHI) and Direct Normal Irradiance (DNI) with NRMSE of 5.4%.

## Input Features
- Solar zenith angle
- Cloud cover percentage
- Ambient humidity
- Dew point depression

## Output
- `ghi_w_m2`: Global Horizontal Irradiance in W/m²
- `estimated_kwh_per_day`: Daily yield per kWp of installed capacity

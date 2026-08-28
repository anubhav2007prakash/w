# Feature Engineering

Transforms raw timestamps into continuous cyclical features:
- `sin_hour = sin(2 * pi * hour / 24)`
- `cos_hour = cos(2 * pi * hour / 24)`
Derived features include dew point depression, vapor pressure deficit, and zenith angle calculations.

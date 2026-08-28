# Security Policy — SIH MyMausam 2.0

## Data Privacy
- No personally identifiable information (PII) is collected for weather queries.
- Crowdsource reporter names are optional and stored with user consent.
- All Firebase Authentication tokens expire in 1 hour and are refreshed silently.

## API Security
- All write operations on Firestore are protected by Firebase Authentication.
- Rate limiting: 120 requests/minute per IP on the FastAPI backend.
- Emergency alert broadcast endpoints require `admin` Firebase custom claim.

## Data Integrity
- IMD alert data is fetched from official government feeds and never altered.
- Crowdsource reports are cross-validated against radar telemetry before being surfaced to other users.

## Encryption
- All data in transit uses TLS 1.3.
- Firestore and Cloud Storage data at rest is encrypted by Google Cloud AES-256.

## Responsible Disclosure
Security vulnerabilities can be reported to the team via the repository's `SECURITY.md` file.

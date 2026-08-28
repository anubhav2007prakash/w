# Security Testing — MyMausam 2.0

## Threat Model
- **OWASP Top 10** applied to all FastAPI endpoints.
- **SQL Injection**: All SQLite queries use parameterised bindings — no string interpolation.
- **XSS**: Next.js JSX escaping + Firestore field sanitisation.
- **CSRF**: SameSite=Strict cookies on session endpoints.
- **Broken Access Control**: Public weather routes are read-only; admin routes gated by Firebase ID token verification.
- **Rate Limiting**: FastAPI middleware limits IP to 120 requests/minute on all endpoints.

## Automated Scanning
| Tool | Scope | CI Gate |
|---|---|---|
| Bandit | Python source | Zero HIGH/CRITICAL |
| npm audit | Node.js dependencies | Zero Critical CVEs |
| Trivy | Docker image layers | Zero Critical CVEs |
| OWASP ZAP | Live API scan | Zero High findings |

## Sensitive Data Handling
- No weather telemetry is PII; no user data is stored on-device.
- Firebase ID tokens are never stored in localStorage — kept in memory only.
- `.env` files are git-ignored; secrets managed through environment variables.

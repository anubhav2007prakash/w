# Testing Strategy — MyMausam 2.0

## Layers
| Layer | Tool | Coverage Target |
|---|---|---|
| Unit Tests (Python) | pytest | ≥ 80% |
| Unit Tests (TypeScript) | Jest + Testing Library | ≥ 75% |
| Integration Tests | pytest + httpx | All API endpoints |
| End-to-End (Web) | Playwright | Critical user flows |
| Mobile Tests | Expo Detox | Home, Alerts, Chat |
| Performance | k6 | p99 < 200ms |
| Accessibility | axe-core | WCAG 2.1 AA |
| Security | Bandit (Python) + npm audit | Zero Critical CVEs |

## CI/CD Pipeline
All layers run on every pull request via GitHub Actions.

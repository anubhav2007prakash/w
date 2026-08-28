# Performance Testing — MyMausam 2.0

## SLO Targets
| Metric | Target |
|---|---|
| Time to First Byte (TTFB) | < 200ms |
| Largest Contentful Paint (LCP) | < 2.5s |
| API p99 Latency | < 300ms |
| Concurrent Users (load test) | 500 simultaneous |

## Tools
- **k6**: HTTP load testing scripts in `scripts/k6/`.
- **Lighthouse CI**: Automated Lighthouse audits on each PR.
- **Next.js Bundle Analyzer**: `ANALYZE=true npm run build` to inspect JS bundle sizes.

## Baseline Benchmarks (Local Dev)
- Home page LCP: ~1.2s
- `/api/weather/current` avg latency: ~35ms (SQLite cache hit)
- Radar tile overlay load: ~800ms (network-dependent)

## Optimization Strategies
- Weather data cached in SQLite with 5-minute TTL.
- Static pages generated at build time for 21 routes.
- Tailwind CSS v4 tree-shaken — final CSS < 15KB.
- Radar tiles served from CDN with aggressive cache-control headers.

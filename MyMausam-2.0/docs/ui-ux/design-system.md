# Design System — MyMausam 2.0

## Brand Identity
MyMausam 2.0 uses a deep oceanic blue palette inspired by India's meteorological radar displays and weather satellite imagery.

## Color Palette
| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#0055A6` | Navigation, buttons, brand |
| `--color-surface` | `#004586` | Page and card backgrounds |
| `--color-surface-glass` | `rgba(255,255,255,0.08)` | Glassmorphic card overlays |
| `--color-accent-yellow` | `#FFBE00` | Yellow alerts, temperature highlights |
| `--color-accent-orange` | `#FF7400` | Orange alerts, wind warnings |
| `--color-accent-red` | `#E63B2E` | Red alerts, danger indicators |
| `--color-accent-green` | `#8ED329` | Positive indicators, safe conditions |
| `--color-accent-teal` | `#00DDE5` | WeatherGPT chat, info highlights |
| `--color-text-primary` | `#FFFFFF` | Primary text on dark backgrounds |
| `--color-text-muted` | `#A7C0D6` | Secondary text, labels |

## Typography
| Scale | Font | Weight | Size |
|---|---|---|---|
| Display | Inter | 800 | 3.5rem |
| Heading 1 | Inter | 700 | 2rem |
| Heading 2 | Inter | 600 | 1.5rem |
| Body | Inter | 400 | 1rem |
| Caption | Inter | 400 | 0.75rem |

## Glassmorphism Card Spec
```css
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.15);
backdrop-filter: blur(16px);
border-radius: 1rem;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

## Severity Badge System
| Level | Background | Border | Text |
|---|---|---|---|
| Green | `rgba(142,211,41,0.15)` | `#8ED329` | `#8ED329` |
| Yellow | `rgba(255,190,0,0.15)` | `#FFBE00` | `#FFBE00` |
| Orange | `rgba(255,116,0,0.15)` | `#FF7400` | `#FF7400` |
| Red | `rgba(230,59,46,0.15)` | `#E63B2E` | `#E63B2E` |

## Spacing Scale
Uses a `0.25rem` (4px) base grid: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64px`.

## Motion
- Transition duration: 200ms ease for hover states.
- Card entrance: `translateY(8px) → 0, opacity 0 → 1` over 300ms.
- Alert pulse: CSS keyframe `pulse` at 2s interval for active red alerts.

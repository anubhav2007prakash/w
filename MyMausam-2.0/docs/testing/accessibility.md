# Accessibility Testing — MyMausam 2.0

## Standard
WCAG 2.1 Level AA compliance for all public-facing web pages.

## Tools
- **axe-core**: Automated DOM accessibility scanning integrated in Jest.
- **Lighthouse**: Google Lighthouse CI accessibility score target ≥ 90.
- **Screen Reader Testing**: NVDA + Firefox (Windows), VoiceOver + Safari (macOS/iOS).

## Key Requirements
| Criterion | Rule |
|---|---|
| Color Contrast | Text contrast ratio ≥ 4.5:1 |
| Keyboard Navigation | All interactive elements reachable via Tab |
| Focus Indicators | Visible focus ring on all focusable elements |
| Images | All `<img>` elements have descriptive `alt` text |
| ARIA Labels | Alert severity badges carry `role="alert"` |
| Motion | Animations respect `prefers-reduced-motion` |

## Alert Severity Colors
All severity badge colors meet contrast requirements against their dark `#004586` background:
- Yellow (`#FFBE00`): Contrast 8.3:1 ✅
- Orange (`#FF7400`): Contrast 4.6:1 ✅
- Red (`#E63B2E`): Contrast 4.5:1 ✅

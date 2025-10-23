# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Commands (Non-Obvious)
- Dev workflow: `npm run dev` (runs CSS/JS watchers + live-reloading Express server on port 3000)
- Serve only: `npm run serve` (Nodemon-driven Express server at http://localhost:3000)
- Build process: `npm run build` (runs CSS + JS optimization); replaces ~3MB CDN with ~126KB bundled assets
- No lint/test automation; manual Lighthouse audits for perf/accessibility/SEO (run in Chrome DevTools)
- Preview variants: cd landingPage/[variant] && python -m http.server 8000 (avoids CORS for local assets/CDNs)

## Code Style (From Files)
- CSS: Custom :root vars (--color-poppy: #E65C4F, --space-xs: 0.25rem etc.); 4px base spacing rhythm; kebab-case classes (.network-node, .btn-primary)
- HTML: Semantic markup w/ ARIA (aria-expanded on toggles); single-page via #anchors for smooth scroll
- JS: Vanilla (no modules/imports); camelCase funcs (initNavigation); strict mode; try-catch in DOMContentLoaded
- Naming: Descriptive (NetworkTransformation class); error handling via graceful degradation (e.g., img error hides)

## Patterns (Discovered)
- Theme: Tailwind CSS bundled for production (replaces CDN); custom config with brand colors; main pages use custom CSS vars
- Animations: GSAP bundled for production (NetworkTransformation class throttles SVG line updates @50ms for perf)
- Responsive: Mobile-first w/ media queries; Tailwind bundled for production (custom CSS vars for main pages)
- Gotchas: FOIT w/ Google Fonts (Crimson Text/Inter) - preload if needed; z-index mgmt for fixed nav (z-50); bundled deps reduce load times
- business context in ./business_blueprint
- ./landingPage the latest working copy of the landing page website

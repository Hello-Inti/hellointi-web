# TODO — Review for landingPage/final/index.html

1. Add or verify HTML language declaration: ensure <html lang="en"> is present.
2. Verify viewport meta tag for responsive design.
3. Replace non-semantic containers with semantic landmarks (header, main, nav, footer).
4. Add/verify descriptive alt attributes for all images; mark decorative images with empty alt.
5. Improve keyboard accessibility: visible focus styles and a skip-to-content link.
6. Add or validate ARIA attributes (aria-expanded, aria-controls) where interactive.
7. Audit color contrast and adjust styles to meet WCAG AA.
8. Optimize images: compress, provide srcset/sizes, and serve WebP/AVIF; lazy-load offscreen images.
9. Preload critical assets (fonts, hero image, critical CSS); defer non-critical JS.
10. Minify and bundle CSS/JS; purge unused Tailwind CSS to reduce payload.
11. Add SEO meta tags: title, description, canonical, Open Graph, Twitter cards, and JSON-LD where appropriate.
12. Add favicon and touch icons with appropriate link tags.
13. Configure server caching and compression (gzip/brotli) and set cache-control for static assets.
14. Add privacy/analytics considerations: analytics snippet, consent banner if collecting data.
15. Run QA: Lighthouse audit, axe accessibility scan, cross-browser and responsive testing; document issues.

Reference: [`landingPage/final/index.html:1`]
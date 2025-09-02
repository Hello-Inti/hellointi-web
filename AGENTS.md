# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview (Non-Obvious Only)
- **Static HTML marketing site** - Pure front-end landing pages, no build process required
- **Multiple version variations** - Complex iterative versioning using suffixes (mitra, dsv1, san, etc.)
- **Single-page applications** - All content in single HTML files with linked CSS/JS

## Repository Structure

### Main Assets
- **`index.html`** - Primary, current landing page
- **`README.md`** - Project documentation
- **`AGENTS.md`** - This guidance file

### Landing Page Versions
Located in `landingPage/` directory:
```
landingPage/
├── v1/                      # Original version
├── v2/                      # Second iteration
├── v3/                      # Refinements version
├── v4/                      # Further improvements
├── v5/                      # Latest standard version
├── v5-mitra/               # Mitra-specific variant of v5
├── v5-mitra-dsv1/         # Double variant (mitra + dsv1)
├── v6-mitra-san-dsv1/    # Triple variant (v6 + mitra + san + dsv1)
├── v6-mitra-san-dsv1-v2/  # Quadruple variant with additional revision
└── v6-mitra-san-dsv2/    # Different design system version
```

## Naming Convention Patterns

### Version Elements
- **Numbers** (`v1`, `v2`, etc.) - Major version progression
- **mitra** - Specific client/partner variation
- **san** - San-specific variation (possibly location/country)
- **dsv** - Design system variation (followed by number)
- **v2** - Additional revision within same major version

### Pattern Rules
- **Single dash separation** - Always use single dash between elements
- **Logical grouping** - Variants cluster by customer/client needs
- **Non-breaking inheritance** - Each version builds on previous unless specified

## File Organization Conventions

### Content Structure
- **Inline CSS** - All styles in `<style>` tag within `<head>`
- **Inline JavaScript** - Minimal JS for interactive elements
- **Semantic HTML** - Well-structured, accessible markup
- **CSS Custom Properties** - All colors and variables defined in `:root`

### Performance Patterns
- **Critical CSS inline** - No external stylesheet dependencies
- **Minimal JavaScript** - Only essential interactivity
- **Optimized images** - Small, web-optimized graphics
- **Progressive enhancement** - Works without JavaScript enabled

## Technical Architecture

### CSS Framework Pattern
```css
:root {
  --bg:#ffffff;
  --text:#0b1324;
  --accent:#ff7a1a;
  /* ... more variables */
}
```

### Responsive Design
- **Mobile-first approach** - Base styles for mobile, media queries for larger screens
- **Container pattern** - Max-width wrapper with padding: `.container{max-width:1120px;margin:0 auto;padding:0 20px}`
- **Grid systems** - CSS Grid implementations: `.grid-2`, `.grid-3`

### Interactive Components
- **Smooth scrolling** - Element targeting via `#anchors`
- **Button variants** - `.button` primary and `.button.ghost` secondary
- **Hover effects** - Subtle animations and state changes
- **Modal/lightbox** - Minimal overlay implementations where needed

### SEO & Meta Optimization
- **Structured meta tags** - Open Graph and Twitter Card support
- **Theme color** - Browser chrome color: `<meta name="theme-color" content="#FF7A1A">`
- **Viewport optimization** - Mobile-responsive meta tag
- **Structured heading hierarchy** - Proper H1-H6 usage for accessibility

## Development Workflow

### Version Control Strategy
- **Branch per major version** - Each numbered version (`v1`, `v2`, etc.) maintains separate branch
- **Tag for releases** - Git tags mark production-ready versions
- **Variant branches** - Client-specific variations fork from base versions

### Deployment Pattern
- **Static hosting ready** - No build step required, deploy directly to CDN
- **Cache-friendly** - Long cache headers for static assets
- **CDN compatible** - All assets relative or CDN-ready

### Testing Requirements
- **Cross-browser validation** - Modern browser support (including mobile)
- **Performance budget** - Lighthouse scores prioritize speed metrics
- **Accessibility audit** - WCAG compliance for commercial site
- **SEO validation** - Google PageSpeed and rich result testing

## Critical Business Information
- **Conversion-focused** - All copy designed for lead generation and demo booking
- **Value proposition** - "Build real connections in your remote-first org in 7 weeks"
- **Trust signals** - Social proof, testimonials, and feature highlighting
- **Call-to-action placement** - Strategic CTA positioning throughout user journey

## Security Considerations
- **XSS prevention** - Secure external links with proper attributes
- **HTTPS requirement** - All external resources loaded over secure connection
- **Privacy compliance** - Minimal data collection, GDPR-friendly form handling

## Gotchas & Pitfalls
- **Font loading delays** - Web fonts (Google Fonts) can cause FOIT if not optimized
- **CSS custom prop support** - Modern browser requirement for CSS variables
- **Absolute positioning** - Some layout elements require specific positioning context
- **Z-index management** - Sticky navigation requires proper stacking context

## Performance Optimization
- **Critical render path** - Inline CSS prevents render-blocking requests
- **Asset loading strategy** - Images use modern formats with fallbacks
- **Bundle splitting** - JS kept minimal, loaded synchronously
- **Network efficiency** - Single HTML file reduces server requests

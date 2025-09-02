# Hello Inti - Product Landing Page & Marketing Website

This repository contains the marketing and landing page assets for Hello Inti, a platform that helps remote-first organizations build real connections through facilitated 7-week conversation programs.

## Repository Structure
```
hellointi-web/
├── README.md                           # Project overview and guidance
├── AGENTS.md                          # AI assistant guidelines
├── index.html                         # Primary landing page (production)
├── landingPage/                      # Historical and variant pages
│   ├── v1/                           # Original landing page version
│   ├── v2/                           # Second iteration
│   ├── v3/                           # Third iteration
│   ├── v4/                           # Fourth iteration
│   ├── v5/                           # Fifth iteration (final non-custom)
│   ├── v5-mitra/                     # Mitra client-specific variant
│   ├── v5-mitra-dsv1/                # Mitra + design system variant
│   ├── v6-mitra-san-dsv1/           # v6 with mitra + san variants
│   ├── v6-mitra-san-dsv1-v2/        # v6 variant with second revision
│   └── v6-mitra-san-dsv2/           # v6 with different design system
```

## Getting Started

### Local Development
1. Simply open any `.html` file in your browser - no web server required
2. All assets are self-contained with inline CSS and minimal JavaScript
3. Modern browser recommended for best experience

### Testing & Preview
```bash
# View any legacy version
cd landingPage/v5-mitra/
python -m http.server 8000  # or any simple server
open http://localhost:8000/index.html
```

## Version History & Evolution

### Major Versions
- **v1-v4**: Early iterations with feature testing and design refinement
- **v5**: Production-ready version with finalized messaging and design
- **v6**: Latest version with enhanced features and optimizations

### Variant Types
- **Client-specific** (`-mitra`): Customized for specific client needs
- **Design system** (`-dsv1`, `-dsv2`): Alternative design implementations
- **Location/geographic** (`-san`): Localized variants for specific markets

## Technical Architecture

### Front-end Stack
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, Flexbox/Grid layouts, responsive design
- **Vanilla JavaScript**: Minimal DOM manipulation and interactions
- **Mobile-first**: Progressive enhancement with responsive breakpoints

### Performance & Optimization
- **Critical path optimization**: Inline CSS prevents render blocking
- **Minimal bundle size**: Single HTML file approach
- **Progressive enhancement**: Core functionality works without JavaScript
- **SEO-optimized**: Structured data and meta tags for search engines

## Content Management

### Key Sections
- **Hero**: Value proposition and primary call-to-action
- **How It Works**: 7-week program explanation (Weeks 1-7 + wrap-up)
- **Outcomes**: Measurable results and benefits
- **Program Details**: What's included and features
- **Social Proof**: Testimonials and trust signals
- **FAQ**: Common questions and concerns

### Conversion Optimization
- **Multiple CTAs**: Strategic placement throughout the page
- **Trust signals**: Privacy badges, testimonial grid, feature highlighting
- **Social proof**: Customer quotes and outcomes metrics
- **Progressive disclosure**: Information revealed as user commitment increases

## Integration Points
- **Calendly**: Demo booking integration (`https://calendly.com/`)
- **Mailto links**: Direct contact functionality for forms
- **External calendars**: Google Calendar/Outlook integration messaging
- **Communication tools**: Slack/Teams integration descriptions

## Deployment & Hosting
- **Static hosting ready**: No build process required
- **CDN compatible**: All assets relative or CDN-ready
- **Cache optimization**: Long-term caching headers for performance
- **Global delivery**: Content Delivery Network hosting recommended

## Legal & Compliance
- **GDPR friendly**: Minimal data collection and cookie usage
- **Privacy policy**: Required links and compliance statements
- **Terms of service**: Legal compliance documentation
- **Contact information**: Business email and contact details

## Future Website Plans
This repository will expand to include:
- Full multi-page marketing website (About, Blog, Resources)
- SEO-optimized content pages
- Lead capture forms and CRM integrations
- Analytics and conversion tracking
- A/B testing frameworks

See AGENTS.md for detailed technical guidance.

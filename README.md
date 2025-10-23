# Hello Inti - Product Landing Page & Marketing Website

This repository contains the marketing and landing page assets for Hello Inti, a platform that helps remote-first organizations build real connections through facilitated 7-week conversation programs.

## Repository Structure
```
hellointi-web/
├── README.md                           # Project overview and guidance
├── AGENTS.md                          # AI assistant guidelines
├── landingPage/final/                  # Main website files
│   ├── index.html                    # Primary landing page
│   ├── src.css                       # Source CSS file
│   ├── style.css                     # Compiled CSS file
│   ├── src.js                        # Source JavaScript file
│   └── script.js                     # Compiled JavaScript file
```

## Getting Started

### Local Development
1.  Install dependencies if you have not already:
    ```bash
    npm install
    ```
2.  From the repository root, start the development workflow (CSS/JS rebuild + live-reloading server):
    ```bash
    npm run dev
    ```
3.  Open `http://localhost:3000` in your browser. Changes to `src.css`, `src.js`, or any HTML file under `landingPage/final/` will trigger automatic rebuilds and browser refreshes.

### Testing & Preview
To preview the compiled assets without the watcher pipeline, run the Express server on its own:
```bash
npm run serve
```
This command uses Nodemon to run [`landingPage/final/server.js`](landingPage/final/server.js:1). For a single-run preview without file watching, execute:
```bash
node landingPage/final/server.js
```
Then open `http://localhost:3000` in your browser.

## Technical Architecture

### Front-end Stack
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, Flexbox/Grid layouts, responsive design
- **Vanilla JavaScript**: Minimal DOM manipulation and interactions
- **Mobile-first**: Progressive enhancement with responsive breakpoints

### Animations
This project uses the **GSAP (GreenSock Animation Platform)** for animations. Key points to consider:

-   **Existing Animations**: The hero section of the home page features a GSAP-powered animation. Be mindful of this when adding new scripts to avoid conflicts.
-   **Future Development**: For any new animation-related functionality, it is recommended to use GSAP to maintain consistency and leverage its powerful features.

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

## Build Process

This project uses `postcss` and `esbuild` to process CSS and JavaScript files.

-   **CSS**: The build process, triggered by `npm run build-css`, takes the source file [`landingPage/final/src.css`](landingPage/final/src.css) and generates the output file [`landingPage/final/style.css`](landingPage/final/style.css).
-   **JavaScript**: The `npm run build-js` command bundles and minifies [`landingPage/final/src.js`](landingPage/final/src.js), creating the final script at [`landingPage/final/script.js`](landingPage/final/script.js).

To run the entire build process, use the following command:

```bash
npm run build
```

## Deployment & Hosting
- **Static hosting ready**: The project can be deployed to any static hosting provider.
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

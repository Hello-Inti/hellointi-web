# Hello Inti – Marketing Website & Lead Generators

This repository houses the public marketing site (`hellointi.com`) and a suite of lead-generator landing pages served from subdomains. Each surface can be optimized individually while sharing a unified Node-based build pipeline.

## Repository Structure
```
hellointi-web/
├── package.json                  # Root scripts & shared devDependencies
├── README.md
├── AGENTS.md
├── scripts/
│   ├── build.js                 # Builds a single project (CSS + JS)
│   ├── build-all.js             # Builds website + all eligible lead generators
│   └── dev-server.js            # Express + LiveReload server for /public
├── public/
│   ├── website/                 # Main marketing site (hellointi.com)
│   │   ├── index.html
│   │   ├── src.css / style.css  # Tailwind source & compiled CSS
│   │   ├── src.js / script.js   # ES module source & bundled JS
│   │   └── ...
│   └── lead_generators/         # Subdomain landing pages
│       ├── events/
│       ├── alumni/
│       └── ... (future lead magnets)
└── business_blueprint/          # Strategy & positioning references
```

## Prerequisites

- Node.js 18+
- pnpm 8+

## Install Dependencies

```bash
pnpm install
```

## Local Development

### Unified Dev Server

Launch an Express + LiveReload server rooted at `/public` so every surface (main site & each lead generator) is available during development:

```bash
pnpm run dev
```

Then open `http://localhost:3000`. The server redirects `/` to `/website` and serves every folder in `/public` at its natural path (e.g. `/lead_generators/events`).

### Project-specific Workflows

If you prefer to work from the original project scripts (for example to reuse the existing `public/website` watcher pipeline), you can still execute them directly:

```bash
pnpm --dir public/website dev
```

## Build Pipeline

The root build tooling standardizes PostCSS (Tailwind, Autoprefixer, cssnano) and esbuild bundling across all projects.

### Build a Single Project

```bash
pnpm run build:project -- public/website
```

The command expects a directory containing `src.css` and `src.js`. Output files (`style.css`, `script.js`) are written next to the sources.

### Build All Eligible Projects

```bash
pnpm run build:all
```

The script automatically discovers subdirectories under `public/lead_generators/` that contain both `src.css` and `src.js`, and builds them alongside the main website. Folders that still rely on CDN styling/scripts will be skipped with a warning.

## Adding a New Lead Generator to the Build

1. Create a new directory under `public/lead_generators/<name>`.
2. Add Tailwind source and JavaScript entry points (`src.css`, `src.js`).
3. Copy/adjust a `tailwind.config.js` (you can borrow from `public/website`).
4. Update the landing page HTML to reference the compiled `style.css` and `script.js` instead of CDN assets.
5. Run `pnpm run build:project -- public/lead_generators/<name>` to generate optimized assets.

Once a lead generator provides both entry files, it becomes eligible for `npm run build:all`.

## Production Preview

```bash
pnpm run serve
```

This starts the same Express server without LiveReload and with `NODE_ENV=production`, allowing you to validate the compiled assets exactly as they will ship.

## Project Guidelines

- **Animations**: GSAP is bundled locally; reuse existing patterns where possible.
- **Accessibility**: Maintain semantic HTML, focus management, and ARIA attributes consistent with the main site.
- **Performance**: Keep CSS/JS entry points lean—purge unused Tailwind utilities and avoid unused dependencies.
- **Shared assets**: Common popup/scheduler components live in `public/scripts/`; consider bundling them into project builds when migrating away from CDN usage.

See `AGENTS.md` for automation guidelines and coding standards.

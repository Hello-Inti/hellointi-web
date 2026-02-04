# Code Review: Web3 V2 Lead Generator

**Date**: 2026-01-21
**Reviewer**: Devuxy (Frontend Architect)

## Summary
The `web3_v2` page is a well-structured standalone prototype that closely matches the provided copy. However, it is currently **disconnected from the project's build pipeline**. It relies on external CDNs and inline configuration rather than the local build system, which will lead to performance issues and maintenance drift.

## 1. Build Pipeline Integration (Critical)
*   **Issue**: The project is missing `src.css` and `src.js` entry points.
*   **Impact**: Running `pnpm run build:all` will **skip** this project. It will not be optimized, minified, or purged.
*   **Recommendation**:
    1.  Create `src.css` (importing Tailwind).
    2.  Create `src.js` (importing any logic).
    3.  Create a local `tailwind.config.js` (extending the main config or copying it).
    4.  Update `index.html` to link to the compiled `style.css` and `script.js` instead of CDNs.

## 2. Dependencies & Performance
*   **Tailwind CSS**: Currently loaded via CDN (`<script src="https://cdn.tailwindcss.com"></script>`). This is good for prototyping but bad for production (large file size, no purging).
*   **Feather Icons**: Loaded via `unpkg`. The project generally bundles assets or uses specific imports.
*   **Fonts**: Good use of `preconnect` for Google Fonts to minimize FOIT.
*   **Popup Framework**: Correctly links to `../../scripts/popup-framework.css` and `.js`.

## 3. Code Quality & Consistency
*   **HTML Structure**: Semantic and accessible (`nav`, `header`, `section`, `footer` used correctly).
*   **Inline Config**: Tailwind colors (`poppy`, `sunbeam`, etc.) are hardcoded in a `<script>` tag. This causes drift from the main design system.
*   **Inline Styles**: Keyframe animations (`subtle-glitch`, `ritual-glow`) are in a `<style>` block. These should be moved to the CSS file or Tailwind config.
*   **Copy Accuracy**: The HTML content matches `copy.md` almost exactly.

## 4. Bugs & TODOs
*   **Broken Link**: The "Read the full essay" link (Line 516) points to `#`.
*   **Form Source**: The popup loads a Google Form. Ensure this is the intended final destination.

## Action Plan
1.  Create `src.css` and `src.js`.
2.  Set up `tailwind.config.js` to inherit brand colors.
3.  Update `index.html` to use local assets.
4.  Verify build with `pnpm run build:project`.

# Rhea Mittal — Portfolio

Personal portfolio site for product designer Rhea Mittal (MS-HCI, Indiana University). Static HTML/CSS/JS, deployed from `main`.

**Live entry:** `index.html` → `portfolio-v2.html`  
**Concepts lab:** `hero-concepts.html`

## Changelog

Document notable changes with every GitHub commit. Newest first.

### 2026-08-07 — Collage scroll dead-zone fix

- **Homepage collage** (`portfolio-v2.html` / `scripts/hero-collage.js`): after the collage clears (auto-dismiss, hint click, or scroll), `#c4` collapses from the disperse runway to `100vh` (`.runway-collapsed`) so the next wheel/trackpad scroll moves real page content (logo garden / rest of site) instead of leftover sticky runway.
- Shortened active runway from `320vh` → `140vh` while the curtain is dispersing.
- Scroll-up at the top of the page expands the runway again so the collage can reassemble.
- Synced the same runway collapse behavior on **Concept 4** in `hero-concepts.html`.
- Added this README with a Changelog habit for future commits.

### 2026-08-06 — Collage homepage hero & site refresh

- Collage loading-curtain hero (Concept 4) on the homepage with photo disperse on scroll / hint / ~1.2s auto-clear.
- Shared script: `scripts/hero-collage.js`.
- AI work tabs, playground cards, and related homepage polish in the same refresh (`cb73235`).

### Recent prior work (summary)

- Shared lazy video loader and smaller clips to fix hero videos hanging (`89e9007`).
- Media optimization and portfolio UX polish for faster loads and accessibility (`99d39e9`).
- Compressed portfolio videos for OpsIQ, About, and CliquePrize (`7b0dcdc`).
- Tool stack logos, Salesforce gallery lightbox, work page cards, and trimmed video assets (`1aa9259` and related).

## Local preview

```bash
python3 serve.py
# or any static server from the repo root
```

Open the printed local URL and load `portfolio-v2.html` (or `/` via `index.html`).

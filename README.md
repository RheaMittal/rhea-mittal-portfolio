# Rhea Mittal — Portfolio

Personal portfolio site for product designer Rhea Mittal (MS-HCI, Indiana University). Static HTML/CSS/JS, deployed from `main`.

**Live entry:** `index.html` → `portfolio-v2.html`  
**Concepts lab:** `hero-concepts.html`

## Changelog

Document notable changes with every GitHub commit. Newest first.

### 2026-09-07 — SETH Lab logo on About collage

- Replaced the SETH Lab photo on the About **Communities & Milestones** card with the lab logo, using the same cream-tile / `object-fit: contain` treatment as the other milestone logos.
- Logo saved at `assets/About Me/Thingspart of./SETH Lab logo.png` (cropped from a screenshot to the mark). Card and lightbox both use this file.

### 2026-09-07 — Logo tiles on About collage

- Replaced screenshot/crop-style images on the About **Communities & Milestones** cards with logos, on cream tiles (`object-fit: contain`, padding). Open Doors no longer uses the cookie-banner article screenshot.
- Logos in `assets/About Me/Thingspart of./`: `Open Doors logo.png`, `SIGCHI logo.png`, `The Period Society logo.png`, `Adeptic logo.png`, `Medium logo.png`.
- SETH Lab has no public mark, so the existing lab photo stays. Lightbox uses the same logo (or photo) as the card.

### 2026-09-07 — Open Doors feature on About

- Added an **Open Doors Junior Portfolio Showcase** card to the About page **Communities & Milestones** collage (`about.html`).
- Card sits first in the grid, with collage lightbox copy and a live CTA to the [newsletter feature](https://blog.opendoorscareers.com/p/junior-portfolio-showcase-rhea-mittal).
- Card image is a screenshot of the article hero, saved at `assets/About Me/Thingspart of./Open Doors — Junior Portfolio Showcase.png`.
- Collage grid updated from 5 to 6 cards (3×2 on desktop).

### 2026-09-07 — Restore About Communities & Milestones

- Reinstated the **Communities & Milestones** collage on `about.html` (heading: *Things I've been part of.*), which had been removed from the latest GitHub push.
- Cards restored from git history with original copy and assets: SIGCHI Creative Lead, SETH Lab, Aedge Podcast guest, Medium Blog, and The Period Society Bangalore.
- Restored collage lightbox markup, CSS, and JS so cards open the full story again (Spotify / Medium CTAs included).
- Section sits after the About hero and before the quotes block, matching its original placement.

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

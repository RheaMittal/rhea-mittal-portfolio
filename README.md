# Rhea Mittal — Portfolio

Personal portfolio site for product designer Rhea Mittal (MS-HCI, Indiana University). Static HTML/CSS/JS, deployed from `main`.

**Live entry:** `index.html` → `portfolio-v2.html`  
**Concepts lab:** `hero-concepts.html`

## Changelog

Document notable changes with every GitHub commit. Newest first.

### 2026-11-05 — Design polish + interface guidelines pass (all pages)

- **Type:** headlines and labels in sentence case; weights capped at 600 (Lato renders 700); no italic emphasis. Lato + Open Sans pairing unchanged.
- **Colour:** site green stays `#1DA855` on title accents. Glass blur, white inset highlights, coloured glows and gradient avatars removed. Case-study hero bands and footers use solid project colours.
- **Copy:** emoji replaced with line icons or status dots; OpsIQ card shows only real stats; Canvas work card shows 62% / 30% / 8+; "AI-powered" trimmed from hero lines; curly quotes and `…` in visible text; footer © 2026.
- **Spacing and motion:** padding, margins and gaps on a 4px grid; no pulsing live dot or bobbing scroll arrow; shorter card entrance; hover zooms reduced.
- **Accessibility:** link-cards are real `<a>` elements; icon buttons labelled; skip link + `<main>` on every page; shared `:focus-visible` ring; `rel="noopener noreferrer"` on new-tab links; About tiles and the Salesforce video keyboard-operable (`scripts/a11y.js`).
- **Reduced motion:** videos show a still frame instead of autoplaying; reveals, marquee and hover zooms off (`styles/design-system.css`, `scripts/lazy-vid.js`).
- **Performance:** real `width`/`height` on images, lazy loading below the fold, poster frames for all videos (`assets/posters/`).
- **Assets:** removed 20 unused files (old `.mov` originals and unused screenshots).

### 2026-09-07 — Open Doors hover + lightbox screenshot

- About **Communities & Milestones** Open Doors card stays the logo by default.
- Hover and lightbox now use `assets/About Me/Thingspart of./Open Doors — Junior Portfolio Showcase.png` — Florian Bölter’s Junior Portfolio Showcase article (no cookie banner).
- Same logo-then-photo pattern as SIGCHI, SETH Lab, and the other milestone cards.

### 2026-09-07 — About milestone logos, hover photos, SETH blue

- About **Communities & Milestones** tiles show logos by default. Hover fades in the original working/contributing photo; the lightbox opens that same photo.
- SETH Lab tile background is the logo’s baby blue (`#DEF0F0`). Other logo tiles stay cream. SETH lightbox uses the original lab photo, not the logo tile.
- Open Doors stays logo on the tile, hover, and lightbox (no cookie-banner screenshot).
- Photos: `SIGCHI — Creative Lead, Srishti Chapter.png`, `SETH Lab.png`, `Aedge Podcast — Adeptic Creative Labs.png`, `Medium Blog.png`, `The Period Society — Bangalore.png`.

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

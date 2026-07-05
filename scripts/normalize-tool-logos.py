#!/usr/bin/env python3
"""Normalize tool stack logos to ~75% ink coverage on 256x256 canvases."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

OUT = 256
INK_COVERAGE = 0.75  # logo bbox area / canvas area
TARGET_SIDE = int(OUT * (INK_COVERAGE**0.5))  # ~222px max dimension

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "assets" / "tools"
CURSOR_ASSETS = Path(
    "/Users/306084/.cursor/projects/Users-306084-Desktop-Rhea-Mittal-Portfolio/assets"
)

SOURCES = {
    "figma": CURSOR_ASSETS / "image-8bb358e2-a447-42f6-ae30-e933ed277417.png",
    "miro": CURSOR_ASSETS / "image-f1ab4bc6-8dc3-441b-95d8-fe8c39406eb0.png",
    "illustrator": CURSOR_ASSETS / "image-b6b37a49-cdfd-42de-a0e4-beb6dc574ead.png",
    "xd": CURSOR_ASSETS / "image-3a3527be-7e22-477f-ae8b-5c147bf21fdb.png",
    "claude": CURSOR_ASSETS / "image-84b97f71-64ec-40ff-a738-9e40368dc3ec.png",
    "cursor": CURSOR_ASSETS / "image-e0d248ce-9693-42d6-bdb1-0a7e6f12dfe1.png",
    "vercel": CURSOR_ASSETS / "image-88b0ff8f-ba7a-4642-a0bb-0c1b71e3b0a9.png",
    "lovable": CURSOR_ASSETS / "image-244b2c66-79e2-4418-bd25-ed0309fcd784.png",
}


def bbox_from_mask(mask: np.ndarray) -> tuple[int, int, int, int] | None:
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    if not rows.any():
        return None
    y1, y2 = np.where(rows)[0][[0, -1]]
    x1, x2 = np.where(cols)[0][[0, -1]]
    return int(x1), int(y1), int(x2 + 1), int(y2 + 1)


def scale_to_side(im: Image.Image, side: int) -> Image.Image:
    w, h = im.size
    scale = side / max(w, h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def scale_to_target(im: Image.Image) -> Image.Image:
    return scale_to_side(im, TARGET_SIDE)


def paste_centered(canvas: Image.Image, im: Image.Image) -> None:
    cw, ch = canvas.size
    w, h = im.size
    canvas.paste(im, ((cw - w) // 2, (ch - h) // 2), im)


def finalize(canvas: Image.Image, path: Path) -> dict:
    arr = np.array(canvas.convert("RGBA"))
    a = arr[:, :, 3]
    visible = a > 128
    if visible.any():
        bbox = bbox_from_mask(visible)
        x1, y1, x2, y2 = bbox
        fill = (x2 - x1) * (y2 - y1) / (OUT * OUT) * 100
    else:
        fill = 0
    canvas.save(path, "PNG", optimize=True)
    return {"file": path.name, "fill_pct": round(fill, 1)}


def normalize_color_on_transparent(name: str) -> dict:
    """Figma: colored shapes only, transparent background."""
    im = Image.open(SOURCES[name]).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r <= 25 and g <= 25 and b <= 25:
                px[x, y] = (0, 0, 0, 0)

    arr = np.array(im)
    mask = arr[:, :, 3] > 128
    bbox = bbox_from_mask(mask)
    cropped = im.crop(bbox)
    scaled = scale_to_target(cropped)
    canvas = Image.new("RGBA", (OUT, OUT), (0, 0, 0, 0))
    paste_centered(canvas, scaled)
    return finalize(canvas, TOOLS / f"{name}.png")


def round_corners(im: Image.Image, radius: int) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=255)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


def normalize_lovable() -> dict:
    """Lovable app tile with rounded corners (~22% radius, matches other app icons)."""
    im = Image.open(SOURCES["lovable"]).convert("RGBA")
    arr = np.array(im)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    visible = a > 128
    not_black = ~((r <= 25) & (g <= 25) & (b <= 25))
    mask = visible & not_black
    if not mask.any():
        mask = visible
    bbox = bbox_from_mask(mask)
    cropped = im.crop(bbox)
    scaled = scale_to_target(cropped)
    radius = max(8, int(max(scaled.size) * 0.22))
    scaled = round_corners(scaled, radius)
    canvas = Image.new("RGBA", (OUT, OUT), (0, 0, 0, 0))
    paste_centered(canvas, scaled)
    return finalize(canvas, TOOLS / "lovable.png")


def normalize_app_icon(name: str) -> dict:
    """Full app-icon tile (Adobe, Miro, Claude, Lovable)."""
    im = Image.open(SOURCES[name]).convert("RGBA")
    arr = np.array(im)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    visible = a > 128
    not_black = ~((r <= 25) & (g <= 25) & (b <= 25))
    mask = visible & not_black
    if not mask.any():
        mask = visible
    bbox = bbox_from_mask(mask)
    cropped = im.crop(bbox)
    scaled = scale_to_target(cropped)
    canvas = Image.new("RGBA", (OUT, OUT), (0, 0, 0, 0))
    paste_centered(canvas, scaled)
    return finalize(canvas, TOOLS / f"{name}.png")


def normalize_dark_mark(
    name: str,
    mark_coverage: float = INK_COVERAGE,
    *,
    transparent_bg: bool = False,
) -> dict:
    """Cursor / Vercel: scale white mark; black tile from CSS or baked into PNG."""
    im = Image.open(SOURCES[name]).convert("RGBA")
    arr = np.array(im)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    mark = (a > 128) & (np.maximum(np.maximum(r, g), b) > 80)
    bbox = bbox_from_mask(mark)
    x1, y1, x2, y2 = bbox
    mark_im = im.crop((x1, y1, x2, y2))
    target_side = int(OUT * (mark_coverage**0.5))
    scaled = scale_to_side(mark_im, target_side)

    bg = (0, 0, 0, 0) if transparent_bg else (0, 0, 0, 255)
    canvas = Image.new("RGBA", (OUT, OUT), bg)
    paste_centered(canvas, scaled)
    return finalize(canvas, TOOLS / f"{name}.png")


def main() -> None:
    TOOLS.mkdir(parents=True, exist_ok=True)
    results = []

    results.append(normalize_color_on_transparent("figma"))
    for n in ("miro", "illustrator", "xd", "claude"):
        results.append(normalize_app_icon(n))
    results.append(normalize_lovable())
    results.append(normalize_dark_mark("cursor"))
    results.append(
        normalize_dark_mark("vercel", mark_coverage=0.36, transparent_bg=True)
    )

    print(f"Target max dimension: {TARGET_SIDE}px (~{INK_COVERAGE*100:.0f}% ink coverage)")
    for r in results:
        print(f"  {r['file']}: {r['fill_pct']}% bbox fill")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Normalize tool stack logos to uniform visual weight on 256×256 canvases."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

OUT = 256
# Max side of logo content after scaling — ~75% of canvas for even visual weight.
TARGET_MAX = int(OUT * 0.75)
# Mark-only logos (Figma) read smaller at the same max side; slight boost for parity.
MARK_BOOST = 1.12
# Extra padding around detected content so anti-aliased edges are never clipped.
PAD_RATIO = 0.04

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "assets" / "tools"
CURSOR_ASSETS = Path(
    "/Users/306084/.cursor/projects/Users-306084-Desktop-Rhea-Mittal-Portfolio/assets"
)

NAMES = ("figma", "miro", "illustrator", "xd", "claude", "cursor", "vercel", "lovable")

SOURCE_FILES = {
    "figma": "image-8bb358e2-a447-42f6-ae30-e933ed277417.png",
    "miro": "image-f1ab4bc6-8dc3-441b-95d8-fe8c39406eb0.png",
    "illustrator": "image-b6b37a49-cdfd-42de-a0e4-beb6dc574ead.png",
    "xd": "image-3a3527be-7e22-477f-ae8b-5c147bf21fdb.png",
    "claude": "image-84b97f71-64ec-40ff-a738-9e40368dc3ec.png",
    "cursor": "image-e0d248ce-9693-42d6-bdb1-0a7e6f12dfe1.png",
    "vercel": "image-88b0ff8f-ba7a-4642-a0bb-0c1b71e3b0a9.png",
    "lovable": "image-244b2c66-79e2-4418-bd25-ed0309fcd784.png",
}

# frame = full icon tile (incl. dark bg); tile = colored app icon; mark = shapes only
MODES = {
    "figma": "mark",
    "miro": "tile",
    "illustrator": "tile",
    "xd": "tile",
    "claude": "tile",
    "lovable": "tile",
    "cursor": "frame",
    "vercel": "frame",
}


def source_path(name: str) -> Path:
    preferred = CURSOR_ASSETS / SOURCE_FILES[name]
    if preferred.exists():
        return preferred
    fallback = TOOLS / f"{name}.png"
    if fallback.exists():
        return fallback
    raise FileNotFoundError(f"No source for {name}")


def bbox_from_mask(mask: np.ndarray) -> tuple[int, int, int, int]:
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    if not rows.any():
        raise ValueError("empty mask")
    y1, y2 = np.where(rows)[0][[0, -1]]
    x1, x2 = np.where(cols)[0][[0, -1]]
    return int(x1), int(y1), int(x2 + 1), int(y2 + 1)


def expand_bbox(
    bbox: tuple[int, int, int, int],
    pad: int,
    width: int,
    height: int,
) -> tuple[int, int, int, int]:
    x1, y1, x2, y2 = bbox
    return (
        max(0, x1 - pad),
        max(0, y1 - pad),
        min(width, x2 + pad),
        min(height, y2 + pad),
    )


def strip_black_background(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 128 and r <= 25 and g <= 25 and b <= 25:
                px[x, y] = (0, 0, 0, 0)
    return im


def content_mask(arr: np.ndarray, mode: str) -> np.ndarray:
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    visible = a > 128
    if mode == "frame":
        return visible
    if mode == "tile":
        not_matte = ~((r <= 25) & (g <= 25) & (b <= 25))
        mask = visible & not_matte
        return mask if mask.any() else visible
    # mark — colored / non-black shapes on transparent
    not_black = ~((r <= 25) & (g <= 25) & (b <= 25))
    mask = visible & not_black
    return mask if mask.any() else visible


def scale_to_max_side(im: Image.Image, max_side: int) -> Image.Image:
    w, h = im.size
    scale = max_side / max(w, h)
    nw, nh = max(1, int(round(w * scale))), max(1, int(round(h * scale)))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def paste_centered(canvas: Image.Image, im: Image.Image) -> None:
    cw, ch = canvas.size
    w, h = im.size
    canvas.paste(im, ((cw - w) // 2, (ch - h) // 2), im)


def normalize(name: str) -> dict:
    im = Image.open(source_path(name)).convert("RGBA")
    mode = MODES[name]

    if mode == "mark":
        im = strip_black_background(im)

    arr = np.array(im)
    h, w = arr.shape[:2]
    mask = content_mask(arr, mode)
    bbox = bbox_from_mask(mask)
    bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad = max(2, int(max(bw, bh) * PAD_RATIO))
    bbox = expand_bbox(bbox, pad, w, h)

    cropped = im.crop(bbox)
    max_side = int(round(TARGET_MAX * MARK_BOOST)) if mode == "mark" else TARGET_MAX
    scaled = scale_to_max_side(cropped, max_side)

    canvas = Image.new("RGBA", (OUT, OUT), (0, 0, 0, 0))
    paste_centered(canvas, scaled)

    path = TOOLS / f"{name}.png"
    canvas.save(path, "PNG", optimize=True)

    out = np.array(canvas)
    vis = out[:, :, 3] > 128
    vb = bbox_from_mask(vis)
    fill = (vb[2] - vb[0]) * (vb[3] - vb[1]) / (OUT * OUT) * 100
    sw, sh = scaled.size
    return {
        "file": path.name,
        "mode": mode,
        "scaled": f"{sw}x{sh}",
        "fill_pct": round(fill, 1),
    }


def main() -> None:
    TOOLS.mkdir(parents=True, exist_ok=True)
    print(f"Canvas: {OUT}px  |  target max side: {TARGET_MAX}px  |  pad: {PAD_RATIO*100:.0f}%")
    for name in NAMES:
        r = normalize(name)
        print(f"  {r['file']:16} mode={r['mode']:5} scaled={r['scaled']:>7}  fill={r['fill_pct']}%")


if __name__ == "__main__":
    main()

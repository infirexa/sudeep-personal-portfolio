#!/usr/bin/env python3
"""
Turn the raw WhatsApp scans in the project root into the portfolio's web assets.

Inputs  : the 8 `WhatsApp Image *.jpeg` scans + `scripts/images.manifest.json`
Outputs : public/img/*.webp, public/docs/*.webp, public/favicon.svg,
          public/apple-icon.png, public/img/og.png, and lib/generated-assets.ts

No third-party dependencies beyond Pillow — the Otsu threshold and the skew
estimator are implemented here in plain Python so the pipeline stays installable
with `pip install pillow` and nothing else.

Usage:  python3 scripts/preprocess_images.py
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"
MANIFEST = SCRIPTS / "images.manifest.json"
PUBLIC = ROOT / "public"
IMG_DIR = PUBLIC / "img"
DOC_DIR = PUBLIC / "docs"
FONT_DIR = SCRIPTS / "fonts"
LIB = ROOT / "lib"

# Design tokens for the LIGHT brand furniture only (Open Graph image,
# favicon, apple icon). Those live outside the site theme on purpose:
# a light social card reads better on most platforms.
PAPER = (253, 250, 245)
PAPER_ALT = (245, 237, 225)
INK = (27, 21, 18)
INK_MUTED = (111, 98, 89)
CRIMSON = (165, 15, 40)
CRIMSON_DEEP = (107, 10, 27)
HAIRLINE = (230, 220, 203)

RESAMPLE = Image.Resampling.LANCZOS
BILINEAR = Image.Resampling.BILINEAR


# --------------------------------------------------------------------------
# small image-analysis helpers (pure Python, no numpy)
# --------------------------------------------------------------------------


def _luma(p: tuple[int, int, int]) -> float:
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]


def otsu_threshold(gray: Image.Image) -> int:
    """Classic Otsu threshold over a 256-bin histogram."""
    hist = gray.histogram()
    total = gray.width * gray.height
    sum_all = sum(i * h for i, h in enumerate(hist))
    w_b = 0.0
    sum_b = 0.0
    best_var = -1.0
    thr = 128
    for t in range(256):
        w_b += hist[t]
        if w_b == 0:
            continue
        w_f = total - w_b
        if w_f == 0:
            break
        sum_b += t * hist[t]
        m_b = sum_b / w_b
        m_f = (sum_all - sum_b) / w_f
        var = w_b * w_f * (m_b - m_f) ** 2
        if var > best_var:
            best_var = var
            thr = t
    return thr


def ink_mask(img: Image.Image) -> Image.Image:
    """Binary mask (255 = ink) of dark text on light paper."""
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    thr = otsu_threshold(gray)
    return gray.point(lambda v: 255 if v < thr else 0, mode="L")


def estimate_skew(mask: Image.Image, limit: float = 6.0, step: float = 0.25) -> float:
    """
    Projection-profile deskew: rotate the ink mask and keep the angle whose
    horizontal row profile has the sharpest transitions — that is the angle
    where the text baselines line up.
    """
    small = mask.resize(
        (max(1, mask.width // 3), max(1, mask.height // 3)), BILINEAR
    )
    best_angle = 0.0
    best_score = -1.0
    steps = int(limit / step)
    for i in range(-steps, steps + 1):
        angle = i * step
        rot = small.rotate(angle, resample=BILINEAR, fillcolor=0)
        prof = rot.tobytes()
        w = rot.width
        score = 0
        prev = 0
        for y in range(rot.height):
            total = sum(prof[y * w : (y + 1) * w])
            diff = total - prev
            score += diff * diff
            prev = total
        if score > best_score:
            best_score = score
            best_angle = angle
    return best_angle


def _extent(flags: list[bool]) -> tuple[int, int] | None:
    """First and last True in a boolean list → (start, end_exclusive)."""
    hits = [i for i, ok in enumerate(flags) if ok]
    if not hits:
        return None
    return hits[0], hits[-1] + 1


def find_paper_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    """
    Locate the sheet of paper inside a photo of a document.

    Near-white pixels are counted per row and per column; the longest
    contiguous run of paper-like rows/columns is the sheet. Using runs rather
    than a plain threshold keeps the dark wooden table and the coloured fabric
    out of the crop, which a naive bounding box would swallow.
    """
    w, h = img.size
    rgb = img.convert("RGB")
    px = rgb.load()

    def is_paper(p):
        mx, mn = max(p), min(p)
        return _luma(p) > 140 and (mx - mn) / max(mx, 1) < 0.20

    step_y = max(1, h // 300)
    step_x = max(1, w // 300)

    row_hits = [
        sum(1 for x in range(0, w, step_x) if is_paper(px[x, y])) / (w / step_x)
        for y in range(h)
    ]
    col_hits = [
        sum(1 for y in range(0, h, step_y) if is_paper(px[x, y])) / (h / step_y)
        for x in range(w)
    ]

    # Relative threshold: the scans are lit unevenly and the "paper" white
    # ranges from ~160 to ~245 luma, so anchor on each image's own peak
    # instead of an absolute value.
    row_peak = max(row_hits) if row_hits else 0.0
    col_peak = max(col_hits) if col_hits else 0.0

    rows = _extent([v > row_peak * 0.4 for v in row_hits])
    cols = _extent([v > col_peak * 0.4 for v in col_hits])

    if rows and cols and (rows[1] - rows[0]) > h * 0.35 and (cols[1] - cols[0]) > w * 0.35:
        return rows[0], cols[0], rows[1], cols[1]

    # -- fallback: the ink bounding box
    bbox = ink_mask(img).getbbox()
    if bbox:
        return bbox
    return (0, 0, w, h)


def fit_long_edge(img: Image.Image, long_edge: int, allow_upscale: bool = True) -> Image.Image:
    w, h = img.size
    longest = max(w, h)
    if longest == long_edge:
        return img
    if longest > long_edge or not allow_upscale:
        s = long_edge / longest
    else:
        s = long_edge / longest
    return img.resize((max(1, round(w * s)), max(1, round(h * s))), RESAMPLE)


def fit_width(img: Image.Image, width: int, allow_upscale: bool = False) -> Image.Image:
    w, h = img.size
    if w == width:
        return img
    if w > width or not allow_upscale:
        s = width / w
    else:
        s = width / w
    return img.resize((width, max(1, round(h * s))), RESAMPLE)


def unsharp(img: Image.Image, radius: float = 1.1, percent: int = 85, threshold: int = 3):
    """Re-crisp text after an upscale — the source scans are soft to begin with."""
    return img.filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=threshold))


# --------------------------------------------------------------------------
# colour grading
# --------------------------------------------------------------------------


def _lut(gain: float, lift: float, gamma: float) -> list[int]:
    return [
        max(0, min(255, int(255 * ((i / 255) ** gamma) * gain + lift)))
        for i in range(256)
    ]


def warm_grade(img: Image.Image) -> Image.Image:
    """A gentle warm curve: red up, blue down, soft S-curve in the shadows."""
    r, g, b = img.convert("RGB").split()
    r = r.point(_lut(1.03, 5, 0.97))
    g = g.point(_lut(1.00, 2, 1.00))
    b = b.point(_lut(0.94, 0, 1.06))
    return Image.merge("RGB", (r, g, b))


def vignette(img: Image.Image, strength: float = 0.28) -> Image.Image:
    """Radial multiply vignette — bright centre, darkened corners."""
    w, h = img.size
    grad = ImageOps.invert(Image.radial_gradient("L")).resize((w, h), BILINEAR)
    grad = grad.point(lambda v: 255 - int((255 - v) * strength)).convert("RGB")
    return ImageChops.multiply(img.convert("RGB"), grad)


def dark_duotone(img: Image.Image) -> Image.Image:
    """
    Map the photo onto a dark ramp for the dark site theme.

    Same construction as cream_duotone(): the luminance channel drives a
    5-stop LUT. The difference is the ramp's direction. The cream ramp runs
    light-at-the-top so the image reads as paper; this one runs
    dark-at-the-bottom so it sits on a near-black ground without the
    subject floating.
    """
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=0.8)

    stops = [
        (0.00, (10, 7, 6)),  # near-black ground, faintly warm
        (0.26, (32, 14, 20)),  # ink shadow with a crimson cast
        (0.46, (120, 34, 48)),  # deep crimson — shadows only
        (0.68, (206, 176, 154)),  # warm greige — the transition is fast
        (1.00, (245, 236, 224)),  # warm off-white highlight
    ]

    ramp = []
    for i in range(256):
        t = i / 255
        for j in range(len(stops) - 1):
            t0, c0 = stops[j]
            t1, c1 = stops[j + 1]
            if t <= t1 or j == len(stops) - 2:
                k = 0 if t1 == t0 else (t - t0) / (t1 - t0)
                k = max(0.0, min(1.0, k))
                ramp.append(
                    tuple(round(c0[m] + (c1[m] - c0[m]) * k) for m in range(3))
                )
                break

    out = Image.new("RGB", img.size)
    out.putdata([ramp[v] for v in gray.getdata()])
    return out


def neutralize_saturation(img: Image.Image, knee: float = 0.28, strength: float = 0.62):
    """
    Pull saturation out of the strongly coloured pixels while leaving the
    lightly coloured ones alone.

    The portrait was shot against a mustard-yellow sofa. Desaturating
    everything would make skin look flat, but the sofa carries by far the most
    chroma in the frame — so the reduction is scaled by how saturated each
    pixel already is.
    """
    hsv = img.convert("HSV")
    h, s, v = hsv.split()

    def scale_saturation(value: int) -> int:
        sat = value / 255
        if sat <= knee:
            return value
        excess = (sat - knee) / (1 - knee)
        return max(0, min(255, round(255 * sat * (1 - strength * excess))))

    s = s.point(scale_saturation)
    return Image.merge('HSV', (h, s, v)).convert('RGB')


def cream_duotone(img: Image.Image) -> Image.Image:
    """
    Map the photo onto a cream ramp, letting crimson live only in the shadows.

    The portrait was shot on a bright yellow sofa, which fights the cream and
    crimson palette. Mapping luminance onto the brand ramp turns that sofa into
    a sand tone and keeps the suit reading as deep ink — while leaving the
    midtones and skin in warm paper tones so he still looks like a person.
    """
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=0.8)

    stops = [
        (0.00, (24, 14, 18)),    # near-black, crimson cast
        (0.30, (96, 44, 56)),    # deep crimson — shadows only
        (0.50, (198, 170, 152)), # warm greige — the transition happens fast
        (0.72, (238, 228, 214)), # light paper
        (1.00, (253, 250, 245)), # cream
    ]

    ramp = []
    for i in range(256):
        t = i / 255
        for j in range(len(stops) - 1):
            t0, c0 = stops[j]
            t1, c1 = stops[j + 1]
            if t <= t1 or j == len(stops) - 2:
                k = 0 if t1 == t0 else (t - t0) / (t1 - t0)
                k = max(0.0, min(1.0, k))
                ramp.append(
                    tuple(round(c0[m] + (c1[m] - c0[m]) * k) for m in range(3))
                )
                break

    out = Image.new("RGB", img.size)
    out.putdata([ramp[v] for v in gray.getdata()])
    return out


# --------------------------------------------------------------------------
# pipelines
# --------------------------------------------------------------------------


def process_document(src: Path, out_base: str, rotate: int, deskew: bool, cfg: dict):
    img = Image.open(src)
    img = ImageOps.exif_transpose(img).convert("RGB")

    if rotate:
        # transpose() is a lossless pixel permutation; rotate() would resample
        # through an interpolation filter and soften the text.
        # ROTATE_90 is a quarter turn counter-clockwise, which is the
        # orientation these scans were shot in.
        turns = {
            90: Image.Transpose.ROTATE_90,
            180: Image.Transpose.ROTATE_180,
            270: Image.Transpose.ROTATE_270,
        }[rotate]
        img = img.transpose(turns)

    if deskew:
        angle = estimate_skew(ink_mask(img))
        if abs(angle) >= 0.2:
            img = img.rotate(
                angle, resample=RESAMPLE, expand=True, fillcolor=(255, 255, 255)
            )

    top, left, bottom, right = find_paper_bbox(img)
    margin = int(0.035 * max(img.width, img.height))
    box = (
        max(0, left - margin),
        max(0, top - margin),
        min(img.width, right + margin),
        min(img.height, bottom + margin),
    )
    img = img.crop(box)

    # Documents stay neutral white — a warm-tinted "scan" reads as fabricated.
    img = ImageOps.autocontrast(img, cutoff=1)
    img = ImageEnhance.Contrast(img).enhance(1.22)
    img = ImageEnhance.Sharpness(img).enhance(1.8)

    full = unsharp(fit_long_edge(img, cfg["longEdge"]))
    full_path = DOC_DIR / f"{out_base}.webp"
    full.save(full_path, "WEBP", quality=cfg["quality"], method=6)

    thumb = fit_width(full, cfg["thumbWidth"])
    thumb_path = DOC_DIR / f"{out_base}-thumb.webp"
    thumb.save(thumb_path, "WEBP", quality=cfg["thumbQuality"], method=6)

    return full_path, thumb_path, full.size, thumb.size


def process_portrait(src: Path, out_base: str, cfg: dict):
    img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")

    # crop to 4:5 with an upward bias so the head stays in the frame
    w, h = img.size
    target = 4 / 5
    if w / h > target:
        new_w = int(h * target)
        left = int((w - new_w) * 0.5)
        img = img.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target)
        top = int((h - new_h) * 0.30)
        img = img.crop((0, top, w, top + new_h))

    img = img.resize((1200, 1500), RESAMPLE)
    graded = vignette(warm_grade(img), 0.28)

    full_path = IMG_DIR / f"{out_base}.webp"
    graded.save(full_path, "WEBP", quality=cfg["quality"], method=6)

    thumb = fit_width(graded, cfg["thumbWidth"])
    thumb_path = IMG_DIR / f"{out_base}-thumb.webp"
    thumb.save(thumb_path, "WEBP", quality=cfg["thumbQuality"], method=6)

    # Blend the duotone over the neutralised natural grade so skin stays
    # believable while the yellow sofa is pulled into the palette.
    neutral = neutralize_saturation(graded)
    duo = Image.blend(neutral, cream_duotone(img), 0.5)
    duo_path = IMG_DIR / f"{out_base}-duotone.webp"
    duo.save(duo_path, "WEBP", quality=cfg["quality"], method=6)

    # The same treatment for the dark site theme.
    duo_dark = Image.blend(neutral, dark_duotone(img), 0.5)
    duo_dark_path = IMG_DIR / f"{out_base}-duotone-dark.webp"
    duo_dark.save(duo_dark_path, "WEBP", quality=cfg["quality"], method=6)

    return (
        full_path,
        thumb_path,
        duo_path,
        duo_dark_path,
        graded.size,
        thumb.size,
        duo.size,
        duo_dark.size,
    )


# --------------------------------------------------------------------------
# brand furniture: OG image, favicon, apple icon
# --------------------------------------------------------------------------


def _load_font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = FONT_DIR / f"{name}.ttf"
    if not path.exists():
        print(f"  ! {path.name} missing — skipping", file=sys.stderr)
        return ImageFont.load_default()
    font = ImageFont.truetype(str(path), size)
    try:
        axes = font.get_variation_axes()
        names = [a.get("name") for a in axes]
        # Fraunces: SOFT, WONK, opsz, wght — set them explicitly for the display cut.
        if name == "Fraunces":
            values = []
            for n in names:
                n = (n or b"").decode() if isinstance(n, bytes) else str(n)
                values.append({"wght": 600, "opsz": 144, "SOFT": 20, "WONK": 1}.get(n, 0))
            font.set_variation_by_axes(values)
        elif name == "Manrope":
            values = []
            for a in axes:
                n = a.get("name")
                n = (n or b"").decode() if isinstance(n, bytes) else str(n)
                values.append(a.get("default", 400) if n != "wght" else 500)
            font.set_variation_by_axes(values)
    except Exception as exc:  # pragma: no cover - depends on the Pillow build
        print(f"  ! could not set variation axes on {name}: {exc}", file=sys.stderr)
    return font


def build_og_image(hero_portrait: Path | None) -> Path:
    W, H = 1200, 630
    canvas = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(canvas)

    # crimson wash bleeding in from the right edge
    for i in range(320):
        a = i / 320
        col = tuple(
            round(PAPER[j] + (CRIMSON[j] - PAPER[j]) * (1 - a) ** 2 * 0.16)
            for j in range(3)
        )
        draw.rectangle([W - 320 + i, 0, W, H], fill=col)

    # hairline frame
    draw.rectangle([0, 0, W - 1, H - 1], outline=HAIRLINE, width=2)

    if hero_portrait and hero_portrait.exists():
        try:
            p = Image.open(hero_portrait).convert("RGB")
            p = fit_height(p, 560)
            canvas.paste(p, (W - p.width - 70, 35))
        except Exception as exc:
            print(f"  ! portrait not embedded in OG: {exc}", file=sys.stderr)

    draw.text((80, 190), "SUDEEP SINGH", font=_load_font("Fraunces", 82), fill=INK)
    draw.text(
        (84, 300),
        "SERVICE CAPTAIN  ·  HOSPITALITY",
        font=_load_font("Manrope", 26),
        fill=CRIMSON,
    )
    draw.text(
        (84, 356),
        "New Delhi NCR  ·  Radisson Blu  ·  The Forte Grand  ·  Gourmet Gallery",
        font=_load_font("Manrope", 20),
        fill=INK_MUTED,
    )
    draw.rectangle([84, 430, 84 + 96, 436], fill=CRIMSON)

    path = IMG_DIR / "og.png"
    canvas.save(path, "PNG", optimize=True)
    return path


def fit_height(img: Image.Image, height: int) -> Image.Image:
    w, h = img.size
    s = height / h
    return img.resize((max(1, round(w * s)), height), RESAMPLE)


def build_favicon_svg() -> Path:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#A50F28"/>
  <text x="32" y="43" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="30" font-weight="600" fill="#FDFAF5">SS</text>
</svg>
"""
    path = PUBLIC / "favicon.svg"
    path.write_text(svg, encoding="utf-8")
    return path


def build_apple_icon() -> Path:
    size = 180
    img = Image.new("RGBA", (size, size), CRIMSON + (255,))
    draw = ImageDraw.Draw(img)
    font = _load_font("Fraunces", 88)
    text = "SS"
    bbox = draw.textbbox((0, 0), text, font=font)
    draw.text(
        ((size - (bbox[2] - bbox[0])) / 2 - bbox[0],
         (size - (bbox[3] - bbox[1])) / 2 - bbox[1]),
        text,
        font=font,
        fill=PAPER + (255,),
    )
    path = PUBLIC / "apple-icon.png"
    img.save(path, "PNG", optimize=True)
    return path


# --------------------------------------------------------------------------
# main
# --------------------------------------------------------------------------


def main() -> int:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    cfg = manifest["defaults"]

    IMG_DIR.mkdir(parents=True, exist_ok=True)
    DOC_DIR.mkdir(parents=True, exist_ok=True)
    LIB.mkdir(parents=True, exist_ok=True)

    assets: dict[str, dict] = {}

    for item in manifest["items"]:
        src = ROOT / item["source"]
        if not src.exists():
            print(f"  ! missing source: {item['source']}", file=sys.stderr)
            continue

        print(f"→ {item['id']}")
        if item["role"] == "document":
            full, thumb, fsize, tsize = process_document(
                src, item["id"], item.get("rotate", 0), item.get("deskew", False), cfg
            )
            assets[item["id"]] = {
                "preview": f"/docs/{full.name}",
                "thumbnail": f"/docs/{thumb.name}",
                "width": fsize[0],
                "height": fsize[1],
                "thumbWidth": tsize[0],
                "thumbHeight": tsize[1],
            }
            print(f"   {full.relative_to(ROOT)}  {fsize[0]}×{fsize[1]}")
        else:
            (
                full,
                thumb,
                duo,
                duo_dark,
                gsize,
                tsize,
                dsize,
                ddsize,
            ) = process_portrait(src, item["id"], cfg)
            assets[item["id"]] = {
                "preview": f"/img/{full.name}",
                "thumbnail": f"/img/{thumb.name}",
                "duotone": f"/img/{duo.name}",
                "duotoneDark": f"/img/{duo_dark.name}",
                "width": gsize[0],
                "height": gsize[1],
                "thumbWidth": tsize[0],
                "thumbHeight": tsize[1],
                "duotoneWidth": dsize[0],
                "duotoneHeight": dsize[1],
                "duotoneDarkWidth": ddsize[0],
                "duotoneDarkHeight": ddsize[1],
            }
            print(f"   {full.relative_to(ROOT)}  {gsize[0]}×{gsize[1]}")

    # report any source scan that is not in the manifest
    used = {i["source"] for i in manifest["items"]}
    for path in sorted(ROOT.glob("WhatsApp Image*.jpeg")):
        if path.name not in used:
            print(f"  · source scan not used: {path.name}")

    portrait = IMG_DIR / "portrait.webp"
    build_og_image(portrait)
    build_favicon_svg()
    build_apple_icon()
    print("→ og.png / favicon.svg / apple-icon.png")

    lines = [
        "// AUTO-GENERATED by scripts/preprocess_images.py — do not edit by hand.",
        "// Pixel dimensions of the images in public/, so lib/data.ts can never",
        "// disagree with the files actually on disk.",
        "",
        "export const assets = {",
    ]
    for key, value in assets.items():
        lines.append(f"  '{key}': {{")
        for k, v in value.items():
            if isinstance(v, str):
                lines.append(f"    {k}: '{v}',")
            else:
                lines.append(f"    {k}: {v},")
        lines.append("  },")
    lines.append("} as const")
    lines.append("")
    lines.append("export type AssetId = keyof typeof assets")
    lines.append("")

    out = LIB / "generated-assets.ts"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"→ {out.relative_to(ROOT)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

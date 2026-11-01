"""Vorschaubilder für Social Media (og:image, 1200×630) nach _site/og/<slug>.png und _site/og/index.png.

Liest _site/fonts.json und _site/fonts.css (Normal-Schnitt nahe 400 je Schrift), läuft nach Eleventy.
Kachel-Look: großes Heroletter in Akzentfarbe, daneben Name in der Schrift selbst, Kategorie/Autor/Jahr.
"""

import json
import re
from pathlib import Path
from urllib.parse import unquote

from PIL import Image, ImageDraw, ImageFont

SITE = Path("_site")
OUT = SITE / "og"
W, H = 1200, 630
BG, INK, MUTED = "#f5f5f5", "#171717", "#737373"
UI = "src/webfonts/sans/Inter/Inter_Variable.woff2"  # neutrale Schrift für Zusatzzeilen
NAME = "Font Collection elbym"


def faces():
    """slug → Pfad der Datei, deren Gewichtsbereich 400 am nächsten liegt; Normal vor Italic (Chorus gibt es nur kursiv)."""
    best = {}
    for block in re.findall(r"@font-face \{(.*?)\}", (SITE / "fonts.css").read_text(), re.S):
        fam = re.search(r"font-family: f-([a-z0-9]+);", block)
        if not fam:
            continue  # -s-Subsets (f-<slug>-s) passen nicht auf das Muster
        lo, hi = map(int, re.search(r"font-weight: (\d+) (\d+)", block).groups())
        dist = (0 if lo <= 400 <= hi else min(abs(lo - 400), abs(hi - 400))) + 1000 * ("font-style: italic" in block)
        url = unquote(re.search(r'url\("([^"]+)"\)', block).group(1))
        if fam[1] not in best or dist < best[fam[1]][0]:
            best[fam[1]] = (dist, SITE / url)
    return {k: v[1] for k, v in best.items()}


def regular(font):
    """Variable Schrift auf wght 400 stellen wie im Browser (Standard-Instanz ist teils Thin, z. B. Raleway)."""
    try:
        axes = font.get_variation_axes()
    except OSError:
        return font  # statische Schrift
    font.set_variation_by_axes(
        [min(max(400, a["minimum"]), a["maximum"]) if a["name"] in (b"Weight", b"wght") else a["default"] for a in axes]
    )
    return font


def fit(path, text, max_w, max_h, start):
    """Größte Schriftgröße ≤ start, bei der text in max_w × max_h passt."""
    size = start
    while True:
        font = regular(ImageFont.truetype(str(path), size))
        l, t, r, b = font.getbbox(text)
        if (r - l <= max_w and b - t <= max_h) or size <= 12:
            return font
        size = int(size * 0.92)


def clip(text, font, max_w):
    """text mit … kürzen, bis er in max_w passt."""
    while font.getlength(text) > max_w and len(text) > 1:
        text = text[:-2].rstrip(" ·,") + "…"
    return text


def centered(draw, box, text, font, fill):
    """text optisch (nach Glyphen-Box) in box zentrieren."""
    x0, y0, x1, y1 = box
    l, t, r, b = draw.textbbox((0, 0), text, font=font)
    draw.text(((x0 + x1 - (r - l)) / 2 - l, (y0 + y1 - (b - t)) / 2 - t), text, font=font, fill=fill)


def font_card(n, path):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    hero = n.get("heroletter") or "Aa"
    centered(d, (60, 60, 600, 570), hero, fit(path, hero, 520, 440, 420), n.get("accent") or INK)
    title = fit(path, n["title"], 500, 110, 96)
    d.text((640, 250), n["title"], font=title, fill=INK, anchor="ls")
    meta = " · ".join(str(x) for x in [(n.get("tags") or [None])[0], n.get("author"), n.get("year")] if x)
    small = ImageFont.truetype(UI, 28)
    d.text((640, 310), clip(meta, small, 500), font=small, fill=MUTED, anchor="ls")
    d.text((640, 560), NAME, font=ImageFont.truetype(UI, 26), fill=MUTED, anchor="ls")
    return img


def home_card(nodes, paths):
    """Startseite: Name plus je ein Heroletter pro Kategorie in deren Schrift und Akzentfarbe."""
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    centered(d, (0, 90, W, 230), NAME, fit(UI, NAME, 1000, 120, 96), INK)
    picks = []
    for cat in ["Serif", "Sans", "Monospace", "Display", "Script", "Blackletter"]:
        n = next((n for n in nodes if (n.get("tags") or [None])[0] == cat and n["slug"] in paths), None)
        if n:
            picks.append(n)
    step = (W - 120) / max(len(picks), 1)
    for i, n in enumerate(picks):
        hero = n.get("heroletter") or "Aa"
        x0 = 60 + i * step
        centered(d, (x0, 290, x0 + step, 520), hero, fit(paths[n["slug"]], hero, step - 30, 200, 200), n.get("accent") or INK)
    return img


def main():
    nodes = json.loads((SITE / "fonts.json").read_text())
    paths = faces()
    OUT.mkdir(exist_ok=True)
    for n in nodes:
        if n["slug"] in paths:
            font_card(n, paths[n["slug"]]).save(OUT / f"{n['slug']}.png", optimize=True)
    home_card(nodes, paths).save(OUT / "index.png", optimize=True)
    print(f"og-images: {len(nodes) + 1} Bilder")


main()

# Schriftsammlung

Raster aus Schriften (Name + „Aa"); Klick öffnet eine Vollbild-Detailansicht mit Specimen Postern.

- Vertikal scrollen: nächste/vorherige Schrift
- Horizontal scrollen: Karte 1 Name + „Aa", 2 Poster Zeichensatz, 3 Poster Schnitte/Fließtext, 4 Infos (Punkte unten zeigen die aktuelle)
- × oder Esc schließt die Detailansicht

## Ausprobieren

```
npm install
npm run build
python3 server.py        # http://localhost:8000
```

(Ein einfacher `http.server` genügt nicht, weil Adressen wie `/bodoni` auf `index.html` zurückfallen müssen.)

## Schrift hinzufügen

Ordner `src/webfonts/<kategorie>/<Familie>/` mit `.woff2`-Dateien und optional `meta.yaml` anlegen, dann `npm run build`.

## Adressen

- `/` – Raster
- `/bodoni` – Detailansicht, `/bodoni#3` – Detailkarte 3

## GitHub Pages

`npm run build:pages` (Basispfad `/font-collection/`), Ergebnis in `_site/`.

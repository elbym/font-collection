# Schriftsammlung

Raster aus Schriften (Name + „Aa"); Klick öffnet eine Vollbild-Detailansicht mit Specimen Postern.

- Vertikal scrollen: nächste/vorherige Schrift
- Horizontal scrollen: Karte 1 Name + „Aa", 2 Poster Zeichensatz, 3 Poster Schnitte/Fließtext, 4 Infos (Punkte unten zeigen die aktuelle); die Karte bleibt beim Wechsel der Schrift gleich
- Hell/Dunkel folgt dem System; die Schriftfarbe dient nur als Akzent
- × oder Esc schließt die Detailansicht

## Ausprobieren

```
npm install
npm run dev              # baut, startet Watch und Server: http://localhost:8000
```

Port ändern: `PORT=8010 npm run dev`. Nur bauen und ausliefern: `npm run build && python3 server.py`. Ein einfacher `http.server` genügt nicht, weil Adressen wie `/bodoni` auf `index.html` zurückfallen müssen.

## Schrift hinzufügen

Ordner `src/webfonts/<kategorie>/<Familie>/` mit `.woff2`-Dateien und optional `meta.yaml` (`title`, `tags`, `fontauthor`, `fontyear`, `color`, `heroletter`, `license`, `url`, `comment`) anlegen, dann `npm run build` (bzw. `npm run dev` läuft im Watch weiter).

## Adressen

- `/` – Raster
- `/bodoni` – Detailansicht, `/bodoni#3` – Detailkarte 3

## GitHub Pages

`npm run build:pages` (Basispfad `/font-collection/`), Ergebnis in `_site/`; `npm run deploy` pusht `_site/` auf den Branch `gh-pages` von `origin` (Force-Push, vorher `origin` prüfen). Details in `CLAUDE.md`, Migrationsplan in `plan.md`.

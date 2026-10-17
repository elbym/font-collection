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

## Struktur und Konventionen

```
index.html               # Seitengerüst (statisch, Basispfad per scripts/set-base.js)
src/_data/               # 11ty-CMS: fonts.js, fontsJson.js, fontFaces.js, fontAxes.js, fontCodepoints.js, site.json
src/*.njk                # fonts.json und fonts.css
src/css/                 # tailwind.css (Einstieg, scannt index.html und src/assets/js), app.css (View Transitions, Akzent)
src/assets/js/           # main.js (Einstieg), state.js (geteilter Zustand), modules/, utils/
scripts/                 # build-js.js (esbuild), dev.js, set-base.js
```

- ES-Module mit `// @ts-check` und JSDoc; keine Globals, geteilter Zustand nur in `state.js`.
- Ein Feature = ein Modul in `modules/` mit `init(root = document)`, das selbst prüft, ob sein Ziel-Element existiert.
- Reine Hilfsfunktionen liegen in `utils/` und haben einen Test (`*.test.js` daneben).
- Tailwind-Klassen in JS-Template-Strings vollständig ausschreiben (Scan per `@source`).
- Eleventy rendert keine Seiten, es ist nur das CMS; Filter, Shortcodes und Partials gibt es deshalb nicht.

### Neues JS-Modul

1. `src/assets/js/modules/<name>.js` anlegen: `// @ts-check`, `export function init(root = document)`, frühes `return`, wenn das Ziel-Element fehlt.
2. In `main.js` importieren und `init…()` aufrufen (Router zuletzt).
3. Reine Logik in `utils/` auslagern und mit Vitest testen.

### Neue Detailkarte

Neue Datei in `modules/cards/`, in `cards/index.js` in `CARDS` eintragen und `DETAILS` in `state.js` erhöhen.

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | baut, startet Eleventy-, Tailwind-, esbuild-Watch (Sourcemap) und Server |
| `npm run build` | 11ty + Tailwind + minifiziertes JS-Bundle + Basispfad nach `_site/` |
| `npm run lint` / `npm run format` | ESLint / Prettier |
| `npm test` | Vitest |
| `npm run clean` | `_site/` löschen |

## Adressen

- `/` – Raster
- `/bodoni` – Detailansicht, `/bodoni#3` – Detailkarte 3

## GitHub Pages

`npm run build:pages` (Basispfad `/font-collection/`), Ergebnis in `_site/`; `npm run deploy` pusht `_site/` auf den Branch `gh-pages` von `origin` (Force-Push, vorher `origin` prüfen). Details in `CLAUDE.md`, Migrationsplan in `plan.md`.

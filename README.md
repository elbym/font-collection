# Persönliche Sammlung von freien Schriftarten

    Jeder hat doch eine Lieblingsschriftart, oder? ODER!?

Dies ist lediglich eine persönliche und subjektive Sammlung von Schriftarten, die mir im Gedächtnis geblieben sind, und begann als Vorwand, um den font_specimen_generator.py (den ich Claude gebeten hatte, zusammenzubasteln) vorzuführen. Stattdessen bin ich zu einer HTML-Vorschau gewechselt.

Diese Liste ist auch beeinflusst von Teuderun und Free Font Library

## Ausprobieren

```
npm install
npm run dev              # baut, startet Watch und Server: http://localhost:8000
```

Port ändern: `PORT=8010 npm run dev`. Nur bauen und ausliefern: `npm run build && python3 server.py`. Ein einfacher `http.server` genügt nicht, weil Adressen wie `/bodoni` auf `index.html` zurückfallen müssen.

## Schrift hinzufügen

1. **Ordner anlegen:** `src/webfonts/<kategorie>/<Familie>/`. Der Ordner ist nur ein Container und hat keinen Einfluss auf die URL (die kommt vom `slug`).
2. **`.woff2`-Dateien ablegen:** Namensschema `Familie_Gewicht.woff2`, z. B. `Jost_Regular.woff2`, `Jost_Bold.woff2`, `Jost_BoldItalic.woff2`. Gewicht und Stil kommen aus dem Dateinamen.
   Variable Schriften: Der Dateiname enthält `Variable`, ein `_vf`-Suffix oder eine Achsenliste in eckigen Klammern, z. B. `[wght]`, `[opsz,wght]`, `[MONO,CASL,wght,slnt,CRSV]`. Beliebige vierstellige Achsen-Tags sind erlaubt, nicht nur die registrierten. Sie bekommen auf Detailkarte 1 Slider.
3. **`meta.yaml` anlegen** (optional): `tags` ist die wichtigste Angabe, der erste Tag ist die Kategorie.
   ```yaml
   title: Meine Schrift
   tags: Sans, Humanist Sans
   ```
4. **Bauen:** `npm run build` (bzw. `npm run dev` läuft im Watch weiter). Die Schrift erscheint im Raster und unter `/<slug>`.

| Feld | Beispiel | Wirkung |
| --- | --- | --- |
| `title` | `Meine Schrift` | Anzeigename |
| `tags` | `Sans, Humanist Sans` | erster Tag = Kategorie, alle Tags dienen als Filter |
| `color` | `steelblue` | Akzentfarbe (CSS-Farbname) |
| `heroletter` | `Aa` | Zeichen(e) im großen Hero auf Poster A |
| `fontauthor` | `Rasmus Andersson` | Gestalter |
| `fontyear` | `2017` | Erscheinungsjahr |
| `license` | `SIL Open Font License 1.1` | überschreibt die Auto-Erkennung aus `OFL.txt`/`LICENSE.txt` |
| `url` | `https://…` | Projekt- bzw. Quelllink |
| `comment` | `Hinweis` | Notiz auf der Infokarte |

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

## Lizenz

Der Quellcode steht unter der [MIT-Lizenz](LICENSE). Die Schriftdateien unter `src/webfonts/` sind davon ausgenommen und stehen unter den Lizenzen ihrer jeweiligen Urheber (meist SIL Open Font License 1.1).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Schriftsammlung als Raster aus Kacheln (Name + „Aa"), Klick öffnet eine Vollbild-Detailansicht mit Specimen Postern. UI ist die eine Datei `index.html`; **11ty ist nur das technische CMS** (erzeugt `fonts.json`, `fonts.css`, kopiert Schriften). Kein Linter, keine Tests. Tailwind v4 per CLI. Sprache der UI und Kommentare: Deutsch.

Befehle: `npm install`, `npm run build` (11ty + Tailwind + Basispfad, Ausgabe `_site/`), `npm run dev` (Watch), `python3 server.py` (Port 8000 oder `PORT=…`; liefert `_site/`, Fallback auf `index.html` für Pfade wie `/bodoni`; `--prefix /font-collection` simuliert GitHub Pages). Zugriff vom Smartphone über die Rechner-IP im selben WLAN.

## Schriften pflegen (11ty-CMS)

- Schrift hinzufügen = Ordner `src/webfonts/<kategorie>/<Familie>/` mit `.woff2` und optional `meta.yaml` (`title`, `tags` – erster Tag = Kategorie, `fontauthor`, `fontyear`, `color`, `heroletter`, `comment`, `url`, `license`). Gewicht/Stil kommen aus den Dateinamen. Details: `src/_data/fonts.js` (aus dem Vorlageprojekt `font-collection` übernommen; Konventionen stehen in dessen CLAUDE.md).
- `src/fonts.json.njk` (Daten aus `src/_data/fontsJson.js`) → `/fonts.json`: pro Schrift `slug`, `title`, `family` (CSS-Familie `f-<slug>`), `accent`, `tags`, `author`, `year`, `license`, `source`, `comment`, `heroletter`, `weights`, `variable`, `glyphs`. `src/fonts.css.njk` → `/fonts.css` (ein `@font-face` pro Datei und Stil; lädt erst bei Gebrauch).
- `color` ist nur Akzentfarbe (`--accent`, in `.acc` zu `--accent-ui` für hell/dunkel abgeleitet); Hintergründe folgen `prefers-color-scheme`.

## Architektur

Rasterübersicht aus Kacheln unter einer Top-Bar (`#topbar`, Slot `#tools` für spätere Filter/Sortierung), Klick öffnet eine Vollbild-Detailansicht.

- **Daten:** `nodes` kommt per `fetch('fonts.json')`; `DETAILS = 4`. Raster-Kacheln und Detailkarten werden beide daraus per JS erzeugt.
- **Karten:** `CARDS = [card1, card2, card3, card4]`, je ein Block in `index.html`: 1 Name + „Aa" (auch Kachel), 2 Poster A (Zeichensatz), 3 Poster B (Schnitte/Waterfall/Fließtext), 4 Infos. Posterkarten sind `container-type:size`, Größen in `cqw`/`cqh`, nie scrollen.

- **Kachel = verkleinerte Detailkarte 1:** `content(n, c)` wählt `CARDS[c]` und liefert das Markup für beide (Kachel nutzt Karte 1), mit Größen in `em` (Karte: `text-base`/`sm:text-[1.25rem]`, Kachel: `font-size:5cqw` in einem `container-type:inline-size`-Button). Neue Inhalte in `card1` ergänzen, nicht getrennt in Kachel und Karte; damit sie morphen, `data-vt="…"` setzen.
- **Detailansicht:** Natives `<dialog id="detail">` ist der vertikale Scroll-Container (CSS `scroll-snap`). Jeder Node ist eine `.row` (`h-dvh`, horizontaler Snap-Container) mit `DETAILS` Karten. Vertikal = Node wechseln, horizontal = Detailkarte wechseln.
- **Spalten-Sync:** Beim Wechsel zu einem anderen Node soll dieselbe Detailkarte sichtbar bleiben. Ein Capture-`scroll`-Listener auf `#cards` setzt (debounced, 100 ms) `scrollLeft` aller anderen Rows nach. Der Punkt-Indikator (`#dots`, `setDot`) folgt dem Scrollen ohne Debounce.
- **Übergang Kachel ↔ Karte:** View Transitions API. Kachel bzw. sichtbare Karte bekommt kurz `view-transition-name: node`, ihre `[data-vt]`-Kinder `node-<vt>` (Helfer `name()`; so morphen Titel/Label/Text einzeln statt zu überblenden), `transition(dir, fn)` setzt `html[data-dir]` auf `open`/`close`. Die Eckenrundung wird im `<style>`-Block über `::view-transition-image-pair(node)` und das Keyframe `radius` animiert (Wert muss zum `rounded-2xl` der Kachel passen). Die Kachel hat bewusst keinen Schatten und nur `transition-transform`: der Übergang clippt am Radius, ein Schatten würde am Ende hineinspringen (Flackern). Ohne API-Support wird ohne Animation umgeschaltet. Esc läuft über das `cancel`-Event ebenfalls durch `go(BASE)`.
- **Routing:** `/<slug>#<n>` = Node mit `slug` (Feld in `fonts.json`), Detailkarte `n` (1-basiert); `/` = Raster. `route()` liest die URL und ist der einzige Weg, die Ansicht zu ändern: Aktionen rufen `go(url)` (pushState + `route()`), `popstate` ruft `route()`. Beim Scrollen zieht `syncUrl()` die URL per `replaceState` nach. `BASE` (aus `<base href>`) ist der Basispfad: `/` lokal, `/font-collection/` auf GitHub Pages. Alle Asset-URLs sind relativ.

## Deployment (GitHub Pages)

`npm run build:pages` baut mit `BASE_PATH=/font-collection/` (`scripts/set-base.js` setzt `<base href>` in `index.html` und erzeugt `404.html` als Kopie, damit Direktaufrufe wie `/font-collection/bodoni#2` auf Pages funktionieren). `npm run deploy` pusht `_site/` auf `gh-pages` des `origin` (Force-Push – vorher prüfen, dass `origin` auf das richtige Repo zeigt). Das neue Repo ersetzt das alte `elbym/font-collection`; Vorgehen dafür steht in `plan.md` (S11, Schritt 0).

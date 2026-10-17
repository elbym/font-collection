# plan.md – Migration der Schriften aus `font-collection` nach `font-collection-2`

Quelle: `/home/elby/repos/font-collection` (11ty 3 + Gulp + SCSS, ~100 Schriften, 519 `.woff2`, 58 MB)
Ziel: `/home/elby/repos/font-collection-2` (`index.html`, Tailwind, Raster → Vollbild-Detailansicht mit Snap-Scrolling)

## Zielbild

| Ansicht | Inhalt |
|---|---|
| Top-Bar (nur Übersicht) | fixierte Leiste oben, vorerst Titel; Platz (leerer Slot) für spätere Filter und Sortierungen |
| Übersicht (Kachel = verkleinerte Detailkarte 1) | nur **Name der Schrift** und **„Aa"**, beides in der Schrift selbst gesetzt; Hintergrund hell/dunkel nach System (Light/Dark-Mode), die Schriftfarbe ist nur **Akzent** (großes „Aa", Trenner, Linien) |
| Detailkarte 1 | wie Kachel, groß |
| Detailkarte 2 | **Specimen Poster A** – Zeichensatz (großes „Aa", Alphabet, Ziffern, Satzzeichen) |
| Detailkarte 3 | **Specimen Poster B** – Schnitte/Waterfall, Pangramm, Fließtext |
| Detailkarte 4 | Infos: Designer, Jahr, Lizenz, Tags, Quelle, Kommentar (Annahme, da nicht vorgegeben; `DETAILS` bleibt 4) |

## Entscheidungen

- **11ty bleibt – als reines technisches CMS.** Es gibt keine bessere Alternative: `src/_data/fonts.js` (547 Zeilen: Ordner scannen, Gewicht/Stil aus Dateinamen, `meta.yaml`, Lizenz-Erkennung, Variable-Axes) ist die eigentliche Pflege-Logik und läuft unverändert. Jede Alternative (Astro, eigenes Skript) hieße diese Logik neu schreiben. 11ty rendert **keine Seiten**, sondern erzeugt nur `fonts.json`, `fonts.css`, kopiert `index.html` und die `.woff2`. UI, View Transitions und Routing bleiben in `index.html`.
- **Schriften pflegen = Ordner + `meta.yaml` anlegen** (Konvention wie in der Vorlage, siehe deren `CLAUDE.md` Abschnitte „Font folder naming" / „meta.yaml fields"). Kein Eintrag im Code.
- **Kein Lazy-Loader nötig:** Ein `@font-face` lädt die Datei erst, wenn sie benutzt wird. Eine einzige `fonts.css` mit allen Deklarationen genügt; die Kachel lädt nur den genutzten Schnitt.
- **Farben:** Hintergrund und Text folgen `prefers-color-scheme` (Tailwind `dark:`, kein Umschalter). `color` aus `meta.yaml` (bzw. deterministisch erzeugt) ist ausschließlich Akzentfarbe, bereitgestellt als CSS-Variable `--accent` pro Karte/Kachel. Der Akzent muss auf hellem und dunklem Grund lesbar bleiben (siehe S6).
- **Pfade:** Alle Asset-URLs sind relativ und lösen über `<base href>` auf; der Basispfad wird nur beim Deployment gesetzt (S11). Lokal ist er `/`.
- **Tailwind:** bleibt. Play-CDN nur für die Entwicklung, für den Build Tailwind CLI v4 (wie in der Vorlage). SCSS/Gulp werden **nicht** übernommen.
- **Bewusst nicht migriert** (YAGNI): Suche (Pagefind), Vergleich, Netzwerk-Graph, 3D-Würfel, Alternativen, Tag-Seiten, Sitemap, `llms.txt`, Gulp, SCSS, Python-Generatoren, Border-SVGs, Hintergrundbilder, Galerie, `webfonts_disabled/`. Bei Bedarf einzeln nachziehen.

## Zielstruktur

```
eleventy.config.js
package.json
index.html            # wird 1:1 nach _site/ kopiert (Passthrough)
server.py             # liefert _site/, Fallback auf index.html
src/
  _data/fonts.js  site.json  fontCodepoints.js
  fonts.json.njk      # → /fonts.json
  fonts.css.njk       # → /fonts.css
  css/tailwind.css    # Tailwind-v4-Eingang
  webfonts/<kategorie>/<Familie>/*.woff2  meta.yaml
```

Hinweis: Die Eingabequelle für 11ty ist `src/`; `index.html` liegt im Root und wird per `addPassthroughCopy` übernommen (kein Verschieben nötig).

## Ablauf und Abhängigkeiten

```
S1 → S2 → S3 → S4 → S5 → S6 ─┬→ S6a (Top-Bar)
                              ├→ S7  (Poster A)
                              ├→ S8  (Poster B)
                              ├→ S9  (Karte 4 Infos)
                              └→ S10 (Tailwind-Build)
                                   ↓ (alle)
                                  S11 → S12
```

S6a und S7–S10 sind voneinander unabhängig und können parallel laufen, **wenn** jeder nur seinen Bereich in `index.html` anfasst (S6a: Top-Bar-Markup und Abstände von `#grid`; S7–S9: je ein Karten-Block, siehe S6).
Jeder Schritt: eigener Commit über `git-worker`, Abnahmekriterien müssen erfüllt sein, bevor der Schritt als erledigt gilt.

---

## S1 – 11ty-Gerüst

**Ziel:** `npx @11ty/eleventy` läuft leer durch.
**Tun:**
1. `package.json` anlegen (`private: true`), devDependencies aus der Vorlage: `@11ty/eleventy`, `js-yaml`, `chroma-js`, `fontkit` (Versionen aus `/home/elby/repos/font-collection/package.json`). Scripts: `"build": "eleventy"`, `"dev": "eleventy --watch"`.
2. `eleventy.config.js` (CommonJS, wie `.eleventy.js` der Vorlage, aber minimal): `dir: { input: "src", output: "_site" }`, `addPassthroughCopy({ "index.html": "index.html", "src/webfonts": "webfonts" })` (nur `.woff2` ist nötig, Rest stört nicht). **Keine** Filter aus der Vorlage übernehmen.
3. `.gitignore`: `node_modules/`, `_site/`.
4. `server.py`: Serverwurzel auf `_site/` (`os.chdir` auf das Verzeichnis neben dem Skript + `_site`); Fallback-Logik bleibt.

**Abnahme:** `npm install && npm run build` endet ohne Fehler, `_site/index.html` existiert und ist identisch zur Root-`index.html`.

## S2 – Datenlayer übernehmen

**Ziel:** `fonts.js` liefert dieselben Knoten wie in der Vorlage.
**Tun:**
1. Kopieren aus `/home/elby/repos/font-collection/src/_data/`: `fonts.js`, `site.json`, `fontCodepoints.js`. Nicht kopieren: alle anderen `_data`-Dateien.
2. `site.json` auf das Nötige kürzen: `randomColors`, `panagram`, `paragraph`, `heroword`, `heroletter`.
3. Pfade in `fonts.js`/`fontCodepoints.js` prüfen (lesen `../webfonts` relativ zu `__dirname` → passt, wenn `src/webfonts` existiert). Nicht umbauen, außer es bricht.

**Abnahme:** `node -e "console.log(Object.keys(require('./src/_data/fonts.js')()))"` läuft ohne Fehler (nach S3 mit Daten).

## S3 – Schriften kopieren

**Ziel:** Alle Schriftdateien liegen im neuen Projekt.
**Tun:**
1. `rsync -a --include='*/' --include='*.woff2' --include='*.woff' --include='meta.yaml' --include='OFL*.txt' --include='LICENSE*' --exclude='*' /home/elby/repos/font-collection/src/webfonts/ src/webfonts/`
2. Danach prüfen: `find src/webfonts -name '*.woff2' | wc -l` ≈ 519; `webfonts_disabled/` der Vorlage **nicht** anfassen.
3. Repo-Größe (~58 MB) ist akzeptiert; falls nicht gewünscht, Rückfrage statt Git-LFS einzuführen.

**Abnahme:** Dateianzahl stimmt mit der Vorlage überein; S2-Abnahme-Befehl liefert Knoten mit `title`, `tags`, `ownFonts`.

## S4 – `fonts.json` erzeugen

**Ziel:** `_site/fonts.json` enthält pro Schrift genau die Felder, die die UI braucht.
**Tun:**
1. `src/fonts.json.njk` mit `permalink: fonts.json`, Ausgabe per `{{ ... | dump | safe }}` aus einer kleinen Datenfunktion (z. B. Frontmatter-JS `eleventyComputed` oder zusätzliche `src/_data/fontsJson.js`, die `fonts().list` auf Blätter (`isLeaf`) filtert und mappt).
2. Pro Schrift: `slug` (letztes Segment von `url` bzw. `key`, URL-sicher, eindeutig – bei Kollision Fehler werfen), `title`, `family` (CSS-Familienname `f-<slug>`), `accent` (= `colorHex`), `tags`, `category`, `author` (`fontauthor`), `year`, `license`, `source` (`sourceUrl`), `comment`, `heroletter`, `heroword`, `weights` (sortierte Liste `{weight, italic}` aus `ownFonts`), `variable` (bool), `glyphs` (Codepoints als Array aus `fontCodepoints`, oder `null` = alle vorhanden).
3. Sortierung alphabetisch nach `title`.

**Abnahme:** `_site/fonts.json` ist gültiges JSON (`node -e "JSON.parse(require('fs').readFileSync('_site/fonts.json'))"`), Anzahl Einträge = Anzahl Blatt-Knoten der Vorlage, alle `slug` eindeutig.

## S5 – `fonts.css` erzeugen

**Ziel:** Jede Schrift ist per `font-family: <family>` nutzbar.
**Tun:**
1. `src/fonts.css.njk` (`permalink: fonts.css`) erzeugt pro Datei in `ownFonts` ein `@font-face`: `font-family: f-<slug>`, `src: url(webfonts/<pfad>.woff2) format("woff2")`, `font-weight` (bei Variable Fonts den Bereich `min max` aus `fontVariableAxes.js` der Vorlage – nur wenn nötig übernehmen, sonst Gewicht aus Dateiname), `font-style`, `font-display: swap`.
2. Pfade **relativ** zu `fonts.css` (`url(webfonts/<pfad>.woff2)`, ohne führendes `/`), damit die Datei unter jedem Basispfad funktioniert.

**Abnahme:** `_site/fonts.css` enthält für jede Datei einen Block; ein Stichproben-`url(...)` zeigt auf eine existierende Datei in `_site/webfonts/`.

## S6 – `index.html` auf Schriftdaten umstellen (Grundgerüst der Karten)

**Ziel:** Raster zeigt alle Schriften als Kachel „Name + Aa"; Detailansicht hat 4 Karten, deren Inhalt in je einer eigenen Funktion steckt.
**Tun:**
1. `<base href="/">` in den `<head>` (wird in S11 beim Deployment überschrieben), `<link rel="stylesheet" href="fonts.css">` einfügen; Dummy-`nodes` ersetzen durch `const nodes = await (await fetch('fonts.json')).json()` (Script `type="module"` oder IIFE). `slug`-Feld bleibt Routing-Schlüssel.
2. `bg()` entfällt. Kachel und Karten bekommen neutrale Flächen (`bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50`). Die Akzentfarbe kommt als `style="--accent:${n.accent}"` an Kachel/Karte und wird über `text-(--accent-ui)`, `border-(--accent-ui)`, `bg-(--accent-ui)` benutzt. Lesbarkeit: `--accent-ui` = `color-mix(in oklab, var(--accent), white 25%)` im Dark-Mode, `color-mix(in oklab, var(--accent), black 15%)` im Light-Mode (zwei Zeilen CSS im `<style>`-Block).
3. `content(n, c)` wird zum Dispatcher auf `CARDS[c](n)`; `CARDS = [card1, card2, card3, card4]`. Jede Funktion steht in einem eigenen, mit Kommentar markierten Block, damit S7–S9 parallel nur ihren Block ändern:
   - `card1(n)`: Name (`style="font-family:n.family"`, `data-vt="title"`) und „Aa" in Akzentfarbe (`data-vt="aa"`, sehr groß), dazu ein Trenner in Akzentfarbe. Sonst nichts – das ist auch die Kachel.
   - `card2`, `card3`, `card4`: Platzhalter (Titel + Nummer).
4. `DETAILS = 4`. Kachel zeigt weiterhin `card1`; Größen in `em`/`cqw`, Morph-Verhalten unverändert (CLAUDE.md „Kachel = verkleinerte Detailkarte 1").
5. Beim Rendern der Kacheln keine weiteren Schriftschnitte anfordern (nur `font-weight: 400`, falls vorhanden, sonst den nächstliegenden Schnitt – `@font-face` regelt das).

**Abnahme:** `python3 server.py`, `/` zeigt alle Schriften in hell und (Systemeinstellung umgestellt) dunkel, „Aa" in der jeweiligen Akzentfarbe; Klick öffnet Detailansicht mit View Transition; `/<slug>#2` lädt direkt; im Netzwerk-Tab laden nur die für sichtbare Kacheln nötigen `.woff2` (kein Massen-Download aller 519 Dateien). CLAUDE.md-Routing-/Sync-Verhalten unverändert.

## S6a – Top-Bar

**Ziel:** Feste Leiste über dem Raster mit Platz für spätere Filter und Sortierungen.
**Tun:**
1. In `index.html` vor `#grid`: `<header id="topbar" class="sticky top-0 z-20 ...">` mit Seitentitel links und einem leeren Container `<div id="tools" class="ml-auto flex items-center gap-2"></div>` als Slot. Halbtransparenter Hintergrund mit `backdrop-blur` (hell/dunkel), untere Linie in neutraler Farbe.
2. **Keine** Filter oder Sortierung implementieren (YAGNI), nur den Slot und einen Kommentar, dass hier Bedienelemente eingehängt werden und `nodes` vor dem Rendern gefiltert/sortiert werden kann.
3. Die Top-Bar gehört nur zur Übersicht: das modale `<dialog>` deckt sie ab. Kacheln bekommen `scroll-mt-<Höhe der Leiste>`, damit `tile.scrollIntoView` beim Schließen die Kachel nicht unter der Leiste platziert.

**Abnahme:** Leiste bleibt beim Scrollen oben, ist in Light und Dark lesbar, die Öffnen/Schließen-Animation flackert nicht, die Kachel liegt nach dem Schließen sichtbar unterhalb der Leiste.

## S7 – Specimen Poster A (Detailkarte 2): Zeichensatz

**Ziel:** `card2(n)` ist ein eigenständiges Plakat.
**Inhalt:** Name klein oben + Designer/Jahr; riesiges „Aa" (oder `heroletter` falls gesetzt); darunter Alphabet Groß/Klein, Ziffern 0–9, Satzzeichen/Sonderzeichen (Zeichenbereiche wie `unicodeRanges.js`/`abc_upper` etc. der Vorlage). Zeichen, die laut `n.glyphs` fehlen, auslassen.
**Regeln:** Karte wird `container-type:size`; alle Größen in `cqw`/`cqh`, damit das Plakat auf Handy und Desktop gleich komponiert ist (Hochformat-Komposition, auf breiten Screens zentriert mit Seitenrändern). Hintergrund hell/dunkel (Tailwind `dark:`); `--accent-ui` nur für Akzente: großes „Aa", Trenner, Linien, Beschriftungen. Nur Tailwind-Klassen plus ggf. Inline-`style` für `cqw`-Werte. Alle Elemente mit Text bekommen `font-family: n.family`.
**Nur ändern:** Block `card2` in `index.html`.
**Abnahme:** Bei 3 Schriften (Serif, Mono, Blackletter) und bei 390×844 sowie 1440×900: kein Überlauf/Scrollen innerhalb der Karte, kein abgeschnittener Text, fehlende Glyphen erzeugen keine Tofu-Kästchen.

## S8 – Specimen Poster B (Detailkarte 3): Schnitte und Fließtext

**Ziel:** `card3(n)` ist ein zweites, andersartig komponiertes Plakat.
**Inhalt:** Pangramm (`site.panagram`, in `fonts.json` oder fest eingebettet) in mehreren Größen (Waterfall, z. B. 72/48/32/24/16 px-äquivalent in `cqw`); eine Zeile pro vorhandenem Schnitt (`n.weights`, Name des Schnitts + Beispielwort, kursiv wenn `italic`); kurzer Fließtext (`site.paragraph` gekürzt) in Spalten oder einer Textspalte. Bei `variable`: Gewicht-Verlauf (`font-weight` 100 → 900 als Zeilen).
**Regeln:** wie S7 (container units, Tailwind, `n.family`, Hintergrund hell/dunkel, Akzent über `--accent-ui` für Trenner/Überschriften). Der Inhalt muss bei vielen Schnitten (bis zu 18) in die Karte passen: Zeilenhöhe/Größe aus der Anzahl ableiten oder begrenzen, nie scrollen.
**Nur ändern:** Block `card3` in `index.html`.
**Abnahme:** Wie S7; zusätzlich Test mit der schnittreichsten Schrift (Familie mit den meisten `weights`) und mit einer Schrift mit nur einem Schnitt.

## S9 – Detailkarte 4: Infos

**Ziel:** `card4(n)` zeigt die Metadaten.
**Inhalt:** Name, Designer, Jahr, Lizenz, Tags (als Chips), Quelle (Link, `rel="noopener"`, `target="_blank"`), Kommentar. Fehlende Felder weglassen, keine leeren Labels.
**Regeln:** UI-Text deutsch. Links müssen in der Snap-Scroll-Karte klickbar bleiben.
**Nur ändern:** Block `card4` in `index.html`.
**Abnahme:** Schrift mit allen Feldern und Schrift ohne `meta.yaml` – beide rendern sauber.

## S10 – Tailwind-Build statt Play-CDN

**Ziel:** Produktions-CSS ohne `cdn.tailwindcss.com`.
**Tun:**
1. `@tailwindcss/cli` und `tailwindcss` (v4, Versionen aus der Vorlage) als devDependencies. `src/css/tailwind.css`: `@import "tailwindcss";` plus `@source "../../index.html";`. (Vorlage nutzt `tailwindcss/theme` + `utilities` ohne Preflight, hier **mit** Preflight, da kein eigenes Reset existiert.)
2. npm-Scripts: `"css": "tailwindcss -i src/css/tailwind.css -o _site/tailwind.css --minify"`, `build` = `eleventy && npm run css`, `dev` = Eleventy-Watch + `tailwindcss --watch` parallel (z. B. mit `&` in einem Script, kein zusätzliches Paket).
3. `<script src="cdn.tailwindcss.com">` in `index.html` durch `<link rel="stylesheet" href="tailwind.css">` (relativ) ersetzen; ponytail-Kommentar dort entfernen.
4. Hinweis beachten: Das Play-CDN ist Tailwind v3-Verhalten mit anderen Defaults als v4 (u. a. Border-/Ring-Defaults). Nach Umstellung Raster, Kacheln, Dialog und Punkte (hell und dunkel) visuell gegen den Stand vorher prüfen.

**Abnahme:** `npm run build` erzeugt `_site/tailwind.css`; die App sieht im Browser unverändert aus; im Netzwerk-Tab keine Anfrage an `cdn.tailwindcss.com`. **Konflikt-Hinweis:** S10 ändert nur `<head>`; S7–S9 nur ihre Blöcke – trotzdem nach dem Merge Tailwind neu bauen, weil neue Klassen aus S7–S9 erfasst werden müssen.

## S11 – Deploy auf GitHub Pages (Basispfad konfigurierbar)

**Ziel:** Dieselbe Quelle läuft lokal unter `/` und auf GitHub Pages unter `/font-collection/` (Repo `elbym/font-collection`, URL `https://elbym.github.io/font-collection/`).
**Tun:**
0. **Bestehendes Repo ablösen (nur nach ausdrücklicher Freigabe des Nutzers, nicht durch den Agenten):** Das alte `elbym/font-collection` (11ty-Vorlage, `gh-pages` mit dem alten Auftritt) wird ersetzt. Empfohlene Reihenfolge, damit nichts verloren geht: (a) altes Repo auf GitHub in z. B. `font-collection-11ty-archiv` umbenennen (Verlauf und Stand bleiben erhalten; dessen Pages-Auftritt sollte danach abgeschaltet werden), (b) neues Repo `elbym/font-collection` anlegen, (c) lokal `git remote add origin git@github.com:elbym/font-collection.git` und `main` pushen, (d) in den Repo-Einstellungen Pages auf Branch `gh-pages` stellen. Die Alternative „Force-Push auf das alte Repo" löscht den alten Verlauf und wird nicht empfohlen. Folge: Alte Adressen wie `…/font-collection/serif.html` gibt es nicht mehr; Adressen der Form `…/font-collection/<slug>` ersetzen sie. Das lokale Vorlageverzeichnis `/home/elby/repos/font-collection` bleibt unangetastet.
1. **Basispfad per Umgebungsvariable:** `BASE_PATH` (Default `/`, mit führendem und abschließendem Slash). Ein kleines Skript `scripts/set-base.js` (ca. 5 Zeilen, nur `fs`) ersetzt in `_site/index.html` und `_site/404.html` den Text `<base href="/">` durch `<base href="${process.env.BASE_PATH}">`. npm-Scripts: `"build"` = Eleventy + Tailwind (Basis `/`), `"build:pages"` = `BASE_PATH=/font-collection/ npm run build && node scripts/set-base.js`. Kein sed (Quoting, BSD/GNU-Unterschiede).
2. **Pfadregeln in `index.html`** (Voraussetzung: S4/S5/S6/S10 haben alle Asset-URLs relativ gemacht): `fetch('fonts.json')`, `fonts.css`, `tailwind.css`, `webfonts/…` lösen über `<base>` auf. **Routing** (`route()`, `go()`, `syncUrl()`, Klick-Handler) arbeitet bisher mit absoluten Pfaden `/<slug>`: eine Konstante `const BASE = new URL(document.baseURI).pathname` einführen; URLs bauen als `BASE + slug + '#' + n`; in `route()` den Slug als `location.pathname.slice(BASE.length)` lesen; `go('/')` → `go(BASE)`. Keine weiteren Stellen mit hartem `/`.
3. **Direktaufruf (`/font-collection/bodoni#2`):** GitHub Pages kennt den Pfad nicht und liefert `404.html`. Deshalb `404.html` = Kopie von `index.html` (Passthrough in `eleventy.config.js`) und `.nojekyll` nach `_site/`. Wichtig: `<base>` muss in `404.html` ebenfalls ersetzt werden (siehe 1.).
4. **Veröffentlichen:** `_site/` auf den Branch `gh-pages` pushen (Vorgehen wie im `notes.md` der Vorlage: `cd _site && git init && git add -A && git commit -m deploy && git push <remote> HEAD:gh-pages --force`) als npm-Script `deploy`, **oder** GitHub-Actions-Workflow mit `actions/upload-pages-artifact` + `actions/deploy-pages`. Empfehlung: Script wie in der Vorlage (kein zusätzlicher Workflow). Pushen erst nach Rückfrage beim Nutzer; der Agent baut nur und prüft lokal.
5. **Lokaler Test des Pages-Builds:** `_site` unter dem Unterpfad ausliefern, z. B. `server.py` um optionalen Prefix erweitern oder in einem Temp-Verzeichnis `mkdir -p t/font-collection && cp -r _site/* t/font-collection/` und dort einen Server mit Fallback auf `font-collection/404.html` starten. Einfachste Variante: `server.py` bekommt Argument `--prefix /font-collection` (Pfad abschneiden, Fallback auf `index.html`).

**Abnahme:** `npm run build:pages` erzeugt `_site` mit `<base href="/font-collection/">` in `index.html` und `404.html`; unter dem Prefix funktionieren Raster, Schriften (Netzwerk-Tab: keine 404), Öffnen einer Karte (URL `/font-collection/<slug>#2`), Neuladen auf dieser URL, Zurück-Taste und Esc. `npm run build` (ohne Variable) funktioniert weiterhin unter `/`.

---

## S12 – Doku und Abschlusstest

**Tun:**
1. `CLAUDE.md` und `README.md` anpassen: neue Struktur, Pfade, Befehle (`npm run dev`/`build`, `python3 server.py`), Hinweis „Schrift hinzufügen = Ordner + `meta.yaml`", Beschreibung `CARDS`-Funktionen, `fonts.json`/`fonts.css`. Den Satz „Inhalte nur in `nodes` ändern" ersetzen (Daten kommen jetzt aus dem 11ty-CMS).
2. Abschlusstest im Browser (Claude in Chrome oder manuell), Viewport 390×844 und 1440×900: Raster, Öffnen/Schließen-Morph, horizontales Wechseln der Karten 1–4, vertikales Wechseln der Schrift (gleiche Karte bleibt sichtbar), Direktaufruf, Zurück-Taste, Esc.
3. Stichprobe von 10 Schriften quer durch alle Kategorien (sans, serif, mono, blackletter, script, display, comicsans) auf Poster A/B prüfen: Glyphen vollständig, nichts abgeschnitten.

**Abnahme:** Alle Punkte aus 2 und 3 ohne Konsolenfehler; Liste offener Mängel im Commit/PR notiert.

---

## Offene Annahmen (bei Abweichung bitte korrigieren)

1. Detailkarte 4 = Infos, Karte 1 = Name + „Aa" (Kachel).
2. Die Schriftfarbe der Vorlage (`color` in `meta.yaml` bzw. deterministisch erzeugt) ist nur Akzentfarbe; der Hintergrund folgt dem System (hell/dunkel).
3. Gruppenseiten/Kategorien aus der Vorlage entfallen; das Raster ist eine flache, alphabetisch sortierte Liste mit Top-Bar (Filter/Sortierung später).
4. Das neue Projekt heißt auf GitHub `font-collection` und ersetzt das bestehende Repo gleichen Namens (siehe S11, Schritt 0).

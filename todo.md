# Offene Features

## Schriften-Wunschliste

Lückenanalyse gegen den Bestand (96 Schriften: Serif 34, Sans 33, Script 15, Monospace 8, Blackletter 3, Display 3). Die Spalte **Lücke** begründet, was der Eintrag abdeckt. Neue Kategorie `display/` für Schriften mit `Display` als erstem Tag.

Für keinen Eintrag existiert bisher eine `meta.yaml` — Ausnahmen: `mono/GeistMono/` und `blackletter/FetteFraktur/` haben Ordner samt `meta.yaml`, aber keine Font-Datei.

**Top 3 nach Nutzen pro Aufwand:** Recursive, Courier Prime, IBM Plex Mono.

**Quelle** ist die offizielle Projektseite bzw. das Upstream-Repo (via `METADATA.pb` in `google/fonts` ermittelt), nicht die Google-Fonts-Specimen-Seite — dort liegen die aktuellen Builds, oft neuer als bei Google. Alle URLs am 2026-08-21 auf HTTP 200 geprüft. Einträge mit *(nur GF-Repo)* haben keine unabhängige Projektheimat.


### Monospace

| Schrift | Tags | Fonts | Quelle | Lücke |
|---|---|---|---|---|
| [ ] **Recursive** | `Monospace, Sans, Variable` | ausstehend | https://www.recursive.design | 5 Achsen (MONO, CASL, wght, slnt, CRSV) — der Achsen-Würfel ist von recursive.design inspiriert, die Schrift selbst fehlt |
| [ ] **Courier Prime** | `Monospace, Schreibmaschine` | ausstehend | https://quoteunquoteapps.com/courierprime/ | 8 Mono-Schriften, alle Coding — keine Schreibmaschine |
| [ ] **TeX Gyre Cursor** | `Monospace, Schreibmaschine` | ausstehend | https://www.gust.org.pl/projects/e-foundry/tex-gyre/cursor | Courier-Klon, vervollständigt das vorhandene TeX-Gyre-Set |
| [ ] **IBM Plex Mono** | `Monospace, Coding, Variable` | ausstehend | https://github.com/IBM/plex | Plex Sans + Serif sind da, Mono fehlt |
| [ ] **Source Code Pro** | `Monospace, Coding, Variable` | ausstehend | https://github.com/adobe-fonts/source-code-pro | Source Sans + Serif sind da, Code Pro fehlt |
| [ ] **Libertinus Mono** | `Monospace` | ausstehend | https://github.com/alerque/libertinus | Libertinus Sans + Serif sind da, Mono fehlt |
| [ ] **Geist Mono** | `Monospace, Coding` | Ordner + meta.yaml vorhanden, Font fehlt | https://github.com/vercel/geist-font | `mono/GeistMono/` ist leer |

### Sans

| Schrift | Tags | Fonts | Quelle | Lücke |
|---|---|---|---|---|
| [ ] **Nunito** | `Sans, Rounded, Variable` | ausstehend | https://github.com/googlefonts/nunito *(kein eigenes Projekt, nur GF-Repo)* | 33 Sans und keine echte gerundete (Figtree ist nur leicht abgerundet) |
| [ ] **Quicksand** | `Sans, Geometric, Rounded, Variable` | ausstehend | https://github.com/ThomasJockin/QuicksandFamily | s.o. — geometrisch-gerundet als Gegenpol zu Jost*/Metropolis |
| [ ] **Varela Round** | `Sans, Rounded` | ausstehend | https://fonts.google.com/specimen/Varela+Round *(keine eigene Projektseite; GF-Upstream ist ein Hebräisch-Fork)* | s.o. — kompakte, weiche Grotesk |
| [ ] **Karrik** | `Sans, Grotesk, Reverse Contrast` | ausstehend | https://velvetyne.fr/fonts/karrik/ | Umgekehrter Kontrast fehlt völlig; Velvetyne ist mit Compagnon + Krikikrak schon vertreten |
| [ ] **Vazirmatn** | `Sans, Arabisch, Variable` | ausstehend | https://github.com/rastikerdar/vazirmatn | siehe Abschnitt „Nicht-lateinische Schriften" |

### Serif

| Schrift | Tags | Fonts | Quelle | Lücke |
|---|---|---|---|---|
| [ ] **Zilla Slab** | `Serif, Slab Serif, Clarendon` | ausstehend | https://github.com/mozilla/zilla-slab | Slabs sind da (Arvo, Bitter, Compagnon), aber keine mit Ballenserifen; passt zu Mozilla Text + Headline |
| [ ] **Bevan** | `Serif, Slab Serif, Display` | ausstehend | https://github.com/googlefonts/BevanFont *(kein eigenes Projekt, nur GF-Repo)* | schwere Egyptienne für Titel — im Katalog nicht vorhanden |
| [ ] **Basteleur** | `Serif, Display, Reverse Contrast` | ausstehend | https://velvetyne.fr/fonts/basteleur/ | umgekehrter Kontrast, Bitmap-Herkunft — nur Fraunces streift das Thema |
| [ ] **Frank Ruhl Libre** | `Serif, Hebräisch, Variable` | ausstehend | https://github.com/fontef/frankruhllibre | siehe Abschnitt „Nicht-lateinische Schriften" |

### Script

| Schrift | Tags | Fonts | Quelle | Lücke |
|---|---|---|---|---|
| [ ] **TeX Gyre Chorus** | `Script, Kalligraphisch` | ausstehend | https://www.gust.org.pl/projects/e-foundry/tex-gyre/chorus | 15 Script-Schriften, alle Handwriting/Casual — keine Kanzleischrift. Zapf-Chancery-Klon, vervollständigt TeX Gyre |
| [ ] **Great Vibes** | `Script, Kalligraphisch, Display` | ausstehend | https://github.com/googlefonts/great-vibes *(kein eigenes Projekt, nur GF-Repo)* | formaler Kupferstich-Duktus; Satisfy und Dancing Script sind beide locker |
| [ ] **Tangerine** | `Script, Kalligraphisch` | ausstehend | https://github.com/googlefonts/TangerineFont *(kein eigenes Projekt, nur GF-Repo)* | Spitzfeder-Kalligrafie, feiner Strich |

### Blackletter

| Schrift | Tags | Fonts | Quelle | Lücke |
|---|---|---|---|---|
| [ ] **Fette Fraktur** ⚠ | `Blackletter, Display` | Ordner + meta.yaml vorhanden, Font fehlt | **keine Quelle** — die eingetragene URL ist ein 404, „Fette Fraktur" existiert nicht bei Google Fonts und es gibt keine freie Digitalisierung. Ersatz mit eigener Projektseite: [Plakat Fraktur](http://www.peter-wiegel.de/PlakatFraktur.html) oder [Ganz Grobe Gotisch](http://www.peter-wiegel.de/GanzGrobe.html) (Peter Wiegel) | `blackletter/FetteFraktur/` ist leer; die `meta.yaml` nennt Peter Wiegel als Urheber — er hat aber keine Fette Fraktur im Programm |
| [ ] **UnifrakturCook** | `Blackletter, Display` | ausstehend | https://unifraktur.sourceforge.net | nur 3 Blackletter im Katalog; Schwabacher-Variante neben der vorhandenen Maguntia |
| [ ] **Jacquarda Bastarda 9** | `Blackletter, Display, Pixel` | ausstehend | https://github.com/scfried/soft-type-jacquarda-bastarda | Bastarda auf Pixelraster — deckt Blackletter *und* Bitmap ab |

### Display *(neue Kategorie)*

| Schrift | Tags | Fonts | Quelle | Lücke |
|---|---|---|---|---|
| [ ] **Big Shoulders Stencil** | `Display, Stencil, Condensed, Variable` | ausstehend | https://github.com/xotypeco/big_shoulders | Stencil fehlt komplett; Big Shoulders Display ist schon da |
| [ ] **Saira Stencil One** | `Display, Stencil` | ausstehend | https://github.com/Omnibus-Type/Saira | s.o. — breitere, runde Schablonenform |
| [ ] **Silkscreen** | `Display, Pixel, Bitmap` | ausstehend | https://kottke.org/plus/type/silkscreen/ | proportionale Bitmap-Schrift; Departure Mono ist Monospace-only |
| [ ] **Pixelify Sans** | `Display, Pixel, Bitmap, Variable` | ausstehend | https://github.com/eifetx/Pixelify-Sans | s.o. — mit Gewichtsachse |
| [ ] **Climate Crisis** | `Display, Condensed, Variable` | ausstehend | https://github.com/dancoull/ClimateCrisis | Achse `YEAR` (1979–2050) statt Gewicht — ungewöhnlichster Variable-Kandidat für den 3D-Würfel |

### Nicht-lateinische Schriften *(Grundsatzentscheidung)*

Der Katalog enthält bislang **keine** nicht-lateinische Schrift. Das ist kein Nebenbei-Eintrag: es braucht Panagramme, Beispieltexte und Unicode-Blöcke je Schriftsystem (`unicodeRanges.js`), sonst bleiben Coverage-Anzeige und Wasserfall leer. Erst entscheiden, ob der Katalog das abdecken soll — dann diese vier als Startpunkt:

| Schrift | Schriftsystem | Quelle |
|---|---|---|
| Vazirmatn | Arabisch / Persisch | https://github.com/rastikerdar/vazirmatn |
| Frank Ruhl Libre | Hebräisch | https://github.com/fontef/frankruhllibre |
| Noto Serif Devanagari | Devanagari | https://github.com/notofonts/devanagari |
| Sarasa Gothic | CJK (+ Monospace) | https://github.com/be5invis/Sarasa-Gothic |

---
## Features

- [] **17 – Wikipedia-Beschreibungen**
  Lies zuerst die CLAUDE.md vollständig. Dann führe folgende Aufgabe vollständig und systematisch durch.

  ## Ziel
  Für jede Schrift im Projekt: prüfe ob ein Wikipedia-Artikel existiert
  (Deutsch bevorzugt, Englisch als Fallback) und trage die URL in die
  zugehörige meta.yaml unter dem Key `wikipedia` ein.

  ## Phase 1 – Schriften inventarisieren
  - Finde alle Schriften im Projekt (Verzeichnisstruktur, meta.yaml-
    Dateien, oder wie im Projekt üblich)
  - Erstelle eine vollständige Liste: Schriftname → Pfad zur meta.yaml
  - Gib die Liste aus, bevor du weitermachst

  ## Phase 2 – Wikipedia prüfen
  Für jede Schrift in der Liste:

  1. Prüfe zuerst die deutsche Wikipedia:
    https://de.wikipedia.org/wiki/SCHRIFTNAME
    (ersetze Leerzeichen durch Unterstriche)

  2. Falls kein deutscher Artikel existiert, prüfe die englische:
    https://en.wikipedia.org/wiki/SCHRIFTNAME

  3. Halte fest:
    - ✅ DE gefunden
    - ✅ EN gefunden (kein DE)
    - ❌ Kein Artikel gefunden

  Beachte Weiterleitungen – wenn eine URL auf einen anderen Artikel
  weiterleitet, ist das trotzdem ein gültiger Treffer. Trage dann die
  finale URL ein, nicht die Redirect-URL.

  ## Phase 3 – meta.yaml aktualisieren
  Für alle Schriften mit einem gefundenen Artikel:
  - Öffne die zugehörige meta.yaml
  - Setze oder aktualisiere den Key `wikipedia` mit der vollständigen URL
  - Beispiel:
    wikipedia: "https://de.wikipedia.org/wiki/Helvetica"

  Überschreibe einen bestehenden Wert nur, wenn du einen besseren
  (deutschen statt englischen) Artikel gefunden hast.

  ## Phase 4 – Abschlussbericht
  Gib eine Zusammenfassung aus:
  - Wie viele Schriften geprüft?
  - Wie viele DE-Artikel gefunden?
  - Wie viele EN-Artikel gefunden?
  - Wie viele ohne Artikel?
  - Liste der Schriften ohne Wikipedia-Eintrag

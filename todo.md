# Offene Features

## Mittel (M)

- [x] **7 – „Verwandte Schriften" Block auf Specimen-Seiten**
  Fonts mit gleichen Tags anzeigen: „Weitere Schriften in: Garalde, Elegant". Datenlage vollständig vorhanden, nur Template fehlt.

- [ ] **9 – Achsen-Tabelle auf Specimen-Seiten**
  Variable-Font-Achsen (wght, wdth, opsz, ital, slnt) als Tabelle ausgeben. Info steckt im Dateinamen (`Fraunces[wght,opsz,WONK].woff2`). Reine Build-Zeit-Arbeit in `fonts.js`.

- [x] **10 – Sort/Filter auf Kategorie-Seiten**
  Gleiche Sort/Filter-UI wie auf der Homepage auch auf den Kategorie-Seiten (`/sans`, `/serif` etc.).

- [x] **18 – Erweiterte Sort/Filter-Optionen**
  Neue `data-*`-Attribute auf den Karten + JS-Logik für folgende Optionen:

  **Neue Sortierungen** (auf Homepage + Kategorie-Seiten):
  - Nach Jahr aufsteigend / absteigend (`data-year` aus `node.fontyear`)
  - Nach Anzahl Schnitte absteigend — Großfamilien zuerst (`data-styles` aus `node.ownFonts | length`)

  **Neue Filter** (auf Homepage + Kategorie-Seiten):
  - Hat Kursiv — nur Schriften mit mindestens einem Italic-Schnitt (`data-italic` aus `ownFonts | selectattr("style", "equalto", "italic")`)
  - Große Familie — nur Schriften mit ≥ 8 Schnitten (`data-styles` → JS-Vergleich `>= 8`)

  **Implementierungsplan:**
  1. `font-card.njk`: `data-year`, `data-styles`, `data-italic` ergänzen
  2. `index.njk` + `specimen.njk`: neue Buttons in `.sort-buttons` / `.filter-buttons`
  3. JS `apply()`-Funktion in beiden Seiten erweitern

- [ ] **11 – `content`-Feld bei Leaf-Nodes befüllen** *(redaktionell)*
  Informationstexte zu einzelnen Schriften in den jeweiligen `meta.yaml`-Dateien schreiben.

## Klein (S)

- [x] **12 – Build-Warnung bei fehlendem `tags[0]`**
  Sauberere Fehlerbehandlung wenn eine Schrift kein `tags`-Feld hat.

## Groß (L)

- [ ] **13 – Interaktiver Specimen-Text-Editor**
  Freier Text-Input der Specimen-Vorschau direkt auf der Seite.

- [x] **14 – Font-Vergleich-Modus**
  Zwei oder mehr Schriften nebeneinander vergleichen.

- [ ] **15 – Volltext-Suche**
  Client-side Suche über alle Schriften (z. B. Pagefind oder Fuse.js).

- [x] **16 – Print-Stylesheet**
  Optimiertes Layout für den Druck / PDF-Export.

- [x] **17 – Wikipedia-Beschreibungen**
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

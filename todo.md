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

- [ ] **14 – Font-Vergleich-Modus**  
  Zwei oder mehr Schriften nebeneinander vergleichen.

- [ ] **15 – Volltext-Suche**  
  Client-side Suche über alle Schriften (z. B. Pagefind oder Fuse.js).

- [ ] **16 – Print-Stylesheet**  
  Optimiertes Layout für den Druck / PDF-Export.

- [ ] **17 – Wikipedia-Beschreibungen**  
  Automatisches Nachladen von Beschreibungstexten via Wikipedia API.

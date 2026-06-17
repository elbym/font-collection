# Offene Features

## Schriften-Wunschliste

`meta.yaml` für alle Einträge erstellt — Ordner angelegt, Fonts ausstehend. Neue Kategorie `display/` eingeführt für Schriften mit `Display` als erstem Tag.

### Monospace

| Schrift | Tags | Fonts | Quelle |
|---|---|---|---|
| [x] **Recursive** | `Monospace, Sans, Variable` | ausstehend | https://www.recursive.design |
| [x] **0xProto** | `Monospace, Coding` | ausstehend | https://github.com/0xType/0xProto |
| [x] **Monaspace** | `Monospace, Coding, Variable` | ausstehend | https://monaspace.githubnext.com |
| [x] **Departure Mono** | `Monospace, Display` | ausstehend | https://departuremono.com |
| [x] **Space Mono** | `Monospace, Geometric` | ausstehend | https://github.com/googlefonts/spacemono |

### Sans

| Schrift | Tags | Fonts | Quelle |
|---|---|---|---|
| [x] **Bricolage Grotesque** | `Sans, Geometric, Grotesk, Display` | ausstehend | https://ateliertriay.github.io/bricolage/ |
| [x] **Geist** | `Sans, Neo, Grotesk` | ausstehend | https://vercel.com/font |
| [x] **Figtree** | `Sans, Geometric, Rounded` | ausstehend | https://www.erikdkennedy.com/projects/figtree.html |
| [x] **Routed Gothic** | `Sans, Grotesk, Display` | ausstehend | https://webonastick.com/fonts/routed-gothic/ |
| [X] **Satoshi** | `Sans, Neo, Grotesk` | ausstehend | https://www.fontshare.com/fonts/satoshi |
| [x] **Manrope** | `Sans, Geometric, Grotesk` | ausstehend | https://fonts.google.com/specimen/Manrope |
| [ ] **Lexend** | `Sans, Humanist` | ausstehend | https://fonts.google.com/specimen/Lexend |
| [x] **Cabinet Grotesk** | `Sans, Grotesk, Display` | ausstehend | https://www.fontshare.com/fonts/cabinet-grotesk |
| [ ] **Urbanist** | `Sans, Geometric, Grotesk` | ausstehend | https://fonts.google.com/specimen/Urbanist |
| [ ] **Syne** | `Sans, Geometric, Display` | ausstehend | https://fonts.google.com/specimen/Syne |
| [x] **Oswald** | `Sans, Condensed, Display` | ausstehend | https://github.com/vernnobile/OswaldFont |

### Serif

| Schrift | Tags | Fonts | Quelle |
|---|---|---|---|
| [ ] **Gentium Plus** | `Serif, Garalde, Old Style` | ausstehend | https://software.sil.org/gentium |
| [x] **Bitter** | `Serif, Slab Serif` | ausstehend | https://fonts.google.com/specimen/Bitter |
| [ ] **Reforma** | `Serif, Humanist` | ausstehend | https://pampatype.com/reforma |
| [ ] **Sorts Mill Goudy** | `Serif, Garalde, Old Style` | ausstehend | https://fonts.google.com/specimen/Sorts+Mill+Goudy |
| [ ] **Cardo** | `Serif, Garalde, Old Style` | ausstehend | https://fonts.google.com/specimen/Cardo |
| [x] **STIX Two** | `Serif, Humanist` | ausstehend | https://www.stixfonts.org |
| [ ] **Quattrocento** | `Serif, Humanist, Garalde` | ausstehend | https://fonts.google.com/specimen/Quattrocento |

### Script

| Schrift | Tags | Fonts | Quelle |
|---|---|---|---|
| [x] **Caveat** | `Script, Handwriting` | ausstehend | https://fonts.google.com/specimen/Caveat |
| [x] **Pacifico** | `Script, Display` | ausstehend | https://fonts.google.com/specimen/Pacifico |
| [x] **Satisfy** | `Script, Kalligraphisch` | ausstehend | https://fonts.google.com/specimen/Satisfy |
| [x] **Dancing Script** | `Script, Kalligraphisch` | ausstehend | https://fonts.google.com/specimen/Dancing+Script |
| [ ] **Amatic SC** | `Script, Handwriting, Display` | ausstehend | https://fonts.google.com/specimen/Amatic+SC |

### Blackletter

| Schrift | Tags | Fonts | Quelle |
|---|---|---|---|
| [ ] **Fette Fraktur** | `Blackletter, Display` | ausstehend | https://fonts.google.com/specimen/Fette+Fraktur |

### Display *(neue Kategorie)*

| Schrift | Tags | Fonts | Quelle |
|---|---|---|---|
| [ ] **Bebas Neue** | `Display, Condensed, Grotesk` | ausstehend | https://fonts.google.com/specimen/Bebas+Neue |
| [ ] **Anton** | `Display, Condensed, Grotesk` | ausstehend | https://fonts.google.com/specimen/Anton |
| [ ] **Dela Gothic One** | `Display, Geometric` | ausstehend | https://fonts.google.com/specimen/Dela+Gothic+One |
| [ ] **Silkscreen** | `Display, Monospace` | ausstehend | https://fonts.google.com/specimen/Silkscreen |

---
## Features

- [ ] **9 – Achsen-Tabelle auf Specimen-Seiten**
  Variable-Font-Achsen (wght, wdth, opsz, ital, slnt) als Tabelle ausgeben. Info steckt im Dateinamen (`Fraunces[wght,opsz,WONK].woff2`). Reine Build-Zeit-Arbeit in `fonts.js`.

- [ ] **11 – `content`-Feld bei Leaf-Nodes befüllen** *(redaktionell)*
  Informationstexte zu einzelnen Schriften in den jeweiligen `meta.yaml`-Dateien schreiben.

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

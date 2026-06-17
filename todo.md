# Offene Features

## Schriften-Wunschliste

| Schrift | Beschreibung | URL | Tags | Grund |
|---------|--------------|-----|------|-------|
| **Recursive** | Variable Schrift, die von Monospace über Sans bis Casual reicht — alles in einem File | https://www.recursive.design | `Monospace, Sans, Variable` | Einzige Schrift, die mehrere Kategorien gleichzeitig besetzt; zeigt das Potential variabler Schriften |
| **0xProto** | Neues, technisch klares Coding-Mono mit optionalen Ligaturen | https://github.com/0xType/0xProto | `Monospace, Coding` | Junge, eigenständige Schrift — Kontrast zu den etablierten Coding-Monos im Projekt |
| **Bricolage Grotesque** | Expressiver Display-Grotesk mit variable Achsen (wdth, wght); handgemachter Charakter | https://ateliertriay.github.io/bricolage/ | `Sans, Geometric, Grotesk, Display` | Schließt die Lücke bei ausdrucksstarken Display-Grotesken; aktuell, keine ähnliche im Bestand |
| **Geist** | Vercels Hausschrift — neutral, technisch, gut lesbar in UI und Code | https://vercel.com/font | `Sans, Neo, Grotesk` | Modernes Äquivalent zu Inter, aber eigenwilliger; Geist + Geist Mono als Paar interessant |
| **Figtree** | Geometrisch-gerundeter Sans, freundlicher Ton, variable Gewichte | https://www.erikdkennedy.com/projects/figtree.html  | `Sans, Geometric, Rounded` | Ergänzt Nunito um eine schlankere, modernere Rounded-Variante |
| **Routed Gothic** | Nachzeichnung technischer Schablonenschrift aus US-Industriezeichnungen | https://webonastick.com/fonts/routed-gothic/ | `Sans, Grotesk, Display` | Einzigartiger historischer Charakter; kein anderes Pendant im Bestand |
| **Gentium Plus** | Scholastisch-humanistischer Old Style mit außergewöhnlicher Unicode-Abdeckung | https://software.sil.org/gentium | `Serif, Garalde, Old Style` | Beste freie Schrift für linguistischen und akademischen Satz; ergänzt Junicode |
| **Bitter** | Slab Serif explizit für Bildschirmlesbarkeit konzipiert, variable seit v2 | https://fonts.google.com/specimen/Bitter | `Serif, Slab Serif` | Fehlt als eigenständige Screen-Slab; Arvo und Compagnon sind gedruckter ausgerichtet |
| **Bebas Neue** | Kondensierter Versalien-Display-Grotesk, Referenzschrift für Headlines | https://fonts.google.com/specimen/Bebas+Neue | `Display, Condensed, Grotesk` | Fehlt komplett als Kategorie: kondensierte Display-Grotesken haben keinen Vertreter |
| **Caveat** | Lockere Alltagshandschrift, variable Gewichte, gut lesbar in klein | https://fonts.google.com/specimen/Caveat | `Script, Handwriting` | Handschrift-Kategorie fehlt; Kalam ist indisch beeinflusst, Caveat ist europäischer Standard |
| **Pacifico** | Runder, fetter Brush-Script mit 1950er-Retro-Charakter | https://fonts.google.com/specimen/Pacifico | `Script, Display` | Andere Energie als Playwrite/Kalam; fett und dekorativ statt kalligrafisch |
| **Satisfy** | Elegante fließende Kursivschrift, kalligrafischer Einschlag, klassisch | https://fonts.google.com/specimen/Satisfy | `Script, Kalligraphisch` | Verbindet Script und Kalligrafie — Lücke zwischen Sansita Swashed und den Handschriften |
| **Fette Fraktur** | Klassische Zeitungs-Fraktur, historisches Referenzbeispiel des 19. Jahrhunderts | https://fonts.google.com/specimen/Fette+Fraktur | `Blackletter, Display` | Grenze und Unifraktur sind moderner; Fette Fraktur als historisches Original fehlt |

---

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

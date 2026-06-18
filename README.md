![](preview.png)

# Persönliche Sammlung von (größtenteils kostenlosen) Schriftarten

> Jeder hat eine Lieblingsschrift, oder? ODER!?

Das ist eine persönliche und eigenwillige Sammlung von Schriftarten, die mir im Gedächtnis geblieben sind und vor allem und ein Vorwand, den [font_specimen_generator.py](./font_specimen_generator.py) vorzuführen (den ich Claude zusammen schustern ließ). Diese Liste ist außerdem von [Teuderun](https://www.teuderun.de/schriftarten/top-10/) beeinflusst.


## Neue Schrift hinzufügen

### Notwendige Schritte

1. **Ordner anlegen** — `src/webfonts/<Kategorie>/<SchriftName>/`  
   Der Ordner ist reiner Dateisystem-Container — er hat keinen Einfluss auf URL oder Navigation.

2. **`.woff2`-Dateien ablegen** — Namensschema: `SchriftName_Gewicht.woff2`  
   Beispiele: `Jost_Regular.woff2`, `Jost_Bold.woff2`, `Jost_BoldItalic.woff2`  
   Variable Fonts: Dateiname muss `Variable` oder `[wght]` enthalten.

3. **`meta.yaml` erstellen** — Pflicht: `tags` (erster Tag bestimmt URL-Segment und Kategorie)
   ```yaml
   title: Meine Schrift
   tags: Sans, Humanist Sans      # erster Tag → URL /sans/meineschrift.html
   ```

4. **Build starten** — `npx gulp`  
   Die Specimen-Seite erscheint automatisch unter `/<erster-tag>/<schriftname>.html`.

---

### Optionale meta.yaml-Felder

| Feld | Beispiel | Wirkung |
|---|---|---|
| `color` | `steelblue` | Akzentfarbe (CSS-Farbname) |
| `heroword` | `Airport` | Großes Wort im Hero-Bereich |
| `heroletter` | `Aa` | Zeichen im CMYK-Hero |
| `herostyle` | `bold` | CSS font-weight für heroword |
| `border` | `floral.svg` | Rahmen-SVG (aus `src/img/borders/`) |
| `fontauthor` | `Rasmus Andersson` | Gestalter-Name |
| `fontyear` | `2017` | Erscheinungsjahr |
| `wikipedia` | `https://…` | Link zur Wikipedia-Seite |
| `content` | `Markdown-Text` | Freitext unter dem Specimen |
| `comment` | `interner Hinweis` | Interne Notiz, nicht angezeigt |

### Optionale Bilder

- **Kartenhintegrund** — Bilder in `src/webfonts/<Kat>/<Schrift>/background/` ablegen (WebP bevorzugt)  
  Oder URLs in `background/urls.txt` eintragen (`unsplash:ID`, `pexels:ID`, direkte HTTPS-URL) → `npx gulp download`
- **Galerie** — Bilder in `src/webfonts/<Kat>/<Schrift>/gallery/` ablegen

---

### Lokalen Server starten

```bash
git clone https://github.com/elbym/font-collection
npm install
npx gulp            # Entwicklungsserver auf Port 3000
npx gulp build      # Produktions-Build
npx gulp deploy     # Deploy auf GitHub Pages
```

## Schriften

Aktuell **97 Schriften** in 7 Kategorien.

### Serif (36)
Alegreya · Arvo · Bitter · Bodoni\* · Cardo · Compagnon · Cormorant · Crimson Pro · EB Garamond · Fraunces · GFS Didot · Gentium Plus · IBM Plex Serif · Junicode · Libertinus Serif · Libre Baskerville · Libre Caslon · Literata · Lora · Merriweather · Mozilla Headline · Newsreader · Piazzolla · Playfair · Quattrocento · Reforma · Sorts Mill Goudy · Source Serif · Spectral · STIX Two · Tex Gyre Bonum · Tex Gyre Pagella · Tex Gyre Schola · Tex Gyre Termes · Unna · Vollkorn

### Sans-Serif (31)
Asap · Atkinson Hyperlegible Next · Bricolage Grotesque · Cabinet Grotesk · DINish · Epilogue · Figtree · Fira Sans · Geist · IBM Plex Sans · Inter · Jost\* · Junction · League Spartan · Libertinus Sans · Manrope · Metropolis · Mozilla Text · Nunito · Oswald · Overpass · Public Sans · Raleway · Routed Gothic · Satoshi · Source Sans · Space Grotesk · Tex Gyre Adventor · Tex Gyre Heros · Titillum Web · Work Sans

### Monospace (12)
0xProto · Cascadia Code · Commit Mono · Departure Mono · Fira Code · Hack · JetBrains Mono · Maple Mono · Monaspace · Recursive · Space Mono · Victor Mono

### Script / Handschrift (7)
Amatic SC · Caveat · Dancing Script · Pacifico · Playwrite · Sansita Swashed · Satisfy

### Blackletter (4)
Fette Fraktur · Grenze · Grenze Gotisch · Unifraktur

### Display (4)
Anton · Bebas Neue · Dela Gothic One · Silkscreen

### Nicht Comic Sans (3)
Kalam · Komika · Krikikrak

---

# Werkzeuge

## Font Freeze
[FontFreeze](https://github.com/MuTsunTsai/fontfreeze): Wenn eine Schriftfunktion standardmäßig aktiviert oder vollständig aus einer Schrift entfernt werden soll. Ich habe es verwendet, um eine Version von „Cascadia Code" mit eingebautem [SS01](https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt#ssxx) zu erstellen.

## python font_specimen_generator.py

Claude gebeten, ein Python-Skript zusammenzubasteln, das Schriftmuster-Vorschauen generiert – inspiriert von den Vorlagen auf [Wikipedia](https://commons.wikimedia.org/wiki/Category:Typeface_samples_(Font_Specimen_Creator);_raster_graphics)

![Vorschau des Wikipedia-Schriftmusters](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Adobe_Caslon.png/250px-Adobe_Caslon.png)

Unterstützt derzeit 3 verschiedene Themes: cream, dark, white

Beispiele:

    python font_specimen_generator.py --input ./fonts --output ./previews
    python font_specimen_generator.py --input ./fonts --output ./previews --theme white
    python font_specimen_generator.py --input ./fonts --output ./previews --width 1400 --theme cream
    python font_specimen_generator.py --input ./fonts --output ./previews --overwrite

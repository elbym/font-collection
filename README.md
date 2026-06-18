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

Aktuell **86 Schriften** mit Specimen-Seite, weitere 11 in Planung (ohne Schriftdatei).

### Serif (31 + 5 geplant)
[Alegreya](https://elbym.github.io/font-collection/serif/alegreya.html) · [Arvo](https://elbym.github.io/font-collection/serif/arvo.html) · [Bitter](https://elbym.github.io/font-collection/serif/bitter.html) · [Bodoni\*](https://elbym.github.io/font-collection/serif/bodoni.html) · [Compagnon](https://elbym.github.io/font-collection/serif/compagnon.html) · [Cormorant](https://elbym.github.io/font-collection/serif/cormorant.html) · [Crimson Pro](https://elbym.github.io/font-collection/serif/crimsonpro.html) · [EB Garamond](https://elbym.github.io/font-collection/serif/ebgaramond.html) · [Fraunces](https://elbym.github.io/font-collection/serif/fraunces.html) · [GFS Didot](https://elbym.github.io/font-collection/serif/gfsdidot.html) · [IBM Plex Serif](https://elbym.github.io/font-collection/serif/ibmplexserif.html) · [Junicode](https://elbym.github.io/font-collection/serif/junicode.html) · [Libertinus Serif](https://elbym.github.io/font-collection/serif/libertinusserif.html) · [Libre Baskerville](https://elbym.github.io/font-collection/serif/librebaskerville.html) · [Libre Caslon](https://elbym.github.io/font-collection/serif/librecaslon.html) · [Literata](https://elbym.github.io/font-collection/serif/literata.html) · [Lora](https://elbym.github.io/font-collection/serif/lora.html) · [Merriweather](https://elbym.github.io/font-collection/serif/merriweather.html) · [Mozilla Headline](https://elbym.github.io/font-collection/serif/mozillaheadline.html) · [Newsreader](https://elbym.github.io/font-collection/serif/newsreader.html) · [Piazzolla](https://elbym.github.io/font-collection/serif/piazzolla.html) · [Playfair](https://elbym.github.io/font-collection/serif/playfair.html) · [Source Serif](https://elbym.github.io/font-collection/serif/sourceserif.html) · [Spectral](https://elbym.github.io/font-collection/serif/spectral.html) · [STIX Two](https://elbym.github.io/font-collection/serif/stixtwo.html) · [Tex Gyre Bonum](https://elbym.github.io/font-collection/serif/texgyrebonum.html) · [Tex Gyre Pagella](https://elbym.github.io/font-collection/serif/texgyrepagella.html) · [Tex Gyre Schola](https://elbym.github.io/font-collection/serif/texgyreschola.html) · [Tex Gyre Termes](https://elbym.github.io/font-collection/serif/texgyretermes.html) · [Unna](https://elbym.github.io/font-collection/serif/unna.html) · [Vollkorn](https://elbym.github.io/font-collection/serif/vollkorn.html) · Cardo · Gentium Plus · Quattrocento · Reforma · Sorts Mill Goudy

### Sans-Serif (31)
[Asap](https://elbym.github.io/font-collection/sans/asap.html) · [Atkinson Hyperlegible Next](https://elbym.github.io/font-collection/sans/atkinsonhyperlegiblenext.html) · [Bricolage Grotesque](https://elbym.github.io/font-collection/sans/bricolagegrotesque.html) · [Cabinet Grotesk](https://elbym.github.io/font-collection/sans/cabinetgrotesk.html) · [DINish](https://elbym.github.io/font-collection/sans/dinish.html) · [Epilogue](https://elbym.github.io/font-collection/sans/epilogue.html) · [Figtree](https://elbym.github.io/font-collection/sans/figtree.html) · [Fira Sans](https://elbym.github.io/font-collection/sans/firasans.html) · [Geist](https://elbym.github.io/font-collection/sans/geist.html) · [IBM Plex Sans](https://elbym.github.io/font-collection/sans/ibmplexsans.html) · [Inter](https://elbym.github.io/font-collection/sans/inter.html) · [Jost\*](https://elbym.github.io/font-collection/sans/jost.html) · [Junction](https://elbym.github.io/font-collection/sans/junction.html) · [League Spartan](https://elbym.github.io/font-collection/sans/leaguespartan.html) · [Libertinus Sans](https://elbym.github.io/font-collection/sans/libertinussans.html) · [Manrope](https://elbym.github.io/font-collection/sans/manrope.html) · [Metropolis](https://elbym.github.io/font-collection/sans/metropolis.html) · [Mozilla Text](https://elbym.github.io/font-collection/sans/mozillatext.html) · [Nunito](https://elbym.github.io/font-collection/sans/nunito.html) · [Oswald](https://elbym.github.io/font-collection/sans/oswald.html) · [Overpass](https://elbym.github.io/font-collection/sans/overpass.html) · [Public Sans](https://elbym.github.io/font-collection/sans/publicsans.html) · [Raleway](https://elbym.github.io/font-collection/sans/raleway.html) · [Routed Gothic](https://elbym.github.io/font-collection/sans/routedgothic.html) · [Satoshi](https://elbym.github.io/font-collection/sans/satoshi.html) · [Source Sans](https://elbym.github.io/font-collection/sans/sourcesans.html) · [Space Grotesk](https://elbym.github.io/font-collection/sans/spacegrotesk.html) · [Tex Gyre Adventor](https://elbym.github.io/font-collection/sans/texgyreadventor.html) · [Tex Gyre Heros](https://elbym.github.io/font-collection/sans/texgyreheros.html) · [Titillum Web](https://elbym.github.io/font-collection/sans/titillumweb.html) · [Work Sans](https://elbym.github.io/font-collection/sans/worksans.html)

### Monospace (12)
[0xProto](https://elbym.github.io/font-collection/monospace/0xproto.html) · [Cascadia Code](https://elbym.github.io/font-collection/monospace/cascadiacode.html) · [Commit Mono](https://elbym.github.io/font-collection/monospace/commitmono.html) · [Departure Mono](https://elbym.github.io/font-collection/monospace/departuremono.html) · [Fira Code](https://elbym.github.io/font-collection/monospace/firacode.html) · [Hack](https://elbym.github.io/font-collection/monospace/hack.html) · [JetBrains Mono](https://elbym.github.io/font-collection/monospace/jetbrainsmono.html) · [Maple Mono](https://elbym.github.io/font-collection/monospace/maplemono.html) · [Monaspace](https://elbym.github.io/font-collection/monospace/monaspace.html) · [Recursive](https://elbym.github.io/font-collection/monospace/recursive.html) · [Space Mono](https://elbym.github.io/font-collection/monospace/spacemono.html) · [Victor Mono](https://elbym.github.io/font-collection/monospace/victormono.html)

### Script / Handschrift (6 + 1 geplant)
Amatic SC · [Caveat](https://elbym.github.io/font-collection/script/caveat.html) · [Dancing Script](https://elbym.github.io/font-collection/script/dancingscript.html) · [Pacifico](https://elbym.github.io/font-collection/script/pacifico.html) · [Playwrite](https://elbym.github.io/font-collection/script/playwritedela.html) · [Sansita Swashed](https://elbym.github.io/font-collection/display/sansitaswashed.html) · [Satisfy](https://elbym.github.io/font-collection/script/satisfy.html)

### Blackletter (3 + 1 geplant)
Fette Fraktur · [Grenze](https://elbym.github.io/font-collection/blackletter/grenze.html) · [Grenze Gotisch](https://elbym.github.io/font-collection/blackletter/grenzegotisch.html) · [Unifraktur](https://elbym.github.io/font-collection/blackletter/unifraktur.html)

### Display (0 + 4 geplant)
Anton · Bebas Neue · Dela Gothic One · Silkscreen

### Nicht Comic Sans (3)
[Kalam](https://elbym.github.io/font-collection/script/kalam.html) · [Komika](https://elbym.github.io/font-collection/script/komika.html) · [Krikikrak](https://elbym.github.io/font-collection/script/krikikrak.html)

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

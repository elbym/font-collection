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
   Variable Fonts: Dateiname muss `Variable`, ein `_vf`-Suffix oder eine Achsenliste in
   eckigen Klammern enthalten — `[wght]`, `[opsz,wght]`, `[MONO,CASL,wght,slnt,CRSV]`.
   Beliebige vierstellige Achsen-Tags sind erlaubt, nicht nur die fünf registrierten.

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
| `comment` | `interner Hinweis` | Interne Notiz, unter dem Header angezeigt |
| `license` | `SIL Open Font License 1.1` | Überschreibt die Auto-Erkennung aus `OFL.txt`/`LICENSE.txt` |
| `favorite` | `true` | Goldener Stern auf Karte und Specimen-Seite |
| `url` | `https://…` | Projekt-/Quelllink (im Template `folder.sourceUrl`) |

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

Aktuell **122 Schriften** mit Specimen-Seite. Die Gliederung folgt dem jeweils
ersten Tag in der `meta.yaml` — der bestimmt auch die URL. Diese Liste ist aus dem
Datenlayer generiert; beim Hinzufügen einer Schrift mit aktualisieren.

### Serif (38)
[Alegreya](https://elbym.github.io/font-collection/serif/alegreya.html) · [Arvo](https://elbym.github.io/font-collection/serif/arvo.html) · [Basteleur](https://elbym.github.io/font-collection/serif/basteleur.html) · [Bevan](https://elbym.github.io/font-collection/serif/bevan.html) · [Bitter](https://elbym.github.io/font-collection/serif/bitter.html) · [Bodoni\*](https://elbym.github.io/font-collection/serif/bodoni.html) · [Compagnon](https://elbym.github.io/font-collection/serif/compagnon.html) · [Cormorant](https://elbym.github.io/font-collection/serif/cormorant.html) · [Crimson Pro](https://elbym.github.io/font-collection/serif/crimsonpro.html) · [EB Garamond](https://elbym.github.io/font-collection/serif/ebgaramond.html) · [Frank Ruhl Libre](https://elbym.github.io/font-collection/serif/frankruhllibre.html) · [Fraunces](https://elbym.github.io/font-collection/serif/fraunces.html) · [Gambetta](https://elbym.github.io/font-collection/serif/gambetta.html) · [GFS Didot](https://elbym.github.io/font-collection/serif/gfsdidot.html) · [IBM Plex Serif](https://elbym.github.io/font-collection/serif/ibmplexserif.html) · [Junicode](https://elbym.github.io/font-collection/serif/junicode.html) · [Libertinus Serif](https://elbym.github.io/font-collection/serif/libertinusserif.html) · [Libre Baskerville](https://elbym.github.io/font-collection/serif/librebaskerville.html) · [Libre Caslon](https://elbym.github.io/font-collection/serif/librecaslon.html) · [Literata](https://elbym.github.io/font-collection/serif/literata.html) · [Lora](https://elbym.github.io/font-collection/serif/lora.html) · [Merriweather](https://elbym.github.io/font-collection/serif/merriweather.html) · [Mozilla Headline](https://elbym.github.io/font-collection/serif/mozillaheadline.html) · [Newsreader](https://elbym.github.io/font-collection/serif/newsreader.html) · [Piazzolla](https://elbym.github.io/font-collection/serif/piazzolla.html) · [Playfair](https://elbym.github.io/font-collection/serif/playfair.html) · [Reforma](https://elbym.github.io/font-collection/serif/reforma.html) · [Sentient](https://elbym.github.io/font-collection/serif/sentient.html) · [Source Serif](https://elbym.github.io/font-collection/serif/sourceserif.html) · [Spectral](https://elbym.github.io/font-collection/serif/spectral.html) · [Tex Gyre Bonum](https://elbym.github.io/font-collection/serif/texgyrebonum.html) · [Tex Gyre Pagella](https://elbym.github.io/font-collection/serif/texgyrepagella.html) · [Tex Gyre Schola](https://elbym.github.io/font-collection/serif/texgyreschola.html) · [Tex Gyre Termes](https://elbym.github.io/font-collection/serif/texgyretermes.html) · [Unna](https://elbym.github.io/font-collection/serif/unna.html) · [Vollkorn](https://elbym.github.io/font-collection/serif/vollkorn.html) · [Zilla Slab](https://elbym.github.io/font-collection/serif/zillaslab.html) · [Zodiak](https://elbym.github.io/font-collection/serif/zodiak.html)

### Sans-Serif (38)
[Amstelvar](https://elbym.github.io/font-collection/sans/amstelvar.html) · [Asap](https://elbym.github.io/font-collection/sans/asap.html) · [Atkinson Hyperlegible Next](https://elbym.github.io/font-collection/sans/atkinsonhyperlegiblenext.html) · [Bricolage Grotesque](https://elbym.github.io/font-collection/sans/bricolagegrotesque.html) · [Cabinet Grotesk](https://elbym.github.io/font-collection/sans/cabinetgrotesk.html) · [Cooper Hewitt](https://elbym.github.io/font-collection/sans/cooperhewitt.html) · [DINish](https://elbym.github.io/font-collection/sans/dinish.html) · [Epilogue](https://elbym.github.io/font-collection/sans/epilogue.html) · [Figtree](https://elbym.github.io/font-collection/sans/figtree.html) · [Fira Sans](https://elbym.github.io/font-collection/sans/firasans.html) · [Geist](https://elbym.github.io/font-collection/sans/geist.html) · [IBM Plex Sans](https://elbym.github.io/font-collection/sans/ibmplexsans.html) · [Inter](https://elbym.github.io/font-collection/sans/inter.html) · [Jost\*](https://elbym.github.io/font-collection/sans/jost.html) · [Karrik](https://elbym.github.io/font-collection/sans/karrik.html) · [League Spartan](https://elbym.github.io/font-collection/sans/leaguespartan.html) · [Libertinus Sans](https://elbym.github.io/font-collection/sans/libertinussans.html) · [Libre Franklin](https://elbym.github.io/font-collection/sans/librefranklin.html) · [Manrope](https://elbym.github.io/font-collection/sans/manrope.html) · [Metropolis](https://elbym.github.io/font-collection/sans/metropolis.html) · [Mozilla Text](https://elbym.github.io/font-collection/sans/mozillatext.html) · [Nunito](https://elbym.github.io/font-collection/sans/nunito.html) · [Overpass](https://elbym.github.io/font-collection/sans/overpass.html) · [Playpen Sans](https://elbym.github.io/font-collection/sans/playpensans.html) · [Public Sans](https://elbym.github.io/font-collection/sans/publicsans.html) · [Quicksand](https://elbym.github.io/font-collection/sans/quicksand.html) · [Raleway](https://elbym.github.io/font-collection/sans/raleway.html) · [Roboto Flex](https://elbym.github.io/font-collection/sans/robotoflex.html) · [Routed Gothic](https://elbym.github.io/font-collection/sans/routedgothic.html) · [Satoshi](https://elbym.github.io/font-collection/sans/satoshi.html) · [Source Sans](https://elbym.github.io/font-collection/sans/sourcesans.html) · [Space Grotesk](https://elbym.github.io/font-collection/sans/spacegrotesk.html) · [Tex Gyre Adventor](https://elbym.github.io/font-collection/sans/texgyreadventor.html) · [Tex Gyre Heros](https://elbym.github.io/font-collection/sans/texgyreheros.html) · [Titillum Web](https://elbym.github.io/font-collection/sans/titillumweb.html) · [Varela Round](https://elbym.github.io/font-collection/sans/varelaround.html) · [Vazirmatn](https://elbym.github.io/font-collection/sans/vazirmatn.html) · [Work Sans](https://elbym.github.io/font-collection/sans/worksans.html)

### Monospace (15)
[0xProto](https://elbym.github.io/font-collection/monospace/0xproto.html) · [Cascadia Code](https://elbym.github.io/font-collection/monospace/cascadiacode.html) · [Courier Prime](https://elbym.github.io/font-collection/monospace/courierprime.html) · [Departure Mono](https://elbym.github.io/font-collection/monospace/departuremono.html) · [Fira Code](https://elbym.github.io/font-collection/monospace/firacode.html) · [Geist Mono](https://elbym.github.io/font-collection/monospace/geistmono.html) · [Hack](https://elbym.github.io/font-collection/monospace/hack.html) · [IBM Plex Mono](https://elbym.github.io/font-collection/monospace/ibmplexmono.html) · [JetBrains Mono](https://elbym.github.io/font-collection/monospace/jetbrainsmono.html) · [Libertinus Mono](https://elbym.github.io/font-collection/monospace/libertinusmono.html) · [Maple Mono](https://elbym.github.io/font-collection/monospace/maplemono.html) · [Recursive](https://elbym.github.io/font-collection/monospace/recursive.html) · [Source Code Pro](https://elbym.github.io/font-collection/monospace/sourcecodepro.html) · [TeX Gyre Cursor](https://elbym.github.io/font-collection/monospace/texgyrecursor.html) · [Victor Mono](https://elbym.github.io/font-collection/monospace/victormono.html)

### Script / Handschrift (18)
[Amatic SC](https://elbym.github.io/font-collection/script/amaticsc.html) · [Because We Build](https://elbym.github.io/font-collection/script/becausewebuild.html) · [Because We Connect](https://elbym.github.io/font-collection/script/becauseweconnect.html) · [Because We Create](https://elbym.github.io/font-collection/script/becausewecreate.html) · [Because We Learn](https://elbym.github.io/font-collection/script/becausewelearn.html) · [Because We Mentor](https://elbym.github.io/font-collection/script/becausewementor.html) · [Because We Organize](https://elbym.github.io/font-collection/script/becauseweorganize.html) · [Caveat](https://elbym.github.io/font-collection/script/caveat.html) · [Dancing Script](https://elbym.github.io/font-collection/script/dancingscript.html) · [Great Vibes](https://elbym.github.io/font-collection/script/greatvibes.html) · [Kalam](https://elbym.github.io/font-collection/script/kalam.html) · [Komika](https://elbym.github.io/font-collection/script/komika.html) · [Krikikrak](https://elbym.github.io/font-collection/script/krikikrak.html) · [Pacifico](https://elbym.github.io/font-collection/script/pacifico.html) · [Playwrite](https://elbym.github.io/font-collection/script/playwritedela.html) · [Satisfy](https://elbym.github.io/font-collection/script/satisfy.html) · [Tangerine](https://elbym.github.io/font-collection/script/tangerine.html) · [TeX Gyre Chorus](https://elbym.github.io/font-collection/script/texgyrechorus.html)

### Blackletter (5)
[Grenze](https://elbym.github.io/font-collection/blackletter/grenze.html) · [Grenze Gotisch](https://elbym.github.io/font-collection/blackletter/grenzegotisch.html) · [Jacquarda Bastarda 9](https://elbym.github.io/font-collection/blackletter/jacquardabastarda9.html) · [Unifraktur](https://elbym.github.io/font-collection/blackletter/unifraktur.html) · [UnifrakturCook](https://elbym.github.io/font-collection/blackletter/unifrakturcook.html)

### Display (8)
[Big Shoulders Display](https://elbym.github.io/font-collection/display/bigshouldersdisplay.html) · [Big Shoulders Stencil](https://elbym.github.io/font-collection/display/bigshouldersstencil.html) · [Climate Crisis](https://elbym.github.io/font-collection/display/climatecrisis.html) · [Dela Gothic One](https://elbym.github.io/font-collection/display/delagothicone.html) · [Pixelify Sans](https://elbym.github.io/font-collection/display/pixelifysans.html) · [Saira Stencil One](https://elbym.github.io/font-collection/display/sairastencilone.html) · [Sansita Swashed](https://elbym.github.io/font-collection/display/sansitaswashed.html) · [Silkscreen](https://elbym.github.io/font-collection/display/silkscreen.html)

Die drei Nicht-Comic-Sans-Schriften ([Kalam](https://elbym.github.io/font-collection/script/kalam.html) ·
[Komika](https://elbym.github.io/font-collection/script/komika.html) ·
[Krikikrak](https://elbym.github.io/font-collection/script/krikikrak.html)) liegen im Ordner
`src/webfonts/comicsans/`, sind aber als `Script` getaggt und erscheinen deshalb unter `/script/`.



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

---
Nur Schriften, die tatsächlich eine Specimen-Seite haben — dieselben 122 wie unter
[Schriften](#schriften). Wunschliste und Lücken stehen in [`todo.md`](./todo.md).
Sammel-Einträge (Tex Gyre, Because We Had To) werden von allen ihren Schnitten verlinkt.

* Serifenschriften (38)
  - [Alegreya](#alegreya)
  - [Arvo](#arvo)
  - [Basteleur](#basteleur)
  - [Bevan](#bevan)
  - [Bitter](#bitter)
  - [Bodoni\*](#bodoni)
  - [Compagnon](#compagnon)
  - [Cormorant](#cormorant-garamond)
  - [Crimson Pro](#crimson-pro)
  - [EB Garamond](#eb-garamond)
  - [Frank Ruhl Libre](#frank-ruhl-libre)
  - [Fraunces](#fraunces)
  - [Gambetta](#gambetta)
  - [GFS Didot](#gfs-didot)
  - [IBM Plex Serif](#ibm-plex-serif)
  - [Junicode](#junicode)
  - [Libertinus Serif](#libertinus)
  - [Libre Baskerville](#libre-baskerville)
  - [Libre Caslon](#libre-caslon-text)
  - [Literata](#literata)
  - [Lora](#lora)
  - [Merriweather](#merriweather)
  - [Mozilla Headline](#mozilla-headline)
  - [Newsreader](#newsreader)
  - [Piazzolla](#piazzolla)
  - [Playfair](#playfair)
  - [Reforma](#reforma)
  - [Sentient](#sentient)
  - [Source Serif](#source-serif)
  - [Spectral](#spectral)
  - [Tex Gyre Bonum](#tex-gyre)
  - [Tex Gyre Pagella](#tex-gyre)
  - [Tex Gyre Schola](#tex-gyre)
  - [Tex Gyre Termes](#tex-gyre)
  - [Unna](#unna)
  - [Vollkorn](#vollkorn)
  - [Zilla Slab](#zilla-slab)
  - [Zodiak](#zodiak)
* Serifenlose Schriften (38)
  - [Amstelvar](#amstelvar)
  - [Asap](#asap)
  - [Atkinson Hyperlegible Next](#atkinson-hyperlegible)
  - [Bricolage Grotesque](#bricolage-grotesque)
  - [Cabinet Grotesk](#cabinet-grotesk)
  - [Cooper Hewitt](#cooper-hewitt)
  - [DINish](#dinish)
  - [Epilogue](#epilogue)
  - [Figtree](#figtree)
  - [Fira Sans](#fira-sans)
  - [Geist](#geist)
  - [IBM Plex Sans](#ibm-plex-sans)
  - [Inter](#inter)
  - [Jost\*](#jost)
  - [Karrik](#karrik)
  - [League Spartan](#league-spartan)
  - [Libertinus Sans](#libertinus-sans)
  - [Libre Franklin](#libre-franklin)
  - [Manrope](#manrope)
  - [Metropolis](#metropolis)
  - [Mozilla Text](#mozilla-text)
  - [Nunito](#nunito)
  - [Overpass](#overpass)
  - [Playpen Sans](#playpen-sans)
  - [Public Sans](#public-sans)
  - [Quicksand](#quicksand)
  - [Raleway](#raleway)
  - [Roboto Flex](#roboto-flex)
  - [Routed Gothic](#routed-gothic)
  - [Satoshi](#satoshi)
  - [Source Sans](#source-sans)
  - [Space Grotesk](#space-grotesk)
  - [Tex Gyre Adventor](#tex-gyre)
  - [Tex Gyre Heros](#tex-gyre)
  - [Titillum Web](#titillium)
  - [Varela Round](#varela-round)
  - [Vazirmatn](#vazirmatn)
  - [Work Sans](#work-sans)
* Nichtproportionale Schriften (15)
  - [0xProto](#0xproto)
  - [Cascadia Code](#cascadia-code)
  - [Courier Prime](#courier-prime)
  - [Departure Mono](#departure-mono)
  - [Fira Code](#fira-code)
  - [Geist Mono](#geist-mono)
  - [Hack](#hack)
  - [IBM Plex Mono](#ibm-plex-mono)
  - [JetBrains Mono](#jetbrains-mono)
  - [Libertinus Mono](#libertinus-mono)
  - [Maple Mono](#maple-mono)
  - [Recursive](#recursive)
  - [Source Code Pro](#source-code-pro)
  - [TeX Gyre Cursor](#tex-gyre)
  - [Victor Mono](#victor-mono)
* Schreibschriften (18)
  - [Amatic SC](#amatic-sc)
  - [Because We Build](#because-we-had-to)
  - [Because We Connect](#because-we-had-to)
  - [Because We Create](#because-we-had-to)
  - [Because We Learn](#because-we-had-to)
  - [Because We Mentor](#because-we-had-to)
  - [Because We Organize](#because-we-had-to)
  - [Caveat](#caveat)
  - [Dancing Script](#dancing-script)
  - [Great Vibes](#great-vibes)
  - [Kalam](#kalam)
  - [Komika](#komika-hand)
  - [Krikikrak](#krikikrak)
  - [Pacifico](#pacifico)
  - [Playwrite](#playwrite)
  - [Satisfy](#satisfy)
  - [Tangerine](#tangerine)
  - [TeX Gyre Chorus](#tex-gyre-chorus)
* Blackletter (5)
  - [Grenze](#grenze)
  - [Grenze Gotisch](#grenze-gotisch)
  - [Jacquarda Bastarda 9](#jacquarda-bastarda-9)
  - [Unifraktur](#unifraktur)
  - [UnifrakturCook](#unifrakturcook)
* Display (8)
  - [Big Shoulders Display](#big-shoulders-display)
  - [Big Shoulders Stencil](#big-shoulders-stencil)
  - [Climate Crisis](#climate-crisis)
  - [Dela Gothic One](#dela-gothic-one)
  - [Pixelify Sans](#pixelify-sans)
  - [Saira Stencil One](#saira-stencil-one)
  - [Sansita Swashed](#sansita-swashed)
  - [Silkscreen](#silkscreen)

# Serifenschriften

## Literata
https://www.type-together.com/literata-font

Kannte sie nicht, bevor ich bei Teuderun darauf gestoßen bin – und ich mag sie sehr. Die Familie besteht aus:
* Literata Display
* Literata Subhead
* Literata Text

![Vorschau des Literata TT Text Regular Schriftmusters](./src/img/font_previews/Literata.svg)

## IBM Plex Serif
https://github.com/IBM/plex

Ich mag die IBM-Plex-Schriften sehr. Sie treffen den klassischen Look und sind gut lesbar. Mit einem Hauch „Tech-Feeling".

![Vorschau des IBM Plex Serif Schriftmusters](./src/img/font_previews/IBMPlexSerif.svg)

## Libertinus
https://github.com/alerque/libertinus

Libertinus ist der Nachfolger von Linux Libertine aus der TeX-Gyre-Sammlung. Die Familie besteht aus:
* Libertinus Serif
* Libertinus Serif Display
* Libertinus Sans

![Vorschau des Libertinus Serif Schriftmusters](./src/img/font_previews/LibertinusSerif.svg)

## Alegreya
https://htfonts.com/en/fonts/alegreya-sans/

![Vorschau des Schriftmusters von Alegreya](./src/img/font_previews/Alegreya.svg)

## Arvo
https://github.com/antonxheight/Arvo

![Vorschau des Schriftmusters von Arvo](./src/img/font_previews/Arvo.svg)

## Basteleur
https://velvetyne.fr/fonts/basteleur/

![Vorschau des Schriftmusters von Basteleur](./src/img/font_previews/Basteleur.svg)

## Bevan
https://github.com/googlefonts/BevanFont

![Vorschau des Schriftmusters von Bevan](./src/img/font_previews/Bevan.svg)

## Bitter
https://fonts.google.com/specimen/Bitter

![Vorschau des Schriftmusters von Bitter](./src/img/font_previews/Bitter.svg)

## Bodoni*
https://github.com/indestructible-type/Bodoni

![Vorschau des Schriftmusters von Bodoni*](./src/img/font_previews/Bodoni.svg)

## Compagnon
https://compagnon.eesab.fr/

![Vorschau des Schriftmusters von Compagnon](./src/img/font_previews/Compagnon.svg)

## Cooper Hewitt
https://github.com/cooperhewitt/CooperHewitt-Font

![Vorschau des Schriftmusters von Cooper Hewitt](./src/img/font_previews/CooperHewitt.svg)

## Crimson Pro
https://github.com/Fonthausen/CrimsonPro

![Vorschau des Schriftmusters von Crimson Pro](./src/img/font_previews/CrimsonPro.svg)

## EB Garamond
https://googlefonts.github.io/ebgaramond-specimen

![Vorschau des Schriftmusters von EB Garamond](./src/img/font_previews/EBGaramond.svg)

## Frank Ruhl Libre
https://github.com/fontef/frankruhllibre

![Vorschau des Schriftmusters von Frank Ruhl Libre](./src/img/font_previews/FrankRuhlLibre.svg)

## Fraunces
https://github.com/undercasetype/Fraunces

![Vorschau des Schriftmusters von Fraunces](./src/img/font_previews/Fraunces.svg)

## Gambetta
https://www.fontshare.com/fonts/gambetta

![Vorschau des Schriftmusters von Gambetta](./src/img/font_previews/Gambetta.svg)

## GFS Didot
https://greekfontsociety-gfs.gr/typefaces/19th_century

![Vorschau des Schriftmusters von GFS Didot](./src/img/font_previews/GFSDidot.svg)

## Junicode
https://github.com/psb1558/Junicode-font

![Vorschau des Schriftmusters von Junicode](./src/img/font_previews/Junicode.svg)

## Libre Baskerville
https://github.com/impallari/Libre-Baskerville

![Vorschau des Schriftmusters von Libre Baskerville](./src/img/font_previews/LibreBaskerville.svg)

## Lora
https://github.com/cyrealtype/Lora-Cyrillic

![Vorschau des Schriftmusters von Lora](./src/img/font_previews/Lora.svg)

## Merriweather
https://github.com/SorkinType/Merriweather

![Vorschau des Schriftmusters von Merriweather](./src/img/font_previews/Merriweather.svg)

## Mozilla Headline
https://github.com/mozilla/mozilla-type-family

![Vorschau des Schriftmusters von Mozilla Headline](./src/img/font_previews/MozillaHeadline.svg)

## Newsreader
https://github.com/productiontype/Newsreader

![Vorschau des Schriftmusters von Newsreader](./src/img/font_previews/Newsreader.svg)

## Piazzolla
https://github.com/huertatipografica/piazzolla

![Vorschau des Schriftmusters von Piazzolla](./src/img/font_previews/Piazzolla.svg)

## Playfair
https://www.forthehearts.net/playfair

![Vorschau des Schriftmusters von Playfair](./src/img/font_previews/Playfair.svg)

## Reforma
https://pampatype.com/reforma

![Vorschau des Schriftmusters von Reforma](./src/img/font_previews/Reforma.svg)

## Sentient
https://www.fontshare.com/fonts/sentient

![Vorschau des Schriftmusters von Sentient](./src/img/font_previews/Sentient.svg)

## Source Serif
https://adobe-fonts.github.io/source-serif/

![Vorschau des Schriftmusters von Source Serif](./src/img/font_previews/SourceSerif.svg)

## Spectral
https://github.com/productiontype/Spectral

![Vorschau des Schriftmusters von Spectral](./src/img/font_previews/Spectral.svg)

## Unna
https://www.omnibus-type.com/fonts/unna/

![Vorschau des Schriftmusters von Unna](./src/img/font_previews/Unna.svg)

## Vollkorn
http://vollkorn-typeface.com/

![Vorschau des Schriftmusters von Vollkorn](./src/img/font_previews/Vollkorn.svg)

## Zilla Slab
https://github.com/mozilla/zilla-slab

![Vorschau des Schriftmusters von Zilla Slab](./src/img/font_previews/ZillaSlab.svg)

## Zodiak
https://www.fontshare.com/fonts/zodiak

# Serifenlose Schriften

![Vorschau des Schriftmusters von Zodiak](./src/img/font_previews/Zodiak.svg)

## Atkinson Hyperlegible
https://www.brailleinstitute.org/freefont/

Nomen est omen. Sehr gut lesbar. Ich mag sie und sie wächst mir immer mehr ans Herz.

Entwickelt vom Braille Institute of America ist diese Schrift darauf ausgelegt, für sehbehinderte Leser besonders gut lesbar zu sein – alle Zeichen sind so unterschiedlich wie möglich gestaltet.

![Vorschau des Atkinson Hyperlegible Schriftmusters](./src/img/font_previews/AtkinsonHyperlegibleNext.svg)

## Inter
https://rsms.me/inter/

Wie die Website es beschreibt: „Der Standard des 21. Jahrhunderts". Hat sogar eine schöne URL. Auch als Variable Font verfügbar.

![Vorschau des Inter Schriftmusters](./src/img/font_previews/Inter.svg)

## Metropolis
https://github.com/dw5/Metropolis

Diese mag ich für Überschriften und größeren Text.

![Vorschau des Metropolis Schriftmusters](./src/img/font_previews/Metropolis.svg)

## IBM Plex Sans
https://github.com/IBM/plex

Die IBM-Plex-Schriftfamilie ist einfach eine schöne und sehr gut lesbare Schrift.

![Vorschau des IBM Plex Sans Schriftmusters](./src/img/font_previews/IBMPlexSans.svg)

## Fira Sans
https://mozilla.github.io/Fira/

Im Auftrag der Mozilla Foundation und Telefonica S.A. für deren mobiles Betriebssystem entwickelt. Erinnert sehr an Erik Spiekermanns „FF Meta".

![Vorschau des Fira Sans Schriftmusters](./src/img/font_previews/FiraSans.svg)

## Amstelvar
https://github.com/googlefonts/amstelvar

![Vorschau des Schriftmusters von Amstelvar](./src/img/font_previews/Amstelvar.svg)

## Asap
https://www.omnibus-type.com/fonts/asap/

![Vorschau des Schriftmusters von Asap](./src/img/font_previews/Asap.svg)

## Bricolage Grotesque
https://ateliertriay.github.io/bricolage/

![Vorschau des Schriftmusters von Bricolage Grotesque](./src/img/font_previews/BricolageGrotesque.svg)

## Cabinet Grotesk
https://www.fontshare.com/fonts/cabinet-grotesk

![Vorschau des Schriftmusters von Cabinet Grotesk](./src/img/font_previews/CabinetGrotesk.svg)

## DINish
https://github.com/playbeing/dinish

![Vorschau des Schriftmusters von DINish](./src/img/font_previews/DINish.svg)

## Epilogue
https://github.com/Etcetera-Type-Co/Epilogue

![Vorschau des Schriftmusters von Epilogue](./src/img/font_previews/Epilogue.svg)

## Figtree
https://www.erikdkennedy.com/projects/figtree.html

![Vorschau des Schriftmusters von Figtree](./src/img/font_previews/Figtree.svg)

## Geist
https://vercel.com/font

![Vorschau des Schriftmusters von Geist](./src/img/font_previews/Geist.svg)

## Karrik
https://velvetyne.fr/fonts/karrik/

![Vorschau des Schriftmusters von Karrik](./src/img/font_previews/Karrik.svg)

## League Spartan
https://theleagueofmoveabletype.com/league-spartan

![Vorschau des Schriftmusters von League Spartan](./src/img/font_previews/LeagueSpartan.svg)

## Libertinus Sans
https://github.com/alerque/libertinus

![Vorschau des Schriftmusters von Libertinus Sans](./src/img/font_previews/LibertinusSans.svg)

## Libre Franklin
https://github.com/impallari/Libre-Franklin

![Vorschau des Schriftmusters von Libre Franklin](./src/img/font_previews/LibreFranklin.svg)

## Manrope
https://fonts.google.com/specimen/Manrope

![Vorschau des Schriftmusters von Manrope](./src/img/font_previews/Manrope.svg)

## Mozilla Text
https://github.com/mozilla/mozilla-type-family

![Vorschau des Schriftmusters von Mozilla Text](./src/img/font_previews/MozillaText.svg)

## Nunito
https://github.com/googlefonts/nunito

![Vorschau des Schriftmusters von Nunito](./src/img/font_previews/Nunito.svg)

## Playpen Sans
https://fonts.google.com/specimen/Playpen+Sans

![Vorschau des Schriftmusters von Playpen Sans](./src/img/font_previews/PlaypenSans.svg)

## Public Sans
https://github.com/uswds/public-sans

![Vorschau des Schriftmusters von Public Sans](./src/img/font_previews/PublicSans.svg)

## Quicksand
https://github.com/ThomasJockin/QuicksandFamily

![Vorschau des Schriftmusters von Quicksand](./src/img/font_previews/Quicksand.svg)

## Raleway
https://github.com/impallari/Raleway

![Vorschau des Schriftmusters von Raleway](./src/img/font_previews/Raleway.svg)

## Roboto Flex
https://fonts.google.com/specimen/Roboto+Flex

![Vorschau des Schriftmusters von Roboto Flex](./src/img/font_previews/RobotoFlex.svg)

## Routed Gothic
https://webonastick.com/fonts/routed-gothic/

![Vorschau des Schriftmusters von Routed Gothic](./src/img/font_previews/RoutedGothic.svg)

## Satoshi
https://www.fontshare.com/fonts/satoshi

![Vorschau des Schriftmusters von Satoshi](./src/img/font_previews/Satoshi.svg)

## Source Sans
https://adobe-fonts.github.io/source-sans/

![Vorschau des Schriftmusters von Source Sans](./src/img/font_previews/SourceSans.svg)

## Space Grotesk
https://floriankarsten.github.io/space-grotesk/

![Vorschau des Schriftmusters von Space Grotesk](./src/img/font_previews/SpaceGrotesk.svg)

## Varela Round
https://fonts.google.com/specimen/Varela+Round

![Vorschau des Schriftmusters von Varela Round](./src/img/font_previews/VarelaRound.svg)

## Vazirmatn
https://github.com/rastikerdar/vazirmatn

![Vorschau des Schriftmusters von Vazirmatn](./src/img/font_previews/Vazirmatn.svg)

## Work Sans
https://weiweihuanghuang.github.io/Work-Sans/

# Die Klassiker
Das sind einfach die Klassiker.

![Vorschau des Schriftmusters von Work Sans](./src/img/font_previews/WorkSans.svg)

## Tex Gyre

https://www.gust.org.pl/projects/e-foundry/tex-gyre/

Freie Alternativen für:
* Times (New) Roman → TeX Gyre Termes
* ITC Avantgarde → TeX Gyre Adventor
* Century Schoolbook → TeX Gyre Schola
* Palatino → Pagella
* ITC Zapf Chancery(R) → Tex Gyre Chorus
* ITC Bookman → TeX Gyre Bonum
* Courier → TeX Gyre Cursor
* Helvetica → TeX Gyre Heros

![Vorschau des Schriftmusters von TeX Gyre Termes](./src/img/font_previews/TexGyreTermes.svg)
![Vorschau des Schriftmusters von TeX Gyre Adventor](./src/img/font_previews/TexGyreAdventor.svg)
![Vorschau des Schriftmusters von TeX Gyre Schola](./src/img/font_previews/TexGyreSchola.svg)
![Vorschau des Schriftmusters von TeX Gyre Pagella](./src/img/font_previews/TexGyrePagella.svg)
![Vorschau des Schriftmusters von TeX Gyre Chorus](./src/img/font_previews/TexGyreChorus.svg)
![Vorschau des Schriftmusters von TeX Gyre Bonum](./src/img/font_previews/TexGyreBonum.svg)
![Vorschau des Schriftmusters von TeX Gyre Cursor](./src/img/font_previews/TexGyreCursor.svg)
![Vorschau des Schriftmusters von TeX Gyre Heros](./src/img/font_previews/TexGyreHeros.svg)

## Cormorant Garamond
https://github.com/CatharsisFonts/Cormorant

Kannte sie nicht vor Teuderun und mag sie sehr.

![Vorschau des Cormorant Garamond Schriftmusters](./src/img/font_previews/Cormorant.svg)

## Libre Caslon Text
https://github.com/impallari/Libre-Caslon-Text/

Caslon-Klon, speziell optimiert für Fließtext im Web. Auch verfügbar als [Libre Caslon Display](https://github.com/impallari/Libre-Caslon-Display/)

![Vorschau des Libre Caslon Text Schriftmusters](./src/img/font_previews/LibreCaslon.svg)

# Sehr schön zu haben

## Titillium
http://nta.accademiadiurbino.it/titillium/

Für wenn man einen etwas anderen Look braucht.

![Vorschau des Titillium Schriftmusters](./src/img/font_previews/TitillumWeb.svg)

## Jost
https://github.com/indestructible-type/Jost

Ein etwas eleganteres Futura

![Vorschau des Jost* Schriftmusters](./src/img/font_previews/Jost.svg)

## Overpass
https://overpassfont.org/

Open-Source-Schrift, inspiriert von Highway Gothic auf amerikanischen Straßenschildern.

![Vorschau des Overpass Schriftmusters](./src/img/font_previews/Overpass.svg)

# Nichtproportional

## JetBrains Mono
https://github.com/jetbrains/jetbrainsmono

Sie ist einfach angenehm für meine Augen.

![Vorschau des JetBrains Mono Schriftmusters](./src/img/font_previews/JetBrainsMono.svg)

## Maple Mono
https://font.subf.dev/en/download/

Ich versuche, mich mit ihr anzufreunden.

![Vorschau des Maple Mono Regular Schriftmusters](./src/img/font_previews/MapleMono.svg)

## Fira Code
https://github.com/tonsky/FiraCode

Meine frühere Monospace-Schrift. Ich lasse sie schweren Herzens hinter mir, aber JetBrains Mono ist einfach angenehmer anzuschauen.

![Vorschau des Fira Code Regular Schriftmusters](./src/img/font_previews/FiraCode.svg)

## Cascadia Code
https://github.com/microsoft/cascadia-code

Eigentlich nur wegen der kursiven Variante für Kommentare.

![Vorschau des Cascadia Code Kursiv-Kommentars](./src/img/font_previews/CascadiaCode.svg)

## 0xProto
https://github.com/0xType/0xProto

![Vorschau des Schriftmusters von 0xProto](./src/img/font_previews/0xProto.svg)

## Courier Prime
https://quoteunquoteapps.com/courierprime/

![Vorschau des Schriftmusters von Courier Prime](./src/img/font_previews/CourierPrime.svg)

## Departure Mono
https://departuremono.com

![Vorschau des Schriftmusters von Departure Mono](./src/img/font_previews/DepartureMono.svg)

## Geist Mono
https://github.com/vercel/geist-font

![Vorschau des Schriftmusters von Geist Mono](./src/img/font_previews/GeistMono.svg)

## Hack
https://github.com/source-foundry/Hack

![Vorschau des Schriftmusters von Hack](./src/img/font_previews/Hack.svg)

## IBM Plex Mono
https://github.com/IBM/plex

![Vorschau des Schriftmusters von IBM Plex Mono](./src/img/font_previews/IBMPlexMono.svg)

## Libertinus Mono
https://github.com/alerque/libertinus

![Vorschau des Schriftmusters von Libertinus Mono](./src/img/font_previews/LibertinusMono.svg)

## Recursive
https://www.recursive.design

![Vorschau des Schriftmusters von Recursive](./src/img/font_previews/Recursive.svg)

## Source Code Pro
https://github.com/adobe-fonts/source-code-pro

![Vorschau des Schriftmusters von Source Code Pro](./src/img/font_previews/SourceCodePro.svg)

## Victor Mono
https://rubjo.github.io/victor-mono/

# Schreibschriften

![Vorschau des Schriftmusters von Victor Mono](./src/img/font_previews/VictorMono.svg)

## Amatic SC
https://fonts.google.com/specimen/Amatic+SC

![Vorschau des Schriftmusters von Amatic SC](./src/img/font_previews/AmaticSC.svg)

## Because We Had To
https://github.com/RedHatOfficial/bwht-fonts

Sechs Handschriften, die Red Hat 2019 für die Artikelserie „Because We Had To" aus der
Handschrift von Freundinnen und Kolleginnen entwickelte: Build, Connect, Create, Learn,
Mentor, Organize. Alle bis auf Learn nutzen `calt`, um wiederkehrende Buchstaben zu variieren.

![Vorschau des Schriftmusters von Because We Build](./src/img/font_previews/BecauseWeBuild.svg)
![Vorschau des Schriftmusters von Because We Connect](./src/img/font_previews/BecauseWeConnect.svg)
![Vorschau des Schriftmusters von Because We Create](./src/img/font_previews/BecauseWeCreate.svg)
![Vorschau des Schriftmusters von Because We Learn](./src/img/font_previews/BecauseWeLearn.svg)
![Vorschau des Schriftmusters von Because We Mentor](./src/img/font_previews/BecauseWeMentor.svg)
![Vorschau des Schriftmusters von Because We Organize](./src/img/font_previews/BecauseWeOrganize.svg)

## Caveat
https://fonts.google.com/specimen/Caveat

![Vorschau des Schriftmusters von Caveat](./src/img/font_previews/Caveat.svg)

## Dancing Script
https://fonts.google.com/specimen/Dancing+Script

![Vorschau des Schriftmusters von Dancing Script](./src/img/font_previews/DancingScript.svg)

## Great Vibes
https://github.com/googlefonts/great-vibes

![Vorschau des Schriftmusters von Great Vibes](./src/img/font_previews/GreatVibes.svg)

## Pacifico
https://fonts.google.com/specimen/Pacifico

![Vorschau des Schriftmusters von Pacifico](./src/img/font_previews/Pacifico.svg)

## Playwrite
https://github.com/TypeTogether/Playwrite

![Vorschau des Schriftmusters von Playwrite](./src/img/font_previews/PlaywriteDELA.svg)

## Sansita Swashed
https://www.omnibus-type.com/fonts/sansitaswashed/

![Vorschau des Schriftmusters von Sansita Swashed](./src/img/font_previews/SansitaSwashed.svg)

## Satisfy
https://fonts.google.com/specimen/Satisfy

![Vorschau des Schriftmusters von Satisfy](./src/img/font_previews/Satisfy.svg)

## Tangerine
https://github.com/googlefonts/TangerineFont

![Vorschau des Schriftmusters von Tangerine](./src/img/font_previews/Tangerine.svg)

## TeX Gyre Chorus
https://www.gust.org.pl/projects/e-foundry/tex-gyre/chorus

# Display

![Vorschau des Schriftmusters von TeX Gyre Chorus](./src/img/font_previews/TexGyreChorus.svg)

## Big Shoulders Display
https://fonts.google.com/specimen/Big+Shoulders+Display

![Vorschau des Schriftmusters von Big Shoulders Display](./src/img/font_previews/BigShouldersDisplay.svg)

## Big Shoulders Stencil
https://github.com/xotypeco/big_shoulders

![Vorschau des Schriftmusters von Big Shoulders Stencil](./src/img/font_previews/BigShouldersStencil.svg)

## Climate Crisis
https://github.com/dancoull/ClimateCrisis

Variable Achse `YEAR` (1979–2050) statt Gewicht: die Buchstaben erodieren mit fortschreitendem
Jahr wie das arktische Meereis.

![Vorschau des Schriftmusters von Climate Crisis](./src/img/font_previews/ClimateCrisis.svg)

## Pixelify Sans
https://github.com/eifetx/Pixelify-Sans

![Vorschau des Schriftmusters von Pixelify Sans](./src/img/font_previews/PixelifySans.svg)

## Saira Stencil One
https://github.com/Omnibus-Type/Saira

![Vorschau des Schriftmusters von Saira Stencil One](./src/img/font_previews/SairaStencilOne.svg)

## Dela Gothic One
https://fonts.google.com/specimen/Dela+Gothic+One

![Vorschau des Schriftmusters von Dela Gothic One](./src/img/font_previews/DelaGothicOne.svg)

## Silkscreen
https://kottke.org/plus/type/silkscreen/

# Blackletter

![Vorschau des Schriftmusters von Silkscreen](./src/img/font_previews/Silkscreen.svg)

## Grenze Gotisch
https://www.omnibus-type.com/fonts/grenze-gotisch/

![Vorschau des Schriftmusters von Grenze Gotisch](./src/img/font_previews/GrenzeGotisch.svg)

## Jacquarda Bastarda 9
https://github.com/scfried/soft-type-jacquarda-bastarda

![Vorschau des Schriftmusters von Jacquarda Bastarda 9](./src/img/font_previews/JacquardaBastarda9.svg)

## Grenze
https://www.omnibus-type.com/fonts/grenze/

![Vorschau des Schriftmusters von Grenze](./src/img/font_previews/Grenze.svg)

## Unifraktur
https://unifraktur.sourceforge.net/

![Vorschau des Schriftmusters von Unifraktur](./src/img/font_previews/Unifraktur.svg)

## UnifrakturCook
https://unifraktur.sourceforge.net/

# Nicht Comic Sans

Die _einzige_ angemessene Verwendung von „Comic Sans" laut [Comic Sans Criminal](https://comicsanscriminal.com/):

> * Das Publikum ist unter 11 Jahre alt
> * Man gestaltet einen Comic
> * Das Publikum ist legasthenisch und hat angegeben, Comic Sans zu bevorzugen

Spaß beiseite: Comic Sans verletzt keine Menschen, Menschen verletzen Menschen.

![Vorschau des Schriftmusters von UnifrakturCook](./src/img/font_previews/UnifrakturCook.svg)

## Krikikrak
https://www.carrois.com/typefaces/retail/Krikikrak/

Wenn man schon an _Comic Sans_ denkt – warum nicht gleich das innere Kind voll ausleben und Krikikrak verwenden?

![Vorschau des Krikikrak Schriftmusters](./src/img/font_previews/Krikikrak.svg)

## Komika Hand
https://www.1001fonts.com/komika-font.html

Niemand muss Comic Sans benutzen, aber man könnte auch einfach voll auf Comic-Modus gehen.

![Vorschau des Komika Schriftmusters](./src/img/font_previews/Komika.svg)

## Kalam
https://fonts.google.com/specimen/Kalam

Lieber nicht benutzen. Sie könnte das neue Comic Sans werden ;-)

![Vorschau des Kalam Schriftmusters](./src/img/font_previews/Kalam.svg)

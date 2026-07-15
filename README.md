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

Aktuell **93 Schriften** mit Specimen-Seite, weitere 12 in Planung (ohne Schriftdatei).

### Serif (34 + 9 geplant)
[Alegreya](https://elbym.github.io/font-collection/serif/alegreya.html) · Amstelvar · [Arvo](https://elbym.github.io/font-collection/serif/arvo.html) · [Bitter](https://elbym.github.io/font-collection/serif/bitter.html) · [Bodoni\*](https://elbym.github.io/font-collection/serif/bodoni.html) · Cardo · [Compagnon](https://elbym.github.io/font-collection/serif/compagnon.html) · [Cormorant](https://elbym.github.io/font-collection/serif/cormorant.html) · [Crimson Pro](https://elbym.github.io/font-collection/serif/crimsonpro.html) · [EB Garamond](https://elbym.github.io/font-collection/serif/ebgaramond.html) · [Fraunces](https://elbym.github.io/font-collection/serif/fraunces.html) · [Gambetta](https://elbym.github.io/font-collection/serif/gambetta.html) · Gentium Plus · [GFS Didot](https://elbym.github.io/font-collection/serif/gfsdidot.html) · [Graduate](https://elbym.github.io/font-collection/serif/graduate.html) · [IBM Plex Serif](https://elbym.github.io/font-collection/serif/ibmplexserif.html) · Instrument Serif · [Junicode](https://elbym.github.io/font-collection/serif/junicode.html) · [Libertinus Serif](https://elbym.github.io/font-collection/serif/libertinusserif.html) · [Libre Baskerville](https://elbym.github.io/font-collection/serif/librebaskerville.html) · [Libre Caslon](https://elbym.github.io/font-collection/serif/librecaslon.html) · [Literata](https://elbym.github.io/font-collection/serif/literata.html) · [Lora](https://elbym.github.io/font-collection/serif/lora.html) · [Merriweather](https://elbym.github.io/font-collection/serif/merriweather.html) · [Mozilla Headline](https://elbym.github.io/font-collection/serif/mozillaheadline.html) · [Newsreader](https://elbym.github.io/font-collection/serif/newsreader.html) · [Piazzolla](https://elbym.github.io/font-collection/serif/piazzolla.html) · [Playfair](https://elbym.github.io/font-collection/serif/playfair.html) · Quattrocento · Reforma · Roslindale · Sentient · Sorts Mill Goudy · [Source Serif](https://elbym.github.io/font-collection/serif/sourceserif.html) · [Spectral](https://elbym.github.io/font-collection/serif/spectral.html) · [STIX Two](https://elbym.github.io/font-collection/serif/stixtwo.html) · [Tex Gyre Bonum](https://elbym.github.io/font-collection/serif/texgyrebonum.html) · [Tex Gyre Pagella](https://elbym.github.io/font-collection/serif/texgyrepagella.html) · [Tex Gyre Schola](https://elbym.github.io/font-collection/serif/texgyreschola.html) · [Tex Gyre Termes](https://elbym.github.io/font-collection/serif/texgyretermes.html) · [Unna](https://elbym.github.io/font-collection/serif/unna.html) · [Vollkorn](https://elbym.github.io/font-collection/serif/vollkorn.html) · [Zodiak](https://elbym.github.io/font-collection/serif/zodiak.html)

### Sans-Serif (33 + 1 geplant)
[Amstelvar](https://elbym.github.io/font-collection/sans/amstelvar.html) · [Asap](https://elbym.github.io/font-collection/sans/asap.html) · [Atkinson Hyperlegible Next](https://elbym.github.io/font-collection/sans/atkinsonhyperlegiblenext.html) · [Bricolage Grotesque](https://elbym.github.io/font-collection/sans/bricolagegrotesque.html) · [Cabinet Grotesk](https://elbym.github.io/font-collection/sans/cabinetgrotesk.html) · [Cooper Hewitt](https://elbym.github.io/font-collection/sans/cooperhewitt.html) · [DINish](https://elbym.github.io/font-collection/sans/dinish.html) · DM Sans · [Epilogue](https://elbym.github.io/font-collection/sans/epilogue.html) · [Figtree](https://elbym.github.io/font-collection/sans/figtree.html) · [Fira Sans](https://elbym.github.io/font-collection/sans/firasans.html) · [Geist](https://elbym.github.io/font-collection/sans/geist.html) · [IBM Plex Sans](https://elbym.github.io/font-collection/sans/ibmplexsans.html) · [Jost\*](https://elbym.github.io/font-collection/sans/jost.html) · [League Spartan](https://elbym.github.io/font-collection/sans/leaguespartan.html) · [Libertinus Sans](https://elbym.github.io/font-collection/sans/libertinussans.html) · [Libre Franklin](https://elbym.github.io/font-collection/sans/librefranklin.html) · [Manrope](https://elbym.github.io/font-collection/sans/manrope.html) · [Metropolis](https://elbym.github.io/font-collection/sans/metropolis.html) · [Mozilla Text](https://elbym.github.io/font-collection/sans/mozillatext.html) · [Overpass](https://elbym.github.io/font-collection/sans/overpass.html) · [Playpen Sans](https://elbym.github.io/font-collection/sans/playpensans.html) · [Public Sans](https://elbym.github.io/font-collection/sans/publicsans.html) · [Raleway](https://elbym.github.io/font-collection/sans/raleway.html) · [Roboto Flex](https://elbym.github.io/font-collection/sans/robotoflex.html) · [Routed Gothic](https://elbym.github.io/font-collection/sans/routedgothic.html) · [Satoshi](https://elbym.github.io/font-collection/sans/satoshi.html) · [Source Sans](https://elbym.github.io/font-collection/sans/sourcesans.html) · [Space Grotesk](https://elbym.github.io/font-collection/sans/spacegrotesk.html) · [Tex Gyre Adventor](https://elbym.github.io/font-collection/sans/texgyreadventor.html) · [Tex Gyre Heros](https://elbym.github.io/font-collection/sans/texgyreheros.html) · [Titillum Web](https://elbym.github.io/font-collection/sans/titillumweb.html) · [Urbanist](https://elbym.github.io/font-collection/sans/urbanist.html) · [Work Sans](https://elbym.github.io/font-collection/sans/worksans.html)

### Monospace (9 + 1 geplant)
[0xProto](https://elbym.github.io/font-collection/monospace/0xproto.html) · [Cascadia Code](https://elbym.github.io/font-collection/monospace/cascadiacode.html) · [Departure Mono](https://elbym.github.io/font-collection/monospace/departuremono.html) · [Fira Code](https://elbym.github.io/font-collection/monospace/firacode.html) · Geist Mono · [Hack](https://elbym.github.io/font-collection/monospace/hack.html) · [JetBrains Mono](https://elbym.github.io/font-collection/monospace/jetbrainsmono.html) · [Maple Mono](https://elbym.github.io/font-collection/monospace/maplemono.html) · [Recursive](https://elbym.github.io/font-collection/monospace/recursive.html) · [Victor Mono](https://elbym.github.io/font-collection/monospace/victormono.html)

### Script / Handschrift (7)
[Amatic SC](https://elbym.github.io/font-collection/script/amaticsc.html) · [Caveat](https://elbym.github.io/font-collection/script/caveat.html) · [Dancing Script](https://elbym.github.io/font-collection/script/dancingscript.html) · [Pacifico](https://elbym.github.io/font-collection/script/pacifico.html) · [Playwrite](https://elbym.github.io/font-collection/script/playwritedela.html) · [Sansita Swashed](https://elbym.github.io/font-collection/display/sansitaswashed.html) · [Satisfy](https://elbym.github.io/font-collection/script/satisfy.html)

### Blackletter (3 + 1 geplant)
Fette Fraktur · [Grenze](https://elbym.github.io/font-collection/blackletter/grenze.html) · [Grenze Gotisch](https://elbym.github.io/font-collection/blackletter/grenzegotisch.html) · [Unifraktur](https://elbym.github.io/font-collection/blackletter/unifraktur.html)

### Display (4)
[Big Shoulders Display](https://elbym.github.io/font-collection/display/bigshouldersdisplay.html) · [Dela Gothic One](https://elbym.github.io/font-collection/display/delagothicone.html) · [Mixal](https://elbym.github.io/font-collection/display/mixal.html) · [Silkscreen](https://elbym.github.io/font-collection/display/silkscreen.html)

### Nicht Comic Sans (3)
[Kalam](https://elbym.github.io/font-collection/script/kalam.html) · [Komika](https://elbym.github.io/font-collection/script/komika.html) · [Krikikrak](https://elbym.github.io/font-collection/script/krikikrak.html)

---
* Serifenschriften
  - [Literata](#literata)
  - [IBM Plex Serif](#ibm-plex-serif)
  - [Libertinus](#libertinus)
  - [Alegreya](#alegreya)
  - [Arvo](#arvo)
  - [Bitter](#bitter)
  - [Bodoni*](#bodoni)
  - [Cardo](#cardo)
  - [Compagnon](#compagnon)
  - [Crimson Pro](#crimson-pro)
  - [EB Garamond](#eb-garamond)
  - [Fraunces](#fraunces)
  - [Gambetta](#gambetta)
  - [Gentium Plus](#gentium-plus)
  - [GFS Didot](#gfs-didot)
  - [Instrument Serif](#instrument-serif)
  - [Junicode](#junicode)
  - [Libre Baskerville](#libre-baskerville)
  - [Lora](#lora)
  - [Merriweather](#merriweather)
  - [Mozilla Headline](#mozilla-headline)
  - [Newsreader](#newsreader)
  - [Piazzolla](#piazzolla)
  - [Playfair](#playfair)
  - [Quattrocento](#quattrocento)
  - [Reforma](#reforma)
  - [Roslindale](#roslindale)
  - [Sentient](#sentient)
  - [Sorts Mill Goudy](#sorts-mill-goudy)
  - [Source Serif](#source-serif)
  - [Spectral](#spectral)
  - [STIX Two](#stix-two)
  - [Unna](#unna)
  - [Vollkorn](#vollkorn)
  - [Zodiak](#zodiak)
* Serifenlose Schriften
  - [Atkinson Hyperlegible](#atkinson-hyperlegible)
  - [Inter](#inter)
  - [Metropolis](#metropolis)
  - [IBM Plex Sans](#ibm-plex-sans)
  - [Fira Sans](#fira-sans)
  - [Amstelvar](#amstelvar)
  - [Asap](#asap)
  - [Barlow](#barlow)
  - [Bricolage Grotesque](#bricolage-grotesque)
  - [Cabinet Grotesk](#cabinet-grotesk)
  - [Chivo](#chivo)
  - [DINish](#dinish)
  - [DM Sans](#dm-sans)
  - [Encode Sans](#encode-sans)
  - [Epilogue](#epilogue)
  - [Figtree](#figtree)
  - [Geist](#geist)
  - [Junction](#junction)
  - [League Spartan](#league-spartan)
  - [Lexend](#lexend)
  - [Libertinus Sans](#libertinus-sans)
  - [Manrope](#manrope)
  - [Mozilla Text](#mozilla-text)
  - [Nunito](#nunito)
  - [Oswald](#oswald)
  - [Outfit](#outfit)
  - [Playpen Sans](#playpen-sans)
  - [Plus Jakarta Sans](#plus-jakarta-sans)
  - [Public Sans](#public-sans)
  - [Raleway](#raleway)
  - [Roboto Flex](#roboto-flex)
  - [Routed Gothic](#routed-gothic)
  - [Satoshi](#satoshi)
  - [Source Sans](#source-sans)
  - [Space Grotesk](#space-grotesk)
  - [Syne](#syne)
  - [Urbanist](#urbanist)
  - [Work Sans](#work-sans)
* Die klassischen Pflichtschriften
  - [Tex Gyre Collection](#tex-gyre)
  - [Cormorant Garamond](#cormorant-garamond)
  - [Libre Caslon](#libre-caslon-text)
* Sehr schön zu haben
  - [Titillium](#titillium)
  - [Jost](#jost)
  - [Overpass](#overpass)
* Nichtproportionale Schriften
  - [JetBrains Mono](#jetbrains-mono)
  - [Maple Mono](#maple-mono)
  - [Fira Code](#fira-code)
  - [Cascadia Code](#cascadia-code)
  - [0xProto](#0xproto)
  - [Commit Mono](#commit-mono)
  - [Departure Mono](#departure-mono)
  - [Geist Mono](#geist-mono)
  - [Hack](#hack)
  - [Monaspace](#monaspace)
  - [Recursive](#recursive)
  - [Space Mono](#space-mono)
  - [Victor Mono](#victor-mono)
* Schreibschriften
  - [Amatic SC](#amatic-sc)
  - [Caveat](#caveat)
  - [Dancing Script](#dancing-script)
  - [Pacifico](#pacifico)
  - [Playwrite](#playwrite)
  - [Sansita Swashed](#sansita-swashed)
  - [Satisfy](#satisfy)
* Display
  - [Anton](#anton)
  - [Anybody](#anybody)
  - [Bebas Neue](#bebas-neue)
  - [Big Shoulders Display](#big-shoulders-display)
  - [Dela Gothic One](#dela-gothic-one)
  - [Silkscreen](#silkscreen)
* Blackletter
  - [Fette Fraktur](#fette-fraktur)
  - [Grenze Gotisch](#grenze-gotisch)
  - [Grenze](#grenze)
  - [Unifraktur](#unifraktur)
* Nicht Comic Sans
  - [Krikikrak](#krikikrak)
  - [Komika Hand](#komika-hand)
  - [Kalam](#kalam)

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


# Serifenschriften

## Literata
https://www.type-together.com/literata-font

Kannte sie nicht, bevor ich bei Teuderun darauf gestoßen bin – und ich mag sie sehr. Die Familie besteht aus:
* Literata Display
* Literata Subhead
* Literata Text

![Vorschau des Literata TT Text Regular Schriftmusters](./src/img/font_previews/Literata.png)

## IBM Plex Serif
https://github.com/IBM/plex

Ich mag die IBM-Plex-Schriften sehr. Sie treffen den klassischen Look und sind gut lesbar. Mit einem Hauch „Tech-Feeling".

![Vorschau des IBM Plex Serif Schriftmusters](./src/img/font_previews/IBM_Plex_Serif.png)

## Libertinus
https://github.com/alerque/libertinus

Libertinus ist der Nachfolger von Linux Libertine aus der TeX-Gyre-Sammlung. Die Familie besteht aus:
* Libertinus Serif
* Libertinus Serif Display
* Libertinus Sans

![Vorschau des Libertinus Serif Schriftmusters](./src/img/font_previews/Libertinus_Serif.png)

## Alegreya
https://htfonts.com/en/fonts/alegreya-sans/

## Arvo
https://github.com/antonxheight/Arvo

## Bitter
https://fonts.google.com/specimen/Bitter

## Bodoni*
https://github.com/indestructible-type/Bodoni

## Cardo
https://fonts.google.com/specimen/Cardo

## Compagnon
https://compagnon.eesab.fr/

## Crimson Pro
https://github.com/Fonthausen/CrimsonPro

## EB Garamond
https://googlefonts.github.io/ebgaramond-specimen

## Fraunces
https://github.com/undercasetype/Fraunces

## Gambetta
https://www.fontshare.com/fonts/gambetta

## Gentium Plus
https://software.sil.org/gentium

## GFS Didot
https://greekfontsociety-gfs.gr/typefaces/19th_century

## Instrument Serif
https://fonts.google.com/specimen/Instrument+Serif

## Junicode
https://github.com/psb1558/Junicode-font

## Libre Baskerville
https://github.com/impallari/Libre-Baskerville

## Lora
https://github.com/cyrealtype/Lora-Cyrillic

## Merriweather
https://github.com/SorkinType/Merriweather

## Mozilla Headline
https://github.com/mozilla/mozilla-type-family

## Newsreader
https://github.com/productiontype/Newsreader

## Piazzolla
https://github.com/huertatipografica/piazzolla

## Playfair
https://www.forthehearts.net/playfair

## Quattrocento
https://fonts.google.com/specimen/Quattrocento

## Reforma
https://pampatype.com/reforma

## Roslindale
https://fonts.google.com/specimen/Roslindale

## Sentient
https://www.fontshare.com/fonts/sentient

## Sorts Mill Goudy
https://fonts.google.com/specimen/Sorts+Mill+Goudy

## Source Serif
https://adobe-fonts.github.io/source-serif/

## Spectral
https://github.com/productiontype/Spectral

## STIX Two
https://www.stixfonts.org

## Unna
https://www.omnibus-type.com/fonts/unna/

## Vollkorn
http://vollkorn-typeface.com/

## Zodiak
https://www.fontshare.com/fonts/zodiak

# Serifenlose Schriften

## Atkinson Hyperlegible
https://www.brailleinstitute.org/freefont/

Nomen est omen. Sehr gut lesbar. Ich mag sie und sie wächst mir immer mehr ans Herz.

Entwickelt vom Braille Institute of America ist diese Schrift darauf ausgelegt, für sehbehinderte Leser besonders gut lesbar zu sein – alle Zeichen sind so unterschiedlich wie möglich gestaltet.

![Vorschau des Atkinson Hyperlegible Schriftmusters](./src/img/font_previews/Atkinson_Hyperlegible_Next.png)

## Inter
https://rsms.me/inter/

Wie die Website es beschreibt: „Der Standard des 21. Jahrhunderts". Hat sogar eine schöne URL. Auch als Variable Font verfügbar.

![Vorschau des Inter Schriftmusters](./src/img/font_previews/Inter_Variable.png)

## Metropolis
https://github.com/dw5/Metropolis

Diese mag ich für Überschriften und größeren Text.

![Vorschau des Metropolis Schriftmusters](./src/img/font_previews/Metropolis.png)

## IBM Plex Sans
https://github.com/IBM/plex

Die IBM-Plex-Schriftfamilie ist einfach eine schöne und sehr gut lesbare Schrift.

![Vorschau des IBM Plex Sans Schriftmusters](./src/img/font_previews/IBM_Plex_Sans.png)

## Fira Sans
https://mozilla.github.io/Fira/

Im Auftrag der Mozilla Foundation und Telefonica S.A. für deren mobiles Betriebssystem entwickelt. Erinnert sehr an Erik Spiekermanns „FF Meta".

![Vorschau des Fira Sans Schriftmusters](./src/img/font_previews/Fira_Sans.png)

## Amstelvar
https://github.com/googlefonts/amstelvar

## Asap
https://www.omnibus-type.com/fonts/asap/

## Barlow
https://fonts.google.com/specimen/Barlow

## Bricolage Grotesque
https://ateliertriay.github.io/bricolage/

## Cabinet Grotesk
https://www.fontshare.com/fonts/cabinet-grotesk

## Chivo
https://fonts.google.com/specimen/Chivo

## DINish
https://github.com/playbeing/dinish

## DM Sans
https://fonts.google.com/specimen/DM+Sans

## Encode Sans
https://fonts.google.com/specimen/Encode+Sans

## Epilogue
https://github.com/Etcetera-Type-Co/Epilogue

## Figtree
https://www.erikdkennedy.com/projects/figtree.html

## Geist
https://vercel.com/font

## Junction
https://theleagueofmoveabletype.com/junction

## League Spartan
https://theleagueofmoveabletype.com/league-spartan

## Lexend
https://fonts.google.com/specimen/Lexend

## Libertinus Sans
https://github.com/alerque/libertinus

## Manrope
https://fonts.google.com/specimen/Manrope

## Mozilla Text
https://github.com/mozilla/mozilla-type-family

## Nunito
https://github.com/googlefonts/NunitoSans

## Oswald
https://fonts.google.com/specimen/Oswald

## Outfit
https://fonts.google.com/specimen/Outfit

## Playpen Sans
https://fonts.google.com/specimen/Playpen+Sans

## Plus Jakarta Sans
https://fonts.google.com/specimen/Plus+Jakarta+Sans

## Public Sans
https://github.com/uswds/public-sans

## Raleway
https://github.com/impallari/Raleway

## Roboto Flex
https://fonts.google.com/specimen/Roboto+Flex

## Routed Gothic
https://webonastick.com/fonts/routed-gothic/

## Satoshi
https://www.fontshare.com/fonts/satoshi

## Source Sans
https://adobe-fonts.github.io/source-sans/

## Space Grotesk
https://floriankarsten.github.io/space-grotesk/

## Syne
https://fonts.google.com/specimen/Syne

## Urbanist
https://fonts.google.com/specimen/Urbanist

## Work Sans
https://weiweihuanghuang.github.io/Work-Sans/

# Die Klassiker
Das sind einfach die Klassiker.

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

![Vorschau des Tex Gyre Adventor Schriftmusters](./src/img/font_previews/TeX_Gyre_Termes.png)
![Vorschau des Tex Gyre Bonum Schriftmusters](./src/img/font_previews/TeX_Gyre_Schola.png)
![Vorschau des Tex Gyre Cursor Schriftmusters](./src/img/font_previews/TeX_Gyre_Pagella.png)
![Vorschau des Tex Gyre Heros Schriftmusters](./src/img/font_previews/TeX_Gyre_Heros.png)
![Vorschau des Tex Gyre Pagella Schriftmusters](./src/img/font_previews/TeX_Gyre_Cursor.png)
![Vorschau des Tex Gyre Schola Schriftmusters](./src/img/font_previews/TeX_Gyre_Adventor.png)
![Vorschau des Tex Gyre Termes Schriftmusters](./src/img/font_previews/TeX_Gyre_Bonum.png)

## Cormorant Garamond
https://github.com/CatharsisFonts/Cormorant

Kannte sie nicht vor Teuderun und mag sie sehr.

![Vorschau des Cormorant Garamond Schriftmusters](./src/img/font_previews/Cormorant_Garamond.png)

## Libre Caslon Text
https://github.com/impallari/Libre-Caslon-Text/

Caslon-Klon, speziell optimiert für Fließtext im Web. Auch verfügbar als [Libre Caslon Display](https://github.com/impallari/Libre-Caslon-Display/)

![Vorschau des Libre Caslon Text Schriftmusters](./src/img/font_previews/Libre_Caslon_Text.png)

# Sehr schön zu haben

## Titillium
http://nta.accademiadiurbino.it/titillium/

Für wenn man einen etwas anderen Look braucht.

![Vorschau des Titillium Schriftmusters](./src/img/font_previews/Titillium_Web.png)

## Jost
https://github.com/indestructible-type/Jost

Ein etwas eleganteres Futura

![Vorschau des Jost* Schriftmusters](./src/img/font_previews/Jost_.png)

## Overpass
https://overpassfont.org/

Open-Source-Schrift, inspiriert von Highway Gothic auf amerikanischen Straßenschildern.

![Vorschau des Overpass Schriftmusters](./src/img/font_previews/Overpass.png)

# Nichtproportional

## JetBrains Mono
https://github.com/jetbrains/jetbrainsmono

Sie ist einfach angenehm für meine Augen.

![Vorschau des JetBrains Mono Schriftmusters](./src/img/font_previews/JetBrains_Mono.png)

## Maple Mono
https://font.subf.dev/en/download/

Ich versuche, mich mit ihr anzufreunden.

![Vorschau des Maple Mono Regular Schriftmusters](./src/img/font_previews/Maple_Mono.png)

## Fira Code
https://github.com/tonsky/FiraCode

Meine frühere Monospace-Schrift. Ich lasse sie schweren Herzens hinter mir, aber JetBrains Mono ist einfach angenehmer anzuschauen.

![Vorschau des Fira Code Regular Schriftmusters](./src/img/font_previews/Fira_Code.png)

## Cascadia Code
https://github.com/microsoft/cascadia-code

Eigentlich nur wegen der kursiven Variante für Kommentare.

![Vorschau des Cascadia Code Kursiv-Kommentars](./src/img/font_previews/Cascadia_Code.png)

## 0xProto
https://github.com/0xType/0xProto

## Commit Mono
https://commitmono.com/

## Departure Mono
https://departuremono.com

## Geist Mono
https://github.com/vercel/geist-font

## Hack
https://github.com/source-foundry/Hack

## Monaspace
https://monaspace.githubnext.com

## Recursive
https://www.recursive.design

## Space Mono
https://fonts.google.com/specimen/Space+Mono

## Victor Mono
https://rubjo.github.io/victor-mono/

# Schreibschriften

## Amatic SC
https://fonts.google.com/specimen/Amatic+SC

## Caveat
https://fonts.google.com/specimen/Caveat

## Dancing Script
https://fonts.google.com/specimen/Dancing+Script

## Pacifico
https://fonts.google.com/specimen/Pacifico

## Playwrite
https://github.com/TypeTogether/Playwrite

## Sansita Swashed
https://www.omnibus-type.com/fonts/sansitaswashed/

## Satisfy
https://fonts.google.com/specimen/Satisfy

# Display

## Anton
https://fonts.google.com/specimen/Anton

## Anybody
https://fonts.google.com/specimen/Anybody

## Bebas Neue
https://fonts.google.com/specimen/Bebas+Neue

## Big Shoulders Display
https://fonts.google.com/specimen/Big+Shoulders+Display

## Dela Gothic One
https://fonts.google.com/specimen/Dela+Gothic+One

## Silkscreen
https://fonts.google.com/specimen/Silkscreen

# Blackletter

## Fette Fraktur
https://fonts.google.com/specimen/Fette+Fraktur

## Grenze Gotisch
https://www.omnibus-type.com/fonts/grenze-gotisch/

## Grenze
https://www.omnibus-type.com/fonts/grenze/

## Unifraktur
https://unifraktur.sourceforge.net/

# Nicht Comic Sans

Die _einzige_ angemessene Verwendung von „Comic Sans" laut [Comic Sans Criminal](https://comicsanscriminal.com/):

> * Das Publikum ist unter 11 Jahre alt
> * Man gestaltet einen Comic
> * Das Publikum ist legasthenisch und hat angegeben, Comic Sans zu bevorzugen

Spaß beiseite: Comic Sans verletzt keine Menschen, Menschen verletzen Menschen.

## Krikikrak
https://www.carrois.com/typefaces/retail/Krikikrak/

Wenn man schon an _Comic Sans_ denkt – warum nicht gleich das innere Kind voll ausleben und Krikikrak verwenden?

![Vorschau des Krikikrak Schriftmusters](./src/img/font_previews/Krikikrak_Tape.png)

## Komika Hand
https://www.1001fonts.com/komika-font.html

Niemand muss Comic Sans benutzen, aber man könnte auch einfach voll auf Comic-Modus gehen.

![Vorschau des Komika Schriftmusters](./src/img/font_previews/Komika_Hand.png)

## Kalam
https://fonts.google.com/specimen/Kalam

Lieber nicht benutzen. Sie könnte das neue Comic Sans werden ;-)

![Vorschau des Kalam Schriftmusters](./src/img/font_previews/Kalam.png)

![](preview.png)

# Personal collection of (mostly free) fonts

> Everyone has a favorite font, right? RIGHT!?

This is just a personal and opinionated collection of fonts that stuck with me and an excuse to show off the [font_specimen_generator.py](./font_specimen_generator.py) (I asked Claude to cobble together). This list is also influenced by [Teuderun](https://www.teuderun.de/schriftarten/top-10/).


## Basic usage

* place your fonts in src/webfonts/[font-style]/[font]
* place some backgrounds in src/img/background
  * optinal place per font backgrounds in src/webfonts/[font-style]/[font]/background

### Run local server
    git clone
    npm install
    gulp            # run local dev server
    gulp ghpages    # build site with path prefix for github pages

## Below: old specimen with python as images

### Table of Fonts
> List of Font. In no specific order.

* Serif fonts
  - [Literata](#literata)
  - [IBM Plex Serif](#ibm-plex-serif)
  - [Libertinus](#libertinus)
* Sans Serif font
  - [Atkinson Hyperlegible](#atkinson-hyperlegible)
  - [Inter](#inter)
  - [Metropolis](#metropolis)
  - [IBM Plex Sans](#ibm-plex-sans)
  - [Fira Sans](#fira-sans)
* The classic must haves
  - [Tex Gyre Collection](#tex-gyre)
  - [Cormorant Garamond](#cormorant-garamond)
  - [Libre Caslon](#libre-caslon-text)
* Very nice to have
  - [Titillium](#titillium)
  - [Jost](#jost)
  - [Overpass](#overpass)
* Mono spaced fonts
  - [JetBrains Mono](#jetbrains-mono)
  - [Maple Mono](#maple-mono)
  - [Fira Code](#fira-code)
  - [Cascadia Code](#cascadia-code)
* Not Comic Sans
  - [Krikikrak](#krikikrak)
  - [Hand of Sean](#hand-of-sean)
  - [Komike Hand](#komika-hand)
  - [Kalam](#kalam)

# Tools
## Font Freeze
[FontFreeze](https://github.com/MuTsunTsai/fontfreeze): When you need a font feature be enabled by default or completely removed from a font. I used it to generate a version of "Cascadia Code" with the [SS01](https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt#ssxx) "baked in".

## python font_specimen_generator.py

Asked Claude to cobble together a python script to generate the font specimen preview inspired by the ones on [Wikipedia](https://commons.wikimedia.org/wiki/Category:Typeface_samples_(Font_Specimen_Creator);_raster_graphics)

![Preview of the Sample Wikipedia font specimen](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Adobe_Caslon.png/250px-Adobe_Caslon.png)

Currently supports 3 different themes: cream, dark, white

Examples:

    python font_specimen_generator.py --input ./fonts --output ./previews
    python font_specimen_generator.py --input ./fonts --output ./previews --theme white
    python font_specimen_generator.py --input ./fonts --output ./previews --width 1400 --theme cream
    python font_specimen_generator.py --input ./fonts --output ./previews --overwrite


# Serif Fonts

## Literata
https://www.type-together.com/literata-font

I didn't know of it before I stumbled across Teuderun and I like it a lot.The famlily consists of:
- Literata Display
- Literata Subhead
- Literata Text

![Preview of the Literata TT font specimen font specimen](./previews/cream/Literata_TT_Text_Regular.png)

## IBM Plex Serif
https://github.com/IBM/plex

I like the IBM Plex fonts a lot. They nail the classic look and are easy to read. Sprinkled with a bit of "tech feel".

![Preview of the IBM Plex Serif font specimen](./previews/light/IBM_Plex_Serif_Regular.png)

## Libertinus
https://github.com/alerque/libertinus

Libertinus is the succesor to Linux Liberine from the TeX Gyre collection. The famlily consists of:
- Libertinus Serif
- Libertinus Serif Display
- Libertinus Sans

![Preview of the Libertinus Serif font specimen](./previews/cream/Libertinus_Serif_Regular.png)

# Sans Serif Fonts

## Atkinson Hyperlegible
https://www.brailleinstitute.org/freefont/

Nomen et omen. Very readable. I like it and its growing on me.

Developed by the Braille Institute of America this font is intended to be easily readable for readers who are partially blind, with all characters being as different from each other as possible.

![Preview of the Atkinso Hyperlegible font specimen](./previews/light/Atkinson_Hyperlegible_Next_Regular.png)

## Inter
https://rsms.me/inter/

As the website puts it: "The 21st century standard". It even has a nice URL. Also available as a variable font.

![Preview of the Inter font specimen](./previews/light/Inter_Regular.png)

## Metropolis
https://github.com/dw5/Metropolis

I like this one for headers and larger text.

![Preview of the Metropolis font specimen](./previews/light/Metropolis_Regular.png)

## IBM Plex Sans
https://github.com/IBM/plex

The IBM Plex font family is just a nice and very readable font.

![Preview of the IBM Plex Sans font specimen](./previews/light/IBM_Plex_Sans_Regular.png)

## Fira Sans
https://mozilla.github.io/Fira/

Comissioned by The Mozilla Foundation and Telefonica S.A for their mobile OS. Very similar to Erik Spiekermanns "FF Meta".

![Preview of the Fira Sans font specimen](./previews/light/Fira_Sans_Regular.png)

# The classics
These are just the classics.

## Tex Gyre

https://www.gust.org.pl/projects/e-foundry/tex-gyre/

Free alternatives for:
* Times (New) Roman → TeX Gyre Termes
* ITC Avantgarde → TeX Gyre Adventor
* Century Schoolbook → TeX Gyre Schola
* Palatino → Pagella
* ITC Zapf Chancery(R) → Tex Gyre Chorus
* ITC Bookman → TeX Gyre Bonum
* Courier → TeX Gyre Cursor
* Helvetica → TeX Gyre Heros

![Preview of the Tex Gyre Adventor font specimen](./previews/light/TeX_Gyre_Termes_Regular.png)
![Preview of the Tex Gyre Bonum font specimen](./previews/light/TeX_Gyre_Schola_Regular.png)
![Preview of the Tex Gyre Cursor font specimen](./previews/light/TeX_Gyre_Pagella_Regular.png)
![Preview of the Tex Gyre Heros font specimen](./previews/light/TeX_Gyre_Heros_Regular.png)
![Preview of the Tex Gyre Pagella font specimen](./previews/light/TeX_Gyre_Cursor_Regular.png)
![Preview of the Tex Gyre Schola font specimen](./previews/light/TeX_Gyre_Adventor_Regular.png)
![Preview of the Tex Gyre Termes font specimen](./previews/light/TeX_Gyre_Bonum_Regular.png)

## Cormorant Garamond
https://github.com/CatharsisFonts/Cormorant

Didn't knew of before Teuderun and I like it a lot.

![Preview of the Cormorant Garamond font specimen](./previews/light/Cormorant_Garamond_Regular.png)

## Libre Caslon Text
https://github.com/impallari/Libre-Caslon-Text/
Caslon clone specifically optimized for web body text. Also available as [Libre Caslon Display](https://github.com/impallari/Libre-Caslon-Display/)

![Preview of the Libre Caslon Text font specimen](./previews/cream/Libre_Caslon_Text_Regular.png)

# Very nice to have

## Titillium
http://nta.accademiadiurbino.it/titillium/

For when you need a slightly different look.

![Preview of the Titillium font specimen](./previews/cream/Titillium_Web_Regular.png)

## Jost
https://github.com/indestructible-type/Jost

A little more fancy Futura

![Preview of the Jost* font specimen](./previews/cream/Jost__Book.png)

## Overpass
https://overpassfont.org/

Open-source font inspired by Highway Gothic on american road signs.

![Preview of the Overpass font specimen](./previews/cream/Overpass_Regular.png)

# Monospaced

## JetBrains Mono
https://github.com/jetbrains/jetbrainsmono

It's just pleasant to my eyes.

![Preview of the JetBrains Mono font specimen](./previews/dark/JetBrains_Mono_Regular.png)

## Maple Mono
https://font.subf.dev/en/download/

I'm tying to befriend it.

![Preview of the Maple Mono Regular font specimen](./previews/dark/Maple_Mono_Regular.png)

## Fira Code
https://github.com/tonsky/FiraCode

My former monotype font. I sadly leave it behind, but JetBrains Mono is just nicer to stare at.

![Preview of the Fira Code Regular font specimen](./previews/dark/Fira_Code_Regular.png)

## Cascadia Code
https://github.com/microsoft/cascadia-code

Basically just for its cursive variant for the comments.

![Preview of the Code comment in Cascadia Code cursive](./screenshots/Cascadia_Code_Cursive.png)


# Not Comic Sans

The _only_ appropriate use of "Comic Sans" according to [Comic Sans Criminal](https://comicsanscriminal.com/):

> * Your audience is under 11 years old
> * You're designing a comic
> * Your audience is dyslexic and has stated that they prefer comic sans

Jokes aside: Comic Sasn doesn't hurt people, people hurt people.

## Krikikrak
https://www.carrois.com/typefaces/retail/Krikikrak/

If you are thinking _Comic Sans_ why not fully embrace the inner child and use Krikikraki?

![Preview of the Krikikrak font specimen](./previews/cream/Krikikrak_Tape_Regular.png)

## Komika Hand
https://www.1001fonts.com/komika-font.html

Nobody has to use comic sans, but you could go full comic mode.

![Preview of the Komika font specimen](./previews/cream/Komika_Hand_Regular.png)

## Kalam
https://fonts.google.com/specimen/Kalam

Don' use it. It might become the new Comic Sans ;-)

![Preview of the Kalam font specimen](./previews/light/Kalam_Regular.png)








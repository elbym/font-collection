# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal font collection showcase website. Each font gets its own specimen page displaying the typeface in various weights and styles, following the style of Wikipedia font specimens.

## Commands

```bash
# Install dependencies
npm install

# Development server (BrowserSync at http://localhost:3000, with file watching)
npx gulp

# Production build (minified CSS/HTML, no server)
npx gulp build

# GitHub Pages build (adds /font-collection path prefix)
npx gulp ghpages

# Clean dist/
npx gulp clean
```

There is no test suite.

**Python specimen image generator** (requires `pip install Pillow fonttools`):
```bash
python font_specimen_generator.py --input ./src/fonts --output ./previews
python font_specimen_generator.py --input ./src/fonts --output ./previews --theme dark   # dark | white | cream
python font_specimen_generator.py --input ./src/fonts --output ./previews --width 1400 --overwrite
```

**GitHub Pages deploy** (after running `npx gulp ghpages`):
```bash
git add -f dist/ && git commit -m "ghpages deploy" && git subtree push --prefix dist origin gh-pages
```

## Architecture

This is an [Eleventy (11ty)](https://www.11ty.dev/) static site with a Gulp build pipeline layered on top.

### Build Pipeline Order (important)

Eleventy must run **before** Gulp's SCSS compilation because Eleventy generates files needed by Gulp. The pipeline is:

1. Eleventy builds HTML from `src/*.njk` templates → `dist/`
2. Gulp compiles SCSS → `dist/css/`
3. Gulp copies static assets (fonts, images, JS) → `dist/`

### Data Layer (`src/_data/`)

Eleventy global data files auto-populate template variables:

- **`fonts.js`** — Scans `src/fonts/*/` for `.woff2`/`.woff` files and returns a dict keyed by folder name. For each file it parses the filename to extract: font weight (100–900), style (italic/normal), optical size (caption/display/text/etc.), and whether it's a variable font (detected by `variable`, `[wght]`, or `-vf` in the filename). Variable fonts generate 9 entries (one per weight step). This data drives the waterfall section on specimen pages.
- **`fontImages.js`** — Scans `src/fonts/*/` for image files; used to display font-specific preview images.
- **`backgrounds.js`** — Lists images from `src/img/background/`.
- **`site.json`** — Global defaults: panagram text, hero letter/word, site title.

### Template Layer (`src/`)

Each font is a single `.njk` file with YAML frontmatter. All font pages just call `{% include "font-poster.njk" %}` — that include does all the work.

Key frontmatter fields:
```yaml
layout: layouts/base.njk
selectedFontFolder: "FolderNameInSrcFonts"   # must match src/fonts/ subdirectory name
title: Human-readable font name
url: https://font-homepage.example.com
tags: Tag1, Tag2                              # shown as keyword chips
comment: "Description text"
fontauthor: Author Name
fontyear: 2019
heroletter: Ab                               # large CMYK-halftone letter display
heroword: Word                               # large editable hero word
color: steelblue                             # CSS color for accent, overrides --color-base-primary
eleventyNavigation:
  key: Font Name
  family: Sans                               # nav grouping: Sans | Serif | Mono | etc.
```

The `font-poster.njk` template renders: keyword tags → hero letter (CMYK halftone effect) → alphabet/numbers grid → font gallery images → specimen Latin text → weight waterfall (all weights/styles via `fonts[selectedFontFolder]`) → ASCII/Latin character grid.

### CSS Architecture

`src/scss/styles.scss` is the main stylesheet, assembled via `@use` of partials. Fonts are loaded separately.

**Per-font SCSS files** live in `src/scss/fonts/` (gitignored — they are generated artifacts). Each uses the `declare-font` mixin from `_font-mixin.scss`:

```scss
@use "../font-mixin" as *;

@include declare-font(
  'FamilyName',          // font-family name used in CSS
  'FolderName',          // src/fonts/ subfolder
  'FontFile.woff2',      // filename
  400,                   // weight
  'normal',              // style
  true                   // true = variable font (sets font-weight: 100 900)
);

.specimen-poster {
  font-family: 'FamilyName', sans-serif;
}
```

The `base.njk` layout loads `/css/fonts/{{selectedFontFolder}}.css` for the active font only. All per-font SCSS files are also concatenated into `dist/css/all-fonts.css`.

### Adding a New Font

1. Create `src/fonts/FontFamilyName/` and add `.woff2` files with weight/style in the filename (e.g. `FontName-Bold.woff2`, `FontName-LightItalic.woff2`, `FontName[wght].woff2` for variable).
2. Create `src/FontFamilyName.njk` with the frontmatter fields above.
3. Create `src/scss/fonts/FontFamilyName.scss` using `@include declare-font(...)` for each font file.
4. Run `npx gulp` — the font page will appear automatically.

Font weight/style detection in `fonts.js` relies purely on filename parsing, so naming files consistently (e.g. `Family-BoldItalic.woff2`) is important.

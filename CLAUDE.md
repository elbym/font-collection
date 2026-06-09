# CLAUDE.md

## Project overview

A personal font collection website. It scans a folder of `.woff2` font files, generates type specimen pages for each font family, and deploys as a static site to GitHub Pages at `elbym.github.io/font-collection`.

Output: `dist/` — a fully static site with one HTML specimen page per font family, an index of all fonts, and tag filter pages.

---

## Tech stack

| Layer | Tool / Version |
|---|---|
| SSG | Eleventy (`@11ty/eleventy`) 3.1.5 |
| Templates | Nunjucks (`.njk`) |
| CSS | SCSS → compiled by `gulp-sass` (sass 1.99.0) |
| Build | Gulp 5 |
| Dev server | BrowserSync, port 3000 |
| Images | `gulp-sharp-optimize-images` — JPG/PNG → WebP, max 1920px |
| HTML (prod) | `gulp-html-minifier-terser` / `gulp-prettier` |
| Font metadata | `meta.yaml` (parsed with `js-yaml`) |
| JS (browser) | `fitty.min.js` (text auto-fitting, vendor-only) |
| Python tool | `font_specimen_generator.py` — standalone, not part of the build |

---

## Project structure

```
src/
  _data/               # Eleventy data layer (all JS unless noted)
    fonts.js           # MASTER: recursively scans webfonts/, parses filenames + meta.yaml
    fontFolders.js     # fonts().list — all folder nodes (groups + leaves)
    fontLeaves.js      # leaf nodes only (folders that contain .woff2 files)
    fontTags.js        # unique tags across all leaf nodes
    fontImages.js      # gallery images per font folder (from gallery/ subfolders)
    fontBackgrounds.js # per-font card backgrounds (from background/ subfolders)
    fontCodepoints.js  # per-font codepoint map {cp: 1} — reads actual .woff2 via fontkit
    unicodeRanges.js   # static list of named Unicode blocks used for coverage display
    backgrounds.js     # global background images from src/img/background/
    site.json          # global defaults: title, panagram, default heroword/heroletter, paragraph text per size
  _includes/
    layouts/base.njk   # HTML shell — the only layout
    font-card.njk      # card used on index and group pages
    font-poster.njk    # full specimen poster used on leaf pages
    font-image-list.njk
    header.njk / footer.njk / seperator.njk / letters.njk / folderNavigation.njk
  css/
    _dynamic-colors.njk    # Eleventy template → generates src/scss/_includes/_html_colornames.scss
    _generated-fonts.njk   # Eleventy template → generates src/scss/webfonts/<slug>.scss per font
    _generated-borders.njk # Eleventy template → generates src/scss/_includes/_font-borders.scss
  scss/
    styles.scss            # SCSS entry point
    _base/                 # colors, typography, html reset, navigation, footer
    _includes/
      _font-mixin.scss     # @font-face mixin used by generated partials
      _breakpoints.scss
      _modularscale.scss
    _cards.scss
    _font-poster.scss
    webfonts/              # AUTO-GENERATED — never edit (gitignored)
  js/
    fitty.min.js
  webfonts/                # Font files, organised by category
    sans/ serif/ mono/ blackletter/ comicsans/ fancy/
    meta.yaml              # group-level metadata (optional)
  img/
    background/            # global card backgrounds (gitignored except sample.webp)
    borders/               # master border SVGs (root level only); color variants generated to dist/ by Gulp
  index.njk                # homepage — lists all leaf nodes as cards
  specimen.njk             # paginated over fontFolders; one page per node
  tag.njk                  # paginated over fontTags; one page per tag
  alternatives.njk
dist/                      # BUILD OUTPUT — never edit (gitignored)
```

---

## Development workflow

```bash
# Install
npm install

# Dev server (clean → build → serve + watch, port 3000)
npx gulp

# Production build (clean → build → minify HTML)
npx gulp build

# GitHub Pages build (adds --pathprefix=font-collection, beautifies HTML)
npx gulp ghpages

# Clean dist/
npx gulp clean

# Deploy to gh-pages branch (dist/ is gitignored, so subtree push doesn't work)
cd dist && git init && git add -A && git commit -m "deploy" && git push git@github.com:elbym/font-collection.git HEAD:gh-pages --force && cd ..
```

Eleventy outputs to `dist/`, then Gulp compiles SCSS and copies assets on top. The watch task re-runs Eleventy on any `.njk`, `.md`, `.html`, or `_data/**/*.js` change, then reloads BrowserSync.

---

## Key conventions

**Font folder naming**
- One folder per font family inside a category folder: `src/webfonts/<category>/<FamilyName>/`
- Category folders (`sans`, `serif`, `mono`, etc.) can have their own `meta.yaml` for group metadata.

**Font file naming**
- Files must be `.woff2` (or `.woff`).
- `fonts.js` parses weight (`Regular`, `Bold`, `SemiBold`, …) and style (`italic`) from the filename.
- Variable fonts are detected by `variable` in the name, `[wght]` notation, or a `_vf` suffix.

**`meta.yaml` fields** (all optional)

| Field | Purpose |
|---|---|
| `title` | Display name (overrides sanitized folder name) |
| `url` | Source/project link |
| `tags` | Comma-separated string or YAML array |
| `fontauthor` | Designer name |
| `fontyear` | Year (original or digitisation) |
| `heroletter` | Single character(s) for the large CMYK hero display |
| `heroword` | Word/phrase shown large on the specimen |
| `herostyle` | CSS font-weight keyword for heroword (e.g. `bold`) |
| `color` | CSS color name for accent (must be a valid CSS color keyword/value) |
| `border` | Border SVG filename override (e.g. `border_historical.svg`); defaults to `border_lines.svg` |
| `content` | Markdown string rendered below the specimen |
| `imageOverrides` | Override gallery image list |

**Unicode coverage**
- `unicodeRanges.js` defines the named Unicode blocks shown on specimen pages (ASCII, Latin-1, Latin Extended A/B, Ligatures, Fractions). Add or uncomment entries there to display additional blocks.
- `fontCodepoints.js` reads each font's actual `.woff2` file via `fontkit` and builds a `{ codepoint: 1 }` lookup map keyed by `node.key`. It picks the Regular upright file, falling back to any upright then any file. Missing or unreadable fonts are silently skipped; templates treat a missing entry as "all glyphs present".

**Border images**
- Master SVGs live in `src/img/borders/` (root level only, no subdirectories). They use `#cccccc` as the placeholder accent color.
- Gulp's `generateColoredBorders` task scans all `meta.yaml` files for `color` values and writes one colored SVG variant per color to `dist/img/borders/<color>/`.
- `_generated-borders.njk` produces `src/scss/_includes/_font-borders.scss` — a SCSS map `$font-border-colors` of `slug → (color, border-file)`. The `@each` loop in `_font-poster.scss` generates the `border-image-source` rule per font automatically.
- **Never add subdirectories to `src/img/borders/`** — color variants are build artifacts written directly to `dist/`.

**SCSS**
- Edit only files in `src/scss/` (not the gitignored generated files).
- Per-font `@font-face` declarations live in auto-generated `src/scss/webfonts/*.scss` — driven by `_generated-fonts.njk`.
- Color utility classes (`.indigo`, `.bg-olivedrab`, …) are auto-generated by `_dynamic-colors.njk` → never hand-write them.
- Border-image source per font is auto-generated by `_generated-borders.njk` → never hand-write `.font-X .specimen-poster { border-image-source: … }` rules.

**URL slugs**
- Font pages are served at `/<category>/<family-slug>.html` (derived from `node.url` in the data layer).

---

## Important constraints

- **Never manually edit** `src/scss/webfonts/*.scss`, `src/scss/_includes/_html_colornames.scss`, or `src/scss/_includes/_font-borders.scss` — all three are regenerated on every build by Eleventy templates.
- **Never edit `dist/`** — it is the build artifact and is gitignored.
- `fonts.js` is the single source of truth for font data. All other `_data` files call `fonts()` and filter/reshape its output. Don't duplicate logic elsewhere.
- `src/_data/site.json` sets global fallback values (heroword, heroletter, panagram, paragraph text). Specimen pages fall back to these when a font's `meta.yaml` omits them.
- The build is a two-phase pipeline: **Eleventy first** (generates HTML + SCSS partials), **Gulp after** (compiles SCSS, copies/optimises assets). Running just `npx @11ty/eleventy` without Gulp leaves CSS missing.
- Background images in `src/img/background/` are gitignored (except `sample.webp`). The data file prefers `.webp` when both formats exist for the same stem.

---

## Common tasks

### 1. Add a new font

1. Create `src/webfonts/<category>/<FamilyName>/`.
2. Drop `.woff2` files in. Name them `FamilyName_Weight.woff2` (e.g. `Jost_Regular.woff2`, `Jost_Bold.woff2`).
3. Optionally add `meta.yaml` with `title`, `tags`, `color`, `heroword`, etc.
4. Run `npx gulp` — Eleventy generates the SCSS partial, Gulp compiles it, a specimen page appears at `/<category>/<familyname>.html`.

### 2. Edit font metadata

Edit `src/webfonts/<category>/<FamilyName>/meta.yaml`. The data layer re-reads it on each build. No other files need touching.

### 3. Add per-font background or gallery images

- **Card background**: place images in `src/webfonts/<category>/<FamilyName>/background/`. WebP is preferred (picked over JPEG/PNG with the same stem). Referenced automatically via `fontBackgrounds.js`.
- **Gallery images**: place images in `src/webfonts/<category>/<FamilyName>/gallery/`. Shown on the specimen page via `font-image-list.njk`. Falls back to images directly in the folder if no `gallery/` subfolder exists.

### 4. Change global defaults (panagram, paragraphs, heroword)

Edit `src/_data/site.json`. The `panagram` value is the sentence shown in the waterfall section of every specimen. `paragraph8` through `paragraph28` are keyed by font size in px. `heroword`/`heroletter` are fallbacks when `meta.yaml` doesn't specify them.

### 5. Deploy to GitHub Pages

```bash
npx gulp ghpages          # builds with --pathprefix=font-collection
cd dist && git init && git add -A && git commit -m "deploy" && git push git@github.com:elbym/font-collection.git HEAD:gh-pages --force && cd ..
```

Hinweis: `git subtree push` funktioniert nicht, weil `dist/` gitignored ist.

The `ghpages` gulp task uses `HtmlBasePlugin` via the Eleventy `--pathprefix` flag to rewrite all asset URLs for the subdirectory path.

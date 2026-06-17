# CLAUDE.md

## Project overview

A personal font collection website. It scans a folder of `.woff2` font files, generates type specimen pages for each font family, and deploys as a static site to GitHub Pages at `elbym.github.io/font-collection`.

Output: `dist/` — fully static site with one HTML specimen page per font family, a homepage listing all fonts, and tag filter pages.

---

## Tech stack

| Layer | Tool / Version |
|---|---|
| SSG | Eleventy (`@11ty/eleventy`) 3.1.5 |
| Templates | Nunjucks (`.njk`) |
| CSS | SCSS → compiled by `gulp-sass` (sass 1.99.0) |
| Build | Gulp 5 |
| Dev server | BrowserSync, port 3000 |
| Images | `sharp` + `through2` — JPG/PNG → WebP, max 1080px, quality 60 |
| HTML (prod) | `gulp-prettier` (beautify) |
| Font metadata | `meta.yaml` (parsed with `js-yaml`) |
| Color manipulation | `chroma-js` 3.2.0 — used by `hueShift` filter and `generateColoredBorders` Gulp task |
| Markdown rendering | `markdown-it` (transitive dep) — used by `markdownify` Eleventy filter |
| Font reading | `fontkit` 2.0.4 — reads `.woff2` files to extract codepoint maps |
| Navigation | `@11ty/eleventy-navigation` |
| JS (browser) | `fitty.min.js` (text auto-fitting, vendor-only); `font-lazy-loader.js` (lazy-loads per-font CSS via IntersectionObserver); `compare-manager.js` (font comparison tray, sessionStorage); `font-search.js` (header autocomplete widget powered by Pagefind) |
| Search | `pagefind` ^1.5.2 — static full-text index built after every Eleventy run; UI served from `dist/pagefind/` |
| Clean utility | `rimraf` ^6.1.3 — cross-platform directory deletion used by the `clean` Gulp task |
| Python tool | `font_specimen_generator.py` — standalone, not part of the build |

---

## Project structure

```
src/
  _data/               # Eleventy data layer (all JS unless noted)
    fonts.js           # MASTER: recursively scans webfonts/, parses filenames + meta.yaml
    fontFolders.js     # fonts().list — all nodes (virtual tag-based groups + leaf nodes)
    fontLeaves.js      # leaf nodes only (folders that contain .woff2 files)
    fontTags.js        # unique tags across all leaf nodes
    fontImages.js      # gallery images per font folder (from gallery/ subfolders)
    fontBackgrounds.js # per-font card backgrounds (from background/ subfolders)
    fontCodepoints.js    # per-font codepoint map {cp: 1} — reads actual .woff2 via fontkit
    fontVariableAxes.js  # per-font variable axes {axisTag: {name,min,max,default,step}} — reads actual .woff2 via fontkit
    unicodeRanges.js   # static list of named Unicode blocks used for coverage display
    backgrounds.js     # global background images from src/img/background/
    site.json          # global defaults: title, panagram, default heroword/heroletter, paragraph text per size
  _includes/
    layouts/base.njk      # HTML shell — the only layout; emits JSON-LD BreadcrumbList + SoftwareApplication structured data
    font-card.njk         # card used on index and group pages
    font-poster.njk       # full specimen poster used on leaf pages
    font-image-list.njk   # gallery grid on specimen pages
    waterfall-groups.njk  # waterfall display grouped by Unicode range
    header.njk / footer.njk / seperator.njk
  css/
    _dynamic-colors.njk    # Eleventy template → generates src/scss/_includes/_html_colornames.scss
    _generated-fonts.njk   # Eleventy template → generates src/scss/webfonts/<slug>.scss per font
    _generated-borders.njk # Eleventy template → generates src/scss/_includes/_font-borders.scss
  scss/
    styles.scss            # SCSS entry point
    _base/                 # colors, typography, html reset, navigation, footer, grid
      _colors.scss         # CSS custom properties for three-tier color system (primary/secondary/tertiary)
      _grid.scss
      _typography.scss / _html.scss / _navigation.scss / _footer.scss
    _includes/
      _font-mixin.scss     # @font-face mixin used by generated partials
      _breakpoints.scss
      _modularscale.scss
      _html_colornames.scss  # AUTO-GENERATED — never edit
      _font-borders.scss     # AUTO-GENERATED — never edit
    _cards.scss
    _font-poster.scss
    _print.scss            # print media styles — hides UI chrome, sets print-friendly layout
    _search.scss           # .font-search form in header + #font-search-results autocomplete dropdown
    webfonts/              # AUTO-GENERATED — never edit (gitignored)
  js/
    fitty.min.js
    font-lazy-loader.js    # lazy-loads per-font CSS; marks eagerly-loaded fonts to skip idle prefetch
    compare-manager.js     # font comparison tray (sessionStorage, max 4 fonts); injects #compare-tray into DOM
    font-search.js         # header autocomplete: queries Pagefind JS API, renders dropdown (max 8 hits), keyboard nav
  webfonts/                # Font files, organised by category
    sans/ serif/ mono/ blackletter/ comicsans/ script/
    meta.yaml              # group-level metadata (optional)
  img/
    background/            # global card backgrounds (gitignored except sample.webp + urls.txt)
    borders/               # master border SVGs (root level only); color variants generated to dist/ by Gulp
    alt/                   # category alt text references
  index.njk                # homepage — lists all leaf nodes as cards
  specimen.njk             # paginated over fontFolders; one page per node
  tag.njk                  # paginated over fontTags; one page per tag
  alternatives.njk         # curated list of commercial/free font pairs; eleventyNavigation key "Alternatives"
  compare.njk              # side-by-side font comparison (up to 4); reads sessionStorage, inline JS; eleventyNavigation key "Vergleich" order 0
  search.njk               # permalink: /search.html — full Pagefind UI widget; German translations; extra_css: /pagefind/pagefind-ui.css
  llms.njk                 # permalink: /llms.txt — machine-readable catalog metadata for LLM tools
  sitemap.njk              # sitemap.xml
dist/                      # BUILD OUTPUT — never edit (gitignored)
```

---

## Development workflow

```bash
# Install
npm install

# Dev server (clean → build → serve + watch, port 3000)
npx gulp

# Production build (clean → build → beautify HTML)
npx gulp build

# GitHub Pages build (adds --pathprefix=font-collection, beautifies HTML)
npx gulp ghpages

# Clean dist/
npx gulp clean

# Deploy to gh-pages branch (ghpages build + force-push to gh-pages)
npx gulp deploy

# Download background images listed in urls.txt files
npx gulp download

# Manual deploy fallback (dist/ is gitignored, so subtree push doesn't work)
cd dist && git init && git add -A && git commit -m "deploy" && git push git@github.com:elbym/font-collection.git HEAD:gh-pages --force && cd ..
```

**Build pipeline**: Eleventy runs first (generates HTML + SCSS partials into `dist/`), then Gulp compiles SCSS and copies/optimises assets on top, then Pagefind indexes `dist/` into `dist/pagefind/`. Running just `npx @11ty/eleventy` alone leaves CSS and the search index missing.

**Dev vs prod SCSS**: Dev mode (`npx gulp`) compiles with sourcemaps, no minification. Prod/ghpages compiles minified with no sourcemaps.

The watch task re-runs Eleventy on `.njk`, `.md`, `.html`, `_data/**/*.js`, and `webfonts/**/*.yaml` changes, then reloads BrowserSync.

---

## Key conventions

### Font folder naming
- One folder per font family inside a category folder: `src/webfonts/<category>/<FamilyName>/`
- The folder is a **filesystem container only** — it has no effect on URLs, navigation, or category. All three are derived from `tags[0]`.
- Category folders (`sans`, `serif`, `mono`, etc.) may have a `meta.yaml`, but it is not used to generate group pages. Group pages are virtual nodes built from unique `tags[0]` values at build time.

### Font file naming
- Files must be `.woff2` (or `.woff`).
- `fonts.js` parses weight (`Regular`, `Bold`, `SemiBold`, …) and style (`italic`) from the filename. Numeric weights (`_400`, `_700`) are also detected.
- Variable fonts are detected by `variable` in the name, any axis bracket notation (`[wght]`, `[wdth]`, `[ital]`, `[slnt]`, `[opsz]`), or a `_vf` suffix.

### `meta.yaml` fields (all optional)

| Field | Purpose |
|---|---|
| `title` | Display name (overrides sanitized folder name) |
| `url` | Source/project link |
| `tags` | Comma-separated string or YAML array. **The first tag is the font class** (`category` field) and determines the first URL segment. |
| `fontauthor` | Designer name |
| `fontyear` | Year (original or digitisation) |
| `heroletter` | Single character(s) for the large CMYK hero display |
| `heroword` | Word/phrase shown large on the specimen |
| `herostyle` | CSS font-weight keyword for heroword (e.g. `bold`); defaults to `regular` |
| `color` | CSS color keyword or hex value for accent |
| `border` | Border SVG filename override (e.g. `hash.svg`); defaults to `line2.svg` |
| `content` | Markdown string rendered below the specimen |
| `comment` | Internal note — displayed on page below the header |
| `imageOverrides` | Override gallery image list |
| `wikipedia` | Wikipedia article URL (shown as link on specimen page) |

### Color system
- Each font's `color` field sets `--color-base-primary` in the page's `<style>` block.
- `fonts.js` also resolves `color` to a hex value (`colorHex`) via a built-in CSS color keyword lookup table. `colorHex` is available on every flat node.
- Two secondary colors are derived at runtime via CSS relative color syntax: `--color-base-secondary` and `--color-base-tertiary` use `hsl(from primary calc(h + --hue-offset))`.
- `--hue-offset-2` and `--hue-offset-3` are set to random values (120–360) by an inline `<script>` in `base.njk` — this randomises the secondary/tertiary accent colors on every page load.
- All semantic color tokens (`--color-accent`, `--color-background`, etc.) use `color-mix(in oklab, ...)` to produce tinted variants of the base colors.
- Color utility classes (`.indigo`, `.bg-olivedrab`, …) are auto-generated by `_dynamic-colors.njk` using the same `color-mix(in oklab, ...)` approach — **never hand-write them**.

### Unicode coverage
- `unicodeRanges.js` defines the named Unicode blocks shown on specimen pages (ASCII, Latin-1, Latin Extended A/B, Ligatures, Fractions).
- `fontCodepoints.js` reads each font's actual `.woff2` file via `fontkit` and builds a `{ codepoint: 1 }` lookup map keyed by `node.key`. It picks the Regular upright file, falling back to any upright then any file. Missing or unreadable fonts are silently skipped; templates treat a missing entry as "all glyphs present".
- `fontVariableAxes.js` reads variable axes from each font's `.woff2` via `fontkit`. Returns `{ nodeKey: { axisTag: { name, min, max, default, step } } }`. Used by `font-poster.njk` to generate axis sliders with correct min/max/default values. Only covers axes fontkit exposes (`wght`, `wdth`, `opsz`, `ital`, `slnt`); custom private axes are not returned.

### Border images
- Master SVGs live in `src/img/borders/` (root level only, no subdirectories). They use `#cccccc` as the placeholder accent color.
- Available SVGs: `diagonal.svg`, `doodle.svg`, `dots.svg`, `dots_small.svg`, `floral.svg`, `hash.svg`, `line1.svg`, `line2.svg` (default), `lines.svg`, `lines_thin.svg`.
- Gulp's `generateColoredBorders` task scans all `meta.yaml` files for `color` values, boosts pale/unsaturated colors (max saturation 0.3, min lightness 0.8), and writes one colored SVG variant per color to `dist/img/borders/<color>/`.
- `_generated-borders.njk` produces `src/scss/_includes/_font-borders.scss` — a SCSS map `$font-border-colors` of `slug → (color, border-file)`.
- **Never add subdirectories to `src/img/borders/`** — color variants are build artifacts written directly to `dist/`.

### SCSS
- Edit only files in `src/scss/` (not the auto-generated files).
- Per-font `@font-face` declarations live in auto-generated `src/scss/webfonts/*.scss` — driven by `_generated-fonts.njk` (paginated over `fontLeaves`).
- `font-display: block` is set globally in `_font-mixin.scss`. Specimen pages eagerly load their font via `<link>` in `<head>`; lazy-loaded card fonts are loaded 300px ahead of the viewport by the IntersectionObserver.

### Font lazy loading
- `font-lazy-loader.js` auto-detects `font-<slug>` CSS classes and lazy-loads the matching `/css/webfonts/<slug>.css` via IntersectionObserver (300px rootMargin).
- Fonts already loaded via `<link rel="stylesheet">` (i.e. the current specimen's font) are marked as `loaded` on init and skipped by the idle prefetch.
- Slugs whose first hyphen-segment is a known CSS utility word (`size`, `family`, `weight`, etc.) are excluded from auto-detection. Font slugs with hyphens (e.g. `pt-sans`) are handled correctly.
- Elements can also set `data-font-slug` explicitly to opt in without a `font-*` CSS class.

### Font comparison feature
- `compare-manager.js` adds a comparison tray to every page. Font cards with a `.compare-toggle` button (carrying `data-slug`, `data-title`, `data-family`, `data-url`) participate automatically.
- Selection is stored in `sessionStorage` under the key `font-compare` as a JSON array of `{ slug, title, family, url }` objects. Maximum 4 fonts.
- The tray (`#compare-tray`) is injected into `<body>` by `compare-manager.js` at runtime and stays hidden until at least 2 fonts are selected.
- `compare.njk` reads sessionStorage directly (inline script) and renders a live-editable comparison table — no server round-trip. The page is in German (`Schriften vergleichen`).
- `.compare-toggle` buttons get `.is-selected` / `aria-pressed` state managed by `compare-manager.js`; do not manage this state in templates.

### Search (Pagefind)
- The site uses [Pagefind](https://pagefind.app) for static full-text search. The index is built by the `runPagefind` (local) and `runPagefindGhPages` (`--base-url /font-collection`) Gulp tasks, which run after every Eleventy + SCSS build — including `default`, `build`, `ghpages`, and `deploy`.
- **What is indexed**: only leaf specimen pages. Group pages and tag pages set `data-pagefind-ignore="all"` on `<body>` to exclude themselves. `<header>` and `<footer>` carry `data-pagefind-ignore` so those fragments are stripped from excerpts.
- **`search.njk`**: renders at `/search.html`. Mounts the `PagefindUI` widget from `/pagefind/pagefind-ui.js` with German translations (`Schriften suchen …`, `Keine Ergebnisse für …`, etc.) and accent-color tokens tied to `--color-accent`. No Eleventy navigation entry — linked from the header form's submit action.
- **`font-search.js`**: the header autocomplete widget. Loaded as `defer` on every page (via `base.njk`). On focus / keystroke it lazy-imports `/pagefind/pagefind.js` (silently skips if not built — i.e. in dev without a prior production build), debounces queries 200 ms, fetches up to 8 results, and renders a `<ul role="listbox">` dropdown with keyboard navigation (ArrowUp/ArrowDown to move, Enter to navigate, Escape to close). The `.font-search` form in `header.njk` carries `data-pagefind-url` and `data-search-url` attributes so the script works with path-prefixed ghpages builds. A footer "Alle Ergebnisse →" item redirects to `/search.html`.
- **In dev mode** (`npx gulp`): the Pagefind index IS built after every Eleventy run — search works in dev. However, hot-reload after `.njk`/`.js` changes triggers Eleventy only; re-run `npx gulp` to rebuild the Pagefind index after content-structure changes.
- **`_search.scss`**: styles `.font-search` (positioned in the header flush-right), the `<input type="search">` (14 rem wide, `--color-surface` background), and `#font-search-results` (absolute dropdown, `z-index: 200`, accent shadow via `color-mix`).

### Open Graph images
- Specimen pages (leaf nodes) use the first background image from `fontBackgrounds[folder.key]` as `og:image` when one exists; all other pages fall back to the static `/img/og_preview.png`.
- OG image URLs use Eleventy's `url` filter so the pathprefix is applied correctly in the `ghpages` build.

### Eleventy filters (`.eleventy.js`)
- Active filters: `chr`, `charCodeAt`, `coveragePercent`, `unicodeChars`, `getChildNodes`, `getAncestors`, `getRootNodes`, `isAncestorOf`, `getManualNav`, `hueShift`, `markdownify`, `jsonEscape`, `toDomain`, `findRelated`, `findPrevNext`.
- `hueShift(degrees)`: rotates a CSS color's hue via chroma-js.
- `markdownify`: renders markdown string to HTML via markdown-it (`html: false`, `breaks: true`, `linkify: true`).
- `jsonEscape`: escapes a string for safe embedding in JSON (backslash, quote, newline, carriage return).
- `toDomain`: extracts hostname from a URL; returns the input string on parse failure.
- `findRelated(folder, fontLeaves, limit?)`: returns leaf nodes sharing at least one tag with `folder`, excluding `folder` itself. Optional `limit` slices the result.
- `findPrevNext(key, list)`: returns `{ prev, next }` neighbours of the node with `key` inside `list`. Returns `null` for missing neighbours.
- Dead filters were removed (`familyName`, `getNavDepth`, `isChildOf`, `getParentNode`, `getDescendants`, `find`) — do not re-add unless a template actually uses them.

### URL slugs and navigation
- Leaf node URLs: `/<tags[0]-slug>/<family-slug>.html` (e.g. `serif/cormorant.html`, `monospace/jetbrainsmono.html`).
- Group node URLs: one virtual group per unique `tags[0]` value, URL = `/<tags[0]-slug>.html`. Current groups: `blackletter`, `comicsans`, `monospace`, `sans`, `script`, `serif`. Generated in `fonts.js` post-processing — there are no folder-based group nodes.
- The `category` field on every leaf node equals `tags[0]`. If `tags` is empty the build emits a warning and `category` is `null`.
- **Navigation (menu, breadcrumb) and URLs both follow `tags[0]`**, not the folder structure. Moving a font between category folders has no effect on its URL — only changing `tags[0]` does.
- `node.parentPath` is set to `slugify(tags[0])`. Navigation filters operate on `parentPath`/`path`.
- **Manual nav pages** (`alternatives.njk`, `compare.njk`) use `eleventyNavigation` frontmatter and are surfaced by the `getManualNav` filter — they are independent of the font data tree and do not appear in group/leaf navigation.

### Background image downloads
- `src/img/background/` and per-font `background/` folders support a `urls.txt` file listing image sources to download.
- Supported formats per line: `name=unsplash:PHOTO_ID`, `name=pexels:PHOTO_ID`, `name=https://…`, or a bare `https://…` (filename derived from URL).
- Run `npx gulp download` to fetch images. The `default` and `build` tasks also run this automatically. Already-downloaded files are skipped.
- The directory is gitignored (except `sample.webp` and `urls.txt`), so images must be re-downloaded in fresh checkouts.

### Structured data (SEO)
- `base.njk` emits JSON-LD `BreadcrumbList` on all folder/leaf pages and a `SoftwareApplication` entity on the homepage. Uses `jsonEscape` filter to safely embed template values into JSON.

### Python specimen generator
- `font_specimen_generator.py` is a standalone tool — not part of the Gulp/Eleventy build pipeline.
- Generates Wikipedia-style font specimen PNG previews. Requires `pip install Pillow fonttools`.
- Operates on **folders**, not individual files — scans `--input` recursively for `.ttf`, `.otf`, `.woff`, `.woff2`.
- CLI: `python font_specimen_generator.py --input <fonts-dir> --output <output-dir> [--width 1000] [--theme dark|white|cream] [--overwrite]`
- Short flags: `-i`, `-o`, `-w`, `-t`. Default width: 1000px. Default theme: `dark`.

---

## Important constraints

- **Never manually edit** `src/scss/webfonts/*.scss`, `src/scss/_includes/_html_colornames.scss`, or `src/scss/_includes/_font-borders.scss` — all three are regenerated on every build by Eleventy templates.
- **Never edit `dist/`** — it is the build artifact and is gitignored.
- `fonts.js` is the single source of truth for font data. All other `_data` files call `fonts()` and filter/reshape its output. Don't duplicate logic elsewhere. The result is memoized — `fonts()` only scans the filesystem once per build process.
- `src/_data/site.json` sets global fallback values (heroword, heroletter, panagram, paragraph text). Specimen pages fall back to these when a font's `meta.yaml` omits them. `paragraph8` through `paragraph28` are keyed by font size in px.
- Background images in `src/img/background/` are gitignored (except `sample.webp` and `urls.txt`). The data file prefers `.webp` when both formats exist for the same stem.

---

## Common tasks

### 1. Add a new font

1. Create `src/webfonts/<category>/<FamilyName>/`.
2. Drop `.woff2` files in. Name them `FamilyName_Weight.woff2` (e.g. `Jost_Regular.woff2`, `Jost_Bold.woff2`).
3. Add `meta.yaml` — the **first tag determines the URL** and `category` field (e.g. `tags: Garalde, Serif` → page at `/garalde/<familyname>.html`). A missing or empty `tags` field emits a build warning.
4. Run `npx gulp` — Eleventy generates the SCSS partial, Gulp compiles it, the specimen page appears.

### 2. Edit font metadata

Edit `src/webfonts/<category>/<FamilyName>/meta.yaml`. The data layer re-reads it on each build.

### 3. Add per-font background or gallery images

- **Card background**: place images in `src/webfonts/<category>/<FamilyName>/background/`. WebP is preferred. Referenced automatically via `fontBackgrounds.js`.
- **Gallery images**: place images in `src/webfonts/<category>/<FamilyName>/gallery/`. Shown on the specimen page. Falls back to images directly in the folder if no `gallery/` subfolder exists.
- **Download from URL**: add a `urls.txt` to the `background/` folder and run `npx gulp download`.

### 4. Change global defaults (panagram, paragraphs, heroword)

Edit `src/_data/site.json`.

### 5. Deploy to GitHub Pages

```bash
npx gulp deploy
```

Runs: ghpages build → force-push to `gh-pages`. `git subtree push` does not work because `dist/` is gitignored.

The `ghpages` Gulp task uses `HtmlBasePlugin` via the Eleventy `--pathprefix=font-collection` flag to rewrite all asset URLs for the subdirectory path.

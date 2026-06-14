# CLAUDE.md

## Project overview

Personal font collection website. Scans `src/webfonts/` for `.woff2` files, generates type specimen pages per font family, deploys as static site to GitHub Pages at `elbym.github.io/font-collection`.

Output: `dist/` — one HTML specimen page per font family, category index pages, tag filter pages, sitemap, llms.txt.

---

## Tech stack

| Layer | Tool / Version |
|---|---|
| SSG | Eleventy (`@11ty/eleventy`) 3.1.5 |
| Templates | Nunjucks (`.njk`) |
| CSS | SCSS → `gulp-sass` (sass 1.99.0) |
| Build | Gulp 5 (`gulpfile.js`, 588 lines) |
| Dev server | BrowserSync, port 3000 |
| Images | `gulp-sharp-optimize-images` — JPG/PNG → WebP, max 1920px |
| HTML (prod) | `gulp-prettier` |
| Font metadata | `meta.yaml` per font folder, parsed with `js-yaml` |
| Font parsing | `fontkit` 2.0.4 — reads `.woff2` for codepoint maps |
| Color math | `chroma-js` 3.2.0 — used in `.eleventy.js` `hueShift` filter |
| JS (browser) | `fitty.min.js` (text fitting); `font-lazy-loader.js` (IntersectionObserver lazy CSS) |

---

## Project structure

```
src/
  _data/
    fonts.js           # MASTER: scans webfonts/, parses filenames + meta.yaml. Memoized.
    fontFolders.js     # fonts().list — all nodes (groups + leaves)
    fontLeaves.js      # leaf nodes only (folders with .woff2 files)
    fontTags.js        # unique tags across all leaves
    fontImages.js      # gallery images per font (from gallery/ subfolders)
    fontBackgrounds.js # card background images (from background/ subfolders)
    fontCodepoints.js  # {codepoint: 1} map per font, read via fontkit
    unicodeRanges.js   # named Unicode blocks for coverage display
    backgrounds.js     # global card backgrounds from src/img/background/
    site.json          # global fallbacks: title, panagram, heroword, heroletter, paragraphs
  _includes/
    layouts/base.njk       # sole HTML shell / layout
    font-card.njk          # card component (index + category pages)
    font-poster.njk        # specimen poster (leaf pages)
    font-image-list.njk    # gallery images
    waterfall-groups.njk   # waterfall typography section
    header.njk / footer.njk / seperator.njk
  css/                     # Eleventy templates that OUTPUT SCSS (not actual CSS)
    _dynamic-colors.njk    # → src/scss/_includes/_html_colornames.scss
    _generated-fonts.njk   # → src/scss/webfonts/<slug>.scss (one per font)
    _generated-borders.njk # → src/scss/_includes/_font-borders.scss
  scss/
    styles.scss            # entry point
    _base/                 # _colors.scss, _typography.scss, _html.scss, _navigation.scss, _footer.scss, _grid.scss
    _includes/
      _font-mixin.scss     # @font-face mixin (font-display: block — DO NOT change)
      _breakpoints.scss
      _modularscale.scss
      _html_colornames.scss  # AUTO-GENERATED — never edit
      _font-borders.scss     # AUTO-GENERATED — never edit
    _cards.scss
    _font-poster.scss
    webfonts/              # AUTO-GENERATED — never edit (gitignored)
  js/
    font-lazy-loader.js
    fitty.min.js           # patched: resize/orientationchange listeners use {passive: true}
  webfonts/                # ~75 font families across 7 categories
    blackletter/ comicsans/ mono/ sans/ script/ serif/
    meta.yaml              # optional group-level metadata
  img/
    background/            # gitignored except sample.webp
    borders/               # master SVGs (root only); color variants written to dist/ by Gulp
  index.njk                # homepage
  specimen.njk             # paginated over fontFolders
  tag.njk                  # paginated over fontTags
  alternatives.njk
  sitemap.njk
  llms.njk
  robots.txt
dist/                      # BUILD OUTPUT — gitignored, never edit
```

---

## Build workflow

```bash
npm install

npx gulp            # dev: clean → build → BrowserSync watch (port 3000)
npx gulp build      # prod: clean → build → minify CSS → beautify HTML
npx gulp ghpages    # GH Pages: same as build + --pathprefix=font-collection
npx gulp clean      # wipes dist/
npx gulp deploy     # ghpages build + force-push dist/ to gh-pages branch
```

**Two-phase pipeline**: Eleventy runs first (HTML + SCSS partials in `src/css/`), then Gulp (SCSS compile, image optimise, asset copy). Running Eleventy alone leaves CSS missing.

Watch triggers on: `src/**/*.njk`, `src/**/*.md`, `src/**/*.html`, `src/_data/**/*.js`.

**Deploy in cloud/CI environments** (SSH unavailable): build with `npx gulp ghpages`, then push via HTTPS proxy:
```bash
git push http://local_proxy@127.0.0.1:{PORT}/git/elbym/font-collection HEAD:gh-pages --force
```
`npx gulp deploy` uses SSH (`git@github.com`) and will fail in cloud containers.

---

## Key conventions

### Font folder & file naming

- Structure: `src/webfonts/<category>/<FamilyName>/`
- Files: `FamilyName_Weight.woff2` — e.g. `Jost_Regular.woff2`, `Jost_BoldItalic.woff2`
- Variable fonts: filename must contain `variable` (case-insensitive), `[wght]`, or `_vf` suffix for `fonts.js` to detect them correctly
- Weight keywords parsed: ExtraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black (→ CSS weight values)
- Style: `italic` in filename (case-insensitive) → `font-style: italic`

### `meta.yaml` fields (all optional)

| Field | Purpose |
|---|---|
| `title` | Display name (overrides sanitized folder name) |
| `url` | Source/project link |
| `tags` | Comma-separated string or YAML array |
| `fontauthor` | Designer name |
| `fontyear` | Year |
| `heroletter` | Character(s) for CMYK hero display |
| `heroword` | Word shown large in specimen |
| `herostyle` | CSS font-weight for heroword (e.g. `bold`) |
| `color` | CSS color keyword for accent/borders |
| `border` | Border SVG filename override (default: `border_lines.svg`) |
| `content` | Markdown rendered below specimen |
| `imageOverrides` | Override gallery image list |
| `wikipedia` | Wikipedia URL (shown as link) |

### SCSS rules

- Edit only `src/scss/` — the three auto-generated files (`_html_colornames.scss`, `_font-borders.scss`, `webfonts/*.scss`) are regenerated every build.
- `font-display: block` in `_font-mixin.scss` — **CRITICAL, do not change to `swap`**. Safari/iOS evaluates SVG `<clipPath>` geometry once at render time. With `swap`, the fallback font metrics are used to size the CMYK clip text and are never recalculated when the webfont loads, breaking the hero letters.
- Color utility classes (`.indigo`, `.bg-olivedrab`, …): auto-generated, never hand-write.
- Border-image per font: auto-generated, never hand-write `.font-X .specimen-poster { border-image-source: … }`.

### Font lazy loading (`font-lazy-loader.js`)

- Detects `font-<slug>` CSS classes on DOM elements, lazy-loads `/css/webfonts/<slug>.css` via IntersectionObserver (300px rootMargin).
- Fonts already loaded via `<link rel="stylesheet">` (specimen page's own font) are marked `loaded` on init and skipped.
- Excluded slug prefixes: `size`, `family`, `weight`, `style`, `color`, `display`, `variant`, `card`, `poster`, `image`.
- `data-font-slug` attribute can opt an element in explicitly without a CSS class.
- After font CSS loads, calls `fitty.fitAll()` in a `requestAnimationFrame`.
- `getAssetBase()` is cached after first call to avoid repeated `querySelector`.

### Border images

- Master SVGs in `src/img/borders/` use `#cccccc` as placeholder color.
- Gulp `generateColoredBorders` writes colored variants to `dist/img/borders/<color>/`.
- **Never add subdirectories to `src/img/borders/`** — only root-level SVGs are processed.

### Open Graph images

- Leaf pages: first entry in `fontBackgrounds[folder.key]` used as `og:image` if available.
- Fallback: `/img/og_preview.png`.
- OG paths go through Eleventy `url` filter for correct `ghpages` pathprefix.

### Eleventy filters (`.eleventy.js`)

`chr`, `charCodeAt`, `coveragePercent`, `unicodeChars`, `getChildNodes`, `getAncestors`, `getRootNodes`, `isAncestorOf`, `getManualNav`, `hueShift`, `markdownify`.

Dead filters removed: `familyName`, `getNavDepth`, `isChildOf`, `getParentNode`, `getDescendants`, `find` — do not re-add.

### URL slugs

Pages served at `/<category>/<family-slug>.html` from `node.url` in the data layer.

---

## CMYK hero letters — architecture & gotchas

The specimen header shows a large letter filled with a CMYK halftone dot pattern. This is implemented as:

```html
<article class="hero-letters">
  <div class="cmyk">                          <!-- clipped to letter shape -->
    <div class="cmyk-layer cmyk_cyan"></div>
    <div class="cmyk-layer cmyk_magenta"></div>
    <div class="cmyk-layer cmyk_yellow"></div>
    <div class="cmyk-layer cmyk_black"></div>
  </div>
  <svg class="cmyk-mask">                     <!-- defines clip path only -->
    <defs>
      <clippath id="text-clip">
        <text x="50%" y="0" text-anchor="middle" dominant-baseline="central">…</text>
      </clippath>
    </defs>
  </svg>
</article>
```

**Critical rules** (all learned from Safari/iOS bugs):

1. **`.cmyk-mask` must NOT have `clip-path` applied to it.** The SVG that defines `#text-clip` receiving `clip-path: url("#text-clip")` itself creates a circular reference — Safari rejects the clip-path entirely, Chrome ignores it silently.

2. **`.cmyk-mask` needs `width: 100%`.** If width is 0, `x="50%"` in `<text>` resolves to 0px and the letter appears at the left edge.

3. **`.cmyk` must use `left: 0`, not `right: 1rem`.** `position: absolute; width: 100%; right: 1rem` without `left` shifts the element -1rem to the left.

4. **`.cmyk` needs `isolation: isolate`.** Without it, `mix-blend-mode: multiply` on `.cmyk-layer` elements blends against whatever is visually behind `.cmyk` in the page (the hero gradient), not against `.cmyk`'s own background — producing washed-out/incorrect CMYK colors on Safari.

5. **`.cmyk` needs `background-color: white` (light) / `black` (dark).** The multiply blend needs a paper-white base. Against transparent, blend result is undefined/washed-out on Safari.

6. **`.hero-letters` needs `container-type: inline-size`.** The `<text>` font-size uses `cqw` units (`clamp(8rem, 30cqw + 1rem, 18rem)`). Without a container context ancestor, `cqw` resolves to 0 on Safari → always minimum `8rem`.

7. **`font-display: block` is mandatory** — see SCSS rules above.

Current CSS snapshot (relevant parts in `src/scss/styles.scss`):
```scss
.cmyk-mask {
  position: absolute;
  width: 100%;   // x="50%" in SVG text resolves against this
  height: 0;
  top: 0;
  left: 0;
  pointer-events: none;
  // NO clip-path here — circular reference breaks Safari
}

.cmyk {
  width: 100%;
  clip-path: url("#text-clip");
  position: absolute;
  left: 0;       // not right: 1rem
  top: 50%;
  background-color: white;   // blend base (light mode)
  isolation: isolate;        // contain blend modes to this element

  @media (prefers-color-scheme: dark) {
    background-color: black;
    isolation: isolate;
  }
}
```

And in `src/scss/_font-poster.scss`:
```scss
.hero-letters {
  container-type: inline-size;  // enables cqw for #text-clip text font-size
}
```

---

## Card header styling

Card headers use a `::before` pseudo-element for the background image so hover zoom can be compositor-only (`transform: scale(1.1)`) without a repaint:

```scss
.card header {
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: -4px;   // hides blur() edge artifacts behind overflow:hidden
    background-image: inherit;
    background-size: cover;
    background-position: 50% 50%;
    filter: blur(3px) brightness(0.45);
    will-change: transform;
    transition: transform .5s ease-out;
  }
  &:hover::before { transform: scale(1.1); }
  a { position: relative; }  // above ::before
}
```

`h3` inside cards uses `mix-blend-mode: screen` (light) / `multiply` (dark) with `color: white` / `color: var(--color-mix-dark)` for contrast against any background image.

---

## Important constraints

- **Never manually edit** `src/scss/webfonts/*.scss`, `src/scss/_includes/_html_colornames.scss`, `src/scss/_includes/_font-borders.scss` — regenerated every build.
- **Never edit `dist/`** — build artifact, gitignored.
- `fonts.js` is single source of truth. All `_data/*.js` files call `fonts()` and filter its output. Memoized per build process.
- `src/_data/site.json` — global fallbacks for `heroword`, `heroletter`, `panagram`, `paragraph8`–`paragraph28` (keyed by font size in px).
- Background images in `src/img/background/` are gitignored (except `sample.webp`). `fontBackgrounds.js` prefers `.webp` over same-stem JPG/PNG.

---

## Common tasks

### Add a new font

1. Create `src/webfonts/<category>/<FamilyName>/`
2. Add `.woff2` files named `FamilyName_Weight.woff2`
3. Optionally add `meta.yaml`
4. Run `npx gulp` — specimen page appears at `/<category>/<familyname>.html`

### Edit font metadata

Edit `src/webfonts/<category>/<FamilyName>/meta.yaml` — re-read on every build, no other files to touch.

### Add card background / gallery images

- **Background**: `src/webfonts/<category>/<FamilyName>/background/` (WebP preferred)
- **Gallery**: `src/webfonts/<category>/<FamilyName>/gallery/`

### Change global defaults

Edit `src/_data/site.json` — `panagram`, `paragraph*`, `heroword`, `heroletter`.

### Deploy to GitHub Pages

```bash
npx gulp deploy   # local machine with SSH access to GitHub
```

Cloud/CI (no SSH): build with `npx gulp ghpages`, then force-push `dist/` via HTTPS proxy.

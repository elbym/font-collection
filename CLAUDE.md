# CLAUDE.md

## Project overview

A personal font collection website. It scans a folder of `.woff2` font files, generates type specimen pages for each font family, and deploys as a static site to GitHub Pages at `elbym.github.io/font-collection`.

Output: `dist/` — fully static site with one HTML specimen page per font family, a homepage listing all fonts, and tag filter pages.

Current inventory: **122 font families** across six groups (Serif 38, Sans 38, Monospace 15, Script 18, Display 8, Blackletter 5). `README.md` carries the human-readable list with links; regenerate it from the data layer rather than editing it by hand.

---

## Git: always delegate to the `git-worker` subagent

**Every git task in this repository goes through the `git-worker` subagent** — defined at
user level in `~/.claude/agents/git-worker.md`, so it is available in every project and is
**not** part of this repository. Do not run git commands yourself; hand the task over via the
Agent tool with `subagent_type: "git-worker"`. This applies to the whole range: `status`,
`diff`, `log`, `add`, `commit`, `push`, `pull`, `fetch`, `branch`, `checkout`, `switch`,
`merge`, `rebase`, `stash`, `tag`, `remote`.

Give it the intent, not the command line — it knows this repo's conventions:

> "Commit the new Nunito font folder. German conventional-commit message,
>  one commit for this font only."

What it does and does not do, so you know what comes back:

- It shows `git status` plus `git log --oneline -5` and summarises the consequences before any
  destructive action (`push --force`, `reset --hard`, `rebase`, `branch -D`, `clean -fd`). If
  the order is ambiguous or uncommitted work would be destroyed, it aborts and reports back
  instead of guessing — expect to make that call yourself.
- It **does not resolve merge conflicts**. It lists the conflicting files with a description
  and leaves the merge/rebase state untouched. Resolving them is your job, and it needs
  Write/Edit access it deliberately does not have.
- It **does not write application code**, not even through the shell. A task that needs a
  source change comes back undone with a note on what would have to change. Make the change
  first, then delegate the commit.
- It returns a structured summary (`Getan / Branch / Status / Offen`). Read it before you
  report success — it reports failures verbatim rather than papering over them.

Commit convention in this repo is **German**, conventional-commits prefixes (`feat:`, `fix:`,
`docs:`, `chore:`, `refactor:`), one commit per logical unit — e.g. one commit per font when
adding several. The worker derives this from `git log` itself, but say so if it matters.

Only bypass the worker when the user explicitly asks you to run a git command yourself.

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
| JS (browser) | `fitty.min.js` (text auto-fitting, vendor-only); `font-lazy-loader.js` (lazy-loads per-font CSS via IntersectionObserver); `compare-manager.js` (font comparison tray, sessionStorage); `font-search.js` (header autocomplete powered by Pagefind); `font-style-hover.js` (cycles a card's weights/styles on hover, 220 ms interval); `card-name-override.js` (retypes every card heading from one input); `font-network.js` + `force-graph.min.js` (force-directed tag/author graph, vendor bundle) |
| Search | `pagefind` ^1.5.2 — static full-text index built after every Eleventy run; UI served from `dist/pagefind/` |
| Clean utility | `rimraf` ^6.1.3 — cross-platform directory deletion used by the `clean` Gulp task |
| CSS bundling | `gulp-concat`, `gulp-clean-css`, `gulp-sourcemaps`, `gulp-newer` — bundling, minification, sourcemaps, incremental copies |
| Python tools | `font_specimen_generator.py` (PNG), `font_specimen_svg_generator.py` (SVG) — standalone, not part of the build |

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
    fontVariableAxes.js  # per-font variable axes {axisTag: {name,min,max,default,step,steps}} — reads actual .woff2 via fontkit
    fontNetwork.js     # {nodes, links} graph: one node per font plus per tag and per author, edges font→tag and font→author
    unicodeRanges.js   # static list of named Unicode blocks used for coverage display
    backgrounds.js     # global background images from src/img/background/
    site.json          # global defaults: title, panagram, heroword/heroletter, paragraph text per size, randomColors config
  _includes/
    layouts/base.njk      # HTML shell — the only layout; emits JSON-LD BreadcrumbList + SoftwareApplication structured data
    font-card.njk         # card used on index and group pages
    font-poster.njk       # full specimen poster used on leaf pages
    font-image-list.njk   # gallery grid on specimen pages
    waterfall-groups.njk  # waterfall display grouped by Unicode range
    3dcube.njk            # interactive 3D variable font cube; maps up to 3 axes to X/Y/Z rotation; included by font-poster.njk for variable fonts
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
    force-graph.min.js     # vendored force-graph bundle (exposes global `ForceGraph`, embeds d3-force)
    font-network.js        # renders the font network graph; implements ForceAtlas2 on top of d3-force
    font-style-hover.js    # cycles a card heading through the family's weights/styles on hover
    card-name-override.js  # rewrites all card headings live from the #global-name-override input
    font-lazy-loader.js    # lazy-loads per-font CSS; marks eagerly-loaded fonts to skip idle prefetch
    compare-manager.js     # font comparison tray (sessionStorage, max 4 fonts); injects #compare-tray into DOM
    font-search.js         # header autocomplete: queries Pagefind JS API, renders dropdown (max 8 hits), keyboard nav
  webfonts/                # Font files, organised by category
    sans/ serif/ mono/ blackletter/ comicsans/ script/ display/
    meta.yaml              # group-level metadata (optional)
  img/
    background/            # global card backgrounds (gitignored except sample.webp + urls.txt)
    borders/               # master border SVGs (root level only); color variants generated to dist/ by Gulp
    alt/                   # category alt text references
  robots.txt             # copied to dist/ by Eleventy passthrough
  favicon.ico / favicon.svg  # copied to dist/ root by copyFavicon Gulp task
  index.njk                # homepage — lists all leaf nodes as cards
  specimen.njk             # paginated over fontFolders; one page per node
  tag.njk                  # paginated over fontTags; one page per tag
  alternatives.njk         # curated list of commercial/free font pairs; eleventyNavigation key "Alternatives"
  compare.njk              # side-by-side font comparison (up to 4); reads sessionStorage, inline JS; eleventyNavigation key "Vergleich" order 0
  network.njk              # permalink: /network.html — full-page font network graph; eleventyNavigation key "Netzwerk" order 1
  search.njk               # permalink: /search.html — full Pagefind UI widget; German translations; extra_css: /pagefind/pagefind-ui.css
  llms.njk                 # permalink: /llms.txt — machine-readable catalog metadata for LLM tools
  sitemap.njk              # sitemap.xml
dist/                      # BUILD OUTPUT — never edit (gitignored)
previews/                  # PNG specimen previews generated by font_specimen_generator.py (dark/light/cream)
preview/test/              # PNG specimen previews from test runs (untracked)
download-links.md          # Direct download URLs for all fonts, grouped by category
download-fonts.sh          # Bash script: parses download-links.md, downloads fonts to ./download/
wordlist.txt               # German word list used by font_specimen_svg_generator.py
font_specimen_generator.py     # Standalone: generates PNG specimen previews (requires Pillow fonttools)
font_specimen_svg_generator.py # Standalone: generates SVG specimen previews (requires fonttools brotli)
notes.md                   # Personal dev notes / reference links
todo.md                    # Font wishlist and status tracking
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

# Convert TTF/OTF → WOFF2 (requires system woff2_compress; skips files where .woff2 already exists)
npx gulp convertFonts

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
- Variable fonts are detected by `variable` in the name, a `_vf` suffix, or **any** bracketed list of four-letter axis tags — `[wght]`, `[opsz,wght]`, `[MONO,CASL,wght,slnt,CRSV]`, `[YEAR]`. There is deliberately **no whitelist** of registered axes: Fraunces ships `SOFT`/`WONK`, Recursive `MONO`/`CASL`/`CRSV`, Climate Crisis only `YEAR`. A font whose bracket list contains no registered axis would otherwise not count as variable at all — no sliders, no 3D cube, no `Variable` tag.
- `extractAxes` returns the bracket contents lowercased, so `node.varAxes` holds `year`, `mono`, `soft` etc. The **real** axis metadata (correct case, min/max/default) comes from `fontVariableAxes.js` via fontkit, not from the filename.
- Weight words in filenames are matched against a map, and longer keys win: `SemiBoldItalic` resolves to 600/italic, not 700. Avoid the words `Display`, `Headline`, `Text`, `Caption`, `Poster`, `Micro`, `Subhead` in a filename unless the file genuinely is an optical-size variant — `fonts.js` reads them as optical-size discriminators and splits the family.

### `meta.yaml` fields (all optional)

| Field | Purpose |
|---|---|
| `title` | Display name (overrides sanitized folder name) |
| `url` | Source/project link — exposed on the node object as `sourceUrl`, **not** `url` (`node.url` is the page path) |
| `tags` | Comma-separated string or YAML array. **The first tag is the font class** (`category` field) and determines the first URL segment. Variable fonts get `Variable` auto-appended if not already present. |
| `fontauthor` | Designer name |
| `fontyear` | Year (original or digitisation) |
| `heroletter` | Single character(s) for the large CMYK hero display |
| `heroword` | Word/phrase shown large on the specimen |
| `herostyle` | CSS font-weight keyword for heroword (e.g. `bold`); defaults to `regular` |
| `color` | CSS color keyword or hex value for accent. If omitted, a deterministic color is generated from the font key hash using `randomColors` config in `site.json`. |
| `border` | Border SVG filename override (e.g. `hash.svg`); defaults to `line2.svg` |
| `content` | Markdown string rendered below the specimen |
| `comment` | Internal note — displayed on page below the header |
| `imageOverrides` | Override gallery image list |
| `wikipedia` | Wikipedia article URL (shown as link on specimen page) |
| `license` | License string (e.g. `SIL Open Font License 1.1`). Auto-detected from `OFL.txt` / `OFL-1.1.txt` / `LICENSE.txt` / `LICENSE` in the font folder if omitted; setting it overrides detection. Shown next to `fontyear` in the specimen header. GUST fonts (TeX Gyre) are **not** detected — those nodes have `license: null`. |
| `favorite` | Boolean. When `true`, shows a gold star badge on the font's card and next to its title on the specimen page. |

**License auto-detection**: `fonts.js` scans each font folder for `OFL.txt`, `OFL-1.1.txt`, `LICENSE.txt`, `LICENSE` etc. and reads the content to identify OFL, MIT, or Apache licenses. Result available as `folder.license` in templates.

### Flat node fields (`folder.*` in templates)

Every leaf node exposes: `key`, `path`, `isLeaf`, `ownFonts`, `url`, `parentPath`, `title`, `sourceUrl`, `tags`, `category`, `fontauthor`, `fontyear`, `heroletter`, `heroword`, `herostyle`, `color`, `colorHex`, `colorIsAuto`, `border`, `comment`, `content`, `imageOverrides`, `wikipedia`, `license`, `favorite`, `varAxes`.

- `colorIsAuto: true` when no `color` was set in `meta.yaml` (auto-generated from key hash).
- `varAxes`: array of axis tags (`wght`, `wdth`, etc.) across all variable files in the folder.

### Color system
- Each font's `color` field sets `--color-base-primary` in the page's `<style>` block.
- `fonts.js` also resolves `color` to a hex value (`colorHex`) via a built-in CSS color keyword lookup table. `colorHex` is available on every flat node.
- Fallback colors for fonts without a `color` field are generated deterministically from the font's key using `hashKey()` and the `randomColors` config in `site.json` (`hueFrom`, `hueTo`, `saturation`, `lightness`).
- Two secondary colors are derived at runtime via CSS relative color syntax: `--color-base-secondary` and `--color-base-tertiary` use `hsl(from primary calc(h + --hue-offset))`.
- `--hue-offset-2` and `--hue-offset-3` are set to random values (120–360) by an inline `<script>` in `base.njk` — this randomises the secondary/tertiary accent colors on every page load.
- All semantic color tokens (`--color-accent`, `--color-background`, etc.) use `color-mix(in oklab, ...)` to produce tinted variants of the base colors.
- Color utility classes (`.indigo`, `.bg-olivedrab`, …) are auto-generated by `_dynamic-colors.njk` using the same `color-mix(in oklab, ...)` approach — **never hand-write them**.

### Unicode coverage
- `unicodeRanges.js` defines the named Unicode blocks shown on specimen pages (ASCII, Latin-1, Latin Extended A/B, Ligatures, Fractions).
- `fontCodepoints.js` reads each font's actual `.woff2` file via `fontkit` and builds a `{ codepoint: 1 }` lookup map keyed by `node.key`. It picks the Regular upright file, falling back to any upright then any file. Missing or unreadable fonts are silently skipped; templates treat a missing entry as "all glyphs present".
- `fontVariableAxes.js` reads variable axes from each font's `.woff2` via `fontkit`. Returns `{ nodeKey: { axisTag: { name, min, max, default, step, steps } } }`. Used by `font-poster.njk` for the axis sliders and the per-axis waterfall. fontkit reports **custom** axes too (`SOFT`, `WONK`, `MONO`, `CASL`, `CRSV`, `YEAR`), so this is the authoritative axis source — `node.varAxes` from `fonts.js` is only the lowercased filename bracket.
- `buildSteps()` in that file special-cases binary axes: `ital` renders as `font-style: normal|italic`, `WONK` as a two-state toggle (`Aus`/`An`). Everything else gets evenly spaced steps (9 for `wght`, 7 otherwise) with a ready-made CSS string per step.
- The `opsz` slider deliberately starts at the axis **maximum**, not at the font's own default. Fraunces defaults to `opsz 9`, which looks wrong on a large specimen preview — and suppresses WONK entirely, see the Fraunces note below.

### Variable font specimen

When `fontVariableAxes[folder.key]` is non-empty, `font-poster.njk` renders two variable-font-specific sections instead of the usual weight waterfall:

1. **3D cube** (`src/_includes/3dcube.njk`) — an interactive, mouse-draggable 3D scatter-plot of glyph instances across up to 3 axes. The cube is configured via an embedded `<script type="application/json" id="vf-cube-cfg">` block containing:
   - `word` — `folder.heroword` or `folder.title` (used as the rendered glyph)
   - `grid` — grid dimension (clamped to 3–8, derived from word length)
   - `axes` — first 3 axes from `fontVariableAxes`, each tagged `x`, `y`, or `z`
   - Inline JS reads the JSON config, builds a CSS 3D projection with yaw/pitch, and handles pointer/touch drag events. German UI label references [recursive.design](https://www.recursive.design/).

2. **Per-axis waterfall** — one `<section class="waterfall waterfall--axis waterfall--axis-{axisTag}">` per variable axis. Each row applies an inline `step.style` (generated by `fontVariableAxes.js`) to cycle through the axis range using real min/max/step values from fontkit.

For **static (non-variable) fonts**, `font-poster.njk` renders the traditional weight waterfall via `waterfall-groups.njk` instead.
### Non-obvious font behaviour worth knowing before debugging

- **Fraunces `WONK` looks dead below ~opsz 22.** Fraunces implements Wonk purely through GSUB feature variations (`rvrn`) that swap 26 glyphs (`h m n s &` plus accented forms) — there are no outline deltas on the axis. Its condition set has *two* triggers for the same substitution: `WONK` ≤ −0.51 normalised, **and** `opsz` below roughly 21.7. So at ordinary text sizes the straight forms are forced no matter what `WONK` says. `fontVariableAxes.js` therefore pins `'opsz' <max>` into the WONK waterfall steps, and the `opsz` slider starts at the axis maximum. If you set `font-variation-settings: 'WONK' 1` anywhere else and see no change, this is why. Also note Wonk touches only those five letters — a heroword without `h`, `m`, `n`, `s` or `&` shows nothing.
- **`font-optical-sizing: auto` is the CSS default**, so `opsz` follows the font-size in pt (px × 0.75) unless a rule pins it explicitly. Any axis whose behaviour depends on `opsz` is size-dependent in the waterfall.
- **Non-Latin fonts have no coverage support yet.** Vazirmatn (Arabic/Persian) and Frank Ruhl Libre (Hebrew) are in the collection, but `unicodeRanges.js` lists only Latin blocks — their coverage bars read low and their native ranges are invisible. Adding a script means extending `unicodeRanges.js` plus panagram and paragraph samples in `site.json`.
- **Pixel fonts** (Silkscreen, Pixelify Sans, Jacquarda Bastarda 9) render cleanly only at their design size and integer multiples of it. Blurry edges in the waterfall are expected, not a bug.
- **Some fonts have very small glyph sets** (Tangerine 232, Silkscreen 228, UnifrakturCook 271). Low coverage percentages on those cards are correct.

### 3D variable font cube
- `3dcube.njk` is included by `font-poster.njk` for variable fonts (when `fontVariableAxes[folder.key]` is non-empty).
- Reads axis data from a `<script type="application/json" id="vf-cube-cfg">` block — maps up to 3 axes to X, Y, Z rotation of the cube.
- Word shown on cube faces is `folder.heroword` or `folder.title`.
- Inspired by recursive.design; drag to rotate; uses inline JS only (no external dependencies).

### Font network graph

- `fontNetwork.js` (data layer) emits one `{nodes, links}` object for the whole catalog: a node per
  leaf font (`font:<key>`, carrying `url` and `category`), a node per tag (`tag:<slug>`) and a node per
  author (`author:<slug>`), with an edge from each font to each of its tags and to its author. The same
  payload is inlined on two surfaces, so it ships twice — as `#font-network-data` on `/network.html`
  and again inside every specimen page.
- `network.njk` renders the full graph. `font-poster.njk` embeds the same graph scoped to the current
  font via `data-highlight="font:<key>"` — `font-network.js` then fades every node that is not directly
  linked to it, so the immediate neighbourhood stands out.
- The layout is **ForceAtlas2** (Jacomy et al.), hand-implemented as three custom d3-force forces in
  `font-network.js`: `forceAtlas2Repulsion` (degree-weighted), `forceAtlas2Attraction` and
  `forceAtlas2Gravity`, registered under the `charge` / `link` / `gravity` slots of the vendored
  force-graph simulation. The tuned constants live at the `.d3Force(...)` calls — repulsion 5,
  attraction 0.15, gravity 0.5013. `forceAtlas2Attraction` carries an `.id()` shim because
  force-graph calls that method on whatever sits in the `link` slot.
- The highlighted node is pinned to the origin so the camera can simply `centerAt(0, 0)`. Without that
  pin the graph rendered outside the viewport and only appeared after a zoom gesture.
- `force-graph.min.js` is a vendored minified bundle — do not edit it, and do not assume a matching
  standalone d3 version is available.

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
- Font card (`_cards.scss`): the header's blurred background image scales to 1.1 on hover, and the card link swaps to `--color-text` on `--color-background` (1 s ease-out); the link underline is disabled. The card's tag footer is tinted in `font-card.njk` with `color-mix(in oklab, <color>, transparent 78%)` — a deliberately weak stripe, one value for both light and dark.

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
- **Note**: `src/img/` contains `or_preview.jpg` (likely a personal reference image). The OG fallback `og_preview.png` is not tracked in git — it must exist in `dist/img/` or be placed there manually.

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
- Group node URLs: one virtual group per unique `tags[0]` value, URL = `/<tags[0]-slug>.html`. Current groups: `blackletter`, `display`, `monospace`, `sans`, `script`, `serif` — six, generated in `fonts.js` post-processing. There are no folder-based group nodes.
- `src/webfonts/comicsans/` still exists as a folder but produces **no** group: its three fonts (Kalam, Komika, Krikikrak) are tagged `Script` and live under `/script/`. Same for `src/webfonts/mono/`, whose fonts are tagged `Monospace` and live under `/monospace/`.
- The `category` field on every leaf node equals `tags[0]`. If `tags` is empty the build emits a warning and `category` is `null`.
- **Navigation (menu, breadcrumb) and URLs both follow `tags[0]`**, not the folder structure. Moving a font between category folders has no effect on its URL — only changing `tags[0]` does.
- `node.parentPath` is set to `slugify(tags[0])`. Navigation filters operate on `parentPath`/`path`.
- **Manual nav pages** (`alternatives.njk`, `compare.njk`) use `eleventyNavigation` frontmatter and are surfaced by the `getManualNav` filter — they are independent of the font data tree and do not appear in group/leaf navigation.

### Background image downloads
- `src/img/background/` and per-font `background/` folders support a `urls.txt` file listing image sources to download.
- Supported formats per line: `name=unsplash:PHOTO_ID`, `name=pexels:PHOTO_ID`, `name=https://…`, or a bare `https://…` (filename derived from URL).
- Run `npx gulp download` to fetch images. The `default` and `build` tasks also run this automatically. Already-downloaded files are skipped.
- The directory is gitignored (except `sample.webp` and `urls.txt`), so images must be re-downloaded in fresh checkouts.

### Font conversion
- `npx gulp convertFonts` scans `src/webfonts/` recursively for `.ttf`/`.otf` files and converts each to `.woff2` via the system binary `woff2_compress`.
- Skips files where a `.woff2` already exists. Errors if `woff2_compress` is not installed.
- `download-fonts.sh` is a separate bash script (independent of Gulp) that parses `download-links.md` and downloads font ZIP packages from Google Fonts and GitHub releases into `./download/`.

### Structured data (SEO)
- `base.njk` emits JSON-LD `BreadcrumbList` on all folder/leaf pages and a `SoftwareApplication` entity on the homepage. Uses `jsonEscape` filter to safely embed template values into JSON.

### Python specimen generators
Two standalone tools — not part of the Gulp/Eleventy build pipeline.

**`font_specimen_generator.py`** — PNG output
- Requires: `pip install Pillow fonttools`
- CLI: `python font_specimen_generator.py --input <fonts-dir> --output <output-dir> [--width 1000] [--theme dark|white|cream] [--overwrite]`
- Short flags: `-i`, `-o`, `-w`, `-t`. Default width: 1000px. Default theme: `dark`.

**`font_specimen_svg_generator.py`** — SVG output (self-contained, font embedded as Base64)
- Requires: `pip install fonttools brotli` (no Pillow)
- CLI: `python font_specimen_svg_generator.py --input <fonts-dir> --output <output-dir> [--width 1400] [--theme dark|white|cream] [--overwrite] [--wordlist <file>]`
- `--wordlist`: path to a text file with words (one per line) used for the hero word on each specimen. Defaults to built-in list.
- `wordlist.txt` in the project root is the default word list (German words).

Both tools operate on **folders**, not individual files — scan `--input` recursively for `.ttf`, `.otf`, `.woff`, `.woff2`. Output goes to `previews/` by convention.

---

## Important constraints

- **Never manually edit** `src/scss/webfonts/*.scss`, `src/scss/_includes/_html_colornames.scss`, or `src/scss/_includes/_font-borders.scss` — all three are regenerated on every build by Eleventy templates.
- **Never edit `dist/`** — it is the build artifact and is gitignored.
- `fonts.js` is the single source of truth for font data. All other `_data` files call `fonts()` and filter/reshape its output. Don't duplicate logic elsewhere. The result is memoized — `fonts()` only scans the filesystem once per build process.
- `src/_data/site.json` sets global fallback values (heroword, heroletter, panagram, paragraph text). Specimen pages fall back to these when a font's `meta.yaml` omits them. `paragraph8` through `paragraph28` are keyed by font size in px. The `randomColors` object controls hue/saturation/lightness for auto-generated font accent colors.
- Background images in `src/img/background/` are gitignored (except `sample.webp` and `urls.txt`). The data file prefers `.webp` when both formats exist for the same stem.
- **Never add subdirectories to `src/img/borders/`** — color variants are build artifacts written directly to `dist/`.
- **Never run git yourself** — every git task goes to the `git-worker` subagent, see the Git section at the top.

---

## Common tasks

### 1. Add a new font

1. Create `src/webfonts/<category>/<FamilyName>/`.
2. Drop `.woff2` files in. Name them `FamilyName_Weight.woff2` (e.g. `Jost_Regular.woff2`, `Jost_Bold.woff2`).
3. Add `meta.yaml` — the **first tag determines the URL** and `category` field (e.g. `tags: Garalde, Serif` → page at `/garalde/<familyname>.html`). A missing or empty `tags` field emits a build warning.
4. Run `npx gulp` — Eleventy generates the SCSS partial, Gulp compiles it, the specimen page appears.

### 1b. Where the wishlist lives

`todo.md` holds the gap analysis and the wishlist. Each row carries the verified upstream
project URL (resolved via `METADATA.pb` in the `google/fonts` repo, not the Google Fonts
specimen page) and a `Lücke` column explaining what the entry would add. One entry stays
open on purpose: **Fette Fraktur** has no free digitisation — its folder and `meta.yaml`
exist but no font file, and the previously recorded Google Fonts URL was a 404.

### 2. Edit font metadata

Edit `src/webfonts/<category>/<FamilyName>/meta.yaml`. The data layer re-reads it on each build.

### 3. Add per-font background or gallery images

- **Card background**: place images in `src/webfonts/<category>/<FamilyName>/background/`. WebP is preferred. Referenced automatically via `fontBackgrounds.js`.
- **Gallery images**: place images in `src/webfonts/<category>/<FamilyName>/gallery/`. Shown on the specimen page. Falls back to images directly in the folder if no `gallery/` subfolder exists.
- **Download from URL**: add a `urls.txt` to the `background/` folder and run `npx gulp download`.

### 4. Change global defaults (panagram, paragraphs, heroword)

Edit `src/_data/site.json`.

### 5. Deploy to GitHub Pages

Run the build yourself, but route the git side (the force-push to `gh-pages`) through the
`git-worker` subagent — it is a force-push and therefore exactly the case the worker guards.

```bash
npx gulp deploy
```

Runs: ghpages build → force-push to `gh-pages`. `git subtree push` does not work because `dist/` is gitignored.

The `ghpages` Gulp task uses `HtmlBasePlugin` via the Eleventy `--pathprefix=font-collection` flag to rewrite all asset URLs for the subdirectory path.

### 6. Convert downloaded TTF/OTF fonts to WOFF2

```bash
# Requires woff2_compress (e.g. sudo apt install woff2 / brew install woff2)
npx gulp convertFonts
```

### 7. Download fonts listed in download-links.md

```bash
bash download-fonts.sh
# Fonts land in ./download/ as ZIP files
```

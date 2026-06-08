const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const cp = require("child_process");
const concat = require("gulp-concat");
const { rimrafSync } = require("rimraf");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-html-minifier-terser");
const prettier = require("gulp-prettier").default;
const sourcemaps = require("gulp-sourcemaps");
const sharpOptimizeImages = require("gulp-sharp-optimize-images").default;
const newer = require("gulp-newer");

// ---------------------------------------------------------------------------
// Konfiguration
// ---------------------------------------------------------------------------

const PATHS = {
  mainScss: "src/scss/**/*.scss",
  fontsScss: "src/scss/webfonts/**/*.scss",
  webfonts: "src/webfonts/**/*",
  images: "src/img/**/*",
  js: "src/js/**/*",
  favicon: ["src/favicon.ico", "src/favicon.svg"],
};

const SHARP_OPTS = {
  jpg_to_webp: { quality: 75, resize: { width: 960, fit: "inside", withoutEnlargement: true } },
  jpeg_to_webp: { quality: 75, resize: { width: 960, fit: "inside", withoutEnlargement: true } },
  png_to_webp: { quality: 75, resize: { width: 960, fit: "inside", withoutEnlargement: true } },
};

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

function clean(done) {
  rimrafSync("dist");
  done();
}

/** Erstellt eine SCSS-Kompilier-Funktion. Mit `withSourcemaps` für den Dev-Modus. */
function makeSassTask(glob, outFile, { withSourcemaps = false } = {}) {
  return function compileSass() {
    let stream = src(glob);
    if (withSourcemaps) stream = stream.pipe(sourcemaps.init());
    stream = stream.pipe(sass().on("error", sass.logError));
    if (outFile) stream = stream.pipe(concat(outFile));
    if (withSourcemaps) stream = stream.pipe(sourcemaps.write("."));
    return stream.pipe(dest("dist/css")).pipe(browserSync.stream());
  };
}

/** Startet Eleventy, optional mit einem Pfad-Präfix für GitHub Pages. */
function makeEleventyTask(pathprefix = null) {
  return function buildEleventy() {
    const args = ["@11ty/eleventy", "--quiet"];
    if (pathprefix) args.push(`--pathprefix=${pathprefix}`);
    return cp.spawn("npx", args, { stdio: "inherit", shell: true });
  };
}

// ---------------------------------------------------------------------------
// SCSS-Tasks
// ---------------------------------------------------------------------------

const compileMainSass = makeSassTask(PATHS.mainScss, null, { withSourcemaps: true });
const compileFontsScss = makeSassTask(PATHS.fontsScss, "webfonts/all-fonts.css", { withSourcemaps: true });
const compileMainSassMinified = makeSassTask(PATHS.mainScss, null);
const compileFontsScssMinified = makeSassTask(PATHS.fontsScss, "webfonts/all-fonts.css");
// GhPages verwendet dieselbe Logik wie der normale Build (kein Sourcemap, kein Minify)
const compileMainSassGhPages = compileMainSassMinified;
const compileFontsScssGhPages = compileFontsScssMinified;

// ---------------------------------------------------------------------------
// Eleventy-Tasks
// ---------------------------------------------------------------------------

const buildEleventy = makeEleventyTask();
const buildEleventyGhPages = makeEleventyTask("font-collection");

// ---------------------------------------------------------------------------
// HTML-Tasks
// ---------------------------------------------------------------------------

function minifyHTML() {
  return src("dist/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, minifyCSS: true, minifyJS: true }))
    .pipe(dest("dist"));
}

function beautifyHTML() {
  return src("dist/**/*.html")
    .pipe(prettier({
      tabWidth: 2,
      parser: "html",
      printWidth: 120,
      htmlWhitespaceSensitivity: "ignore",
    }))
    .pipe(dest("dist"));
}

// ---------------------------------------------------------------------------
// Statische Dateien kopieren / optimieren
// ---------------------------------------------------------------------------

function copyFonts() {
  return src(PATHS.webfonts, { encoding: false })
    .pipe(newer("dist/webfonts"))
    .pipe(dest("dist/webfonts"));
}

function copyImages() {
  // SVGs und sonstige Nicht-Bitmap-Dateien direkt kopieren
  src(["src/img/**/*", "!src/img/**/*.{jpg,jpeg,png}"], { encoding: false })
    .pipe(newer("dist/img"))
    .pipe(dest("dist/img"));

  // Bitmaps optimieren und als WebP ausgeben
  return src("src/img/**/*.{jpg,jpeg,png}")
    .pipe(newer({ dest: "dist/img", ext: ".webp" }))
    .pipe(sharpOptimizeImages(SHARP_OPTS))
    .pipe(dest("dist/img"));
}

function copyJS() {
  return src(PATHS.js)
    .pipe(newer("dist/js"))
    .pipe(dest("dist/js"));
}

function copyFavicon() {
  return src(PATHS.favicon, { allowEmpty: true }).pipe(dest("dist"));
}

// ---------------------------------------------------------------------------
// Dev-Server & Watcher
// ---------------------------------------------------------------------------

function serve(done) {
  browserSync.init({
    server: { baseDir: "./dist" },
    port: 3000,
    middleware: (req, res, next) => { res.setHeader("Access-Control-Allow-Origin", "*"); next(); },
  });
  done();
}

function watchFiles() {
  watch([PATHS.mainScss, `!${PATHS.fontsScss}`], compileMainSass);
  watch(PATHS.fontsScss, compileFontsScss);
  watch(PATHS.webfonts, copyFonts);
  watch(PATHS.images, copyImages);
  watch(PATHS.js, copyJS);

  watch(
    ["src/**/*.njk", "src/**/*.md", "src/**/*.html", "src/_data/**/*.js"],
    series(buildEleventy, parallel(compileMainSass, compileFontsScss), (done) => {
      browserSync.reload();
      done();
    }),
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

const copyStatic = parallel(copyFonts, copyImages, copyJS, copyFavicon);

exports.default = series(
  clean,
  buildEleventy,
  parallel(copyStatic, compileMainSass, compileFontsScss),
  serve,
  watchFiles,
);

exports.build = series(
  clean,
  buildEleventy,
  parallel(copyStatic, compileMainSassMinified, compileFontsScssMinified),
  beautifyHTML,
);

exports.ghpages = series(
  clean,
  buildEleventyGhPages,
  parallel(copyStatic, compileMainSassGhPages, compileFontsScssGhPages),
  beautifyHTML,
);

exports.clean = series(clean);
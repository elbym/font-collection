const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const cp = require("child_process");
const concat = require("gulp-concat"); // Added for concatenating font SCSS files
const { rimrafSync } = require("rimraf");

const cleanCSS = require("gulp-clean-css"); // For minifying CSS
const htmlmin = require("gulp-htmlmin"); // For minifying HTML
const htmlbeautify = require("gulp-html-beautify"); // For beautifying HTML
const sourcemaps = require("gulp-sourcemaps");

function clean(done) {
  rimrafSync("dist");
  done();
}

// 1. SASS Task
function compileMainSass() {
  return src(["src/scss/**/*.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

// 1a. SASS Task für Fonts (zu all-fonts.css)
function compileFontsScss() {
  return src("src/scss/fonts/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("all-fonts.css")) // Concatenate all font SCSS into one file
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

// 1b. SASS Task mit CSS-Minifizierung (nur für Builds) - Main SCSS
function compileMainSassMinified() {
  return src(["src/scss/**/*.scss"])
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest("dist/css"));
}

// 1c. SASS Task mit CSS-Minifizierung (nur für Builds) - Fonts SCSS
function compileFontsScssMinified() {
  return src("src/scss/fonts/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("all-fonts.css"))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest("dist/css"));
}

// 1d. SASS Task mit CSS-Minifizierung und URL-Prefixing für GitHub Pages - Main SCSS
function compileMainSassGhPages() {
  return src(["src/scss/**/*.scss"])
    .pipe(sass().on("error", sass.logError))
    // .pipe(replace(/url\(['"]?(?:\.\.\/)*fonts\/(.*?)['"]?\)/g, 'url("/font-collection/fonts/$1")'))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest("dist/css"));
}

// 2. Eleventy Task
// 1e. SASS Task mit CSS-Minifizierung und URL-Prefixing für GitHub Pages - Fonts SCSS
function compileFontsScssGhPages() {
  return src("src/scss/fonts/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("all-fonts.css"))
    // .pipe(replace(/url\(['"]?(?:\.\.\/)*fonts\/(.*?)['"]?\)/g, 'url("/font-collection/fonts/$1")'))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest("dist/css"));
}

function buildEleventy() {
  return cp.spawn("npx", ["@11ty/eleventy", "--quiet"], {
    stdio: "inherit",
    shell: true,
  });
}

// 2b. Eleventy Task für GitHub Pages (mit Pathprefix)
function buildEleventyGhPages() {
  return cp.spawn("npx", ["@11ty/eleventy", "--quiet", "--pathprefix=font-collection"], {
    stdio: "inherit",
    shell: true,
  });
}

// HTML minifizieren (läuft nach Eleventy, da Eleventy die HTML-Dateien erzeugt)
function minifyHTML() {
  return src("dist/**/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,   // Inline-CSS ebenfalls minifizieren
      minifyJS: true,    // Inline-JS ebenfalls minifizieren
    }))
    .pipe(dest("dist"));
}

// HTML verschönern
function beautifyHTML() {
  const options = {
    indent_size: 2,
    indent_char: " ",
    unformatted: ["code", "pre", "em", "strong", "span", "i", "b", "br"],
    preserve_newlines: true,
    max_preserve_newlines: 2,
  };
  return src("dist/**/*.html")
    .pipe(htmlbeautify(options))
    .pipe(dest("dist"));
}

// 3. Copy Static files
function copyFonts() {
  return src("src/fonts/**/*", { encoding: false }).pipe(dest("dist/fonts"));
}
function copyImages() {
  return src("src/img/**/*", { encoding: false }).pipe(dest("dist/img"));
}
function copyJS() {
  return src("src/js/**/*").pipe(dest("dist/js"));
}
function copyFavicon() {
  return src(["src/favicon.ico", "src/favicon.svg"], { allowEmpty: true }).pipe(dest("dist"));
}

// 3. Browser-Sync
function serve(done) {
  browserSync.init({
    server: { baseDir: "./dist" },
    port: 3000,
    // Füge CORS-Header hinzu, um sicherzustellen, dass Schriften akzeptiert werden
    middleware: function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    },
  });
  done();
}

// 4. Watcher
function watchFiles() {
  watch(["src/scss/**/*.scss", "!src/scss/fonts/**/*.scss"], compileMainSass); // Watch main SCSS
  watch("src/scss/fonts/**/*.scss", compileFontsScss); // Watch font SCSS
  watch("src/fonts/**/*", copyFonts);
  watch("src/img/**/*", copyImages);
  watch("src/js/**/*", copyJS);

  watch(
    ["src/**/*.njk", "src/**/*.md", "src/**/*.html", "src/_data/**/*.js"], // Added _data/**/*.js to watch for changes in font data
    series(buildEleventy, parallel(compileMainSass, compileFontsScss), (done) => { // Recompile SCSS after Eleventy rebuilds
      browserSync.reload();
      done();
    }),
  );
}

exports.default = series(
  clean, // Added clean to default task for a fresh start
  buildEleventy, // Eleventy must run first to generate font SCSS files
  parallel(copyFonts, copyImages, copyJS, copyFavicon, compileMainSass, compileFontsScss),
  serve,
  watchFiles,
);

// Produktions-Build: mit Minifizierung
exports.build = series(
  clean,
  buildEleventy, // Eleventy must run first to generate font SCSS files
  parallel(copyImages, copyFonts, copyJS, copyFavicon, compileMainSassMinified, compileFontsScssMinified),
  beautifyHTML,
);

// GitHub Pages mit Prefix + Minifizierung
exports.ghpages = series(
  clean,
  buildEleventyGhPages, // Eleventy must run first to generate font SCSS files
  parallel(copyImages, copyFonts, copyJS, copyFavicon, compileMainSassGhPages, compileFontsScssGhPages),
  // minifyHTML,
  beautifyHTML,
);

exports.clean = series(clean);
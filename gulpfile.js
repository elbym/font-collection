const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const cp = require("child_process");
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
function compileSass() {
  return src("src/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

// 1b. SASS Task mit CSS-Minifizierung (nur für Builds)
function compileSassMinified() {
  return src("src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest("dist/css"));
}

// 1c. SASS Task mit CSS-Minifizierung und URL-Prefixing für GitHub Pages
function compileSassGhPages() {
  return src("src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(replace(/url\(['"]?(?:\.\.\/)*fonts\/(.*?)['"]?\)/g, 'url("/font-collection/fonts/$1")'))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest("dist/css"));
}

// 2. Eleventy Task
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
  return src("src/img/**/*").pipe(dest("dist/img"));
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
  watch("src/scss/**/*.scss", compileSass);
  watch("src/fonts/**/*", copyFonts);
  watch("src/img/**/*", copyImages);
  watch("src/js/**/*", copyJS);

  watch(
    ["src/**/*.njk", "src/**/*.md", "src/**/*.html"],
    series(buildEleventy, (done) => {
      browserSync.reload();
      done();
    }),
  );
}

exports.default = series(
  copyFavicon,
  parallel(copyFonts, copyImages, copyJS, buildEleventy, compileSass),
  serve,
  watchFiles,
);

// Produktions-Build: mit Minifizierung
exports.build = series(
  clean,
  buildEleventy,
  parallel(copyImages, copyFonts, copyJS, copyFavicon, compileSassMinified),
  beautifyHTML,
);

// GitHub Pages mit Prefix + Minifizierung
exports.ghpages = series(
  clean,
  buildEleventyGhPages,
  parallel(copyImages, copyFonts, copyJS, copyFavicon, compileSassGhPages),
  minifyHTML,
);

exports.clean = series(clean);
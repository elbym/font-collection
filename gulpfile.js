const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const cp = require("child_process");
const { rimrafSync } = require("rimraf");

const nunjucksRender = require("gulp-nunjucks-render");

function clean(done) {
  rimrafSync("dist");
  done();
}

// 1. SASS Task
function compileSass() {
  return src("src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

// 2. Eleventy Task
function buildEleventy() {
  return cp.spawn("npx", ["@11ty/eleventy", "--quiet"], {
    stdio: "inherit",
    shell: true,
  });
}

// 3. Fonts Task
function copyFonts() {
  return src("src/fonts/**/*", { encoding: false }).pipe(dest("dist/fonts"));
}

// 4. Fonts Task
function copyImages() {
  return src("src/img/**/*", { encoding: false }).pipe(dest("dist/img"));
  return src("src/js/**/*").pipe(dest("dist/js"));
}
// 4. Fonts Task
function copyJS() {
  return src("src/js/**/*").pipe(dest("dist/js"));
}
// 5. Browser-Sync
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

// 6. Watcher
function watchFiles() {
  watch("src/scss/**/*.scss", compileSass);
  // Auch Fonts überwachen, falls du im laufenden Betrieb neue hinzufügst
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
  // parallel(copyFonts, copyImages, copyJS, buildEleventy, compileSass),
  parallel(copyImages, copyJS, buildEleventy, compileSass),
  serve,
  watchFiles,
);

exports.build = series(
  clean,
  buildEleventy,
  parallel(copyImages, copyFonts, copyJS, compileSass),
);

exports.clean = series(clean);

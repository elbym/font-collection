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
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

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
// Hintergrundbild-Download aus urls.txt
// ---------------------------------------------------------------------------

/**
 * Liest eine urls.txt und gibt {filename, url}[]-Einträge zurück.
 * Formate (eine Zeile pro Eintrag, # = Kommentar):
 *   https://example.com/foto.jpg          → Dateiname aus URL ableiten
 *   mein-foto=https://example.com/...     → expliziter Dateiname (Endung auto-erkannt)
 *   mein-foto.jpg=https://example.com/... → wie oben, .jpg wird ignoriert (Endung auto-erkannt)
 */
function parseUrlFile(filePath) {
  const entries = [];
  for (const rawLine of fs.readFileSync(filePath, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx > 0 && !/^https?:\/\//.test(line)) {
      const filename = line.slice(0, eqIdx).trim();
      const url = line.slice(eqIdx + 1).trim();
      if (/^https?:\/\//.test(url)) entries.push({ filename, url });
    } else if (/^https?:\/\//.test(line)) {
      entries.push({ filename: null, url: line });
    }
  }
  return entries;
}

/** Leitet den Dateinamen (ohne Erweiterung) aus dem URL-Pfad ab. */
function stemFromUrl(urlStr) {
  try {
    const lastSegment = new URL(urlStr).pathname.split("/").filter(Boolean).pop() || "";
    const dotIdx = lastSegment.lastIndexOf(".");
    const stem = dotIdx > 0 ? lastSegment.slice(0, dotIdx) : lastSegment;
    return stem || `img-${Date.now()}`;
  } catch {
    return `img-${Date.now()}`;
  }
}

/** Gibt die Dateiendung basierend auf dem Content-Type-Header zurück. */
function extFromContentType(ct = "") {
  if (ct.includes("image/webp")) return ".webp";
  if (ct.includes("image/png")) return ".png";
  if (ct.includes("image/avif")) return ".avif";
  return ".jpg";
}

/** Prüft, ob ein Bild mit dem gegebenen Stammnamen (ohne Erweiterung) bereits existiert. */
function imageAlreadyExists(dir, stem) {
  return [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"].some(
    (ext) => fs.existsSync(path.join(dir, stem + ext))
  );
}

/**
 * Lädt ein Bild herunter. Dateiendung wird aus Content-Type erkannt.
 * Folgt HTTP-Weiterleitungen (max. 10). Gibt den tatsächlichen Zielpfad zurück.
 */
function downloadImage(fileUrl, destDir, stem, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 10) { reject(new Error(`Zu viele Weiterleitungen: ${fileUrl}`)); return; }
    let urlObj;
    try { urlObj = new URL(fileUrl); } catch (e) { reject(new Error(`Ungültige URL: ${fileUrl}`)); return; }
    const protocol = urlObj.protocol === "https:" ? https : http;
    const req = protocol.get(fileUrl, { headers: { "User-Agent": "Mozilla/5.0 (compatible; font-collection-build/1.0)" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        downloadImage(new URL(res.headers.location, fileUrl).href, destDir, stem, redirectCount + 1)
          .then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}: ${fileUrl}`));
        return;
      }
      const destPath = path.join(destDir, stem + extFromContentType(res.headers["content-type"]));
      const ws = fs.createWriteStream(destPath);
      res.pipe(ws);
      ws.on("finish", () => resolve(destPath));
      ws.on("error", (err) => { try { fs.unlinkSync(destPath); } catch (_) {} reject(err); });
      res.on("error", (err) => { try { fs.unlinkSync(destPath); } catch (_) {} reject(err); });
    });
    req.on("error", reject);
  });
}

/** Findet urls.txt-Dateien direkt in background/-Unterordnern unter baseDir. */
function findFontBackgroundUrlFiles(baseDir) {
  const results = [];
  if (!fs.existsSync(baseDir)) return results;
  function scan(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const subDir = path.join(dir, entry.name);
      if (entry.name === "background") {
        const urlFile = path.join(subDir, "urls.txt");
        if (fs.existsSync(urlFile)) results.push(urlFile);
      } else {
        scan(subDir);
      }
    }
  }
  scan(baseDir);
  return results;
}

/** Gulp-Task: Lädt Hintergrundbilder aus allen urls.txt-Dateien herunter. */
async function downloadBackgroundImages() {
  const urlFiles = [];

  // Globale Hintergrundbilder
  const globalUrlFile = path.join(__dirname, "src", "img", "background", "urls.txt");
  if (fs.existsSync(globalUrlFile)) urlFiles.push(globalUrlFile);

  // Pro-Font-Hintergrundbilder
  urlFiles.push(...findFontBackgroundUrlFiles(path.join(__dirname, "src", "webfonts")));

  const pending = [];
  for (const urlFile of urlFiles) {
    const dir = path.dirname(urlFile);
    for (const { filename, url } of parseUrlFile(urlFile)) {
      const stem = filename ? path.parse(filename).name : stemFromUrl(url);
      if (!imageAlreadyExists(dir, stem)) pending.push({ url, dir, stem });
    }
  }

  if (pending.length === 0) {
    console.log("  Hintergrundbilder: Keine neuen Downloads erforderlich.");
    return;
  }

  console.log(`  Lade ${pending.length} Hintergrundbild(er) herunter…`);
  for (const { url, dir, stem } of pending) {
    fs.mkdirSync(dir, { recursive: true });
    try {
      const dest = await downloadImage(url, dir, stem);
      console.log(`    ✓ ${path.relative(__dirname, dest)}`);
    } catch (err) {
      console.error(`    ✗ ${stem}: ${err.message}`);
    }
  }
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
    ["src/**/*.njk", "src/**/*.md", "src/**/*.html", "src/_data/**/*.js", "src/webfonts/**/*.jpg"],
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
  downloadBackgroundImages,
  buildEleventy,
  parallel(copyStatic, compileMainSass, compileFontsScss),
  serve,
  watchFiles,
);

exports.build = series(
  clean,
  downloadBackgroundImages,
  buildEleventy,
  parallel(copyStatic, compileMainSassMinified, compileFontsScssMinified),
  beautifyHTML,
);

exports.ghpages = series(
  clean,
  downloadBackgroundImages,
  buildEleventyGhPages,
  parallel(copyStatic, compileMainSassGhPages, compileFontsScssGhPages),
  beautifyHTML,
);

exports.clean = series(clean);
exports.download = downloadBackgroundImages;
const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const cp = require("child_process");
const concat = require("gulp-concat");
const { rimrafSync } = require("rimraf");
const cleanCSS = require("gulp-clean-css");
const prettier = require("gulp-prettier").default;
const sourcemaps = require("gulp-sourcemaps");
const through2 = require("through2");
const sharp = require("sharp");
const newer = require("gulp-newer");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const yaml = require("js-yaml");
const chroma = require("chroma-js");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const UNSPLASH_BASE = "https://unsplash.com/photos/";
const PEXELS_BASE = "https://images.pexels.com/photos/";
const UNSPLASH_DLSIZE = 1920;
const IMAGE_MAX_WIDTH = 1080;
const IMAGE_QUALITY = 60;

const PATHS = {
  mainScss: "src/scss/**/*.scss",
  fontsScss: "src/scss/webfonts/**/*.scss",
  webfonts: "src/webfonts/**/*",
  images: "src/img/**/*",
  js: "src/js/**/*",
  favicon: ["src/favicon.ico", "src/favicon.svg", "src/apple-icon-180x180.png"],
};

/** Resizes a bitmap to IMAGE_MAX_WIDTH and converts it to WebP. */
function bitmapToWebP() {
  return through2.obj(async function (file, _enc, cb) {
    try {
      const buf = await sharp(file.path)
        .resize({ width: IMAGE_MAX_WIDTH, fit: "inside", withoutEnlargement: true })
        .webp({ quality: IMAGE_QUALITY })
        .toBuffer();
      file.contents = buf;
      file.path = file.path.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      cb(null, file);
    } catch (err) {
      cb(err);
    }
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clean(done) {
  rimrafSync("dist");
  done();
}

/** Returns a Gulp task that compiles SCSS. Pass `withSourcemaps: true` for dev mode. */
function makeSassTask(glob, outFile, { withSourcemaps = false } = {}) {
  return function compileSass() {
    let stream = src(glob);
    if (withSourcemaps) stream = stream.pipe(sourcemaps.init());
    stream = stream.pipe(sass().on("error", sass.logError));
    if (outFile) stream = stream.pipe(concat(outFile));
    if (!withSourcemaps) stream = stream.pipe(cleanCSS());
    if (withSourcemaps) stream = stream.pipe(sourcemaps.write("."));
    return stream.pipe(dest("dist/css")).pipe(browserSync.stream());
  };
}

/** Compiles each font SCSS file to its own CSS file in dist/css/webfonts/. */
function makeFontsSassTask({ withSourcemaps = false } = {}) {
  return function compileFontsCss() {
    let stream = src(PATHS.fontsScss, { base: "src/scss" });
    if (withSourcemaps) stream = stream.pipe(sourcemaps.init());
    stream = stream.pipe(sass().on("error", sass.logError));
    if (!withSourcemaps) stream = stream.pipe(cleanCSS());
    if (withSourcemaps) stream = stream.pipe(sourcemaps.write("."));
    return stream.pipe(dest("dist/css")).pipe(browserSync.stream());
  };
}

/** Returns a Gulp task that runs Eleventy, optionally with a path prefix for GitHub Pages. */
function makeEleventyTask(pathprefix = null) {
  return function buildEleventy() {
    const bin = path.join(__dirname, "node_modules", ".bin", "eleventy");
    const args = ["--quiet"];
    if (pathprefix) args.push(`--pathprefix=${pathprefix}`);
    // return cp.spawn(bin, args, { stdio: "inherit" });
    return cp.spawn(bin, args, { stdio: "inherit", shell: process.platform === "win32" });
  };
}

// ---------------------------------------------------------------------------
// Background image download from urls.txt
// ---------------------------------------------------------------------------

/**
 * Reads a urls.txt and returns {filename, url}[] entries.
 * Formats (one entry per line, # = comment):
 *   name=unsplash:ID   → https://unsplash.com/photos/ID/download?force=true&w=…
 *   name=pexels:ID     → https://images.pexels.com/photos/ID/pexels-photo-ID.jpeg
 *   name=https://…     → URL used directly
 *   https://…          → URL used directly, filename derived from path
 */
function resolveShortId(value) {
  if (value.startsWith("unsplash:")) {
    const id = value.slice("unsplash:".length);
    return `${UNSPLASH_BASE}${id}/download?force=true&w=${UNSPLASH_DLSIZE}`;
  }
  if (value.startsWith("pexels:")) {
    const id = value.slice("pexels:".length);
    return `${PEXELS_BASE}${id}/pexels-photo-${id}.jpeg`;
  }
  return null;
}

function parseUrlFile(filePath) {
  const entries = [];
  for (const rawLine of fs.readFileSync(filePath, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx > 0 && !/^https?:\/\//.test(line)) {
      const filename = line.slice(0, eqIdx).trim();
      const rawUrl = line.slice(eqIdx + 1).trim();
      const url = /^https?:\/\//.test(rawUrl) ? rawUrl : (resolveShortId(rawUrl) ?? UNSPLASH_BASE + rawUrl);
      entries.push({ filename, url });
    } else if (/^https?:\/\//.test(line)) {
      entries.push({ filename: null, url: line });
    }
  }
  return entries;
}

/** Derives the filename stem (without extension) from a URL path. */
function stemFromUrl(urlStr) {
  try {
    const lastSegment =
      new URL(urlStr).pathname.split("/").filter(Boolean).pop() || "";
    const dotIdx = lastSegment.lastIndexOf(".");
    const stem = dotIdx > 0 ? lastSegment.slice(0, dotIdx) : lastSegment;
    return stem || `img-${Date.now()}`;
  } catch {
    return `img-${Date.now()}`; // fallback for unparseable URLs
  }
}

/** Returns the file extension based on the Content-Type response header. */
function extFromContentType(ct = "") {
  if (ct.includes("image/webp")) return ".webp";
  if (ct.includes("image/png")) return ".png";
  if (ct.includes("image/avif")) return ".avif";
  return ".jpg";
}

/** Prüft, ob ein Bild mit dem gegebenen Stammnamen (ohne Erweiterung) bereits existiert. */
function imageAlreadyExists(dir, stem) {
  return [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"].some((ext) =>
    fs.existsSync(path.join(dir, stem + ext)),
  );
}

/**
 * Downloads an image. File extension is detected from the Content-Type header.
 * Follows HTTP redirects (max. 10). Returns the actual destination path.
 */
function downloadImage(fileUrl, destDir, stem, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 10) {
      reject(new Error(`Too many redirects: ${fileUrl}`));
      return;
    }
    let urlObj;
    try {
      urlObj = new URL(fileUrl);
    } catch (e) {
      reject(new Error(`Invalid URL: ${fileUrl}`));
      return;
    }
    const protocol = urlObj.protocol === "https:" ? https : http;
    const req = protocol.get(
      fileUrl,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; font-collection-build/1.0)",
        },
      },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          res.resume();
          downloadImage(
            new URL(res.headers.location, fileUrl).href,
            destDir,
            stem,
            redirectCount + 1,
          )
            .then(resolve)
            .catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}: ${fileUrl}`));
          return;
        }
        const destPath = path.join(
          destDir,
          stem + extFromContentType(res.headers["content-type"]),
        );
        const ws = fs.createWriteStream(destPath);
        res.pipe(ws);
        ws.on("finish", () => resolve(destPath));
        ws.on("error", (err) => {
          try {
            fs.unlinkSync(destPath);
          } catch (_) {}
          reject(err);
        });
        res.on("error", (err) => {
          try {
            fs.unlinkSync(destPath);
          } catch (_) {}
          reject(err);
        });
      },
    );
    req.on("error", reject);
  });
}

/** Finds urls.txt files inside background/ subdirectories under baseDir. */
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

/** Gulp task: downloads background images from all urls.txt files. */
async function downloadBackgroundImages() {
  const urlFiles = [];

  // Global background images
  const globalUrlFile = path.join(
    __dirname,
    "src",
    "img",
    "background",
    "urls.txt",
  );
  if (fs.existsSync(globalUrlFile)) urlFiles.push(globalUrlFile);

  // Per-font background images
  urlFiles.push(
    ...findFontBackgroundUrlFiles(path.join(__dirname, "src", "webfonts")),
  );

  const pending = [];
  for (const urlFile of urlFiles) {
    const dir = path.dirname(urlFile);
    for (const { filename, url } of parseUrlFile(urlFile)) {
      const stem = filename ? path.parse(filename).name : stemFromUrl(url);
      if (!imageAlreadyExists(dir, stem)) pending.push({ url, dir, stem });
    }
  }

  if (pending.length === 0) {
    console.log("  Background images: nothing to download.");
    return;
  }

  console.log(`  Downloading ${pending.length} background image(s)…`);
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
// Colored SVG border generation
// ---------------------------------------------------------------------------

// The "accent" color baked into each master SVG — this value is replaced
// with each font's accent color when generating per-color variants.
const BORDER_SOURCE_COLOR = "#cccccc";

// Minimum saturation (0–1) and maximum lightness (0–1) for generated border colors.
// Increase BORDER_MAX_SATURATION to make pale colors more vivid.
// Decrease BORDER_MAX_LIGHTNESS to darken light colors.
const BORDER_MAX_SATURATION = 0.3;
const BORDER_MIN_LIGHTNESS = 0.8;

function boostBorderColor(cssColor) {
  try {
    const c = chroma(cssColor);
    let [h, s, l] = c.hsl();
    if (isNaN(h)) h = 0; // achromatic colors (white/black/grey) get hue 0
    s = Math.min(s, BORDER_MAX_SATURATION);
    l = Math.max(l, BORDER_MIN_LIGHTNESS);
    return chroma.hsl(h, s, l).hex();
  } catch (_) {
    return cssColor; // unknown color keyword — use as-is
  }
}

function generateColoredBorders(done) {
  const srcDir = path.join(__dirname, "src", "img", "borders");
  const distDir = path.join(__dirname, "dist", "img", "borders");
  const webfontsDir = path.join(__dirname, "src", "webfonts");

  // Collect unique accent colors from all meta.yaml files
  const colors = new Set();
  function scanForColors(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        scanForColors(path.join(dir, entry.name));
      } else if (entry.name === "meta.yaml" || entry.name === "meta.yml") {
        try {
          const raw = yaml.load(fs.readFileSync(path.join(dir, entry.name), "utf-8")) || {};
          if (raw.color) colors.add(String(raw.color).trim().toLowerCase());
        } catch (_) {
          // ignore parse errors
        }
      }
    }
  }
  scanForColors(webfontsDir);

  if (colors.size === 0) {
    done();
    return;
  }

  const sourceRegex = new RegExp(BORDER_SOURCE_COLOR, "gi"); // g=alle Vorkommen, i=Groß-/Kleinschreibung egal
  const masterSvgs = fs.readdirSync(srcDir).filter((f) => f.endsWith(".svg"));
  let generated = 0;

  for (const color of colors) {
    const colorDir = path.join(distDir, color);
    fs.mkdirSync(colorDir, { recursive: true });
    const boostedColor = boostBorderColor(color);

    for (const svgFile of masterSvgs) {
      const content = fs.readFileSync(path.join(srcDir, svgFile), "utf-8");
      fs.writeFileSync(path.join(colorDir, svgFile), content.replace(sourceRegex, boostedColor), "utf-8");
      generated++;
    }
  }

  console.log(`  Colored borders: ${generated} SVG variant(s) for ${colors.size} color(s).`);
  done();
}

// ---------------------------------------------------------------------------
// Pagefind tasks
// ---------------------------------------------------------------------------

function makePagefindTask(args = []) {
  return function runPagefind(done) {
    const bin = path.join(__dirname, "node_modules", ".bin", "pagefind");
    const isWin = process.platform === "win32";
    const proc = cp.spawn(bin, ["--site", "dist", ...args], { stdio: "inherit", shell: isWin });
    proc.on("close", (code) => {
      if (code !== 0) console.error(`Pagefind exited with code ${code}`);
      done();
    });
    proc.on("error", (err) => {
      console.error("Pagefind error:", err.message);
      done();
    });
  };
}

const runPagefind = makePagefindTask();
const runPagefindGhPages = makePagefindTask();

// ---------------------------------------------------------------------------
// SCSS tasks
// ---------------------------------------------------------------------------

const compileMainSass = makeSassTask(PATHS.mainScss, null, {
  withSourcemaps: true,
});
const compileFontsScss = makeFontsSassTask({ withSourcemaps: true });
const compileMainSassMinified = makeSassTask(PATHS.mainScss, null);
const compileFontsScssMinified = makeFontsSassTask();
// GhPages uses the same logic as the regular build (no sourcemaps, no minification)
const compileMainSassGhPages = compileMainSassMinified;
const compileFontsScssGhPages = makeFontsSassTask();

// ---------------------------------------------------------------------------
// Eleventy tasks
// ---------------------------------------------------------------------------

const buildEleventy = makeEleventyTask();
const buildEleventyGhPages = makeEleventyTask("font-collection");

// ---------------------------------------------------------------------------
// HTML tasks
// ---------------------------------------------------------------------------

function beautifyHTML() {
  return src("dist/**/*.html")
    .pipe(
      prettier({
        tabWidth: 2,
        parser: "html",
        printWidth: 120,
        htmlWhitespaceSensitivity: "ignore",
      }),
    )
    .pipe(dest("dist"));
}

// ---------------------------------------------------------------------------
// Static file copy / optimise
// ---------------------------------------------------------------------------

function streamDone(stream) {
  return new Promise((resolve, reject) => stream.on("end", resolve).on("error", reject));
}

function copyFonts() {
  return Promise.all([
    streamDone(
      src(["src/webfonts/**/*", "!src/webfonts/**/*.{jpg,jpeg,png}"], { encoding: false })
        .pipe(newer("dist/webfonts"))
        .pipe(dest("dist/webfonts"))
    ),
    streamDone(
      src("src/webfonts/**/*.{jpg,jpeg,png}")
        .pipe(newer({ dest: "dist/webfonts", ext: ".webp" }))
        .pipe(bitmapToWebP())
        .pipe(dest("dist/webfonts"))
    ),
  ]);
}

function copyImages() {
  return Promise.all([
    streamDone(
      src(["src/img/**/*", "!src/img/**/*.{jpg,jpeg,png}"], { encoding: false })
        .pipe(newer("dist/img"))
        .pipe(dest("dist/img"))
    ),
    streamDone(
      src("src/img/**/*.{jpg,jpeg,png}")
        .pipe(newer({ dest: "dist/img", ext: ".webp" }))
        .pipe(bitmapToWebP())
        .pipe(dest("dist/img"))
    ),
  ]);
}

function copyJS() {
  return src(PATHS.js).pipe(newer("dist/js")).pipe(dest("dist/js"));
}

function copyFavicon() {
  return src(PATHS.favicon, { allowEmpty: true }).pipe(dest("dist"));
}

// ---------------------------------------------------------------------------
// Dev server & watcher
// ---------------------------------------------------------------------------

function serve(done) {
  browserSync.init({
    server: { baseDir: "./dist" },
    port: 3000,
    middleware: (req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    },
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
    ["src/img/borders/*.svg", "src/webfonts/**/*.yaml", "src/webfonts/**/*.yml"],
    generateColoredBorders,
  );

  watch(
    [
      "src/**/*.njk",
      "src/**/*.md",
      "src/**/*.html",
      "src/_data/**/*.js",
      "src/webfonts/**/*.js",
      "src/webfonts/**/*.yaml",
      "src/webfonts/**/*.yml",
      "src/webfonts/**/*.jpg",
    ],
    series(
      buildEleventy,
      parallel(compileMainSass, compileFontsScss),
      (done) => {
        browserSync.reload();
        done();
      },
    ),
  );
}

// ---------------------------------------------------------------------------
// Deploy
// ---------------------------------------------------------------------------

function createNojekyll(done) {
  fs.writeFileSync(path.join(__dirname, "dist", ".nojekyll"), "");
  done();
}

function deployToGhPages(done) {
  const distDir = path.join(__dirname, "dist");
  const remote = "git@github.com:elbym/font-collection.git";
  const commands = [
    `git -C "${distDir}" init`,
    `git -C "${distDir}" add -A`,
    `git -C "${distDir}" commit -m "deploy"`,
    `git -C "${distDir}" push "${remote}" HEAD:gh-pages --force`,
  ];
  function run(index) {
    if (index >= commands.length) { done(); return; }
    cp.exec(commands[index], { cwd: distDir }, (err, stdout, stderr) => {
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      if (err) { done(err); return; }
      run(index + 1);
    });
  }
  run(0);
}

// ---------------------------------------------------------------------------
// Font conversion: TTF/OTF → WOFF2
// ---------------------------------------------------------------------------

function convertToWoff2(done) {
  const webfontsDir = path.join(__dirname, "src", "webfonts");

  function findFonts(dir, results = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) findFonts(full, results);
      else if (/\.(ttf|otf)$/i.test(entry.name)) results.push(full);
    }
    return results;
  }

  const candidates = findFonts(webfontsDir);
  const toConvert = candidates.filter((f) => {
    const woff2 = f.replace(/\.(ttf|otf)$/i, ".woff2");
    return !fs.existsSync(woff2);
  });

  console.log(`  convertToWoff2: ${candidates.length} TTF/OTF found, ${toConvert.length} to convert.`);

  if (toConvert.length === 0) {
    done();
    return;
  }

  let remaining = toConvert.length;
  let errors = 0;

  for (const fontFile of toConvert) {
    const rel = path.relative(__dirname, fontFile);
    cp.execFile("woff2_compress", [fontFile], (err) => {
      if (err) {
        console.error(`  ✗ ${rel}: ${err.message}`);
        errors++;
      } else {
        console.log(`  ✓ ${rel}`);
      }
      if (--remaining === 0) {
        if (errors > 0) done(new Error(`${errors} file(s) failed — is woff2_compress installed?`));
        else done();
      }
    });
  }
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
  generateColoredBorders,
  runPagefind,
  serve,
  watchFiles,
);

exports.build = series(
  clean,
  downloadBackgroundImages,
  buildEleventy,
  parallel(copyStatic, compileMainSassMinified, compileFontsScssMinified),
  generateColoredBorders,
  runPagefind,
  beautifyHTML,
);

exports.ghpages = series(
  clean,
  downloadBackgroundImages,
  buildEleventyGhPages,
  parallel(copyStatic, compileMainSassGhPages, compileFontsScssGhPages),
  generateColoredBorders,
  runPagefindGhPages,
  beautifyHTML,
);

exports.clean = series(clean);
exports.download = downloadBackgroundImages;
exports.convertFonts = convertToWoff2;
exports.createNojekyll = createNojekyll;

exports.deploy = series(
  clean,
  downloadBackgroundImages,
  buildEleventyGhPages,
  parallel(copyStatic, compileMainSassGhPages, compileFontsScssGhPages),
  generateColoredBorders,
  runPagefindGhPages,
  beautifyHTML,
  createNojekyll,
  deployToGhPages,
);

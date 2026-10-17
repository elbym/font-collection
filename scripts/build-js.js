// Bündelt src/assets/js/main.js nach _site/main.js (esbuild).
// Standard: minifiziert (Production). `--dev`: Sourcemap, nicht minifiziert, Watch.
const esbuild = require("esbuild");

const dev = process.argv.includes("--dev");
const options = {
  entryPoints: ["src/assets/js/main.js"],
  outfile: "_site/main.js",
  bundle: true,
  format: "esm",
  target: "es2022", // Top-Level-Await in main.js
  minify: !dev,
  sourcemap: dev,
  logLevel: "info",
};

if (dev) esbuild.context(options).then((ctx) => ctx.watch());
else esbuild.build(options).catch(() => process.exit(1));

// Erzeugt zu jeder .woff2 ein Latin-Subset (_site/webfonts-latin/…) für die Rasterübersicht (Kachel = nur Heroletter).
// Zeichen = Latin-Bereich + Heroletter der Schrift; bereits aktuelle Dateien werden übersprungen.
const fs = require("fs");
const path = require("path");
const subsetFont = require("subset-font");
const fonts = require("../src/_data/fonts");

const SRC = "src/webfonts";
const OUT = "_site/webfonts-latin";
// wie Googles „latin“-Subset
const RANGES = [[0x20, 0x7e], [0xa0, 0xff], [0x131, 0x131], [0x152, 0x153], [0x2c6, 0x2c6], [0x2da, 0x2da], [0x2dc, 0x2dc],
  [0x2013, 0x2014], [0x2018, 0x201a], [0x201c, 0x201e], [0x2022, 0x2022], [0x2026, 0x2026], [0x20ac, 0x20ac], [0x2212, 0x2212]];
const latin = RANGES.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => String.fromCodePoint(a + i))).join("");

(async () => {
  let done = 0, skipped = 0;
  for (const n of fonts().list.filter((x) => x.isLeaf)) {
    const text = latin + (n.heroletter || "Aa");
    for (const file of new Set(n.ownFonts.map((f) => f.filePath).filter((f) => f.endsWith(".woff2")))) {
      const src = path.join(SRC, file), out = path.join(OUT, file);
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) { skipped++; continue; }
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, await subsetFont(fs.readFileSync(src), text, { targetFormat: "woff2" }));
      done++;
    }
  }
  console.log(`subset-fonts: ${done} erzeugt, ${skipped} aktuell`);
})();

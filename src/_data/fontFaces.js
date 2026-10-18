// @font-face-Blöcke für alle Schriftdateien: src/fonts.css.njk → /fonts.css
const fonts = require("./fonts");

const encodePath = (p) => p.split("/").map(encodeURIComponent).join("/");

module.exports = function () {
  const blocks = [];

  for (const n of fonts().list.filter((x) => x.isLeaf)) {
    const family = `f-${n.url.split("/").pop()}`;
    blocks.push(`.${family} { font-family: ${family}; }`); // Klasse zum Setzen der Schrift (statt Inline-Style)
    blocks.push(`.${family}-s { font-family: ${family}-s; }`); // Latin-Subset für die Kacheln (scripts/subset-fonts.js)

    // Variable Fonts liefern pro Gewicht einen virtuellen Eintrag mit derselben Datei:
    // je Datei und Stil ein Block mit Gewichtsbereich min–max.
    const faces = new Map();
    for (const f of n.ownFonts) {
      const key = `${f.filePath}|${f.style}`;
      const face = faces.get(key) ?? { file: f.filePath, style: f.style, min: f.weight, max: f.weight };
      face.min = Math.min(face.min, f.weight);
      face.max = Math.max(face.max, f.weight);
      faces.set(key, face);
    }

    for (const { file, style, min, max } of faces.values()) {
      const format = file.endsWith(".woff") ? "woff" : "woff2";
      // .woff gibt es nicht als Subset: die Kachel nimmt dann die volle Datei
      for (const [fam, dir, fmt] of [[family, "webfonts", format], [`${family}-s`, format === "woff2" ? "webfonts-latin" : "webfonts", format]]) {
        blocks.push(
          `@font-face {\n` +
            `  font-family: ${fam};\n` +
            `  src: url("${dir}/${encodePath(file)}") format("${fmt}");\n` +
            `  font-weight: ${min} ${max};\n` +
            `  font-style: ${style};\n` +
            `  font-display: swap;\n` +
            `}`
        );
      }
    }
  }

  return blocks.join("\n\n") + "\n";
};

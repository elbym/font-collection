// @font-face-Blöcke für alle Schriftdateien: src/fonts.css.njk → /fonts.css
const fonts = require("./fonts");

const encodePath = (p) => p.split("/").map(encodeURIComponent).join("/");

module.exports = function () {
  const blocks = [];

  for (const n of fonts().list.filter((x) => x.isLeaf)) {
    const family = `f-${n.url.split("/").pop()}`;
    blocks.push(`.${family} { font-family: ${family}; }`); // Klasse zum Setzen der Schrift (statt Inline-Style)

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
      blocks.push(
        `@font-face {\n` +
          `  font-family: ${family};\n` +
          `  src: url("webfonts/${encodePath(file)}") format("${format}");\n` +
          `  font-weight: ${min} ${max};\n` +
          `  font-style: ${style};\n` +
          `  font-display: swap;\n` +
          `}`
      );
    }
  }

  return blocks.join("\n\n") + "\n";
};

const fs = require("fs");
const path = require("path");

const WEBFONTS = path.join(__dirname, "../webfonts");

// Variable Achsen pro Schrift (Schlüssel = node.key) für die Slider auf Detailkarte 1; aus der Vorlage font-collection übernommen
module.exports = async function () {
  const fontkit = await import("fontkit");
  const fonts = require("./fonts")();
  const result = {};

  for (const node of fonts.list) {
    if (!node.isLeaf) continue;
    const varFonts = node.ownFonts.filter((f) => f.isVariable);
    if (!varFonts.length) continue;
    const file = varFonts.find((f) => f.weight === 400 && f.style === "normal") || varFonts.find((f) => f.style === "normal") || varFonts[0];
    const abs = path.join(WEBFONTS, file.filePath);
    if (!fs.existsSync(abs)) continue;
    try {
      const raw = fontkit.openSync(abs).variationAxes;
      if (!raw || !Object.keys(raw).length) continue;
      const axes = {};
      for (const [tag, a] of Object.entries(raw)) {
        const range = a.max - a.min;
        axes[tag] = {
          name: a.name || tag,
          min: a.min,
          max: a.max,
          // opsz am Display-Ende starten (Textgröße wirkt bei großer Vorschau falsch)
          default: tag === "opsz" ? a.max : a.default,
          step: range > 0 && range <= 2 ? 0.01 : 1,
        };
      }
      result[node.key] = axes;
    } catch {
      // unlesbare Datei: keine Slider
    }
  }
  return result;
};

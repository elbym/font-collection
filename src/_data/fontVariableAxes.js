const fs = require("fs");
const path = require("path");

const WEBFONTS = path.join(__dirname, "../webfonts");

module.exports = async function () {
  // fontkit v2 is ESM-only; dynamic import works in CJS
  const fontkit = await import("fontkit");
  const fonts = require("./fonts")();

  const result = {};

  for (const node of fonts.list) {
    if (!node.isLeaf || !node.ownFonts.length) continue;

    // Only process nodes that have at least one variable font
    const varFonts = node.ownFonts.filter((f) => f.isVariable);
    if (!varFonts.length) continue;

    // De-duplicate by physical filename; prefer regular upright file
    const seen = new Set();
    const uniqueVar = varFonts.filter((f) => {
      if (seen.has(f.fileName)) return false;
      seen.add(f.fileName);
      return true;
    });

    const fontFile =
      uniqueVar.find((f) => f.weight === 400 && f.style === "normal") ||
      uniqueVar.find((f) => f.style === "normal") ||
      uniqueVar[0];

    const absPath = path.join(WEBFONTS, fontFile.filePath);
    if (!fs.existsSync(absPath)) continue;

    try {
      const font = fontkit.openSync(absPath);
      const raw = font.variationAxes;
      if (!raw || !Object.keys(raw).length) continue;

      // Build { axisTag: { name, min, max, default, step } }
      const axes = {};
      for (const [tag, info] of Object.entries(raw)) {
        const range = info.max - info.min;
        // Pick a sensible step: 1 for integer ranges, 0.1 for small float ranges
        const step = range > 0 && range <= 2 ? 0.01 : 1;
        axes[tag] = {
          name: info.name || tag.toUpperCase(),
          min: info.min,
          max: info.max,
          default: info.default,
          step,
        };
      }

      result[node.key] = axes;
    } catch (_) {
      // Skip unreadable files silently
    }
  }

  return result;
};

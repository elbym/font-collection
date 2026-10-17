const fs = require("fs");
const path = require("path");

const WEBFONTS = path.join(__dirname, "../webfonts");

module.exports = async function () {
  // fontkit v2 is ESM-only with named exports (no default); dynamic import works in CJS
  const fontkit = await import("fontkit");
  const fonts = require("./fonts")();

  const result = {};

  for (const node of fonts.list) {
    if (!node.isLeaf || !node.ownFonts.length) continue;

    // De-duplicate virtual variable-font entries by physical filename
    const seen = new Set();
    const uniqueFiles = node.ownFonts.filter((f) => {
      if (seen.has(f.fileName)) return false;
      seen.add(f.fileName);
      return true;
    });

    // Prefer Regular upright; fall back to any upright; then any file
    const fontFile =
      uniqueFiles.find((f) => f.weight === 400 && f.style === "normal") ||
      uniqueFiles.find((f) => f.style === "normal") ||
      uniqueFiles[0];

    const absPath = path.join(WEBFONTS, fontFile.filePath);
    if (!fs.existsSync(absPath)) continue;

    try {
      const font = fontkit.openSync(absPath);
      // Build a plain object {codepoint: 1} for easy Nunjucks lookup
      const cpMap = {};
      for (const cp of font.characterSet) cpMap[cp] = 1;
      result[node.key] = cpMap;
    } catch (_) {
      // Skip unreadable files; template treats missing entry as "all present"
    }
  }

  return result;
};

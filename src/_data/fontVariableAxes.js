const fs = require("fs");
const path = require("path");

const WEBFONTS = path.join(__dirname, "../webfonts");

// Generates evenly spaced waterfall steps for an axis, each with a ready-to-use CSS style string.
function buildSteps(tag, min, max, allAxes) {
  // ital is binary (0/1) — show only the two extremes
  if (tag === "ital") {
    return [
      { value: 0, style: "font-style: normal",  label: "Normal" },
      { value: 1, style: "font-style: italic", label: "Italic" },
    ];
  }

  // WONK is a 0/1 toggle — only the extremes are meaningful.
  // Fraunces swaps the wonky h/m/n/s via GSUB feature variations (rvrn), and one of its
  // condition sets kills them below ~opsz 22 regardless of WONK. Pin opsz to max, else
  // the toggle renders identically at normal text sizes.
  if (tag === "WONK") {
    const opsz = allAxes && allAxes.opsz ? `'opsz' ${allAxes.opsz.max}, ` : "";
    return [
      { value: 0, style: `font-variation-settings: ${opsz}'WONK' 0`, label: "Aus" },
      { value: 1, style: `font-variation-settings: ${opsz}'WONK' 1`, label: "An" },
    ];
  }

  const count = tag === "wght" ? 9 : 7;
  const interval = (max - min) / (count - 1);
  const raw = [];

  for (let i = 0; i < count; i++) {
    let val = min + i * interval;

    // Round wght to nearest 100 for clean display
    if (tag === "wght") {
      val = Math.round(val / 100) * 100;
    } else {
      val = Math.round(val * 10) / 10;
    }
    val = Math.max(min, Math.min(max, val));

    let style;
    if (tag === "wght") {
      style = `font-weight: ${val}`;
    } else if (tag === "wdth") {
      style = `font-stretch: ${val}%`;
    } else if (tag === "slnt") {
      style = `font-style: oblique ${Math.abs(val)}deg`;
    } else {
      style = `font-variation-settings: '${tag}' ${val}`;
    }

    raw.push({ value: val, style, label: String(val) });
  }

  // Remove duplicates that can arise after rounding
  return raw.filter((s, i, arr) => arr.findIndex((x) => x.value === s.value) === i);
}

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

      const axes = {};
      for (const [tag, info] of Object.entries(raw)) {
        const range = info.max - info.min;
        const step = range > 0 && range <= 2 ? 0.01 : 1;
        axes[tag] = {
          name: info.name || tag.toUpperCase(),
          min: info.min,
          max: info.max,
          // opsz defaults to the text-size end of the range (9 in Fraunces), which looks
          // wrong on a large specimen preview and suppresses WONK. Start at the display end.
          default: tag === "opsz" ? info.max : info.default,
          step,
          steps: buildSteps(tag, info.min, info.max, raw),
        };
      }

      result[node.key] = axes;
    } catch (_) {
      // Skip unreadable files silently
    }
  }

  return result;
};

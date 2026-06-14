const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
// Lookup Tabelle mit allen HTML Farben
const CSS_COLOR_HEX = {
  aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff",
  aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc",
  bisque: "#ffe4c4", black: "#000000", blanchedalmond: "#ffebcd",
  blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a",
  burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00",
  chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#00ffff",
  darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f",
  darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000",
  darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1",
  darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff",
  dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1e90ff",
  firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22",
  fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff",
  gold: "#ffd700", goldenrod: "#daa520", gray: "#808080",
  green: "#008000", greenyellow: "#adff2f", grey: "#808080",
  honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c",
  indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c",
  lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080",
  lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3",
  lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa",
  lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32",
  linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000",
  mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3",
  mediumpurple: "#9370db", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585",
  midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080",
  oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23",
  orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6",
  palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee",
  palevioletred: "#db7093", papayawhip: "#ffefd5", peachpuff: "#ffdab9",
  peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd",
  powderblue: "#b0e0e6", purple: "#800080", red: "#ff0000",
  rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513",
  salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57",
  seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0",
  skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090",
  slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f",
  steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080",
  thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0",
  violet: "#ee82ee", wheat: "#f5deb3", white: "#ffffff",
  whitesmoke: "#f5f5f5", yellow: "#ffff00", yellowgreen: "#9acd32",
};

function resolveColorHex(color) {
  if (!color) return null;
  if (/^#[0-9a-f]{3,8}$/i.test(color)) return color;
  return CSS_COLOR_HEX[color.toLowerCase()] ?? null;
}

let _cache = null;

module.exports = function () {
  if (_cache) return _cache;
  const baseDir = path.join(__dirname, "../webfonts");
  if (!fs.existsSync(baseDir)) return {};

  const variableWeights = [
    { weight: 100, label: "Thin" },
    { weight: 200, label: "ExtraLight" },
    { weight: 300, label: "Light" },
    { weight: 400, label: "Regular" },
    { weight: 500, label: "Medium" },
    { weight: 600, label: "SemiBold" },
    { weight: 700, label: "Bold" },
    { weight: 800, label: "ExtraBold" },
    { weight: 900, label: "Black" },
  ];

  const weightMap = {
    extralight: 200,
    ultralight: 200,
    extrabold: 800,
    semibold: 600,
    medium: 500,
    heavy: 900,
    black: 900,
    light: 300,
    hair: 100,
    thin: 100,
    bold: 700,
    regular: 400,
  };

  const opticalMap = {
    caption: 1,
    subhead: 2,
    display: 3,
    condensed: 4,
    mono: 5,
    text: 6,
    headline: 7,
    initials: 8,
    math: 9,
    script: 10,
    monospace: 11,
    regular: 4,
  };

  const sanitizeFamily = (name) => {
    let cleanName = name;
    Object.keys(opticalMap)
      .filter((k) => k !== "regular")
      .forEach((key) => {
        const regex = new RegExp(`[-_\\s]?${key}$`, "i");
        cleanName = cleanName.replace(regex, "");
      });
    return cleanName.trim();
  };

  const VARIABLE_AXES = ["wght", "wdth", "ital", "slnt", "opsz"];

  function detectVariableFont(lowerName) {
    return (
      lowerName.includes("variable") ||
      VARIABLE_AXES.some((axis) => new RegExp(`\\[[^\\]]*${axis}`).test(lowerName)) ||
      /[-_]vf$/.test(lowerName)
    );
  }

  function extractAxes(lowerName) {
    // Format 1: Filename[wght,opsz,wdth]
    const bracketMatch = lowerName.match(/\[([^\]]+)\]/);
    if (bracketMatch) {
      return bracketMatch[1].split(",").map((a) => a.trim().toLowerCase()).filter((a) => VARIABLE_AXES.includes(a));
    }
    // Format 2: _opsz,wght or _variablefont_opsz,wght
    const underscoreMatch = lowerName.match(/[_-](?:variablefont[_-])?([a-z]{4}(?:,[a-z]{4})+)/);
    if (underscoreMatch) {
      const candidates = underscoreMatch[1].split(",").map((a) => a.trim().toLowerCase()).filter((a) => VARIABLE_AXES.includes(a));
      if (candidates.length > 0) return candidates;
    }
    // Fallback: wght is always present in variable fonts
    return ["wght"];
  }

  /**
   * Liest meta.yaml (oder meta.yml) aus einem Ordner.
   * Unterstützte Felder:
   *   title      – Anzeigename (überschreibt sanitizeFamily)
   *   url        – Projektlink (z. B. GitHub)
   *   tags       – Kommagetrennte Schlagworte als String oder Array
   *   fontauthor – Name des Gestalters
   *   fontyear   – Entstehungsjahr (historisch oder Digitalisierung)
   *   heroletter – Einzelzeichen für große Vorschau
   *   heroword   – Wort/Phrase für Hero-Bereich
   *   herostyle  – CSS font-weight-Keyword für den Hero (z. B. "bold")
   *   color      – CSS-Farbwert oder -name für Akzentfarbe
   */
  function detectLicense(dirPath, meta) {
    if (meta.license) return meta.license;
    const oflFiles = ["OFL.txt", "OFL-1.1.txt", "OFL11.txt", "OFL-1.1-no-RFN.txt", "OFL-1.1-RFN.txt"];
    if (oflFiles.some((f) => fs.existsSync(path.join(dirPath, f)))) return "SIL Open Font License 1.1";
    const licenseFiles = ["license.txt", "LICENSE.txt", "LICENSE", "license"];
    for (const f of licenseFiles) {
      const lPath = path.join(dirPath, f);
      if (fs.existsSync(lPath)) {
        try {
          const c = fs.readFileSync(lPath, "utf-8").slice(0, 600);
          if (/Open Font License/i.test(c)) return "SIL Open Font License 1.1";
          if (/MIT License/i.test(c)) return "MIT";
          if (/Apache License/i.test(c)) return "Apache 2.0";
        } catch (_) {}
      }
    }
    return null;
  }

  function readMeta(dirPath) {
    const candidates = ["meta.yaml", "meta.yml"];
    for (const filename of candidates) {
      const metaPath = path.join(dirPath, filename);
      if (fs.existsSync(metaPath)) {
        try {
          const raw = yaml.load(fs.readFileSync(metaPath, "utf-8")) || {};
          // tags: String "Didone, Elegant" → Array ["Didone", "Elegant"]
          if (typeof raw.tags === "string") {
            raw.tags = raw.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
          }
          return raw;
        } catch (e) {
          console.warn(`[fonts.js] Fehler beim Parsen von ${metaPath}:`, e.message);
        }
      }
    }
    return {};
  }

  function parseFontFiles(folderName, folderPath, relativePath, meta = {}) {
    const files = fs.readdirSync(folderPath);
    const fontFiles = files.filter((file) => /\.(woff2|woff)$/i.test(file));
    const familyName = meta.title ?? sanitizeFamily(folderName);

    // Keys already present in the folder name are part of the font's identity,
    // not optical variant discriminators (e.g. "Headline" in "Mozilla Headline").
    const folderLower = folderName.toLowerCase();
    const opticalKeysInFolder = new Set(
      Object.keys(opticalMap)
        .filter((k) => k !== "regular" && folderLower.includes(k))
    );

    const hasVariableItalic = fontFiles.some((f) => {
      const l = path.parse(f).name.toLowerCase();
      return l.includes("italic") && detectVariableFont(l);
    });

    const findOptical = (lowerName) => {
      const key = Object.keys(opticalMap)
        .filter((k) => k !== "regular" && !opticalKeysInFolder.has(k))
        .find((k) => lowerName.includes(k));
      if (!key) return { optical: null, opticalOrder: 3 };
      return {
        optical: key.charAt(0).toUpperCase() + key.slice(1),
        opticalOrder: opticalMap[key],
      };
    };

    return fontFiles
      .flatMap((file) => {
        const nameStr = path.parse(file).name;
        const lowerName = nameStr.toLowerCase();

        if (detectVariableFont(lowerName)) {
          const style = lowerName.includes("italic") ? "italic" : "normal";
          const hasItalAxis = /\[[^\]]*(?:ital|slnt)/.test(lowerName);
          let stylesToGenerate = ["normal"];
          if (style === "italic") {
            stylesToGenerate = ["italic"];
          } else if (!hasVariableItalic && hasItalAxis) {
            stylesToGenerate = ["normal", "italic"];
          }

          const { optical, opticalOrder } = findOptical(lowerName);
          const axes = extractAxes(lowerName);

          return variableWeights.flatMap(({ weight, label }) =>
            stylesToGenerate.map((s) => ({
              fileName: file,
              filePath: `${relativePath}/${file}`,
              displayName: `${label}${s === "italic" ? " Italic" : ""}`,
              family: familyName,
              optical,
              opticalOrder: optical ? opticalOrder : 4,
              weight,
              style: s,
              isVariable: true,
              axes,
              variantGroup: optical ?? (s === "normal" ? "Regular" : "Italic"),
            }))
          );
        }

        let weight = 400;
        const numericWeight = lowerName.match(/(?:^|[-_])(\d{3})(?:[-_]|$)/);
        if (numericWeight) {
          const w = parseInt(numericWeight[1], 10);
          if (w >= 100 && w <= 900 && w % 100 === 0) weight = w;
        } else {
          const foundWeightKey = Object.keys(weightMap).find((key) =>
            lowerName.includes(key)
          );
          if (foundWeightKey) weight = weightMap[foundWeightKey];
        }

        const { optical, opticalOrder } = findOptical(lowerName);

        const style = lowerName.includes("italic") ? "italic" : "normal";

        const variantLabel =
          variableWeights.find((w) => w.weight === weight)?.label ?? "Regular";

        return [
          {
            fileName: file,
            filePath: `${relativePath}/${file}`,
            displayName: `${variantLabel}${style === "italic" ? " Italic" : ""}`,
            family: familyName,
            optical,
            opticalOrder,
            weight,
            style,
            isVariable: false,
            variantGroup: optical ?? (style === "normal" ? "Regular" : "Italic"),
          },
        ];
      })
      .sort((a, b) => {
        // Group: upright (0), italic (1), optical variants (2+)
        const groupOf = (f) => {
          if (f.optical === null) return f.style === "normal" ? 0 : 1;
          return 2 + f.opticalOrder;
        };
        const ga = groupOf(a);
        const gb = groupOf(b);
        if (ga !== gb) return ga - gb;
        if (a.weight !== b.weight) return a.weight - b.weight;
        if (a.style !== b.style) return a.style === "normal" ? -1 : 1;
        return 0;
      });
  }

  function readDirRecursive(dirPath, relativePath = "") {
    const entries = fs.readdirSync(dirPath);
    const subDirs = entries.filter((e) =>
      fs.statSync(path.join(dirPath, e)).isDirectory()
    );
    const fontFiles = entries.filter((e) => /\.(woff2|woff)$/i.test(e));
    const folderName = path.basename(dirPath);

    // meta.yaml einlesen
    const meta = readMeta(dirPath);

    const node = {
      _path: relativePath,
      _fonts: fontFiles.length
        ? parseFontFiles(folderName, dirPath, relativePath, meta)
        : [],
      _isLeaf: fontFiles.length > 0,

      // Meta-Felder direkt am Node verfügbar
      _meta: meta,
      _title: meta.title ?? sanitizeFamily(folderName),
      _url: meta.url ?? null,
      _tags: meta.tags ?? [],
      _fontauthor: meta.fontauthor ?? null,
      _fontyear: meta.fontyear ?? null,
      _heroletter: meta.heroletter ?? null,
      _heroword: meta.heroword ?? null,
      _herostyle: meta.herostyle ?? "regular",
      _color: meta.color ?? null,
      _border: meta.border ?? null,
      _comment: meta.comment ?? null,
      _content: meta.content ?? null,
      _imageOverrides: meta.imageOverrides ?? null,
      _wikipedia: meta.wikipedia ?? null,
      _license: detectLicense(dirPath, meta),
    };

    subDirs.forEach((sub) => {
      node[sub] = readDirRecursive(
        path.join(dirPath, sub),
        relativePath ? `${relativePath}/${sub}` : sub
      );
    });

    function collectAllFonts(n) {
      return [
        ...n._fonts,
        ...Object.keys(n)
          .filter((k) => !k.startsWith("_"))
          .flatMap((k) => collectAllFonts(n[k])),
      ];
    }
    node._allFonts = collectAllFonts(node);

    return node;
  }

  const slugify = (s) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  function flattenNodes(node, name = "") {
    const result = [];

    if (node._allFonts.length > 0 && name !== "") {
      const categoryTag = (node._tags && node._tags.length > 0) ? node._tags[0] : null;
      if (node._isLeaf && !categoryTag) {
        console.warn(`[fonts.js] Warnung: Keine Tags für "${node._title || name}" — category ist null`);
      }

      // Collect unique variable axes across all variable fonts in this folder
      const varAxes = [...new Set(
        node._fonts
          .filter((f) => f.isVariable && f.axes)
          .flatMap((f) => f.axes)
      )];

      result.push({
        key: name,
        path: node._path,
        isLeaf: node._isLeaf,
        ownFonts: node._fonts,
        url: node._isLeaf && categoryTag
          ? `${slugify(categoryTag)}/${slugify(name)}`
          : node._path.split("/").map(slugify).join("/"),
        parentPath: null,

        // Meta-Felder direkt im flachen Node
        title:      node._title,
        sourceUrl:  node._url,
        tags:       node._tags,
        category:   categoryTag,
        fontauthor: node._fontauthor,
        fontyear:   node._fontyear,
        heroletter: node._heroletter,
        heroword:   node._heroword,
        herostyle:  node._herostyle,
        color:      node._color,
        colorHex:   resolveColorHex(node._color),
        border:     node._border,
        comment:    node._comment,
        content:    node._content,
        imageOverrides: node._imageOverrides,
        wikipedia:  node._wikipedia,
        license:    node._license,
        varAxes,
      });
    }

    Object.keys(node)
      .filter((k) => !k.startsWith("_"))
      .forEach((sub) =>
        flattenNodes(node[sub], sub).forEach((n) => result.push(n))
      );

    return result;
  }

  const tree = readDirRecursive(baseDir);
  let fontFoldersList = flattenNodes(tree);

  // Virtuelle Tag-Gruppen-Nodes aus tags[0] erzeugen, Ordner-Gruppen ersetzen
  const tagGroupMap = new Map();
  fontFoldersList.filter((n) => n.isLeaf && n.category).forEach((n) => {
    const tagSlug = slugify(n.category);
    if (!tagGroupMap.has(tagSlug)) {
      tagGroupMap.set(tagSlug, {
        key: n.category,
        path: tagSlug,
        isLeaf: false,
        ownFonts: [],
        url: tagSlug,
        parentPath: null,
        title: n.category,
        sourceUrl: null,
        tags: [],
        category: null,
        fontauthor: null,
        fontyear: null,
        heroletter: null,
        heroword: null,
        herostyle: "regular",
        color: null,
        colorHex: null,
        border: null,
        comment: null,
        content: null,
        imageOverrides: null,
        wikipedia: null,
      });
    }
  });

  // parentPath der Blatt-Nodes auf den Tag-Gruppen-Pfad umbiegen
  fontFoldersList.forEach((n) => {
    if (n.isLeaf && n.category) {
      n.parentPath = slugify(n.category);
    }
  });

  // Liste: Tag-Gruppen (alphabetisch) + Blatt-Nodes
  const tagGroups = [...tagGroupMap.values()].sort((a, b) => a.title.localeCompare(b.title));
  fontFoldersList = [...tagGroups, ...fontFoldersList.filter((n) => n.isLeaf)];

  const fontsByPath = {};
  fontFoldersList.forEach((n) => {
    fontsByPath[n.path] = n.ownFonts;
  });

  Object.defineProperty(fontsByPath, "list", {
    value: fontFoldersList,
    enumerable: false,
  });

  _cache = fontsByPath;
  return _cache;
};

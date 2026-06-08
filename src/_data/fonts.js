const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

module.exports = function () {
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

  function detectVariableFont(lowerName) {
    return (
      lowerName.includes("variable") ||
      /\[.*wght.*\]/.test(lowerName) ||
      /[-_]vf$/.test(lowerName)
    );
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

  function parseFontFiles(folderName, folderPath, relativePath) {
    const files = fs.readdirSync(folderPath);
    const fontFiles = files.filter((file) => /\.(woff2|woff)$/i.test(file));

    const hasVariableItalic = fontFiles.some((f) => {
      const l = path.parse(f).name.toLowerCase();
      return l.includes("italic") && detectVariableFont(l);
    });

    return fontFiles
      .flatMap((file) => {
        const nameStr = path.parse(file).name;
        const lowerName = nameStr.toLowerCase();

        if (detectVariableFont(lowerName)) {
          const style = lowerName.includes("italic") ? "italic" : "normal";
          let stylesToGenerate = ["normal"];
          if (style === "italic") {
            stylesToGenerate = ["italic"];
          } else if (!hasVariableItalic) {
            stylesToGenerate = ["normal", "italic"];
          }

          let optical = null;
          let opticalOrder = 4;
          const specialOpticalKey = Object.keys(opticalMap)
            .filter((key) => key !== "regular")
            .find((key) => lowerName.includes(key));
          if (specialOpticalKey) {
            optical =
              specialOpticalKey.charAt(0).toUpperCase() +
              specialOpticalKey.slice(1);
            opticalOrder = opticalMap[specialOpticalKey];
          }

          return variableWeights.flatMap(({ weight, label }) =>
            stylesToGenerate.map((s) => ({
              fileName: file,
              filePath: `${relativePath}/${file}`,
              displayName: `${label}${s === "italic" ? " Italic" : ""}`,
              family: sanitizeFamily(folderName),
              optical,
              opticalOrder,
              weight,
              style: s,
              isVariable: true,
              variantGroup: optical ?? (s === "normal" ? "Regular" : "Italic"),
            }))
          );
        }

        let weight = 400;
        const foundWeightKey = Object.keys(weightMap).find((key) =>
          lowerName.includes(key)
        );
        if (foundWeightKey) weight = weightMap[foundWeightKey];

        let optical = null;
        let opticalOrder = 3;
        const specialOpticalKey = Object.keys(opticalMap)
          .filter((key) => key !== "regular")
          .find((key) => lowerName.includes(key));
        if (specialOpticalKey) {
          optical =
            specialOpticalKey.charAt(0).toUpperCase() +
            specialOpticalKey.slice(1);
          opticalOrder = opticalMap[specialOpticalKey];
        } else if (lowerName.includes("regular")) {
          opticalOrder = 3;
        }

        const style = lowerName.includes("italic") ? "italic" : "normal";

        const variantLabel =
          variableWeights.find((w) => w.weight === weight)?.label ?? "Regular";

        return [
          {
            fileName: file,
            filePath: `${relativePath}/${file}`,
            displayName: `${variantLabel}${style === "italic" ? " Italic" : ""}`,
            family: sanitizeFamily(folderName),
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
        ? parseFontFiles(folderName, dirPath, relativePath)
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
      _content: meta.content ?? null,
      _imageOverrides: meta.imageOverrides ?? null,
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

  function flattenNodes(node, name = "") {
    const result = [];

    if (node._allFonts.length > 0 && name !== "") {
      result.push({
        key: name,
        path: node._path,
        isLeaf: node._isLeaf,
        allFonts: node._allFonts,
        ownFonts: node._fonts,
        url: node._path
          .split("/")
          .map((s) =>
            s
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
          )
          .join("/"),
        parentPath: node._path.includes("/")
          ? node._path.split("/").slice(0, -1).join("/")
          : null,

        // Meta-Felder direkt im flachen Node
        title:      node._title,
        sourceUrl:  node._url,
        tags:       node._tags,
        fontauthor: node._fontauthor,
        fontyear:   node._fontyear,
        heroletter: node._heroletter,
        heroword:   node._heroword,
        herostyle:  node._herostyle,
        color:      node._color,
        content:    node._content,
        imageOverrides: node._imageOverrides,
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
  const fontFoldersList = flattenNodes(tree);

  const fontsByPath = {};
  fontFoldersList.forEach((n) => {
    fontsByPath[n.path] = n.ownFonts;
  });

  Object.defineProperty(fontsByPath, "getFamily", {
    value: (nameOrNode) => {
      if (typeof nameOrNode === "object" && nameOrNode !== null) {
        return nameOrNode.title ?? sanitizeFamily(nameOrNode.key);
      }
      return sanitizeFamily(nameOrNode);
    },
    enumerable: false,
  });

  Object.defineProperty(fontsByPath, "tree", {
    value: tree,
    enumerable: false,
  });

  Object.defineProperty(fontsByPath, "list", {
    value: fontFoldersList,
    enumerable: false,
  });

  return fontsByPath;
};

const { HtmlBasePlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");

const fonts = require("./src/_data/fonts.js");

const md = markdownIt({ html: false, breaks: true, linkify: true });

const UNICODE_RANGES = {
  // Basic ranges (used in alphabet / hero sections too)
  ascii:      [33, 126],
  abc_upper:  [65, 91],
  abc_lower:  [97, 122],
  digits:     [48, 58],
  punctuation:[33, 48],

  // --- Typographic symbols ---
  ligatures:        [64256, 64263], // U+FB00–U+FB06: ﬀ ﬁ ﬂ ﬃ ﬄ ﬅ ﬆ
  fractions:        [8528,  8544],  // U+2150–U+215F: ⅐ … ⅟
  punctuationTypo:  [8208,  8287],  // U+2010–U+205E: dashes, quotes, bullet, ellipsis …
  superSub:         [8304,  8352],  // U+2070–U+209F: ⁰¹² … ₀₁₂ …
  letterlike:       [8448,  8528],  // U+2100–U+214F: ™ © ® ℃ № ℓ …
  currency:         [8352,  8400],  // U+20A0–U+20CF: € £ ¥ ₿ ₽ ₹ …

  // --- Latin scripts ---
  latin1:           [160,   255],   // U+00A0–U+00FE
  latinExtA:        [256,   384],   // U+0100–U+017F
  latinExtB:        [384,   592],   // U+0180–U+024F
  latinExtAdd:      [7680,  7936],  // U+1E00–U+1EFF: precomposed forms (ẞ ặ ộ …)

  // --- Other scripts ---
  greek:            [880,   1024],  // U+0370–U+03FF: Greek and Coptic

  // --- Symbols & technical ---
  arrows:           [8592,  8704],  // U+2190–U+21FF: ← → ↑ ↓ ⇒ …
  boxDrawing:       [9472,  9600],  // U+2500–U+257F: ─ │ ┌ ┐ └ ┘ …
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // familyName: Ordnernamen oder Node-Objekt → lesbarer Familienname
  eleventyConfig.addFilter("familyName", (folderOrNode) => {
    const name =
      typeof folderOrNode === "object" && folderOrNode !== null
        ? folderOrNode.key
        : folderOrNode;
    return fonts().getFamily(name);
  });

  eleventyConfig.addNunjucksFilter("chr", function (code) {
    return String.fromCharCode(code);
  });

  eleventyConfig.addFilter("getNavDepth", (url) => {
    return url.split("/").filter(Boolean).length;
  });

  eleventyConfig.addFilter("isChildOf", (childUrl, parentUrl) => {
    return childUrl.startsWith(parentUrl) && childUrl !== parentUrl;
  });

  eleventyConfig.addFilter("charCodeAt", (str) => str.codePointAt(0));

  eleventyConfig.addFilter("coveragePercent", (rangeName, cpMap) => {
    if (!cpMap) return null;
    const [start, end] = UNICODE_RANGES[rangeName];
    let covered = 0;
    for (let i = start; i < end; i++) {
      if (cpMap[i]) covered++;
    }
    return Math.round((covered / (end - start)) * 100);
  });

  eleventyConfig.addFilter("unicodeChars", (rangeName) => {
    const [start, end] = UNICODE_RANGES[rangeName];
    const chars = [];
    for (let i = start; i < end; i++) {
      chars.push(String.fromCharCode(i));
    }
    return chars;
  });

  /**
   * Gibt die direkte Eltern-Node aus fontFolders zurück.
   * Nutzung: folderNode | getParentNode(fontFolders)
   */
  eleventyConfig.addFilter("getParentNode", (node, fontFolders) => {
    if (!node.parentPath) return null;
    return fontFolders.find((n) => n.path === node.parentPath) || null;
  });

  /**
   * Gibt alle direkten Kinder einer Node zurück.
   * Nutzung: folderNode | getChildNodes(fontFolders)
   */
  eleventyConfig.addFilter("getChildNodes", (node, fontFolders) => {
    return fontFolders.filter((n) => n.parentPath === node.path);
  });

  /**
   * Gibt alle Vorfahren (Breadcrumb-Pfad) einer Node zurück, von Root bis Parent.
   * Nutzung: folderNode | getAncestors(fontFolders)
   */
  eleventyConfig.addFilter("getAncestors", (node, fontFolders) => {
    const ancestors = [];
    let current = node;
    while (current.parentPath) {
      const parent = fontFolders.find((n) => n.path === current.parentPath);
      if (!parent) break;
      ancestors.unshift(parent);
      current = parent;
    }
    return ancestors;
  });

  /**
   * Gibt nur die Top-Level-Nodes zurück (ohne Parent).
   * Nutzung: fontFolders | getRootNodes
   */
  eleventyConfig.addFilter("getRootNodes", (fontFolders) => {
    return fontFolders.filter((n) => !n.parentPath);
  });

  /**
   * Gibt alle Nachkommen einer Node zurück (rekursiv, alle Ebenen).
   * Nutzung: folderNode | getDescendants(fontFolders)
   */
  eleventyConfig.addFilter("getDescendants", (node, fontFolders) => {
    const result = [];
    function collect(path) {
      const children = fontFolders.filter((n) => n.parentPath === path);
      children.forEach((child) => {
        result.push(child);
        collect(child.path);
      });
    }
    collect(node.path);
    return result;
  });

  /**
   * Prüft ob nodeA ein Vorfahre von nodeB ist.
   * Nutzung: nodeA | isAncestorOf(nodeB)
   */
  eleventyConfig.addFilter("isAncestorOf", (ancestor, node) => {
    return node.path.startsWith(ancestor.path + "/");
  });

  eleventyConfig.addGlobalData("permalink", () => {
    return (data) => `${data.page.filePathStem}.html`;
  });

  eleventyConfig.addFilter("find", (arr, key, value) =>
    arr.find((item) => {
      const val = key.split(".").reduce((o, k) => o?.[k], item);
      return val === value;
    })
  );

  /**
   * Rendert einen Markdown-String zu HTML.
   * Nutzung: folder.content | markdownify | safe
   */
  eleventyConfig.addFilter("markdownify", (str) => {
    if (!str) return "";
    return md.render(String(str));
  });

  /**
   * Gibt alle manuellen Navigationsseiten zurück,
   * die eleventyNavigation im Frontmatter gesetzt haben.
   * Sortiert nach eleventyNavigation.order (aufsteigend).
   * Nutzung: collections.all | getManualNav
   */
  eleventyConfig.addFilter("getManualNav", (collection) => {
    return collection
      .filter((p) => p.data.eleventyNavigation)
      .sort(
        (a, b) =>
          (a.data.eleventyNavigation.order ?? 99) -
          (b.data.eleventyNavigation.order ?? 99)
      )
      .map((p) => ({
        url:   p.url,
        title: p.data.eleventyNavigation.title ?? p.data.title,
      }));
  });

  eleventyConfig.addPlugin(HtmlBasePlugin);

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
  };
};

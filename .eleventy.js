const { HtmlBasePlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const chroma = require("chroma-js");

const md = markdownIt({ html: false, breaks: true, linkify: true });

// Build the filter lookup from the shared data file.
// Non-display ranges (alphabet / hero sections) are added here only.
const UNICODE_RANGES = Object.fromEntries(
  require("./src/_data/unicodeRanges.js").map(({ key, range }) => [key, range])
);
UNICODE_RANGES.abc_upper   = [65, 91];
UNICODE_RANGES.abc_lower   = [97, 122];
UNICODE_RANGES.digits      = [48, 58];
UNICODE_RANGES.punctuation = [33, 48];

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addNunjucksFilter("chr", function (code) {
    return String.fromCharCode(code);
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
   * Prüft ob nodeA ein Vorfahre von nodeB ist.
   * Nutzung: nodeA | isAncestorOf(nodeB)
   */
  eleventyConfig.addFilter("isAncestorOf", (ancestor, node) => {
    return node.parentPath === ancestor.path;
  });

  eleventyConfig.addGlobalData("permalink", () => {
    return (data) => `${data.page.filePathStem}.html`;
  });

  eleventyConfig.addFilter("hueShift", (cssColor, degrees = 60) => {
    try {
      let [h, s, l] = chroma(cssColor).hsl();
      if (isNaN(h)) h = 0;
      return chroma.hsl((h + degrees) % 360, s, l).hex();
    } catch (_) {
      return cssColor;
    }
  });

  eleventyConfig.addFilter("markdownify", (str) => {
    if (!str) return "";
    return md.render(String(str));
  });

  eleventyConfig.addFilter("jsonEscape", (str) =>
    String(str ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
  );

  eleventyConfig.addFilter("toDomain", (url) => {
    try { return new URL(url).hostname; }
    catch { return url; }
  });

  eleventyConfig.addFilter("findPrevNext", function(key, list) {
    const idx = list.findIndex(n => n.key === key);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? list[idx - 1] : null,
      next: idx < list.length - 1 ? list[idx + 1] : null,
    };
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

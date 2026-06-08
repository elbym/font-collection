const { HtmlBasePlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");

const fonts = require("./src/_data/fonts.js");

const md = markdownIt({ html: false, breaks: true, linkify: true });

const UNICODE_RANGES = {
  ascii: [33, 126],
  abc_upper: [65, 91],
  abc_lower: [97, 122],
  digits: [48, 58],
  punctuation: [33, 48],
  fractions: [8528, 8591],
  ligatures: [64256, 64335],
  latin1: [160, 255],
  latinExtA: [256, 383],
  latinExtB: [384, 591],
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

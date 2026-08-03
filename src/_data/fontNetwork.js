const fonts = require("./fonts.js");

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = function () {
  const nodes = [];
  const links = [];
  const tagIds = new Set();
  const authorIds = new Set();

  fonts()
    .list.filter((n) => n.isLeaf)
    .forEach((font) => {
      const fontId = `font:${font.key}`;
      nodes.push({ id: fontId, name: font.title, group: "font", url: font.url, category: font.category });

      (font.tags || []).forEach((tag) => {
        const tagId = `tag:${slugify(tag)}`;
        if (!tagIds.has(tagId)) {
          tagIds.add(tagId);
          nodes.push({ id: tagId, name: tag, group: "tag" });
        }
        links.push({ source: fontId, target: tagId });
      });

      (font.fontauthor || "").split(",").forEach((rawName) => {
        const name = rawName.trim();
        if (!name) return;
        const authorId = `author:${slugify(name)}`;
        if (!authorIds.has(authorId)) {
          authorIds.add(authorId);
          nodes.push({ id: authorId, name, group: "author" });
        }
        links.push({ source: fontId, target: authorId });
      });
    });

  return { nodes, links };
};

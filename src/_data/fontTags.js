const fonts = require("./fonts.js");

module.exports = function () {
  const tagSet = new Set();
  fonts()
    .list.filter((n) => n.isLeaf)
    .forEach((n) => (n.tags || []).forEach((t) => tagSet.add(t)));
  return [...tagSet].sort();
};

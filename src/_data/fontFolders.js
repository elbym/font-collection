// src/_data/fontFolders.js
// Exportiert die flache, geordnete Liste aller Font-Knoten (Blätter + Gruppen)
// für die Pagination in specimen.njk.

const fonts = require("./fonts.js");

module.exports = function () {
  return fonts().list;
};

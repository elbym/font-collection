// src/_data/fontLeaves.js
// Nur Blatt-Nodes aus fontFolders – Ordner die direkt Font-Dateien enthalten.
// Wird von _generated-fonts.njk für die SCSS-Generierung genutzt.

const fonts = require("./fonts.js");

module.exports = function () {
  return fonts().list.filter((n) => n.isLeaf);
};

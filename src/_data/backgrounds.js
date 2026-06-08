const fs = require("fs");
const path = require("path");

module.exports = function () {
  const bgDir = path.join(__dirname, "..", "img", "background");

  // Falls der Ordner nicht existiert, geben wir ein leeres Array zurück
  if (!fs.existsSync(bgDir)) return [];

  const files = fs.readdirSync(bgDir);
  const bestVersions = {};

  files.forEach((file) => {
    if (/\.(jpe?g|png|webp|svg)$/i.test(file)) {
      const { name: stem, ext } = path.parse(file);
      // Falls noch kein Eintrag für den Namen existiert ODER die aktuelle Datei webp ist
      if (!bestVersions[stem] || ext.toLowerCase() === ".webp") {
        bestVersions[stem] = file;
      }
    }
  });

  return Object.values(bestVersions).map((file) => `/img/background/${file}`);
};

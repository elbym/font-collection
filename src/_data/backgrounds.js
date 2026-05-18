const fs = require("fs");
const path = require("path");

module.exports = function () {
  const bgDir = path.join(__dirname, "..", "img", "background");

  // Falls der Ordner nicht existiert, geben wir ein leeres Array zurück
  if (!fs.existsSync(bgDir)) return [];

  // Wir lesen die Dateien aus und filtern nach gängigen Bildformaten
  return fs.readdirSync(bgDir)
    .filter(file => /\.(jpe?g|png|webp|svg)$/i.test(file))
    // Wir geben den Pfad relativ zum dist-Ordner zurück
    .map(file => `../img/background/${file}`);
};

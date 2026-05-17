const fs = require("fs");
const path = require("path");

module.exports = function () {
  const fontsDir = path.join(__dirname, "..", "fonts");
  const fontImagesMap = {};

  if (!fs.existsSync(fontsDir)) return {};

  // Alle Ordner in src/fonts durchlaufen
  const folders = fs.readdirSync(fontsDir);

  folders.forEach((folder) => {
    const folderPath = path.join(fontsDir, folder);

    if (fs.statSync(folderPath).isDirectory()) {
      const files = fs.readdirSync(folderPath);

      // Filter für Bilder (jpg, png, webp, svg)
      const images = files.filter((file) =>
        /\.(jpe?g|png|gif|svg|webp)$/i.test(file)
      );

      fontImagesMap[folder] = images.map((img) => {
        const filenameWithoutExt = path.parse(img).name;
        return {
          src: `/fonts/${folder}/${img}`,
          alt: `Vorschau für ${folder} - ${filenameWithoutExt.replace(/[-_]/g, ' ')}`,
          filename: img, // Der ursprüngliche Dateiname als "Source"
        };
      });
    }
  });

  return fontImagesMap;
};
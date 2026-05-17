const fs = require("fs");
const path = require("path");

module.exports = function () {
  const baseDir = path.join(__dirname, "../fonts");
  if (!fs.existsSync(baseDir)) return {};

  // Die Reihenfolge ist entscheidend: Längere Begriffe zuerst (z.B. extrabold vor bold)
  const weightMap = {
    extrabold: 800,
    extralight: 200,
    semibold: 600,
    black: 900,
    bold: 700,
    thin: 100,
    light: 300,
    medium: 500,
    regular: 400,
  };

  const opticalMap = {
    caption: 1,
    subhead: 2,
    display: 3,
    text: 5,
    headline: 6,
    initials: 7,
    math: 8,
    regular: 4,
  };

  const structure = {};
  const folders = fs
    .readdirSync(baseDir)
    .filter((f) => fs.statSync(path.join(baseDir, f)).isDirectory());

  folders.forEach((folder) => {
    const folderPath = path.join(baseDir, folder);
    const files = fs.readdirSync(folderPath);

    structure[folder] = files
      .filter((file) => /\.(woff2|woff)$/i.test(file))
      .map((file) => {
        const nameStr = path.parse(file).name;
        const lowerName = nameStr.toLowerCase();

        // 1. Gewichtung ermitteln
        // Findet 'bold' auch in 'BoldItalic' oder 'Semibold' (wenn semibold in der Map oben steht)
        let weight = 400;
        const foundWeightKey = Object.keys(weightMap).find((key) =>
          lowerName.includes(key),
        );
        if (foundWeightKey) {
          weight = weightMap[foundWeightKey];
        }

        // 2. Optischen Schnitt (Optical) ermitteln
        let optical = null;
        let opticalOrder = 3;

        const specialOpticalKey = Object.keys(opticalMap)
          .filter((key) => key !== "regular")
          .find((key) => lowerName.includes(key));

        if (specialOpticalKey) {
          optical =
            specialOpticalKey.charAt(0).toUpperCase() +
            specialOpticalKey.slice(1);
          opticalOrder = opticalMap[specialOpticalKey];
        } else if (lowerName.includes("regular")) {
          // Nur für die Sortierung relevant, optical bleibt null
          opticalOrder = 3;
        }

        // 3. Stil (Italic) ermitteln
        const style = lowerName.includes("italic") ? "italic" : "normal";

        return {
          fileName: file,
          filePath: `${folder}/${file}`,
          displayName: nameStr.replace(/[-_]/g, " "),
          family: folder,
          optical: optical,
          opticalOrder: opticalOrder,
          weight: weight,
          style: style,
        };
      })
      .sort((a, b) => {
        // Sortier-Hierarchie: Optical -> Weight -> Style
        if (a.opticalOrder !== b.opticalOrder)
          return a.opticalOrder - b.opticalOrder;
        if (a.weight !== b.weight) return a.weight - b.weight;
        return a.style.localeCompare(b.style);
      });
  });

  return structure;
};

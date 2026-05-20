const fs = require("fs");
const path = require("path");

module.exports = function () {
  const baseDir = path.join(__dirname, "../fonts");
  if (!fs.existsSync(baseDir)) return {};

  // Alle einzigartigen Gewichte mit Display-Labels für Variable Fonts
  const variableWeights = [
    { weight: 100, label: "Thin" },
    { weight: 200, label: "ExtraLight" },
    { weight: 300, label: "Light" },
    { weight: 400, label: "Regular" },
    { weight: 500, label: "Medium" },
    { weight: 600, label: "SemiBold" },
    { weight: 700, label: "Bold" },
    { weight: 800, label: "ExtraBold" },
    { weight: 900, label: "Black" },
  ];

  // Die Reihenfolge ist entscheidend: Längere Begriffe zuerst (z.B. extrabold vor bold)
  const weightMap = {
    extrabold: 800,
    extralight: 200,
    ultralight: 200,
    semibold: 600,
    heavy: 900,
    black: 900,
    medium: 500,
    light: 300,
    hair: 100,
    thin: 100,
    bold: 700,
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

  /**
   * Erkennt Variable Fonts anhand typischer Dateinamen-Muster:
   * - Enthält das Wort "variable" (z.B. "Roboto-VariableFont_wght.woff2")
   * - Enthält Achsen-Notation in eckigen Klammern (z.B. "Roboto[wght].woff2")
   * - Endet auf "-vf" oder "_vf" vor der Extension (z.B. "Roboto-VF.woff2")
   */
  function detectVariableFont(lowerName) {
    return (
      lowerName.includes("variable") ||
      /\[.*wght.*\]/.test(lowerName) ||
      /[-_]vf$/.test(lowerName)
    );
  }

  const structure = {};
  const folders = fs
    .readdirSync(baseDir)
    .filter((f) => fs.statSync(path.join(baseDir, f)).isDirectory());

  folders.forEach((folder) => {
    const folderPath = path.join(baseDir, folder);
    const files = fs.readdirSync(folderPath);

    structure[folder] = files
      .filter((file) => /\.(woff2|woff)$/i.test(file))
      .flatMap((file) => {
        const nameStr = path.parse(file).name;
        const lowerName = nameStr.toLowerCase();

        /*
          Variable Schriften
          
          */
        if (detectVariableFont(lowerName)) {

          // Stil des Variable-Font-Files bestimmen (manche Familien liefern
          // eine separate Italic-Datei: "Font-Italic[wght].woff2")
          const baseStyle = lowerName.includes("italic") ? "italic" : "normal";

          // Optischen Schnitt ermitteln (selbe Logik wie bei statischen Fonts)
          let optical = null;
          let opticalOrder = 4;
          const specialOpticalKey = Object.keys(opticalMap)
            .filter((key) => key !== "regular")
            .find((key) => lowerName.includes(key));
          if (specialOpticalKey) {
            optical =
              specialOpticalKey.charAt(0).toUpperCase() +
              specialOpticalKey.slice(1);
            opticalOrder = opticalMap[specialOpticalKey];
          }

          // Für jedes eindeutige Gewicht einen Eintrag erzeugen
          return variableWeights.map(({ weight, label }) => ({
            fileName: file,
            filePath: `${folder}/${file}`,
            displayName: `${label}${baseStyle === "italic" ? " Italic" : ""}`,
            family: folder,
            optical: optical,
            opticalOrder: opticalOrder,
            weight: weight,
            style: baseStyle,
            isVariable: true,
          }));
        }

        /*
          Statische Schriften
          1. Gewichtung ermitteln
          Findet 'bold' auch in 'BoldItalic' oder 'Semibold' (wenn semibold in der Map oben steht)

          */
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

        return [
          {
            fileName: file,
            filePath: `${folder}/${file}`,
            displayName: nameStr.replace(/[-_]/g, " "),
            family: folder,
            optical: optical,
            opticalOrder: opticalOrder,
            weight: weight,
            style: style,
            isVariable: false,
          },
        ];
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

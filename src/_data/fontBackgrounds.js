const fs = require("fs");
const path = require("path");

module.exports = function () {
  const baseDir = path.join(__dirname, "../webfonts");

  if (!fs.existsSync(baseDir)) return {};

  const map = {};

  /**
   * Recursively scan folders for background images.
   */
  function scanFolder(dirPath, relativePath = "") {
    const entries = fs.readdirSync(dirPath);
    
    // Check for background subfolder
    const backgroundDir = path.join(dirPath, "background");
    if (fs.existsSync(backgroundDir)) {
      const files = fs.readdirSync(backgroundDir).filter((file) => /\.(jpe?g|png|webp|svg|avif)$/i.test(file));
      
      if (files.length) {
        // Prefer webp versions when multiple formats exist
        const bestVersions = {};
        files.forEach((file) => {
          const { name: stem, ext } = path.parse(file);
          if (!bestVersions[stem] || ext.toLowerCase() === ".webp") {
            bestVersions[stem] = file;
          }
        });

        // Store by folder's basename
        const folderKey = path.basename(dirPath);
        map[folderKey] = Object.values(bestVersions).map((file) => `/webfonts/${relativePath}/background/${file}`);
      }
    }

    // Recursively scan subdirectories
    const dirs = entries.filter((e) => {
      const fullPath = path.join(dirPath, e);
      return fs.statSync(fullPath).isDirectory();
    });

    dirs.forEach((dir) => {
      const subPath = relativePath ? `${relativePath}/${dir}` : dir;
      scanFolder(path.join(dirPath, dir), subPath);
    });
  }

  scanFolder(baseDir);
  return map;
};

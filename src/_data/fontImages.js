const fs = require("fs");
const path = require("path");

module.exports = function () {
  const baseDir = path.join(__dirname, "../webfonts");

  if (!fs.existsSync(baseDir)) return {};

  const structure = {};

  /**
   * Recursively scan folders for images.
   * For each folder, check for a 'gallery' subfolder first, then fall back to root images.
   */
  function scanFolder(dirPath, relativePath = "") {
    const entries = fs.readdirSync(dirPath);
    
    // Prefer gallery subfolder for gallery images, fallback to files in current folder
    const galleryDir = path.join(dirPath, "gallery");
    const dirToRead = fs.existsSync(galleryDir) ? galleryDir : dirPath;
    const files = fs.readdirSync(dirToRead);
    
    const folderTitle = path.basename(dirPath);
    const images = files
      .filter((file) => /\.(jpe?g|png|webp|svg|avif)$/i.test(file))
      .map((file) => ({
        filename: file,
        alt: `${folderTitle} – ${path.parse(file).name}`,
        src: dirToRead === galleryDir
          ? `/webfonts/${relativePath}/gallery/${file}`
          : `/webfonts/${relativePath}/${file}`,
      }));

    // If this folder has images, store them by the folder's key
    if (images.length > 0) {
      const folderKey = path.basename(dirPath);
      structure[folderKey] = images;
    }

    // Recursively scan subdirectories, skipping known asset-only folders
    const skipDirs = new Set(["background", "gallery"]);
    const dirs = entries.filter((e) => {
      if (skipDirs.has(e)) return false;
      const fullPath = path.join(dirPath, e);
      return fs.statSync(fullPath).isDirectory();
    });

    dirs.forEach((dir) => {
      const subPath = relativePath ? `${relativePath}/${dir}` : dir;
      scanFolder(path.join(dirPath, dir), subPath);
    });
  }

  scanFolder(baseDir);
  return structure;
};
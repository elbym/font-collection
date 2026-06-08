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
    
    const images = files
      .filter((file) => /\.(jpe?g|png|webp|svg|avif)$/i.test(file))
      .map((file) => ({
        filename: file,
        src: dirToRead === galleryDir 
          ? `/webfonts/${relativePath}/gallery/${file}` 
          : `/webfonts/${relativePath}/${file}`,
      }));

    // If this folder has images, store them by the folder's key
    if (images.length > 0) {
      const folderKey = path.basename(dirPath);
      structure[folderKey] = images;
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
  return structure;
};
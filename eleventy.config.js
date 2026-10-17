module.exports = function (eleventyConfig) {
  // LICENSE.md in den Schriftordnern nicht als Seite rendern, nur als Datei kopieren
  eleventyConfig.ignores.add("src/webfonts/**/*.md");

  eleventyConfig.addPassthroughCopy({
    "index.html": "index.html",
    "src/webfonts": "webfonts",
    // GitHub Pages: .nojekyll verhindert Jekyll; 404.html (Kopie von index.html) erzeugt scripts/set-base.js
    ".nojekyll": ".nojekyll",
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};

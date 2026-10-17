module.exports = function (eleventyConfig) {
  // LICENSE.md in den Schriftordnern nicht als Seite rendern, nur als Datei kopieren
  eleventyConfig.ignores.add("src/webfonts/**/*.md");

  eleventyConfig.addPassthroughCopy({
    "index.html": "index.html",
    "src/webfonts": "webfonts",
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};

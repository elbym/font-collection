module.exports = function (eleventyConfig) {
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

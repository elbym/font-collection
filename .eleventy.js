const { HtmlBasePlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Custom Filter: Zahl → Zeichen
  eleventyConfig.addNunjucksFilter("chr", function (code) {
    return String.fromCharCode(code);
  });

  eleventyConfig.addFilter("getNavDepth", (url) => {
    return url.split("/").filter(Boolean).length;
  });

  eleventyConfig.addFilter("isChildOf", (childUrl, parentUrl) => {
    return childUrl.startsWith(parentUrl) && childUrl !== parentUrl;
  });

  // Setzt das globale Permalink-Verhalten auf dateiname.html statt dateiname/index.html
  eleventyConfig.addGlobalData("permalink", () => {
    return (data) => `${data.page.filePathStem}.html`;
  });

  // Such-Filter für Deep-Access (z.B. data.selectedFontFolder)
  eleventyConfig.addFilter("find", (arr, key, value) =>
    arr.find(item => {
      const val = key.split(".").reduce((o, k) => o?.[k], item);
      return val === value;
    })
  );

  // Aktiviert das automatische Ersetzen aller URLs basierend auf deinem pathPrefix
  eleventyConfig.addPlugin(HtmlBasePlugin);

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
    },
  };
};

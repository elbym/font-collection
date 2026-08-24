const path = require("path");

// .eleventy.js only exposes its filters as side effects on the eleventyConfig
// object Eleventy itself would pass in. To unit test them without booting a
// real Eleventy build, we hand it a fake config object that just records
// every addFilter/addNunjucksFilter call, then hand the caller a lookup map.
function loadEleventyFilters() {
  const filters = {};
  const globalData = {};

  const fakeConfig = {
    addPlugin() {},
    addNunjucksFilter(name, fn) {
      filters[name] = fn;
    },
    addFilter(name, fn) {
      filters[name] = fn;
    },
    addGlobalData(name, fn) {
      globalData[name] = fn;
    },
  };

  // .eleventy.js is required fresh each time in case a future change makes
  // it stateful; require's own module cache keeps this cheap.
  const configFn = require(path.join(__dirname, "..", "..", ".eleventy.js"));
  configFn(fakeConfig);

  return { filters, globalData };
}

module.exports = { loadEleventyFilters };

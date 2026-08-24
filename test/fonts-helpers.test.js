const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const {
  sanitizeFamily,
  detectVariableFont,
  extractAxes,
  slugify,
  hashKey,
  generateFallbackColor,
  resolveColorHex,
} = require("../src/_data/fonts.js")._internal;

describe("sanitizeFamily", () => {
  test("leaves a plain family name untouched", () => {
    assert.equal(sanitizeFamily("Jost"), "Jost");
  });

  test("strips a trailing optical-size discriminator", () => {
    assert.equal(sanitizeFamily("Mozilla-Headline"), "Mozilla");
    assert.equal(sanitizeFamily("Fraunces_Display"), "Fraunces");
  });

  // Documents the known footgun from CLAUDE.md: a family whose real name
  // *ends* in an optical-size word gets split unless the folder name is
  // structured to avoid it. This test exists so a future opticalMap edit
  // that changes this behavior is a deliberate choice, not a surprise.
  test("a family name that happens to end in an optical-size word is split off", () => {
    assert.equal(sanitizeFamily("Bookman Old Style Text"), "Bookman Old Style");
  });
});

describe("detectVariableFont", () => {
  test("matches the literal word 'variable'", () => {
    assert.equal(detectVariableFont("jost-variablefont_wght"), true);
  });

  test("matches a bracketed axis list", () => {
    assert.equal(detectVariableFont("recursive[mono,casl,crsv,wght]"), true);
  });

  test("matches a bracketed single custom axis (e.g. YEAR)", () => {
    assert.equal(detectVariableFont("climatecrisis[year]"), true);
  });

  test("matches a _vf suffix", () => {
    assert.equal(detectVariableFont("somefont_vf"), true);
  });

  test("does not match an ordinary static filename", () => {
    assert.equal(detectVariableFont("jost_bold"), false);
  });

  test("does not false-positive on a bracket with fewer than four letters", () => {
    assert.equal(detectVariableFont("weird[ab]"), false);
  });
});

describe("extractAxes", () => {
  test("reads a bracketed axis list, including custom axes", () => {
    assert.deepEqual(extractAxes("recursive[mono,casl,crsv,wght]"), ["mono", "casl", "crsv", "wght"]);
  });

  test("lowercases and trims bracketed axes", () => {
    assert.deepEqual(extractAxes("font[ WGHT , Opsz ]"), ["wght", "opsz"]);
  });

  test("reads an underscore-separated axis list when there is no bracket", () => {
    assert.deepEqual(extractAxes("font_variablefont_opsz,wght"), ["opsz", "wght"]);
  });

  test("underscore format only accepts registered axis tags", () => {
    // "abcd" is not a registered VARIABLE_AXES tag, so it's filtered out;
    // with nothing left the wght fallback kicks in.
    assert.deepEqual(extractAxes("font_abcd,zzzz"), ["wght"]);
  });

  test("falls back to ['wght'] when nothing matches", () => {
    assert.deepEqual(extractAxes("plainvariablefont"), ["wght"]);
  });

  test("a single custom axis in brackets is not filtered by the registered-axes whitelist", () => {
    assert.deepEqual(extractAxes("climatecrisis[year]"), ["year"]);
  });
});

describe("slugify", () => {
  test("lowercases and hyphenates spaces", () => {
    assert.equal(slugify("Fira Sans Condensed"), "fira-sans-condensed");
  });

  test("strips characters outside [a-z0-9-]", () => {
    assert.equal(slugify("IBM Plex Mono!"), "ibm-plex-mono");
  });
});

describe("hashKey / generateFallbackColor", () => {
  test("hashKey is deterministic for the same input", () => {
    assert.equal(hashKey("jost"), hashKey("jost"));
  });

  test("hashKey differs for different input (no trivial collisions on close keys)", () => {
    assert.notEqual(hashKey("jost"), hashKey("inter"));
  });

  test("generateFallbackColor returns a stable hex color for a given key", () => {
    const a = generateFallbackColor("jost");
    const b = generateFallbackColor("jost");
    assert.equal(a, b);
    assert.match(a, /^#[0-9a-f]{6}$/);
  });
});

describe("resolveColorHex", () => {
  test("passes through an already-hex color", () => {
    assert.equal(resolveColorHex("#ABC123"), "#ABC123");
  });

  test("resolves a known CSS color keyword", () => {
    assert.equal(resolveColorHex("tomato"), "#ff6347");
  });

  test("is case-insensitive on keyword lookup", () => {
    assert.equal(resolveColorHex("TOMATO"), "#ff6347");
  });

  test("returns null for an unknown keyword", () => {
    assert.equal(resolveColorHex("not-a-real-color"), null);
  });

  test("returns null for falsy input", () => {
    assert.equal(resolveColorHex(null), null);
    assert.equal(resolveColorHex(""), null);
  });
});

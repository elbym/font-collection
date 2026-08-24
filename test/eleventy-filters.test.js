const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { loadEleventyFilters } = require("./helpers/loadEleventyConfig");

const { filters } = loadEleventyFilters();

describe("chr / charCodeAt", () => {
  test("chr converts a codepoint back to its character", () => {
    assert.equal(filters.chr(65), "A");
  });

  test("charCodeAt is the inverse of chr", () => {
    assert.equal(filters.charCodeAt("A"), 65);
  });
});

describe("coveragePercent", () => {
  test("returns null when no codepoint map is given", () => {
    assert.equal(filters.coveragePercent("abc_upper", null), null);
  });

  test("100% when every codepoint in the range is present", () => {
    const cpMap = {};
    for (let i = 65; i < 91; i++) cpMap[i] = 1;
    assert.equal(filters.coveragePercent("abc_upper", cpMap), 100);
  });

  test("0% when none of the range is present", () => {
    assert.equal(filters.coveragePercent("abc_upper", {}), 0);
  });

  test("rounds partial coverage", () => {
    // abc_upper is [65, 91) -> 26 codepoints; 13 present = 50%
    const cpMap = {};
    for (let i = 65; i < 65 + 13; i++) cpMap[i] = 1;
    assert.equal(filters.coveragePercent("abc_upper", cpMap), 50);
  });
});

describe("unicodeChars", () => {
  test("digits range yields '0'..'9'", () => {
    assert.deepEqual(filters.unicodeChars("digits"), [
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    ]);
  });
});

describe("getChildNodes / getAncestors / getRootNodes / isAncestorOf", () => {
  const fontFolders = [
    { path: "serif", parentPath: null },
    { path: "serif/cormorant", parentPath: "serif" },
    { path: "serif/lora", parentPath: "serif" },
    { path: "sans", parentPath: null },
  ];

  test("getChildNodes returns only direct children", () => {
    const children = filters.getChildNodes(fontFolders[0], fontFolders);
    assert.deepEqual(
      children.map((n) => n.path),
      ["serif/cormorant", "serif/lora"]
    );
  });

  test("getChildNodes returns empty array for a leaf", () => {
    assert.deepEqual(filters.getChildNodes(fontFolders[1], fontFolders), []);
  });

  test("getAncestors walks up to the root for a leaf", () => {
    const ancestors = filters.getAncestors(fontFolders[1], fontFolders);
    assert.deepEqual(ancestors.map((n) => n.path), ["serif"]);
  });

  test("getAncestors returns empty array for a root node", () => {
    assert.deepEqual(filters.getAncestors(fontFolders[0], fontFolders), []);
  });

  test("getAncestors stops instead of throwing on a dangling parentPath", () => {
    const orphan = { path: "orphan/leaf", parentPath: "does-not-exist" };
    assert.deepEqual(filters.getAncestors(orphan, fontFolders), []);
  });

  test("getRootNodes returns only nodes without a parentPath", () => {
    const roots = filters.getRootNodes(fontFolders);
    assert.deepEqual(roots.map((n) => n.path), ["serif", "sans"]);
  });

  test("isAncestorOf is true only for the direct parent", () => {
    assert.equal(filters.isAncestorOf(fontFolders[0], fontFolders[1]), true);
    assert.equal(filters.isAncestorOf(fontFolders[3], fontFolders[1]), false);
  });
});

describe("hueShift", () => {
  test("rotates hue by the given degrees", () => {
    // red (hue 0) + 120deg -> green-ish hue
    const shifted = filters.hueShift("#ff0000", 120);
    assert.match(shifted, /^#[0-9a-f]{6}$/);
    assert.notEqual(shifted.toLowerCase(), "#ff0000");
  });

  test("defaults to 60 degrees when none is given", () => {
    const shifted = filters.hueShift("#ff0000");
    assert.match(shifted, /^#[0-9a-f]{6}$/);
  });

  test("falls back to the original value on an invalid color", () => {
    assert.equal(filters.hueShift("not-a-color", 60), "not-a-color");
  });
});

describe("markdownify", () => {
  test("renders basic markdown to HTML", () => {
    assert.equal(filters.markdownify("**bold**").trim(), "<p><strong>bold</strong></p>");
  });

  test("returns empty string for falsy input", () => {
    assert.equal(filters.markdownify(null), "");
    assert.equal(filters.markdownify(undefined), "");
    assert.equal(filters.markdownify(""), "");
  });
});

describe("jsonEscape", () => {
  test("escapes backslashes, quotes and newlines", () => {
    assert.equal(filters.jsonEscape('He said "hi"\\n'), 'He said \\"hi\\"\\\\n');
  });

  test("treats nullish input as an empty string", () => {
    assert.equal(filters.jsonEscape(null), "");
    assert.equal(filters.jsonEscape(undefined), "");
  });
});

describe("toDomain", () => {
  test("extracts the hostname from a full URL", () => {
    assert.equal(filters.toDomain("https://fonts.google.com/specimen/Jost"), "fonts.google.com");
  });

  test("returns the input unchanged when it is not a valid URL", () => {
    assert.equal(filters.toDomain("not a url"), "not a url");
  });
});

describe("findRelated", () => {
  const fontLeaves = [
    { key: "jost", tags: ["Sans", "Grotesque"] },
    { key: "inter", tags: ["Sans", "Grotesque"] },
    { key: "lora", tags: ["Serif"] },
  ];

  test("returns leaves sharing at least one tag, excluding self", () => {
    const related = filters.findRelated(fontLeaves[0], fontLeaves);
    assert.deepEqual(related.map((n) => n.key), ["inter"]);
  });

  test("returns an empty array when the folder has no tags", () => {
    assert.deepEqual(filters.findRelated({ key: "x", tags: [] }, fontLeaves), []);
  });

  test("respects the optional limit", () => {
    const manySans = [
      { key: "a", tags: ["Sans"] },
      { key: "b", tags: ["Sans"] },
      { key: "c", tags: ["Sans"] },
    ];
    const related = filters.findRelated(manySans[0], manySans, 1);
    assert.equal(related.length, 1);
  });
});

describe("findPrevNext", () => {
  const list = [{ key: "a" }, { key: "b" }, { key: "c" }];

  test("returns both neighbours for a middle item", () => {
    assert.deepEqual(filters.findPrevNext("b", list), {
      prev: { key: "a" },
      next: { key: "c" },
    });
  });

  test("prev is null for the first item", () => {
    assert.deepEqual(filters.findPrevNext("a", list), {
      prev: null,
      next: { key: "b" },
    });
  });

  test("next is null for the last item", () => {
    assert.deepEqual(filters.findPrevNext("c", list), {
      prev: { key: "b" },
      next: null,
    });
  });

  test("returns null/null when the key is not found", () => {
    assert.deepEqual(filters.findPrevNext("missing", list), {
      prev: null,
      next: null,
    });
  });
});

describe("getManualNav", () => {
  test("sorts by eleventyNavigation.order, defaulting missing order to 99", () => {
    const collection = [
      { url: "/b/", data: { eleventyNavigation: { title: "B", order: 1 } } },
      { url: "/a/", data: { eleventyNavigation: { title: "A" } } },
      { url: "/no-nav/", data: {} },
      { url: "/c/", data: { eleventyNavigation: { title: "C", order: 0 } } },
    ];
    const nav = filters.getManualNav(collection);
    assert.deepEqual(nav.map((n) => n.url), ["/c/", "/b/", "/a/"]);
  });
});

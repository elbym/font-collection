const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { buildSteps } = require("../src/_data/fontVariableAxes.js")._internal;

describe("buildSteps: ital axis", () => {
  test("returns exactly the two extremes regardless of min/max", () => {
    const steps = buildSteps("ital", 0, 1, {});
    assert.deepEqual(steps, [
      { value: 0, style: "font-style: normal", label: "Normal" },
      { value: 1, style: "font-style: italic", label: "Italic" },
    ]);
  });
});

describe("buildSteps: WONK axis", () => {
  test("pins opsz to its max in both steps when an opsz axis is present", () => {
    const steps = buildSteps("WONK", 0, 1, { opsz: { max: 144 } });
    assert.deepEqual(steps, [
      { value: 0, style: "font-variation-settings: 'opsz' 144, 'WONK' 0", label: "Aus" },
      { value: 1, style: "font-variation-settings: 'opsz' 144, 'WONK' 1", label: "An" },
    ]);
  });

  test("omits the opsz pin when the font has no opsz axis", () => {
    const steps = buildSteps("WONK", 0, 1, {});
    assert.deepEqual(steps, [
      { value: 0, style: "font-variation-settings: 'WONK' 0", label: "Aus" },
      { value: 1, style: "font-variation-settings: 'WONK' 1", label: "An" },
    ]);
  });
});

describe("buildSteps: wght axis", () => {
  test("produces 9 evenly spaced, 100-rounded steps for a 100-900 range", () => {
    const steps = buildSteps("wght", 100, 900, {});
    assert.deepEqual(steps.map((s) => s.value), [100, 200, 300, 400, 500, 600, 700, 800, 900]);
    assert.equal(steps[0].style, "font-weight: 100");
  });

  test("clamps and dedupes when the range is narrower than 9 clean 100-steps", () => {
    const steps = buildSteps("wght", 400, 500, {});
    // every generated value must stay within [min, max]
    for (const s of steps) {
      assert.ok(s.value >= 400 && s.value <= 500, `value ${s.value} out of range`);
    }
    // dedup means no two steps share the same value
    const values = steps.map((s) => s.value);
    assert.equal(new Set(values).size, values.length);
  });
});

describe("buildSteps: other registered axes", () => {
  test("wdth produces 7 steps using font-stretch", () => {
    const steps = buildSteps("wdth", 75, 125, {});
    assert.equal(steps.length, 7);
    assert.equal(steps[0].style, "font-stretch: 75%");
    assert.equal(steps.at(-1).style, "font-stretch: 125%");
  });

  test("slnt uses an oblique-degree style, always non-negative via Math.abs", () => {
    const steps = buildSteps("slnt", -10, 0, {});
    for (const s of steps) {
      assert.match(s.style, /^font-style: oblique \d+(\.\d+)?deg$/);
    }
    assert.equal(steps[0].style, "font-style: oblique 10deg");
    assert.equal(steps.at(-1).style, "font-style: oblique 0deg");
  });

  test("a custom axis (e.g. SOFT) falls back to font-variation-settings", () => {
    const steps = buildSteps("SOFT", 0, 100, {});
    assert.equal(steps.length, 7);
    assert.equal(steps[0].style, "font-variation-settings: 'SOFT' 0");
  });
});

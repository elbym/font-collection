import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
const { description, pageTitle } = createRequire(import.meta.url)("./meta.js");

describe("description", () => {
  it("kürzt am Wortende und normalisiert Whitespace", () => {
    const d = description("wort ".repeat(60));
    expect(d.length).toBeLessThanOrEqual(156);
    expect(d.endsWith("wort…")).toBe(true);
  });
  it("lässt Kurzes unverändert, leer wird null", () => {
    expect(description("a\n b")).toBe("a b");
    expect(description(null)).toBeNull();
  });
});

describe("pageTitle", () => {
  it("lässt fehlenden Autor und Jahr weg", () => {
    expect(pageTitle({ title: "X", tags: ["Sans"] })).toBe("X – Sans · Schriften");
    expect(pageTitle({ title: "X", tags: ["Sans"], author: "A", year: 2013 })).toBe("X – Sans von A (2013) · Schriften");
  });
});

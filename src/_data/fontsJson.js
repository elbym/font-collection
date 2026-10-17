// Flache Liste aller Schriften (Blatt-Knoten) für die UI: src/fonts.json.njk → /fonts.json
const fonts = require("./fonts");
const fontCodepoints = require("./fontCodepoints");

module.exports = async function () {
  const codepoints = await fontCodepoints();
  const slugs = new Set();

  const list = fonts()
    .list.filter((n) => n.isLeaf)
    .map((n) => {
      const slug = n.url.split("/").pop();
      if (slugs.has(slug)) throw new Error(`Doppelter Schrift-Slug: ${slug} (${n.path})`);
      slugs.add(slug);

      const cp = codepoints[n.key];
      const seen = new Set();
      const weights = n.ownFonts
        .map((f) => ({ weight: f.weight, italic: f.style === "italic" }))
        .filter((w) => {
          const id = `${w.weight}-${w.italic}`;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        })
        .sort((a, b) => a.weight - b.weight || Number(a.italic) - Number(b.italic));

      return {
        slug,
        title: n.title,
        family: `f-${slug}`,
        accent: n.colorHex,
        tags: n.tags,
        category: n.category,
        author: n.fontauthor ?? null,
        year: n.fontyear ?? null,
        license: n.license ?? null,
        source: n.sourceUrl ?? null,
        comment: n.comment ?? null,
        heroletter: n.heroletter ?? null,
        heroword: n.heroword ?? null,
        weights,
        variable: n.ownFonts.some((f) => f.isVariable),
        glyphs: cp ? Object.keys(cp).map(Number).sort((a, b) => a - b) : null,
      };
    });

  return list.sort((a, b) => a.title.localeCompare(b.title, "de"));
};

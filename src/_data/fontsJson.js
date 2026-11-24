// Flache Liste aller Schriften (Blatt-Knoten) für die UI: src/fonts.json.njk → /fonts.json
const fonts = require('./fonts');
const fontCodepoints = require('./fontCodepoints');
const fontAxes = require('./fontAxes');
const { description, pageTitle } = require('../../scripts/meta');
const path = require('path');

// wght-Bereich je variabler Datei (aufrecht und kursiv können sich unterscheiden, z. B. Ubuntu Sans Mono 100–700 / 400–700)
async function fileWghtRanges(list) {
  const fontkit = await import('fontkit');
  const ranges = {};
  for (const f of list.flatMap((n) => n.ownFonts).filter((f) => f.isVariable)) {
    if (f.filePath in ranges) continue;
    try {
      ranges[f.filePath] =
        fontkit.openSync(path.join(__dirname, '../webfonts', f.filePath)).variationAxes?.wght ?? null;
    } catch {
      ranges[f.filePath] = null;
    }
  }
  return ranges;
}

module.exports = async function () {
  const codepoints = await fontCodepoints();
  const axes = await fontAxes();
  const slugs = new Set();
  const fileWght = await fileWghtRanges(fonts().list.filter((n) => n.isLeaf));

  const list = fonts()
    .list.filter((n) => n.isLeaf)
    .map((n) => {
      const slug = n.url.split('/').pop();
      if (slugs.has(slug)) throw new Error(`Doppelter Schrift-Slug: ${slug} (${n.path})`);
      slugs.add(slug);

      const cp = codepoints[n.key];
      const seen = new Set();
      // Variable Dateien liefern pauschal 100–900; Schnitte außerhalb der echten wght-Achse der jeweiligen Datei
      // (z. B. Mulish ab 200, Ubuntu Sans Mono kursiv ab 400) weglassen
      const weights = n.ownFonts
        .filter((f) => {
          const wght = f.isVariable && fileWght[f.filePath];
          return !wght || (f.weight >= wght.min && f.weight <= wght.max);
        })
        .map((f) => ({ weight: f.weight, italic: f.style === 'italic' }))
        .filter((w) => {
          const id = `${w.weight}-${w.italic}`;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        })
        .sort((a, b) => a.weight - b.weight || Number(a.italic) - Number(b.italic));

      const o = {
        slug,
        title: n.title,
        family: `f-${slug}`,
        accent: n.colorHex,
        tags: n.tags,
        favorite: !!n.favorite,
        alternatives: n.alternatives ?? [],
        category: n.category,
        author: n.fontauthor ?? null,
        year: n.fontyear ?? null,
        license: n.license ?? null,
        source: n.sourceUrl ?? null,
        comment: n.comment ?? null,
        content: n.content ?? null,
        description: description(n.comment ?? n.content),
        heroletter: n.heroletter ?? null,
        heroword: n.heroword ?? null,
        weights,
        variable: n.ownFonts.some((f) => f.isVariable),
        axes: axes[n.key] ?? null,
        glyphs: cp
          ? Object.keys(cp)
              .map(Number)
              .sort((a, b) => a - b)
          : null,
      };
      o.pageTitle = pageTitle(o); // <title> der Schriftseite, auch per JS beim Navigieren gesetzt
      return o;
    });

  return list.sort((a, b) => a.title.localeCompare(b.title, 'de'));
};

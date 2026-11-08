// Umgekehrter Index aus den `alternatives:` der meta.yaml: Vorbild/Alternative → Schriften der Sammlung, die dafür genannt sind.
// Wird von src/alternatives.njk als A–Z-Verzeichnis gerendert; keine zweite Liste zu pflegen.
const fontsJson = require('./fontsJson');

const key = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

module.exports = async function () {
  const fonts = await fontsJson();
  const byTitle = new Map(fonts.map((f) => [key(f.title), f]));
  const map = new Map();
  for (const f of fonts)
    for (const name of f.alternatives ?? []) {
      if (!map.has(name)) map.set(name, []);
      map.get(name).push({ slug: f.slug, title: f.title });
    }
  const entries = [...map]
    .map(([name, list]) => ({
      name,
      // Gehört der Name selbst zu einer Schrift der Sammlung, verlinkt er dorthin
      self: byTitle.get(key(name))?.slug ?? null,
      fonts: list.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
  const letters = [...new Set(entries.map((e) => e.name[0].toUpperCase()))];
  return { entries, letters };
};

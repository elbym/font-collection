// Meta-Tags pro Schrift: reine Funktionen, genutzt von src/_data/fontsJson.js und scripts/font-pages.js
const MAX = 155;

/** Beschreibung aus comment ?? content: eine Zeile, am Wortende gekürzt. */
function description(text) {
  const s = (text ?? "").replace(/\s+/g, " ").trim();
  if (s.length <= MAX) return s || null;
  return s.slice(0, MAX).replace(/\s+\S*$/, "") + "…";
}

/** „Fira Sans – Sans von Erik Spiekermann (2013) · Schriften"; fehlende Teile entfallen. */
function pageTitle(n) {
  const by = n.author ? ` von ${n.author}` : "";
  const year = n.year ? ` (${n.year})` : "";
  return `${n.title} – ${n.tags?.[0] ?? "Schrift"}${by}${year} · Schriften`;
}

module.exports = { description, pageTitle };

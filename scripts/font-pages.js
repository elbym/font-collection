// Erzeugt _site/<slug>/index.html pro Schrift: index.html mit eigenem <title> und Meta-Tags (läuft nach set-base.js).
const fs = require("fs");
const { pageTitle } = require("./meta");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const site = (process.env.SITE_URL || "").replace(/\/?$/, "/");
const html = fs.readFileSync("_site/index.html", "utf8");
const fonts = JSON.parse(fs.readFileSync("_site/fonts.json", "utf8"));
const title = "<title>Schriften</title>";
if (!html.includes(title)) throw new Error(`${title} in _site/index.html nicht gefunden`);

for (const n of fonts) {
  const t = esc(pageTitle(n));
  const url = process.env.SITE_URL ? esc(site + n.slug + "/") : null;
  const tags = [
    `<title>${t}</title>`,
    n.description && `<meta name="description" content="${esc(n.description)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${t}">`,
    n.description && `<meta property="og:description" content="${esc(n.description)}">`,
    url && `<link rel="canonical" href="${url}">`,
    url && `<meta property="og:url" content="${url}">`,
  ].filter(Boolean);
  fs.mkdirSync(`_site/${n.slug}`, { recursive: true });
  fs.writeFileSync(`_site/${n.slug}/index.html`, html.replace(title, tags.join("\n  ")));
}

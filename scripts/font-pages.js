// Erzeugt _site/<slug>/index.html pro Schrift: index.html mit eigenem SEO-Block (läuft nach set-base.js).
// Mit SITE_URL zusätzlich canonical/og:url (auch für die Startseite) und _site/sitemap.xml.
const fs = require('fs');
const { SITE_NAME } = require('./meta');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const site = process.env.SITE_URL ? process.env.SITE_URL.replace(/\/?$/, '/') : null;
const html = fs.readFileSync('_site/index.html', 'utf8');
const fonts = JSON.parse(fs.readFileSync('_site/fonts.json', 'utf8'));
const BLOCK = /<!-- seo[\s\S]*?<!-- \/seo -->/;
const block = html.match(BLOCK)?.[0];
if (!block) throw new Error('SEO-Block (<!-- seo … <!-- /seo -->) in _site/index.html nicht gefunden');
const homeDesc = block.match(/name="description"\s+content="([^"]*)"/)[1]; // bereits escaped

// Absolute URLs (nur mit SITE_URL): canonical, og:url und Vorschaubild aus scripts/og-images.py
const abs = (path, alt) => {
  if (!site) return ['<meta name="twitter:card" content="summary">'];
  const url = esc(site + path);
  const img = `og/${path.replace(/\/$/, '') || 'index'}.png`;
  const og = fs.existsSync(`_site/${img}`)
    ? [
        `<meta property="og:image" content="${esc(site + img)}">`,
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        `<meta property="og:image:alt" content="${alt}">`,
        '<meta name="twitter:card" content="summary_large_image">',
      ]
    : ['<meta name="twitter:card" content="summary">'];
  return [`<link rel="canonical" href="${url}">`, `<meta property="og:url" content="${url}">`, ...og];
};
const seo = (lines) => ['<!-- seo -->', ...lines, '<!-- /seo -->'].join('\n  ');

// Startseite: absolute URLs ergänzen (idempotent, alte Zeilen werden vorher entfernt)
const home = block.split('\n').filter((l) => !/rel="canonical"|property="og:(url|image)|twitter:card/.test(l));
home.splice(-1, 0, ...abs('', SITE_NAME).map((l) => `    ${l}`));
fs.writeFileSync('_site/index.html', html.replace(BLOCK, home.join('\n')));

for (const n of fonts) {
  const t = esc(n.pageTitle);
  const d = n.description ? esc(n.description) : homeDesc;
  const page = html.replace(
    BLOCK,
    seo([
      `<title>${t}</title>`,
      `<meta name="description" content="${d}">`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:site_name" content="${SITE_NAME}">`,
      `<meta property="og:locale" content="de_DE">`,
      `<meta property="og:title" content="${t}">`,
      `<meta property="og:description" content="${d}">`,
      ...abs(`${n.slug}/`, `${esc(n.title)} – Schriftmuster`),
    ]),
  );
  fs.mkdirSync(`_site/${n.slug}`, { recursive: true });
  fs.writeFileSync(`_site/${n.slug}/index.html`, page);
}

if (site) {
  const urls = [site, site + 'alternatives.html', site + 'network.html', ...fonts.map((n) => site + n.slug + '/')];
  fs.writeFileSync(
    '_site/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join('\n')}
</urlset>
`,
  );
}

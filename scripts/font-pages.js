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

const canonical = (url) =>
  url ? [`<link rel="canonical" href="${url}">`, `<meta property="og:url" content="${url}">`] : [];
const seo = (lines) => ['<!-- seo -->', ...lines, '<!-- /seo -->'].join('\n  ');

// Startseite: canonical ergänzen (idempotent, alte Zeilen werden vorher entfernt)
const home = block.split('\n').filter((l) => !/rel="canonical"|property="og:url"/.test(l));
home.splice(-1, 0, ...canonical(site).map((l) => `  ${l}`));
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
      `<meta name="twitter:card" content="summary">`,
      ...canonical(site && esc(site + n.slug + '/')),
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

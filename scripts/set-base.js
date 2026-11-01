// Setzt den Basispfad in der Build-Ausgabe: BASE_PATH (Default "/") ersetzt <base href="…"> in index.html und 404.html.
const fs = require('fs');
const base = process.env.BASE_PATH || '/';
const BASE = /<base href="[^"]*"\s*\/?>/; // auch in Prettier-Schreibweise <base href="/" />
const src = fs.readFileSync('_site/index.html', 'utf8');
if (!BASE.test(src)) throw new Error('<base href> in _site/index.html nicht gefunden');
const html = src.replace(BASE, `<base href="${base}">`);
fs.writeFileSync('_site/index.html', html);
fs.writeFileSync('_site/404.html', html);

// Setzt den Basispfad in der Build-Ausgabe: BASE_PATH (Default "/") ersetzt <base href="/"> in index.html und 404.html.
const fs = require("fs");
const base = process.env.BASE_PATH || "/";
const html = fs.readFileSync("_site/index.html", "utf8").replace('<base href="/">', `<base href="${base}">`);
fs.writeFileSync("_site/index.html", html);
fs.writeFileSync("_site/404.html", html);

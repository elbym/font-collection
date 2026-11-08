module.exports = function (eleventyConfig) {
  // LICENSE.md in den Schriftordnern nicht als Seite rendern, nur als Datei kopieren
  eleventyConfig.ignores.add('src/webfonts/**/*.md');

  eleventyConfig.addPassthroughCopy({
    'index.html': 'index.html',
    'src/favicon.svg': 'favicon.svg',
    'src/img': 'img',
    'src/force-graph.min.js': 'force-graph.min.js',
    'src/webfonts': 'webfonts',
    // GitHub Pages: .nojekyll verhindert Jekyll; 404.html (Kopie von index.html) erzeugt scripts/set-base.js
    '.nojekyll': '.nojekyll',
  });

  // Inhaltsverzeichnis der Alternativen-Seite aus den Gruppenmarkern (<!--group …-->) und den h2-Ankern erzeugen
  eleventyConfig.addTransform('alternatives-toc', (content, outputPath) => {
    if (!outputPath?.endsWith('alternatives.html')) return content;
    const main = content.slice(content.indexOf('<main'), content.indexOf('</main>'));
    const link = (id, text) => `<a href="#${id}" class="underline underline-offset-4">${text}</a>`;
    const groups = main
      .split('<!--group ')
      .slice(1)
      .map((part) => {
        const [name, rest] = [part.slice(0, part.indexOf('-->')), part];
        const items = [...rest.matchAll(/<h2 id="([^"]+)"[^>]*>([^<]*)</g)].map(([, id, t]) =>
          link(id, t.replace(/^Alternative zu /, '')),
        );
        return `<p class="my-2"><strong class="mr-2">${name}</strong> ${items.join(' · ')}</p>`;
      });
    const more = [
      ['alle-vorbilder-und-alternativen-von-a-bis-z', 'A–Z-Verzeichnis'],
      ['glossar-stilbegriffe-der-sammlung', 'Glossar'],
    ];
    const toc = `<nav aria-label="Inhaltsverzeichnis" class="mt-10 text-sm leading-relaxed"><h2 class="mb-3 text-xl font-semibold">Inhalt</h2>${groups.join('')}<p class="my-2"><strong class="mr-2">Mehr</strong> ${more.map(([i, t]) => link(i, t)).join(' · ')}</p></nav>`;
    return content.replace('<!--toc-->', toc);
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
    },
  };
};

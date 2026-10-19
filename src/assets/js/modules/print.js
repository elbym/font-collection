// @ts-check
// Druckansicht im LaTeX-Look: füllt <article id="print"> für die aktuelle Schrift (Stile: src/css/print.css).
import { esc, host } from '../utils/html.js';
import { keep } from './cards/card1.js';
import { NAME, PANGRAM } from './cards/card2.js';

const NB = ' '; // schmales geschütztes Leerzeichen (Zahl + Einheit)
const SIZES = [44, 32, 24, 18, 14, 11, 9, 7];
const MUSTER = [
  'Typografie ist die Kunst, Schrift so zu ordnen, dass ein Text gern gelesen wird. Ein guter Satz fällt nicht auf: Zeilenlänge, Grad und Durchschuss arbeiten zusammen, bis das Auge ohne Mühe von Zeile zu Zeile findet.',
  'Wie sich eine Schrift im Fließtext schlägt, zeigt sich erst im Zusammenspiel der Buchstaben. Abstände, Ligaturen und Ziffern entscheiden darüber, ob eine Seite ruhig wirkt oder unruhig – und ob man ihr die Schrift ansieht oder nur den Inhalt.',
];

/** @param {string} s */
const paras = (s) => s.trim().split(/\n\s*\n/).map((p) => `<p>${esc(p.replace(/\s*\n\s*/g, ' '))}</p>`).join('');
/** @param {[string, string?|number|null][]} rows */
const table = (rows) => `<tbody>${rows.filter(([, v]) => v != null && v !== '').map(([k, v]) => `<tr><th scope="row">${k}</th><td>${esc(v)}</td></tr>`).join('')}</tbody>`;

/**
 * Druckfassung für Schrift `n` erzeugen (idempotent) und ihre Schnitte vorladen, sonst druckt der Browser mit Ersatzschrift.
 * @param {import('../state.js').Node} n
 */
export function prepare(n) {
  const el = document.querySelector('#print');
  if (!el || /** @type {HTMLElement} */ (el).dataset.slug === n.slug) return;
  /** @type {HTMLElement} */ (el).dataset.slug = n.slug;
  // Randboxen von @page erben von :root, nicht vom Artikel
  document.documentElement.style.setProperty('--print-family', n.family);
  document.documentElement.style.setProperty('--print-title', JSON.stringify(n.title));
  for (const w of n.weights) document.fonts.load(`${w.italic ? 'italic ' : ''}${w.weight} 1em ${n.family}`);

  const abstract = n.content || n.comment;
  const lines = [
    keep(n, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), keep(n, 'abcdefghijklmnopqrstuvwxyz'), keep(n, 'ÄÖÜäöüß&'),
    keep(n, '0123456789'), keep(n, '.,:;…!?„“‚‘»«()[]/–—@#§%€+='),
  ].filter(Boolean);
  const wf = SIZES.map((s) => `<p style="font-size:${s}pt" class="wf">${s >= 14 ? 'Boxkämpfer' : esc(PANGRAM)}</p>`).join('');
  const styles = [...n.weights].sort((a, b) => Number(a.italic) - Number(b.italic) || a.weight - b.weight)
    .map((w) => `<tr><td>${NAME[w.weight]}${w.italic ? ' Italic' : ''}</td><td>${w.weight}</td><td>${w.italic ? 'kursiv' : 'aufrecht'}</td></tr>`).join('');
  const sources = [n.source].filter(Boolean).map((u) => `<p class="url">${esc(host(/** @type {string} */ (u)))} – ${esc(u)}</p>`).join('');

  el.className = n.family;
  el.innerHTML = `
    <header class="title">
      <h1>${esc(n.title)}</h1>
      ${n.author ? `<p class="author">${esc(n.author)}</p>` : ''}
      ${n.year ? `<p class="date">${esc(n.year)}</p>` : ''}
    </header>
    ${abstract ? `<div class="abstract"><h2>Zusammenfassung</h2>${paras(abstract)}</div>` : ''}
    <section>
      <h2>Zeichensatz</h2>
      <p>Abbildung 1 zeigt die Glyphen, die in dieser Schrift enthalten sind; fehlende Zeichen sind ausgelassen.</p>
      <figure class="glyphs">${lines.map((l) => `<p>${esc(l)}</p>`).join('')}<figcaption>Zeichensatz von ${esc(n.title)}</figcaption></figure>
    </section>
    <section>
      <h2>Schnitte</h2>
      <p>${esc(n.title)} umfasst ${n.weights.length}${NB}${n.weights.length === 1 ? 'Schnitt' : 'Schnitte'}${n.variable ? ' und ist als variable Schrift angelegt' : ''} (Tabelle 1).</p>
      <table class="${n.weights.length > 8 ? 'long' : ''}"><caption>Schnitte</caption><thead><tr><th>Name</th><th>Gewicht</th><th>Stil</th></tr></thead><tbody>${styles}</tbody></table>
      <h3>Wasserfall</h3>
      <figure>${wf}<figcaption>Wasserfall von ${SIZES[0]}${NB}pt bis ${SIZES.at(-1)}${NB}pt</figcaption></figure>
    </section>
    <section>
      <h2>Mustertext</h2>
      ${MUSTER.map((t) => `<p>${esc(t)}</p>`).join('')}
    </section>
    <section>
      <h2>Angaben</h2>
      <table class="meta"><caption>Angaben zur Schrift</caption>${table([['Gestalter', n.author], ['Jahr', n.year], ['Kategorie', n.category], ['Schlagwörter', n.tags?.join(', ')], ['Lizenz', n.license]])}</table>
      ${sources}
    </section>`;
}

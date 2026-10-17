// @ts-check
import { esc } from '../../utils/html.js';

/** Karte 2: Poster A (Zeichensatz). @param {import('../../state.js').Node} n */
export const card2 = (n) => {
  // Zeichen, die laut n.glyphs fehlen, weglassen (glyphs null = alle vorhanden)
  const keep = (/** @type {string} */ s) =>
    [...s].filter((c) => !n.glyphs || n.glyphs.includes(/** @type {number} */ (c.codePointAt(0)))).join('');
  const seq = (/** @type {string} */ s, /** @type {string} */ size) =>
    `<p class="${size} whitespace-nowrap leading-[1.2] tracking-[.04em]">${esc(keep(s))}</p>`;
  // Alphabet in einer Zeile mit fester Größe: passt bei den meisten Schriften in die Plakatbreite, sehr breite (z. B. Climate Crisis) laufen bewusst über den Rand
  const ALPHA = 'text-[5cqw]';
  const hero = keep(n.heroletter || 'Aa');
  const heroSize = hero.length <= 2 ? 'text-[52cqw]' : hero.length <= 3 ? 'text-[36cqw]' : 'text-[26cqw]'; // nach Länge
  const meta = [n.author, n.year].filter(Boolean).join(', ');
  const rule = '<div class="h-[.4cqw] w-full bg-[color:var(--accent-ui)]"></div>';
  return `
        <div class="${n.family} w-full h-full flex justify-center">
          <div class="w-[min(100cqw,70cqh)] h-full min-h-0 [container-type:inline-size]">
          <div class="h-full flex flex-col gap-[2.5cqw] p-[6cqw] pb-[14cqw] text-left">
            <!-- ponytail: Padding im inneren Div, damit cqw-Werte auf die Plakatbreite (nicht die Karte) beziehen -->

            <p class="text-[3.6cqw] leading-tight">${esc(n.title)}</p>
            ${meta ? `<p class="text-[2.8cqw] opacity-60">${esc(meta)}</p>` : ''}
            ${rule}
            <p class="${heroSize} flex-1 min-h-0 flex items-center leading-none whitespace-nowrap text-[color:var(--accent-ui)]">${esc(hero)}</p>
            ${rule}
            ${seq('ABCDEFGHIJKLMNOPQRSTUVWXYZ', ALPHA)}
            ${seq('abcdefghijklmnopqrstuvwxyz', ALPHA)}
            ${seq('0123456789', ALPHA)}
          </div>
          </div>
        </div>`;
};

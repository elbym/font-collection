// @ts-check
/** @typedef {import('../../state.js').Node['weights']} Weights */

const PANGRAM = 'Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.';
const LOREM =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.';
/** @type {Record<number, string>} */
const NAME = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
// Tailwind-Klassen vollständig ausgeschrieben (Scan per @source)
/** @type {Record<number, string>} */
const WEIGHT = { 100: 'font-thin', 200: 'font-extralight', 300: 'font-light', 400: 'font-normal', 500: 'font-medium', 600: 'font-semibold', 700: 'font-bold', 800: 'font-extrabold', 900: 'font-black' };

/**
 * Zeilenhöhe teilt die verfügbare Höhe (in cqh) auf alle Zeilen auf, maximal 2.6cqw.
 * @param {number} k Anzahl Zeilen
 * @param {number} total verfügbare Höhe in cqh
 */
export const fs = (k, total) => `min(max(2.6cqw,11px),${(total / k).toFixed(2)}cqh)`;
/** Wie `fs`, aber größer (4.4cqw) für das schmale Hochformat (Smartphone). */
export const fsMobile = (k, total) => `min(max(4.4cqw,11px),${((total + 5) / k).toFixed(2)}cqh)`;

/** Karte 2: Poster B (Schnitte, Fließtext). @param {import('../../state.js').Node} n */
export const card2 = (n) => {
  // Zeilengröße hängt von der Schnittanzahl ab (Daten) und steht deshalb einmal inline am Raster; die Zellen erben sie
  const list = (/** @type {Weights} */ ws, /** @type {number} */ total, /** @type {(w: Weights[number]) => string} */ label) => `<div style="--fs:${fs(ws.length, total)};--fm:${fsMobile(ws.length, total)}" class="text-[length:var(--fm)] sm:text-[length:var(--fs)] grid grid-cols-[auto_1fr] content-start gap-x-[2.5cqw] leading-[1.1] whitespace-nowrap">${ws.map((w) => `
        <span>${label(w)}</span>
        <span class="${WEIGHT[w.weight]} ${w.italic ? 'italic' : ''}">Boxkämpfer</span>`).join('')}</div>`;
  const waterfall = ['text-[length:min(9cqw,8cqh)] sm:text-[length:min(7.5cqw,8cqh)]', 'text-[length:min(5.8cqw,5.2cqh)] sm:text-[length:min(4.8cqw,5.2cqh)]', 'hidden sm:block sm:text-[length:min(3.2cqw,3.4cqh)]']
    .map((size) => `<p class="${size} leading-[1.2]">${PANGRAM}</p>`).join('');
  return `
      <div class="${n.family} p-[max(5cqw,3.75rem)_5cqw_5cqw] w-full h-full flex flex-col gap-[2.5cqh] overflow-hidden text-left">
        <div class="flex items-baseline justify-between gap-[3cqw]">
          <p class="text-[length:min(4cqw,4.5cqh)] leading-tight">${n.title}</p>
          <p class="text-[length:min(2.4cqw,2.6cqh)] uppercase tracking-widest text-[color:var(--accent-ui)]">${n.weights.length} Schnitte</p>
        </div>
        <div>${waterfall}</div>
        <div class="grid sm:grid-cols-2 content-start gap-x-[5cqw] gap-y-[3cqh]">
          <div>${list([...n.weights].sort((a, b) => Number(a.italic) - Number(b.italic) || a.weight - b.weight), 34, (w) => NAME[w.weight] + (w.italic ? ' Italic' : ''))}</div>
          <div class="flex flex-col gap-[2cqh]">
            <p style="--fs:${fs(n.weights.length, 34)};--fm:${fsMobile(n.weights.length, 34)}" class="text-[length:var(--fm)] sm:text-[length:var(--fs)] line-clamp-3 sm:line-clamp-6 leading-[1.35]">${LOREM}</p>
          </div>
        </div>
      </div>`;
};

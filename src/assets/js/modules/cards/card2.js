// @ts-check
/** @typedef {import('../../state.js').Node['weights']} Weights */

const WORD = 'Boxkämpfer';
export const PANGRAM = 'Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.';
const LOREM =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.';
/** @type {Record<number, string>} */
export const NAME = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};
// Tailwind-Klassen vollständig ausgeschrieben (Scan per @source)
/** @type {Record<number, string>} */
const WEIGHT = {
  100: 'font-thin',
  200: 'font-extralight',
  300: 'font-light',
  400: 'font-normal',
  500: 'font-medium',
  600: 'font-semibold',
  700: 'font-bold',
  800: 'font-extrabold',
  900: 'font-black',
};

/**
 * Zeilenhöhe teilt die verfügbare Höhe (in cqh) auf alle Zeilen auf, maximal 3.2cqw.
 * @param {number} k Anzahl Zeilen
 * @param {number} total verfügbare Höhe in cqh
 * @param {number} [cap] zusätzliche Obergrenze in cqw (Breite, siehe `widthCap`)
 */
export const fs = (k, total, cap) =>
  `min(max(3.2cqw,11px),${(total / k).toFixed(2)}cqh${cap ? `,${cap.toFixed(2)}cqw` : ''})`;
/** Wie `fs`, aber größer (6cqw) für das schmale Hochformat (Smartphone). */
export const fsMobile = (k, total, cap) =>
  `min(max(6cqw,11px),${((total + 5) / k).toFixed(2)}cqh${cap ? `,${cap.toFixed(2)}cqw` : ''})`;

// Breite für Label + Wort einer Schnittzeile (in cqw, Innenabstand gap-x 2.5cqw schon abgezogen):
// ab sm halbe Kartenbreite (90cqw − 5cqw Spaltenabstand) / 2, darunter volle Breite 90cqw
const LIST_W = 40;
const LIST_W_MOBILE = 87.5;
// Vorschub einer Mono-Zeichenzelle in em (meist 0.5–0.6, mit Reserve)
const MONO_ADVANCE = 0.62;

/**
 * Obergrenze der Schriftgröße (cqw), damit die längste Zeile in `width` passt. Nur für Mono-Schriften:
 * Dort ist jedes Zeichen gleich breit, ohne Begrenzung lief z. B. „Regular Italic Boxkämpfer" bei
 * Hack/Adwaita Mono in die Fließtext-Spalte. Proportionale Schriften sind schmaler und bleiben unverändert.
 * @param {number} chars Zeichen der längsten Zeile
 * @param {number} width verfügbare Breite in cqw
 */
export const widthCap = (chars, width) => width / (chars * MONO_ADVANCE);

/** Pangramm mit Auszeichnungen: „zwölf" fett, „Boxkämpfer" kursiv – nur wenn die Schrift diese Schnitte hat (sonst entstünde synthetischer Fettdruck/Schrägstellung). @param {import('../../state.js').Node} n */
const pangram = (n) => {
  let p = PANGRAM;
  if (n.weights.some((w) => w.weight >= 600)) p = p.replace('zwölf', '<span class="font-bold">zwölf</span>');
  if (n.weights.some((w) => w.italic)) p = p.replace('Boxkämpfer', '<span class="italic">Boxkämpfer</span>');
  return p;
};

/** Karte 2: Poster B (Schnitte, Fließtext). @param {import('../../state.js').Node} n */
export const card2 = (n) => {
  const ws = [...n.weights].sort((a, b) => Number(a.italic) - Number(b.italic) || a.weight - b.weight);
  const label = (/** @type {Weights[number]} */ w) => NAME[w.weight] + (w.italic ? ' Italic' : '');
  // Zeilengröße hängt von der Schnittanzahl ab (Daten) und steht deshalb inline an Liste und Fließtext (gleich groß);
  // bei Mono-Schriften zusätzlich nach der längsten Zeile begrenzt
  const mono = n.category === 'Monospace';
  const chars = Math.max(...ws.map((w) => label(w).length)) + WORD.length;
  const size = `--fs:${fs(ws.length, 40, mono ? widthCap(chars, LIST_W) : undefined)};--fm:${fsMobile(ws.length, 40, mono ? widthCap(chars, LIST_W_MOBILE) : undefined)}`;
  const list = `<div style="${size}" class="text-[length:var(--fm)] sm:text-[length:var(--fs)] grid grid-cols-[auto_1fr] content-start gap-x-[2.5cqw] leading-[1.1] whitespace-nowrap">${ws
    .map(
      (w) => `
        <span>${label(w)}</span>
        <span class="${WEIGHT[w.weight]} ${w.italic ? 'italic' : ''}">${WORD}</span>`,
    )
    .join('')}</div>`;
  const waterfall = ['text-[length:min(7cqw,7.5cqh)]', 'text-[length:min(4.5cqw,5cqh)]']
    .map((size) => `<p class="${size} leading-[1.2]">${pangram(n)}</p>`)
    .join('');
  return `
      <div class="${n.family} p-[max(5cqw,3.75rem)_5cqw_5cqw] w-full h-full flex flex-col gap-[2.5cqh] overflow-hidden text-left">
        <div class="flex items-baseline justify-between gap-[3cqw]">
          <p class="text-[length:min(4cqw,4.5cqh)] leading-tight">${n.title}</p>
          <p class="text-[length:min(2.4cqw,2.6cqh)] uppercase tracking-widest text-[color:var(--accent-ui)]">${n.weights.length} Schnitte</p>
        </div>
        <div>${waterfall}</div>
        <div class="grid sm:grid-cols-2 content-start gap-x-[5cqw] gap-y-[3cqh]">
          <div>${list}</div>
          <div class="flex flex-col gap-[2cqh]">
            <p style="${size}" class="text-[length:var(--fm)] sm:text-[length:var(--fs)] line-clamp-3 sm:line-clamp-6 leading-[1.35]">${LOREM}</p>
          </div>
        </div>
      </div>`;
};

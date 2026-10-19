// @ts-check
import { BASE, state } from '../state.js';
import { esc } from '../utils/html.js';
import { acc, tile } from './cards/index.js';
import { go } from './router.js';

/** Rasterübersicht: Kacheln aus `state.nodes`, Klick öffnet die Detailansicht, Hover schaltet Schnitte durch. @param {Document} [root] */
export function init(root = document) {
  const grid = root.querySelector('#grid');
  if (!grid) return;

  // Kacheln in einem Rutsch einfügen
  grid.innerHTML = state.nodes.map((n, i) => `
      <button data-i="${i}" style="${acc(n)}" aria-label="${n.title.replace(/"/g, '&quot;')}" title="${n.title.replace(/"/g, '&quot;')}"
        class="acc relative scroll-mt-12 [container-type:inline-size] [content-visibility:auto] aspect-square rounded-2xl bg-white dark:bg-neutral-900 hover:brightness-95 active:scale-95 transition-transform">
        <div class="${n.family}-s h-full flex items-center justify-center text-[color:var(--accent-ui)]">${tile(n)}</div>
        <span class="absolute inset-x-3 bottom-2 truncate text-left font-sans text-xs text-neutral-500 dark:text-neutral-400">${esc(n.title)}</span>
      </button>`).join('');

  // Hover (nur Maus): Schnitte der Schrift in der Kachel durchschalten
  /** @type {HTMLElement|null} */
  let hoverTile = null;
  /** @type {ReturnType<typeof setInterval>|undefined} */
  let hoverTimer;
  const hoverStop = () => {
    clearInterval(hoverTimer);
    if (hoverTile) /** @type {HTMLElement} */ (hoverTile.firstElementChild).style.cssText = '';
    hoverTile = null;
  };
  grid.addEventListener('pointerover', (e) => {
    const ev = /** @type {PointerEvent} */ (e);
    const tile = ev.pointerType === 'mouse' ? /** @type {HTMLElement|null} */ (/** @type {Element} */ (ev.target).closest('[data-i]')) : null;
    if (tile === hoverTile) return;
    hoverStop();
    const all = tile && state.nodes[Number(tile.dataset.i)].weights;
    if (!tile || !all || all.length < 2) return;
    // erst alle Normal-Schnitte (dünn → fett), dann alle Italic-Schnitte
    const ws = [...all].sort((a, b) => Number(a.italic) - Number(b.italic) || a.weight - b.weight);
    hoverTile = tile;
    let k = 0;
    const step = () => {
      const w = ws[k++ % ws.length];
      /** @type {HTMLElement} */ (tile.firstElementChild).style.cssText = `font-weight:${w.weight};font-style:${w.italic ? 'italic' : 'normal'}`;
    };
    step();
    hoverTimer = setInterval(step, 300);
  });
  // Übersicht fertig geladen: Hover-Schnitte (Latin-Subsets) nacheinander vorladen, damit sie sofort bereitstehen
  const preload = async () => {
    for (const n of state.nodes) {
      await Promise.all((n.weights || []).map((w) => document.fonts.load(`${w.italic ? 'italic ' : ''}${w.weight} 1em ${n.family}-s`).catch(() => {})));
      await new Promise((r) => (window.requestIdleCallback || setTimeout)(r)); // ponytail: sequenziell im Leerlauf, damit die Übersicht nicht ruckelt
    }
  };
  if (matchMedia('(hover:hover)').matches) { // Smartphone: kein Hover, nicht vorladen
    if (document.readyState === 'complete') preload();
    else addEventListener('load', preload, { once: true });
  }

  grid.addEventListener('pointerleave', hoverStop);
  grid.addEventListener('click', hoverStop, true); // vor dem Öffnen beenden

  grid.addEventListener('click', (e) => {
    const tile = /** @type {HTMLElement|null} */ (/** @type {Element} */ (e.target).closest('[data-i]'));
    if (tile) go(`${BASE}${state.nodes[Number(tile.dataset.i)].slug}#1`);
  });
}

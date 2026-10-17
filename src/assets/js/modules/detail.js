// @ts-check
import { BASE, DETAILS, state } from '../state.js';
import { name, transition } from '../utils/viewTransition.js';
import { acc, content } from './cards/index.js';

/** @type {HTMLDialogElement} */ let detail;
/** @type {HTMLElement} */ let cards;
/** @type {HTMLElement} */ let grid;
/** @type {HTMLElement} */ let dots;

/** Detailkarten einer Row erst bei Bedarf erzeugen (Row ± 1 Bildschirm im Dialog, oder direkt per show()). @param {HTMLElement} row */
function fill(row) {
  if (row.firstChild) return;
  const n = state.nodes[[...cards.children].indexOf(row)];
  row.innerHTML = Array.from({ length: DETAILS }, (_, c) => `
        <section style="${acc(n)}" class="acc bg-white dark:bg-neutral-950 [container-type:size] [content-visibility:auto] snap-start snap-always shrink-0 w-full h-dvh flex flex-col items-center justify-center p-6 text-center text-base sm:text-[1.25rem]">${content(n, c)}</section>`).join('');
  row.scrollLeft = state.col * row.clientWidth;
}

/** @param {number} c */
const setDot = (c) => {
  state.col = c;
  [...dots.children].forEach((d, k) => d.classList.toggle('!bg-neutral-500', k === c));
};

/** Aktuell sichtbare Karte (Node i, Detailkarte). */
export const current = () => {
  const row = /** @type {HTMLElement} */ (cards.children[Math.round(detail.scrollTop / detail.clientHeight)]);
  return { i: [...cards.children].indexOf(row), card: /** @type {HTMLElement} */ (row.children[Math.round(row.scrollLeft / row.clientWidth)]) };
};

/** Ist die Detailansicht offen? */
export const isOpen = () => detail.open;

/** URL der Detailansicht nach dem Scrollen nachziehen (kein neuer History-Eintrag). */
let urlTimer;
const syncUrl = () => {
  clearTimeout(urlTimer);
  urlTimer = setTimeout(() => {
    if (detail.open) history.replaceState(null, '', `${BASE}${state.nodes[current().i].slug}#${state.col + 1}`);
  }, 150);
};

/**
 * Detailansicht auf Node i / Detailkarte c stellen (ohne Animation).
 * @param {number} i
 * @param {number} c
 */
export function show(i, c) {
  if (!detail.open) detail.showModal();
  const row = /** @type {HTMLElement} */ (cards.children[i]);
  fill(row);
  detail.scrollTop = row.offsetTop;
  for (const r of cards.children) r.scrollLeft = c * r.clientWidth;
  setDot(c);
}

/**
 * Öffnet Node i / Detailkarte c, optional mit Kachel→Karte-Übergang.
 * @param {number} i
 * @param {number} c
 * @param {boolean} animate
 */
export function openAnim(i, c, animate) {
  if (!animate) return show(i, c);
  const tile = /** @type {HTMLElement} */ (grid.children[i]);
  /** @type {HTMLElement} */ let card;
  name(tile, true);
  transition('open', () => {
    name(tile, false);
    show(i, c);
    card = /** @type {HTMLElement} */ (cards.children[i].children[c]);
    name(card, true);
  }).then(() => name(card, false));
}

/** Schließt die Detailansicht mit Karte→Kachel-Übergang. */
export function closeAnim() {
  const { i, card } = current();
  const tile = /** @type {HTMLElement} */ (grid.children[i]);
  name(card, true);
  transition('close', () => {
    name(card, false);
    detail.close();
    tile.scrollIntoView({ block: 'nearest' });
    name(tile, true);
  }).then(() => name(tile, false));
}

/** Vollbild-Detailansicht: leere Rows als Platzhalter, Karten lazy, Punkt-Indikator, Spalten-Sync. @param {Document} [root] */
export function init(root = document) {
  const d = root.querySelector('#detail');
  const c = root.querySelector('#cards');
  const g = root.querySelector('#grid');
  const dt = root.querySelector('#dots');
  if (!d || !c || !g || !dt) return;
  detail = /** @type {HTMLDialogElement} */ (d);
  cards = /** @type {HTMLElement} */ (c);
  grid = /** @type {HTMLElement} */ (g);
  dots = /** @type {HTMLElement} */ (dt);

  // leere Rows (h-dvh-Platzhalter, damit Snap/offsetTop stimmen) in einem Rutsch einfügen
  cards.innerHTML = state.nodes.map(() => `
      <div class="row h-dvh flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory snap-start snap-always overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"></div>`).join('');

  const lazy = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && fill(/** @type {HTMLElement} */ (e.target))), { root: detail, rootMargin: '100% 0px' });
  for (const row of cards.children) lazy.observe(row);

  // Punkte: eine Anzeige für die aktuelle Detailkarte
  dots.innerHTML = '<i class="size-2 rounded-full bg-neutral-500/40 transition"></i>'.repeat(DETAILS);
  setDot(0);

  // Gleiche Detailkarte in allen Nodes: sobald ein Row ausgescrollt ist, ziehen die anderen nach
  // ponytail: Debounce statt scrollend (Safari < 26 kennt es nicht)
  let syncTimer;
  cards.addEventListener('scroll', (e) => {
    const row = /** @type {HTMLElement} */ (e.target);
    setDot(Math.round(row.scrollLeft / row.clientWidth));
    syncUrl();
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      for (const r of cards.children) if (r !== row) r.scrollLeft = row.scrollLeft;
    }, 100);
  }, true);
  detail.addEventListener('scroll', syncUrl);
}

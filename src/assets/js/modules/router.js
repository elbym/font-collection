// @ts-check
import { BASE, DETAILS, state, tagQuery } from '../state.js';
import { esc } from '../utils/html.js';
import { closeAnim, isOpen, openAnim, show } from './detail.js';

/** @type {HTMLElement} */ let grid;
/** @type {HTMLElement} */ let tools;

/** Filter-Pills der Top-Bar (Tag-Werte aus fonts.json); erneuter Klick hebt den Filter auf. */
const PILLS = ['Sans', 'Serif', 'Monospace', 'Display', 'Script'];

/** Rasterübersicht mit Tag-Filter (?tag=…), beim Öffnen einer Schrift bleibt er erhalten. */
const home = () => BASE + tagQuery();

/** Setzt die Ansicht aus der URL: <BASE>slug#3 = Schrift slug, Detailkarte 3; <BASE> = Raster. @param {boolean} [animate] */
function route(animate = true) {
  const path = location.pathname.slice(BASE.length).replace(/\/$/, "");
  state.tag = new URLSearchParams(location.search).get('tag') || '';
  const cards = document.querySelector('#cards');
    [grid, cards].forEach((el) => [...(el?.children ?? [])].forEach((t, k) => /** @type {HTMLElement} */ (t).hidden = !!state.tag && !state.nodes[k].tags?.includes(state.tag))); // Filter gilt auch in der Detailansicht
    tools.innerHTML = (!state.tag || PILLS.includes(state.tag) ? PILLS : [...PILLS, state.tag]).map((p) => `<a data-nav href="${BASE}${p === state.tag ? '' : `?tag=${encodeURIComponent(p)}`}" class="shrink-0 rounded-full border px-3 py-1 text-sm ${p === state.tag ? 'border-transparent bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900' : 'border-neutral-500/50'}">${esc(p)}</a>`).join('');
  const i = state.nodes.findIndex((n) => n.slug === path);
  const c = Math.min(Math.max((parseInt(location.hash.slice(1)) || 1) - 1, 0), DETAILS - 1);
  if (i >= 0) isOpen() ? show(i, c) : openAnim(i, c, animate);
  else if (isOpen()) closeAnim();
}

/** Einziger Weg, die Ansicht zu ändern: pushState + route(). @param {string} url */
export const go = (url) => {
  history.pushState(null, '', url);
  route();
};

/** Routing, Schließen-Knopf, Esc, Tag-Links. @param {Document} [root] */
export function init(root = document) {
  const g = root.querySelector('#grid');
  const t = root.querySelector('#tools');
  const detail = root.querySelector('#detail');
  const close = root.querySelector('#close');
  if (!g || !t || !detail || !close) return;
  grid = /** @type {HTMLElement} */ (g);
  tools = /** @type {HTMLElement} */ (t);

  close.addEventListener('click', () => go(home()));
  detail.addEventListener('cancel', (e) => { e.preventDefault(); go(home()); }); // Esc
  root.addEventListener('click', (e) => { // Tag-Links und Filter-Chip: ohne Reload über den Router
    const ev = /** @type {MouseEvent} */ (e);
    const a = /** @type {Element} */ (ev.target).closest('a[data-nav]');
    if (a && !ev.metaKey && !ev.ctrlKey && !ev.shiftKey) { ev.preventDefault(); go(/** @type {string} */ (a.getAttribute('href'))); }
  });
  addEventListener('popstate', () => route()); // Zurück/Vor und manuell geänderter Hash
  route(false); // direkter Aufruf einer URL
}

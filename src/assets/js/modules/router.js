// @ts-check
import { BASE, DETAILS, state } from '../state.js';
import { esc } from '../utils/html.js';
import { closeAnim, isOpen, openAnim, show } from './detail.js';

/** @type {HTMLElement} */ let grid;
/** @type {HTMLElement} */ let tools;

/** Rasterübersicht mit Tag-Filter (?tag=…), beim Öffnen einer Schrift bleibt er erhalten. */
const home = () => BASE + (state.tag ? `?tag=${encodeURIComponent(state.tag)}` : '');

/** Setzt die Ansicht aus der URL: <BASE>slug#3 = Schrift slug, Detailkarte 3; <BASE> = Raster. @param {boolean} [animate] */
function route(animate = true) {
  const path = location.pathname.slice(BASE.length).replace(/\/$/, "");
  if (!path) {
    state.tag = new URLSearchParams(location.search).get('tag') || '';
    [...grid.children].forEach((t, k) => /** @type {HTMLElement} */ (t).hidden = !!state.tag && !state.nodes[k].tags?.includes(state.tag));
    tools.innerHTML = state.tag ? `<a data-nav href="${BASE}" class="rounded-full border border-neutral-500/50 px-3 py-1 text-sm">${esc(state.tag)} ×</a>` : '';
  }
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

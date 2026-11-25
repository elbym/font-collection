// @ts-check
import { BASE, DETAILS, query, state } from '../state.js';
import { esc } from '../utils/html.js';
import { order } from '../utils/sort.js';
import { closeAnim, isOpen, openAnim, show } from './detail.js';

/** @type {HTMLElement} */ let grid;
/** @type {HTMLElement} */ let tools;
/** @type {HTMLInputElement} */ let search;
/** @type {HTMLSelectElement} */ let sort;

/** Filter-Pills der Top-Bar (Tag-Werte aus fonts.json); erneuter Klick hebt den Filter auf. */
const PILLS = ['Star', 'Sans', 'Serif', 'Monospace', 'Display', 'Script', 'Blackletter', 'Comic'];

/** Rasterübersicht mit Tag-Filter, Suche und Sortierung, beim Öffnen einer Schrift bleiben sie erhalten. */
const home = () => BASE + query();

/** Seitentitel der Startseite (og:site_name aus index.html); Schriften haben `pageTitle` aus fonts.json. */
const SITE = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || document.title;

/** Tag-Filter und Suchtext (Name, Autor, Tags); gilt auch in der Detailansicht. */
function applyFilter() {
  const q = state.q.trim().toLowerCase();
  const hit = (/** @type {import('../state.js').Node} */ n) =>
    (!state.tag || (state.tag === 'Star' ? !!n.favorite : !!n.tags?.includes(state.tag))) &&
    (!q || [n.title, n.author, ...(n.tags ?? [])].some((s) => s?.toLowerCase().includes(q)));
  state.nodes.forEach((n, k) => {
    const h = !hit(n);
    state.tiles[k].hidden = h;
    if (state.rows[k]) state.rows[k].hidden = h;
  });
}

/** Sortierung: Kacheln und Detail-Rows in derselben Reihenfolge umhängen (nur wenn sie sich geändert hat). */
let sorted = '';
function applySort() {
  if (state.sort === sorted) return;
  sorted = state.sort;
  const ix = order(state.nodes, state.sort);
  grid.append(...ix.map((i) => state.tiles[i]));
  state.rows[0]?.parentElement?.append(...ix.map((i) => state.rows[i]));
}

/** Setzt die Ansicht aus der URL: <BASE>slug#3 = Schrift slug, Detailkarte 3; <BASE> = Raster. @param {boolean} [animate] */
function route(animate = true) {
  const path = location.pathname.slice(BASE.length).replace(/\/$/, '');
  const p = new URLSearchParams(location.search);
  state.tag = p.get('tag') || '';
  state.q = p.get('q') || '';
  state.sort = p.get('sort') || '';
  if (search.value.trim() !== state.q) search.value = state.q; // nicht beim Tippen überschreiben (Leerzeichen am Ende, Cursor)
  sort.value = state.sort;
  applyFilter();
  applySort();
  tools.innerHTML = (!state.tag || PILLS.includes(state.tag) ? PILLS : [...PILLS, state.tag])
    .map(
      (p) =>
        `<a data-nav href="${BASE}${query({ tag: p === state.tag ? '' : p })}" class="shrink-0 rounded-full border px-3 py-1 text-sm ${p === state.tag ? 'border-transparent bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900' : 'border-neutral-500/50'}">${p === 'Star' ? '★ ' : ''}${esc(p)}</a>`,
    )
    .join('');
  const i = state.nodes.findIndex((n) => n.slug === path);
  const c = Math.min(Math.max((parseInt(location.hash.slice(1)) || 1) - 1, 0), DETAILS - 1);
  document.title = state.nodes[i]?.pageTitle ?? SITE;
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
  const s = root.querySelector('#search');
  const o = root.querySelector('#sort');
  if (!g || !t || !detail || !close || !s || !o) return;
  grid = /** @type {HTMLElement} */ (g);
  tools = /** @type {HTMLElement} */ (t);
  search = /** @type {HTMLInputElement} */ (s);
  sort = /** @type {HTMLSelectElement} */ (o);
  // Suche und Sortierung stehen in der URL (teilbar), ohne neuen History-Eintrag pro Tastendruck
  search.addEventListener('input', () => {
    history.replaceState(null, '', BASE + query({ q: search.value.trim() }));
    route();
  });
  sort.addEventListener('change', () => {
    history.replaceState(null, '', BASE + query({ sort: sort.value }));
    route();
  });

  close.addEventListener('click', () => go(home()));
  detail.addEventListener('cancel', (e) => {
    e.preventDefault();
    go(home());
  }); // Esc
  root.addEventListener('click', (e) => {
    // Tag-Links und Filter-Chip: ohne Reload über den Router
    const ev = /** @type {MouseEvent} */ (e);
    const a = /** @type {Element} */ (ev.target).closest('a[data-nav]');
    if (a && !ev.metaKey && !ev.ctrlKey && !ev.shiftKey) {
      ev.preventDefault();
      go(/** @type {string} */ (a.getAttribute('href')));
    }
  });
  addEventListener('popstate', () => route()); // Zurück/Vor und manuell geänderter Hash
  route(false); // direkter Aufruf einer URL
}

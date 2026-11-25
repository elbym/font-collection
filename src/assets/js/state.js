// @ts-check
// Geteilter Zustand der Anwendung (ein Ort statt loser Globals).

/** Anzahl Detailkarten pro Schrift. */
export const DETAILS = 3;

/** Basispfad aus `<base href>` (Root lokal, /font-collection/ auf GitHub Pages, siehe scripts/set-base.js). */
export const BASE = new URL(document.baseURI).pathname;

/**
 * @typedef {object} Node
 * @property {string} slug
 * @property {string} title
 * @property {string} family
 * @property {string} accent
 * @property {string[]} [tags]
 * @property {string[]} [alternatives]
 * @property {boolean} [favorite]
 * @property {string} [author]
 * @property {string|number} [year]
 * @property {string} [license]
 * @property {string} [source]
 * @property {string} [comment]
 * @property {string} [content]
 * @property {string} [category]
 * @property {string} [heroletter]
 * @property {{weight: number, italic: boolean}[]} weights
 * @property {number[]|null} glyphs
 * @property {Record<string, {name: string, min: number, max: number, step: number, default: number}>} [axes]
 */

export const state = {
  /** @type {Node[]} aus fonts.json */
  nodes: [],
  /** zuletzt sichtbare Detailkarte (gilt für alle Nodes) */
  col: 0,
  /** aktiver Tag-Filter der Rasteransicht */
  tag: '',
  /** Suchtext der Top-Bar (?q=…) */
  q: '',
  /** Sortierung des Rasters (?sort=alt|neu, '' = A–Z) */
  sort: '',
  /** Kacheln und Detail-Rows nach Node-Index (die DOM-Reihenfolge folgt der Sortierung, der Index nicht) */
  /** @type {HTMLElement[]} */
  tiles: [],
  /** @type {HTMLElement[]} */
  rows: [],
};

/** Query aus Tag-Filter, Suche und Sortierung ('' ohne alles), hängt an Raster- und Detail-URLs. @param {Partial<{tag: string, q: string, sort: string}>} [over] */
export const query = (over = {}) => {
  const p = new URLSearchParams(
    Object.entries({ tag: state.tag, q: state.q.trim(), sort: state.sort, ...over }).filter(([, v]) => v),
  ).toString();
  return p ? `?${p}` : '';
};

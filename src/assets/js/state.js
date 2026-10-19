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
 * @property {string} [author]
 * @property {string|number} [year]
 * @property {string} [license]
 * @property {string} [source]
 * @property {string} [comment]
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
};

/** Query für den aktiven Tag-Filter ('' ohne Filter), hängt an Raster- und Detail-URLs. */
export const tagQuery = () => (state.tag ? `?tag=${encodeURIComponent(state.tag)}` : '');

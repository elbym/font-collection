// @ts-check

/**
 * Escaped HTML-Sonderzeichen als numerische Entities.
 * @param {unknown} s
 * @returns {string}
 */
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Hostname einer URL; bei ungültiger URL die Eingabe selbst.
 * @param {string} u
 * @returns {string}
 */
export const host = (u) => {
  try {
    return new URL(u).hostname;
  } catch {
    return u;
  }
};

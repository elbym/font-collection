// @ts-check

/**
 * Führt `fn` in einer View Transition aus; `dir` (open/close) steuert die CSS-Animation.
 * Ohne API-Support (ältere Browser) wird ohne Animation umgeschaltet.
 * @param {'open'|'close'} dir
 * @param {() => void} fn
 * @returns {Promise<unknown>}
 */
export const transition = (dir, fn) => {
  document.documentElement.dataset.dir = dir;
  return document.startViewTransition ? document.startViewTransition(fn).finished : (fn(), Promise.resolve());
};

/**
 * Gibt Kachel/Karte und ihren `[data-vt]`-Kindern gleiche Namen, damit sie einzeln morphen statt zu überblenden.
 * @param {HTMLElement} el
 * @param {boolean} on
 */
export const name = (el, on) => {
  el.style.viewTransitionName = on ? 'node' : '';
  el.querySelectorAll('[data-vt]').forEach((e) => {
    /** @type {HTMLElement} */ (e).style.viewTransitionName = on ? 'node-' + /** @type {HTMLElement} */ (e).dataset.vt : '';
  });
};

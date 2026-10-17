// @ts-check
import { state } from '../state.js';
import { current, isOpen } from './detail.js';

/** @param {Element} panel */
const applyAxes = (panel) => {
  /** @type {HTMLElement} */ (/** @type {HTMLElement} */ (panel.parentElement).querySelector('[data-vt=aa]')).style.fontVariationSettings =
    [...panel.querySelectorAll('input')].map((i) => `'${i.dataset.axis}' ${i.value}`).join(',');
};

/** Variable Schriften: Slider steuern die Achsen; laufen von selbst, bis man einen anfasst. @param {Document} [root] */
export function init(root = document) {
  const cards = root.querySelector('#cards');
  if (!cards) return;

  cards.addEventListener('input', (e) => {
    const input = /** @type {HTMLInputElement} */ (e.target);
    const panel = input.closest('[data-axes]');
    if (!panel) return;
    /** @type {HTMLOutputElement} */ (input.nextElementSibling).value = input.value;
    applyAxes(panel);
  });
  for (const ev of ['pointerdown', 'keydown']) {
    cards.addEventListener(ev, (e) => {
      const p = /** @type {HTMLElement|null} */ (/** @type {Element} */ (e.target).closest('[data-axes]'));
      if (p) p.dataset.stop = '1';
    });
  }

  // ponytail: eine rAF-Schleife für die sichtbare Karte 1; läuft leer weiter, solange nichts zu tun ist
  requestAnimationFrame(function tick(t) {
    const panel = isOpen() && state.col === 0 && /** @type {HTMLElement|null} */ (current().card.querySelector('[data-axes]'));
    if (panel && !panel.dataset.stop) {
      panel.querySelectorAll('input').forEach((inp, k) => {
        const min = +inp.min, max = +inp.max, step = +inp.step;
        const v = (min + max) / 2 + (max - min) / 2 * Math.sin(t / 1000 * (0.08 + k * 0.04) * 2 * Math.PI + k * 2.1);
        inp.value = String(Math.min(max, Math.max(min, Math.round(v / step) * step)));
        /** @type {HTMLOutputElement} */ (inp.nextElementSibling).value = String(Math.round(Number(inp.value) * 10) / 10);
      });
      applyAxes(panel);
    }
    requestAnimationFrame(tick);
  });
}

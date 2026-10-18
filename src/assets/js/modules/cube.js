// @ts-check
import { state } from '../state.js';
import { current, isOpen } from './detail.js';

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Buchstabengitter aus den ersten drei Achsen (x/y/z) einmalig aufbauen. @param {HTMLElement} box */
function build(box) {
  const n = state.nodes[Number(box.dataset.cube)];
  const axes = Object.entries(n.axes ?? {}).slice(0, 3);
  const word = [...n.title.toUpperCase()].filter((c) => /\p{L}/u.test(c));
  const GRID = Math.max(3, Math.min(4, word.length)); // Kantenlänge = Buchstabenzahl, max. 4 (64 Spans; iOS-Speicher)
  const spacing = Math.min(box.clientWidth, box.clientHeight) / (GRID + 1);
  const half = (GRID - 1) / 2;
  const wghtOn = axes.findIndex(([tag]) => tag === 'wght');
  const pts = [];
  for (let i = 0; i < GRID; i++) for (let j = 0; j < GRID; j++) for (let k = 0; k < GRID; k++) {
    const g = [i, j, k];
    const el = document.createElement('span');
    el.className = 'absolute left-0 top-0 leading-none';
    el.style.fontSize = `${spacing * 0.8}px`;
    el.textContent = word[g[wghtOn === 0 ? 2 : 0] % word.length];
    el.style.fontVariationSettings = axes
      .map(([tag, a], x) => `'${tag}' ${a.min + (a.max - a.min) * g[x] / (GRID - 1)}`).join(',');
    box.append(el);
    pts.push({ el, x: (i - half) * spacing, y: (j - half) * spacing, z: (k - half) * spacing });
  }
  return pts;
}

/** Dekorativer, nicht steuerbarer 3D-Würfel auf Detailkarte 1 (nur variable Schriften). */
export function init() {
  /** @type {WeakMap<HTMLElement, ReturnType<typeof build>>} */
  const built = new WeakMap();
  requestAnimationFrame(function tick(t) {
    const box = isOpen() && state.col === 0 && /** @type {HTMLElement|null} */ (current().card.querySelector('[data-cube]'));
    if (box) {
      const pts = built.get(box) ?? (built.set(box, build(box)), /** @type {NonNullable<ReturnType<typeof built.get>>} */ (built.get(box)));
      const yaw = still ? 0.4 : 0.4 + t / 1000 * 0.15;
      const pitch = still ? -0.3 : -0.3 + 0.15 * Math.sin(t / 4000);
      const cx = box.clientWidth / 2, cy = box.clientHeight / 2, depth = Math.min(box.clientWidth, box.clientHeight) / 2;
      for (const p of pts) {
        const rx = p.x * Math.cos(yaw) + p.z * Math.sin(yaw);
        const rz = -p.x * Math.sin(yaw) + p.z * Math.cos(yaw);
        const ry = p.y * Math.cos(pitch) - rz * Math.sin(pitch);
        const rz2 = p.y * Math.sin(pitch) + rz * Math.cos(pitch);
        p.el.style.transform = `translate(-50%,-50%) translate(${(cx + rx).toFixed(1)}px,${(cy - ry).toFixed(1)}px)`;
        p.el.style.opacity = String(Math.max(0.05, Math.min(1, 0.5 + rz2 / depth / 1.5)));
      }
    }
    requestAnimationFrame(tick);
  });
}

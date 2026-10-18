// @ts-check
import { esc } from '../../utils/html.js';

/**
 * Variable Schriften: Slider je Achse unter dem „Aa“ (Detailkarte 1 (Poster A)). Verhalten: modules/axes.js.
 * @param {import('../../state.js').Node} n
 */
export const axisPanel = (n) => !n.axes ? '' : `
      <div data-axes class="[font-variation-settings:normal] grid w-full max-h-[16cqh] grid-cols-[auto_1fr_auto] items-center gap-x-[2cqw] gap-y-[.5cqw] overflow-y-auto overscroll-contain text-[2.6cqw] text-left">${Object.entries(n.axes).map(([tag, a]) => `
        <span class="opacity-60">${esc(a.name)}</span>
        <input type="range" data-axis="${esc(tag)}" min="${a.min}" max="${a.max}" step="${a.step}" value="${a.default}" aria-label="${esc(a.name)}" class="accent-[color:var(--accent-ui)]">
        <output class="w-[9cqw] text-right tabular-nums">${a.default}</output>`).join('')}
      </div>`;

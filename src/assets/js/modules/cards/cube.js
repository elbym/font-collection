// @ts-check
/** Hintergrund-Würfel unten mittig auf Detailkarte 1 (variable Schriften); Animation: modules/cube.js. @param {import('../../state.js').Node} n @param {number} i Index des Nodes */
export const cube = (n, i) => `
      <div data-cube="${i}" aria-hidden="true" class="${n.family} pointer-events-none absolute -z-10 bottom-0 left-1/2 size-[min(60cqw,45cqh)] -translate-x-1/2 translate-y-[10%] text-[color:var(--accent-ui)] opacity-40"></div>`;

// @ts-check
/** Karte 1: Name + „Aa“ (auch Kachel). @param {import('../../state.js').Node} n */
export const card1 = (n) => `
      <p data-vt="title" class="${n.family} text-[1.5em] leading-tight">${n.title}</p>
      <div class="my-[.5em] h-[.15em] w-[3em] bg-[color:var(--accent-ui)]"></div>
      <p data-vt="aa" class="${n.family} text-[8em] leading-none text-[color:var(--accent-ui)]">Aa</p>`;

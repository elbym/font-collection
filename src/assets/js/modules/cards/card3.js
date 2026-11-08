// @ts-check
import { BASE, state } from '../../state.js';
import { esc, host } from '../../utils/html.js';

const key = (/** @type {string} */ s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Alternative als Link, wenn der Name einer Schrift der Sammlung entspricht (Abgleich über den Titel, keine Pflege nötig). @param {string} a */
const link = (a) => {
  const m = state.nodes.find((x) => key(x.title) === key(a));
  return m
    ? `<a data-nav href="${BASE}${m.slug}/#3" class="underline underline-offset-4 text-[color:var(--accent-ui)]">${esc(a)}</a>`
    : esc(a);
};

/** „A, B und C" @param {string[]} a */
const list = (a) => {
  const l = a.map(link);
  return l.length > 1 ? `${l.slice(0, -1).join(', ')} und ${l.at(-1)}` : l[0];
};

/** Karte 3: Infos. @param {import('../../state.js').Node} n */
export const card3 = (n) => {
  const rows = [
    ['Designer', n.author],
    ['Jahr', n.year],
    ['Lizenz', n.license],
  ]
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `<dt class="opacity-60">${k}</dt><dd>${esc(v)}</dd>`);
  if (n.source)
    rows.push(
      `<dt class="opacity-60">Quelle</dt><dd><a href="${esc(n.source)}" target="_blank" rel="noopener" class="underline underline-offset-4 text-[color:var(--accent-ui)]">${esc(host(n.source))}</a></dd>`,
    );
  return `
        <p class="${n.family} text-[2em] leading-tight">${esc(n.title)}</p>
        <div class="my-[.5em] h-[.15em] w-[3em] bg-[color:var(--accent-ui)]"></div>
        ${rows.length ? `<dl class="grid grid-cols-[auto_1fr] gap-x-[1em] gap-y-[.3em] max-w-[28em] text-left">${rows.join('')}</dl>` : ''}
        ${n.tags?.length ? `<ul class="mt-[1em] flex flex-wrap justify-center gap-[.4em]">${n.tags.map((t) => `<li><a data-nav href="${BASE}?tag=${encodeURIComponent(t)}" class="block rounded-full border border-[color:var(--accent-ui)] px-[.7em] py-[.15em] text-[.8em]">${esc(t)}</a></li>`).join('')}</ul>` : ''}
        ${n.alternatives?.length ? `<h2 class="mt-[1em] text-[1.1em] font-semibold">${esc(n.title)} als Alternative zu ${esc(n.alternatives[0])}</h2><p class="mt-[.3em] max-w-[24em] text-[.85em]">${esc(n.title)} kann auch als Alternative zu ${list(n.alternatives)} genutzt werden.</p>` : ''}
        ${n.comment ? `<p class="mt-[1em] max-w-[24em] text-[.85em] opacity-70">${esc(n.comment)}</p>` : ''}`;
};

// @ts-check
import { BASE } from '../../state.js';
import { esc, host } from '../../utils/html.js';

/** Karte 4: Infos. @param {import('../../state.js').Node} n */
export const card4 = (n) => {
  const rows = [['Designer', n.author], ['Jahr', n.year], ['Lizenz', n.license]]
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `<dt class="opacity-60">${k}</dt><dd>${esc(v)}</dd>`);
  if (n.source) rows.push(`<dt class="opacity-60">Quelle</dt><dd><a href="${esc(n.source)}" target="_blank" rel="noopener" class="underline underline-offset-4 text-[color:var(--accent-ui)]">${esc(host(n.source))}</a></dd>`);
  return `
        <p class="${n.family} text-[2em] leading-tight">${esc(n.title)}</p>
        <div class="my-[.5em] h-[.15em] w-[3em] bg-[color:var(--accent-ui)]"></div>
        ${rows.length ? `<dl class="grid grid-cols-[auto_1fr] gap-x-[1em] gap-y-[.3em] max-w-[28em] text-left">${rows.join('')}</dl>` : ''}
        ${n.tags?.length ? `<ul class="mt-[1em] flex flex-wrap justify-center gap-[.4em]">${n.tags.map((t) => `<li><a data-nav href="${BASE}?tag=${encodeURIComponent(t)}" class="block rounded-full border border-[color:var(--accent-ui)] px-[.7em] py-[.15em] text-[.8em]">${esc(t)}</a></li>`).join('')}</ul>` : ''}
        ${n.comment ? `<p class="mt-[1em] max-w-[24em] text-[.85em] opacity-70">${esc(n.comment)}</p>` : ''}`;
};

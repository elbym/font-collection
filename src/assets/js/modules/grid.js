// @ts-check
import { BASE, state, tagQuery } from '../state.js';
import { esc } from '../utils/html.js';
import { heroText } from './cards/card1.js';
import { acc, tile } from './cards/index.js';
import { current, isOpen } from './detail.js';
import { go } from './router.js';

/** Rasterübersicht: Kacheln aus `state.nodes`, Klick öffnet die Detailansicht, Hover schaltet Schnitte durch. @param {Document} [root] */
export function init(root = document) {
  const grid = root.querySelector('#grid');
  if (!grid) return;

  // Kacheln in einem Rutsch einfügen
  grid.innerHTML = state.nodes
    .map(
      (n, i) => `
      <a href="${n.slug}/" data-i="${i}" style="${acc(n)}" aria-label="${n.title.replace(/"/g, '&quot;')}" title="${n.title.replace(/"/g, '&quot;')}"
        class="acc relative scroll-mt-12 [container-type:inline-size] [content-visibility:auto] aspect-square rounded-2xl bg-white dark:bg-neutral-900 hover:brightness-95 active:scale-95 transition-transform">
        <div class="${n.family}-s h-full flex items-center justify-center text-[color:var(--accent-ui)]">${tile(n)}</div>
        <span class="absolute inset-x-3 bottom-2 truncate text-left font-sans text-xs text-neutral-500 dark:text-neutral-400">${esc(n.title)}</span>
      </a>`,
    )
    .join('');

  // Hover (nur Maus): Schnitte der Schrift in der Kachel durchschalten
  /** @type {HTMLElement|null} */
  let hoverTile = null;
  /** @type {ReturnType<typeof setInterval>|undefined} */
  let hoverTimer;
  const hoverStop = () => {
    clearInterval(hoverTimer);
    if (hoverTile) /** @type {HTMLElement} */ (hoverTile.firstElementChild).style.cssText = '';
    hoverTile = null;
  };
  grid.addEventListener('pointerover', (e) => {
    const ev = /** @type {PointerEvent} */ (e);
    const tile =
      ev.pointerType === 'mouse'
        ? /** @type {HTMLElement|null} */ (/** @type {Element} */ (ev.target).closest('[data-i]'))
        : null;
    if (tile === hoverTile) return;
    hoverStop();
    const all = tile && state.nodes[Number(tile.dataset.i)].weights;
    if (!tile || !all || all.length < 2) return;
    // erst alle Normal-Schnitte (dünn → fett), dann alle Italic-Schnitte
    const ws = [...all].sort((a, b) => Number(a.italic) - Number(b.italic) || a.weight - b.weight);
    hoverTile = tile;
    let k = 0;
    const step = () => {
      const w = ws[k++ % ws.length];
      /** @type {HTMLElement} */ (tile.firstElementChild).style.cssText =
        `font-weight:${w.weight};font-style:${w.italic ? 'italic' : 'normal'}`;
    };
    step();
    hoverTimer = setInterval(step, 300);
  });
  // Übersicht fertig geladen: Hover-Schnitte (Latin-Subsets) nacheinander vorladen, damit sie sofort bereitstehen
  const preload = async () => {
    for (const n of state.nodes) {
      await Promise.all(
        (n.weights || []).map((w) =>
          document.fonts.load(`${w.italic ? 'italic ' : ''}${w.weight} 1em ${n.family}-s`).catch(() => {}),
        ),
      );
      await new Promise((r) => (window.requestIdleCallback || setTimeout)(r)); // ponytail: sequenziell im Leerlauf, damit die Übersicht nicht ruckelt
    }
  };
  if (matchMedia('(hover:hover)').matches) {
    // Smartphone: kein Hover, nicht vorladen
    if (document.readyState === 'complete') preload();
    else addEventListener('load', preload, { once: true });
  }

  // Das Raster lebt: alle 1,2 s bekommt eine zufällige sichtbare Kachel (Heroletter mit zwei Zeichen) eine neue Buchstabenkombination, sie bleibt stehen
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const visible = new Set();
    const io = new IntersectionObserver((es) =>
      es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))),
    );
    grid.querySelectorAll('[data-i]').forEach((t) => io.observe(t));
    const pick = (/** @type {string} */ set, /** @type {import('../state.js').Node} */ n) => {
      const ok = [...set].filter((c) => !n.glyphs || n.glyphs.includes(/** @type {number} */ (c.codePointAt(0))));
      return ok[Math.floor(Math.random() * ok.length)] ?? '';
    };
    // Überblendung eines Zeichens (Kachel und Poster A): 450 ms aus (leicht nach oben), Zeichen tauschen, 450 ms ein; nur ein Zeichen pro Wechsel
    const flip = async (/** @type {Element} */ span, /** @type {string} */ to) => {
      const cur = [...(span.textContent ?? '')];
      span.innerHTML = cur.map((c) => `<i class="inline-block not-italic">${esc(c)}</i>`).join('');
      const el = span.children[cur.findIndex((c, k) => c !== to[k])];
      if (!el) return;
      const fade = (/** @type {boolean} */ out) =>
        el.animate(
          {
            opacity: out ? [1, 0] : [0, 1],
            transform: out ? ['none', 'translateY(-.05em)'] : ['translateY(.05em)', 'none'],
          },
          { duration: 450, easing: out ? 'ease-in' : 'ease-out', fill: 'forwards' },
        ).finished;
      await fade(true);
      el.textContent = to[cur.findIndex((c, k) => c !== to[k])];
      await fade(false);
    };
    let tick = 0;
    setInterval(() => {
      if (document.hidden) return;
      /** @type {Element|null|undefined} */ let t;
      /** @type {Element|null|undefined} */ let span;
      let i;
      if (isOpen()) {
        // Detailansicht: nur wenn Poster A (Karte 1) sichtbar ist, dessen Hero wechselt mit
        const c = current();
        i = c.i;
        if (c.card?.previousElementSibling || tick++ % 3) return; // große Karte: nur jeder 3. Tick (3,6 s)
        span = c.card?.querySelector('[data-vt="hero"]');
        t = grid.children[i];
      } else {
        t = [...visible][Math.floor(Math.random() * visible.size)];
        i = Number(/** @type {HTMLElement|undefined} */ (t)?.dataset.i);
        span = t?.querySelector('[data-vt="hero"]');
      }
      const n = state.nodes[i];
      if (!n || !t || !span || t === hoverTile || [...(n.heroletter || 'Aa')].length !== 2) return; // ponytail: nur 2-Zeichen-Hero, damit die Größe passt
      const U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const L = 'abcdefghijklmnopqrstuvwxyz';
      // pro Wechsel nur ein Zeichen (zufällig das erste oder zweite), immer ein anderes als vorher
      const [a, b] = [...n.heroletter];
      const next = Math.random() < 0.5 ? pick(U.replace(a, ''), n) + b : a + pick(L.replace(b, ''), n);
      if (next.length !== 2) return;
      n.heroletter = next; // gilt für Kachel und Poster A
      flip(span, next);
      const tileHero = t.querySelector('[data-vt="hero"]');
      if (tileHero && tileHero !== span) tileHero.textContent = next; // Kachel hinter dem Dialog nachziehen (Morph beim Schließen)
    }, 1200);
  }

  grid.addEventListener('pointerleave', hoverStop);
  grid.addEventListener('click', hoverStop, true); // vor dem Öffnen beenden

  grid.addEventListener('click', (e) => {
    // Kacheln sind echte Links (für Crawler, Mittelklick); normaler Klick läuft über den Router
    const ev = /** @type {MouseEvent} */ (e);
    const tile = /** @type {HTMLElement|null} */ (/** @type {Element} */ (ev.target).closest('[data-i]'));
    if (!tile || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
    ev.preventDefault();
    const n = state.nodes[Number(tile.dataset.i)];
    const span = tile.querySelector('[data-vt="hero"]');
    if (span) span.textContent = heroText(n); // Morph-Übergang zu Poster A braucht den aktuellen Hero (auch mitten in der Animation)
    document.querySelector('#cards')?.children[Number(tile.dataset.i)]?.replaceChildren(); // bereits erzeugte Karten verwerfen, fill() baut sie mit dem neuen Hero neu
    go(`${BASE}${n.slug}${tagQuery()}#1`);
  });
}

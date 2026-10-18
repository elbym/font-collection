// @ts-check
// Inhalt der Detailkarten in em/cqw. Pro Karte ein eigener Block (Datei), damit sie einzeln änderbar sind.
import { esc } from '../../utils/html.js';
import { card1, heroText } from './card1.js';
import { card2 } from './card2.js';
import { card3 } from './card3.js';

const CARDS = [card1, card2, card3];

/**
 * Markup der Karte `c` (0-basiert) für Schrift `n`.
 * @param {import('../../state.js').Node} n
 * @param {number} c
 */
export const content = (n, c) => CARDS[c](n);

/** Kachel: nur die Heroletter von Poster A, gleiches `data-vt="hero"` wie dort (morpht beim Öffnen); alles andere blendet ein/aus. @param {import('../../state.js').Node} n */
export const tile = (n) => {
  const hero = heroText(n);
  const size = hero.length <= 1 ? 'text-[60cqw]' : hero.length <= 2 ? 'text-[30cqw]' : hero.length <= 3 ? 'text-[28cqw]' : 'text-[20cqw]';
  return `<span data-vt="hero" class="${size} leading-none whitespace-nowrap">${esc(hero)}</span>`;
};

/** Akzentfarbe als Inline-Style (Laufzeitdaten). @param {import('../../state.js').Node} n */
export const acc = (n) => `--accent:${n.accent}`;

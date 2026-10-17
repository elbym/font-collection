// @ts-check
// Inhalt der Detailkarten in em/cqw: Kachel = Karte 1 verkleinert. Pro Karte ein eigener Block (Datei), damit sie einzeln änderbar sind.
import { card1 } from './card1.js';
import { card2 } from './card2.js';
import { card3 } from './card3.js';
import { card4 } from './card4.js';

const CARDS = [card1, card2, card3, card4];

/**
 * Markup der Karte `c` (0-basiert) für Schrift `n`.
 * @param {import('../../state.js').Node} n
 * @param {number} c
 */
export const content = (n, c) => CARDS[c](n);

/** Akzentfarbe als Inline-Style (Laufzeitdaten). @param {import('../../state.js').Node} n */
export const acc = (n) => `--accent:${n.accent}`;

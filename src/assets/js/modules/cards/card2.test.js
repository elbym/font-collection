import { describe, expect, it } from 'vitest';
import { fs, widthCap } from './card2.js';

describe('fs', () => {
  it('teilt die Höhe auf die Zeilen auf', () => {
    expect(fs(4, 34)).toBe('min(max(3.2cqw,11px),8.50cqh)');
  });
});

describe('widthCap', () => {
  it('begrenzt die Größe einer Mono-Zeile auf die Spaltenbreite', () => {
    // „Regular Italic" + „Boxkämpfer" = 24 Zeichen à 0.62em müssen in 40cqw passen
    const cap = widthCap(24, 40);
    expect(cap * 24 * 0.62).toBeCloseTo(40);
    expect(fs(4, 40, cap)).toBe(`min(max(3.2cqw,11px),10.00cqh,${cap.toFixed(2)}cqw)`);
  });
});

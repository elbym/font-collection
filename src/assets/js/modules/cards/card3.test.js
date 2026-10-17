import { describe, expect, it } from 'vitest';
import { fs } from './card3.js';

describe('fs', () => {
  it('teilt die Höhe auf die Zeilen auf', () => {
    expect(fs(4, 34)).toBe('min(max(2.6cqw,11px),8.50cqh)');
  });
});

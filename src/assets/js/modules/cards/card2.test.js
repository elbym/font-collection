import { describe, expect, it } from 'vitest';
import { fs } from './card2.js';

describe('fs', () => {
  it('teilt die Höhe auf die Zeilen auf', () => {
    expect(fs(4, 34)).toBe('min(max(3.2cqw,11px),8.50cqh)');
  });
});

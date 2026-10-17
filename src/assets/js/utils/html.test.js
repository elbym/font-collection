import { describe, expect, it } from 'vitest';
import { esc, host } from './html.js';

describe('esc', () => {
  it('escaped HTML-Sonderzeichen', () => {
    expect(esc(`<a href="x">&'`)).toBe('&#60;a href=&#34;x&#34;&#62;&#38;&#39;');
  });
  it('wandelt Nicht-Strings um', () => {
    expect(esc(2024)).toBe('2024');
  });
});

describe('host', () => {
  it('liefert den Hostnamen', () => {
    expect(host('https://fonts.example.com/a?b=1')).toBe('fonts.example.com');
  });
  it('gibt ungültige URLs unverändert zurück', () => {
    expect(host('kein link')).toBe('kein link');
  });
});

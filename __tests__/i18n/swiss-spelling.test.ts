import { describe, expect, it } from 'vitest';

import { toSwissSpelling } from '@/i18n/swiss-spelling';

describe('toSwissSpelling', () => {
  it('writes ss in place of ß', () => {
    expect(toSwissSpelling('Grüße gemäß Größe')).toBe('Grüsse gemäss Grösse');
    expect(toSwissSpelling('GROẞ')).toBe('GROSS');
  });

  it('rewrites strings at any depth and keeps the structure', () => {
    expect(
      toSwissSpelling({
        meta: { title: 'Straße', count: 3 },
        tags: ['Maß', 'Web'],
        empty: null,
      })
    ).toEqual({
      meta: { title: 'Strasse', count: 3 },
      tags: ['Mass', 'Web'],
      empty: null,
    });
  });

  it('leaves text without ß and placeholders untouched', () => {
    expect(toSwissSpelling('ab {price} im Monat')).toBe('ab {price} im Monat');
  });
});

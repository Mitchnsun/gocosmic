import { describe, expect, it } from 'vitest';

import { accentClasses } from '@/design-system/accent';

describe('accentClasses', () => {
  it('returns the utilities of each token', () => {
    expect(accentClasses('aerospace')).toEqual({
      text: 'text-aerospace-ink',
      bg: 'bg-aerospace',
      rgb: '255 79 0',
    });
    expect(accentClasses('royal').text).toBe('text-royal-ink');
    expect(accentClasses('jungle').bg).toBe('bg-ok');
    expect(accentClasses('ghost').text).toBe('text-fg');
  });

  it('defaults to aerospace', () => {
    expect(accentClasses()).toEqual(accentClasses('aerospace'));
  });
});

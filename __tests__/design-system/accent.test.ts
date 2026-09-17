import { describe, expect, it } from 'vitest';

import { accentClasses } from '@/design-system/accent';

describe('accentClasses', () => {
  it('returns the utilities of each token', () => {
    expect(accentClasses('aerospace')).toEqual({
      text: 'text-aerospace',
      bg: 'bg-aerospace',
      border: 'border-aerospace',
      rgb: '255 79 0',
    });
    expect(accentClasses('royal').text).toBe('text-royal');
    expect(accentClasses('jungle').bg).toBe('bg-jungle');
    expect(accentClasses('ghost').border).toBe('border-ghost');
  });

  it('defaults to aerospace', () => {
    expect(accentClasses()).toEqual(accentClasses('aerospace'));
  });

  it('falls back to aerospace for an unknown token', () => {
    expect(accentClasses('nebula' as 'royal')).toEqual(accentClasses('aerospace'));
  });
});

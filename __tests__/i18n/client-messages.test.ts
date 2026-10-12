import { vi } from 'vitest';

import { getClientMessages } from '@/i18n/client-messages';

vi.mock('next-intl/server', () => ({
  getMessages: () =>
    Promise.resolve({
      navigation: { home: 'Home' },
      theme: { toggle: 'Theme' },
      pricing: { title: 'Pricing' },
    }),
}));

describe('getClientMessages', () => {
  it('keeps only the namespaces a page declares', async () => {
    await expect(getClientMessages(['navigation', 'theme'])).resolves.toEqual({
      navigation: { home: 'Home' },
      theme: { toggle: 'Theme' },
    });
  });

  it('ignores a namespace that does not exist', async () => {
    await expect(getClientMessages(['pricing', 'nowhere'])).resolves.toEqual({ pricing: { title: 'Pricing' } });
  });
});

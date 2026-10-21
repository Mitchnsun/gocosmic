import { createTranslator, NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import Home from '@/app/[locale]/page';

import { FRENCH_MESSAGES } from '../french-messages';
import { render, within } from '../test-utils';

// The links to the French-only pages depend on the locale only, so every locale reads the French messages.
vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async (namespace: string) => {
    const { FRENCH_MESSAGES } = await import('../french-messages');
    return createTranslator({ locale: 'fr', messages: FRENCH_MESSAGES, namespace });
  },
}));

// The hero and the closing call to action draw on a canvas, which jsdom lacks.
vi.mock('@/components/HeroSection', () => ({ default: () => null }));
vi.mock('@/components/CTAFinal', () => ({ default: () => null }));

const renderPage = async (locale: string) => {
  const page = await Home({ params: Promise.resolve({ locale }) });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={FRENCH_MESSAGES}>
      {children}
    </NextIntlClientProvider>
  );
  return render(page, { wrapper });
};

const audienceLinks = (getByRole: (role: string, options: { name: RegExp }) => HTMLElement) =>
  within(getByRole('region', { name: /Pour celles et ceux qui ont déjà un métier/ }))
    .queryAllByRole('link')
    .map((link) => link.getAttribute('href'));

describe('homepage', () => {
  it.each(['fr', 'fr-CH'])('links three audience cards to the page written for them, in %s', async (locale) => {
    const { getByRole } = await renderPage(locale);

    expect(audienceLinks(getByRole)).toEqual([
      '/website-for-tradespeople',
      '/website-for-freelancers',
      '/website-for-associations',
    ]);
    expect(getByRole('link', { name: /Site pour artisans/ })).toBeInTheDocument();
  });

  it.each(['en', 'it-CH'])('leaves the cards without a link where these pages do not exist, in %s', async (locale) => {
    const { getByRole } = await renderPage(locale);

    expect(audienceLinks(getByRole)).toEqual([]);
  });
});

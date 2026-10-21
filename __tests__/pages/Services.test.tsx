import { createTranslator, NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import Services from '@/app/[locale]/services/page';
import home from '@/messages/fr/home.json';

import { FRENCH_MESSAGES } from '../french-messages';
import { render } from '../test-utils';

/** The French messages the page reads; the trade links depend on the locale only, so every locale reads them. */
const MESSAGES: Record<string, unknown> = { ...FRENCH_MESSAGES, ...home };

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async (namespace: string) => {
    const { FRENCH_MESSAGES } = await import('../french-messages');
    const { default: home } = await import('@/messages/fr/home.json');
    const messages: Record<string, unknown> = { ...FRENCH_MESSAGES, ...home };
    return createTranslator({ locale: 'fr', messages, namespace });
  },
}));

// The closing call to action draws a canvas, which jsdom lacks.
vi.mock('@/components/CTAFinal', () => ({
  default: ({ headline }: { headline: string }) => <section aria-label={headline} />,
}));

const renderPage = async (locale: string) => {
  const page = await Services({ params: Promise.resolve({ locale }) });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={MESSAGES}>
      {children}
    </NextIntlClientProvider>
  );
  return render(page, { wrapper });
};

describe('services page', () => {
  it.each(['fr', 'fr-CH'])('links the showcase website and app cards to their pages, in %s', async (locale) => {
    const { getByRole } = await renderPage(locale);

    expect(getByRole('link', { name: /Création de site vitrine/ })).toHaveAttribute('href', '/showcase-website');
    expect(getByRole('link', { name: /Création d'application/ })).toHaveAttribute('href', '/app-development');
  });

  it.each(['en', 'de-CH'])('leaves the cards without a link where these pages do not exist, in %s', async (locale) => {
    const { queryByRole } = await renderPage(locale);

    expect(queryByRole('link', { name: /Création de site vitrine/ })).not.toBeInTheDocument();
    expect(queryByRole('link', { name: /Création d'application/ })).not.toBeInTheDocument();
  });
});

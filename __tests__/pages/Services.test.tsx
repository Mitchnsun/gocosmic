import { createTranslator, NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import Services from '@/app/[locale]/services/page';

import { FRENCH_MESSAGES } from '../french-messages';
import { render } from '../test-utils';

// The links to the French-only pages depend on the locale only, so every locale reads the French messages.
vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async (namespace: string) => {
    const { FRENCH_MESSAGES } = await import('../french-messages');
    return createTranslator({ locale: 'fr', messages: FRENCH_MESSAGES, namespace });
  },
}));

// The closing call to action draws a canvas, which jsdom lacks.
vi.mock('@/components/CTAFinal', () => ({
  default: ({ headline }: { headline: string }) => <section aria-label={headline} />,
}));

const renderPage = async (locale: string) => {
  const page = await Services({ params: Promise.resolve({ locale }) });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={FRENCH_MESSAGES}>
      {children}
    </NextIntlClientProvider>
  );
  return render(page, { wrapper });
};

describe('services page', () => {
  it.each(['fr', 'fr-CH'])(
    'links the trade cards and the reinforcement column to their pages, in %s',
    async (locale) => {
      const { getByRole } = await renderPage(locale);

      expect(getByRole('link', { name: /Création de site vitrine/ })).toHaveAttribute('href', '/showcase-website');
      expect(getByRole('link', { name: /Création d'application/ })).toHaveAttribute('href', '/app-development');
      expect(getByRole('link', { name: /Refonte de site internet/ })).toHaveAttribute('href', '/website-redesign');
    }
  );

  it.each(['en', 'de-CH'])('leaves them without a link where these pages do not exist, in %s', async (locale) => {
    const { queryByRole } = await renderPage(locale);

    expect(queryByRole('link', { name: /Création de site vitrine/ })).not.toBeInTheDocument();
    expect(queryByRole('link', { name: /Création d'application/ })).not.toBeInTheDocument();
    expect(queryByRole('link', { name: /Refonte de site internet/ })).not.toBeInTheDocument();
  });
});

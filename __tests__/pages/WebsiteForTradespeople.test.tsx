import { createTranslator, NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import WebsiteForTradespeople, { generateMetadata } from '@/app/[locale]/website-for-tradespeople/page';

import { FRENCH_MESSAGES } from '../french-messages';
import { render, within } from '../test-utils';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async (options: string | { locale: string; namespace: string }) => {
    const { locale, namespace } = typeof options === 'string' ? { locale: 'fr', namespace: options } : options;
    const { FRENCH_MESSAGES } = await import('../french-messages');
    return createTranslator({ locale, messages: FRENCH_MESSAGES, namespace });
  },
}));

// The closing call to action draws a canvas, which jsdom lacks.
vi.mock('@/components/CTAFinal', () => ({
  default: ({ headline, ctaText, ctaHref }: { headline: string; ctaText: string; ctaHref: string }) => (
    <section aria-label={headline}>
      <a href={ctaHref}>{ctaText}</a>
    </section>
  ),
}));

const params = (locale: string) => ({ params: Promise.resolve({ locale }) });

const renderPage = async (locale: string) => {
  const page = await WebsiteForTradespeople(params(locale));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={FRENCH_MESSAGES}>
      {children}
    </NextIntlClientProvider>
  );
  return render(page, { wrapper });
};

describe('page for tradespeople', () => {
  it('opens under Services in the breadcrumb, naming the trades in both forms', async () => {
    const { getByRole, getByText } = await renderPage('fr');
    const breadcrumb = getByRole('navigation', { name: "Fil d'Ariane" });

    expect(within(breadcrumb).getByText('Artisans')).toHaveAttribute('aria-current', 'page');
    expect(getByText(/^Menuisier·ère, plombier·ère, électricien·ne, coiffeur·se, traiteur·se…/)).toBeInTheDocument();
    expect(getByRole('heading', { level: 1 }).textContent).not.toMatch(/Genève|Annecy/);
  });

  it('leaves the Google listing to the tradesperson and lists the useful options', async () => {
    const { getByRole, getByText } = await renderPage('fr');
    const options = within(getByRole('region', { name: "Les options utiles à un site d'artisan." }));

    expect(getByText('Suivi de votre place sur Google')).toBeInTheDocument();
    expect(
      getByText('Vous continuez de gérer vous-même votre fiche Google Maps et les annuaires.')
    ).toBeInTheDocument();
    expect(options.getAllByRole('term').map((term) => term.textContent)).toEqual([
      'Un formulaire de contact',
      'Les avis de vos clients sur votre site',
      'La prise de rendez-vous en ligne',
      'Nombre de pages',
    ]);
  });

  it('prices its example with the simulator', async () => {
    const { getByRole } = await renderPage('fr');
    const example = within(getByRole('region', { name: "Un site d'artisan, aux prix d'aujourd'hui." }));

    expect(example.getAllByRole('listitem')).toHaveLength(5);
    expect(example.getByText(/^30\s€/)).toBeInTheDocument();
  });

  it('shows the steps of the free mockup instead of a case study', async () => {
    const { getByRole, getByText, queryByRole } = await renderPage('fr');

    expect(getByText('Vous décidez ensuite')).toBeInTheDocument();
    expect(queryByRole('region', { name: /Réalisations|déjà/ })).not.toBeInTheDocument();
    expect(
      within(getByRole('region', { name: 'Pour aller plus loin.' }))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['/pricing', '/services']);
    expect(
      within(getByRole('region', { name: 'Demandez la maquette de votre site.' })).getByRole('link')
    ).toHaveAttribute('href', '/free-mockup');
  });

  it('answers with a 404 in the other languages', async () => {
    await expect(WebsiteForTradespeople(params('es'))).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(generateMetadata(params('de-CH'))).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('declares the service with its starting price', async () => {
    const { container } = await renderPage('fr');
    const service = JSON.parse(container.querySelector('#service-json-ld')?.textContent ?? '{}') as Record<
      string,
      unknown
    >;

    expect(service).toMatchObject({
      '@id': 'https://www.gocosmic.dev/fr/site-internet-artisan#service',
      name: 'Site pour artisans',
      offers: { price: 10, priceCurrency: 'EUR' },
    });
  });

  it.each(['fr', 'fr-CH'])('fits its title and description in search results, in %s', async (locale) => {
    const { title, description } = await generateMetadata(params(locale));

    expect((title as string).length).toBeLessThanOrEqual(60);
    expect(description?.length).toBeLessThanOrEqual(160);
    expect(title).not.toMatch(/Genève|Annecy/);
  });
});

import { createTranslator, NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import ShowcaseWebsite, { generateMetadata } from '@/app/[locale]/showcase-website/page';

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
  const page = await ShowcaseWebsite(params(locale));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={FRENCH_MESSAGES}>
      {children}
    </NextIntlClientProvider>
  );
  return render(page, { wrapper });
};

describe('showcase website page', () => {
  it('opens under Services in the breadcrumb, with a title free of any town', async () => {
    const { getByRole } = await renderPage('fr');
    const breadcrumb = getByRole('navigation', { name: "Fil d'Ariane" });

    expect(within(breadcrumb).getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(within(breadcrumb).getByText('Création de site vitrine')).toHaveAttribute('aria-current', 'page');
    expect(getByRole('heading', { level: 1 })).toHaveTextContent(
      "Création de site vitrine, pour qu'on vous trouve près de chez vous."
    );
    expect(getByRole('heading', { level: 1 }).textContent).not.toMatch(/Genève|Annecy/);
  });

  it('quotes the starting prices of both plans in the currency of the version', async () => {
    const french = await renderPage('fr');
    expect(french.getByText(/dès 10\s€ par mois.*dès 20\s€ par mois/)).toBeInTheDocument();
    french.unmount();

    const swiss = await renderPage('fr-CH');
    expect(swiss.getByText(/dès 10\sCHF par mois.*dès 20\sCHF par mois/)).toBeInTheDocument();
  });

  it('lists what is included and the useful options, and leads to the simulator for the price', async () => {
    const { getByRole, getByText } = await renderPage('fr');

    expect(getByRole('heading', { level: 3, name: 'Compris dans les deux formules' })).toBeInTheDocument();
    expect(getByText('Une modification de vos contenus par an')).toBeInTheDocument();
    expect(getByText('La prise de rendez-vous en ligne')).toBeInTheDocument();
    expect(getByText('Votre site en anglais')).toBeInTheDocument();
    expect(getByRole('link', { name: 'Calculer mon prix' })).toHaveAttribute('href', '/pricing');
    expect(getByText(/^Ces prix sont indicatifs : le prix définitif figure dans le devis/)).toBeInTheDocument();
  });

  it('gives the delays and who owns what', async () => {
    const { getByText } = await renderPage('fr');

    expect(getByText(/^Comptez deux à trois semaines pour une page vitrine/)).toBeInTheDocument();
    expect(getByText(/Le code du site vous est cédé après 36 mois d'abonnement\.$/)).toBeInTheDocument();
  });

  it('backs the page with the choir mockup and mcomper.at, then links the pricing and projects pages and the free mockup', async () => {
    const { getByRole } = await renderPage('fr');
    const projects = getByRole('region', { name: 'Ce que nous avons déjà conçu.' });

    expect(
      within(projects)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    ).toEqual(['Chœur des Pays du Mont Blanc', 'mcomper.at']);
    expect(
      within(getByRole('region', { name: 'Pour aller plus loin.' }))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['/pricing', '/projects']);
    expect(
      within(getByRole('region', { name: 'Voyez votre site avant de décider.' })).getByRole('link')
    ).toHaveAttribute('href', '/free-mockup');
  });

  it('declares the service with its starting price', async () => {
    const { container } = await renderPage('fr');
    const service = JSON.parse(container.querySelector('#service-json-ld')?.textContent ?? '{}') as Record<
      string,
      unknown
    >;

    expect(service).toMatchObject({
      '@id': 'https://www.gocosmic.dev/fr/creation-site-vitrine#service',
      name: 'Création de site vitrine',
      offers: { price: 10, priceCurrency: 'EUR' },
    });
  });

  it('answers with a 404 in the other languages, for the page and its metadata', async () => {
    await expect(ShowcaseWebsite(params('en'))).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(generateMetadata(params('de-CH'))).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it.each(['fr', 'fr-CH'])('fits its title and description in search results, in %s', async (locale) => {
    const { title, description, alternates } = await generateMetadata(params(locale));

    expect(typeof title).toBe('string');
    expect((title as string).length).toBeLessThanOrEqual(60);
    expect(description?.length).toBeLessThanOrEqual(160);
    expect(title).not.toMatch(/Genève|Annecy/);
    expect(Object.keys(alternates?.languages ?? {})).toEqual(['fr', 'fr-CH', 'x-default']);
  });
});

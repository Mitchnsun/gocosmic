import { createTranslator, NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import WebsiteForAssociations, { generateMetadata } from '@/app/[locale]/website-for-associations/page';

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
  const page = await WebsiteForAssociations(params(locale));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={FRENCH_MESSAGES}>
      {children}
    </NextIntlClientProvider>
  );
  return render(page, { wrapper });
};

describe('page for associations and clubs', () => {
  it('opens under Services in the breadcrumb, with a title free of any town', async () => {
    const { getByRole } = await renderPage('fr');
    const breadcrumb = getByRole('navigation', { name: "Fil d'Ariane" });

    expect(within(breadcrumb).getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(within(breadcrumb).getByText('Associations et clubs')).toHaveAttribute('aria-current', 'page');
    expect(getByRole('heading', { level: 1 }).textContent).not.toMatch(/Genève|Annecy/);
  });

  it('lists the needs of an association and the features it can add, membership on quote', async () => {
    const { getByText } = await renderPage('fr');

    expect(
      getByText('Les horaires des répétitions ou des entraînements, et comment vous rejoindre')
    ).toBeInTheDocument();
    expect(getByText('« Vous gardez la main »')).toBeInTheDocument();
    expect(getByText(/^Pour un espace adhérents ou la gestion des adhésions en ligne/)).toBeInTheDocument();
  });

  it('prices its example with the simulator, in the currency of the version', async () => {
    const french = await renderPage('fr');
    const example = within(french.getByRole('region', { name: "Le site d'une association, aux prix d'aujourd'hui." }));
    // Prices are formatted by `Intl`, with a non-breaking space before the currency.
    expect(example.getAllByRole('listitem').map((item) => item.textContent.replace(/\s/g, ' '))).toEqual([
      'Vous gardez la main20 €',
      '2 à 4 pages+5 €',
      'Gestion de votre nom de domaine+5 €',
    ]);
    expect(example.getByText(/^30\s€/)).toBeInTheDocument();
    french.unmount();

    const swiss = await renderPage('fr-CH');
    expect(swiss.getByText(/^30\sCHF/)).toBeInTheDocument();
  });

  it('answers the questions of a board, with the starting price and who updates the site', async () => {
    const { getByText } = await renderPage('fr');

    expect(getByText('Notre budget est serré : est-ce pour nous ?')).toBeInTheDocument();
    expect(getByText(/un site d'une page commence à 10\s€ par mois/)).toBeInTheDocument();
    expect(getByText(/Aujourd'hui, c'est Matthieu qui met à jour tous les sites du studio/)).toBeInTheDocument();
    expect(getByText(/^Il suffit de nous envoyer un e-mail, et partir n'entraîne aucune pénalité/)).toBeInTheDocument();
  });

  it('backs the page with the choir and the club, then links the projects and pricing pages and the free mockup', async () => {
    const { getByRole } = await renderPage('fr');
    const projects = getByRole('region', { name: 'Ce que nous avons conçu pour un chœur et pour un club.' });

    expect(
      within(projects)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    ).toEqual(['Chœur des Pays du Mont Blanc', 'PSC Supersprint']);
    expect(
      within(getByRole('region', { name: 'Pour aller plus loin.' }))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['/projects', '/pricing']);
    expect(
      within(getByRole('region', { name: 'Voyez le site de votre association avant de décider.' })).getByRole('link')
    ).toHaveAttribute('href', '/free-mockup');
  });

  it('answers with a 404 in the other languages, for the page and its metadata', async () => {
    await expect(WebsiteForAssociations(params('de'))).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(generateMetadata(params('en-CH'))).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('declares no service of its own: it is about an audience, not a service', async () => {
    const { container } = await renderPage('fr');

    expect(container.querySelector('#service-json-ld')).toBeNull();
  });

  it.each(['fr', 'fr-CH'])('fits its title and description in search results, in %s', async (locale) => {
    const { title, description } = await generateMetadata(params(locale));

    expect((title as string).length).toBeLessThanOrEqual(60);
    expect(description?.length).toBeLessThanOrEqual(160);
    expect(title).not.toMatch(/Genève|Annecy/);
  });
});

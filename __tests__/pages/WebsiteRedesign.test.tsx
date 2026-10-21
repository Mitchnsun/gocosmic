import { createTranslator, NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import WebsiteRedesign, { generateMetadata } from '@/app/[locale]/website-redesign/page';

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
  default: ({
    headline,
    ctaText,
    ctaHref,
    note,
  }: {
    headline: string;
    ctaText: string;
    ctaHref: string;
    note: ReactNode;
  }) => (
    <section aria-label={headline}>
      <a href={ctaHref}>{ctaText}</a>
      {note}
    </section>
  ),
}));

const params = (locale: string) => ({ params: Promise.resolve({ locale }) });

const renderPage = async (locale: string) => {
  const page = await WebsiteRedesign(params(locale));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={FRENCH_MESSAGES}>
      {children}
    </NextIntlClientProvider>
  );
  return render(page, { wrapper });
};

describe('website redesign page', () => {
  it('opens under Services in the breadcrumb, with a title free of any town', async () => {
    const { getByRole } = await renderPage('fr');
    const breadcrumb = getByRole('navigation', { name: "Fil d'Ariane" });

    expect(within(breadcrumb).getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(within(breadcrumb).getByText('Refonte de site')).toHaveAttribute('aria-current', 'page');
    expect(getByRole('heading', { level: 1 })).toHaveTextContent(
      'Refonte de site internet, en partant de ce qui existe.'
    );
    expect(getByRole('heading', { level: 1 }).textContent).not.toMatch(/Genève|Annecy/);
  });

  it('starts with the free review, then gives both paths, the subscription priced in the currency of the version', async () => {
    const french = await renderPage('fr');
    expect(french.getByText("L'état des lieux")).toBeInTheDocument();
    expect(french.getByText("Le faire évoluer tel qu'il est")).toBeInTheDocument();
    expect(french.getByText(/^Un nouveau site dès 10\s€ par mois/)).toBeInTheDocument();
    expect(french.getByRole('link', { name: 'Voir les quatre façons de travailler avec nous' })).toHaveAttribute(
      'href',
      '/services#pricing'
    );
    french.unmount();

    const swiss = await renderPage('fr-CH');
    expect(swiss.getByText(/^Un nouveau site dès 10\sCHF par mois/)).toBeInTheDocument();
  });

  it('tells what leaving Wix or WordPress means, and dates its sources', async () => {
    const { getByRole, getByText } = await renderPage('fr');
    const sources = getByRole('region', { name: 'Sources' });

    expect(getByText(/^Il ne peut pas être hébergé ailleurs/)).toBeInTheDocument();
    expect(getByText(/^WordPress exporte vos articles/)).toBeInTheDocument();
    expect(getByText(/il peut faire l'objet d'un devis\.$/)).toBeInTheDocument();
    expect(
      within(sources)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual([
      'https://support.wix.com/en/article/exporting-or-embedding-your-wix-site-elsewhere',
      'https://support.wix.com/en/article/transferring-your-wix-domain-away-from-wix-2477749',
      'https://wordpress.org/documentation/article/tools-export-screen/',
      'https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes',
    ]);
    expect(within(sources).getByText('Consultées le 21 octobre 2026.')).toBeInTheDocument();
  });

  it("backs the page with Coach'n Pulse, then links the pricing and services pages and the free review", async () => {
    const { getByRole } = await renderPage('fr');
    const projects = getByRole('region', { name: 'Un site suivi depuis 2016, et refait en chemin.' });

    expect(within(projects).getByText(/Sa version 5\.0\.0, sortie en octobre 2026/)).toBeInTheDocument();
    expect(within(projects).getByRole('heading', { level: 3 })).toHaveTextContent("Coach'n Pulse");
    expect(
      within(getByRole('region', { name: 'Pour aller plus loin.' }))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['/pricing', '/services']);
    const cta = getByRole('region', { name: 'Commençons par un état des lieux.' });
    expect(within(cta).getByRole('link', { name: 'Demander mon état des lieux gratuit' })).toHaveAttribute(
      'href',
      '/contact'
    );
    expect(within(cta).getByRole('link', { name: 'maquette gratuite' })).toHaveAttribute('href', '/free-mockup');
  });

  it('declares the service, without a price', async () => {
    const { container } = await renderPage('fr');
    const service = JSON.parse(container.querySelector('#service-json-ld')?.textContent ?? '{}') as Record<
      string,
      unknown
    >;

    expect(service).toMatchObject({
      '@id': 'https://www.gocosmic.dev/fr/refonte-site-internet#service',
      name: 'Refonte de site internet',
    });
    expect(service.offers).toBeUndefined();
  });

  it('answers with a 404 in the other languages, for the page and its metadata', async () => {
    await expect(WebsiteRedesign(params('en'))).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(generateMetadata(params('it-CH'))).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it.each(['fr', 'fr-CH'])('fits its title and description in search results, in %s', async (locale) => {
    const { title, description, alternates } = await generateMetadata(params(locale));

    expect((title as string).length).toBeLessThanOrEqual(60);
    expect(description?.length).toBeLessThanOrEqual(160);
    expect(title).not.toMatch(/Genève|Annecy/);
    expect(Object.keys(alternates?.languages ?? {})).toEqual(['fr', 'fr-CH', 'x-default']);
  });
});

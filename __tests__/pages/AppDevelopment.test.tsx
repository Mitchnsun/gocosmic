import { createTranslator, NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import AppDevelopment, { generateMetadata } from '@/app/[locale]/app-development/page';

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

const renderPage = async (locale = 'fr') => {
  const page = await AppDevelopment(params(locale));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={FRENCH_MESSAGES}>
      {children}
    </NextIntlClientProvider>
  );
  return render(page, { wrapper });
};

describe('app development page', () => {
  it('opens under Services in the breadcrumb', async () => {
    const { getByRole } = await renderPage();
    const breadcrumb = getByRole('navigation', { name: "Fil d'Ariane" });

    expect(within(breadcrumb).getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(within(breadcrumb).getByText("Création d'application")).toHaveAttribute('aria-current', 'page');
    expect(getByRole('heading', { level: 1 })).toHaveTextContent(
      "Création d'application, sur téléphone ou sur le web."
    );
  });

  it('describes what the studio builds, how a quoted project runs and the day-rate guidance, without a price', async () => {
    const { getByRole, getByText, queryByText } = await renderPage('fr-CH');

    expect(
      getByRole('list', { name: 'Une application pour votre équipe, vos clients ou vos membres.' })
    ).toBeInTheDocument();
    expect(getByText('Un paiement en plusieurs fois, à chaque étape du projet')).toBeInTheDocument();
    expect(getByText(/^Le code et les données vous appartiennent une fois l'application livrée/)).toBeInTheDocument();
    expect(getByText('Un·e designer partenaire, qui travaille aux côtés du développeur')).toBeInTheDocument();
    expect(queryByText(/€|CHF/)).not.toBeInTheDocument();
  });

  it('shows Daily Fortune and PSC Supersprint, links the projects and services pages and ends on a quote request', async () => {
    const { getByRole } = await renderPage();
    const projects = getByRole('region', { name: 'Deux applications déjà en ligne.' });

    expect(
      within(projects)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    ).toEqual(['Daily Fortune', 'PSC Supersprint']);
    expect(
      within(getByRole('region', { name: 'Pour aller plus loin.' }))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['/projects', '/services']);
    expect(within(getByRole('region', { name: 'Parlons de votre application.' })).getByRole('link')).toHaveAttribute(
      'href',
      '/contact'
    );
  });

  it('declares the service without an offer, since it is quoted', async () => {
    const { container } = await renderPage();
    const service = JSON.parse(container.querySelector('#service-json-ld')?.textContent ?? '{}') as Record<
      string,
      unknown
    >;

    expect(service).toMatchObject({
      '@id': 'https://www.gocosmic.dev/fr/creation-application#service',
      name: "Création d'application",
    });
    expect(service.offers).toBeUndefined();
  });

  it('answers with a 404 in the other languages, for the page and its metadata', async () => {
    await expect(AppDevelopment(params('it'))).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(generateMetadata(params('en-CH'))).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('fits its title and description in search results', async () => {
    const { title, description, alternates } = await generateMetadata(params('fr'));

    expect(typeof title).toBe('string');
    expect((title as string).length).toBeLessThanOrEqual(60);
    expect(description?.length).toBeLessThanOrEqual(160);
    expect(alternates?.canonical).toBe('https://www.gocosmic.dev/fr/creation-application');
  });
});

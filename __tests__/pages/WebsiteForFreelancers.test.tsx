import { createTranslator, NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import WebsiteForFreelancers, { generateMetadata } from '@/app/[locale]/website-for-freelancers/page';

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
  const page = await WebsiteForFreelancers(params(locale));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={FRENCH_MESSAGES}>
      {children}
    </NextIntlClientProvider>
  );
  return render(page, { wrapper });
};

describe('page for freelancers', () => {
  it('opens under Services in the breadcrumb, naming the trades in both forms', async () => {
    const { getByRole, getByText } = await renderPage('fr');
    const breadcrumb = getByRole('navigation', { name: "Fil d'Ariane" });

    expect(within(breadcrumb).getByText('Indépendants')).toHaveAttribute('aria-current', 'page');
    expect(getByText(/^Thérapeute, consultant·e, photographe, architecte…/)).toBeInTheDocument();
    expect(getByRole('heading', { level: 1 }).textContent).not.toMatch(/Genève|Annecy/);
  });

  it('flags the professions that regulate their communication, and starts from the included page', async () => {
    const { getByText } = await renderPage('fr');

    expect(getByText(/^Si votre profession encadre sa communication, dites-le nous/)).toBeInTheDocument();
    expect(getByText(/^Vous commencez avec la page vitrine comprise, dès 10\s€ par mois/)).toBeInTheDocument();
    expect(getByText("Les options sans engagement d'un an se retirent avec un mois de préavis")).toBeInTheDocument();
  });

  it('gives the email example on the domain of the version', async () => {
    const french = await renderPage('fr');
    expect(
      french.getByText("Par exemple contact@mon-entreprise.fr, au lieu d'une adresse gratuite.")
    ).toBeInTheDocument();
    french.unmount();

    const swiss = await renderPage('fr-CH');
    expect(
      swiss.getByText("Par exemple contact@mon-entreprise.ch, au lieu d'une adresse gratuite.")
    ).toBeInTheDocument();
    expect(swiss.getByText(/^25\sCHF/)).toBeInTheDocument();
  });

  it('backs the page with mcomper.at, then links the projects and pricing pages and the free mockup', async () => {
    const { getByRole } = await renderPage('fr');
    const projects = getByRole('region', { name: 'Un CV en ligne, en deux langues.' });

    expect(within(projects).getByText(/^mcomper\.at est un projet personnel/)).toBeInTheDocument();
    expect(
      within(getByRole('region', { name: 'Pour aller plus loin.' }))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['/projects', '/pricing']);
    expect(
      within(getByRole('region', { name: 'Voyez votre site avant de décider.' })).getByRole('link')
    ).toHaveAttribute('href', '/free-mockup');
  });

  it('answers with a 404 in the other languages', async () => {
    await expect(WebsiteForFreelancers(params('it'))).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(generateMetadata(params('es-CH'))).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it.each(['fr', 'fr-CH'])('fits its title and description in search results, in %s', async (locale) => {
    const { title, description } = await generateMetadata(params(locale));

    expect((title as string).length).toBeLessThanOrEqual(60);
    expect(description?.length).toBeLessThanOrEqual(160);
    expect(title).not.toMatch(/Genève|Annecy/);
  });
});

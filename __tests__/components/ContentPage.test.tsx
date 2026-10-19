import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import type { BreadcrumbItem } from '@/components/Breadcrumb';
import { ContentPage, ContentPageProjects } from '@/components/ContentPage';
import { buildProjectCards } from '@/components/ProjectGrid';

import { FRENCH_MESSAGES } from '../french-messages';
import { render, within } from '../test-utils';

const ctaMock = vi.fn((props: { headline: string; ctaText: string; ctaHref: string; tone?: string }) => (
  <section aria-label={props.headline}>
    <a href={props.ctaHref}>{props.ctaText}</a>
  </section>
));
vi.mock('@/components/CTAFinal', () => ({ default: (props: never) => ctaMock(props) }));

const BREADCRUMB: BreadcrumbItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Showcase website', href: '/pricing' },
];

const PAGE = {
  breadcrumb: BREADCRUMB,
  eyebrow: '[ Showcase website ]',
  title: (
    <>
      A showcase website, <em>found near you.</em>
    </>
  ),
  lead: 'What it shows, what it costs.',
  related: ['pricing', 'projects'] as const,
  cta: { headline: 'Get your mockup.', description: 'Free.', button: 'Ask for it', href: '/free-mockup' as const },
};

// The related pages read the messages of the pages published in French only.
const wrapper = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale="fr" messages={FRENCH_MESSAGES}>
    {children}
  </NextIntlClientProvider>
);

const renderPage = () =>
  render(
    <ContentPage {...PAGE}>
      <section aria-labelledby="included">
        <h2 id="included">Included</h2>
      </section>
    </ContentPage>,
    { wrapper }
  );

describe('ContentPage', () => {
  beforeEach(() => {
    ctaMock.mockClear();
  });

  it('opens with the breadcrumb, then the eyebrow, the title and the standfirst', () => {
    const { getByRole, getByText } = renderPage();

    expect(getByRole('navigation', { name: "Fil d'Ariane" })).toBeInTheDocument();
    expect(getByText('Showcase website', { selector: '[aria-current="page"]' })).toBeInTheDocument();
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('A showcase website, found near you.');
    expect(getByText('[ Showcase website ]')).toBeInTheDocument();
    expect(getByText('What it shows, what it costs.')).toBeInTheDocument();
  });

  it('renders its sections, then links the two related pages with a sentence each', () => {
    const { getByRole } = renderPage();
    const related = getByRole('region', { name: 'Pour aller plus loin.' });

    expect(getByRole('heading', { level: 2, name: 'Included' })).toBeInTheDocument();
    expect(within(related).getByRole('link', { name: /^Tarifs.*option par option\.$/ })).toHaveAttribute(
      'href',
      '/pricing'
    );
    expect(
      within(related)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['/pricing', '/projects']);
  });

  it('links the services page when the page relates to it', () => {
    const { getByRole } = render(
      <ContentPage {...PAGE} related={['projects', 'services']}>
        <p>Body</p>
      </ContentPage>,
      { wrapper }
    );

    expect(
      within(getByRole('region', { name: 'Pour aller plus loin.' })).getByRole('link', { name: /^Services/ })
    ).toHaveAttribute('href', '/services');
  });

  it('closes with a sober call to action', () => {
    const { getByRole } = renderPage();

    expect(within(getByRole('region', { name: 'Get your mockup.' })).getByRole('link')).toHaveAttribute(
      'href',
      '/free-mockup'
    );
    expect(ctaMock).toHaveBeenCalledWith(expect.objectContaining({ tone: 'sober', ctaText: 'Ask for it' }));
  });
});

describe('ContentPageProjects', () => {
  it('shows the case studies backing the page, each linking to its page', () => {
    // Keys stand in for the copy: the card only needs a title and a link here.
    const t = Object.assign((key: string) => key, { raw: () => [] });
    const cards = buildProjectCards(t).filter((card) => card.slug === 'mcomperat');
    const { getByRole } = render(
      <ContentPageProjects id="proof" eyebrow="[ Work ]" title="Already online" lead="Two sites." projects={cards} />
    );
    const section = getByRole('region', { name: 'Already online' });

    expect(section).toHaveAttribute('id', 'proof');
    expect(within(section).getByText('Two sites.')).toBeInTheDocument();
    expect(within(section).getAllByRole('link')[0]).toHaveAttribute('href', '/projects/mcomperat');
  });
});

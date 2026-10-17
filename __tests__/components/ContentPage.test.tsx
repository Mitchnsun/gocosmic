import { vi } from 'vitest';

import type { BreadcrumbItem } from '@/components/Breadcrumb';
import { ContentPage, ContentPageProjects, type RelatedPage } from '@/components/ContentPage';
import { buildProjectCards } from '@/components/ProjectGrid';

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
const RELATED_PAGES: RelatedPage[] = [
  { title: 'Pricing', description: 'Calculate your price.', href: '/pricing' },
  { title: 'Projects', description: 'What we put online.', href: '/projects' },
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
  related: { eyebrow: '[ Related pages ]', title: 'Read on.', pages: RELATED_PAGES },
  cta: { headline: 'Get your mockup.', description: 'Free.', button: 'Ask for it', href: '/free-mockup' as const },
};

const renderPage = () =>
  render(
    <ContentPage {...PAGE}>
      <section aria-labelledby="included">
        <h2 id="included">Included</h2>
      </section>
    </ContentPage>
  );

describe('ContentPage', () => {
  beforeEach(() => {
    ctaMock.mockClear();
  });

  it('opens with the breadcrumb, then the eyebrow, the title and the standfirst', () => {
    const { getByRole, getByText } = renderPage();

    expect(getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(getByText('Showcase website', { selector: '[aria-current="page"]' })).toBeInTheDocument();
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('A showcase website, found near you.');
    expect(getByText('[ Showcase website ]')).toBeInTheDocument();
    expect(getByText('What it shows, what it costs.')).toBeInTheDocument();
  });

  it('renders its sections, then links two related pages with a sentence each', () => {
    const { getByRole } = renderPage();
    const related = getByRole('region', { name: 'Read on.' });

    expect(getByRole('heading', { level: 2, name: 'Included' })).toBeInTheDocument();
    expect(within(related).getByRole('link', { name: /Pricing.*Calculate your price\./ })).toHaveAttribute(
      'href',
      '/pricing'
    );
    expect(within(related).getAllByRole('link')).toHaveLength(2);
    expect(within(related).getByRole('list')).toHaveClass('md:grid-cols-2');
  });

  it('lays three related pages out on three columns', () => {
    const pages: RelatedPage[] = [
      ...RELATED_PAGES,
      { title: 'Contact', description: 'Write to us.', href: '/contact' },
    ];
    const { getByRole } = render(
      <ContentPage {...PAGE} related={{ ...PAGE.related, pages }}>
        <p>Body</p>
      </ContentPage>
    );

    expect(within(getByRole('region', { name: 'Read on.' })).getByRole('list')).toHaveClass('md:grid-cols-3');
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

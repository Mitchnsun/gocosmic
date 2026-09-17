import { describe, expect, it } from 'vitest';

import PageHero from '@/components/PageHero';

import { render } from '../test-utils';

describe('PageHero', () => {
  it('renders the eyebrow, headline and lead', () => {
    const { getByRole, getByText } = render(
      <PageHero eyebrow="About — Studio" title="About Go Cosmic" lead="Our mission" />
    );

    expect(getByText('About — Studio')).toBeInTheDocument();
    expect(getByRole('heading', { level: 1, name: 'About Go Cosmic' })).toHaveAttribute('id', 'page-hero-heading');
    expect(getByText('Our mission')).toBeInTheDocument();
    expect(getByRole('region', { name: 'About Go Cosmic' })).toBeInTheDocument();
  });

  it('renders both calls-to-action', () => {
    const { getByRole } = render(
      <PageHero
        id="services-hero"
        eyebrow="Services"
        title="Our services"
        cta={{ text: 'Contact us', href: '/contact' }}
        secondaryCta={{ text: 'See pricing', href: '/pricing' }}
      />
    );

    expect(getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '/contact');
    expect(getByRole('link', { name: 'See pricing' })).toHaveAttribute('href', '/pricing');
  });

  it('renders the HUD metadata', () => {
    const { getAllByRole } = render(
      <PageHero eyebrow="Projects" title="Our projects" meta={['04 case studies', '2026']} />
    );

    expect(getAllByRole('listitem')).toHaveLength(2);
  });

  it('accepts the medium starfield density and the ghost accent', () => {
    const { getByRole } = render(
      <PageHero eyebrow="Contact" title="Contact us" accent="ghost" starfieldDensity="medium" />
    );

    expect(getByRole('heading', { level: 1, name: 'Contact us' })).toBeInTheDocument();
  });

  it('flags reduced motion on the section', () => {
    const { getByRole } = render(<PageHero eyebrow="About" title="About" respectReducedMotion={false} />);

    expect(getByRole('region', { name: 'About' })).toHaveAttribute('data-reduced-motion', 'false');
  });
});

import { afterEach, describe, expect, it } from 'vitest';

import { CaseStudy } from '@/components/CaseStudy';
import { THEME_STORAGE_KEY, ThemeProvider } from '@/components/Theme';

import { render } from '../../test-utils';

const baseProps = {
  eyebrow: 'Case study',
  title: 'Daily Fortune',
  tagline: 'Your daily dose of inspiration',
  sections: [
    { id: 'overview', title: 'Overview', content: 'What the project is.', secondary: 'Why we built it.' },
    {
      id: 'features',
      title: 'Key features',
      pointsLabel: 'Highlights',
      points: ['Daily fortunes', 'Smooth animations'],
      columns: 2 as const,
    },
  ],
};

describe('CaseStudy', () => {
  afterEach(() => localStorage.clear());

  it('renders the hero, every section and the HUD metadata', () => {
    const { getByRole, getByText, getAllByRole } = render(<CaseStudy {...baseProps} meta={['2026', 'Mobile']} />);

    expect(getByRole('heading', { level: 1, name: 'Daily Fortune' })).toBeInTheDocument();
    expect(getByText('Your daily dose of inspiration')).toBeInTheDocument();
    expect(getByRole('heading', { level: 2, name: 'Overview' })).toBeInTheDocument();
    expect(getByRole('heading', { level: 2, name: 'Key features' })).toBeInTheDocument();
    expect(getByText('Why we built it.')).toBeInTheDocument();
    expect(getByText('01 / 02')).toBeInTheDocument();
    expect(getByText('Highlights')).toBeInTheDocument();
    expect(getAllByRole('listitem').length).toBeGreaterThanOrEqual(4);
  });

  it('follows the theme: stars hidden in CSS from the first paint, sunrise ready for the light theme', () => {
    const { container, getByRole } = render(<CaseStudy {...baseProps} />);

    expect(getByRole('heading', { level: 1 }).closest('section')).not.toHaveAttribute('data-theme');
    expect(container.querySelector('canvas')?.parentElement).toHaveClass('light:hidden');
    expect(container.querySelector('.sun-glow')).toHaveClass('hidden', 'light:block');
  });

  it('draws no stars in the light theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const { container } = render(
      <ThemeProvider>
        <CaseStudy {...baseProps} />
      </ThemeProvider>
    );

    expect(container.querySelector('canvas')).not.toBeInTheDocument();
  });

  it('keeps a hero with a project image a dark island in both themes', () => {
    const { getByRole } = render(
      <CaseStudy {...baseProps} heroImage={{ src: '/projects/daily-fortune/hero.jpg', alt: 'Screenshot' }} />
    );

    expect(getByRole('heading', { level: 1 }).closest('section')).toHaveAttribute('data-theme', 'dark');
  });

  it('renders the hero image and the logo when provided', () => {
    const { getByAltText } = render(
      <CaseStudy
        {...baseProps}
        heroImage={{ src: '/projects/daily-fortune/hero.jpg', alt: 'Daily Fortune screenshot' }}
        logo={{ src: '/projects/daily-fortune/app-icon.png', alt: 'Daily Fortune icon' }}
      />
    );

    expect(getByAltText('Daily Fortune screenshot')).toBeInTheDocument();
    expect(getByAltText('Daily Fortune icon')).toBeInTheDocument();
  });

  it('paints a fixed brand background behind the logo when given', () => {
    const { getByAltText } = render(
      <CaseStudy {...baseProps} logo={{ src: '/logo.png', alt: 'White logo', background: '#1E2952' }} />
    );
    expect(getByAltText('White logo')).toHaveStyle({ backgroundColor: '#1E2952' });
  });

  it('links the call-to-action to the live project', () => {
    const { getByRole } = render(
      <CaseStudy
        {...baseProps}
        cta={{
          title: 'Explore the app',
          description: 'See it live.',
          button: 'Visit the website',
          href: 'https://example.com/',
          ariaLabel: 'Visit the website (opens in a new tab)',
        }}
        contactCta={{ label: 'Discuss a similar project', href: '/contact' }}
      />
    );

    const link = getByRole('link', { name: 'Visit the website (opens in a new tab)' });
    expect(link).toHaveAttribute('href', 'https://example.com/');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(getByRole('link', { name: 'Discuss a similar project' })).toHaveAttribute('href', '/contact');
  });

  it('disables the call-to-action when the project is not public yet', () => {
    const { getByRole } = render(
      <CaseStudy
        {...baseProps}
        cta={{ title: 'Coming soon', description: 'Not released yet.', button: 'Download the app' }}
      />
    );

    expect(getByRole('button', { name: 'Download the app' })).toBeDisabled();
  });

  it('renders the previous and next links', () => {
    const { getByRole } = render(
      <CaseStudy
        {...baseProps}
        navigation={{
          previousLabel: 'Previous project',
          nextLabel: 'Next project',
          ariaLabel: 'Case study navigation',
          previous: { href: '/projects/mcomperat', title: 'mcomper.at' },
          next: { href: '/projects/psc-supersprint', title: 'PSC Supersprint' },
        }}
      />
    );

    const nav = getByRole('navigation', { name: 'Case study navigation' });
    expect(nav).toBeInTheDocument();
    expect(getByRole('link', { name: /mcomper\.at/ })).toHaveAttribute('href', '/projects/mcomperat');
    expect(getByRole('link', { name: /PSC Supersprint/ })).toHaveAttribute('href', '/projects/psc-supersprint');
  });

  it('renders nothing for an empty navigation', () => {
    const { queryByRole } = render(
      <CaseStudy
        {...baseProps}
        navigation={{ previousLabel: 'Previous', nextLabel: 'Next', ariaLabel: 'Case study navigation' }}
      />
    );

    expect(queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders extra children after the sections', () => {
    const { getByTestId } = render(
      <CaseStudy {...baseProps} accent="ghost">
        <p data-testid="extra">Extra content</p>
      </CaseStudy>
    );

    expect(getByTestId('extra')).toBeInTheDocument();
  });
});

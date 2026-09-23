import { within } from '@testing-library/react';

import { CookieConsentProvider } from '@/components/CookieConsent';
import { Footer } from '@/components/Footer';

import { render } from '../test-utils';

const renderFooter = (region: 'fr' | 'ch' = 'fr') =>
  render(
    <CookieConsentProvider>
      <Footer region={region} />
    </CookieConsentProvider>
  );

describe('Footer Component', () => {
  it('renders the brand column with the baseline and the local line', () => {
    const { getByRole, getByText } = renderFooter();

    expect(getByRole('contentinfo')).toBeInTheDocument();
    expect(getByText('Cosmic Studio')).toHaveTextContent('Cosmic Studio.');
    expect(getByText(/^Web and mobile studio between Geneva and Annecy\./)).toBeInTheDocument();
    expect(getByRole('link', { name: 'Chêne-Bougeries · Annecy' })).toHaveAttribute('href', '/local');
    expect(getByText(/gocosmic\.dev ·/)).toBeInTheDocument();
  });

  it('claims the Geneva base for Swiss visitors', () => {
    const { getByText } = renderFooter('ch');
    expect(getByText(/^Web and mobile studio in Geneva\./)).toBeInTheDocument();
  });

  it('lists the studio pages, About included', () => {
    const { getByRole } = renderFooter();
    const nav = getByRole('navigation', { name: 'Studio' });

    expect(within(nav).getByRole('link', { name: 'Services & pricing' })).toHaveAttribute('href', '/services');
    expect(within(nav).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(within(nav).getByRole('link', { name: 'Our apps' })).toHaveAttribute('href', '/projects/daily-fortune');
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(within(nav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
  });

  it('groups the legal links and the cookie settings', () => {
    const { getByRole } = renderFooter();

    expect(getByRole('heading', { level: 2, name: 'Legal' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Legal notice' })).toHaveAttribute('href', '/legal-notice');
    expect(getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy');
    expect(getByRole('button', { name: 'Manage cookies' })).toHaveClass('font-display', 'no-underline');
  });

  it('shows the language pill with the current locale first and links to the others', () => {
    const { getByRole } = renderFooter();
    const languages = getByRole('navigation', { name: 'Switch Language' });
    const items = within(languages).getAllByRole('listitem');

    expect(items).toHaveLength(5);
    expect(items[0]).toHaveTextContent('English');
    expect(within(items[0]!).queryByRole('link')).not.toBeInTheDocument();

    const french = within(languages).getByRole('link', { name: 'Français (FR)' });
    expect(french).toHaveAttribute('hreflang', 'fr');
    expect(french).toHaveAttribute('lang', 'fr');
    expect(french).toHaveClass('h-11', 'min-w-11');
    ['Español (ES)', 'Deutsch (DE)', 'Italiano (IT)'].forEach((name) => {
      expect(within(languages).getByRole('link', { name })).toBeInTheDocument();
    });
  });

  it('renders the bottom bar with the copyright and the status line', () => {
    const year = new Date().getFullYear();
    const { getByText, queryByText } = renderFooter();

    expect(getByText(`© ${year} Cosmic Studio`)).toBeInTheDocument();
    expect(getByText('All systems nominal')).toBeInTheDocument();
    expect(queryByText(/Go Cosmic/)).not.toBeInTheDocument();
  });
});

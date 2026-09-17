import { CookieConsentProvider } from '@/components/CookieConsent';
import { Footer } from '@/components/Footer';

import { render } from '../test-utils';

describe('Footer Component', () => {
  it('should render the footer correctly', () => {
    const year = new Date().getFullYear();

    const { getByRole, getByText, getAllByRole, queryByText } = render(
      <CookieConsentProvider>
        <Footer region="fr" />
      </CookieConsentProvider>
    );

    expect(getByRole('contentinfo')).toBeInTheDocument();
    expect(queryByText(/Est\. 2024/i)).not.toBeInTheDocument();

    // Brand column
    expect(getByRole('heading', { name: /^Go Cosmic\s*\.$/ })).toBeInTheDocument();
    expect(getByText('A development & design studio building cosmic apps from the French Alps.')).toBeInTheDocument();

    // Studio navigation
    expect(getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(getAllByRole('link', { name: 'Offers' })[0]).toHaveAttribute('href', '/offers');
    expect(getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');

    // Offers column
    expect(getByText('Solo Cosmic Developer')).toBeInTheDocument();
    expect(getByText('Complete Cosmic Team')).toBeInTheDocument();
    expect(getByText('Developer + Designer Duo')).toBeInTheDocument();
    expect(getByRole('link', { name: 'Solo Cosmic Developer' })).toHaveAttribute('href', '/offers#solo-developer');
    expect(getByRole('link', { name: 'Developer + Designer Duo' })).toHaveAttribute(
      'href',
      '/offers#developer-designer'
    );
    expect(getByRole('link', { name: 'Complete Cosmic Team' })).toHaveAttribute('href', '/offers#team-developers');

    // Copyright
    expect(getByText(`© ${year} Go Cosmic. All systems nominal.`)).toBeInTheDocument();
    expect(
      getByText('Legal notice, privacy policy, and AI usage information are available online.')
    ).toBeInTheDocument();
    expect(getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy');
    expect(getByRole('link', { name: 'Legal notice' })).toHaveAttribute('href', '/legal-notice');
    expect(getByRole('link', { name: /web & mobile developer annecy \/ geneva/i })).toHaveAttribute('href', '/local');
  });

  it('should claim the Geneva base for Swiss visitors', () => {
    const { getByText } = render(
      <CookieConsentProvider>
        <Footer region="ch" />
      </CookieConsentProvider>
    );

    expect(
      getByText('A development & design studio building cosmic apps from Geneva and the Alps.')
    ).toBeInTheDocument();
  });
});

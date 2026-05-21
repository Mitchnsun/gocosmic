import { useTranslations } from 'next-intl';

import { ContactBanner } from '@/components/PricingSimulator/ContactBanner';

import { render, screen } from '../../test-utils';

function TestContactBanner() {
  const t = useTranslations('pricing');
  return <ContactBanner t={t} />;
}

describe('ContactBanner', () => {
  it('renders the contact title', () => {
    render(<TestContactBanner />);
    expect(screen.getByText("Let's discuss your project")).toBeInTheDocument();
  });

  it('renders the contact description', () => {
    render(<TestContactBanner />);
    expect(screen.getByText(/contact us to get a personalised quote/i)).toBeInTheDocument();
  });

  it('renders the email address', () => {
    render(<TestContactBanner />);
    expect(screen.getByText('prospect@gocosmic.dev')).toBeInTheDocument();
  });

  it('renders a mailto link with correct email and subject', () => {
    render(<TestContactBanner />);
    const link = screen.getByRole('link', { name: /send an email/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('mailto:prospect@gocosmic.dev'));
    expect(link).toHaveAttribute('href', expect.stringContaining('subject='));
  });

  it('renders the CTA button text', () => {
    render(<TestContactBanner />);
    expect(screen.getByText('Request a quote')).toBeInTheDocument();
  });
});

import { INITIAL_SELECTION } from '@/components/PricingSimulator/constants';
import { ContactBanner } from '@/components/PricingSimulator/ContactBanner';
import type { DecodedPlan } from '@/lib/pricing/plan-code';
import { PLAN_STORAGE_KEY } from '@/lib/pricing/plan-storage';

import { fireEvent, render, screen } from '../../test-utils';

const plan: DecodedPlan = {
  projectType: 'website',
  websiteType: 'showcase',
  selection: { ...INITIAL_SELECTION, addOns: { domain: true, swiss_hosting: false, email: false } },
  region: 'fr',
};

describe('ContactBanner', () => {
  it('renders the contact title', () => {
    render(<ContactBanner />);
    expect(screen.getByText("Let's discuss your project")).toBeInTheDocument();
  });

  it('renders the contact description', () => {
    render(<ContactBanner />);
    expect(screen.getByText(/write me a few lines/i)).toBeInTheDocument();
  });

  it('renders the email address', () => {
    render(<ContactBanner />);
    expect(screen.getByText('prospect@gocosmic.dev')).toBeInTheDocument();
  });

  it('renders a mailto link with correct email and subject', () => {
    render(<ContactBanner />);
    const link = screen.getByRole('link', { name: /send an email/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('mailto:prospect@gocosmic.dev'));
    expect(link).toHaveAttribute('href', expect.stringContaining('subject='));
  });

  it('renders the CTA button text', () => {
    render(<ContactBanner />);
    expect(screen.getByText('Request a quote')).toBeInTheDocument();
  });

  it('renders a link to the free mockup page', () => {
    render(<ContactBanner />);

    const link = screen.getByRole('link', { name: 'Go to the free mockup request page' });
    expect(link).toHaveAttribute('href', '/free-mockup');
    expect(link).toHaveTextContent('Get a free mockup');
  });

  it('renders the privacy notice link', () => {
    render(<ContactBanner />);

    expect(screen.getByText(/processed to prepare a quote/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy');
  });

  it('has no body on the mailto link without a simulation', () => {
    render(<ContactBanner />);

    expect(screen.getByRole('link', { name: /send an email/i }).getAttribute('href')).not.toContain('body=');
  });

  it('pre-fills the mailto body with the simulation summary', () => {
    render(<ContactBanner plan={plan} />);

    const href = screen.getByRole('link', { name: /send an email/i }).getAttribute('href') ?? '';
    const body = decodeURIComponent(href.split('&body=')[1] ?? '');
    expect(body).toContain('A website');
    expect(body).toContain('Managing your web address (+5€)');
    expect(body).toContain('15€');
  });

  it('stores the simulation for the free mockup page when the link is clicked', () => {
    window.sessionStorage.clear();
    render(<ContactBanner plan={plan} />);

    const link = screen.getByRole('link', { name: 'Go to the free mockup request page' });
    expect(link).toHaveAttribute('href', '/free-mockup');
    expect(window.sessionStorage.getItem(PLAN_STORAGE_KEY)).toBeNull();

    fireEvent.click(link);
    expect(window.sessionStorage.getItem(PLAN_STORAGE_KEY)).toBe('website~showcase~p0~u-~domain~fr');
  });

  it('stores nothing when there is no simulation', () => {
    window.sessionStorage.clear();
    render(<ContactBanner />);

    fireEvent.click(screen.getByRole('link', { name: 'Go to the free mockup request page' }));
    expect(window.sessionStorage.getItem(PLAN_STORAGE_KEY)).toBeNull();
  });
});

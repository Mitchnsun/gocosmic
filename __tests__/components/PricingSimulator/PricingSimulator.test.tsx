import { PricingSimulator } from '@/components/PricingSimulator/PricingSimulator';
import { decodePlanCode } from '@/lib/pricing/plan-code';
import { PLAN_STORAGE_KEY } from '@/lib/pricing/plan-storage';

import { fireEvent, render, screen, within } from '../../test-utils';

const total = () => screen.getByRole('status', { name: /your estimate/i });
const recap = () => screen.getByRole('complementary', { name: /your estimate/i });

describe('PricingSimulator', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('opens straight on the plan builder at the advertised base price', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByRole('heading', { level: 3, name: 'Base plan' })).toBeInTheDocument();
    expect(total()).toHaveTextContent('10€');
    expect(within(recap()).getAllByRole('listitem')).toHaveLength(1);
  });

  it('adds a ticked add-on to the total and to the itemised recap', () => {
    render(<PricingSimulator region="fr" />);

    fireEvent.click(screen.getByRole('checkbox', { name: /managing your domain name/i }));

    expect(total()).toHaveTextContent('15€');
    const lines = within(recap()).getAllByRole('listitem');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toHaveTextContent('+5€');
  });

  it('shows a .com domain example for non-Swiss visitors and .ch for Swiss ones', () => {
    const { unmount } = render(<PricingSimulator region="fr" />);
    expect(screen.getAllByText(/my-business\.com/)).toHaveLength(2);
    unmount();

    render(<PricingSimulator region="ch" />);
    expect(screen.getAllByText(/my-business\.ch/)).toHaveLength(2);
  });

  it('accumulates several add-ons', () => {
    render(<PricingSimulator region="fr" />);

    fireEvent.click(screen.getByRole('checkbox', { name: /managing your domain name/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /email address in your own name/i }));

    expect(total()).toHaveTextContent('25€');
  });

  it('raises the total and lists the page tier when the pages slider moves', () => {
    render(<PricingSimulator region="fr" />);

    const slider = screen.getByRole('slider', { name: /number of pages/i });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });

    expect(total()).toHaveTextContent('20€');
    expect(within(recap()).getByText('5 to 7 pages')).toBeInTheDocument();
  });

  it('leaves the update slider out of the total until its option is ticked', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByRole('slider', { name: /changes per year/i })).toHaveAttribute('data-disabled');
    expect(total()).toHaveTextContent('10€');

    fireEvent.click(screen.getByRole('checkbox', { name: /content changes included/i }));

    expect(screen.getByRole('slider', { name: /changes per year/i })).not.toHaveAttribute('data-disabled');
    expect(total()).toHaveTextContent('15€');
    expect(within(recap()).getByText('Content changes included')).toBeInTheDocument();
  });

  it('prices the chosen update frequency', () => {
    render(<PricingSimulator region="fr" />);
    fireEvent.click(screen.getByRole('checkbox', { name: /content changes included/i }));

    const slider = screen.getByRole('slider', { name: /changes per year/i });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });

    expect(total()).toHaveTextContent('60€');
  });

  it('invites a conversation once a slider hits its top position', () => {
    render(<PricingSimulator region="fr" />);
    expect(screen.queryByText(/beyond these volumes/i)).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('slider', { name: /number of pages/i }), { key: 'End' });

    expect(screen.getByText(/beyond these volumes/i)).toBeInTheDocument();
  });

  it('quotes the plan in francs for Swiss visitors', () => {
    render(<PricingSimulator region="ch" />);

    expect(total()).toHaveTextContent('10 CHF');
    expect(total()).not.toHaveTextContent('10€');
  });

  it('carries the composed plan to the free mockup request', () => {
    render(<PricingSimulator region="ch" />);
    fireEvent.click(screen.getByRole('checkbox', { name: /managing your domain name/i }));

    const cta = screen.getByRole('link', { name: 'Request my free mockup' });
    expect(cta).toHaveAttribute('href', '/free-mockup');
    fireEvent.click(cta);

    const plan = decodePlanCode(window.sessionStorage.getItem(PLAN_STORAGE_KEY));
    expect(plan).toMatchObject({ projectType: 'website', websiteType: 'showcase', region: 'ch' });
    expect(plan?.selection.addOns.domain).toBe(true);
  });

  it('offers a contact link for questions', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByRole('link', { name: 'Write to us' })).toHaveAttribute('href', '/contact');
  });
});

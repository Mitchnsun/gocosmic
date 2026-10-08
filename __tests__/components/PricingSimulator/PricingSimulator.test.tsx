import { PricingSimulator } from '@/components/PricingSimulator/PricingSimulator';
import { decodePlanCode } from '@/lib/pricing/plan-code';
import { PLAN_STORAGE_KEY } from '@/lib/pricing/plan-storage';

import { fireEvent, render, screen, within } from '../../test-utils';

const total = () => screen.getByRole('status', { name: /your estimate/i });
const recap = () => screen.getByRole('complementary', { name: /your estimate/i });
const tick = (name: RegExp | string) => fireEvent.click(screen.getByRole('checkbox', { name }));
/** Radix tabs switch on mouse down, not on click. */
const openTab = (name: string) => fireEvent.mouseDown(screen.getByRole('tab', { name }));

describe('PricingSimulator', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('opens on "We take care of everything" at the advertised base price', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByRole('tablist', { name: 'Choose your plan' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'We take care of everything' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 3, name: 'We take care of everything' })).toBeInTheDocument();
    expect(screen.getByText('Your legal notice and privacy policy')).toBeInTheDocument();
    expect(total()).toHaveTextContent('€10');
    expect(within(recap()).getAllByRole('listitem')).toHaveLength(1);
  });

  it('switches to "You stay in control", with its editing tool and news section included', () => {
    render(<PricingSimulator region="fr" />);
    tick(/a news section/i);
    expect(total()).toHaveTextContent('€15');

    openTab('You stay in control');

    expect(total()).toHaveTextContent('€20');
    expect(screen.getByText('An editing space for your news and opening hours')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /a news section/i })).not.toBeInTheDocument();
    expect(within(recap()).getByText('You stay in control')).toBeInTheDocument();

    openTab('We take care of everything');
    // The visitor's own choice comes back with the formula that charges it.
    expect(screen.getByRole('checkbox', { name: /a news section/i })).toBeChecked();
    expect(total()).toHaveTextContent('€15');
  });

  it('adds a ticked add-on to the total and to the itemised recap', () => {
    render(<PricingSimulator region="fr" />);

    tick(/managing your domain name/i);

    expect(total()).toHaveTextContent('€15');
    const lines = within(recap()).getAllByRole('listitem');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toHaveTextContent('+€5');
  });

  it('shows a .com domain example for non-Swiss visitors and .ch for Swiss ones', () => {
    const { unmount } = render(<PricingSimulator region="fr" />);
    expect(screen.getAllByText(/my-business\.com/)).toHaveLength(2);
    unmount();

    render(<PricingSimulator region="ch" />);
    expect(screen.getAllByText(/my-business\.ch/)).toHaveLength(2);
  });

  it('ticks the domain with the email address, then offers extra mailboxes and redirects', () => {
    render(<PricingSimulator region="fr" />);

    tick(/email address in your own name/i);

    expect(screen.getByRole('checkbox', { name: /managing your domain name/i })).toBeChecked();
    expect(screen.getByText(/uses your domain name/i)).toBeInTheDocument();
    expect(total()).toHaveTextContent('€30');

    fireEvent.click(screen.getByRole('button', { name: 'One more mailbox' }));
    fireEvent.click(screen.getByRole('button', { name: 'One more mailbox' }));
    tick('5 redirects');

    expect(screen.getByText('2 extra mailboxes', { selector: '[aria-live]' })).toBeInTheDocument();
    expect(total()).toHaveTextContent('€55');
    expect(within(recap()).getByText('2 extra mailboxes')).toBeInTheDocument();

    tick(/managing your domain name/i);

    expect(screen.getByRole('checkbox', { name: /email address in your own name/i })).not.toBeChecked();
    expect(screen.queryByRole('button', { name: 'One more mailbox' })).not.toBeInTheDocument();
    expect(total()).toHaveTextContent('€10');
  });

  it('stops the mailbox counter at its bounds and invites a conversation at the top', () => {
    render(<PricingSimulator region="fr" />);
    tick(/email address in your own name/i);

    const less = screen.getByRole('button', { name: 'One mailbox less' });
    expect(less).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(less);
    expect(total()).toHaveTextContent('€30');

    const more = screen.getByRole('button', { name: 'One more mailbox' });
    for (let i = 0; i < 6; i += 1) fireEvent.click(more);

    expect(more).toHaveAttribute('aria-disabled', 'true');
    expect(total()).toHaveTextContent('€80');
    expect(screen.getByText(/beyond these volumes/i)).toBeInTheDocument();
  });

  it('raises the total and lists the page tier when the pages slider moves', () => {
    render(<PricingSimulator region="fr" />);

    const slider = screen.getByRole('slider', { name: /number of pages/i });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });

    expect(total()).toHaveTextContent('€25');
    expect(within(recap()).getByText('5 to 7 pages')).toBeInTheDocument();
  });

  it('includes one change a year and leaves the update slider out until its option is ticked', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByText('Once a year (included)')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /changes per year/i })).toHaveAttribute('data-disabled');

    tick(/content changes included/i);

    expect(screen.getByRole('slider', { name: /changes per year/i })).not.toHaveAttribute('data-disabled');
    expect(total()).toHaveTextContent('€15');
    expect(within(recap()).getByText('Content changes included')).toBeInTheDocument();
  });

  it('prices the chosen update frequency', () => {
    render(<PricingSimulator region="fr" />);
    tick(/content changes included/i);

    const slider = screen.getByRole('slider', { name: /changes per year/i });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });

    expect(total()).toHaveTextContent('€70');
  });

  it('lifts and locks the update package to the rhythm of the AI-assisted articles', () => {
    render(<PricingSimulator region="fr" />);

    tick(/ai-assisted articles/i);

    const updates = screen.getByRole('checkbox', { name: /content changes included/i });
    expect(updates).toBeChecked();
    expect(updates).toBeDisabled();
    expect(screen.getByText(/we have adjusted your content changes/i)).toBeInTheDocument();
    // 10 base + 5 articles + 20 monthly updates
    expect(total()).toHaveTextContent('€35');

    fireEvent.keyDown(screen.getByRole('slider', { name: 'Rhythm' }), { key: 'ArrowRight' });
    // One a week: 15 articles + 60 weekly updates.
    expect(total()).toHaveTextContent('€85');

    tick(/ai-assisted articles/i);
    expect(screen.getByRole('checkbox', { name: /content changes included/i })).not.toBeChecked();
    expect(total()).toHaveTextContent('€10');
  });

  it('prices statistics by report rhythm, with an optional detailed measurement', () => {
    render(<PricingSimulator region="fr" />);
    expect(screen.getByRole('checkbox', { name: /visit statistics/i })).toHaveAccessibleDescription(/from \+€5/);

    tick(/visit statistics/i);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Report' }), { key: 'End' });
    tick(/detailed measurement/i);

    expect(total()).toHaveTextContent('€65');
    expect(within(recap()).getByText(/Every month/)).toBeInTheDocument();

    tick(/visit statistics/i);
    expect(screen.queryByRole('checkbox', { name: /detailed measurement/i })).not.toBeInTheDocument();
    expect(total()).toHaveTextContent('€10');
  });

  it('flags one-year commitments and explains options without ticking them', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByRole('checkbox', { name: /local search follow-up/i })).toHaveAccessibleDescription(
      /1-year commitment|from/
    );
    expect(screen.getAllByText('1-year commitment').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'More about: A contact form' }));

    expect(screen.getByRole('dialog', { name: 'A contact form' })).toHaveTextContent(/without this option/i);
    expect(screen.getByRole('checkbox', { name: /a contact form/i })).not.toBeChecked();
  });

  it('invites a conversation once a slider hits its top position', () => {
    render(<PricingSimulator region="fr" />);
    expect(screen.queryByText(/beyond these volumes/i)).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('slider', { name: /number of pages/i }), { key: 'End' });

    expect(screen.getByText(/beyond these volumes/i)).toBeInTheDocument();
  });

  it('quotes the plan in francs for Swiss visitors', () => {
    render(<PricingSimulator region="ch" />);

    expect(total()).toHaveTextContent('CHF 10');
    expect(total()).not.toHaveTextContent('€10');
  });

  it('carries the composed plan to the free mockup request', () => {
    render(<PricingSimulator region="ch" />);
    tick(/a news section/i);
    openTab('You stay in control');
    tick(/managing your domain name/i);

    const cta = screen.getByRole('link', { name: 'Request my free mockup' });
    expect(cta).toHaveAttribute('href', '/free-mockup');
    fireEvent.click(cta);

    const plan = decodePlanCode(window.sessionStorage.getItem(PLAN_STORAGE_KEY));
    expect(plan).toMatchObject({ projectType: 'website', websiteType: 'showcase', region: 'ch' });
    expect(plan?.selection.formula).toBe('self_service');
    expect(plan?.selection.addOns.domain).toBe(true);
    // Included in "You stay in control", so never charged on top.
    expect(plan?.selection.addOns.news).toBe(false);
  });

  it('offers a contact link for questions', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByRole('link', { name: 'Write to us' })).toHaveAttribute('href', '/contact');
  });
});

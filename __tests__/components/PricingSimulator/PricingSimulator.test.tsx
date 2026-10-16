import { PricingSimulator } from '@/components/PricingSimulator/PricingSimulator';
import { decodePlanCode } from '@/lib/pricing/plan-code';
import { PLAN_STORAGE_KEY } from '@/lib/pricing/plan-storage';

import { fireEvent, render, screen, within } from '../../test-utils';

const total = () => screen.getByRole('status', { name: /your estimate/i });
const recap = () => screen.getByRole('complementary', { name: /your estimate/i });
const tick = (name: RegExp | string) => fireEvent.click(screen.getByRole('checkbox', { name }));
const pick = (name: RegExp | string) => fireEvent.click(screen.getByRole('radio', { name }));
const openMoreOptions = () => fireEvent.click(screen.getByRole('button', { name: /more options/i }));
/** Answers "No" to the domain question: the studio manages one, and the email address can be ticked. */
const withoutDomain = () => pick('No, register one for me');

describe('PricingSimulator', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('opens on "We take care of everything" at the advertised base price, with no commitment', () => {
    render(<PricingSimulator region="fr" />);

    const plans = screen.getByRole('group', { name: 'Choose your plan' });
    expect(within(plans).getByRole('radio', { name: /we take care of everything · from €10 \/ month/i })).toBeChecked();
    expect(within(plans).getByRole('radio', { name: /you stay in control · from €20 \/ month/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'We take care of everything' })).toBeInTheDocument();
    expect(screen.getByText('Your legal notice and privacy policy')).toBeInTheDocument();
    expect(screen.getByText('The settings to be found on Google')).toBeInTheDocument();
    expect(total()).toHaveTextContent('€10');
    expect(within(recap()).getAllByRole('listitem')).toHaveLength(1);
    expect(within(recap()).getByText('No minimum term: cancel any month.')).toBeInTheDocument();
  });

  it('switches to "You stay in control", with its editing tool and news section included', () => {
    render(<PricingSimulator region="fr" />);
    tick(/news published for you/i);
    expect(total()).toHaveTextContent('€20');

    pick(/you stay in control/i);

    expect(total()).toHaveTextContent('€20');
    expect(screen.getByText('An editing space for your news and opening hours')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /news published for you/i })).not.toBeInTheDocument();
    expect(within(recap()).getByText('You stay in control')).toBeInTheDocument();
    expect(
      within(recap()).getByText(/12-month periods, as it includes: the “You stay in control” plan\./)
    ).toBeInTheDocument();

    pick(/we take care of everything/i);
    // The visitor's own choice comes back with the formula that charges it.
    expect(screen.getByRole('checkbox', { name: /news published for you/i })).toBeChecked();
    expect(total()).toHaveTextContent('€20');
  });

  it('prices the news by rhythm and lists it in the recap', () => {
    render(<PricingSimulator region="fr" />);
    tick(/news published for you/i);

    fireEvent.keyDown(screen.getByRole('slider', { name: 'Rhythm' }), { key: 'End' });

    expect(total()).toHaveTextContent('€110');
    expect(within(recap()).getByText('News published for you')).toBeInTheDocument();
    expect(within(recap()).getByText(/1 news item a week/)).toBeInTheDocument();
    expect(within(recap()).getByText(/as it includes: news published for you\./)).toBeInTheDocument();
  });

  it('asks about an existing domain name before offering the domain and the email address', () => {
    render(<PricingSimulator region="fr" />);
    const question = screen.getByRole('group', { name: 'Do you already have a domain name?' });

    expect(question).toHaveAccessibleDescription(/for example my-business\.com/);
    expect(screen.queryByRole('checkbox', { name: /managing your domain name/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /email address in your own name/i })).not.toBeInTheDocument();

    withoutDomain();

    const domain = screen.getByRole('checkbox', { name: /managing your domain name/i });
    expect(domain).toBeChecked();
    expect(domain).toBeDisabled();
    expect(domain).toHaveAccessibleDescription(/1-year commitment/);
    expect(total()).toHaveTextContent('€15');
    expect(within(recap()).getByText(/as it includes: domain name\./)).toBeInTheDocument();

    pick('Yes, I already have one');

    expect(screen.queryByRole('checkbox', { name: /managing your domain name/i })).not.toBeInTheDocument();
    expect(screen.getByText(/you keep your domain name and your current email addresses/i)).toBeInTheDocument();
    expect(total()).toHaveTextContent('€10');
  });

  it('shows a .com domain example for non-Swiss visitors and .ch for Swiss ones', () => {
    const { unmount } = render(<PricingSimulator region="fr" />);
    expect(screen.getByText(/for example my-business\.com/)).toBeInTheDocument();
    unmount();

    render(<PricingSimulator region="ch" />);
    expect(screen.getByText(/for example my-business\.ch/)).toBeInTheDocument();
  });

  it('offers extra mailboxes with the email address, and announces what unticking it removes', () => {
    render(<PricingSimulator region="fr" />);
    withoutDomain();

    tick(/email address in your own name/i);
    expect(total()).toHaveTextContent('€30');
    expect(within(recap()).getByText(/as it includes: domain name, email address\./)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'One more mailbox' }));
    fireEvent.click(screen.getByRole('button', { name: 'One more mailbox' }));
    expect(screen.getByText('2 extra mailboxes', { selector: '[aria-live]' })).toBeInTheDocument();
    expect(total()).toHaveTextContent('€50');
    expect(within(recap()).getByText('2 extra mailboxes')).toBeInTheDocument();

    tick(/email address in your own name/i);

    expect(screen.queryByRole('button', { name: 'One more mailbox' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Extra mailboxes and forwarding addresses removed along with the email address.')
    ).toBeInTheDocument();
    expect(total()).toHaveTextContent('€15');

    // The announcement only lasts until the next action.
    tick(/a contact form/i);
    expect(screen.queryByText(/removed along with the email address/)).not.toBeInTheDocument();
  });

  it('stops the mailbox counter at its bounds and invites a conversation at the top', () => {
    render(<PricingSimulator region="fr" />);
    withoutDomain();
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

  it('includes one change a year and says how to enable the rhythm slider', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByText('Once a year (included)')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /rhythm of changes/i })).toHaveAttribute('data-disabled');
    expect(screen.getByRole('slider', { name: /rhythm of changes/i })).toHaveAccessibleDescription(
      'Tick the box to choose a rhythm.'
    );

    tick(/changes to your pages/i);

    expect(screen.getByRole('slider', { name: /rhythm of changes/i })).not.toHaveAttribute('data-disabled');
    expect(screen.queryByText('Tick the box to choose a rhythm.')).not.toBeInTheDocument();
    expect(total()).toHaveTextContent('€15');
    expect(within(recap()).getByText('Changes to your pages')).toBeInTheDocument();
    // Changes can be stopped with a month's notice.
    expect(within(recap()).getByText('No minimum term: cancel any month.')).toBeInTheDocument();
  });

  it('prices the chosen update frequency', () => {
    render(<PricingSimulator region="fr" />);
    tick(/changes to your pages/i);

    const slider = screen.getByRole('slider', { name: /rhythm of changes/i });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });

    expect(total()).toHaveTextContent('€70');
  });

  it('folds the options for precise needs under "More options", counting the ticked ones', () => {
    render(<PricingSimulator region="fr" />);
    const toggle = screen.getByRole('button', { name: /more options/i });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('checkbox', { name: /visit statistics/i })).not.toBeInTheDocument();

    openMoreOptions();

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/options for specific needs/i)).not.toHaveTextContent(/switzerland/i);
    tick(/following your place on google/i);
    tick(/ai-assisted articles/i);

    expect(toggle).toHaveTextContent('2 ticked');
    expect(total()).toHaveTextContent('€25');

    // Closed again, the options stay in the recap.
    fireEvent.click(toggle);
    expect(screen.queryByRole('checkbox', { name: /ai-assisted articles/i })).not.toBeInTheDocument();
    expect(within(recap()).getByText('AI-assisted articles')).toBeInTheDocument();
  });

  it('prices statistics by report rhythm, and announces the detailed statistics removed with them', () => {
    render(<PricingSimulator region="fr" />);
    openMoreOptions();
    expect(screen.getByRole('checkbox', { name: /visit statistics/i })).toHaveAccessibleDescription(/from \+€5/);

    tick(/visit statistics/i);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Written report' }), { key: 'End' });
    tick(/detailed statistics/i);

    expect(total()).toHaveTextContent('€65');
    expect(within(recap()).getByText('Detailed statistics')).toBeInTheDocument();
    expect(within(recap()).getByText(/Every month/)).toBeInTheDocument();

    tick(/visit statistics/i);
    expect(screen.queryByRole('checkbox', { name: /detailed statistics/i })).not.toBeInTheDocument();
    expect(screen.getByText('Detailed statistics removed along with visit statistics.')).toBeInTheDocument();
    expect(total()).toHaveTextContent('€10');
  });

  it('offers forwarding addresses only with an email address', () => {
    render(<PricingSimulator region="fr" />);
    openMoreOptions();
    expect(screen.queryByRole('checkbox', { name: /forwarding addresses/i })).not.toBeInTheDocument();

    withoutDomain();
    tick(/email address in your own name/i);
    tick(/forwarding addresses/i);

    expect(total()).toHaveTextContent('€35');
  });

  it('keeps the articles apart from the content changes', () => {
    render(<PricingSimulator region="fr" />);
    openMoreOptions();

    tick(/ai-assisted articles/i);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Rhythm' }), { key: 'End' });

    const updates = screen.getByRole('checkbox', { name: /changes to your pages/i });
    expect(updates).not.toBeChecked();
    expect(updates).toBeEnabled();
    // 10 base + 250 for three articles a week, nothing else.
    expect(total()).toHaveTextContent('€260');
  });

  it('mentions the topic-picking service only for articles in "You stay in control"', () => {
    render(<PricingSimulator region="fr" />);
    openMoreOptions();
    fireEvent.click(screen.getByRole('button', { name: 'More about: AI-assisted articles' }));
    expect(screen.getByRole('dialog')).not.toHaveTextContent(/specialised service/i);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    pick(/you stay in control/i);
    fireEvent.click(screen.getByRole('button', { name: 'More about: AI-assisted articles' }));

    expect(screen.getByRole('dialog')).toHaveTextContent(/specialised service/i);
  });

  it('flags one-year commitments and explains options without ticking them', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByRole('checkbox', { name: /your site in english/i })).toHaveAccessibleDescription(
      /1-year commitment/
    );
    expect(screen.getByRole('checkbox', { name: /a contact form/i })).not.toHaveAccessibleDescription(
      /1-year commitment/
    );

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

  it('offers Swiss hosting to Swiss visitors only', () => {
    const { unmount } = render(<PricingSimulator region="fr" />);
    openMoreOptions();
    expect(screen.queryByRole('checkbox', { name: /hosted in switzerland/i })).not.toBeInTheDocument();
    unmount();

    render(<PricingSimulator region="ch" />);
    openMoreOptions();
    expect(screen.getByText(/options for specific needs/i)).toHaveTextContent(/hosting in switzerland/i);
    expect(screen.getByRole('checkbox', { name: /hosted in switzerland/i })).toBeInTheDocument();
  });

  it('quotes the plan in francs for Swiss visitors', () => {
    render(<PricingSimulator region="ch" />);

    expect(total()).toHaveTextContent('CHF 10');
    expect(total()).not.toHaveTextContent('€10');
  });

  it('carries the composed plan to the free mockup request', () => {
    render(<PricingSimulator region="ch" />);
    tick(/news published for you/i);
    pick(/you stay in control/i);
    withoutDomain();

    const cta = screen.getByRole('link', { name: 'Request my free mockup' });
    expect(cta).toHaveAttribute('href', '/free-mockup');
    fireEvent.click(cta);

    const plan = decodePlanCode(window.sessionStorage.getItem(PLAN_STORAGE_KEY));
    expect(plan).toMatchObject({ projectType: 'website', websiteType: 'showcase', region: 'ch' });
    expect(plan?.selection).toMatchObject({ formula: 'self_service', ownDomain: false, addOns: { domain: true } });
    // Included in "You stay in control", so never charged on top.
    expect(plan?.selection.news).toBeNull();
  });

  it('keeps the total and the free mockup request at hand on small screens', () => {
    render(<PricingSimulator region="fr" />);
    tick(/a contact form/i);

    const bar = screen.getByRole('link', { name: 'My free mockup' }).parentElement!;
    expect(bar).toHaveTextContent('Your estimate · €15 / month');

    fireEvent.click(screen.getByRole('link', { name: 'My free mockup' }));
    expect(decodePlanCode(window.sessionStorage.getItem(PLAN_STORAGE_KEY))?.selection.addOns.contact_form).toBe(true);
  });

  it('links the recap note to the terms of sale, and offers a contact link for questions', () => {
    render(<PricingSimulator region="fr" />);

    expect(within(recap()).getByRole('link', { name: 'terms of sale' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: 'Write to us' })).toHaveAttribute('href', '/contact');
  });
});

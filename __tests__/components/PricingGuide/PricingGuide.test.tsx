import { PricingSimulator } from '@/components/PricingSimulator/PricingSimulator';

import { fireEvent, render, screen, within } from '../../test-utils';

const total = () => screen.getByRole('status', { name: /your estimate/i });
const openGuide = () => fireEvent.click(screen.getByRole('button', { name: 'Help me choose' }));
/** The guide's form, which holds its own copy of the domain question. */
const guide = () => screen.getByRole('button', { name: 'Help me choose' }).parentElement!;
const answer = (question: string, choice: RegExp | string) =>
  fireEvent.click(within(within(guide()).getByRole('group', { name: question })).getByRole('radio', { name: choice }));

describe('PricingGuide', () => {
  // jsdom does not lay pages out, so it has no scrolling to offer.
  const scrollIntoView = vi.fn();
  beforeAll(() => {
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  it('stays folded above a simulator that shows its prices at once', () => {
    render(<PricingSimulator region="fr" />);
    const toggle = screen.getByRole('button', { name: 'Help me choose' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('group', { name: 'Where are you at?' })).not.toBeInTheDocument();
    expect(total()).toHaveTextContent('€10');

    openGuide();

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/answer a few questions/i)).toBeInTheDocument();
    // Only the first question until it says where the visitor is going.
    expect(within(guide()).queryByRole('group', { name: 'How many pages do you want?' })).not.toBeInTheDocument();
  });

  it('sends a project outside the subscription to a quote', () => {
    render(<PricingSimulator region="fr" />);
    openGuide();

    answer('Where are you at?', /sell online/i);

    expect(screen.getByText(/we define the project together, then send you a quote/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request a quote' })).toHaveAttribute('href', '/contact');
    expect(screen.queryByRole('button', { name: 'See my plan' })).not.toBeInTheDocument();
  });

  it('sends a site to keep to the contact page, and a site to redo on to the questions', () => {
    render(<PricingSimulator region="fr" />);
    openGuide();
    answer('Where are you at?', 'I already have a website');

    answer('What do you want to do with it?', 'Keep it and get help');
    expect(screen.getByRole('link', { name: 'Talk about my project' })).toHaveAttribute('href', '/contact');

    answer('What do you want to do with it?', 'Redo it');
    expect(screen.queryByRole('link', { name: 'Talk about my project' })).not.toBeInTheDocument();
    expect(within(guide()).getByRole('group', { name: 'How many pages do you want?' })).toBeInTheDocument();
  });

  it('asks about the email address only without a domain, and about news only when the studio publishes', () => {
    render(<PricingSimulator region="fr" />);
    openGuide();
    answer('Where are you at?', "I don't have a website yet");
    const emailQuestion = /do you want an email address in your own name, like contact@my-business\.com/i;

    expect(within(guide()).queryByRole('group', { name: emailQuestion })).not.toBeInTheDocument();
    answer('Do you already have a domain name?', 'No, register one for me');
    expect(within(guide()).getByRole('group', { name: emailQuestion })).toBeInTheDocument();
    answer('Do you already have a domain name?', 'Yes, I already have one');
    expect(within(guide()).queryByRole('group', { name: emailQuestion })).not.toBeInTheDocument();

    const newsQuestion = /do you publish news/i;
    expect(within(guide()).getByRole('group', { name: newsQuestion })).toBeInTheDocument();
    answer('Who will make the changes on your site?', 'Me, for my news and opening hours');
    expect(within(guide()).queryByRole('group', { name: newsQuestion })).not.toBeInTheDocument();
  });

  it('ticks the matching options and lands in the simulator, the guide folded', () => {
    render(<PricingSimulator region="fr" />);
    openGuide();
    answer('Where are you at?', "I don't have a website yet");
    answer('Who will make the changes on your site?', 'Me, for my news and opening hours');
    answer('Do you already have a domain name?', 'No, register one for me');
    answer('How many pages do you want?', '5 to 7 pages');
    fireEvent.click(within(guide()).getByRole('checkbox', { name: 'Through a form on my site' }));
    fireEvent.click(within(guide()).getByRole('checkbox', { name: /booking an appointment online/i }));
    fireEvent.click(within(guide()).getByRole('checkbox', { name: /booking an appointment online/i }));
    answer(
      'Do you want an email address in your own name, like contact@my-business.com?',
      'Yes, and other mailboxes for my team'
    );
    answer('How often does your information (texts, photos, opening hours) change?', 'Once a month');

    fireEvent.click(screen.getByRole('button', { name: 'See my plan' }));

    expect(screen.getByRole('button', { name: 'Help me choose' })).toHaveAttribute('aria-expanded', 'false');
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    expect(screen.getByRole('radio', { name: /you stay in control/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /a contact form/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /online booking/i })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /email address in your own name/i })).toBeChecked();
    expect(screen.getByText('1 extra mailbox', { selector: '[aria-live]' })).toBeInTheDocument();
    // 20 plan + 15 pages + 5 form + 5 domain + 15 email + 10 mailbox + 20 changes
    expect(total()).toHaveTextContent('€90');
    // Everything stays adjustable.
    fireEvent.click(screen.getByRole('checkbox', { name: /a contact form/i }));
    expect(total()).toHaveTextContent('€85');
  });

  it('asks before replacing options ticked by hand', () => {
    render(<PricingSimulator region="fr" />);
    fireEvent.click(screen.getByRole('checkbox', { name: /your site in english/i }));
    openGuide();
    answer('Where are you at?', "I don't have a website yet");
    answer('How many pages do you want?', '2 to 4 pages');

    fireEvent.click(screen.getByRole('button', { name: 'See my plan' }));

    const warning = screen.getByRole('alert');
    expect(warning).toHaveTextContent('Your answers will replace the options you have already ticked.');
    expect(within(warning).getByRole('button', { name: 'Replace' })).toHaveFocus();

    fireEvent.click(within(warning).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /your site in english/i })).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: 'See my plan' }));
    fireEvent.click(screen.getByRole('button', { name: 'Replace' }));

    expect(screen.getByRole('checkbox', { name: /your site in english/i })).not.toBeChecked();
    expect(total()).toHaveTextContent('€15');
  });

  it('applies the answers at once when nothing is ticked yet', () => {
    render(<PricingSimulator region="fr" />);
    openGuide();
    answer('Where are you at?', "I don't have a website yet");
    answer('How many pages do you want?', "I don't know yet");

    fireEvent.click(screen.getByRole('button', { name: 'See my plan' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(total()).toHaveTextContent('€10');
  });
});

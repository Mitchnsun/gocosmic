import { PricingSimulator } from '@/components/PricingSimulator/PricingSimulator';

import { fireEvent, render, screen, within } from '../../test-utils';

const total = () => screen.getByRole('status', { name: /your estimate/i });
/** The guide's form, which holds its own copy of the domain question. */
const guide = () => screen.getByRole('form', { name: 'Help me choose' });
const question = (name: RegExp | string) => within(guide()).getByRole('group', { name });
/** An answer given with the keyboard: it changes the answer and stays on the question. */
const answer = (name: RegExp | string, choice: RegExp | string) =>
  fireEvent.click(within(question(name)).getByRole('radio', { name: choice }));
/** An answer given with the pointer: it moves on to the next question. */
const pick = (name: RegExp | string, choice: RegExp | string) => {
  const radio = within(question(name)).getByRole('radio', { name: choice });
  fireEvent.pointerDown(radio);
  fireEvent.click(radio);
};
const next = () => fireEvent.click(within(guide()).getByRole('button', { name: 'Next' }));

describe('PricingGuide', () => {
  // jsdom does not lay pages out, so it has no scrolling to offer.
  const scrollIntoView = vi.fn();
  beforeAll(() => {
    Element.prototype.scrollIntoView = scrollIntoView;
  });
  beforeEach(() => {
    scrollIntoView.mockClear();
  });

  it('shows its first question alone above a simulator that shows its prices at once', () => {
    render(<PricingSimulator region="fr" />);

    expect(question('Where do you stand?')).toBeInTheDocument();
    expect(screen.getByText(/answer a few questions/i)).toBeInTheDocument();
    expect(within(guide()).queryByRole('button')).not.toBeInTheDocument();
    // A single question so far: no progress line, and the page keeps its focus.
    expect(within(guide()).queryByText(/^Question \d/)).not.toBeInTheDocument();
    expect(document.body).toHaveFocus();
    expect(total()).toHaveTextContent('€10');
  });

  it('moves on when the current answer is picked again with the pointer', () => {
    render(<PricingSimulator region="fr" />);
    pick('Where do you stand?', "I don't have a website yet");
    fireEvent.click(within(guide()).getByRole('button', { name: 'Back' }));

    pick('Where do you stand?', "I don't have a website yet");

    expect(question('Who will make the changes on your site?')).toBeInTheDocument();
  });

  it('stays on the contact question when a channel is ticked with the pointer, several being allowed', () => {
    render(<PricingSimulator region="fr" />);
    pick('Where do you stand?', "I don't have a website yet");
    pick('Who will make the changes on your site?', 'You: I send you my changes');
    pick('Do you already have a domain name?', 'Yes, I already have one');
    pick('How many pages do you want?', 'A single page');

    const form = within(question('How do your customers reach you?')).getByRole('checkbox', {
      name: 'Through a form on my site',
    });
    fireEvent.pointerDown(form);
    fireEvent.click(form);

    expect(form).toBeChecked();
    expect(question('How do your customers reach you?')).toBeInTheDocument();
  });

  it('does not move on when the keyboard took over after a pointer press', () => {
    render(<PricingSimulator region="fr" />);
    const radio = within(question('Where do you stand?')).getByRole('radio', { name: "I don't have a website yet" });

    fireEvent.pointerDown(radio);
    fireEvent.keyDown(radio, { key: 'ArrowDown' });
    fireEvent.click(radio);

    expect(question('Where do you stand?')).toBeInTheDocument();
  });

  it('moves on when an answer is picked with the pointer, not with the keyboard, and goes back', () => {
    render(<PricingSimulator region="fr" />);
    answer('Where do you stand?', "I don't have a website yet");

    expect(question('Where do you stand?')).toBeInTheDocument();
    expect(within(guide()).getByText('Question 1 of 7')).toBeInTheDocument();

    next();
    pick('Who will make the changes on your site?', 'You: I send you my changes');

    expect(question('Do you already have a domain name?')).toBeInTheDocument();
    expect(within(guide()).getByText('Question 3 of 7')).toBeInTheDocument();
    expect(within(question('Do you already have a domain name?')).getAllByRole('radio')[0]).toHaveFocus();

    fireEvent.click(within(guide()).getByRole('button', { name: 'Back' }));
    const checked = within(question('Who will make the changes on your site?')).getByRole('radio', {
      name: /you: i send/i,
    });
    expect(checked).toBeChecked();
    expect(checked).toHaveFocus();
  });

  it('does not move on for a click that has no pointer press, even after a pointer press on a button', () => {
    render(<PricingSimulator region="fr" />);
    pick('Where do you stand?', "I don't have a website yet");
    fireEvent.pointerDown(within(guide()).getByRole('button', { name: 'Back' }));
    answer('Who will make the changes on your site?', 'You: I send you my changes');

    expect(question('Who will make the changes on your site?')).toBeInTheDocument();
  });

  it('applies nothing when the form is submitted before the last question', () => {
    render(<PricingSimulator region="fr" />);
    fireEvent.click(screen.getByRole('checkbox', { name: /your site in english/i }));
    pick('Where do you stand?', "I don't have a website yet");
    fireEvent.submit(guide());

    expect(screen.queryByRole('button', { name: 'Replace' })).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /your site in english/i })).toBeChecked();

    fireEvent.click(within(guide()).getByRole('button', { name: 'Back' }));
    pick('Where do you stand?', /online shop/i);
    fireEvent.submit(guide());
    expect(screen.getByRole('checkbox', { name: /your site in english/i })).toBeChecked();
  });

  it('sends a project outside the subscription to a quote, announced in a live region already on the page', () => {
    render(<PricingSimulator region="fr" />);
    const liveRegions = [...guide().querySelectorAll('[aria-live="polite"]')];

    pick('Where do you stand?', /online shop/i);

    const ending = screen.getByText(/we define the project together, then send you a quote/i);
    expect(liveRegions).toContain(ending.closest('[aria-live="polite"]'));
    expect(within(guide()).queryByText(/^Question \d/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request a quote' })).toHaveAttribute('href', '/contact');
    expect(screen.queryByRole('button', { name: 'See my plan' })).not.toBeInTheDocument();
  });

  it('sends a site to keep to the contact page, and a site to redo on to the questions', () => {
    render(<PricingSimulator region="fr" />);
    pick('Where do you stand?', 'I already have a website');

    answer('What do you want to do with it?', 'Keep it and get help');
    expect(screen.getByRole('link', { name: 'Talk about my project' })).toHaveAttribute('href', '/contact');

    pick('What do you want to do with it?', 'Rebuild it');
    expect(screen.queryByRole('link', { name: 'Talk about my project' })).not.toBeInTheDocument();
    expect(question('Who will make the changes on your site?')).toBeInTheDocument();
  });

  it('ticks the matching options and lands in the simulator', () => {
    render(<PricingSimulator region="fr" />);
    pick('Where do you stand?', "I don't have a website yet");
    pick('Who will make the changes on your site?', 'Me, for my news and opening hours');
    pick('Do you already have a domain name?', 'No, register one for me');
    pick('How many pages do you want?', '5 to 7 pages');
    fireEvent.click(within(guide()).getByRole('checkbox', { name: 'Through a form on my site' }));
    fireEvent.click(within(guide()).getByRole('checkbox', { name: /booking an appointment online/i }));
    fireEvent.click(within(guide()).getByRole('checkbox', { name: /booking an appointment online/i }));
    next();
    pick(
      'Do you want an email address in your own name, like contact@my-business.com?',
      'Yes, and other mailboxes for my team'
    );
    // No news question when the visitor makes the changes: the last one is the updates.
    answer('How often does your information (texts, photos, opening hours) change?', 'Once a month');

    fireEvent.click(screen.getByRole('button', { name: 'See my plan' }));

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    // Focus lands on the chosen formula, which names itself.
    expect(screen.getByRole('radio', { name: /you stay in control/i })).toBeChecked();
    expect(screen.getByRole('radio', { name: /you stay in control/i })).toHaveFocus();
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
    pick('Where do you stand?', "I don't have a website yet");
    next();
    next();
    pick('How many pages do you want?', '2 to 4 pages');
    next();
    next();

    fireEvent.click(screen.getByRole('button', { name: 'See my plan' }));

    // Focus moves to "Replace", which the warning describes, so it is read once.
    const replace = screen.getByRole('button', { name: 'Replace' });
    expect(replace).toHaveFocus();
    expect(replace).toHaveAccessibleDescription('Your answers will replace the options you have already ticked.');

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('button', { name: 'Replace' })).not.toBeInTheDocument();
    // Focus comes back where the visitor was, not to the top of the page.
    expect(screen.getByRole('button', { name: 'See my plan' })).toHaveFocus();
    expect(screen.getByRole('checkbox', { name: /your site in english/i })).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: 'See my plan' }));
    fireEvent.click(screen.getByRole('button', { name: 'Replace' }));

    expect(screen.getByRole('checkbox', { name: /your site in english/i })).not.toBeChecked();
    expect(total()).toHaveTextContent('€15');
  });

  it('applies the answers at once when nothing is ticked yet', () => {
    render(<PricingSimulator region="fr" />);
    pick('Where do you stand?', "I don't have a website yet");
    for (let step = 0; step < 5; step++) next();

    fireEvent.click(screen.getByRole('button', { name: 'See my plan' }));

    expect(screen.queryByRole('button', { name: 'Replace' })).not.toBeInTheDocument();
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(total()).toHaveTextContent('€10');
  });
});

import { AGENT_USAGE } from '@/lib/llms/llms.shared';
import { buildLlmsFull } from '@/lib/llms/llms-full';

import legal from '../../../messages/en/legal.json';

const BOOKING_URL = 'https://calendar.google.com/calendar/appointments/schedules/abc?gv=true';

describe('buildLlmsFull', () => {
  const text = buildLlmsFull(null);

  it('shares the opening, the regions and the contact details of llms.txt', () => {
    expect(text).toMatch(/^# Cosmic Studio\n\n> /);
    expect(text).toContain(AGENT_USAGE);
    expect(text).toContain('## Languages and regions');
    expect(text).toContain('## Contact\n\n');
    expect(text).not.toContain('Pick a 20-minute slot');
    expect(buildLlmsFull(BOOKING_URL)).toContain(`[Pick a 20-minute slot](${BOOKING_URL})`);
  });

  it('follows the order of the site, from the homepage to the terms of sale', () => {
    const headings = text.match(/^## .+$/gm);

    expect(headings).toEqual([
      '## Languages and regions',
      '## [Home](https://www.gocosmic.dev/en)',
      '## [Services & pricing](https://www.gocosmic.dev/en/services)',
      '## [Free mockup](https://www.gocosmic.dev/en/free-mockup)',
      '## [Projects](https://www.gocosmic.dev/en/projects)',
      '## [About](https://www.gocosmic.dev/en/about)',
      '## [Website design · Geneva, Annecy](https://www.gocosmic.dev/en/website-design-geneva-annecy)',
      '## Contact',
      '## [Terms of sale](https://www.gocosmic.dev/en/terms)',
    ]);
  });

  it('includes the homepage sections, with the code handover delay', () => {
    expect(text).toContain('### For people who already have a trade and no time to learn another.');
    expect(text).toContain('- **Craftspeople**: Carpenter, plumber');
    expect(text).toContain('The code is transferred to you after 36 months of subscription');
    expect(text).toContain('- **T-3 · Meeting · We get to know each other**: ');
    expect(text).toContain('Matthieu Compérat comes from Duingt');
  });

  it('prices the four ways to work with the studio', () => {
    expect(text).toContain('- **Subscription · Site, hosting and care · From €10 / CHF 10 excl. VAT / month**: ');
    expect(text).toContain('- **Guidance · Advice and design · Day rate**: ');
    expect(text).toContain('- **Custom · One-off project · quoted**: ');
    expect(text).toContain('  - The code and the data belong to you');
  });

  it('spells out both plans, including the second one the page only shows on its tab', () => {
    expect(text).toContain(
      '- **We take care of everything · €10 / CHF 10 excl. VAT / month**: You email us, we update your site. Included in the plan:'
    );
    expect(text).toContain(
      '- **You stay in control · €20 / CHF 20 excl. VAT / month · 1-year commitment**: You publish your news'
    );
    expect(text).toContain(
      '  - An editing space for your news and opening hours: You publish news or change your opening hours whenever you like'
    );
  });

  it('gives every option its price, its notes and the text of its info bubble', () => {
    expect(text).toContain(
      '- **A contact form · +€5 / +CHF 5 excl. VAT / month**: Visitors write to you from your site, and their messages land in your inbox. Without this option'
    );
    expect(text).toContain(
      '- **A news section · +€5 / +CHF 5 excl. VAT / month · with “We take care of everything” only, as “You stay in control” includes it · 1-year commitment**: '
    );
    expect(text).toContain(
      '- **Website hosted in Switzerland · +€10 / +CHF 10 excl. VAT / month · Swiss versions only**: '
    );
    expect(text).toContain(
      '- **An email address in your own name · +€15 / +CHF 15 excl. VAT / month**: For example contact@my-business.com, instead of a free address. Your email address uses your domain name'
    );
    expect(text).toContain(
      '- **Extra mailboxes · +€10 / +CHF 10 per mailbox excl. VAT / month · 1-year commitment**: '
    );
    expect(text).toContain('invoices@my-business.com. When several of you work together');
  });

  it('lists every step of the sliders with its price', () => {
    expect(text).toContain('  - 10 pages or more: +€40 / +CHF 40 or more excl. VAT / month');
    expect(text).toContain('- **Content changes included**: Once a year (included). You email us your changes');
    expect(text).toContain('  - As often as needed: +€200 / +CHF 200 excl. VAT / month');
    expect(text).toContain('  - 1 article a day: +€50 / +CHF 50 excl. VAT / month');
    expect(text).toContain('#### Get found and count your visits');
  });

  it('includes the free offers, the quoted services, the trades and the FAQ', () => {
    expect(text).toContain('### Before we talk budget (Free, no commitment)');
    expect(text).toContain('### For your communication (Outside the subscription · on a quote)');
    expect(text).toContain('- **Shops & bookings**: ');
    expect(text).toContain('#### What happens if I stop?\n\nJust let us know');
  });

  it('tells each case study in full, with its latest release when the page mentions it', () => {
    expect(text).toContain(
      "### [Coach'n Pulse](https://www.gocosmic.dev/en/projects/coachnpulse)\n\nSince 2016 · Updated: October 2026 · Sports coach · Grenoble · Website"
    );
    expect(text).toContain('Version 5.0.0 came out in October 2026, with a new design.');
    expect(text).toContain('It is still kept up to date: version 1.4.0 came out on 28 February 2026.');
    expect(text).toContain('- A private area where organisers enter the results');
    expect(text).toContain("Who it's for: An amateur choir in Haute-Savoie.");
  });

  it('includes the about, local and free mockup pages', () => {
    expect(text).toContain('- **A price on display**: The subscription starts at €10 / CHF 10 a month excl. VAT');
    expect(text).toContain('- **French-speaking Switzerland**: Vaud, Valais, Neuchâtel, Fribourg');
    expect(text).toContain('- **Then you decide**: The mockup arrives by email within 48 hours');
  });

  it('quotes the terms of sale word for word, and no other legal page', () => {
    for (const { title, body } of legal.legal.terms.sections) {
      expect(text).toContain(`### ${title}\n\n${body.join('\n\n')}`);
    }
    expect(text).not.toContain(legal.legal.privacy.intro);
    expect(text).not.toContain(legal.legal.legalNotice.intro);
  });

  it('leaves no markup or placeholder of the messages', () => {
    expect(text).not.toMatch(/<\/?(em|link)>|\{\w+\}/);
  });
});

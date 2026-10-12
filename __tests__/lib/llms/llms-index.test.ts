import { PROJECTS } from '@/data/projects';
import { getCanonicalUrl } from '@/i18n/canonical';
import { AGENT_USAGE } from '@/lib/llms/llms.shared';
import { buildLlmsIndex } from '@/lib/llms/llms-index';

const BOOKING_URL = 'https://calendar.google.com/calendar/appointments/schedules/abc?gv=true';

describe('buildLlmsIndex', () => {
  // Prices are formatted by `Intl`, with a non-breaking space after the currency code ("CHF 10").
  const text = buildLlmsIndex(null).replaceAll('\u00a0', ' ');

  it('opens with the studio name, its summary and the usage note, as llmstxt.org lays it out', () => {
    expect(text).toMatch(
      /^# Cosmic Studio\n\n> Sites and apps for small businesses, craftspeople, professional practices and associations in Geneva, Annecy and Haute-Savoie\. Prices on display, free mockup\.\n\n/
    );
    expect(text).toContain(`\n\n${AGENT_USAGE}\n\n`);
    expect(text).toContain('Cosmic Studio is Matthieu Compérat, a developer based in Chêne-Bougeries.');
    expect(text).toContain('Formerly Go Cosmic.');
    expect(text.endsWith('\n')).toBe(true);
  });

  it('explains the regional and Swiss versions of every language', () => {
    expect(text).toContain(
      '- Europe · EUR, studio base in Annecy: [English](https://www.gocosmic.dev/en) · [French](https://www.gocosmic.dev/fr)'
    );
    expect(text).toContain(
      '- Switzerland · CHF, studio base in Chêne-Bougeries: [English](https://www.gocosmic.dev/en-ch) · [French](https://www.gocosmic.dev/fr-ch)'
    );
    expect(text).toContain('[Italian](https://www.gocosmic.dev/it-ch)');
    expect(text).toContain(
      'For businesses domiciled in Switzerland, prices are in Swiss francs (CHF). The amounts are the same in both currencies.'
    );
    expect(text).toContain('[sitemap](https://www.gocosmic.dev/sitemap.xml)');
  });

  it('describes each main page, quoting the starting price in both currencies', () => {
    expect(text).toContain(
      '- [Services & pricing](https://www.gocosmic.dev/en/services): Showcase sites, online shops, apps and ongoing care, with prices on display: a subscription from €10 / CHF 10 a month excl. VAT, or a quoted project.'
    );
    expect(text).toContain('- [Free mockup](https://www.gocosmic.dev/en/free-mockup): Request a free mockup');
    expect(text).toContain(
      '- [Website design · Geneva, Annecy](https://www.gocosmic.dev/en/website-design-geneva-annecy): '
    );
  });

  it('lists every case study with its client, kind and dates', () => {
    for (const project of PROJECTS) {
      expect(text).toContain(`](${getCanonicalUrl('en', project.href)}): `);
    }
    expect(text).toContain(
      "- [Coach'n Pulse](https://www.gocosmic.dev/en/projects/coachnpulse): Since 2016 · Updated: October 2026 · Sports coach · Grenoble · Website. The website of a triathlon"
    );
  });

  it('gives the contact addresses, and the call booking only once its calendar is set', () => {
    expect(text).toContain('- Email: [contact@gocosmic.dev](mailto:contact@gocosmic.dev)');
    expect(text).toContain('- Existing client · support: [support@gocosmic.dev](mailto:support@gocosmic.dev)');
    expect(text).not.toContain('Pick a 20-minute slot');

    expect(buildLlmsIndex(BOOKING_URL)).toContain(`- [Pick a 20-minute slot](${BOOKING_URL}), via Google Calendar`);
  });

  it('points to the full content and the terms of sale as optional reading', () => {
    expect(text).toContain('## Optional\n\n- [Full content](https://www.gocosmic.dev/llms-full.txt): ');
    expect(text).toContain('- [Terms of sale](https://www.gocosmic.dev/en/terms): ');
    expect(text).not.toContain('/en/privacy');
    expect(text).not.toContain('/en/legal-notice');
  });

  it('leaves no markup or placeholder of the messages', () => {
    expect(text).not.toMatch(/<\/?(em|link)>|\{\w+\}/);
  });
});

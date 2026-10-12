import { ADD_ON_KEYS } from '@/components/PricingSimulator/constants';
import {
  getOptionPrices,
  getPriceLineName,
  getPriceLines,
  getPriceLineTotal,
  OPTION_GROUPS,
} from '@/lib/pricing/price-list';

const names: Record<string, string> = {
  'options.articles.label': 'AI-assisted articles',
  'options.articles.tiers.weekly': '1 article a week',
  'updates.label': 'Content changes included',
  'updates.tiers.weekly': 'Once a week',
  'options.analytics.label': 'Visit statistics',
  'options.analytics.tiers.quarterly': 'Every three months',
  'options.domain.label': 'Managing your domain name',
};
const t = (key: string) => names[key] ?? key;

describe('OPTION_GROUPS', () => {
  it('lists every add-on of the price table exactly once', () => {
    const grouped = Object.values(OPTION_GROUPS).flat();

    expect(new Set(grouped).size).toBe(grouped.length);
    expect(grouped).toEqual(expect.arrayContaining([...ADD_ON_KEYS]));
  });
});

describe('getOptionPrices', () => {
  it('prices the pages from the second step, the last one as a minimum', () => {
    const lines = getOptionPrices('pages');

    expect(lines.map((line) => line.tierKey)).toEqual([
      'pages.tiers.two_four',
      'pages.tiers.five_seven',
      'pages.tiers.eight_nine',
      'pages.tiers.ten_plus',
    ]);
    expect(lines.at(-1)).toMatchObject({ price: 40, orMore: true });
    expect(lines[0]).not.toHaveProperty('orMore');
  });

  it('gives each slider step its price and the option its commitment', () => {
    expect(getOptionPrices('analytics')).toEqual([
      expect.objectContaining({ tierKey: 'options.analytics.tiers.yearly', price: 5, commitment: true }),
      expect.objectContaining({ tierKey: 'options.analytics.tiers.quarterly', price: 15, commitment: true }),
      expect.objectContaining({ tierKey: 'options.analytics.tiers.monthly', price: 50, commitment: true }),
    ]);
    expect(getOptionPrices('updates')).toHaveLength(5);
    expect(getOptionPrices('updates')[0]).toMatchObject({ labelKey: 'updates.label', commitment: false });
  });

  it('ties each article rhythm to the content changes it forces, as the simulator does', () => {
    const required = getOptionPrices('articles').map((line) => [line.requires?.tierKey, line.requires?.price]);

    expect(required).toEqual([
      ['updates.tiers.monthly', 20],
      ['updates.tiers.weekly', 60],
      ['updates.tiers.unlimited', 200],
    ]);
    expect(getOptionPrices('articles').map(getPriceLineTotal)).toEqual([25, 75, 250]);
    expect(getOptionPrices('analytics')[0]).not.toHaveProperty('requires');
  });

  it('prices one extra mailbox', () => {
    expect(getOptionPrices('mailboxes')).toEqual([
      { option: 'mailboxes', labelKey: 'options.mailboxes.label', price: 10, commitment: true },
    ]);
  });

  it('flags the news section as a managed-plan option and Swiss hosting as Swiss only', () => {
    expect(getOptionPrices('news')[0]).toMatchObject({ price: 5, formula: 'managed', commitment: true });
    expect(getOptionPrices('swiss_hosting')[0]).toMatchObject({ price: 10, region: 'ch' });
    expect(getOptionPrices('domain')[0]).toEqual({
      option: 'domain',
      labelKey: 'options.domain.label',
      price: 5,
      commitment: false,
    });
  });
});

describe('getPriceLines', () => {
  it('opens with both plans, the second one committing for a year', () => {
    const [managed, selfService] = getPriceLines();

    expect(managed).toEqual({ option: 'formula', labelKey: 'formulas.managed.label', price: 10, commitment: false });
    expect(selfService).toEqual({
      option: 'formula',
      labelKey: 'formulas.self_service.label',
      price: 20,
      commitment: true,
    });
  });

  it('keeps Swiss hosting for the Swiss region and for the region-free list only', () => {
    const offersSwissHosting = (lines: ReturnType<typeof getPriceLines>) =>
      lines.some((line) => line.option === 'swiss_hosting');

    expect(offersSwissHosting(getPriceLines())).toBe(true);
    expect(offersSwissHosting(getPriceLines('ch'))).toBe(true);
    expect(offersSwissHosting(getPriceLines('fr'))).toBe(false);
    expect(getPriceLines('fr')).toHaveLength(getPriceLines().length - 1);
  });
});

describe('getPriceLineName', () => {
  it('names a slider step after its option', () => {
    const [, quarterly] = getOptionPrices('analytics');

    expect(getPriceLineName(t, quarterly!)).toBe('Visit statistics · Every three months');
  });

  it('names a single-price option by its label', () => {
    expect(getPriceLineName(t, getOptionPrices('domain')[0]!)).toBe('Managing your domain name');
  });

  it('names an article rhythm with the content changes it requires', () => {
    const [, weekly] = getOptionPrices('articles');

    expect(getPriceLineName(t, weekly!)).toBe(
      'AI-assisted articles · 1 article a week + Content changes included · Once a week'
    );
  });
});

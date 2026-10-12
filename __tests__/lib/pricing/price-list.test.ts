import { ADD_ON_KEYS } from '@/components/PricingSimulator/constants';
import { getOptionPrices, getPriceLineName, getPriceLines, OPTION_GROUPS } from '@/lib/pricing/price-list';

const names: Record<string, string> = {
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
});

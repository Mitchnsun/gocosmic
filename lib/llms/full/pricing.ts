import { FORMULA_INCLUDES, FORMULA_PRICES, FORMULAS } from '@/components/PricingSimulator/constants';
import type { Formula } from '@/components/PricingSimulator/PricingSimulator.types';
import { getOptionPrices, OPTION_GROUPS, type PricedOption, type PriceLine } from '@/lib/pricing/price-list';

import { EN } from '../llms.messages';
import { inBothCurrencies, item, section, surchargeInBothCurrencies } from '../llms.utils';

/** Translator of the simulator's copy (`pricing.builder`). */
const t = (key: string, values?: Record<string, string | number>) => EN.pricing(`builder.${key}`, values);

/** The example domain of the version the files link to. */
const values = { domain: t('options.example_domain.fr') };

const formulaName = (formula: Formula) => `“${t(`formulas.${formula}.label`)}”`;

/** Explanation of an info bubble, when the item has one. */
const infoOf = (key: string): string[] => (EN.pricing.has(`builder.${key}`) ? [t(key)] : []);

/** "+€5 / +CHF 5 excl. VAT / month", or "+€40 / +CHF 40 or more…" for the last step of a slider. */
const priceOf = (line: PriceLine) => {
  const amount = surchargeInBothCurrencies(line.price);
  return `${line.orMore ? t('pages.or_more', { price: amount }) : amount} ${t('period')}`;
};

/** What each plan costs and includes, with the explanations of its info bubbles. */
function buildPlans(): string {
  const plans = FORMULAS.map((formula) => {
    const lead = [
      t(`formulas.${formula}.label`),
      `${inBothCurrencies(FORMULA_PRICES[formula])} ${t('period')}`,
      ...(formula === 'self_service' ? [t('commitment')] : []),
    ].join(' · ');
    const includes = FORMULA_INCLUDES[formula].map((included) =>
      [t(`base.includes.${included}`), ...infoOf(`base.info.${included}`)].join(': ')
    );
    return item(lead, `${t(`formulas.${formula}.lead`)} ${t('base.title')}:`, includes);
  });

  return section(t('formulas.label'), [plans.join('\n')], 3);
}

/** Restrictions and notes that the simulator shows around an option. */
const notesOf = (first: PriceLine): string[] => [
  ...(first.formula ? [`with ${formulaName(first.formula)} only, as ${formulaName('self_service')} includes it`] : []),
  ...(first.region === 'ch' ? ['Swiss versions only'] : []),
  ...(first.commitment ? [t('commitment')] : []),
];

/** Copy of an option: its hint, then the explanation of its info bubble. */
function describe(option: PricedOption): string {
  switch (option) {
    case 'pages': {
      return t('pages.info');
    }
    case 'updates': {
      return `${t('updates.off')}. ${t('updates.hint')}`;
    }
    case 'email': {
      return `${t('options.email.hint', values)} ${t('options.email.note')}`;
    }
    case 'redirects': {
      return `${t('options.redirects.hint', values)} ${t('options.email_extras.info')}`;
    }
    default: {
      return [t(`options.${option}.hint`, values), ...infoOf(`options.${option}.info`)].join(' ');
    }
  }
}

/** One option: a single price on its line, or one nested line per slider step. */
function buildOption(option: PricedOption): string {
  const prices = getOptionPrices(option);
  const [first] = prices;
  if (!first) return '';

  const name = t(first.labelKey);
  const notes = notesOf(first);

  if (option === 'mailboxes') {
    const perMailbox = t('options.mailboxes.price', { price: surchargeInBothCurrencies(first.price) });
    return item([name, `${perMailbox} ${t('period')}`, ...notes].join(' · '), describe(option));
  }
  if (first.tierKey) {
    const steps = prices.map((line) => `${t(line.tierKey ?? line.labelKey)}: ${priceOf(line)}`);
    return item([name, ...notes].join(' · '), describe(option), steps);
  }
  return item([name, priceOf(first), ...notes].join(' · '), describe(option));
}

/** The subscription simulator in full: the plans, then every option and price, group by group. */
export function buildPricingSections(): string[] {
  const groups = Object.entries(OPTION_GROUPS).map(([group, options]) =>
    section(t(`groups.${group}`), [options.map(buildOption).join('\n')], 4)
  );

  return [buildPlans(), section(t('options.title'), [t('total.note'), ...groups, t('total.beyond')], 3)];
}

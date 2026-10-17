import { FORMULA_INCLUDES, FORMULA_PRICES, FORMULAS, ONE_YEAR_FORMULAS } from '@/components/PricingSimulator/constants';
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
const infoOf = (key: string): string[] => (EN.pricing.has(`builder.${key}`) ? [t(key, values)] : []);

/** Copy the simulator only shows with "You stay in control", e.g. "With “You stay in control”: …". */
const withSelfService = (key: string) => `With ${formulaName('self_service')}: ${t(key)}`;

/** "+€5 / +CHF 5 / month", or "+€40 / +CHF 40 or more / month" for the last step of a slider. */
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
      ...(ONE_YEAR_FORMULAS.has(formula) ? [t('commitment')] : []),
    ].join(' · ');
    const includes = FORMULA_INCLUDES[formula].map((included) =>
      [t(`base.includes.${included}`), ...infoOf(`base.info.${included}`)].join(': ')
    );
    return item(lead, `${t(`formulas.${formula}.lead`)} ${t('base.title')}:`, includes);
  });

  return section(t('formulas.label'), [plans.join('\n')], 3);
}

/** Options the simulator only offers along with another one, whose price comes on top. */
const REQUIRES: Partial<Record<PricedOption, PricedOption>> = {
  email: 'domain',
  mailboxes: 'email',
  redirects: 'email',
  detailed_analytics: 'analytics',
};

/** Restrictions and notes that the simulator shows around an option. */
const notesOf = (first: PriceLine): string[] => {
  const required = REQUIRES[first.option as PricedOption];
  return [
    ...(first.formula
      ? [`with ${formulaName(first.formula)} only, as ${formulaName('self_service')} includes it`]
      : []),
    ...(first.region === 'ch' ? ['Swiss versions only'] : []),
    ...(first.option === 'domain' ? [`required with “${t('domain_question.no')}”`] : []),
    ...(required ? [`requires “${t(getOptionPrices(required)[0]?.labelKey ?? '')}”`] : []),
    ...(first.commitment ? [t('commitment')] : []),
  ];
};

/** Copy of an option: its hint, then the explanation of its info bubble. */
function describe(option: PricedOption): string {
  switch (option) {
    case 'pages': {
      return t('pages.info');
    }
    case 'updates': {
      return `${t('updates.hint')} ${t('updates.info')} ${withSelfService('updates.hint_self_service')}`;
    }
    case 'articles': {
      return `${t('options.articles.hint')} ${t('options.articles.info')} ${withSelfService('options.articles.info_tool')}`;
    }
    case 'domain': {
      // The simulator first asks whether the visitor already has a domain name.
      return `${t('options.domain.hint', values)} ${t('options.domain.info', values)} ${t('domain_question.legend')} “${t('domain_question.yes')}”: ${t('domain_question.own_note')}`;
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

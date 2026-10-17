import { BASE_PRICE, FORMULA_PRICES } from '@/components/PricingSimulator/constants';
import { CODE_HANDOVER_MONTHS } from '@/lib/pricing/offers';

import { EN } from '../llms.messages';
import { inBothCurrencies, item, keysOf, link, pageUrl, section, valuesOf } from '../llms.utils';

const COLUMNS = ['subscription', 'guidance', 'reinforcement', 'custom'] as const;
const TRADES = ['showcase', 'shops', 'apps', 'care'] as const;

/** The four ways to work with the studio, each with its price, or how it is priced. */
function buildColumns(): string {
  const t = (key: string, values?: Record<string, string>) => EN.pricing(`columns.${key}`, values);
  const price = { price: inBothCurrencies(BASE_PRICE) };

  const columns = COLUMNS.map((column) => {
    // "From €10 / CHF 10 / month", "Day rate", or nothing for a quoted project.
    const amount = ['price', 'period']
      .filter((key) => EN.pricing.has(`columns.${column}.${key}`))
      .map((key) => t(`${column}.${key}`, price))
      .join(' ');
    const facts = [t(`${column}.title`), t(`${column}.label`), amount].filter(Boolean).join(' · ');
    return item(facts, t(`${column}.description`), valuesOf(EN.pricing.raw(`columns.${column}.features`)));
  });

  return section(t('title'), [columns.join('\n')], 3);
}

/** Services: the offer, the two plans of the subscription, the trades and the questions asked before signing. */
export function buildServicesSection(): string {
  const t = EN.services;
  const months = String(CODE_HANDOVER_MONTHS);
  const faq = keysOf(t.raw('faq.items')).map((key) =>
    section(t(`faq.items.${key}.question`), [t(`faq.items.${key}.answer`, { months })], 4)
  );
  const plans = {
    price: inBothCurrencies(BASE_PRICE),
    selfServicePrice: inBothCurrencies(FORMULA_PRICES.self_service),
  };

  return section(link(EN.footer('link_services'), pageUrl('/services')), [
    t('intro.lead'),
    buildColumns(),
    section(t('simulator.title'), [t('simulator.lead', plans)], 3),
    section(
      t('trades.title'),
      [
        TRADES.map((trade) => item(t(`trades.items.${trade}.title`), t(`trades.items.${trade}.description`))).join(
          '\n'
        ),
      ],
      3
    ),
    section(t('faq.title'), faq, 3),
  ]);
}

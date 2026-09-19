import type { DecodedPlan } from '@/lib/pricing/plan-code';
import { getCurrency } from '@/lib/region';

import { ADD_ON_KEYS, BASE_PRICE, PAGE_TIER_KEYS, UPDATE_TIER_KEYS } from './constants';
import {
  formatAmount,
  getAddOnPrice,
  getMonthlyTotal,
  getPageTierPrice,
  getUpdateTierPrice,
  needsCustomQuote,
} from './PricingSimulator.utils';

/** Minimal shape of the `pricing` translator, so the builder stays hook-free. */
type Translate = (key: string, values?: Record<string, string>) => string;

/**
 * Writes the visitor's simulation as plain text, in their own language, to
 * pre-fill the quote email so the studio receives the whole context.
 */
export function buildQuoteEmailBody(t: Translate, plan: DecodedPlan): string {
  const { projectType, websiteType, selection, region } = plan;
  const currency = getCurrency(region);
  const money = (amount: number) => formatAmount(amount, currency);
  const surcharge = (amount: number) => `+${money(amount)}`;
  const period = t('builder.period');

  const lines = [t('summary.intro'), '', `${t('summary.project')} : ${t(`step1.options.${projectType}`)}`];

  if (websiteType) {
    lines.push(`${t('summary.site_type')} : ${t(`step2.options.${websiteType}`)}`);
  }

  if (projectType !== 'website' || websiteType !== 'showcase') {
    lines.push('', t('results.custom.note'));
    return lines.join('\n');
  }

  /* eslint-disable security/detect-object-injection -- indexes are validated tier positions and add-on keys */
  lines.push(
    '',
    `${t('builder.base.title')} : ${money(BASE_PRICE)} ${period}`,
    `${t('builder.pages.label')} : ${t(`builder.pages.tiers.${PAGE_TIER_KEYS[selection.pages]}`)} (${surcharge(getPageTierPrice(selection.pages))})`
  );

  for (const key of ADD_ON_KEYS) {
    if (selection.addOns[key]) {
      lines.push(`${t(`builder.options.${key}.label`)} (${surcharge(getAddOnPrice(key))})`);
    }
  }

  if (selection.updatesEnabled) {
    lines.push(
      `${t('builder.updates.label')} : ${t(`builder.updates.tiers.${UPDATE_TIER_KEYS[selection.updates]}`)} (${surcharge(getUpdateTierPrice(selection.updates))})`
    );
  }
  /* eslint-enable security/detect-object-injection */

  lines.push('', `${t('builder.total.label')} : ${money(getMonthlyTotal(selection))} ${period}`);

  if (needsCustomQuote(selection)) {
    lines.push(t('builder.total.beyond'));
  }

  return lines.join('\n');
}

import type { PlanItem, PlanSelection } from './PricingSimulator.types';
import { getCommittedItems, isTiered } from './PricingSimulator.utils';

/** Translator of the pricing messages, scoped to `pricing` unless said otherwise. */
export type PricingTranslator = (key: string, values?: Record<string, string | number>) => string;

/** Name of a recap line, e.g. "On s'occupe de tout" or "2 à 4 pages". */
export function getPlanItemLabel(t: PricingTranslator, plan: PlanSelection, item: PlanItem): string {
  if (item.id === 'formula') return t(`builder.formulas.${plan.formula}.label`);
  if (item.id === 'pages') return t(`builder.pages.tiers.${item.tier}`);
  if (item.id === 'updates') return t('builder.updates.label');
  if (item.id === 'mailboxes') return t('builder.options.mailboxes.count', { count: item.count ?? 0 });
  if (item.id === 'detailed_analytics') return t('builder.options.detailed_analytics.recap_label');
  return t(`builder.options.${item.id}.label`);
}

/** Rhythm of a slider line, e.g. "Every month". */
export function getPlanItemDetail(t: PricingTranslator, item: PlanItem): string | undefined {
  if (item.id === 'updates') return t(`builder.updates.tiers.${item.tier}`);
  if (isTiered(item.id)) return t(`builder.options.${item.id}.tiers.${item.tier}`);
  return undefined;
}

/** Whether a plan runs in 12-month periods, and which of its lines make it so. */
export function getCommitmentLine(t: PricingTranslator, plan: PlanSelection): string {
  const committed = getCommittedItems(plan);
  return committed.length > 0
    ? t('builder.commitment_line.periods', {
        items: committed.map((id) => t(`builder.commitment_items.${id}`)).join(', '),
      })
    : t('builder.commitment_line.none');
}

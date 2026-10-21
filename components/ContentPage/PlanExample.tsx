import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useLocale, useTranslations } from 'next-intl';

import { getCommitmentLine, getPlanItemLabel } from '@/components/PricingSimulator/PricingSimulator.labels';
import { formatAmount, getMonthlyTotal, getPlanItems } from '@/components/PricingSimulator/PricingSimulator.utils';
import type { ExamplePlan } from '@/data/content-pages';
import { ghostPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { getCurrency, getRegion } from '@/lib/region';

import { buildExamplePlan } from './ContentPage.utils';

/**
 * An example composition of the subscription, priced line by line with the simulator's current prices, in the
 * page's currency, then a link to the simulator to compose one's own.
 */
export function PlanExample({ example }: { example: ExamplePlan }) {
  const locale = useLocale();
  const t = useTranslations('contentPages.example');
  const tPricing = useTranslations('pricing');
  const plan = buildExamplePlan(example);
  const price = (amount: number) => formatAmount(amount, getCurrency(getRegion(locale)), locale);

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-line-2 bg-bg w-full max-w-xl rounded-2xl border p-6">
        <ul aria-label={t('label')} className="text-fg-2 flex flex-col gap-2 text-[15px]">
          {getPlanItems(plan).map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>{getPlanItemLabel(tPricing, plan, item)}</span>
              <span className="text-fg shrink-0 font-mono tabular-nums">
                {item.id === 'formula' ? price(item.amount) : `+${price(item.amount)}`}
              </span>
            </li>
          ))}
        </ul>
        <p className="border-line mt-4 flex items-baseline justify-between gap-4 border-t pt-4">
          <span className="text-fg-2 text-2xs font-mono tracking-[0.24em] uppercase">{t('total')}</span>
          <span className="font-display text-fg text-2xl font-semibold tabular-nums">
            {price(getMonthlyTotal(plan))}
            <span className="text-fg-2 ml-1 text-base font-normal">{tPricing('builder.period')}</span>
          </span>
        </p>
        <p className="text-fg-3 mt-4 text-sm">{getCommitmentLine(tPricing, plan)}</p>
      </div>
      <p className="text-fg-2 max-w-3xl text-sm">{t('note')}</p>
      <Link href="/pricing" className={ghostPill()}>
        {tPricing('columns.subscription.cta')}
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

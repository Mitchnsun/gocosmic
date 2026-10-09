'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Chip } from '@/design-system/chip';
import { InfoPopover } from '@/design-system/info-popover';
import type { Currency } from '@/lib/region';

import { FORMULA_PRICES } from './constants';
import { usePriceFormat } from './PricingSimulator.hooks';
import type { Formula } from './PricingSimulator.types';

type IncludedItem = 'page' | 'hosting' | 'security' | 'legal' | 'email_button' | 'yearly_update' | 'editor' | 'news';

const SHARED: readonly IncludedItem[] = ['page', 'hosting', 'security', 'legal', 'email_button', 'yearly_update'];

/** What each formula includes; "You stay in control" adds its editing tool and news section. */
const INCLUDED: Record<Formula, readonly IncludedItem[]> = {
  managed: SHARED,
  self_service: [...SHARED, 'editor', 'news'],
};

const WITH_INFO: ReadonlySet<IncludedItem> = new Set(['legal', 'editor', 'news']);

/** Price of the chosen formula and the list of what it includes. */
export function BaseCard({ formula, currency }: { formula: Formula; currency: Currency }) {
  const t = useTranslations('pricing.builder');
  const { price } = usePriceFormat(currency);
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="border-line bg-surface rounded-2xl border p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 id={headingId} className="font-display text-fg text-xl font-semibold">
          {t(`formulas.${formula}.label`)}
        </h3>
        <div className="flex flex-col items-end gap-1.5">
          <p className="font-display text-fg text-lg font-medium tabular-nums">
            {price(FORMULA_PRICES[formula])}
            <span className="text-fg-2 ml-1 text-sm">{t('period')}</span>
          </p>
          {formula === 'self_service' && <Chip>{t('commitment')}</Chip>}
        </div>
      </div>
      <p className="text-fg-3 text-2xs mt-4 font-mono tracking-[0.2em] uppercase">{t('base.title')}</p>
      <ul className="mt-3 space-y-2">
        {INCLUDED[formula].map((item) => {
          const label = t(`base.includes.${item}`);
          return (
            <li key={item} className="text-fg-2 flex items-center gap-3 text-sm">
              <span className="bg-ok h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
              <span className="min-w-0 flex-1">{label}</span>
              {WITH_INFO.has(item) && (
                <InfoPopover label={t('info_label', { option: label })} title={label} className="-my-3">
                  <p>{t(`base.info.${item}`)}</p>
                </InfoPopover>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

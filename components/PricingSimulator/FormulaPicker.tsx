'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { RADIO_CONTROL } from '@/design-system/field';
import { cn } from '@/design-system/lib/utils';

import { FORMULA_PRICES, FORMULAS } from './constants';
import type { Formula } from './PricingSimulator.types';

interface FormulaPickerProps {
  formula: Formula;
  onFormulaChange: (formula: Formula) => void;
  /** Formats a monthly price, e.g. `10 €`. */
  price: (amount: number) => string;
}

/**
 * The two formulas as native radio buttons: choosing one changes the price, it does not navigate.
 * Each card names the formula with its starting price, and says in one line how it works.
 */
export function FormulaPicker({ formula, onFormulaChange, price }: FormulaPickerProps) {
  const t = useTranslations('pricing.builder');
  const id = useId();

  return (
    <fieldset className="min-w-0">
      <legend className="text-fg-2 text-2xs font-mono tracking-[0.24em] uppercase">{t('formulas.label')}</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {FORMULAS.map((key) => (
          <label
            key={key}
            className={cn(
              'border-line bg-surface hover:border-line-2 grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-1 rounded-2xl border p-4 transition-colors',
              'has-checked:border-aerospace has-checked:bg-aerospace/[0.06] light:has-checked:bg-aerospace/[0.03]'
            )}>
            <input
              type="radio"
              name={id}
              value={key}
              checked={formula === key}
              onChange={() => onFormulaChange(key)}
              // Named by the formula and its price only; the lead describes it.
              aria-labelledby={`${id}-${key}-name`}
              aria-describedby={`${id}-${key}-lead`}
              className={cn(RADIO_CONTROL, 'mt-0.5')}
            />
            <span id={`${id}-${key}-name`} className="font-display text-fg text-base font-semibold">
              {t(`formulas.${key}.label`)}
              <span className="text-fg-2 font-normal">
                {' · '}
                {t('from', { price: price(FORMULA_PRICES[key]) })} {t('period')}
              </span>
            </span>
            <span id={`${id}-${key}-lead`} className="text-fg-2 col-start-2 text-sm">
              {t(`formulas.${key}.lead`)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

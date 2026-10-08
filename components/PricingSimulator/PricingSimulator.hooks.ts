'use client';

import { useLocale } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

import type { Currency } from '@/lib/region';

import { INITIAL_SELECTION } from './constants';
import * as rules from './PricingSimulator.rules';
import type { PlanSelection } from './PricingSimulator.types';
import { formatAmount, getMonthlyTotal, needsCustomQuote } from './PricingSimulator.utils';

/**
 * Owns the visitor's raw choices and derives the normalised plan, its total and the hints, so the
 * components stay presentation only. Every action goes through a pure rule of
 * `PricingSimulator.rules.ts`.
 */
export function usePricingSimulator() {
  const [choices, setChoices] = useState<PlanSelection>(INITIAL_SELECTION);

  const apply = useCallback(
    <A extends unknown[]>(rule: (selection: PlanSelection, ...args: A) => PlanSelection) =>
      (...args: A) =>
        setChoices((current) => rule(current, ...args)),
    []
  );

  const actions = useMemo(
    () => ({
      setFormula: apply(rules.setFormula),
      toggleAddOn: apply(rules.toggleAddOn),
      setPages: apply(rules.setPages),
      toggleUpdates: apply(rules.toggleUpdates),
      setUpdates: apply(rules.setUpdates),
      toggleTiered: apply(rules.toggleTiered),
      setTier: apply(rules.setTier),
      setMailboxes: apply(rules.setMailboxes),
    }),
    [apply]
  );

  const plan = useMemo(() => rules.normalizePlan(choices), [choices]);
  const total = useMemo(() => getMonthlyTotal(plan), [plan]);
  const showQuoteHint = useMemo(() => needsCustomQuote(plan), [plan]);
  const updatesRaised = useMemo(() => rules.isUpdatesRaised(choices), [choices]);

  return { plan, total, showQuoteHint, updatesRaised, actions };
}

export type SimulatorActions = ReturnType<typeof usePricingSimulator>['actions'];

/** Price formatters following the page's locale: `price(10)` → `10 €`, `surcharge(5)` → `+5 €`. */
export function usePriceFormat(currency: Currency) {
  const locale = useLocale();
  return useMemo(() => {
    const price = (amount: number) => formatAmount(amount, currency, locale);
    return { price, surcharge: (amount: number) => `+${price(amount)}` };
  }, [currency, locale]);
}

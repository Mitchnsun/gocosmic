'use client';

import { useLocale } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

import type { Currency } from '@/lib/region';

import { INITIAL_SELECTION } from './constants';
import * as rules from './PricingSimulator.rules';
import type { AddOnKey, PlanSelection, TieredKey } from './PricingSimulator.types';
import { formatAmount, getMonthlyTotal, needsCustomQuote } from './PricingSimulator.utils';

interface SimulatorState {
  /** The visitor's raw choices, before the context rules. */
  choices: PlanSelection;
  /** What the last action removed along with the option it unticked, if anything. */
  cascade: rules.Cascade | null;
}

/**
 * Owns the visitor's raw choices and derives the normalised plan, its total and the hints, so the
 * components stay presentation only. Every action goes through a pure rule of
 * `PricingSimulator.rules.ts`.
 */
export function usePricingSimulator() {
  const [{ choices, cascade }, setState] = useState<SimulatorState>({ choices: INITIAL_SELECTION, cascade: null });

  const apply = useCallback(
    <A extends unknown[]>(rule: (selection: PlanSelection, ...args: A) => PlanSelection) =>
      (...args: A) =>
        setState((current) => ({ choices: rule(current.choices, ...args), cascade: null })),
    []
  );

  const actions = useMemo(
    () => ({
      setFormula: apply(rules.setFormula),
      setOwnDomain: apply(rules.setOwnDomain),
      toggleAddOn: (key: AddOnKey) =>
        setState((current) => ({
          choices: rules.toggleAddOn(current.choices, key),
          cascade: key === 'email' ? rules.getCascade(current.choices, 'email') : null,
        })),
      setPages: apply(rules.setPages),
      toggleUpdates: apply(rules.toggleUpdates),
      setUpdates: apply(rules.setUpdates),
      toggleTiered: (key: TieredKey) =>
        setState((current) => ({
          choices: rules.toggleTiered(current.choices, key),
          cascade: key === 'analytics' ? rules.getCascade(current.choices, 'analytics') : null,
        })),
      setTier: apply(rules.setTier),
      setMailboxes: apply(rules.setMailboxes),
      /** Replaces every choice at once, with the composition of the guided mode. */
      replaceChoices: (next: PlanSelection) => setState({ choices: next, cascade: null }),
    }),
    [apply]
  );

  const plan = useMemo(() => rules.normalizePlan(choices), [choices]);
  const total = useMemo(() => getMonthlyTotal(plan), [plan]);
  const showQuoteHint = useMemo(() => needsCustomQuote(plan), [plan]);

  return { plan, total, showQuoteHint, cascade, actions };
}

export type SimulatorActions = ReturnType<typeof usePricingSimulator>['actions'];

/** The formatters of `usePriceFormat`, formatted once by the simulator and passed down. */
export type PriceFormat = ReturnType<typeof usePriceFormat>;

/** Price formatters following the page's locale: `price(10)` → `10 €`, `surcharge(5)` → `+5 €`. */
export function usePriceFormat(currency: Currency) {
  const locale = useLocale();
  return useMemo(() => {
    const price = (amount: number) => formatAmount(amount, currency, locale);
    return { price, surcharge: (amount: number) => `+${price(amount)}` };
  }, [currency, locale]);
}

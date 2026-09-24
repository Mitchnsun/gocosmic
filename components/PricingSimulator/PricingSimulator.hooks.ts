'use client';

import { useCallback, useMemo, useState } from 'react';

import { INITIAL_SELECTION } from './constants';
import type { AddOnKey, PlanSelection } from './PricingSimulator.types';
import { getMonthlyTotal, needsCustomQuote, toTierIndex } from './PricingSimulator.utils';

/**
 * Owns the composed plan and derives its total, so `PricingSimulator.tsx` stays
 * presentation only.
 */
export function usePricingSimulator() {
  const [selection, setSelection] = useState<PlanSelection>(INITIAL_SELECTION);

  const toggleAddOn = useCallback((key: AddOnKey) => {
    // eslint-disable-next-line security/detect-object-injection
    setSelection((current) => ({ ...current, addOns: { ...current.addOns, [key]: !current.addOns[key] } }));
  }, []);

  const setPages = useCallback((value: number) => {
    setSelection((current) => ({ ...current, pages: toTierIndex(value) }));
  }, []);

  const setUpdates = useCallback((value: number) => {
    setSelection((current) => ({ ...current, updates: toTierIndex(value) }));
  }, []);

  const toggleUpdates = useCallback(() => {
    setSelection((current) => ({ ...current, updatesEnabled: !current.updatesEnabled }));
  }, []);

  const total = useMemo(() => getMonthlyTotal(selection), [selection]);
  const showQuoteHint = useMemo(() => needsCustomQuote(selection), [selection]);

  return { selection, total, showQuoteHint, toggleAddOn, toggleUpdates, setPages, setUpdates };
}

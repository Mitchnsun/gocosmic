'use client';

import { useCallback, useMemo, useState } from 'react';

import { INITIAL_SELECTION } from './constants';
import type { AddOnKey, PlanSelection, ProjectType, WebsiteType } from './PricingSimulator.types';
import { getMonthlyTotal, needsCustomQuote, toTierIndex } from './PricingSimulator.utils';

/**
 * Owns every piece of simulator state and derives what the orchestrator renders,
 * so `PricingSimulator.tsx` stays presentation only.
 */
export function usePricingSimulator() {
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [websiteType, setWebsiteType] = useState<WebsiteType | null>(null);
  const [selection, setSelection] = useState<PlanSelection>(INITIAL_SELECTION);

  const chooseProjectType = useCallback((type: ProjectType) => {
    setProjectType(type);
    setWebsiteType(null);
    setSelection(INITIAL_SELECTION);
  }, []);

  const chooseWebsiteType = useCallback((type: WebsiteType) => {
    setWebsiteType(type);
    setSelection(INITIAL_SELECTION);
  }, []);

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

  const reset = useCallback(() => {
    setProjectType(null);
    setWebsiteType(null);
    setSelection(INITIAL_SELECTION);
  }, []);

  const showWebsiteTypes = projectType === 'website';
  const showPlanBuilder = showWebsiteTypes && websiteType === 'showcase';
  // Everything that is not a plain showcase site is quoted personally.
  const showQuote =
    projectType === 'mobile' ||
    projectType === 'both' ||
    (showWebsiteTypes && websiteType !== null && !showPlanBuilder);

  const total = useMemo(() => getMonthlyTotal(selection), [selection]);
  const showQuoteHint = useMemo(() => needsCustomQuote(selection), [selection]);

  return {
    projectType,
    websiteType,
    selection,
    total,
    showQuoteHint,
    showWebsiteTypes,
    showPlanBuilder,
    showQuote,
    chooseProjectType,
    chooseWebsiteType,
    toggleAddOn,
    toggleUpdates,
    setPages,
    setUpdates,
    reset,
  };
}

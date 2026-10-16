'use client';

import { useRef } from 'react';

import { PricingGuide } from '@/components/PricingGuide';
import { getCurrency, type Region } from '@/lib/region';

import { FormulaPicker } from './FormulaPicker';
import { MobileTotalBar } from './MobileTotalBar';
import { PlanBuilder } from './PlanBuilder';
import { PlanSummary } from './PlanSummary';
import { usePriceFormat, usePricingSimulator } from './PricingSimulator.hooks';
import type { PlanSelection } from './PricingSimulator.types';

interface PricingSimulatorProps {
  region: Region;
}

/**
 * Subscription composer: the guided mode above, then the two formulas and their options on the left,
 * a sticky recap with the live total on the right (or a bar at the bottom of small screens). One-off
 * projects are quoted personally, outside the simulator.
 */
export function PricingSimulator({ region }: PricingSimulatorProps) {
  const currency = getCurrency(region);
  const { price } = usePriceFormat(currency);
  const { plan, total, showQuoteHint, cascade, actions } = usePricingSimulator();
  const composerRef = useRef<HTMLDivElement>(null);

  // The visitor lands in the simulator, its options ticked and its total in view.
  const applyGuide = (choices: PlanSelection) => {
    actions.replaceChoices(choices);
    composerRef.current?.scrollIntoView({ block: 'start' });
    composerRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="flex flex-col gap-8">
      <PricingGuide plan={plan} region={region} onApply={applyGuide} />
      <div
        ref={composerRef}
        tabIndex={-1}
        className="grid scroll-mt-24 items-start gap-8 focus:outline-none lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="flex flex-col gap-6">
          <FormulaPicker formula={plan.formula} onFormulaChange={actions.setFormula} price={price} />
          <PlanBuilder currency={currency} region={region} plan={plan} cascade={cascade} actions={actions} />
          <MobileTotalBar plan={plan} region={region} total={price(total)} />
        </div>
        <PlanSummary currency={currency} region={region} plan={plan} total={total} showQuoteHint={showQuoteHint} />
      </div>
    </div>
  );
}

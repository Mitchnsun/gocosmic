'use client';

import { getCurrency, type Region } from '@/lib/region';

import { FormulaTabs } from './FormulaTabs';
import { PlanBuilder } from './PlanBuilder';
import { PlanSummary } from './PlanSummary';
import { usePricingSimulator } from './PricingSimulator.hooks';

interface PricingSimulatorProps {
  region: Region;
}

/**
 * Subscription composer: the two formulas as tabs with their options on the left, a sticky recap
 * with the live total on the right. The recap stays outside the tabs so the total keeps being
 * announced when the formula changes. One-off projects are quoted personally, outside the simulator.
 */
export function PricingSimulator({ region }: PricingSimulatorProps) {
  const currency = getCurrency(region);
  const { plan, total, showQuoteHint, updatesRaised, actions } = usePricingSimulator();

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
      <FormulaTabs formula={plan.formula} onFormulaChange={actions.setFormula}>
        <PlanBuilder currency={currency} region={region} plan={plan} updatesRaised={updatesRaised} actions={actions} />
      </FormulaTabs>
      <PlanSummary currency={currency} region={region} plan={plan} total={total} showQuoteHint={showQuoteHint} />
    </div>
  );
}

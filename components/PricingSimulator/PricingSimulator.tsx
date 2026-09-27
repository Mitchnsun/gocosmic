'use client';

import { getCurrency, type Region } from '@/lib/region';

import { PlanBuilder } from './PlanBuilder';
import { PlanSummary } from './PlanSummary';
import { usePricingSimulator } from './PricingSimulator.hooks';

interface PricingSimulatorProps {
  region: Region;
}

/**
 * Subscription composer: options on the left, a sticky recap with the live total
 * on the right. One-off projects are quoted personally, outside the simulator.
 */
export function PricingSimulator({ region }: PricingSimulatorProps) {
  const currency = getCurrency(region);
  const simulator = usePricingSimulator();

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
      <PlanBuilder
        currency={currency}
        region={region}
        selection={simulator.selection}
        onToggleAddOn={simulator.toggleAddOn}
        onToggleUpdates={simulator.toggleUpdates}
        onPagesChange={simulator.setPages}
        onUpdatesChange={simulator.setUpdates}
      />
      <PlanSummary
        currency={currency}
        region={region}
        selection={simulator.selection}
        total={simulator.total}
        showQuoteHint={simulator.showQuoteHint}
      />
    </div>
  );
}

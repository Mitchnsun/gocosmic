import { INITIAL_SELECTION } from '@/components/PricingSimulator/constants';
import type { PlanSelection } from '@/components/PricingSimulator/PricingSimulator.types';
import type { DecodedPlan } from '@/lib/pricing/plan-code';

type SelectionOverrides = Partial<Omit<PlanSelection, 'addOns'>> & { addOns?: Partial<PlanSelection['addOns']> };

/** A plan selection: the initial one, with only the given choices changed. */
export const makeSelection = (overrides: SelectionOverrides = {}): PlanSelection => ({
  ...INITIAL_SELECTION,
  ...overrides,
  addOns: { ...INITIAL_SELECTION.addOns, ...overrides.addOns },
});

/** A priced showcase simulation (French region unless told otherwise). */
export const makePlan = (overrides: SelectionOverrides = {}, region: DecodedPlan['region'] = 'fr'): DecodedPlan => ({
  projectType: 'website',
  websiteType: 'showcase',
  selection: makeSelection(overrides),
  region,
});

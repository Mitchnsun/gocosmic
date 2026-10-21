import { INITIAL_SELECTION, PAGE_TIERS } from '@/components/PricingSimulator/constants';
import { normalizePlan } from '@/components/PricingSimulator/PricingSimulator.rules';
import type { PlanSelection } from '@/components/PricingSimulator/PricingSimulator.types';
import type { ExamplePlan } from '@/data/content-pages';

/** HUD counter of a numbered section, e.g. `02 / 04`. */
export const formatCounter = (position: number, total: number) =>
  `${String(position).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

/** Every example has a few pages: the "2 to 4 pages" step of the slider. */
const EXAMPLE_PAGES = PAGE_TIERS.findIndex((tier) => tier.key === 'two_four') as PlanSelection['pages'];

/** The simulator plan of an example composition, with a domain name managed by the studio. */
export function buildExamplePlan({ formula, addOns }: ExamplePlan): PlanSelection {
  return normalizePlan({
    ...INITIAL_SELECTION,
    formula,
    ownDomain: false,
    pages: EXAMPLE_PAGES,
    addOns: { ...INITIAL_SELECTION.addOns, ...Object.fromEntries(addOns.map((key) => [key, true])) },
  });
}

import { INITIAL_SELECTION, PAGE_TIERS } from '@/components/PricingSimulator/constants';
import type { PricingTranslator } from '@/components/PricingSimulator/PricingSimulator.labels';
import { normalizePlan } from '@/components/PricingSimulator/PricingSimulator.rules';
import type { AddOnKey, PlanSelection } from '@/components/PricingSimulator/PricingSimulator.types';
import type { ExamplePlan } from '@/data/content-pages';
import type { Region } from '@/lib/region';

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

/** The simulator options a page recommends, as `TermList` items; `t` is scoped to `pricing.builder`. */
export function buildOptionTerms(t: PricingTranslator, options: readonly AddOnKey[], region: Region) {
  const domain = t(`options.example_domain.${region}`);
  return options.map((option) => ({
    term: t(`options.${option}.label`),
    description: t(`options.${option}.hint`, { domain }),
  }));
}

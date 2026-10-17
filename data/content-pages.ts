import type { CaseStudySlug } from '@/components/CaseStudy';
import type { AddOnKey, TieredKey } from '@/components/PricingSimulator/PricingSimulator.types';

/** What the showcase website page quotes from the rest of the site, read by the page and the files for AI agents. */
export const SHOWCASE_WEBSITE = {
  /** Options of the simulator worth adding to a showcase website, in display order. */
  options: ['contact_form', 'booking', 'reviews', 'english', 'news'],
  /** Case studies backing the page. */
  projects: ['choeurdespaysdumontblanc', 'mcomperat'],
} as const satisfies { options: readonly (AddOnKey | TieredKey)[]; projects: readonly CaseStudySlug[] };

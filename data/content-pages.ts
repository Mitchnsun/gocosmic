import type { CaseStudySlug } from '@/components/CaseStudy';
import type { AddOnKey, TieredKey } from '@/components/PricingSimulator/PricingSimulator.types';
import type { RouteKey } from '@/i18n/routing';

/** What the showcase website page quotes from the rest of the site, read by the page and the files for AI agents. */
export const SHOWCASE_WEBSITE = {
  /** Options of the simulator worth adding to a showcase website, in display order. */
  options: ['contact_form', 'booking', 'reviews', 'english', 'news'],
  /** Case studies backing the page. */
  projects: ['choeurdespaysdumontblanc', 'mcomperat'],
} as const satisfies { options: readonly (AddOnKey | TieredKey)[]; projects: readonly CaseStudySlug[] };

/** What the app development page quotes from the rest of the site. */
export const APP_DEVELOPMENT = {
  /** Case studies backing the page. */
  projects: ['daily-fortune', 'psc-supersprint'],
} as const satisfies { projects: readonly CaseStudySlug[] };

/**
 * Pages published in French only that other pages link to, each with the key of its label in
 * `contentPages.links`. A link to one is shown only where `hasRoute` holds, so never in another language.
 */
export const CONTENT_PAGE_LABELS = {
  '/showcase-website': 'showcase_website',
  '/app-development': 'app_development',
} as const satisfies Partial<Record<RouteKey, string>>;

type ContentPageRoute = keyof typeof CONTENT_PAGE_LABELS;

/** The footer's "Solutions & guides" column, in display order. */
export const FOOTER_SOLUTIONS: readonly ContentPageRoute[] = ['/showcase-website', '/app-development'];

/** The page each trade of the services page leads to, when it has one. */
export const TRADE_PAGES: Partial<Record<string, ContentPageRoute>> = {
  showcase: '/showcase-website',
  apps: '/app-development',
};

/** The pages each case study illustrates, linked under "See also". */
export const SEE_ALSO: Partial<Record<CaseStudySlug, readonly ContentPageRoute[]>> = {
  choeurdespaysdumontblanc: ['/showcase-website'],
  'psc-supersprint': ['/app-development'],
  'daily-fortune': ['/app-development'],
  mcomperat: ['/showcase-website'],
};

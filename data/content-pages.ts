import type { CaseStudySlug } from '@/components/CaseStudy';
import type { AddOnKey, Formula, TieredKey } from '@/components/PricingSimulator/PricingSimulator.types';
import type { RouteKey } from '@/i18n/routing';

/**
 * A composition of the simulator shown as an example on a page, priced with the current prices: a few pages and a
 * domain name managed by the studio, plus its add-ons (see `buildExamplePlan`).
 */
export interface ExamplePlan {
  formula: Formula;
  addOns: readonly AddOnKey[];
}

/** A source quoted by a page, with the key of its label in the page's `sources` messages. */
export interface Source {
  key: string;
  href: string;
}

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

/** What the website redesign page quotes: a site redone over the years, and the sources of its facts. */
export const WEBSITE_REDESIGN = {
  projects: ['coachnpulse'],
  sources: {
    /** Day the sources were read, `YYYY-MM-DD`: read them again before changing the facts they back. */
    consulted: '2026-10-21',
    items: [
      { key: 'wix_hosting', href: 'https://support.wix.com/en/article/exporting-or-embedding-your-wix-site-elsewhere' },
      {
        key: 'wix_domain',
        href: 'https://support.wix.com/en/article/transferring-your-wix-domain-away-from-wix-2477749',
      },
      { key: 'wordpress_export', href: 'https://wordpress.org/documentation/article/tools-export-screen/' },
      {
        key: 'google_site_move',
        href: 'https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes',
      },
    ],
  },
} as const satisfies { projects: readonly CaseStudySlug[]; sources: { consulted: string; items: readonly Source[] } };

/** What the page for associations and clubs quotes. */
export const WEBSITE_FOR_ASSOCIATIONS = {
  /** "You stay in control", so that the association publishes its own news. */
  example: { formula: 'self_service', addOns: [] },
  projects: ['choeurdespaysdumontblanc', 'psc-supersprint'],
} as const satisfies { example: ExamplePlan; projects: readonly CaseStudySlug[] };

/** What the page for tradespeople quotes; it has no case study yet. */
export const WEBSITE_FOR_TRADESPEOPLE = {
  /** Options of the simulator worth adding to a tradesperson's site, in display order. */
  options: ['contact_form', 'reviews', 'booking'],
  example: { formula: 'managed', addOns: ['contact_form', 'reviews'] },
} as const satisfies { options: readonly AddOnKey[]; example: ExamplePlan };

/** What the page for freelancers and liberal professions quotes. */
export const WEBSITE_FOR_FREELANCERS = {
  /** Options of the simulator worth adding to a freelancer's site, in display order. */
  options: ['booking', 'reviews', 'english', 'email'],
  example: { formula: 'managed', addOns: ['booking'] },
  projects: ['mcomperat'],
} as const satisfies { options: readonly AddOnKey[]; example: ExamplePlan; projects: readonly CaseStudySlug[] };

/**
 * Pages published in French only that other pages link to, each with the key of its label in
 * `contentPages.links`. A link to one is shown only where `hasRoute` holds, so never in another language.
 */
export const CONTENT_PAGE_LABELS = {
  '/showcase-website': 'showcase_website',
  '/app-development': 'app_development',
  '/website-redesign': 'website_redesign',
  '/website-for-associations': 'website_for_associations',
  '/website-for-tradespeople': 'website_for_tradespeople',
  '/website-for-freelancers': 'website_for_freelancers',
} as const satisfies Partial<Record<RouteKey, string>>;

type ContentPageRoute = keyof typeof CONTENT_PAGE_LABELS;

/** The footer's "Solutions & guides" column, in display order. */
export const FOOTER_SOLUTIONS: readonly ContentPageRoute[] = [
  '/showcase-website',
  '/app-development',
  '/website-redesign',
  '/website-for-associations',
  '/website-for-tradespeople',
  '/website-for-freelancers',
];

/** The page each trade of the services page leads to, when it has one. */
export const TRADE_PAGES: Partial<Record<string, ContentPageRoute>> = {
  showcase: '/showcase-website',
  apps: '/app-development',
};

/** The page the "Reinforcement" column of the services page leads to. */
export const REINFORCEMENT_PAGE: ContentPageRoute = '/website-redesign';

/** The page each audience card of the homepage leads to, when it has one. */
export const AUDIENCE_PAGES: Partial<Record<string, ContentPageRoute>> = {
  artisans: '/website-for-tradespeople',
  associations: '/website-for-associations',
  independents: '/website-for-freelancers',
};

/** The pages each case study illustrates, linked under "See also". */
export const SEE_ALSO: Partial<Record<CaseStudySlug, readonly ContentPageRoute[]>> = {
  choeurdespaysdumontblanc: ['/website-for-associations', '/showcase-website'],
  'psc-supersprint': ['/website-for-associations', '/app-development'],
  'daily-fortune': ['/app-development'],
  mcomperat: ['/website-for-freelancers', '/showcase-website'],
  coachnpulse: ['/website-redesign'],
};

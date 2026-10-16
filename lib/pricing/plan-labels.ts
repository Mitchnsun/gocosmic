import type {
  ARTICLE_TIERS,
  NEWS_TIERS,
  PAGE_TIERS,
  REPORT_TIERS,
  SEO_TIERS,
  UPDATE_TIERS,
} from '@/components/PricingSimulator/constants';
import type {
  AddOnKey,
  Formula,
  ProjectType,
  TierKeyOf,
  WebsiteType,
} from '@/components/PricingSimulator/PricingSimulator.types';

/*
 * Labels of the studio email. They are kept in one fixed language on purpose: the email is read by
 * the studio, not by the visitor, and a server-side map cannot be spoofed by a crafted payload
 * (same reasoning as the palette labels of the mockup email).
 */

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  website: 'A website',
  mobile: 'A mobile app',
  both: 'Both',
};

export const WEBSITE_TYPE_LABELS: Record<WebsiteType, string> = {
  showcase: 'Showcase site presenting the business',
  self_managed: 'Site the visitor wants to edit themselves',
  accounts: 'Site with a customer area',
  ecommerce: 'Online shop',
};

export const FORMULA_LABELS: Record<Formula, string> = {
  managed: 'We take care of everything',
  self_service: 'You stay in control (editing tool and news section included)',
};

export const ADD_ON_LABELS: Record<AddOnKey, string> = {
  domain: 'Domain name management',
  swiss_hosting: 'Hosting in Switzerland',
  email: 'Email address on the domain',
  contact_form: 'Contact form',
  booking: 'Online booking',
  reviews: 'Customer reviews',
  english: 'English version',
  detailed_analytics: 'Detailed statistics (consent banner)',
  redirects: 'Forwarding addresses (up to 5)',
};

/** Tier labels by slider, keyed by tier key: a tier added to a table without its label fails to compile. */
export const TIER_LABELS: {
  pages: Record<TierKeyOf<typeof PAGE_TIERS>, string>;
  updates: Record<TierKeyOf<typeof UPDATE_TIERS>, string>;
  news: Record<TierKeyOf<typeof NEWS_TIERS>, string>;
  analytics: Record<TierKeyOf<typeof REPORT_TIERS>, string>;
  seo: Record<TierKeyOf<typeof SEO_TIERS>, string>;
  articles: Record<TierKeyOf<typeof ARTICLE_TIERS>, string>;
} = {
  pages: {
    one: '1 page (included)',
    two_four: '2 to 4 pages',
    five_seven: '5 to 7 pages',
    eight_nine: '8 to 9 pages',
    ten_plus: '10 pages or more',
  },
  updates: {
    few_per_year: '2 to 3 times a year',
    monthly: 'Once a month',
    twice_monthly: 'Twice a month',
    weekly: 'Once a week',
    unlimited: 'As often as needed',
  },
  news: { quarterly: '1 news item a quarter', monthly: '1 news item a month', weekly: '1 news item a week' },
  analytics: { yearly: 'Yearly report', quarterly: 'Quarterly report', monthly: 'Monthly report' },
  seo: { quarterly: 'Every three months', monthly: 'Every month' },
  articles: {
    quarterly: '1 article a quarter',
    monthly: '1 article a month',
    weekly: '1 article a week',
    thrice_weekly: '3 articles a week',
  },
};

/** Label of a slider step of the studio email, e.g. `Quarterly report`. */
export const getTierLabel = (slider: keyof typeof TIER_LABELS, tier: string): string | undefined =>
  (TIER_LABELS[slider] as Record<string, string>)[tier];

/** Answer to "Do you already have a domain name?". */
export function getOwnDomainLabel(ownDomain: boolean | null): string {
  if (ownDomain === null) return 'Not answered';
  return ownDomain
    ? 'The client already has one: help with it is quoted on request'
    : 'None yet: managed by the studio (in the add-ons)';
}

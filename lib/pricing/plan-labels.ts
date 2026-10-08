import type {
  AddOnKey,
  Formula,
  ProjectType,
  TieredKey,
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
  news: 'News section',
  monitoring: 'Site monitoring',
  detailed_analytics: 'Detailed measurement (consent banner)',
  redirects: '5 email redirects',
};

/** Tier labels by slider, keyed by tier key. */
export const TIER_LABELS: Record<'pages' | 'updates' | TieredKey, Record<string, string>> = {
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
  analytics: { yearly: 'Yearly report', quarterly: 'Quarterly report', monthly: 'Monthly report' },
  seo: { quarterly: 'Every three months', monthly: 'Every month' },
  articles: { monthly: '1 article a month', weekly: '1 article a week', daily: '1 article a day' },
};

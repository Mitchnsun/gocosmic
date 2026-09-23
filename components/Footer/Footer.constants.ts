import type { ComponentProps } from 'react';

import type { Link } from '@/i18n/navigation';

type FooterLink = {
  /** Key in the `footer` message namespace. */
  labelKey:
    | 'link_services'
    | 'link_projects'
    | 'link_apps'
    | 'link_about'
    | 'link_contact'
    | 'legal_notice'
    | 'privacy';
  href: ComponentProps<typeof Link>['href'];
};

export const STUDIO_LINKS: FooterLink[] = [
  { labelKey: 'link_services', href: '/services' },
  { labelKey: 'link_projects', href: '/projects' },
  { labelKey: 'link_apps', href: '/projects/daily-fortune' },
  { labelKey: 'link_about', href: '/about' },
  { labelKey: 'link_contact', href: '/contact' },
];

export const LEGAL_LINKS: FooterLink[] = [
  { labelKey: 'legal_notice', href: '/legal-notice' },
  { labelKey: 'privacy', href: '/privacy' },
];

export const FOOTER_LINK_CLASS =
  'font-display text-ghost/75 hover:text-ghost focus-visible:ring-aerospace/70 rounded text-[15px] transition-colors focus-visible:ring-2 focus-visible:outline-none';

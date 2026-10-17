import type { ComponentProps, ReactNode } from 'react';

import type { BreadcrumbItem } from '@/components/Breadcrumb';
import type { Link } from '@/i18n/navigation';

type LocalizedHref = ComponentProps<typeof Link>['href'];

/** A page suggested at the bottom of a content page. */
export interface RelatedPage {
  title: string;
  /** One sentence saying what the visitor finds there. */
  description: string;
  href: LocalizedHref;
}

export interface RelatedPagesProps {
  eyebrow: string;
  title: string;
  /** Two or three pages, all published in the page's language. */
  pages: RelatedPage[];
}

/** Props of the service and guide page template; every string comes in already localized. */
export interface ContentPageProps {
  /** The pages between the home page and this one, then this page, e.g. Services › Showcase website. */
  breadcrumb: BreadcrumbItem[];
  eyebrow: string;
  /** Page title, rendered as the `h1`; `<em>` renders as the light italic emphasis. */
  title: ReactNode;
  /** Standfirst under the title. */
  lead: string;
  /** The page's sections. */
  children: ReactNode;
  related: RelatedPagesProps;
  /** Closing call to action. */
  cta: {
    headline: string;
    description: string;
    button: string;
    href: LocalizedHref;
    /** Optional line between the description and the button. */
    note?: ReactNode;
  };
}

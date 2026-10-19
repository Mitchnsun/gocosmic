import type { ComponentProps, ReactNode } from 'react';

import type { BreadcrumbItem } from '@/components/Breadcrumb';
import type { Link } from '@/i18n/navigation';

type LocalizedHref = ComponentProps<typeof Link>['href'];

/** A page suggested at the bottom of a content page, keyed as in `contentPages.links`. */
export type RelatedPage = 'pricing' | 'projects' | 'services';

/**
 * Props of the service and guide page template; every string comes in already localized. The template also reads
 * the `contentPages` messages, published in French only: add that file's language before publishing a page in it.
 */
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
  /** The two pages suggested before the call to action, all published in the page's language. */
  related: readonly [RelatedPage, RelatedPage];
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

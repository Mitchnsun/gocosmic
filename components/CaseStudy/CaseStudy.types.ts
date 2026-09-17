import type { ComponentProps, ReactNode } from 'react';

import type { AccentToken } from '@/design-system/accent';
import type { Link } from '@/i18n/navigation';

export type LocalizedHref = ComponentProps<typeof Link>['href'];

/** Image rendered in the case study hero. */
export interface CaseStudyImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/** One content section of a case study (overview, challenge, solution…). */
export interface CaseStudySectionData {
  /** Anchor id, unique within the page. */
  id: string;
  /** Section heading. */
  title: string;
  /** Uppercase mono eyebrow. Defaults to the section title when omitted. */
  label?: string;
  /** Lead paragraph. */
  content?: string;
  /** Second paragraph rendered below the bullet points. */
  secondary?: string;
  /** Bullet points. */
  points?: string[];
  /** Mono label above the bullet points. */
  pointsLabel?: string;
  /** Bullet columns from the `md` breakpoint. Defaults to `1`. */
  columns?: 1 | 2;
  /** Accent colour override for the section. */
  accent?: AccentToken;
}

/** Closing call-to-action of a case study. */
export interface CaseStudyCta {
  title: string;
  description: string;
  /** Label of the primary button. */
  button: string;
  /** External destination. Omit to render the button as disabled. */
  href?: string;
  /** Accessible name for the primary button. */
  ariaLabel?: string;
}

/** Link to the previous or next case study. */
export interface CaseStudyNavLink {
  /** Localized route of the neighbouring case study. */
  href: LocalizedHref;
  /** Project name. */
  title: string;
}

/** Props of the reusable case study template. */
export interface CaseStudyProps {
  /** Uppercase mono eyebrow, e.g. `Case study`. */
  eyebrow: string;
  /** Project name, rendered as the `h1`. */
  title: string;
  /** One-line positioning of the project. */
  tagline: string;
  /** Full-width hero image. */
  heroImage?: CaseStudyImage;
  /** Small logo or app icon displayed above the headline. */
  logo?: CaseStudyImage;
  /** Mono HUD metadata (year, role, stack…). */
  meta?: string[];
  /** Ordered content sections. */
  sections: CaseStudySectionData[];
  /** Closing call-to-action. */
  cta?: CaseStudyCta;
  /** Label and destination of the "discuss a similar project" link. */
  contactCta?: { label: string; href: LocalizedHref };
  /** Previous / next navigation. */
  navigation?: {
    previous?: CaseStudyNavLink;
    next?: CaseStudyNavLink;
    previousLabel: string;
    nextLabel: string;
    ariaLabel: string;
  };
  /** Accent colour for the page. Defaults to `'aerospace'`. */
  accent?: AccentToken;
  /** Extra content rendered after the sections. */
  children?: ReactNode;
}

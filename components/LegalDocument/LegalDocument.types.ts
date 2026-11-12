import type { ReactNode } from 'react';

/**
 * A paragraph: plain text, text opened by a few words in bold (`lead`), as the app legal notices write them, or a
 * bulleted list (`items`), as a licence file writes one.
 */
export type LegalParagraph = string | { lead?: string; text: string } | { items: readonly string[] };

/** A link under a section's paragraphs; a site opens in a new tab, an email address in the mail app. */
export interface LegalLink {
  label: string;
  href: string;
}

export interface LegalSection {
  title: string;
  body: readonly LegalParagraph[];
  /** Anchor of the section (`notice`), so that a link can open the page on it. */
  id?: string;
  links?: readonly LegalLink[];
  /** Content after the paragraphs, e.g. the notice of each version of an app. */
  children?: ReactNode;
}

/** A section as the site's own legal messages write it: plain paragraphs, nothing else. */
export interface PlainLegalSection {
  title: string;
  body: string[];
}

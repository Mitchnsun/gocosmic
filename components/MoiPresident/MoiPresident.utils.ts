import type { LegalSection } from '@/components/LegalDocument';
import {
  type AppRelease,
  getFiledNoticeUrl,
  MOI_PRESIDENT_LINKS,
  MOI_PRESIDENT_RELEASES,
  type MoiPresidentLinkId,
} from '@/data/moi-president';

import type { MoiPresidentLegalPage, MoiPresidentLegalRoute } from './MoiPresident.types';

/** The calls made on next-intl's translator, scoped to `moiPresidentLegal` or `moiPresident`. */
export interface Translator {
  (key: string, values?: Record<string, string | number>): string;
  raw: (key: string) => unknown;
}

/**
 * The game's legal notice, in the app's order (Mitchnsun/moi-president#514): art. 1-1 of the LCEN, its other
 * sections now on « À propos du jeu ».
 */
export const LEGAL_NOTICE_SECTIONS = ['publisher', 'director', 'hosts', 'distribution', 'reply'] as const;

/** The terms of use: a preamble, then thirteen numbered articles (Mitchnsun/moi-president#512). */
export const TERMS_SECTIONS = [
  'preamble',
  'object',
  'access',
  'licence',
  'usage',
  'property',
  'thirdParties',
  'data',
  'liability',
  'changes',
  'term',
  'law',
  'severability',
  'stores',
] as const;

/** The privacy policy, in the app's order (Mitchnsun/moi-president#513). */
export const PRIVACY_SECTIONS = [
  'summary',
  'who',
  'nothingSent',
  'support',
  'onDevice',
  'backups',
  'erase',
  'kit',
  'links',
  'permissions',
  'website',
  'changes',
  'rights',
  'contact',
] as const;

/**
 * « À propos du jeu », the sections that left the legal notice, in the app's order: its costings stay in the app
 * (owner, 11/11/2026).
 */
export const ABOUT_SECTIONS = ['game', 'figures', 'notice', 'sources', 'credits'] as const;

/** The game's legal pages, in the app's order, and their routes. */
export const LEGAL_PAGES: readonly { page: MoiPresidentLegalPage; route: MoiPresidentLegalRoute }[] = [
  { page: 'legalNotice', route: '/apps/moi-president/legal-notice' },
  { page: 'terms', route: '/apps/moi-president/terms' },
  { page: 'privacy', route: '/apps/moi-president/privacy' },
  { page: 'about', route: '/apps/moi-president/about' },
];

/** The links at the end of a section, as in the app (`SECTION_LINKS` and `DOCUMENT_LINKS` of its `utils/legal.ts`). */
const SECTION_LINKS: Record<MoiPresidentLegalPage, Partial<Record<string, readonly MoiPresidentLinkId[]>>> = {
  legalNotice: { reply: ['email'] },
  terms: { property: ['email'], stores: ['appleEula'] },
  privacy: {
    support: ['email'],
    kit: ['githubPrivacy'],
    rights: ['email'],
    contact: ['email', 'pfpdt', 'cnil'],
  },
  about: { notice: ['commission'], sources: ['commission'] },
};

/**
 * A page's sections from its messages: every paragraph formatted with `values`, then its section's links. The
 * terms number their articles after the preamble, as the app does.
 */
function buildSections(
  t: Translator,
  page: MoiPresidentLegalPage,
  ids: readonly string[],
  values: Record<string, string | number> = {}
): LegalSection[] {
  return ids.map((id, index) => {
    const key = `${page}.sections.${id}`;
    const paragraphs = t.raw(`${key}.paragraphs`) as { lead?: string; text: string }[];
    const title = t(`${key}.title`);
    return {
      id,
      title: page === 'terms' && index > 0 ? `${index}. ${title}` : title,
      body: paragraphs.map(({ lead }, paragraph) => ({ lead, text: t(`${key}.paragraphs.${paragraph}.text`, values) })),
      links: (SECTION_LINKS[page][id] ?? []).map((link) => ({
        label: t(`links.${link}`),
        href: MOI_PRESIDENT_LINKS[link],
      })),
    };
  });
}

/**
 * « À propos du jeu », the app's sections word for word (the app prevails, PO, 25/11/2026). Once the notice of the
 * latest version is filed with the Commission des sondages, the notice section also links to it.
 */
export function buildAboutSections(
  t: Translator,
  releases: readonly AppRelease[] = MOI_PRESIDENT_RELEASES
): LegalSection[] {
  const filedNoticeUrl = getFiledNoticeUrl(releases);
  const sections = buildSections(t, 'about', ABOUT_SECTIONS);
  if (!filedNoticeUrl) return sections;

  return sections.map((section) =>
    section.id === 'notice'
      ? {
          ...section,
          links: [{ label: t('about.sections.notice.filed_link'), href: filedNoticeUrl }, ...(section.links ?? [])],
        }
      : section
  );
}

/** The legal notice's sections. */
export function buildLegalNoticeSections(t: Translator): LegalSection[] {
  return buildSections(t, 'legalNotice', LEGAL_NOTICE_SECTIONS);
}

/** The terms' sections: the preamble states the version in force and its date (`values`). */
export function buildTermsSections(t: Translator, values: { version: number; date: string }): LegalSection[] {
  return buildSections(t, 'terms', TERMS_SECTIONS, values);
}

/** The privacy policy's sections. */
export function buildPrivacySections(t: Translator): LegalSection[] {
  return buildSections(t, 'privacy', PRIVACY_SECTIONS);
}

import type { LegalSection } from '@/components/LegalDocument';
import {
  type AppRelease,
  getFiledNoticeUrl,
  MOI_PRESIDENT_LINKS,
  MOI_PRESIDENT_RELEASES,
  type MoiPresidentLinkId,
} from '@/data/moi-president';

/** The calls made on next-intl's translator, scoped to `moiPresidentLegal` or `moiPresident`. */
export interface Translator {
  (key: string, values?: Record<string, string | number>): string;
  raw: (key: string) => unknown;
}

/**
 * The legal notice's sections, in the app's order: its costings stay in the app, and its personal data are the
 * privacy page (owner, 11/11/2026).
 */
export const LEGAL_NOTICE_SECTIONS = [
  'game',
  'figures',
  'notice',
  'sources',
  'publisher',
  'liability',
  'terms',
  'credits',
  'contact',
] as const;

/** The privacy policy's sections: the paragraphs of the app's « Données personnelles ». */
export const PRIVACY_SECTIONS = ['data', 'permissions', 'sharing', 'deletion', 'kit', 'changes', 'contact'] as const;

/** The links at the end of a section, as in the app (`SECTION_LINKS` of its `utils/legal.ts`). */
const SECTION_LINKS: Record<string, Partial<Record<string, readonly MoiPresidentLinkId[]>>> = {
  legalNotice: { notice: ['commission'], sources: ['commission'], contact: ['email'] },
  privacy: { contact: ['email', 'pfpdt', 'cnil'] },
};

/** A page's sections from its messages: every paragraph formatted with `values`, then its section's links. */
function buildSections(
  t: Translator,
  page: 'legalNotice' | 'privacy',
  ids: readonly string[],
  values: Record<string, string> = {}
): LegalSection[] {
  return ids.map((id) => {
    const key = `${page}.sections.${id}`;
    const paragraphs = t.raw(`${key}.paragraphs`) as { lead?: string; text: string }[];
    return {
      id,
      title: t(`${key}.title`),
      body: paragraphs.map(({ lead }, index) => ({ lead, text: t(`${key}.paragraphs.${index}.text`, values) })),
      links: (SECTION_LINKS[page]?.[id] ?? []).map((link) => ({
        label: t(`links.${link}`),
        href: MOI_PRESIDENT_LINKS[link],
      })),
    };
  });
}

/**
 * The legal notice's sections. The sentences saying the notice of the simulation can be consulted at the
 * Commission des sondages only show once the notice of the latest version is filed (owner, 11/11/2026); the
 * notice section then links to it.
 */
export function buildLegalNoticeSections(
  t: Translator,
  releases: readonly AppRelease[] = MOI_PRESIDENT_RELEASES
): LegalSection[] {
  const filedNoticeUrl = getFiledNoticeUrl(releases);
  const sections = buildSections(t, 'legalNotice', LEGAL_NOTICE_SECTIONS, { filed: filedNoticeUrl ? 'yes' : 'no' });
  if (!filedNoticeUrl) return sections;

  return sections.map((section) =>
    section.id === 'notice'
      ? {
          ...section,
          body: [...section.body, t('legalNotice.sections.notice.filed')],
          links: [
            { label: t('legalNotice.sections.notice.filed_link'), href: filedNoticeUrl },
            ...(section.links ?? []),
          ],
        }
      : section
  );
}

/** The privacy policy's sections. */
export function buildPrivacySections(t: Translator): LegalSection[] {
  return buildSections(t, 'privacy', PRIVACY_SECTIONS);
}

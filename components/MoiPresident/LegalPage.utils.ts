import { formatReleaseDate } from '@/components/CaseStudy/CaseStudy.utils';
import type { LegalSection } from '@/components/LegalDocument';
import { MOI_PRESIDENT_TERMS_VERSIONS, type TermsVersion } from '@/data/moi-president';

import type { MoiPresidentLegalPage, MoiPresidentLegalRoute } from './MoiPresident.types';
import { LEGAL_PAGES, type Translator } from './MoiPresident.utils';

/** A legal page's closing note: a sentence, then the game's other legal pages. */
export interface LegalPointer {
  prefix: string;
  links: { label: string; href: MoiPresidentLegalRoute }[];
}

/** The links of a legal page's closing note: the game's other legal pages, in the app's order. */
export function buildLegalPointer(t: Translator, current: MoiPresidentLegalPage): LegalPointer {
  return {
    prefix: t('documents'),
    links: LEGAL_PAGES.filter(({ page }) => page !== current).map(({ page, route }) => ({
      label: t(`${page}.title`),
      href: route,
    })),
  };
}

/** The date line of a page, as the app writes it: « Mise à jour le 25 novembre 2026 ». */
export function formatDocumentDate(t: Translator, page: MoiPresidentLegalPage, iso: string, locale: string): string {
  return t(`${page}.version`, { date: formatReleaseDate(iso, locale) });
}

/**
 * The terms in force and the section listing every version, the one in force first and said so (art. 9 of the
 * terms: the previous versions stay readable).
 */
export function buildTermsVersions(
  t: Translator,
  locale: string,
  versions: readonly [TermsVersion, ...TermsVersion[]] = MOI_PRESIDENT_TERMS_VERSIONS
): { current: { version: number; date: string }; section: LegalSection } {
  const dated = versions.map(({ version, effective }) => ({ version, date: formatReleaseDate(effective, locale) }));
  return {
    current: dated[0] as { version: number; date: string },
    section: {
      id: 'versions',
      title: t('terms.versions.title'),
      body: dated.map((version, index) =>
        index === 0
          ? `${t('terms.versions.item', version)} (${t('terms.versions.current')})`
          : t('terms.versions.item', version)
      ),
    },
  };
}

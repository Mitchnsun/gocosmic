import { formatReleaseDate } from '@/components/CaseStudy/CaseStudy.utils';

import type { MoiPresidentLegalPage, MoiPresidentLegalRoute } from './MoiPresident.types';
import { LEGAL_PAGES, type Translator } from './MoiPresident.utils';

/** The links of a legal page's closing note: the game's other legal pages, in the app's order. */
export function buildLegalPointer(
  t: Translator,
  current: MoiPresidentLegalPage
): { prefix: string; links: { label: string; href: MoiPresidentLegalRoute }[] } {
  return {
    prefix: t('documents'),
    links: LEGAL_PAGES.filter(({ page }) => page !== current).map(({ page, route }) => ({
      label: t(`${page}.title`),
      href: route,
    })),
  };
}

/** The date line of a document, as the app writes it: « Mise à jour le 25 novembre 2026 ». */
export function formatDocumentDate(t: Translator, page: MoiPresidentLegalPage, iso: string, locale: string): string {
  return t(`${page}.version`, { date: formatReleaseDate(iso, locale) });
}

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LegalDocument } from '@/components/LegalDocument';
import {
  buildLegalNoticeSections,
  buildLegalPointer,
  formatDocumentDate,
  LegalPagePointer,
} from '@/components/MoiPresident';
import { MOI_PRESIDENT_LEGAL_DATES } from '@/data/moi-president';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/apps/moi-president/legal-notice';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'moiPresidentLegal' });

  return buildPageMetadata({
    locale,
    routeKey: ROUTE,
    title: t('legalNotice.meta.title'),
    description: t('legalNotice.meta.description'),
    // Legal pages stay reachable but out of search results and the sitemap.
    robots: { index: false, follow: true },
  });
}

/**
 * Moi Président's legal notice, in French and English (Mitchnsun/moi-president#514): art. 1-1 of the LCEN, the
 * app's text word for word. The game's own sections, the notice of the simulation among them, are on « À propos du
 * jeu ».
 */
export default async function MoiPresidentLegalNoticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('moiPresidentLegal');

  return (
    <LegalDocument
      eyebrow={t('eyebrow')}
      title={t('legalNotice.title')}
      updated={formatDocumentDate(t, 'legalNotice', MOI_PRESIDENT_LEGAL_DATES.legalNotice, locale)}
      sections={buildLegalNoticeSections(t)}>
      <LegalPagePointer {...buildLegalPointer(t, 'legalNotice')} />
    </LegalDocument>
  );
}

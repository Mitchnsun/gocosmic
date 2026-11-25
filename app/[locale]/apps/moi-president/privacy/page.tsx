import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LegalDocument } from '@/components/LegalDocument';
import {
  buildLegalPointer,
  buildPrivacySections,
  formatDocumentDate,
  LegalPagePointer,
} from '@/components/MoiPresident';
import { MOI_PRESIDENT_LEGAL_DATES } from '@/data/moi-president';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/apps/moi-president/privacy';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'moiPresidentLegal' });

  return buildPageMetadata({
    locale,
    routeKey: ROUTE,
    title: t('privacy.meta.title'),
    description: t('privacy.meta.description'),
    // Legal pages stay reachable but out of search results and the sitemap.
    robots: { index: false, follow: true },
  });
}

/**
 * Moi Président's privacy policy, the privacy URL of both stores, in French and English
 * (Mitchnsun/moi-president#513): the app's text word for word.
 */
export default async function MoiPresidentPrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('moiPresidentLegal');

  return (
    <LegalDocument
      eyebrow={t('eyebrow')}
      title={t('privacy.title')}
      updated={formatDocumentDate(t, 'privacy', MOI_PRESIDENT_LEGAL_DATES.privacy, locale)}
      sections={buildPrivacySections(t)}>
      <LegalPagePointer {...buildLegalPointer(t, 'privacy')} />
    </LegalDocument>
  );
}

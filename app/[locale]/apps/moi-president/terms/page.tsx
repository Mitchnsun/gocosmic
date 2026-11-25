import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LegalDocument } from '@/components/LegalDocument';
import { buildLegalPointer, buildTermsSections, buildTermsVersions, LegalPagePointer } from '@/components/MoiPresident';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/apps/moi-president/terms';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'moiPresidentLegal' });

  return buildPageMetadata({
    locale,
    routeKey: ROUTE,
    title: t('terms.meta.title'),
    description: t('terms.meta.description'),
    // Legal pages stay reachable but out of search results and the sitemap.
    robots: { index: false, follow: true },
  });
}

/**
 * Moi Président's terms of use, in French and English (Mitchnsun/moi-president#512): the app's text word for word,
 * the version in force, then the list of every version with the day it applied from (art. 10 of the terms).
 */
export default async function MoiPresidentTermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('moiPresidentLegal');
  const { current, section } = buildTermsVersions(t, locale);

  return (
    <LegalDocument
      eyebrow={t('eyebrow')}
      title={t('terms.title')}
      updated={t('terms.version', current)}
      sections={[...buildTermsSections(t, current), section]}>
      <LegalPagePointer {...buildLegalPointer(t, 'terms')} />
    </LegalDocument>
  );
}

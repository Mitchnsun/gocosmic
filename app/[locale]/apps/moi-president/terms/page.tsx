import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { formatReleaseDate } from '@/components/CaseStudy/CaseStudy.utils';
import { LegalDocument } from '@/components/LegalDocument';
import { buildLegalPointer, buildTermsSections, LegalPagePointer } from '@/components/MoiPresident';
import { MOI_PRESIDENT_TERMS_VERSIONS } from '@/data/moi-president';
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
  const versions = MOI_PRESIDENT_TERMS_VERSIONS.map(({ version, effective }) => ({
    version,
    date: formatReleaseDate(effective, locale),
  }));
  const current = versions[0] ?? { version: 1, date: '' };
  const versionsSection = {
    id: 'versions',
    title: t('terms.versions.title'),
    body: versions.map(
      ({ version, date }, index) =>
        `${t('terms.versions.item', { version, date })}${index === 0 ? ` (${t('terms.versions.current')})` : ''}`
    ),
  };

  return (
    <LegalDocument
      eyebrow={t('eyebrow')}
      title={t('terms.title')}
      updated={t('terms.version', current)}
      sections={[...buildTermsSections(t, current), versionsSection]}>
      <LegalPagePointer {...buildLegalPointer(t, 'terms')} />
    </LegalDocument>
  );
}

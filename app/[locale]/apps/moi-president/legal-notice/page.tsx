import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LegalDocument } from '@/components/LegalDocument';
import {
  buildCorrection,
  buildLegalNoticeSections,
  buildReleaseNotices,
  CorrectionNotice,
  LegalPagePointer,
  ReleaseNotice,
} from '@/components/MoiPresident';
import { MOI_PRESIDENT_CORRECTION } from '@/data/moi-president';
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
 * Moi Président's legal notice, in French and English (#176): the app's texts, with the notice of the simulation
 * (law no. 77-808) and one section per published version, the latest first.
 */
export default async function MoiPresidentLegalNoticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('moiPresidentLegal');
  const correction = buildCorrection(await getTranslations('moiPresident'), locale, MOI_PRESIDENT_CORRECTION);
  const releases = buildReleaseNotices(t, locale).map((release) => <ReleaseNotice key={release.id} {...release} />);
  const sections = buildLegalNoticeSections(t).map((section) =>
    section.id === 'notice' ? { ...section, children: releases } : section
  );

  return (
    <LegalDocument
      eyebrow={t('eyebrow')}
      title={t('legalNotice.title')}
      updated={t('updated')}
      intro={t('legalNotice.intro')}
      sections={sections}
      banner={correction && <CorrectionNotice {...correction} />}>
      <LegalPagePointer
        prefix={t('legalNotice.privacyPrefix')}
        label={t('legalNotice.privacyLink')}
        href="/apps/moi-president/privacy"
      />
    </LegalDocument>
  );
}

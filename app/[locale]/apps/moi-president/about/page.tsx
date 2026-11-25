import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LegalDocument } from '@/components/LegalDocument';
import {
  buildAboutSections,
  buildCorrection,
  buildLegalPointer,
  buildReleaseNotices,
  CorrectionNotice,
  LegalPagePointer,
  ReleaseNotice,
} from '@/components/MoiPresident';
import { MOI_PRESIDENT_CORRECTION } from '@/data/moi-president';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/apps/moi-president/about';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'moiPresidentLegal' });

  return buildPageMetadata({
    locale,
    routeKey: ROUTE,
    title: t('about.meta.title'),
    description: t('about.meta.description'),
    // Legal pages stay reachable but out of search results and the sitemap.
    robots: { index: false, follow: true },
  });
}

/**
 * « À propos du jeu », in French and English (Mitchnsun/moi-president#514): the sections that left the game's legal
 * notice, with the notice of the simulation (law no. 77-808) and one section per published version, the latest
 * first.
 */
export default async function MoiPresidentAboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('moiPresidentLegal');
  const correction = buildCorrection(await getTranslations('moiPresident'), locale, MOI_PRESIDENT_CORRECTION);
  const releases = buildReleaseNotices(t, locale).map((release) => <ReleaseNotice key={release.id} {...release} />);
  const sections = buildAboutSections(t).map((section) =>
    section.id === 'notice' ? { ...section, children: releases } : section
  );

  return (
    <LegalDocument
      eyebrow={t('eyebrow')}
      title={t('about.title')}
      updated={t('about.updated')}
      intro={t('about.intro')}
      sections={sections}
      banner={correction && <CorrectionNotice {...correction} />}>
      <LegalPagePointer {...buildLegalPointer(t, 'about')} />
    </LegalDocument>
  );
}

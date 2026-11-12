import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LegalDocument } from '@/components/LegalDocument';
import { buildPrivacySections, LegalPagePointer } from '@/components/MoiPresident';
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

/** Moi Président's privacy policy, the privacy URL of both stores, in French and English (#176). */
export default async function MoiPresidentPrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('moiPresidentLegal');

  return (
    <LegalDocument
      eyebrow={t('eyebrow')}
      title={t('privacy.title')}
      updated={t('updated')}
      intro={t('privacy.intro')}
      sections={buildPrivacySections(t)}>
      <LegalPagePointer
        prefix={t('privacy.legalNoticePrefix')}
        label={t('privacy.legalNoticeLink')}
        href="/apps/moi-president/legal-notice"
      />
    </LegalDocument>
  );
}

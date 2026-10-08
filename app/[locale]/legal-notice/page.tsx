import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LegalDocument, type LegalSection } from '@/components/LegalDocument';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return buildPageMetadata({
    locale,
    routeKey: '/legal-notice',
    title: t('legalNotice.meta.title'),
    description: t('legalNotice.meta.description'),
    // Legal pages stay reachable but out of search results and the sitemap.
    robots: { index: false, follow: true },
  });
}

export default async function LegalNoticePage() {
  const t = await getTranslations('legal');

  return (
    <LegalDocument
      eyebrow={t('legalNotice.eyebrow')}
      title={t('legalNotice.title')}
      updated={t('legalNotice.updated')}
      intro={t('legalNotice.intro')}
      sections={t.raw('legalNotice.sections') as LegalSection[]}
    />
  );
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LegalDocument, type LegalSection } from '@/components/LegalDocument';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return buildPageMetadata({
    locale,
    routeKey: '/terms',
    title: t('terms.meta.title'),
    description: t('terms.meta.description'),
    // Legal pages stay reachable but out of search results and the sitemap.
    robots: { index: false, follow: true },
  });
}

export default async function TermsPage() {
  const t = await getTranslations('legal');

  return (
    <LegalDocument
      eyebrow={t('terms.eyebrow')}
      title={t('terms.title')}
      updated={t('terms.updated')}
      intro={t('terms.intro')}
      sections={t.raw('terms.sections') as LegalSection[]}
    />
  );
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LegalDocument, type LegalSection } from '@/components/LegalDocument';
import { Link } from '@/i18n/navigation';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return buildPageMetadata({
    locale,
    routeKey: '/privacy',
    title: t('privacy.meta.title'),
    description: t('privacy.meta.description'),
    // Legal pages stay reachable but out of search results and the sitemap.
    robots: { index: false, follow: true },
  });
}

export default async function PrivacyPage() {
  const t = await getTranslations('legal');

  return (
    <LegalDocument
      eyebrow={t('privacy.eyebrow')}
      title={t('privacy.title')}
      updated={t('privacy.updated')}
      intro={t('privacy.intro')}
      sections={t.raw('privacy.sections') as LegalSection[]}>
      <p className="border-line-2 text-fg-2 rounded-2xl border p-5">
        {t('privacy.legalNoticePrefix')}{' '}
        <Link
          href="/legal-notice"
          className="text-fg hover:text-aerospace-ink underline underline-offset-4 transition-colors">
          {t('privacy.legalNoticeLink')}
        </Link>
        .
      </p>
    </LegalDocument>
  );
}

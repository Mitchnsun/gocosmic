import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LegalDocument, type LegalSection } from '@/components/LegalDocument';
import { getAlternates } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return {
    title: t('privacy.meta.title'),
    description: t('privacy.meta.description'),
    alternates: getAlternates(locale, '/privacy'),
  };
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
      <p className="border-ghost/15 text-ghost/70 rounded-2xl border p-5">
        {t('privacy.legalNoticePrefix')}{' '}
        <Link
          href="/legal-notice"
          className="text-ghost hover:text-aerospace underline underline-offset-4 transition-colors">
          {t('privacy.legalNoticeLink')}
        </Link>
        .
      </p>
    </LegalDocument>
  );
}

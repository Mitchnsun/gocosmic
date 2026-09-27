import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LegalDocument, type LegalSection } from '@/components/LegalDocument';
import { getAlternates } from '@/i18n/canonical';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return {
    title: t('legalNotice.meta.title'),
    description: t('legalNotice.meta.description'),
    alternates: getAlternates(locale, '/legal-notice'),
  };
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

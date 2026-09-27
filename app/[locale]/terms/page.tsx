import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LegalDocument, type LegalSection } from '@/components/LegalDocument';
import { getAlternates } from '@/i18n/canonical';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return {
    title: t('terms.meta.title'),
    description: t('terms.meta.description'),
    alternates: getAlternates(locale, '/terms'),
  };
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

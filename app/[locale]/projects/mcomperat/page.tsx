import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { buildCaseStudyNavigation, CaseStudy } from '@/components/CaseStudy';
import { getCanonicalUrl } from '@/i18n/canonical';
import { getOgImages } from '@/lib/og';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'mcomperat' });

  const title = t('title');
  const description = t('subtitle');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/projects/mcomperat'),
    },
    openGraph: {
      title,
      description,
      images: [og],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [twitter],
    },
  };
}

export default function Mcomperat() {
  const t = useTranslations('mcomperat');
  const tCommon = useTranslations('case_study');
  const tList = useTranslations('projectsList');

  return (
    <CaseStudy
      eyebrow={tCommon('eyebrow')}
      title={t('title')}
      tagline={t('subtitle')}
      accent="aerospace"
      meta={['2026', 'Next.js · TypeScript', 'Web']}
      sections={[
        {
          id: 'overview',
          title: t('overview.title'),
          content: t('overview.description'),
          secondary: t('overview.architecture'),
        },
        {
          id: 'features',
          title: t('features.title'),
          columns: 2,
          points: [
            t('features.items.i18n'),
            t('features.items.seo'),
            t('features.items.performance'),
            t('features.items.accessibility'),
            t('features.items.quality'),
          ],
        },
        {
          id: 'technology',
          title: t('technology.title'),
          content: t('technology.description'),
          columns: 2,
          points: [
            t('technology.stack.nextjs'),
            t('technology.stack.typescript'),
            t('technology.stack.tailwind'),
            t('technology.stack.yarn'),
          ],
        },
        {
          id: 'ai',
          title: t('ai.title'),
          content: t('ai.description'),
          columns: 2,
          points: [
            t('ai.features.development'),
            t('ai.features.quality'),
            t('ai.features.content'),
            t('ai.features.i18n'),
          ],
        },
      ]}
      cta={{
        title: t('cta.title'),
        description: t('cta.description'),
        button: t('cta.button'),
        href: 'https://www.mcomper.at/',
        ariaLabel: t('cta.ariaLabel'),
      }}
      contactCta={{ label: tCommon('contact_cta'), href: '/contact' }}
      navigation={buildCaseStudyNavigation(
        'mcomperat',
        { previous: tCommon('previous'), next: tCommon('next'), ariaLabel: tCommon('nav_label') },
        (titleKey) => tList(`items.${titleKey}.title`)
      )}
    />
  );
}

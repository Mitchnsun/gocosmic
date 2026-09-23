import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { buildCaseStudyNavigation, CaseStudy } from '@/components/CaseStudy';
import { getCanonicalUrl } from '@/i18n/canonical';
import { getOgImages } from '@/lib/og';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dailyFortune' });

  const title = t('title');
  const description = t('subtitle');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/projects/daily-fortune'),
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

export default function DailyFortune() {
  const t = useTranslations('dailyFortune');
  const tCommon = useTranslations('case_study');
  const tList = useTranslations('projectsList');

  return (
    <CaseStudy
      eyebrow={tCommon('eyebrow')}
      title={t('title')}
      tagline={t('subtitle')}
      accent="royal"
      logo={{ src: '/projects/daily-fortune/app-icon.png', alt: t('title') }}
      meta={['2026', 'React Native · Expo', 'Mobile']}
      sections={[
        {
          id: 'overview',
          title: t('overview.title'),
          content: t('overview.description'),
          secondary: t('overview.motivation'),
        },
        {
          id: 'features',
          title: t('features.title'),
          columns: 2,
          points: [
            t('features.items.daily'),
            t('features.items.motivation'),
            t('features.items.modern'),
            t('features.items.cosmic'),
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
            t('technology.stack.native'),
          ],
        },
        { id: 'ai', title: t('ai.title'), content: t('ai.description') },
      ]}
      cta={{
        title: t('cta.title'),
        description: t('cta.description'),
        button: t('cta.button'),
        href: 'https://apps.apple.com/app/id6754465790',
        ariaLabel: t('cta.ariaLabel'),
      }}
      contactCta={{ label: tCommon('contact_cta'), href: '/contact' }}
      navigation={buildCaseStudyNavigation(
        'daily-fortune',
        { previous: tCommon('previous'), next: tCommon('next'), ariaLabel: tCommon('nav_label') },
        (titleKey) => tList(`items.${titleKey}.title`)
      )}
    />
  );
}

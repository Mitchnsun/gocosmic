import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { buildCaseStudyNavigation, CaseStudy } from '@/components/CaseStudy';
import { getCanonicalUrl } from '@/i18n/canonical';
import { getOgImages } from '@/lib/og';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'choeurDesPaysduMontBlanc' });

  const title = t('title');
  const description = t('subtitle');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/projects/choeurdespaysdumontblanc'),
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

export default function ChoeurDesPaysduMontBlanc() {
  const t = useTranslations('choeurDesPaysduMontBlanc');
  const tCommon = useTranslations('case_study');
  const tList = useTranslations('projectsList');

  return (
    <CaseStudy
      eyebrow={tCommon('eyebrow')}
      title={t('title')}
      tagline={t('subtitle')}
      accent="royal"
      logo={{ src: '/projects/choeurdespaysdumontblanc/CPMB-logo-blanc.png', alt: t('title') }}
      meta={['2025', 'Next.js · Tailwind CSS', 'Web']}
      sections={[
        {
          id: 'overview',
          title: t('overview.title'),
          content: t('overview.description'),
          secondary: t('overview.mission'),
        },
        {
          id: 'features',
          title: t('features.title'),
          columns: 2,
          points: [
            t('features.items.concerts'),
            t('features.items.repertoire'),
            t('features.items.community'),
            t('features.items.events'),
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
            t('technology.stack.responsive'),
          ],
        },
        { id: 'purpose', title: t('purpose.title'), content: t('purpose.description') },
      ]}
      cta={{
        title: t('cta.title'),
        description: t('cta.description'),
        button: t('cta.button'),
        href: 'https://choeurdespaysdumontblanc.vercel.app/',
        ariaLabel: t('cta.ariaLabel'),
      }}
      contactCta={{ label: tCommon('contact_cta'), href: '/contact' }}
      navigation={buildCaseStudyNavigation(
        'choeurdespaysdumontblanc',
        { previous: tCommon('previous'), next: tCommon('next'), ariaLabel: tCommon('nav_label') },
        (titleKey) => tList(`items.${titleKey}.title`)
      )}
    />
  );
}

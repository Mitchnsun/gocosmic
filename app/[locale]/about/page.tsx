import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import CTAFinal from '@/components/CTAFinal';
import LinkedInIcon from '@/components/icons/LinkedInIcon';
import PersonSeo from '@/components/JsonLd/PersonSeo';
import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { SectionHeading } from '@/components/SectionHeading';
import { StudioIntro } from '@/components/StudioIntro';
import { WhyStudio } from '@/components/WhyStudio';
import { CONTAINER, ghostPill } from '@/design-system/pill';
import { getCanonicalUrl } from '@/i18n/canonical';
import { getOgImages } from '@/lib/og';
import { getCurrency } from '@/lib/region';
import { getRegion } from '@/lib/region.server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const title = t('title');
  const description = t('description');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/about'),
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

const REASONS = ['found', 'price', 'answer', 'ai'] as const;

const em = (chunks: ReactNode) => <em>{chunks}</em>;

export default async function About() {
  const t = await getTranslations('about');
  const region = await getRegion();
  const price = formatAmount(BASE_PRICE, getCurrency(region));

  return (
    <>
      <PersonSeo />
      <div className="bg-void text-ghost">
        <section aria-labelledby="about-intro" className="pt-[clamp(3.5rem,8vw,7rem)]">
          <div className={CONTAINER}>
            <SectionHeading
              level={1}
              eyebrow={t('eyebrow')}
              title={t.rich('title', { em })}
              titleId="about-intro"
              lead={t('lead')}
            />
          </div>
        </section>

        <StudioIntro
          id="journey"
          eyebrow={t('path.eyebrow')}
          title={t.rich('path.title', { em })}
          paragraphs={t.raw('path.paragraphs') as string[]}
          zones={t.raw('path.zones') as string[]}>
          <a
            href="https://www.linkedin.com/in/matthieucomperat/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('path.linkedin_aria')}
            className={ghostPill('mt-2 h-11 w-fit text-[15px]')}>
            {t('path.linkedin')}
            <LinkedInIcon className="h-4 w-4" />
          </a>
        </StudioIntro>

        <WhyStudio
          id="why-them"
          eyebrow={t('why.eyebrow')}
          title={t.rich('why.title', { em })}
          lead={t('why.lead')}
          reasons={REASONS.map((reason) => ({
            title: t(`why.reasons.${reason}.title`),
            description: t(`why.reasons.${reason}.description`, { price }),
          }))}
        />

        <CTAFinal
          id="about-cta"
          headline={t('cta.title')}
          description={t('cta.description')}
          ctaText={t('cta.button')}
          ctaHref="/contact"
          accentColor="aerospace"
          tone="sober"
        />
      </div>
    </>
  );
}

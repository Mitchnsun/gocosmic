import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import CTAFinal from '@/components/CTAFinal';
import LinkedInIcon from '@/components/icons/LinkedInIcon';
import BreadcrumbSeo from '@/components/JsonLd/BreadcrumbSeo';
import PersonSeo from '@/components/JsonLd/PersonSeo';
import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { SectionHeading } from '@/components/SectionHeading';
import { StudioIntro } from '@/components/StudioIntro';
import { WhyStudio } from '@/components/WhyStudio';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, ghostPill, PAGE_TOP } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { getCurrency, getRegion } from '@/lib/region';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.meta' });

  return buildPageMetadata({
    locale,
    routeKey: '/about',
    title: t('title'),
    description: t('description'),
  });
}

const REASONS = ['found', 'price', 'answer', 'ai'] as const;

const em = (chunks: ReactNode) => <em>{chunks}</em>;

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const region = getRegion(locale);
  const price = formatAmount(BASE_PRICE, getCurrency(region), locale);

  return (
    <>
      <PersonSeo />
      <BreadcrumbSeo route="/about" />
      <div className="bg-bg text-fg">
        <section aria-labelledby="about-intro" className={PAGE_TOP}>
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
          zones={t.raw(`path.zones.${region}`) as string[]}>
          <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href="/story" className={cn(buttonVariants({ variant: 'link', size: 'inline' }), 'min-h-11')}>
              {t('path.story_link')}
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href="https://www.linkedin.com/in/matthieucomperat/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('path.linkedin_aria')}
              className={ghostPill('h-11 w-fit text-[15px]')}>
              {t('path.linkedin')}
              <LinkedInIcon className="h-4 w-4" />
            </a>
          </div>
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
          tone="sober"
        />
      </div>
    </>
  );
}

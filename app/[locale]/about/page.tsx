import { createTranslator } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

import { AccentList } from '@/components/AccentList';
import { ContentSection } from '@/components/ContentSection';
import CTAFinal from '@/components/CTAFinal';
import LinkedInIcon from '@/components/icons/LinkedInIcon';
import PersonSeo from '@/components/JsonLd/PersonSeo';
import PageHero from '@/components/PageHero';
import { getCanonicalUrl } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';
import { getOgImages } from '@/lib/og';
import { getRegion } from '@/lib/region.server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = createTranslator({ messages, locale });
  const title = t('meta.title');
  const description = t('meta.description');
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

const linkClassName =
  'text-aerospace hover:text-aerospace/80 focus-visible:ring-aerospace rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none';

export default async function About() {
  const t = await getTranslations('about');
  const region = await getRegion();
  const legalContactSubject = encodeURIComponent(t('legal.contact.subject'));

  const specialization = [
    t('mission.specialization.items.webMobile'),
    t('mission.specialization.items.aiIntegration'),
    t('mission.specialization.items.uiUxDesign'),
    t('mission.specialization.items.customSolutions'),
  ];

  const expertise = [
    t('developer.expertise.items.modernDev'),
    t('developer.expertise.items.architecture'),
    t('developer.expertise.items.aiTech'),
    t('developer.expertise.items.leadership'),
  ];

  const aiPolicy = [
    t('legal.ai.items.integration'),
    t('legal.ai.items.ethics'),
    t('legal.ai.items.compliance'),
    t('legal.ai.items.privacy'),
  ];

  const responsibility = [
    t('legal.responsibility.items.testing'),
    t('legal.responsibility.items.recommendations'),
    t('legal.responsibility.items.security'),
  ];

  return (
    <>
      {/* Person JSON-LD structured data */}
      <PersonSeo />
      <div className="bg-void text-ghost relative">
        <PageHero
          id="about-hero"
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('subtitle')}
          cta={{ text: t('hero.cta'), href: '/contact' }}
        />

        <div className="m-auto flex max-w-7xl flex-col gap-10 p-4 sm:p-6 lg:p-8">
          {/* Mission */}
          <ContentSection
            id="mission"
            eyebrow={t('sections.mission')}
            index="01 / 03"
            title={t('mission.title')}
            lead={t('mission.description')}>
            <AccentList label={t('mission.specialization.title')} labelAs="h3" items={specialization} columns={2} />
            <p className="text-aerospace mt-8 text-lg leading-8">{t('mission.conclusion')}</p>
          </ContentSection>

          {/* Developer profile */}
          <ContentSection
            id="developer"
            eyebrow={t('sections.developer')}
            index="02 / 03"
            accent="royal"
            title={`${t('developer.title')} — ${t('developer.name')}`}
            lead={t('developer.description')}>
            <p className="text-ghost font-display text-xl font-medium">{t('developer.subtitle')}</p>
            <AccentList
              className="mt-6"
              accent="royal"
              label={t('developer.expertise.title')}
              labelAs="h3"
              items={expertise}
              columns={2}
            />
            <p className="text-ghost/70 mt-6 text-base leading-7">{t('developer.bio')}</p>
            <p className="border-ghost/8 bg-ghost/[0.02] text-ghost/55 mt-6 rounded-xl border px-4 py-3 text-sm">
              {t(`mission.location.${region}`)}
            </p>
            <a
              href="https://www.linkedin.com/in/matthieucomperat/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-ghost/15 text-ghost hover:border-ghost hover:bg-ghost/5 focus-visible:ring-ghost font-display mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label={t('developer.linkedin_aria')}>
              {t('developer.linkedin')}
              <LinkedInIcon className="h-4 w-4" />
            </a>
          </ContentSection>

          {/* Legal & AI disclosure */}
          <ContentSection
            id="legal"
            eyebrow={t('sections.legal')}
            index="03 / 03"
            accent="jungle"
            title={t('legal.title')}
            lead={t('legal.intro')}>
            <div className="grid gap-8 md:grid-cols-2">
              <AccentList accent="jungle" label={t('legal.ai.title')} labelAs="h3" items={aiPolicy} />
              <AccentList accent="jungle" label={t('legal.responsibility.title')} labelAs="h3" items={responsibility} />
            </div>
            <p className="text-ghost/55 border-ghost/8 mt-8 border-t pt-6 text-sm leading-7">
              {t('legal.contact.text')}{' '}
              <a
                href={`mailto:support@gocosmic.dev?subject=${legalContactSubject}`}
                className={linkClassName}
                aria-label={t('legal.contact.ariaLabel')}>
                {t('legal.contact.link')}
              </a>
              ,{' '}
              <Link href="/privacy" className={linkClassName}>
                {t('legal.contact.privacyLink')}
              </Link>
              ,{' '}
              <Link href="/legal-notice" className={linkClassName}>
                {t('legal.contact.legalNoticeLink')}
              </Link>
              .
            </p>
          </ContentSection>
        </div>

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

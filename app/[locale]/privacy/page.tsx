import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getCanonicalUrl } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';

type LegalSection = {
  title: string;
  body: string[];
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return {
    title: t('privacy.meta.title'),
    description: t('privacy.meta.description'),
    alternates: {
      canonical: getCanonicalUrl(locale, '/privacy'),
    },
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations('legal');
  const sections = t.raw('privacy.sections') as LegalSection[];

  return (
    <div className="text-ghost relative pt-10">
      <main className="m-auto flex max-w-4xl flex-col gap-8 px-4 pb-12">
        <div className="space-y-4">
          <p className="text-aerospace text-sm font-semibold tracking-wide uppercase">{t('privacy.eyebrow')}</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{t('privacy.title')}</h1>
          <p className="text-gray-400">{t('privacy.updated')}</p>
          <p className="text-lg text-gray-300">{t('privacy.intro')}</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-lg bg-slate-800 px-6 py-6">
              <h2 className="mb-4 text-xl font-bold text-white">{section.title}</h2>
              <div className="space-y-3 text-gray-300">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="rounded-lg border border-blue-700 bg-slate-900 p-4 text-blue-200">
          {t('privacy.legalNoticePrefix')}{' '}
          <Link href="/legal-notice" className="underline transition hover:text-blue-100">
            {t('privacy.legalNoticeLink')}
          </Link>
          .
        </p>
      </main>
    </div>
  );
}

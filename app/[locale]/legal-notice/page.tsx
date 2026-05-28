import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getCanonicalUrl } from '@/i18n/canonical';
import { renderWithLinks } from '@/lib/renderWithLinks';

type LegalSection = {
  title: string;
  body: string[];
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return {
    title: t('legalNotice.meta.title'),
    description: t('legalNotice.meta.description'),
    alternates: {
      canonical: getCanonicalUrl(locale, '/legal-notice'),
    },
  };
}

export default async function LegalNoticePage() {
  const t = await getTranslations('legal');
  const sections = t.raw('legalNotice.sections') as LegalSection[];

  return (
    <div className="text-ghost relative pt-10">
      <main className="m-auto flex max-w-4xl flex-col gap-8 px-4 pb-12">
        <div className="space-y-4">
          <p className="text-aerospace text-sm font-semibold tracking-wide uppercase">{t('legalNotice.eyebrow')}</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{t('legalNotice.title')}</h1>
          <p className="text-gray-400">{t('legalNotice.updated')}</p>
          <p className="text-lg text-gray-300">{t('legalNotice.intro')}</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-lg bg-slate-800 px-6 py-6">
              <h2 className="mb-4 text-xl font-bold text-white">{section.title}</h2>
              <div className="space-y-3 text-gray-300">
                {section.body.map((paragraph, index) => (
                  <p key={`${section.title}-${index}`}>{renderWithLinks(paragraph)}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

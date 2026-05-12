import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { getCanonicalUrl } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'local' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: getCanonicalUrl(locale, '/local'),
    },
  };
}

export default function LocalPage() {
  const t = useTranslations('local');

  return (
    <main className="m-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">{t('hero.title')}</h1>
      <p className="mt-4 text-lg text-gray-400">{t('hero.description')}</p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{t('services.title')}</h2>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{t('zone.title')}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-300">
          <li>Annecy & Haute-Savoie</li>
          <li>Genève & Arc lémanique</li>
          <li>{t('zone.remote')}</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{t('projects.title')}</h2>
      </section>

      <Link href="/contact" className={cn(buttonVariants({ variant: 'jungle' }), 'mt-10 inline-flex')}>
        {t('cta')}
      </Link>
    </main>
  );
}

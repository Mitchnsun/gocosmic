import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { getCanonicalUrl } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';
import { getRegion } from '@/lib/region.server';

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

export default async function LocalPage() {
  const t = await getTranslations('local');
  const region = await getRegion();

  return (
    <div className="relative m-auto my-6 max-w-7xl rounded-lg bg-slate-800 px-6 py-8 text-white lg:p-8">
      <h1 className="text-4xl font-bold">{t('hero.title')}</h1>
      <p className="text-lg text-gray-400">{t(`hero.description.${region}`)}</p>

      <section className="my-8">
        <h2 className="text-2xl font-medium">
          <Link href="/services" className="flex items-center gap-2 transition-colors hover:text-blue-400">
            {t('services.title')}
            <ArrowTopRightOnSquareIcon className="size-5" aria-hidden="true" />
          </Link>
        </h2>
      </section>

      <section>
        <h2 className="text-2xl font-medium">{t('zone.title')}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-300">
          <li>{t('zone.locations.annecy')}</li>
          <li>{t('zone.locations.geneva')}</li>
          <li>{t('zone.locations.suisse_romande')}</li>
          <li>{t('zone.remote')}</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-medium">
          <Link href="/projects" className="flex items-center gap-2 transition-colors hover:text-blue-400">
            {t(`projects.title.${region}`)}
            <ArrowTopRightOnSquareIcon className="size-5" aria-hidden="true" />
          </Link>
        </h2>
      </section>

      <Link href="/contact" className={cn(buttonVariants({ variant: 'jungle' }), 'inline-flex')}>
        {t('cta')}
      </Link>
    </div>
  );
}

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, ghostPill, PAGE_TOP, primaryPill, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('404');

  // Its own title and description, and no social card: the layout's describes the homepage.
  return { title: t('meta_title'), description: t('description'), openGraph: null, twitter: null };
}

export default function NotFound() {
  const t = useTranslations('404');

  return (
    <section
      aria-labelledby="not-found-heading"
      className={cn('bg-bg text-fg', SECTION_Y, PAGE_TOP)}
      style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
      <div className={cn(CONTAINER, 'flex flex-col gap-8')}>
        <SectionHeading
          level={1}
          eyebrow={t('eyebrow')}
          title={t('title')}
          titleId="not-found-heading"
          lead={t('description')}
        />
        <div className="flex flex-wrap gap-3">
          <Link className={primaryPill()} href="/">
            {t('link')}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
          <Link className={ghostPill()} href="/contact">
            {t('contact')}
          </Link>
        </div>
      </div>
    </section>
  );
}

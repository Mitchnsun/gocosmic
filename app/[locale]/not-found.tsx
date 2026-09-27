import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, ghostPill, primaryPill, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('404');

  return (
    <section
      aria-labelledby="not-found-heading"
      className={cn('bg-void text-ghost', SECTION_Y)}
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

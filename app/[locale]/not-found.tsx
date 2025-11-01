import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('404');

  return (
    <div
      className="text-ghost m-auto flex max-w-7xl flex-col items-center px-4 py-16"
      style={{ minHeight: 'calc(100vh - var(--header-footer-height))' }}>
      <h2 className="text-center text-2xl font-extrabold sm:text-4xl">{t('title')}</h2>
      <p className="my-8 text-center">{t('description')}</p>
      <Link className={cn(buttonVariants({ variant: 'ghost' }), 'gap-2')} href="/">
        {t('link')}
      </Link>
    </div>
  );
}

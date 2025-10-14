import { useTranslations } from 'next-intl';

import { Button } from '@/design-system/button';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('404');

  return (
    <div
      className="text-ghost m-auto flex max-w-7xl flex-col items-center px-4 py-16"
      style={{ minHeight: 'calc(100vh - var(--header-footer-height))' }}>
      <h2 className="text-center text-2xl font-extrabold sm:text-4xl">{t('title')}</h2>
      <p className="my-8 text-center">{t('description')}</p>
      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">{t('link')}</Link>
      </Button>
    </div>
  );
}

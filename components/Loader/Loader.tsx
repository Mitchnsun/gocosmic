import { cn } from '@/design-system/lib/utils';
import { useTranslations } from 'next-intl';

interface LoaderProps {
  className?: string;
  fullScreen?: boolean;
}

const Loader = ({ className, fullScreen }: LoaderProps) => {
  const t = useTranslations('common');

  return (
    <div
      className={cn('flex flex-col items-center justify-center', className)}
      style={{ minHeight: fullScreen ? 'calc(100vh - var(--header-footer-height))' : 'none' }}>
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white"></div>
      <p aria-live="polite" aria-label={t('loading')} className="text-gray-300">
        {t('loading')}
      </p>
    </div>
  );
};

export default Loader;

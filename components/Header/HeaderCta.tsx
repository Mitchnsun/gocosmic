import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

interface HeaderCtaProps {
  onClick?: () => void;
  className?: string;
}

/** Primary pill leading to the free mockup request, shared by the desktop nav and the mobile menu. */
const HeaderCta = ({ onClick, className }: HeaderCtaProps) => {
  const t = useTranslations('navigation');

  return (
    <Link
      href="/free-mockup"
      onClick={onClick}
      className={cn(
        buttonVariants({ variant: 'aerospace' }),
        'font-display text-void hover:bg-aerospace focus-visible:ring-ghost focus-visible:ring-offset-void h-11 px-5 py-0 text-[15px] font-semibold whitespace-nowrap shadow-[0_0_24px_rgb(255_79_0/0.35)] transition-transform duration-200 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:scale-100',
        className
      )}>
      {t('cta')}
    </Link>
  );
};

export default HeaderCta;

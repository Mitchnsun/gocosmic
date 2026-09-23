'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/design-system/lib/utils';
import { Link, usePathname } from '@/i18n/navigation';

import LanguageSwitcher from '../LanguageSwitcher';
import { HeaderNavItem } from './constants';
import HeaderCta from './HeaderCta';

/** Inline navigation shown from `lg` (1024 px): text links, primary CTA and language switcher. */
const DesktopNav = ({ items }: { items: HeaderNavItem[] }) => {
  const t = useTranslations('navigation');
  const pathname = usePathname();

  return (
    <nav className="font-display hidden items-center gap-8 text-[15px] font-medium lg:flex" aria-label={t('label')}>
      {items.map(({ label, href, ariaLabel, isActive }) => {
        const active = isActive ?? (pathname === href || pathname.startsWith(`${href}/`));

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'group focus-visible:ring-aerospace/70 text-ghost/75 hover:text-ghost focus-visible:text-ghost relative rounded py-2 transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none motion-reduce:duration-0',
              { 'text-ghost': active }
            )}
            aria-label={ariaLabel}
            aria-current={active ? 'page' : undefined}>
            {label}
            <span
              aria-hidden="true"
              className={cn(
                'bg-aerospace absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:duration-0',
                { 'scale-x-100': active }
              )}
            />
          </Link>
        );
      })}
      <HeaderCta />
      <LanguageSwitcher />
    </nav>
  );
};

export default DesktopNav;

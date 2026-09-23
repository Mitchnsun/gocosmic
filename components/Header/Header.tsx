'use client';

import { AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';

import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

import LanguageSwitcher from '../LanguageSwitcher';
import { DEFAULT_LOGO, HEADER_HEIGHT, HeaderNavItem, HeaderProps } from './constants';
import DesktopNav from './DesktopNav';
import MobileLangDrawer from './MobileLangDrawer';
import MobileMenu from './MobileMenu';
import MobileMenuButton from './MobileMenuButton';
import { useMobileMenu } from './useMobileMenu';

const Header = ({ logo = DEFAULT_LOGO, navItems, className, id }: HeaderProps = {}) => {
  const t = useTranslations('navigation');
  const { isOpen, toggle, close: closeNav, buttonRef } = useMobileMenu();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleToggleNav = () => {
    setIsLangOpen(false);
    toggle();
  };

  const handleOpenLang = () => {
    closeNav();
    setIsLangOpen(true);
  };

  const items = useMemo<HeaderNavItem[]>(
    () =>
      navItems ?? [
        { label: t('services'), href: '/services', ariaLabel: t('services_label') },
        { label: t('projects'), href: '/projects', ariaLabel: t('projects_label') },
        { label: t('contact'), href: '/contact', ariaLabel: t('contact_label') },
      ],
    [navItems, t]
  );

  const mobileItems = useMemo<HeaderNavItem[]>(
    () => [{ label: t('home_menu'), href: '/', ariaLabel: t('home_menu') }, ...items],
    [items, t]
  );

  return (
    <>
      <a
        href="#main-content"
        className="focus:text-ghost focus:ring-aerospace focus:bg-void sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2 focus:outline-none">
        {t('skip_to_content')}
      </a>
      <header
        id={id}
        className={cn('text-ghost border-ghost/8 bg-void/85 sticky top-0 z-50 border-b backdrop-blur-md', className)}
        style={
          {
            height: `calc(${HEADER_HEIGHT}px + env(safe-area-inset-top, 0px))`,
            paddingTop: 'env(safe-area-inset-top, 0px)',
            '--header-h': `calc(${HEADER_HEIGHT}px + env(safe-area-inset-top, 0px))`,
          } as React.CSSProperties
        }>
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <h1 className="shrink-0">
            <Link
              href="/"
              aria-label={t('home', { brand: logo })}
              className="font-display hover:text-ghost/90 focus-visible:ring-aerospace/70 inline-flex items-baseline text-xl font-bold tracking-[-0.02em] transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none motion-reduce:duration-0">
              {logo}
              <span className="text-aerospace">.</span>
            </Link>
          </h1>
          <DesktopNav items={items} />
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher onOpen={handleOpenLang} />
            <MobileMenuButton isOpen={isOpen} onToggle={handleToggleNav} buttonRef={buttonRef} />
          </div>
        </div>
      </header>
      <AnimatePresence>{isOpen && <MobileMenu onClose={handleToggleNav} items={mobileItems} />}</AnimatePresence>
      <AnimatePresence>{isLangOpen && <MobileLangDrawer onClose={() => setIsLangOpen(false)} />}</AnimatePresence>
    </>
  );
};

export default Header;

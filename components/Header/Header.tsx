'use client';

import {
  CalculatorIcon,
  EnvelopeIcon,
  FolderOpenIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';
import { AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';

import { cn } from '@/design-system/lib/utils';
import { Link, usePathname } from '@/i18n/navigation';

import LanguageSwitcher from '../LanguageSwitcher';
import { DEFAULT_LOGO, HeaderNavItem, HeaderProps } from './constants';
import { useHeader } from './Header.hook';
import LogoOrbitalDot from './LogoOrbitalDot';
import MobileLangDrawer from './MobileLangDrawer';
import MobileMenu from './MobileMenu';
import MobileMenuButton from './MobileMenuButton';
import { useMobileMenu } from './useMobileMenu';

const Header = (props: HeaderProps = {}) => {
  const { logo = DEFAULT_LOGO, navItems, logoOrbitalEnabled = true, className, id } = props;
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const { reduceMotion, headerHeight } = useHeader(props);
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
        { label: t('services'), href: '/services', ariaLabel: t('services_label'), icon: WrenchScrewdriverIcon },
        { label: t('projects'), href: '/projects', ariaLabel: t('projects_label'), icon: FolderOpenIcon },
        { label: t('pricing'), href: '/pricing', ariaLabel: t('pricing_label'), icon: CalculatorIcon },
        { label: t('about'), href: '/about', ariaLabel: t('about_label'), icon: InformationCircleIcon },
        { label: t('contact'), href: '/contact', ariaLabel: t('contact_label'), icon: EnvelopeIcon },
      ],
    [navItems, t]
  );

  return (
    <>
      <a
        href="#main-content"
        className="focus:text-ghost focus:ring-aerospace sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-md focus:bg-slate-950 focus:px-4 focus:py-2 focus:ring-2 focus:outline-none">
        {t('skip_to_content')}
      </a>
      <header
        id={id}
        className={cn(
          'text-ghost border-ghost/10 sticky top-0 z-50 border-b bg-slate-950/80 backdrop-blur-md transition-[height,background-color,box-shadow] duration-300 ease-out motion-reduce:duration-0',
          className
        )}
        style={
          {
            height: `calc(${headerHeight}px + env(safe-area-inset-top, 0px))`,
            paddingTop: 'env(safe-area-inset-top, 0px)',
            '--header-h': `calc(${headerHeight}px + env(safe-area-inset-top, 0px))`,
          } as React.CSSProperties
        }>
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="shrink-0">
            <Link
              href="/"
              aria-label={t('home')}
              className="group hover:text-ghost/90 focus-visible:ring-aerospace/70 relative inline-flex items-center text-xl font-bold transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none motion-reduce:duration-0 sm:text-2xl">
              <span className="relative inline-block">
                {logo.charAt(0)}
                {logoOrbitalEnabled && <LogoOrbitalDot reduceMotion={reduceMotion} />}
              </span>
              {logo.slice(1)}
              <span className="text-aerospace">.</span>
            </Link>
          </h1>
          <nav className="hidden items-center gap-3 sm:gap-4 md:flex lg:gap-8" aria-label={t('label')}>
            {items.map(({ label, href, ariaLabel, icon: Icon, isActive }) => {
              const active = isActive ?? (pathname === href || pathname.startsWith(`${href}/`));

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'group focus-visible:ring-aerospace/70 relative rounded px-2 py-1 opacity-80 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none motion-reduce:duration-0',
                    { 'opacity-100': active }
                  )}
                  aria-label={ariaLabel}
                  aria-current={active ? 'page' : undefined}>
                  <Icon className="h-5 w-5 md:hidden" aria-hidden="true" />
                  <span className="hidden md:inline">{label}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'bg-aerospace absolute inset-x-2 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:duration-0',
                      { 'scale-x-100': active }
                    )}
                  />
                </Link>
              );
            })}
            <LanguageSwitcher />
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher onOpen={handleOpenLang} />
            <MobileMenuButton isOpen={isOpen} onToggle={handleToggleNav} buttonRef={buttonRef} />
          </div>
        </div>
      </header>
      <AnimatePresence>{isOpen && <MobileMenu onClose={handleToggleNav} items={items} />}</AnimatePresence>
      <AnimatePresence>
        {isLangOpen && <MobileLangDrawer onClose={() => setIsLangOpen(false)} headerHeight={headerHeight} />}
      </AnimatePresence>
    </>
  );
};

export default Header;

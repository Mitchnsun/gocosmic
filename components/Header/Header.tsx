'use client';

import {
  CalculatorIcon,
  EnvelopeIcon,
  FolderOpenIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Link, usePathname } from '@/i18n/navigation';

import LanguageSwitcher from '../LanguageSwitcher';

type HeaderNavItem = {
  label: string;
  href: '/services' | '/projects' | '/pricing' | '/about' | '/contact';
  ariaLabel: string;
  icon: typeof WrenchScrewdriverIcon;
  isActive?: boolean;
};

interface HeaderProps {
  logo?: string;
  navItems?: HeaderNavItem[];
  adaptiveHeight?: boolean;
  minHeight?: number;
  maxHeight?: number;
  logoOrbitalEnabled?: boolean;
  respectReducedMotion?: boolean;
  className?: string;
  id?: string;
}

const Header = ({
  logo = 'Go Cosmic',
  navItems,
  adaptiveHeight = true,
  minHeight = 64,
  maxHeight = 96,
  logoOrbitalEnabled = true,
  respectReducedMotion = true,
  className,
  id,
}: HeaderProps = {}) => {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const [headerHeight, setHeaderHeight] = useState(maxHeight);
  const [reduceMotion, setReduceMotion] = useState(false);
  const lastScrollY = useRef(0);
  const isCompactRef = useRef(false);

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

  useEffect(() => {
    if (!respectReducedMotion || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => setReduceMotion(mediaQuery.matches);
    updateReducedMotion();
    mediaQuery.addEventListener('change', updateReducedMotion);

    return () => mediaQuery.removeEventListener('change', updateReducedMotion);
  }, [respectReducedMotion]);

  useEffect(() => {
    if (!adaptiveHeight || typeof window === 'undefined') {
      return;
    }

    const getHeights = () => {
      if (window.innerWidth <= 600) {
        return { expandedHeight: 64, compactHeight: 64 };
      }
      if (window.innerWidth < 1024) {
        return { expandedHeight: 80, compactHeight: 56 };
      }

      return { expandedHeight: maxHeight, compactHeight: minHeight };
    };

    const updateHeightOnScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const { expandedHeight, compactHeight } = getHeights();
      const shouldCompact = isScrollingDown && currentScrollY > 8;

      isCompactRef.current = shouldCompact;
      setHeaderHeight(shouldCompact ? compactHeight : expandedHeight);
      lastScrollY.current = currentScrollY;
    };

    const handleResize = () => {
      const { expandedHeight, compactHeight } = getHeights();
      setHeaderHeight(isCompactRef.current ? compactHeight : expandedHeight);
    };

    updateHeightOnScroll();
    window.addEventListener('scroll', updateHeightOnScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', updateHeightOnScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [adaptiveHeight, maxHeight, minHeight]);

  const transitionClass = reduceMotion ? 'duration-0' : 'duration-300';

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-ghost focus:outline-none focus:ring-2 focus:ring-aerospace">
        {t('skip_to_content')}
      </a>
      <header
        id={id}
        className={clsx(
          'text-ghost sticky top-0 z-50 border-b border-ghost/10 bg-slate-950/80 backdrop-blur-md transition-[height,background-color,box-shadow] ease-out',
          transitionClass,
          className
        )}
        style={{ height: `${headerHeight}px` }}>
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="shrink-0">
            <Link
              href="/"
              aria-label={t('home')}
              className={clsx(
                'group relative inline-flex items-center text-xl font-bold transition-colors sm:text-2xl hover:text-ghost/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aerospace/70',
                transitionClass
              )}>
              <span>{logo}</span>
              <span className="text-aerospace">.</span>
              <span
                aria-hidden="true"
                className={clsx(
                  'pointer-events-none absolute -top-1 -left-2 h-2 w-2 rounded-full bg-aerospace/60',
                  logoOrbitalEnabled && !reduceMotion && 'animate-orbital-dot'
                )}
              />
            </Link>
          </h1>
          <nav className="flex items-center gap-3 sm:gap-4 lg:gap-8" aria-label={t('label')}>
            {items.map(({ label, href, ariaLabel, icon: Icon, isActive }) => {
              const active = isActive ?? (pathname === href || pathname.startsWith(`${href}/`));

              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'group relative rounded px-2 py-1 opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aerospace/70',
                    transitionClass,
                    active && 'opacity-100'
                  )}
                  aria-label={ariaLabel}
                  aria-current={active ? 'page' : undefined}>
                  <Icon className="h-5 w-5 md:hidden" aria-hidden="true" />
                  <span className="hidden md:inline">{label}</span>
                  <span
                    aria-hidden="true"
                    className={clsx(
                      'absolute inset-x-2 bottom-0 h-0.5 origin-left scale-x-0 bg-aerospace transition-transform duration-200 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100',
                      active && 'scale-x-100',
                      reduceMotion && 'duration-0'
                    )}
                  />
                </Link>
              );
            })}
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;

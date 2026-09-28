'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { Link } from '@/i18n/navigation';
import { STUDIO_BASES } from '@/lib/config';
import { DEFAULT_REGION, type Region } from '@/lib/region';

import { ThemeToggle } from '../Theme';
import { HEADER_HEIGHT, HeaderNavItem, MOBILE_MENU_DURATION_MS, MOBILE_MENU_STAGGER_MS } from './constants';
import HeaderCta from './HeaderCta';
import MountainSkyline from './MountainSkyline';
import { useStatusBarOffset } from './useStatusBarOffset';

interface MobileMenuProps {
  onClose: () => void;
  items: HeaderNavItem[];
  region?: Region;
}

const MobileMenu = ({ onClose, items, region = DEFAULT_REGION }: MobileMenuProps) => {
  const t = useTranslations('navigation');
  const tTheme = useTranslations('theme');
  // eslint-disable-next-line security/detect-object-injection -- region is the typed Region union
  const { altitude } = STUDIO_BASES[region];
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const statusBarOffset = useStatusBarOffset();

  // Focus the first link on mount.
  useEffect(() => {
    firstLinkRef.current?.focus();
  }, []);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t('menu_title')}
      className="bg-bg/95 fixed inset-0 z-40 flex flex-col backdrop-blur-xl"
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: MOBILE_MENU_DURATION_MS / 1000 }}>
      {/* Spacer keeping the links clear of the status bar and the sticky header */}
      <div
        aria-hidden="true"
        style={{ height: `calc(${statusBarOffset}px + env(safe-area-inset-top, 0px) + ${HEADER_HEIGHT}px)` }}
        className="shrink-0"
      />

      {/* Mountain skyline decoration, below the sticky header so it's actually visible */}
      <div className="relative h-12 shrink-0 overflow-hidden">
        <MountainSkyline className="absolute inset-x-0 bottom-0" />
      </div>

      {/* Metadata row */}
      <div className="border-line text-3xs text-fg-3 flex items-center justify-between border-b px-4 py-3 font-mono tracking-widest uppercase sm:px-6">
        <span>{t('menu_title')}</span>
        <span>{altitude}</span>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-1 flex-col overflow-y-auto" aria-label={t('label')}>
        <ul className="divide-line flex flex-col divide-y">
          {items.map(({ label, href, ariaLabel }, index) => (
            <motion.li
              key={href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * (MOBILE_MENU_STAGGER_MS / 1000) }}>
              <Link
                ref={index === 0 ? firstLinkRef : undefined}
                href={href}
                aria-label={ariaLabel}
                onClick={onClose}
                className="group flex items-center justify-between px-4 py-5 sm:px-6">
                <span className="font-display text-fg text-2xl leading-none font-medium">{label}</span>
                <span className="text-fg-3 font-mono text-sm">/{String(index + 1).padStart(2, '0')}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Primary action, always reachable at the bottom of the drawer */}
      <div className="border-line flex flex-col items-center gap-4 border-t px-4 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:px-6">
        <div className="flex w-full items-center justify-between">
          <span className="text-fg-3 font-mono text-xs tracking-widest uppercase">{tTheme('label')}</span>
          <ThemeToggle />
        </div>
        <HeaderCta onClick={onClose} className="h-12 w-full text-base" />
        <a href="mailto:contact@gocosmic.dev" className="text-fg-3 hover:text-fg-2 font-mono text-xs transition-colors">
          contact@gocosmic.dev
        </a>
      </div>
    </motion.div>
  );
};

export default MobileMenu;

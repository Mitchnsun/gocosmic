'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { Link } from '@/i18n/navigation';
import { STUDIO_BASES } from '@/lib/config';
import { DEFAULT_REGION, type Region } from '@/lib/region';

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
      className="bg-void/95 fixed inset-0 z-40 flex flex-col backdrop-blur-xl"
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
      <div className="border-ghost/8 text-3xs text-ghost/35 flex items-center justify-between border-b px-4 py-3 font-mono tracking-widest uppercase sm:px-6">
        <span>{t('menu_title')}</span>
        <span>{altitude}</span>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-1 flex-col overflow-y-auto" aria-label={t('label')}>
        <ul className="divide-ghost/8 flex flex-col divide-y">
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
                <span className="font-display text-ghost text-2xl leading-none font-medium">{label}</span>
                <span className="text-ghost/35 font-mono text-sm">/{String(index + 1).padStart(2, '0')}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Primary action, always reachable at the bottom of the drawer */}
      <div className="border-ghost/8 flex flex-col items-center gap-4 border-t px-4 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:px-6">
        <HeaderCta onClick={onClose} className="h-12 w-full text-base" />
        <a
          href="mailto:contact@gocosmic.dev"
          className="text-ghost/45 hover:text-ghost/80 font-mono text-xs transition-colors">
          contact@gocosmic.dev
        </a>
      </div>
    </motion.div>
  );
};

export default MobileMenu;

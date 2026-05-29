'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { Link } from '@/i18n/navigation';

import LanguageSwitcher from '../LanguageSwitcher';
import { HeaderNavItem, MOBILE_MENU_DURATION_MS, MOBILE_MENU_STAGGER_MS } from './constants';

interface MobileMenuProps {
  onClose: () => void;
  items: HeaderNavItem[];
}

const MobileMenu = ({ onClose, items }: MobileMenuProps) => {
  const t = useTranslations('navigation');
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Focus the first link on mount.
  useEffect(() => {
    firstLinkRef.current?.focus();
  }, []);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t('menu_close')}
      className="fixed inset-0 z-40 flex flex-col bg-slate-950/95 backdrop-blur-xl"
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: MOBILE_MENU_DURATION_MS / 1000 }}>
      {/* Top spacer for header height */}
      <div className="h-16 shrink-0" />

      {/* Metadata row */}
      <div className="border-ghost/10 flex items-center justify-between border-b px-4 py-3 text-[10px] tracking-widest text-slate-500 uppercase sm:px-6">
        <span>MENU · V2026.05</span>
        <span>48.7°N · 6.2°E</span>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-1 flex-col overflow-y-auto" aria-label={t('label')}>
        <ul className="flex flex-col divide-y divide-slate-800">
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
                className="group flex items-center justify-between px-4 py-6 sm:px-6">
                <span className="font-display text-ghost text-[2rem] leading-none font-medium">{label}</span>
                <span className="text-sm text-slate-500">/{String(index + 1).padStart(2, '0')}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-ghost/10 flex items-center justify-between border-t px-4 py-5 sm:px-6">
        <LanguageSwitcher />
        <a
          href="mailto:contact@gocosmic.dev"
          className="font-mono text-xs text-slate-500 transition-colors hover:text-slate-300">
          contact@gocosmic.dev
        </a>
      </div>
    </motion.div>
  );
};

export default MobileMenu;

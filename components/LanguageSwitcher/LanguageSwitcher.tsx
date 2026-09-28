'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';

import { MOBILE_MENU_DURATION_MS, MOBILE_MENU_STAGGER_MS } from '@/components/Header/constants';
import { LANG_DRAWER_LANGUAGES } from '@/components/Header/MobileLangDrawer';
import { cn } from '@/design-system/lib/utils';

import { useSwitchLocale } from './useSwitchLocale';

interface LanguageSwitcherProps {
  onOpen?: () => void;
}

const LanguageSwitcher = ({ onOpen }: LanguageSwitcherProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('navigation');
  const locale = useLocale();
  const switchLocale = useSwitchLocale();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Handle both mouse and touch events for better mobile support
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // For more robust locale switching, especially with default locale,
      // we ensure the router properly handles the navigation
      switchLocale(newLocale);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => (onOpen ? onOpen() : setIsOpen(!isOpen))}
        className="border-line-2 hover:border-fg-3 hover:text-fg flex items-center gap-2 rounded-full border px-2 py-1 transition-colors"
        aria-label={t('switch_locale')}
        disabled={isPending}>
        <span className="bg-ok h-2 w-2 rounded-full" aria-hidden="true" />
        <span className="text-3xs uppercase">{locale}</span>
      </button>

      {!onOpen && (
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop — closes on click and keeps menuRef.contains() checks correct */}
              <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} aria-hidden="true" />
              {/* Drawer panel */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ ease: [0.16, 1, 0.3, 1], duration: MOBILE_MENU_DURATION_MS / 1000 }}
                style={{ top: 'var(--header-h, 64px)' }}
                className="border-line bg-bg/95 fixed right-0 z-40 flex w-80 flex-col rounded-bl-2xl border-b border-l shadow-2xl backdrop-blur-xl">
                {/* Metadata row */}
                <div className="border-line text-3xs text-fg-3 flex items-center justify-between border-b px-6 py-3 tracking-widest uppercase">
                  <span>{t('lang_drawer_title')}</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label={t('menu_close')}
                    className="hover:text-fg p-1 transition-colors">
                    <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                {/* Language list */}
                <ul role="menu" aria-orientation="vertical" className="divide-line divide-y">
                  {Object.entries(LANG_DRAWER_LANGUAGES).map(([code, { name, flag }], index) => (
                    <motion.li
                      key={code}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * (MOBILE_MENU_STAGGER_MS / 1000) }}>
                      <button
                        onClick={() => handleLanguageChange(code)}
                        disabled={isPending}
                        role="menuitem"
                        className={cn(
                          'group hover:bg-line flex w-full items-center justify-between px-6 py-4 transition-colors',
                          locale === code ? 'text-aerospace' : 'text-fg'
                        )}>
                        <span className="font-display flex items-center gap-3 text-lg leading-none font-medium">
                          <span aria-hidden="true">{flag}</span>
                          {name}
                        </span>
                        {locale === code && <CheckIcon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default LanguageSwitcher;

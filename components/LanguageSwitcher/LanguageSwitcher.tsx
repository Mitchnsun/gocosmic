'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';

import { MOBILE_MENU_DURATION_MS, MOBILE_MENU_STAGGER_MS } from '@/components/Header/constants';
import { cn } from '@/design-system/lib/utils';
import { usePathname, useRouter } from '@/i18n/navigation';

const languages = {
  en: { name: 'English', flag: '🇬🇧', color: 'bg-red-600/80' },
  fr: { name: 'Français', flag: '🇫🇷', color: 'bg-blue-600/80' },
  es: { name: 'Español', flag: '🇪🇸', color: 'bg-yellow-600' },
  de: { name: 'Deutsch', flag: '🇩🇪', color: 'bg-black' },
  it: { name: 'Italiano', flag: '🇮🇹', color: 'bg-green-600/80' },
} as const;

interface LanguageSwitcherProps {
  onOpen?: () => void;
}

const LanguageSwitcher = ({ onOpen }: LanguageSwitcherProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('navigation');
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

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
      router.push(pathname, { locale: newLocale });
      setIsOpen(false);
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => (onOpen ? onOpen() : setIsOpen(!isOpen))}
        className="flex items-center gap-2 rounded-full border border-gray-600 px-2 py-1 transition-colors hover:border-gray-400 hover:text-blue-400"
        aria-label={t('switch_locale')}
        disabled={isPending}>
        <span
          className={cn('h-2 w-2 rounded-full', languages[locale as keyof typeof languages]?.color || 'bg-jungle')}
          aria-hidden="true"
        />
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
                className="border-ghost/10 fixed right-0 z-40 flex w-80 flex-col rounded-bl-2xl border-b border-l bg-slate-950/95 shadow-2xl backdrop-blur-xl">
                {/* Metadata row */}
                <div className="border-ghost/10 text-3xs flex items-center justify-between border-b px-6 py-3 tracking-widest text-slate-500 uppercase">
                  <span>{t('lang_drawer_title')}</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label={t('menu_close')}
                    className="p-1 transition-colors hover:text-slate-300">
                    <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                {/* Language list */}
                <ul role="menu" aria-orientation="vertical" className="divide-y divide-slate-800">
                  {Object.entries(languages).map(([code, { name, flag }], index) => (
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
                          'group flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-900/50',
                          locale === code ? 'text-blue-400' : 'text-ghost'
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

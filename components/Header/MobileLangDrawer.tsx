'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';

import { MOBILE_HEIGHT, MOBILE_MENU_DURATION_MS, MOBILE_MENU_STAGGER_MS, STATUS_BAR_HEIGHT } from './constants';

export const LANG_DRAWER_LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  fr: { name: 'Français', flag: '🇫🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italiano', flag: '🇮🇹' },
} as const;

interface MobileLangDrawerProps {
  onClose: () => void;
  headerHeight?: number;
}

const MobileLangDrawer = ({ onClose, headerHeight = MOBILE_HEIGHT }: MobileLangDrawerProps) => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('navigation');
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelect = (newLocale: string) => {
    startTransition(() => {
      router.push(pathname, { locale: newLocale });
      onClose();
    });
  };

  return (
    <motion.div
      id="lang-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={t('switch_locale')}
      className="fixed inset-0 z-40 flex flex-col bg-slate-950/95 backdrop-blur-xl"
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: MOBILE_MENU_DURATION_MS / 1000 }}>
      <div
        aria-hidden="true"
        style={{ height: `calc(${STATUS_BAR_HEIGHT}px + env(safe-area-inset-top, 0px) + ${headerHeight}px)` }}
        className="shrink-0"
      />
      <div className="border-ghost/10 text-3xs flex items-center justify-between border-b px-4 py-3 tracking-widest text-slate-500 uppercase sm:px-6">
        <span>{t('lang_drawer_title')}</span>
        <button onClick={onClose} aria-label={t('menu_close')} className="p-1 transition-colors hover:text-slate-300">
          <XMarkIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <nav className="flex flex-1 flex-col overflow-y-auto" aria-label={t('switch_locale')}>
        <ul className="flex flex-col divide-y divide-slate-800">
          {Object.entries(LANG_DRAWER_LANGUAGES).map(([code, { name, flag }], index) => (
            <motion.li
              key={code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * (MOBILE_MENU_STAGGER_MS / 1000) }}>
              <button
                onClick={() => handleSelect(code)}
                disabled={isPending}
                className="group flex w-full items-center justify-between px-4 py-6 sm:px-6">
                <span className="font-display text-ghost flex items-center gap-4 text-[2rem] leading-none font-medium">
                  <span aria-hidden="true">{flag}</span>
                  {name}
                </span>
                {locale === code && <CheckIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />}
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default MobileLangDrawer;

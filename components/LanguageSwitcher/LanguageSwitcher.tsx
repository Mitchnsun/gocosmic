'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';

const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  fr: { name: 'Français', flag: '🇫🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italiano', flag: '🇮🇹' },
} as const;

const LanguageSwitcher = () => {
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
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:text-blue-400"
        aria-label={t('switch_locale')}
        disabled={isPending}>
        <span className="relative">
          <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-1 left-3">{languages[locale as keyof typeof languages]?.flag}</span>
        </span>
      </button>

      {isOpen && (
        <div className="ring-opacity-5 absolute top-full right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg ring-1 ring-black">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {Object.entries(languages).map(([code, { name, flag }]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={clsx(
                  'flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-gray-700',
                  { 'bg-gray-700 text-blue-400': locale === code, 'text-gray-300': locale !== code }
                )}
                role="menuitem"
                disabled={isPending}>
                <span className="text-lg">{flag}</span>
                <span>{name}</span>
                {locale === code && (
                  <span className="ml-auto text-xs">
                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;

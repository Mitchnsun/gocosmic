'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';

import { LANG_DRAWER_LANGUAGES } from '@/components/Header/MobileLangDrawer';
import { readCurrentQuery, useSwitchLocale } from '@/components/LanguageSwitcher/useSwitchLocale';
import { getLanguage, localeWithLanguage } from '@/i18n/locales';
import { Link, usePathname } from '@/i18n/navigation';

/** Language pill: the current language is highlighted, the others link to the same page in that language. */
const FooterLanguages = () => {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const language = getLanguage(locale);
  const pathname = usePathname();
  const switchLocale = useSwitchLocale();

  // The link targets the bare page; a plain click also keeps the current query (e.g. a projects filter)
  // and section anchor, while a click opening a new tab keeps the link's own address.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, code: string) => {
    const isPlainClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!isPlainClick || (!readCurrentQuery() && !window.location.hash)) return;
    event.preventDefault();
    switchLocale(code);
  };
  // Current language first, as in "FR · EN DE IT ES".
  const languages = Object.entries(LANG_DRAWER_LANGUAGES).sort(
    ([a], [b]) => Number(b === language) - Number(a === language)
  );

  return (
    <nav aria-label={t('switch_locale')} className="text-3xs font-mono tracking-[0.16em] uppercase">
      <ul className="flex flex-wrap items-center">
        {languages.map(([code, { name }]) => {
          // Same region as the current page: from a Swiss page, the Swiss version in that language.
          const target = localeWithLanguage(locale, code);
          return (
            <li key={code}>
              {code === language ? (
                <span
                  aria-current="true"
                  className="border-line-2 text-fg mr-2 inline-flex rounded-full border px-2 py-0.5">
                  <span className="sr-only" lang={code}>
                    {name}
                  </span>
                  <span aria-hidden="true">{code}</span>
                </span>
              ) : (
                <Link
                  href={pathname}
                  locale={target}
                  onClick={(event) => handleClick(event, code)}
                  hrefLang={target}
                  lang={code}
                  aria-label={`${name} (${code.toUpperCase()})`}
                  className="text-fg-3 hover:text-fg focus-visible:ring-aerospace-ink inline-flex h-11 min-w-11 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none">
                  {code}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default FooterLanguages;

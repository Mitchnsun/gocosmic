'use client';

import { useLocale, useTranslations } from 'next-intl';

import FlagIcon from '@/components/icons/FlagIcon';
import { useLocaleLinkClick } from '@/components/LanguageSwitcher/useSwitchLocale';
import { cn } from '@/design-system/lib/utils';
import { getLanguage, isSwissLocale } from '@/i18n/locales';
import { Link, usePathname } from '@/i18n/navigation';

const REGIONS = [
  { key: 'ch', flag: 'ch' },
  { key: 'eu', flag: 'eu' },
] as const;

/** Region toggle: the same page in the same language, on the Swiss version of the site or on the rest of it. */
const FooterRegion = () => {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const language = getLanguage(locale);
  const currentKey = isSwissLocale(locale) ? 'ch' : 'eu';
  const pathname = usePathname();
  const handleClick = useLocaleLinkClick();

  return (
    <nav aria-label={t('switch_region')}>
      <ul className="border-line-2 inline-flex items-center rounded-full border p-0.5">
        {REGIONS.map(({ key, flag }) => {
          const target = key === 'ch' ? `${language}-CH` : language;
          const isCurrent = key === currentKey;
          const className = cn('inline-flex h-9 min-w-11 items-center justify-center rounded-full text-base', {
            'bg-line text-fg': isCurrent,
            'focus-visible:ring-aerospace-ink opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none':
              !isCurrent,
          });
          return (
            <li key={key}>
              {isCurrent ? (
                <span aria-current="true" className={className}>
                  <span className="sr-only">{t(`region.${key}`)}</span>
                  <FlagIcon code={flag} className="h-4 w-6" />
                </span>
              ) : (
                <Link
                  href={pathname}
                  locale={target}
                  hrefLang={target}
                  onClick={(event) => handleClick(event, target)}
                  aria-label={t(`region.${key}`)}
                  className={className}>
                  <FlagIcon code={flag} className="h-4 w-6" />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default FooterRegion;

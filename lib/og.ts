import { hasLocale } from 'next-intl';

import { routing } from '@/i18n/routing';

export function getOgImages(locale: string) {
  const safeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  return {
    og: `/og-default-${safeLocale}.jpg`,
    twitter: `/twitter-card-${safeLocale}.jpg`,
  };
}

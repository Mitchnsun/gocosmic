import { routing } from '@/i18n/routing';

export function getOgImages(locale: string) {
  const safeLocale = (routing.locales as readonly string[]).includes(locale) ? locale : routing.defaultLocale;
  return {
    og: `/og-default-${safeLocale}.jpg`,
    twitter: `/twitter-card-${safeLocale}.jpg`,
  };
}

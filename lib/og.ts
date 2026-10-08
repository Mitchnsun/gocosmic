import { getLanguage } from '@/i18n/locales';

/** Social images of a locale; a Swiss locale shares its language's images. */
export function getOgImages(locale: string) {
  const language = getLanguage(locale);
  return {
    og: `/og-default-${language}.jpg`,
    twitter: `/twitter-card-${language}.jpg`,
  };
}

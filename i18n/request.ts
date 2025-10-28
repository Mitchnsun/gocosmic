import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

/**
 * Load translation messages organized by namespace.
 * This allows for better organization and maintainability of translations.
 */
async function loadMessages(locale: string) {
  // Load all namespace files for the locale
  const [common, navigation, footer, home, about, services, offers, journey, projects] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/navigation.json`),
    import(`../messages/${locale}/footer.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/about.json`),
    import(`../messages/${locale}/services.json`),
    import(`../messages/${locale}/offers.json`),
    import(`../messages/${locale}/journey.json`),
    import(`../messages/${locale}/projects.json`),
  ]);

  // Merge all namespaces into a single messages object
  return {
    ...common.default,
    ...navigation.default,
    ...footer.default,
    ...home.default,
    ...about.default,
    ...services.default,
    ...offers.default,
    ...journey.default,
    ...projects.default,
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});

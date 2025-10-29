import { headers } from 'next/headers';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

/**
 * Map pathname patterns to required namespaces.
 * Common, navigation, and footer are always loaded for all pages.
 */
const getNamespacesForPath = (pathname: string): string[] => {
  // Remove locale prefix (e.g., /en/about -> /about)
  const pathWithoutLocale = pathname.replace(/^\/(en|fr|es|de|it)/, '');

  // Map routes to their specific namespaces
  if (pathWithoutLocale === '/' || pathWithoutLocale === '') {
    return ['home'];
  } else if (
    pathWithoutLocale.startsWith('/about') ||
    pathWithoutLocale.startsWith('/a-propos') ||
    pathWithoutLocale.startsWith('/acerca-de') ||
    pathWithoutLocale.startsWith('/ueber-uns') ||
    pathWithoutLocale.startsWith('/chi-siamo')
  ) {
    return ['about'];
  } else if (
    pathWithoutLocale.startsWith('/services') ||
    pathWithoutLocale.startsWith('/servicios') ||
    pathWithoutLocale.startsWith('/dienstleistungen') ||
    pathWithoutLocale.startsWith('/servizi')
  ) {
    return ['services'];
  } else if (
    pathWithoutLocale.startsWith('/offers') ||
    pathWithoutLocale.startsWith('/nos-offres') ||
    pathWithoutLocale.startsWith('/nuestras-ofertas') ||
    pathWithoutLocale.startsWith('/unsere-angebote') ||
    pathWithoutLocale.startsWith('/le-nostre-offerte')
  ) {
    return ['offers'];
  } else if (
    pathWithoutLocale.startsWith('/journey') ||
    pathWithoutLocale.startsWith('/voyage') ||
    pathWithoutLocale.startsWith('/viaje') ||
    pathWithoutLocale.startsWith('/reise') ||
    pathWithoutLocale.startsWith('/viaggio')
  ) {
    return ['journey'];
  } else if (
    pathWithoutLocale.startsWith('/projects') ||
    pathWithoutLocale.startsWith('/projets') ||
    pathWithoutLocale.startsWith('/proyectos') ||
    pathWithoutLocale.startsWith('/projekte') ||
    pathWithoutLocale.startsWith('/progetti')
  ) {
    return ['projects'];
  }

  // Default to home for unknown routes
  return ['home'];
};

/**
 * Load translation messages organized by namespace.
 * Only loads namespaces needed for the current route for optimal performance.
 */
async function loadMessages(locale: string, namespaces: string[]) {
  // Always load common, navigation, and footer (shared across all pages)
  const sharedNamespaces = ['common', 'navigation', 'footer'];
  const allNamespaces = [...new Set([...sharedNamespaces, ...namespaces])];

  const messages: Record<string, unknown> = {};

  // Load each namespace dynamically
  for (const namespace of allNamespaces) {
    try {
      const namespaceMessages = await import(`../messages/${locale}/${namespace}.json`);
      Object.assign(messages, namespaceMessages.default);
    } catch {
      console.warn(`Failed to load namespace ${namespace} for locale ${locale}`);
    }
  }

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the current pathname from headers set by middleware
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  // Determine which namespaces to load based on the route
  const namespaces = getNamespacesForPath(pathname);

  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale, namespaces),
  };
});

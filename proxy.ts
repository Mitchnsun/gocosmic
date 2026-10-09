import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { normalizeAcceptLanguage } from './i18n/locales';
import { routing } from './i18n/routing';
import { resolveRegion } from './lib/region';

const handleI18nRouting = createMiddleware(routing);

/** Visitor country resolved by the Vercel edge network. */
const COUNTRY_HEADER = 'x-vercel-ip-country';

/**
 * The request with its `Accept-Language` reduced for locale detection: a visitor located in Switzerland, or a
 * browser set to a Swiss locale, lands on the Swiss version of the site; everyone else on the language-only one.
 */
function withNormalizedLanguages(request: NextRequest): NextRequest {
  // Only page loads need locale detection; any other request (a Server Action post) keeps its body untouched.
  if (!['GET', 'HEAD'].includes(request.method)) return request;

  const inSwitzerland = resolveRegion(request.headers.get(COUNTRY_HEADER)) === 'ch';
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage === null && !inSwitzerland) return request;

  const headers = new Headers(request.headers);
  headers.set('accept-language', normalizeAcceptLanguage(acceptLanguage ?? '', inSwitzerland));
  return new NextRequest(request, { headers });
}

export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(withNormalizedLanguages(request));

  // Add the pathname to the response headers for use in i18n/request.ts
  response.headers.set('x-pathname', request.nextUrl.pathname);

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};

import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { normalizeAcceptLanguage } from './i18n/locales';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

/** The request with its `Accept-Language` reduced so that only a Swiss browser setting picks a Swiss locale. */
function withNormalizedLanguages(request: NextRequest): NextRequest {
  const acceptLanguage = request.headers.get('accept-language');
  // Only page loads need locale detection; any other request (a Server Action post) keeps its body untouched.
  if (!acceptLanguage || !['GET', 'HEAD'].includes(request.method)) return request;

  const headers = new Headers(request.headers);
  headers.set('accept-language', normalizeAcceptLanguage(acceptLanguage));
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

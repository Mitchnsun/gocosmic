/** Only Google Calendar booking pages may be framed — the CSP `frame-src` allows nothing else. */
const BOOKING_ORIGIN = 'https://calendar.google.com';

/**
 * Validates the booking page URL coming from `NEXT_PUBLIC_GCAL_BOOKING_URL` and
 * returns it ready to embed (`gv=true` is Google's embeddable view), or `null`
 * when it is missing or points anywhere else.
 */
export function toBookingEmbedUrl(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;

  try {
    const url = new URL(raw.trim());
    if (url.origin !== BOOKING_ORIGIN) return null;
    url.searchParams.set('gv', 'true');
    return url.toString();
  } catch {
    return null;
  }
}

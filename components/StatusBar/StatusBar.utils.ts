/**
 * Localised name of the month a new project can start.
 * A month already in the past (or an unreadable value) falls back to the current
 * month, so the bar never announces a date that has gone by.
 */
export function formatStartMonth(startMonth: string, locale: string, now: Date = new Date()): string {
  const [year = NaN, month = NaN] = startMonth.split('-').map(Number);
  const configured = new Date(Date.UTC(year, month - 1, 1));
  const current = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const start = configured > current ? configured : current;

  return new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(start);
}

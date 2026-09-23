/** localStorage key holding the timestamps of recent successful submissions. */
export const SUBMISSIONS_STORAGE_KEY = 'gocosmic.contactSubmissions';
/** Client-side budget, mirroring the Vercel Firewall rule documented in
 *  SECURITY.md: three POST requests per ten minutes and per IP address. */
export const CLIENT_SUBMISSION_LIMIT = 3;
/** Client-side window: ten minutes, the platform rule's own window. A stricter
 *  one would keep blocking a visitor the firewall has already let back in. */
export const CLIENT_SUBMISSION_WINDOW_MS = 10 * 60 * 1000;

/** Reads the recent submission timestamps, tolerating unavailable storage. */
export const readSubmissions = (now: number = Date.now()): number[] => {
  try {
    const raw = window.localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((value): value is number => typeof value === 'number')
      .filter((timestamp) => now - timestamp < CLIENT_SUBMISSION_WINDOW_MS);
  } catch {
    return [];
  }
};

/** Appends a submission timestamp, ignoring storage failures. */
export const recordSubmission = (now: number = Date.now()): void => {
  try {
    const next = [...readSubmissions(now), now];
    window.localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing or blocked storage — the server-side limit still applies.
  }
};

/** True when the visitor already reached the client-side submission budget. */
export const hasReachedSubmissionLimit = (now: number = Date.now()): boolean =>
  readSubmissions(now).length >= CLIENT_SUBMISSION_LIMIT;

/**
 * TypeError = a real network failure (`fetch` rejects per the Fetch API contract).
 * Any other Error = the request failed in transit — a firewall rate limit, a
 * stale action reference after a redeploy, an oversized payload, or an
 * unexpected 5xx — rather than inside the action itself, since neither
 * Server Action ever throws from within its own body. This is shape-based,
 * not a parsed status code, so it can't tell those causes apart: callers
 * should show a neutral "try again later" message, not claim the specific
 * cause was a rate limit.
 */
export const isRetryLaterError = (error: unknown): boolean => error instanceof Error && !(error instanceof TypeError);

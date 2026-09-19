/** Outcome of a rate-limit check. */
export interface RateLimitResult {
  /** Whether the request is allowed through. */
  allowed: boolean;
  /** Remaining requests in the current window. */
  remaining: number;
  /** Seconds to wait before the next attempt — `0` when allowed. */
  retryAfterSeconds: number;
}

export interface RateLimiterOptions {
  /** Maximum number of requests per window. */
  limit: number;
  /** Sliding window length in milliseconds. */
  windowMs: number;
}

export interface RateLimiter {
  /** Records an attempt for `key` and reports whether it is allowed. */
  check: (key: string, now?: number) => RateLimitResult;
  /** Number of keys currently held — used by tests. */
  size: () => number;
  /** Clears all recorded attempts — used by tests. */
  reset: () => void;
}

/**
 * Creates an in-memory sliding-window rate limiter.
 *
 * Scoped to a single server instance: enough to blunt casual abuse of the
 * public contact endpoint. Move to a shared store (Upstash, Vercel KV) if the
 * deployment ever spans several long-lived instances.
 *
 * @param options - Window length and request budget.
 */
export const createRateLimiter = ({ limit, windowMs }: RateLimiterOptions): RateLimiter => {
  const hits = new Map<string, number[]>();
  let lastSweep = Number.NEGATIVE_INFINITY;

  /** Drops keys whose attempts all fell out of the window.
   *  Without this, a key that never comes back is never cleaned up — one entry
   *  per one-time IP would grow the heap of a long-lived instance for ever. */
  const sweep = (now: number) => {
    if (now - lastSweep < windowMs) return;
    lastSweep = now;

    const windowStart = now - windowMs;
    for (const [key, timestamps] of hits) {
      const recent = timestamps.filter((timestamp) => timestamp > windowStart);
      if (recent.length === 0) hits.delete(key);
      else hits.set(key, recent);
    }
  };

  return {
    check: (key: string, now = Date.now()): RateLimitResult => {
      sweep(now);

      const windowStart = now - windowMs;
      const recent = (hits.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

      if (recent.length >= limit) {
        hits.set(key, recent);
        const oldest = recent[0] ?? now;
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
        };
      }

      recent.push(now);
      hits.set(key, recent);
      return { allowed: true, remaining: limit - recent.length, retryAfterSeconds: 0 };
    },
    size: () => hits.size,
    reset: () => {
      hits.clear();
      lastSweep = Number.NEGATIVE_INFINITY;
    },
  };
};

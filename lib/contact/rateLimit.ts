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

  return {
    check: (key: string, now = Date.now()): RateLimitResult => {
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
    reset: () => hits.clear(),
  };
};

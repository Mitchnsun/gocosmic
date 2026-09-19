import { describe, expect, it } from 'vitest';

import { createRateLimiter } from '@/lib/contact/rateLimit';

describe('createRateLimiter', () => {
  it('allows requests up to the limit and reports the remaining budget', () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });

    expect(limiter.check('ip', 0)).toEqual({ allowed: true, remaining: 2, retryAfterSeconds: 0 });
    expect(limiter.check('ip', 10).remaining).toBe(1);
    expect(limiter.check('ip', 20).remaining).toBe(0);
  });

  it('blocks the request beyond the limit and states when to retry', () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 });
    limiter.check('ip', 0);
    limiter.check('ip', 0);

    const blocked = limiter.check('ip', 1_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBe(59);
  });

  it('keys the budget per caller', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });

    expect(limiter.check('first', 0).allowed).toBe(true);
    expect(limiter.check('second', 0).allowed).toBe(true);
    expect(limiter.check('first', 0).allowed).toBe(false);
  });

  it('forgets attempts once the window slid past them', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    limiter.check('ip', 0);

    expect(limiter.check('ip', 500).allowed).toBe(false);
    expect(limiter.check('ip', 2000).allowed).toBe(true);
  });

  it('clears every recorded attempt on reset', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    limiter.check('ip', 0);
    limiter.reset();

    expect(limiter.check('ip', 0).allowed).toBe(true);
  });

  it('evicts keys whose attempts all fell out of the window', () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });

    for (let ip = 0; ip < 50; ip += 1) limiter.check(`ip-${ip}`, 0);
    expect(limiter.size()).toBe(50);

    // A later caller triggers the sweep: the 50 one-time keys are dropped.
    limiter.check('late', 5000);
    expect(limiter.size()).toBe(1);
  });

  it('keeps keys that are still inside the window', () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });

    limiter.check('kept', 4500);
    limiter.check('other', 5000);

    expect(limiter.size()).toBe(2);
    expect(limiter.check('kept', 5000).remaining).toBe(1);
  });

  it('sweeps at most once per window', () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });

    limiter.check('a', 0);
    limiter.check('b', 100);
    // Still inside the first window: the stale key survives until the next sweep.
    expect(limiter.size()).toBe(2);
  });
});

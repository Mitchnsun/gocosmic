import { describe, expect, it } from 'vitest';

import { isRetryLaterError } from '@/lib/serverActionError';

describe('isRetryLaterError', () => {
  it('is false for a real network failure (TypeError)', () => {
    expect(isRetryLaterError(new TypeError('Failed to fetch'))).toBe(false);
  });

  it('is true for a blocked or malformed Server Action response (plain Error)', () => {
    expect(isRetryLaterError(new Error('An unexpected response was received from the server.'))).toBe(true);
  });

  it('is false for a non-Error thrown value', () => {
    expect(isRetryLaterError('offline')).toBe(false);
    expect(isRetryLaterError(undefined)).toBe(false);
    expect(isRetryLaterError(null)).toBe(false);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CLIENT_SUBMISSION_WINDOW_MS,
  hasReachedSubmissionLimit,
  readSubmissions,
  recordSubmission,
  SUBMISSIONS_STORAGE_KEY,
} from '@/components/ContactForm/ContactForm.utils';

describe('ContactForm storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns no submission when storage is empty', () => {
    expect(readSubmissions()).toEqual([]);
    expect(hasReachedSubmissionLimit()).toBe(false);
  });

  it('records submissions and reports the limit', () => {
    recordSubmission(1000);
    recordSubmission(2000);
    expect(readSubmissions(2000)).toEqual([1000, 2000]);
    expect(hasReachedSubmissionLimit(2000)).toBe(false);

    recordSubmission(3000);
    expect(hasReachedSubmissionLimit(3000)).toBe(true);
  });

  it('drops submissions older than the window', () => {
    recordSubmission(1000);
    expect(readSubmissions(1000 + CLIENT_SUBMISSION_WINDOW_MS + 1)).toEqual([]);
  });

  it('ignores malformed stored values', () => {
    window.localStorage.setItem(SUBMISSIONS_STORAGE_KEY, 'not json');
    expect(readSubmissions()).toEqual([]);

    window.localStorage.setItem(SUBMISSIONS_STORAGE_KEY, '{"a":1}');
    expect(readSubmissions()).toEqual([]);

    window.localStorage.setItem(SUBMISSIONS_STORAGE_KEY, '[1000,"nope"]');
    expect(readSubmissions(1000)).toEqual([1000]);
  });

  it('survives unavailable storage', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(() => recordSubmission()).not.toThrow();
  });
});

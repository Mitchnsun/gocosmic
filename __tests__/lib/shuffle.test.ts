import { afterEach, describe, expect, it, vi } from 'vitest';

import { shuffle } from '@/lib/shuffle';

describe('shuffle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a new array with the same items without mutating the source array', () => {
    const source = ['Next.js', 'TypeScript', 'Tailwind CSS'];

    const result = shuffle(source);

    expect(result).not.toBe(source);
    expect(result.slice().sort()).toEqual(source.slice().sort());
    expect(source).toEqual(['Next.js', 'TypeScript', 'Tailwind CSS']);
  });

  it('returns an empty array unchanged', () => {
    expect(shuffle([])).toEqual([]);
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';

import { shuffle } from '@/lib/shuffle';

describe('shuffle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a shuffled copy without mutating the source array', () => {
    const source = ['Next.js', 'TypeScript', 'Tailwind CSS'];
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = shuffle(source);
    expect(result).toEqual(['TypeScript', 'Tailwind CSS', 'Next.js']);
    expect(source).toEqual(['Next.js', 'TypeScript', 'Tailwind CSS']);
  });

  it('returns an empty array unchanged', () => {
    expect(shuffle([])).toEqual([]);
  });
});

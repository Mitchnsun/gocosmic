import { describe, expect, it } from 'vitest';

import { getOgImages } from '@/lib/og';

describe('getOgImages', () => {
  it('returns en paths for en locale', () => {
    expect(getOgImages('en')).toEqual({
      og: '/og-default-en.jpg',
      twitter: '/twitter-card-en.jpg',
    });
  });

  it('returns fr paths for fr locale', () => {
    expect(getOgImages('fr')).toEqual({
      og: '/og-default-fr.jpg',
      twitter: '/twitter-card-fr.jpg',
    });
  });

  it('returns de paths for de locale', () => {
    expect(getOgImages('de')).toEqual({
      og: '/og-default-de.jpg',
      twitter: '/twitter-card-de.jpg',
    });
  });

  it('returns es paths for es locale', () => {
    expect(getOgImages('es')).toEqual({
      og: '/og-default-es.jpg',
      twitter: '/twitter-card-es.jpg',
    });
  });

  it('returns it paths for it locale', () => {
    expect(getOgImages('it')).toEqual({
      og: '/og-default-it.jpg',
      twitter: '/twitter-card-it.jpg',
    });
  });

  it('falls back to en for unknown locale', () => {
    expect(getOgImages('zh')).toEqual({
      og: '/og-default-en.jpg',
      twitter: '/twitter-card-en.jpg',
    });
  });
});

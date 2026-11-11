import {
  type AppRelease,
  getFiledNoticeUrl,
  MOI_PRESIDENT_CORRECTION,
  MOI_PRESIDENT_LINKS,
  MOI_PRESIDENT_RELEASES,
} from '@/data/moi-president';
import { ROUTE_FALLBACK_LANGUAGES } from '@/i18n/routing';

import { RELEASES } from '../moi-president-fixtures';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** The rules every published version must follow; checked on the real list and on the made-up one of the tests. */
function expectValidReleases(releases: readonly AppRelease[]) {
  const dates = releases.map(({ publishedOn }) => publishedOn);
  // The latest first, as the page shows them.
  expect(dates).toEqual([...dates].sort().reverse());
  expect(new Set(releases.map(({ version }) => version)).size).toBe(releases.length);

  for (const { version, publishedOn, polls, noticeUrl } of releases) {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(publishedOn).toMatch(ISO_DATE);
    if (noticeUrl) expect(noticeUrl).toMatch(/^https:\/\/www\.commission-des-sondages\.fr\//);
    for (const poll of polls) {
      // Every mention art. 2 of the law asks for, copied from the poll's own notice at the Commission.
      for (const value of [poll.institute, poll.sample, poll.question, poll.marginOfError])
        expect(value.trim()).not.toBe('');
      expect(poll.sponsors.length).toBeGreaterThan(0);
      expect(poll.fieldwork.from).toMatch(ISO_DATE);
      expect(poll.fieldwork.to >= poll.fieldwork.from).toBe(true);
      expect(poll.noticeUrl).toMatch(/^https:\/\/www\.commission-des-sondages\.fr\//);
    }
  }
}

describe("Moi Président's data", () => {
  it('lists no version before the first store release, so the pages say nothing about a filed notice', () => {
    expect(MOI_PRESIDENT_RELEASES).toEqual([]);
    expect(getFiledNoticeUrl()).toBeUndefined();
    expect(MOI_PRESIDENT_CORRECTION).toBeNull();
  });

  it('keeps every published version complete, the latest first', () => {
    expectValidReleases(MOI_PRESIDENT_RELEASES);
    expectValidReleases(RELEASES);
  });

  it('takes the filed notice of the latest version only', () => {
    expect(getFiledNoticeUrl(RELEASES)).toBe(RELEASES[0]?.noticeUrl);
    expect(getFiledNoticeUrl(RELEASES.slice(1))).toBeUndefined();
  });

  it('links secure sites and the support address only', () => {
    for (const href of Object.values(MOI_PRESIDENT_LINKS)) expect(href).toMatch(/^(https:\/\/|mailto:)/);
  });

  it('publishes in English every page whose other languages fall back to it', () => {
    for (const languages of Object.values(ROUTE_FALLBACK_LANGUAGES)) expect(languages).toContain('en');
  });
});

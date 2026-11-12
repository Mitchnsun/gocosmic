import { formatReleaseDate } from '@/components/CaseStudy/CaseStudy.utils';
import { type AppRelease, MOI_PRESIDENT_RELEASES } from '@/data/moi-president';

import type { ReleaseNoticeProps } from './MoiPresident.types';
import type { Translator } from './MoiPresident.utils';

/** Each published version for the notice of the simulation: its date, its frozen data and its polls. */
export function buildReleaseNotices(
  t: Translator,
  locale: string,
  releases: readonly AppRelease[] = MOI_PRESIDENT_RELEASES
): ReleaseNoticeProps[] {
  const key = 'legalNotice.sections.notice';

  return releases.map(({ version, publishedOn, polls, noticeUrl }) => ({
    id: `version-${version}`,
    heading: t(`${key}.release`, { version, date: formatReleaseDate(publishedOn, locale) }),
    frozen: t(`${key}.frozen`, { version }),
    pollsLabel: t(`${key}.polls`),
    noticeLink: noticeUrl ? { label: t(`${key}.filed_link`), href: noticeUrl } : undefined,
    polls: polls.map((poll) => ({
      rows: [
        { label: t(`${key}.poll.institute`), value: poll.institute },
        { label: t(`${key}.poll.sponsors`), value: poll.sponsors.join(', ') },
        {
          label: t(`${key}.poll.fieldwork`),
          value: t(`${key}.fieldwork`, {
            from: formatReleaseDate(poll.fieldwork.from, locale),
            to: formatReleaseDate(poll.fieldwork.to, locale),
          }),
        },
        { label: t(`${key}.poll.sample`), value: poll.sample, lang: 'fr' },
        { label: t(`${key}.poll.question`), value: poll.question, lang: 'fr' },
        { label: t(`${key}.poll.margin`), value: poll.marginOfError, lang: 'fr' },
      ],
      notice: { label: t(`${key}.poll.notice`), href: poll.noticeUrl },
    })),
  }));
}

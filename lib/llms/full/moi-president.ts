import { formatReleaseDate } from '@/components/CaseStudy/CaseStudy.utils';
import {
  type AppRelease,
  type Correction,
  MOI_PRESIDENT_CORRECTION,
  MOI_PRESIDENT_LINKS,
  MOI_PRESIDENT_RELEASES,
} from '@/data/moi-president';

import { EN } from '../llms.messages';
import { item, link, pageUrl, section } from '../llms.utils';

const NOTICE = 'legalNotice.sections.notice';

/** A published version of the game: its frozen data and, for each poll it starts from, the mentions of its notice. */
function releaseSection({ version, publishedOn, polls, noticeUrl }: AppRelease): string {
  const t = EN.moiPresidentLegal;
  const date = (iso: string) => formatReleaseDate(iso, 'en');
  const sources = polls.map((poll) =>
    item(
      `${poll.institute}, ${poll.sponsors.join(', ')}`,
      [
        `${t(`${NOTICE}.poll.fieldwork`)}: ${t(`${NOTICE}.fieldwork`, { from: date(poll.fieldwork.from), to: date(poll.fieldwork.to) })}.`,
        `${t(`${NOTICE}.poll.sample`)}: ${poll.sample}.`,
        `${t(`${NOTICE}.poll.question`)}: ${poll.question}`,
        `${t(`${NOTICE}.poll.margin`)}: ${poll.marginOfError}`,
        link(t(`${NOTICE}.poll.notice`), poll.noticeUrl),
      ].join(' ')
    )
  );

  return section(
    t(`${NOTICE}.release`, { version, date: date(publishedOn) }),
    [
      t(`${NOTICE}.frozen`, { version }),
      noticeUrl && link(t(`${NOTICE}.filed_link`), noticeUrl),
      sources.length > 0 ? section(t(`${NOTICE}.polls`), [sources.join('\n')], 4) : undefined,
    ],
    3
  );
}

/**
 * Moi Président, the studio's mobile game: its presentation and support page, then the notice of its simulation,
 * one section per published version (gocosmic#176). Its legal pages stay out, like the site's own.
 */
export function buildMoiPresidentSection(
  releases: readonly AppRelease[] = MOI_PRESIDENT_RELEASES,
  correction: Correction | null = MOI_PRESIDENT_CORRECTION
): string {
  const t = EN.moiPresident;

  return section(link(t('title'), pageUrl('/apps/moi-president')), [
    correction
      ? section(
          t('correction.title'),
          [t('correction.date', { date: formatReleaseDate(correction.date, 'en') }), correction.text.en],
          3
        )
      : undefined,
    `${t('eyebrow')}. ${t('lead')}`,
    `${(t.raw('categories') as string[]).join(' · ')}. ${t('stores_soon')}.`,
    `${t('support.lead')} ${link(t('support.email'), MOI_PRESIDENT_LINKS.email)}`,
    ...releases.map(releaseSection),
  ]);
}

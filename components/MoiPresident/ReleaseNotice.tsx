import { ExternalTextLink } from './ExternalTextLink';
import type { ReleaseNoticeProps } from './MoiPresident.types';
import { SourcePoll } from './SourcePoll';

/** A published version of the app in the notice of the simulation: its date, its frozen data and its polls. */
export function ReleaseNotice({ id, heading, frozen, pollsLabel, polls, noticeLink }: ReleaseNoticeProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="border-line mt-6 flex scroll-mt-24 flex-col gap-3 border-t pt-6">
      <h3 id={headingId} className="font-display text-fg text-lg font-semibold">
        {heading}
      </h3>
      <p className="text-fg-2 leading-relaxed">{frozen}</p>
      {noticeLink && <ExternalTextLink {...noticeLink} />}
      {polls.length > 0 && (
        <>
          <p id={`${id}-polls`} className="text-fg-3 text-2xs mt-2 font-mono tracking-[0.16em] uppercase">
            {pollsLabel}
          </p>
          <ol aria-labelledby={`${id}-polls`} className="flex flex-col gap-3">
            {polls.map((poll) => (
              <SourcePoll key={poll.notice.href} {...poll} />
            ))}
          </ol>
        </>
      )}
    </section>
  );
}

import { Fragment } from 'react';

import { ExternalTextLink } from './ExternalTextLink';
import type { SourcePollProps } from './MoiPresident.types';

/** One poll the simulation starts from: the mentions its notice gives, and a link to that notice. */
export function SourcePoll({ rows, notice }: SourcePollProps) {
  return (
    <li className="border-line rounded-xl border p-4 sm:p-5">
      <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[minmax(0,11rem)_1fr]">
        {rows.map(({ label, value, lang }) => (
          <Fragment key={label}>
            <dt className="text-fg-3 text-2xs pt-1 font-mono tracking-[0.12em] uppercase">{label}</dt>
            <dd lang={lang} className="text-fg-2 mb-2 sm:mb-1">
              {value}
            </dd>
          </Fragment>
        ))}
      </dl>
      <ExternalTextLink {...notice} />
    </li>
  );
}

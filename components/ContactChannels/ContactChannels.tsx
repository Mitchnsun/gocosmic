import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { AccentList } from '@/components/AccentList';
import { accentClasses } from '@/design-system/accent';
import { cn } from '@/design-system/lib/utils';

import { CONTACT_CHANNELS } from './constants';

/** Props for the direct email channel grid. */
export interface ContactChannelsProps {
  /** Accessible name for the list of channels. */
  ariaLabel: string;
  /** Additional classes for the wrapper. */
  className?: string;
}

/**
 * Grid of direct email channels — one card per inbox, with the reasons to use
 * it and a prefilled `mailto:` link.
 *
 * @component
 */
export const ContactChannels = ({ ariaLabel, className }: ContactChannelsProps) => {
  const t = useTranslations('contact');

  return (
    <ul aria-label={ariaLabel} className={cn('grid gap-4 md:grid-cols-2', className)}>
      {CONTACT_CHANNELS.map((channel, position) => {
        const { text, bg } = accentClasses(channel.accent);
        const email = t(`blocks.${channel.id}.email`);
        const subject = encodeURIComponent(t(`blocks.${channel.id}.subject`));

        return (
          <li
            key={channel.id}
            className="border-ghost/8 bg-ghost/[0.02] hover:bg-ghost/[0.04] flex flex-col rounded-2xl border p-6 transition-colors sm:p-8">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <p className={cn('text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase', text)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', bg)} aria-hidden="true" />
                {t(`blocks.${channel.id}.title`)}
              </p>
              <span className="text-ghost/35 text-3xs font-mono tracking-[0.2em]">
                {String(position + 1).padStart(2, '0')} / {String(CONTACT_CHANNELS.length).padStart(2, '0')}
              </span>
            </div>
            <p className="text-ghost font-display text-lg font-medium break-all">{email}</p>
            <AccentList
              className="mt-6"
              accent={channel.accent}
              label={t(`blocks.${channel.id}.reasons.title`)}
              items={channel.reasons.map((reason) => t(`blocks.${channel.id}.reasons.items.${reason}`))}
            />
            <a
              href={`mailto:${email}?subject=${subject}`}
              className="border-ghost/15 text-ghost hover:border-ghost hover:bg-ghost/5 focus-visible:ring-ghost font-display mt-8 inline-flex w-fit items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label={t(`blocks.${channel.id}.aria_label`)}>
              {t(`blocks.${channel.id}.cta`)}
              <EnvelopeIcon className="size-4" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
};

'use client';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { cn } from '@/design-system/lib/utils';
import { ghostPill, primaryPill } from '@/design-system/pill';

interface BookingEmbedProps {
  /** Validated embed URL (see `toBookingEmbedUrl`), or `null` while no booking page exists. */
  url: string | null;
}

/**
 * Google Calendar appointment page. Google sets its own cookies, so the iframe
 * only loads once the visitor asks for it; below 900 px, or without JavaScript,
 * the booking page opens in a new tab instead.
 */
export function BookingEmbed({ url }: BookingEmbedProps) {
  const t = useTranslations('contact.booking');
  const [loaded, setLoaded] = useState(false);

  if (!url) {
    return <p className="text-ghost/70 leading-relaxed">{t('unavailable')}</p>;
  }

  const openLink = (
    <a href={url} target="_blank" rel="noopener noreferrer" className={ghostPill('w-fit')}>
      {t('open')}
      <ArrowTopRightOnSquareIcon className="size-4" aria-hidden="true" />
    </a>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display font-semibold">{t('title')}</p>
        <p className="text-ghost/45 text-3xs font-mono tracking-[0.16em] uppercase">{t('via')}</p>
      </div>

      {/* Phones and narrow tablets: straight to Google's own page. */}
      <div className="min-[900px]:hidden">{openLink}</div>

      <div className="hidden min-[900px]:block">
        {loaded ? (
          <iframe
            src={url}
            title={t('iframe_title')}
            loading="lazy"
            className="h-[clamp(420px,60vh,600px)] w-full rounded-2xl border-0 bg-white"
          />
        ) : (
          <div
            className={cn(
              'border-ghost/15 flex h-[clamp(420px,60vh,600px)] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed p-8 text-center'
            )}>
            <p className="text-ghost/70 max-w-[46ch] leading-relaxed">{t('consent')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setLoaded(true)} className={primaryPill()}>
                {t('load')}
              </button>
              {openLink}
            </div>
          </div>
        )}
      </div>

      <p className="text-ghost/45 text-sm leading-relaxed">{t('note')}</p>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { cn } from '@/design-system/lib/utils';

import { useClock } from './useClock';

const StatusBar = () => {
  const t = useTranslations('status_bar');
  const { time, timeZone, mounted } = useClock();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return (
    <div
      role="status"
      aria-label={t('aria_label')}
      aria-live="off"
      className="border-ghost/10 text-ghost/60 text-3xs relative z-50 flex h-8 w-full items-center border-b bg-slate-900 px-4 tracking-widest uppercase sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="relative flex h-2 w-2 shrink-0" aria-label={t('aria_signal')} role="img">
            <span
              className={cn('bg-jungle absolute inline-flex h-full w-full rounded-full opacity-75', {
                'animate-ping': !reduceMotion,
              })}
            />
            <span className="bg-jungle relative inline-flex h-2 w-2 rounded-full" />
          </span>
          <span>{t('signal_stable')}</span>
          <span aria-hidden="true" className="text-ghost/30 hidden sm:inline">
            /
          </span>
          <span className="hidden sm:inline">
            {t('mission_control')}&nbsp;·&nbsp;{t('location')}
          </span>
        </div>
        <div className="tabular-nums">
          {mounted ? (
            <>
              {time}&nbsp;<span className="text-ghost/40">{timeZone}</span>
            </>
          ) : (
            <span className="invisible">00:00:00 UTC</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;

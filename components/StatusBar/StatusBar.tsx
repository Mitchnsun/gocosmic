import { useTranslations } from 'next-intl';

import { cn } from '@/design-system/lib/utils';
import { STUDIO_BASES } from '@/lib/config';
import { DEFAULT_REGION, type Region } from '@/lib/region';

import { AVAILABILITY, type Availability } from './StatusBar.constants';

interface StatusBarProps {
  /** Defaults to the studio's current schedule; overridable for tests and previews. */
  availability?: Availability;
  /** Drives which studio base is announced: Annecy for `fr`, Chêne-Bougeries for `ch`. */
  region?: Region;
}

/** HUD strip above the header: studio availability on the left, studio base on the right. */
const StatusBar = ({ availability = AVAILABILITY, region = DEFAULT_REGION }: StatusBarProps) => {
  const t = useTranslations('status_bar');
  const { status } = availability;
  const isAvailable = status === 'available';
  // eslint-disable-next-line security/detect-object-injection -- region is the typed Region union
  const { city, altitude } = STUDIO_BASES[region];

  return (
    <div
      role="status"
      aria-label={t('aria_label')}
      aria-live="off"
      className="border-ghost/8 bg-void text-ghost/35 text-3xs relative z-50 flex h-8 w-full items-center border-b font-mono tracking-[0.18em] uppercase">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="flex min-w-0 items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            {isAvailable && (
              <span className="bg-jungle absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:animate-none" />
            )}
            <span
              className={cn('relative inline-flex h-2 w-2 rounded-full', {
                'bg-jungle': isAvailable,
                'bg-ghost/40': !isAvailable,
              })}
            />
          </span>
          <span className="text-ghost/60 shrink-0">{t(`${status}.label`)}</span>
        </p>
        <p className="hidden shrink-0 sm:block">
          {t('mission_control')} · {city} · {altitude}
        </p>
      </div>
    </div>
  );
};

export default StatusBar;

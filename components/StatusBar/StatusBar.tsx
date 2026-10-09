import { useTranslations } from 'next-intl';

import { SignalDot } from '@/design-system/signal-dot';
import { STUDIO_BASES } from '@/lib/config';
import { DEFAULT_REGION, type Region } from '@/lib/region';

interface StatusBarProps {
  /** Drives which studio base is announced: Annecy for `fr`, Chêne-Bougeries for `ch`. */
  region?: Region;
}

/** HUD strip above the header: studio availability on the left, studio base on the right. */
const StatusBar = ({ region = DEFAULT_REGION }: StatusBarProps) => {
  const t = useTranslations('status_bar');
  // eslint-disable-next-line security/detect-object-injection -- region is the typed Region union
  const { city, altitude } = STUDIO_BASES[region];

  return (
    <div
      role="status"
      aria-label={t('aria_label')}
      aria-live="off"
      className="border-line bg-bg text-fg-3 text-3xs relative z-50 flex h-8 w-full items-center border-b font-mono tracking-[0.18em] uppercase">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="flex min-w-0 items-center gap-2">
          <SignalDot />
          <span className="text-fg-2 shrink-0">{t('available')}</span>
        </p>
        <p className="hidden shrink-0 sm:block">
          {t('mission_control')} · {city} · {altitude}
        </p>
      </div>
    </div>
  );
};

export default StatusBar;

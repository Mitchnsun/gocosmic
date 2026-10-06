'use client';

import { useTranslations } from 'next-intl';

import CometIcon from '@/components/icons/CometIcon';
import SunIcon from '@/components/icons/SunIcon';
import { cn } from '@/design-system/lib/utils';

import { useThemeSwitch } from './Theme.hooks';

/**
 * 44 px high switch: a comet (dark theme) on the left, a sun (light theme) on the right, and a thumb
 * sliding under the active one. The label names the action ("Switch to the light theme"), so it carries
 * no `aria-pressed`. The thumb and icons follow `data-theme` in CSS, so they are right from the first
 * paint even before hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations('theme');
  const { theme, switchTheme } = useThemeSwitch();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={switchTheme}
      aria-label={t(isLight ? 'toggle_dark' : 'toggle_light')}
      className={cn(
        'border-line-2 hover:border-fg-3 focus-visible:ring-aerospace-ink relative flex h-11 w-20 shrink-0 cursor-pointer items-center rounded-full border px-[3px] transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className
      )}>
      <span
        aria-hidden="true"
        className="theme-toggle-thumb bg-fg/10 light:translate-x-9 absolute top-1/2 left-[3px] h-9 w-9 -translate-y-1/2 rounded-full transition-transform duration-300 motion-reduce:transition-none"
      />
      <CometIcon className="text-fg light:text-fg-3 relative h-5 w-9 shrink-0 px-2" />
      <SunIcon className="text-fg-3 light:text-fg relative h-5 w-9 shrink-0 px-2" />
    </button>
  );
}

'use client';

import { useTranslations } from 'next-intl';

import MoonIcon from '@/components/icons/MoonIcon';
import SunIcon from '@/components/icons/SunIcon';
import { cn } from '@/design-system/lib/utils';

import { useThemeSwitch } from './Theme.hooks';

/**
 * 44 px pill switching between the dark and light themes. The label names the action ("Switch to the
 * light theme"), so it carries no `aria-pressed`. The icon follows `data-theme` in CSS, so it is right
 * from the first paint even before hydration.
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
        'border-line-2 hover:border-fg-3 focus-visible:ring-aerospace-ink text-fg flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className
      )}>
      <SunIcon className="light:hidden h-5 w-5" />
      <MoonIcon className="light:block hidden h-5 w-5" />
    </button>
  );
}

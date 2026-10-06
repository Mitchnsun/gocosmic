import type { ReactNode } from 'react';

import { cn } from '@/design-system/lib/utils';
import type { ThemeFace } from '@/design-system/tokens';

import { THEME_LABELS } from './DesignSystemShowcase.copy';
import type { ShowcaseMode, ShowcaseSection } from './DesignSystemShowcase.types';

interface ThemedSectionProps {
  section: ShowcaseSection;
  index: number;
  mode: ShowcaseMode;
  /** Section content for one theme, rendered once per panel. */
  children: (theme: ThemeFace) => ReactNode;
}

/**
 * Numbered section rendering its content in one `data-theme` panel per shown theme, so the tokens
 * re-scope locally whatever the visitor's own theme.
 */
export function ThemedSection({ section, index, mode, children }: ThemedSectionProps) {
  const themes: ThemeFace[] = mode === 'both' ? ['dark', 'light'] : [mode];
  const titleId = `${section.id}-title`;

  return (
    <section
      id={section.id}
      aria-labelledby={titleId}
      className="flex scroll-mt-[calc(var(--header-height)+5rem)] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-fg-3 text-2xs font-mono tracking-[0.22em] uppercase">{String(index + 1).padStart(2, '0')}</p>
        <h2 id={titleId} className="font-display text-fg text-3xl font-semibold tracking-[-0.03em]">
          {section.title}
        </h2>
        <p className="text-fg-2 max-w-[56ch] text-base leading-relaxed">{section.lead}</p>
      </div>
      <div className={cn('grid gap-6', { 'lg:grid-cols-2': themes.length === 2 })}>
        {themes.map((theme) => {
          // eslint-disable-next-line security/detect-object-injection -- typed theme face
          const label = THEME_LABELS[theme];
          return (
            <div
              key={theme}
              data-theme={theme}
              aria-label={`${section.title} · ${label}`}
              role="group"
              className="bg-bg text-fg border-line-2 flex min-w-0 flex-col gap-6 rounded-3xl border p-[clamp(1.25rem,3vw,2rem)]">
              <p className="text-fg-3 text-2xs font-mono tracking-[0.22em] uppercase">{label}</p>
              {children(theme)}
            </div>
          );
        })}
      </div>
    </section>
  );
}

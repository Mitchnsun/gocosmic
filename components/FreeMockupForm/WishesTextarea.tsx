'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/design-system/lib/utils';

import type { WishesTextareaProps } from './FreeMockupForm.types';
import { getWishesCounter, WISHES_MAX_LENGTH } from './FreeMockupForm.utils';

const FIELD_ID = 'free-mockup-wishes';
const COUNTER_ID = 'free-mockup-wishes-counter';
const ERROR_ID = 'free-mockup-wishes-error';

/** Free-text field where the visitor describes what they have in mind, with a live counter. */
export function WishesTextarea({ value, onChange, error, onBlur }: WishesTextareaProps) {
  const t = useTranslations('freeMockup');
  const { count, max, isAtLimit } = getWishesCounter(value);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={FIELD_ID} className="font-display text-ghost flex items-baseline gap-2 text-sm font-medium">
        {t('form.wishes_label')}
        <span className="text-ghost/35 text-2xs font-mono tracking-widest uppercase">{t('form.optional')}</span>
      </label>
      <textarea
        id={FIELD_ID}
        name="wishes"
        rows={5}
        maxLength={WISHES_MAX_LENGTH}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={t('form.wishes_placeholder')}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${COUNTER_ID} ${ERROR_ID}` : COUNTER_ID}
        className="border-ghost/8 bg-ghost/[0.02] text-ghost placeholder:text-ghost/25 focus-visible:border-aerospace/40 focus-visible:ring-aerospace w-full resize-y rounded-xl border p-3 text-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
      />
      <div className="flex items-baseline justify-between gap-3">
        {error ? (
          <p id={ERROR_ID} className="text-aerospace text-sm">
            {t(`validation.${error}`)}
          </p>
        ) : (
          <span />
        )}
        <span
          id={COUNTER_ID}
          className={cn('font-mono text-xs tabular-nums', isAtLimit ? 'text-aerospace' : 'text-ghost/35')}>
          {t('form.wishes_counter', { count, max })}
        </span>
      </div>
    </div>
  );
}

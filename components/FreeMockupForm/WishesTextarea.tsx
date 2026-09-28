'use client';

import { useTranslations } from 'next-intl';

import { Field, FIELD_TEXTAREA } from '@/design-system/field';
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
    <Field id={FIELD_ID} label={t('form.wishes_label')} hint={t('form.optional')}>
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
        className={cn(FIELD_TEXTAREA, 'resize-y')}
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
          className={cn('font-mono text-xs tabular-nums', isAtLimit ? 'text-aerospace' : 'text-fg-3')}>
          {t('form.wishes_counter', { count, max })}
        </span>
      </div>
    </Field>
  );
}

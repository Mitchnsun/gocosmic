'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Chip } from '@/design-system/chip';
import { InfoPopover } from '@/design-system/info-popover';
import { cn } from '@/design-system/lib/utils';

import { EXTRA_MAILBOX_PRICE, MAX_EXTRA_MAILBOXES } from './constants';

const STEP_BUTTON = cn(
  'border-line-2 text-fg hover:border-fg-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-full border transition-colors',
  'focus-visible:ring-aerospace-ink focus-visible:ring-2 focus-visible:outline-none',
  'aria-disabled:cursor-not-allowed aria-disabled:opacity-40'
);

interface MailboxCounterProps {
  value: number;
  onChange: (value: number) => void;
  surcharge: (amount: number) => string;
  /** Example domain of the hint. */
  domain: string;
}

/**
 * Number of extra mailboxes, from 0 to `MAX_EXTRA_MAILBOXES`, with − and + buttons. At either end
 * the button is marked `aria-disabled` rather than disabled, so the keyboard focus stays on it.
 */
export function MailboxCounter({ value, onChange, surcharge, domain }: MailboxCounterProps) {
  const t = useTranslations('pricing.builder');
  const id = useId();
  const label = t('options.mailboxes.label');
  const step = (delta: number) => {
    const next = value + delta;
    if (next >= 0 && next <= MAX_EXTRA_MAILBOXES) onChange(next);
  };

  return (
    <div className="border-line bg-surface rounded-lg border p-4">
      <div className="flex items-start gap-1">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p id={`${id}-label`} className="font-display text-fg text-sm font-medium">
              {label}
            </p>
            <p className="text-fg-3 font-mono text-sm tracking-wider tabular-nums">
              {t('options.mailboxes.price', { price: surcharge(EXTRA_MAILBOX_PRICE) })}
            </p>
          </div>
          <p id={`${id}-hint`} className="text-fg-2 mt-1 text-sm">
            {t('options.mailboxes.hint', { domain })}
          </p>
          <Chip className="mt-2">{t('commitment')}</Chip>
        </div>
        <InfoPopover label={t('info_label', { option: label })} title={label} className="-mt-2.5 -mr-2.5">
          <p>{t('options.email_extras.info')}</p>
        </InfoPopover>
      </div>
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-hint`}
        className="mt-3 flex items-center gap-3">
        <button
          type="button"
          aria-label={t('options.mailboxes.decrease')}
          aria-disabled={value === 0}
          onClick={() => step(-1)}
          className={STEP_BUTTON}>
          <MinusIcon className="size-4" aria-hidden="true" />
        </button>
        <span aria-live="polite" className="font-display text-fg min-w-[12ch] text-center text-sm tabular-nums">
          {t('options.mailboxes.count', { count: value })}
        </span>
        <button
          type="button"
          aria-label={t('options.mailboxes.increase')}
          aria-disabled={value === MAX_EXTRA_MAILBOXES}
          onClick={() => step(1)}
          className={STEP_BUTTON}>
          <PlusIcon className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

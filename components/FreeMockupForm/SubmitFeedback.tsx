'use client';

import { useTranslations } from 'next-intl';

import type { FreeMockupStatus } from './FreeMockupForm.types';

interface SubmitFeedbackProps {
  status: FreeMockupStatus;
  /** True when the failure is a field-level one, already shown inline. */
  hasInvalidFields: boolean;
}

/**
 * Persistent live region announcing the outcome of a submission. It stays in the
 * DOM at all times so assistive technology picks the message up when it appears.
 */
export function SubmitFeedback({ status, hasInvalidFields }: SubmitFeedbackProps) {
  const t = useTranslations('freeMockup');

  return (
    <div aria-live="polite" aria-atomic="true">
      {status === 'success' && (
        <div className="border-jungle/25 bg-jungle/[0.06] rounded-2xl border p-6">
          <p className="text-jungle text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase">
            <span className="bg-jungle h-2 w-2 shrink-0 rounded-full" aria-hidden="true" />
            {t('form.success_title')}
          </p>
          <p className="text-ghost/70 mt-3 text-sm">{t('form.success_message')}</p>
        </div>
      )}
      {status === 'error' && (
        <p className="border-aerospace/30 bg-aerospace/[0.06] text-ghost/70 rounded-xl border p-4 text-sm">
          {hasInvalidFields ? t('form.invalid_message') : t('form.error_message')}
        </p>
      )}
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef } from 'react';

import { ghostPill, primaryPill } from '@/design-system/pill';

interface ReplaceConfirmProps {
  onReplace: () => void;
  onCancel: () => void;
}

/**
 * Warning before the answers overwrite options the visitor ticked by hand. Focus moves to "Replace",
 * which the warning describes, so it is read once with the button.
 */
export function ReplaceConfirm({ onReplace, onCancel }: ReplaceConfirmProps) {
  const t = useTranslations('pricing.guide.confirm');
  const replaceRef = useRef<HTMLButtonElement>(null);
  const textId = useId();

  useEffect(() => {
    replaceRef.current?.focus();
  }, []);

  return (
    <div className="border-aerospace/30 bg-aerospace/[0.04] flex flex-col gap-4 rounded-xl border p-4">
      <p id={textId} className="text-fg text-sm">
        {t('text')}
      </p>
      <div className="flex flex-wrap gap-3">
        <button ref={replaceRef} type="button" onClick={onReplace} aria-describedby={textId} className={primaryPill()}>
          {t('replace')}
        </button>
        <button type="button" onClick={onCancel} className={ghostPill()}>
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}

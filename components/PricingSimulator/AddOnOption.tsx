'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { COMMITTED_OPTIONS } from './constants';
import { OptionToggle } from './OptionToggle';
import type { AddOnKey } from './PricingSimulator.types';
import { getAddOnPrice } from './PricingSimulator.utils';

interface AddOnOptionProps {
  id: AddOnKey;
  checked: boolean;
  onToggle: (id: AddOnKey) => void;
  surcharge: (amount: number) => string;
  /** Values of the hint and the info text, e.g. the example domain. */
  values?: Record<string, string>;
  note?: string;
  /** Locks the tick box, when the option follows another answer. */
  disabled?: boolean;
  nested?: boolean;
  children?: ReactNode;
}

/** A tickable add-on, with its copy, price, info bubble and commitment read from the price table. */
export function AddOnOption({
  id,
  checked,
  onToggle,
  surcharge,
  values,
  note,
  disabled,
  nested,
  children,
}: AddOnOptionProps) {
  const t = useTranslations('pricing.builder');
  const label = t(`options.${id}.label`);

  return (
    <OptionToggle
      label={label}
      hint={t(`options.${id}.hint`, values)}
      price={surcharge(getAddOnPrice(id))}
      checked={checked}
      onChange={() => onToggle(id)}
      info={
        t.has(`options.${id}.info`)
          ? { label: t('info_label', { option: label }), text: t(`options.${id}.info`, values) }
          : undefined
      }
      commitment={COMMITTED_OPTIONS.has(id) ? t('commitment') : undefined}
      note={note}
      disabled={disabled}
      nested={nested}>
      {children}
    </OptionToggle>
  );
}

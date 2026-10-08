'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { ONE_YEAR_OPTIONS } from './constants';
import { OptionToggle } from './OptionToggle';
import type { AddOnKey } from './PricingSimulator.types';
import { getAddOnPrice } from './PricingSimulator.utils';

interface AddOnOptionProps {
  id: AddOnKey;
  checked: boolean;
  onToggle: (id: AddOnKey) => void;
  surcharge: (amount: number) => string;
  /** Values of the hint, e.g. the example domain. */
  values?: Record<string, string>;
  /** Key of the info text under `options`, when it is shared with another option. */
  infoKey?: string;
  note?: string;
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
  infoKey = `${id}.info`,
  note,
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
        t.has(`options.${infoKey}`)
          ? { label: t('info_label', { option: label }), text: t(`options.${infoKey}`) }
          : undefined
      }
      commitment={ONE_YEAR_OPTIONS.has(id) ? t('commitment') : undefined}
      note={note}
      nested={nested}>
      {children}
    </OptionToggle>
  );
}

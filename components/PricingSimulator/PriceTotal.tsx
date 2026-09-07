'use client';

import { useId } from 'react';

interface PriceTotalProps {
  label: string;
  /** Pre-formatted amount, e.g. `25€`. */
  amount: string;
  period: string;
  note: string;
}

/** Live readout of the composed monthly price. */
export function PriceTotal({ label, amount, period, note }: PriceTotalProps) {
  const labelId = useId();

  return (
    <div className="border-ghost/8 bg-ghost/[0.02] rounded-2xl border p-6">
      <p id={labelId} className="text-ghost/55 text-2xs font-mono tracking-[0.24em] uppercase">
        {label}
      </p>
      <p className="mt-3 flex items-baseline gap-2">
        <output
          aria-labelledby={labelId}
          aria-live="polite"
          className="text-aerospace font-display text-5xl font-bold tabular-nums">
          {amount}
        </output>
        <span className="text-ghost/55 font-display text-base">{period}</span>
      </p>
      <p className="text-ghost/35 mt-3 text-sm">{note}</p>
    </div>
  );
}

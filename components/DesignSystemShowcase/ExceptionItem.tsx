import type { ReactNode } from 'react';

interface ExceptionItemProps {
  title: string;
  reason: string;
  children: ReactNode;
}

/** A theme exception: its live sample, then why it does not follow the theme. */
export function ExceptionItem({ title, reason, children }: ExceptionItemProps) {
  return (
    <li className="bg-surface border-line flex flex-col gap-3 rounded-2xl border p-5">
      <div className="flex min-h-24 items-center">{children}</div>
      <h3 className="font-display text-fg text-lg font-semibold">{title}</h3>
      <p className="text-fg-2 text-sm">{reason}</p>
    </li>
  );
}

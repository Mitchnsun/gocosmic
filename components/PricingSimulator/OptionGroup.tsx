import { type ReactNode, useId } from 'react';

/** Titled group of options in the builder ("Your site", "Your address on the web"…). */
export function OptionGroup({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();

  return (
    <section aria-labelledby={id} className="space-y-3">
      <h4 id={id} className="font-display text-fg pt-2 text-base font-semibold">
        {title}
      </h4>
      {children}
    </section>
  );
}

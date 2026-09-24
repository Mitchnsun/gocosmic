import { cn } from '@/design-system/lib/utils';

export interface ContactDetail {
  label: string;
  value: string;
  /** `mailto:` or external link; the value is then rendered as a link. */
  href?: string;
}

interface ContactDetailsProps {
  details: ContactDetail[];
  /** Availability line, e.g. `Disponible · Nouveaux projets dès octobre`. */
  status: string;
  available: boolean;
  ariaLabel: string;
}

/** Direct contact lines next to the form: addresses, area served and current availability. */
export function ContactDetails({ details, status, available, ariaLabel }: ContactDetailsProps) {
  return (
    <div className="border-ghost/10 divide-ghost/10 flex flex-col divide-y rounded-2xl border">
      <dl aria-label={ariaLabel} className="divide-ghost/10 flex flex-col divide-y">
        {details.map((detail) => (
          <div key={detail.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:items-baseline">
            <dt className="text-ghost/45 text-3xs font-mono tracking-[0.16em] uppercase">{detail.label}</dt>
            <dd className="text-ghost/80">
              {detail.href ? (
                <a
                  href={detail.href}
                  className="hover:text-aerospace focus-visible:ring-aerospace/70 rounded underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none">
                  {detail.value}
                </a>
              ) : (
                detail.value
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-ghost/70 flex items-center gap-2.5 px-5 py-4 text-sm">
        <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0">
          {available && (
            <span className="bg-jungle absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:animate-none" />
          )}
          <span
            className={cn('relative inline-flex h-2 w-2 rounded-full', {
              'bg-jungle': available,
              'bg-ghost/40': !available,
            })}
          />
        </span>
        {status}
      </p>
    </div>
  );
}

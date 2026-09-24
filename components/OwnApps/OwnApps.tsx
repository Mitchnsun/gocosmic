import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import type { ComponentProps, ReactNode } from 'react';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

export interface OwnApp {
  name: string;
  /** Mono chip, e.g. `iOS · Android`. */
  badge: string;
  description: string;
  linkLabel: string;
  href: ComponentProps<typeof Link>['href'];
  icon: { src: string; alt: string };
}

interface OwnAppsProps {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  app: OwnApp;
  id?: string;
}

/** The studio's own products, presented as proof that it ships real apps. */
export function OwnApps({ eyebrow, title, lead, app, id = 'own-apps' }: OwnAppsProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn('bg-space', SECTION_Y)}>
      <div className={cn(CONTAINER, 'grid items-center gap-[clamp(2rem,5vw,5rem)] lg:grid-cols-2')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} lead={lead} />
        <Link
          href={app.href}
          className="group border-ghost/12 bg-void/50 hover:border-ghost/30 focus-visible:ring-aerospace/70 grid grid-cols-[auto_1fr] items-center gap-6 rounded-3xl border p-7 transition-colors focus-visible:ring-2 focus-visible:outline-none">
          <Image
            src={app.icon.src}
            alt={app.icon.alt}
            width={88}
            height={88}
            className="h-[88px] w-[88px] rounded-[22px] object-cover"
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">{app.name}</h3>
              <span className="border-jungle/50 text-jungle text-3xs rounded-full border px-2.5 py-0.5 font-mono tracking-[0.12em] uppercase">
                {app.badge}
              </span>
            </div>
            <p className="text-ghost/65 leading-normal">{app.description}</p>
            <span className="font-display text-aerospace inline-flex items-center gap-1.5 text-[15px] font-medium">
              {app.linkLabel}
              <ArrowRightIcon
                className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

import Image from 'next/image';

import Starfield from '@/components/Starfield';
import { accentClasses } from '@/design-system/accent';
import { cn } from '@/design-system/lib/utils';

import type { CaseStudyProps } from './CaseStudy.types';

type CaseStudyHeroProps = Pick<CaseStudyProps, 'eyebrow' | 'title' | 'tagline' | 'heroImage' | 'logo' | 'meta'> & {
  accent: NonNullable<CaseStudyProps['accent']>;
  /** Heading id, wired to the section's `aria-labelledby`. */
  headingId: string;
};

/**
 * Case study hero: full-bleed project image when available, starfield
 * otherwise, with the project name and tagline overlaid.
 *
 * @component
 */
export const CaseStudyHero = ({
  eyebrow,
  title,
  tagline,
  heroImage,
  logo,
  meta,
  accent,
  headingId,
}: CaseStudyHeroProps) => {
  const { text, bg } = accentClasses(accent);

  return (
    <section
      aria-labelledby={headingId}
      className="bg-void text-ghost relative isolate flex min-h-[18rem] items-end overflow-hidden px-4 py-16 sm:min-h-[22rem] sm:px-6 lg:min-h-[28rem] lg:px-8 lg:py-20">
      {heroImage ? (
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-50"
        />
      ) : (
        <div className="absolute inset-0 -z-20" aria-hidden="true">
          <Starfield className="h-full w-full opacity-60" starCount={180} speed={1} />
        </div>
      )}
      <div
        className="from-void via-void/70 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 m-auto flex w-full max-w-7xl flex-col gap-5">
        {logo && (
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width ?? 72}
            height={logo.height ?? 72}
            className="border-ghost/8 bg-void/60 h-16 w-16 rounded-2xl border object-contain p-2"
          />
        )}
        <p className={cn('text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase', text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', bg)} aria-hidden="true" />
          {eyebrow}
        </p>
        <h1
          id={headingId}
          className="font-display text-[clamp(2.25rem,6.5vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.04em] text-balance">
          {title}
        </h1>
        <p className="text-ghost/55 max-w-2xl text-lg leading-8">{tagline}</p>
        {meta && meta.length > 0 && (
          <ul className="text-ghost/35 text-3xs flex flex-wrap gap-x-6 gap-y-2 font-mono tracking-[0.2em] uppercase">
            {meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

import Image from 'next/image';

import NightStarfield from '@/components/Starfield/NightStarfield';
import { SunGlow } from '@/components/Sun';
import { accentClasses } from '@/design-system/accent';
import { cn } from '@/design-system/lib/utils';

import type { CaseStudyProps } from './CaseStudy.types';

type CaseStudyHeroProps = Pick<CaseStudyProps, 'eyebrow' | 'title' | 'tagline' | 'heroImage' | 'logo' | 'meta'> & {
  accent: NonNullable<CaseStudyProps['accent']>;
  /** Heading id, wired to the section's `aria-labelledby`. */
  headingId: string;
};

/**
 * Case study hero: full-bleed project image when available (a dark island in
 * both themes), otherwise a starfield in the dark theme and a sun glow in the
 * light theme, with the project name and tagline overlaid.
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
    // The dimmed project image needs the night-coloured gradient in both themes, so it stays a dark island.
    <section
      aria-labelledby={headingId}
      data-theme={heroImage ? 'dark' : undefined}
      className="bg-bg text-fg relative isolate flex min-h-72 items-end overflow-hidden p-4 sm:min-h-88 sm:p-6 lg:min-h-112 lg:p-8">
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
        <>
          <NightStarfield className="h-full w-full opacity-60" starCount={180} speed={1} respectReducedMotion />
          <SunGlow className="top-0 right-0 -z-20 w-[min(90vw,900px)] translate-x-1/3 -translate-y-1/2" />
        </>
      )}
      <div
        className="from-bg via-bg/70 pointer-events-none absolute inset-0 -z-10 bg-linear-to-t to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 m-auto flex w-full max-w-7xl flex-col gap-5">
        <p className={cn('text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase', text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', bg)} aria-hidden="true" />
          {eyebrow}
        </p>
        <div className="flex items-center gap-4">
          {logo && (
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width ?? 72}
              height={logo.height ?? 72}
              className="border-line bg-bg/60 h-16 w-16 rounded-2xl border object-contain p-2"
              style={logo.background ? { backgroundColor: logo.background } : undefined}
            />
          )}
          <h1
            id={headingId}
            className="font-display text-[clamp(2.25rem,6.5vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.04em] text-balance">
            {title}
          </h1>
        </div>
        <p className="text-fg-2 text-lg leading-8">{tagline}</p>
        {meta && meta.length > 0 && (
          <ul className="text-fg-3 text-3xs flex flex-wrap gap-x-6 gap-y-2 font-mono tracking-[0.2em] uppercase">
            {meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

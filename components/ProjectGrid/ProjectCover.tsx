import Image from 'next/image';

import { cn } from '@/design-system/lib/utils';

import type { ProjectCardContent } from './ProjectGrid.types';

/**
 * 16/10 visual of a card: the project's photo with its logo, if any, in the corner, its logo or icon alone, or its
 * name when no visual exists yet.
 */
export function ProjectCover({
  cover,
  illustration,
  title,
}: Pick<ProjectCardContent, 'cover' | 'illustration' | 'title'>) {
  if (illustration) {
    return (
      <div className="border-line relative aspect-[16/10] border-b">
        <Image
          src={illustration.src}
          alt={illustration.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover"
        />
        {cover && (
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            className="border-line absolute top-3 right-3 size-10 rounded-xl border object-contain p-1"
            style={{ background: cover.background }}
          />
        )}
      </div>
    );
  }

  if (!cover) {
    return (
      <div aria-hidden="true" className="border-line bg-stripes grid aspect-[16/10] place-items-center border-b px-6">
        <span className="font-display text-fg-2 text-center text-2xl font-semibold tracking-[-0.02em]">{title}</span>
      </div>
    );
  }

  return (
    <div
      className="border-line grid aspect-[16/10] place-items-center border-b"
      style={{ background: cover.background }}>
      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes="(max-width: 640px) 50vw, 200px"
        className={cn({
          'h-auto w-2/5 max-w-60': cover.fit === 'logo',
          'aspect-square h-1/2 w-auto rounded-[22%]': cover.fit === 'icon',
        })}
      />
    </div>
  );
}

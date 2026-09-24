import Image from 'next/image';

import { cn } from '@/design-system/lib/utils';

import type { ProjectCardContent } from './ProjectGrid.types';

/** 16/10 visual of a card: the project's logo or icon, or its name when no visual exists yet. */
export function ProjectCover({ cover, title }: Pick<ProjectCardContent, 'cover' | 'title'>) {
  if (!cover) {
    return (
      <div
        aria-hidden="true"
        className="border-ghost/8 grid aspect-[16/10] place-items-center border-b bg-[repeating-linear-gradient(135deg,rgb(248_248_255/0.03)_0_12px,transparent_12px_24px)] px-6">
        <span className="font-display text-ghost/70 text-center text-2xl font-semibold tracking-[-0.02em]">
          {title}
        </span>
      </div>
    );
  }

  return (
    <div
      className="border-ghost/8 grid aspect-[16/10] place-items-center border-b"
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

import Starfield from '@/components/Starfield';
import { Sun } from '@/components/Sun';
import { accentClasses } from '@/design-system/accent';
import type { ThemeFace } from '@/design-system/tokens';

/** The immersive scene of each face in a 16/9 frame, with the hero's default props. */
export function Illustrations({ theme }: { theme: ThemeFace }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="border-line-2 relative isolate aspect-video overflow-hidden rounded-2xl border">
        {theme === 'dark' ? (
          <>
            <Starfield
              className="absolute inset-0 -z-20 h-full w-full opacity-70"
              starCount={260}
              speed={0.6}
              respectReducedMotion
            />
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: `radial-gradient(circle at 70% 40%, rgb(${accentClasses('royal').rgb} / 0.35), transparent 55%)`,
              }}
              aria-hidden="true"
            />
          </>
        ) : (
          <>
            <div className="rose-floor absolute inset-0 -z-20" aria-hidden="true" />
            <Sun size="70%" className="absolute -top-[35%] -right-[10%] -z-10" />
          </>
        )}
      </div>
      <figcaption className="text-fg-3 text-2xs font-mono tracking-[0.16em] uppercase">
        {theme === 'dark' ? '<Starfield> + royal glow' : '<Sun> + rose floor'} · hero and final call to action only
      </figcaption>
    </figure>
  );
}

'use client';

import Planet from '@/components/Planet';
import Starfield from '@/components/Starfield';
import { Sun } from '@/components/Sun';
import { useResolvedTheme } from '@/components/Theme';

/**
 * Background of the homepage hero. Dark theme: a discreet starfield and the animated ringed planet.
 * Light theme: the sun rising top right over a misty-rose floor.
 *
 * Two layers pick the scene: the `light:` CSS variant is right from the first paint, then the dark
 * scene is unmounted in the light theme so its canvas and animation loops stop.
 */
const HeroIllustration = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const isLight = useResolvedTheme() === 'light';

  return (
    <>
      {!isLight && (
        <>
          <div className="light:hidden absolute inset-0 -z-20" aria-hidden="true">
            <Starfield className="h-full w-full opacity-70" starCount={260} speed={0.6} respectReducedMotion />
          </div>
          <div
            className="light:hidden pointer-events-none absolute top-1/2 -right-30 -z-10 hidden -translate-y-1/2 lg:block"
            aria-hidden="true">
            <Planet size={480} parallaxMode="pointer" scrollFactor={0.3} reducedMotion={reducedMotion} />
          </div>
          <div
            className="light:hidden pointer-events-none absolute -top-16 -right-24 -z-10 opacity-40 lg:hidden"
            aria-hidden="true">
            <Planet
              size={240}
              parallaxMode="gyro"
              gyroAmplitude={15}
              scrollFactor={0.3}
              reducedMotion={reducedMotion}
            />
          </div>
        </>
      )}
      <div className="rose-floor light:block pointer-events-none absolute inset-0 -z-20 hidden" aria-hidden="true" />
      {/* Phones: a smaller, dimmer sun tucked in the corner, like the planet in the dark theme. */}
      <Sun
        size="clamp(240px, 56vw, 700px)"
        className="light:block absolute -top-28 -right-24 -z-10 hidden opacity-60 lg:-top-[38%] lg:-right-[6%] lg:opacity-100"
      />
    </>
  );
};

export default HeroIllustration;

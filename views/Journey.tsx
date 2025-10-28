'use client';

import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import { Canvas } from '@react-three/fiber';
import { useTranslations } from 'next-intl';

import MovingStarfield from '@/components/Journey/MovingStarfield';

/**
 * JourneyContent component that renders the 3D cosmic journey experience.
 *
 * This component contains the Three.js Canvas with animated stars and journey content.
 * Features a custom moving starfield that simulates traveling through space at high speed.
 * It's designed to be loaded dynamically to avoid SSR issues with Three.js components.
 *
 * @component
 * @returns JSX element representing the cosmic journey 3D scene
 */
export default function JourneyContent() {
  const t = useTranslations('journey');

  return (
    <div style={{ minHeight: 'calc(100vh - var(--header-footer-height))' }}>
      <div className="fixed inset-0 w-full">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <MovingStarfield />
        </Canvas>
      </div>
      <div className="px-4 py-48">
        <h2 className="text-ghost mb-4 text-center text-2xl font-bold lg:text-5xl">{t('title')}</h2>
        <p className="flex items-center justify-center gap-2 text-gray-300 lg:text-xl">
          {t('subtitle')}
          <RocketLaunchIcon className="text-ghost h-6 w-6 animate-bounce" />
        </p>
      </div>
    </div>
  );
}

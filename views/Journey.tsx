'use client';

import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import { Canvas } from '@react-three/fiber';

import MovingStarfield from '@/components/Journey/MovingStarfield';

interface JourneyContentProps {
  translations: {
    title: string;
    subtitle: string;
  };
}

/**
 * JourneyContent component that renders the 3D cosmic journey experience.
 *
 * This component contains the Three.js Canvas with animated stars and journey content.
 * Features a custom moving starfield that simulates traveling through space at high speed.
 * It's designed to be loaded dynamically to avoid SSR issues with Three.js components.
 *
 * @component
 * @param {JourneyContentProps} props - Component props containing translations
 * @returns JSX element representing the cosmic journey 3D scene
 */
export default function JourneyContent({ translations }: JourneyContentProps) {
  const { title, subtitle } = translations;

  return (
    <div style={{ minHeight: 'calc(100vh - var(--header-footer-height))' }}>
      <div className="fixed inset-0 w-full">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <MovingStarfield />
        </Canvas>
      </div>
      <div className="px-4 py-48">
        <h2 className="text-ghost mb-4 text-center text-2xl font-bold lg:text-5xl">{title}</h2>
        <p className="flex items-center justify-center gap-2 text-gray-300 lg:text-xl">
          {subtitle}
          <RocketLaunchIcon className="text-ghost h-6 w-6 animate-bounce" />
        </p>
      </div>
    </div>
  );
}

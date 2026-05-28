import type { ReactNode } from 'react';

export type ServiceColor = 'aerospace' | 'royal' | 'jungle' | 'solar' | 'azure' | 'default';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: ServiceColor;
  features?: string[];
  link?: {
    href: string;
    label: string;
  };
}

export interface ServicesGridProps {
  title?: ReactNode;
  subtitle?: string;
  eyebrow?: string;
  services: Service[];

  // Layout
  columns?: 1 | 2 | 3 | 4;
  layout?: 'grid' | 'horizontal';

  // Animation
  staggerDelay?: number;
  animationDuration?: number;
  respectReducedMotion?: boolean;

  // Styling
  className?: string;
  id?: string;
}

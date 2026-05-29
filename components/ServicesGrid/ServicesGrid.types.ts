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

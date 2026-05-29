import { CodeBracketIcon, PuzzlePieceIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/solid';
import type { ReactNode } from 'react';

import type { ServiceColor } from './ServicesGrid.types';

export interface ServiceDefinition {
  id: string;
  icon: ReactNode;
  color: ServiceColor;
  href: string;
}

export const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  {
    id: 'development',
    icon: <CodeBracketIcon className="h-7 w-7" />,
    color: 'jungle',
    href: '/services#development',
  },
  {
    id: 'design',
    icon: <SparklesIcon className="h-7 w-7" />,
    color: 'royal',
    href: '/services#design',
  },
  {
    id: 'ai',
    icon: <PuzzlePieceIcon className="h-7 w-7" />,
    color: 'solar',
    href: '/services#ai',
  },
  {
    id: 'launch',
    icon: <RocketLaunchIcon className="h-7 w-7" />,
    color: 'azure',
    href: '/services#launch',
  },
];

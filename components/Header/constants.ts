import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

export type HeaderNavItem = {
  label: string;
  href: '/services' | '/projects' | '/pricing' | '/about' | '/contact';
  ariaLabel: string;
  icon: typeof WrenchScrewdriverIcon;
  isActive?: boolean;
};

export interface HeaderProps {
  logo?: string;
  navItems?: HeaderNavItem[];
  adaptiveHeight?: boolean;
  minHeight?: number;
  maxHeight?: number;
  logoOrbitalEnabled?: boolean;
  respectReducedMotion?: boolean;
  className?: string;
  id?: string;
}

export const SCROLL_COMPACT_THRESHOLD = 10;
export const SCROLL_DIRECTION_THRESHOLD = 10;
export const MOBILE_MAX_WIDTH = 600;
export const TABLET_MAX_WIDTH = 1023;
export const MOBILE_HEIGHT = 64;
export const TABLET_EXPANDED_HEIGHT = 85;
export const TABLET_COMPACT_HEIGHT = 56;
export const DEFAULT_LOGO = 'Go Cosmic';

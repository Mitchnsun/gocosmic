import { BRAND_NAME } from '@/lib/config';

export type HeaderNavItem = {
  label: string;
  href: '/' | '/services' | '/projects' | '/contact';
  ariaLabel: string;
  isActive?: boolean;
};

export interface HeaderProps {
  logo?: string;
  navItems?: HeaderNavItem[];
  className?: string;
  id?: string;
}

export const STATUS_BAR_HEIGHT = 32;
export const HEADER_HEIGHT = 64;
export const DEFAULT_LOGO = BRAND_NAME;
export const MOBILE_MENU_DURATION_MS = 420;
export const MOBILE_MENU_BURGER_DURATION_MS = 300;
export const MOBILE_MENU_STAGGER_MS = 50;

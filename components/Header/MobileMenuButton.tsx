'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { RefObject } from 'react';

import { MOBILE_MENU_BURGER_DURATION_MS } from '@/components/Header/constants';
import { cn } from '@/design-system/lib/utils';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
  className?: string;
}

const MobileMenuButton = ({ isOpen, onToggle, buttonRef, className }: MobileMenuButtonProps) => {
  const t = useTranslations('navigation');
  const reduceMotion = useReducedMotion();

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: MOBILE_MENU_BURGER_DURATION_MS / 1000, ease: 'easeOut' as const };

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      aria-label={t(isOpen ? 'menu_close' : 'menu_open')}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      className={cn(
        'border-ghost/15 hover:border-ghost/40 focus-visible:ring-aerospace/70 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className
      )}>
      <motion.span
        className="block h-0.5 w-5 rounded-full bg-current"
        animate={isOpen ? { y: 4, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
      <motion.span
        className="block h-0.5 w-5 rounded-full bg-current"
        animate={isOpen ? { y: -4, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
    </button>
  );
};

export default MobileMenuButton;

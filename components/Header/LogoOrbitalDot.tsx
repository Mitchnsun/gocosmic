'use client';

import { motion } from 'motion/react';

interface LogoOrbitalDotProps {
  reduceMotion: boolean;
}

const LogoOrbitalDot = ({ reduceMotion }: LogoOrbitalDotProps) => {
  if (reduceMotion) return null;

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
      <motion.span
        className="bg-aerospace/60 h-2 w-2 rounded-full"
        style={{ x: 18 /* orbit radius in px, sized for text-2xl glyph */ }}
        animate={{ scale: [1.3, 0.6, 1.3], opacity: [1, 0.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', times: [0, 0.5, 1] }}
      />
    </motion.span>
  );
};

export default LogoOrbitalDot;

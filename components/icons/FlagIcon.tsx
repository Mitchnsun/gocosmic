import type { SVGProps } from 'react';

import { cn } from '@/design-system/lib/utils';

export type FlagCode = 'gb' | 'fr' | 'es' | 'de' | 'it' | 'ch' | 'eu';

const stripes = (colors: string[]) =>
  colors.map((fill, i) => <rect key={fill + i} x={i * 10} width="10" height="20" fill={fill} />);

const rows = (bands: [fill: string, y: number, height: number][]) =>
  bands.map(([fill, y, height]) => <rect key={fill + y} y={y} width="30" height={height} fill={fill} />);

const FLAGS: Record<FlagCode, React.ReactNode> = {
  fr: stripes(['#0055A4', '#FFFFFF', '#EF4135']),
  it: stripes(['#009246', '#FFFFFF', '#CE2B37']),
  de: rows([
    ['#000000', 0, 6.67],
    ['#DD0000', 6.67, 6.67],
    ['#FFCE00', 13.34, 6.66],
  ]),
  es: rows([
    ['#AA151B', 0, 5],
    ['#F1BF00', 5, 10],
    ['#AA151B', 15, 5],
  ]),
  gb: (
    <>
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0 30 20M30 0 0 20" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M0 0 30 20M30 0 0 20" stroke="#C8102E" strokeWidth="1.5" />
      <path d="M15 0v20M0 10h30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="3.6" />
    </>
  ),
  ch: (
    <>
      <rect width="30" height="20" fill="#DA291C" />
      <path d="M15 4.5v11M9.5 10h11" stroke="#FFFFFF" strokeWidth="3.6" />
    </>
  ),
  eu: (
    <>
      <rect width="30" height="20" fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle
          key={i}
          cx={+(15 + 6 * Math.sin((i * Math.PI) / 6)).toFixed(2)}
          cy={+(10 - 6 * Math.cos((i * Math.PI) / 6)).toFixed(2)}
          r="1.2"
          fill="#FFCC00"
        />
      ))}
    </>
  ),
};

/** Country or region flag drawn in SVG, so it looks the same on every device (unlike flag emojis). */
export default function FlagIcon({
  code,
  className,
  ...props
}: Omit<SVGProps<SVGSVGElement>, 'children' | 'ref'> & { code: FlagCode }) {
  return (
    <svg className={cn('shrink-0 rounded-[2px]', className)} viewBox="0 0 30 20" aria-hidden="true" {...props}>
      {FLAGS[code]}
    </svg>
  );
}

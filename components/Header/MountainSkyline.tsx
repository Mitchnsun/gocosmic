import { cn } from '@/design-system/lib/utils';

interface MountainSkylineProps {
  className?: string;
}

const MountainSkyline = ({ className }: MountainSkylineProps) => (
  <svg
    aria-hidden="true"
    role="presentation"
    viewBox="0 0 400 48"
    preserveAspectRatio="none"
    height={48}
    className={cn('w-full text-white', className)}
    xmlns="http://www.w3.org/2000/svg">
    <polyline
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      points="0,48 20,42 40,44 58,28 72,32 86,16 100,26 112,22 124,36 138,40 152,36 165,20 175,8 185,18 198,28 212,24 224,36 238,42 252,36 266,22 278,18 290,28 304,12 318,28 332,38 348,44 365,40 382,44 400,48"
    />
  </svg>
);

export default MountainSkyline;

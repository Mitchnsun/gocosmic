import { Link } from '@/i18n/navigation';

import type { MoiPresidentLegalRoute } from './MoiPresident.types';

interface LegalPagePointerProps {
  /** The sentence before the link, without its final period. */
  prefix: string;
  label: string;
  href: MoiPresidentLegalRoute;
}

/** Closing note of one of the game's legal pages, pointing to the other one. */
export function LegalPagePointer({ prefix, label, href }: LegalPagePointerProps) {
  return (
    <p className="border-line-2 text-fg-2 rounded-2xl border p-5">
      {prefix}{' '}
      <Link href={href} className="text-fg hover:text-aerospace-ink underline underline-offset-4 transition-colors">
        {label}
      </Link>
      .
    </p>
  );
}

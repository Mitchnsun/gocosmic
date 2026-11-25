import { Link } from '@/i18n/navigation';

import type { MoiPresidentLegalRoute } from './MoiPresident.types';

interface LegalPagePointerProps {
  /** The sentence before the links. */
  prefix: string;
  links: readonly { label: string; href: MoiPresidentLegalRoute }[];
}

/** Closing note of one of the game's legal pages, pointing to the other ones. */
export function LegalPagePointer({ prefix, links }: LegalPagePointerProps) {
  return (
    <nav aria-labelledby="legal-pointer" className="border-line-2 text-fg-2 flex flex-col gap-3 rounded-2xl border p-5">
      <p id="legal-pointer">{prefix}</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-fg hover:text-aerospace-ink underline underline-offset-4 transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

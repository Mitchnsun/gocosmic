import { ArrowRightIcon } from '@heroicons/react/24/solid';

import { SectionHeading } from '@/components/SectionHeading';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, primaryPill, SECTION_Y } from '@/design-system/pill';
import type { Locale } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';

import type { MoiPresidentLegalRoute } from './MoiPresident.types';

interface LegalPageLink {
  label: string;
  href: MoiPresidentLegalRoute;
  /** The locale the page opens in: the English one when the page has no version in the current language. */
  locale: Locale;
}

interface MoiPresidentSupportProps {
  eyebrow: string;
  title: string;
  lead: string;
  email: { label: string; href: string };
  legalLinks: LegalPageLink[];
  /** The page's own locale, to mark a link to a page in another language. */
  locale: string;
}

/** The support of the game, the App Store's support URL: write to the studio, or read the two legal pages. */
export function MoiPresidentSupport({ eyebrow, title, lead, email, legalLinks, locale }: MoiPresidentSupportProps) {
  return (
    <section aria-labelledby="moi-president-support" className={cn('bg-bg-alt', SECTION_Y)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-8')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId="moi-president-support" lead={lead} />
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
          <a href={email.href} className={primaryPill('w-fit')}>
            {email.label}
          </a>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  locale={link.locale}
                  hrefLang={link.locale === locale ? undefined : link.locale}
                  className={cn(buttonVariants({ variant: 'link', size: 'inline' }), 'min-h-11')}>
                  {link.label}
                  <ArrowRightIcon className="size-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

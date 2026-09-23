import { useTranslations } from 'next-intl';

import { CookieManageButton } from '@/components/CookieConsent';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';
import { BRAND_NAME } from '@/lib/config';
import type { Region } from '@/lib/region';

import { FOOTER_LINK_CLASS, LEGAL_LINKS, STUDIO_LINKS } from './Footer.constants';
import FooterColumnHeading from './FooterColumnHeading';
import FooterLanguages from './FooterLanguages';

interface FooterProps {
  /** Drives which base the studio baseline claims. */
  region: Region;
}

const Footer = ({ region }: FooterProps) => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-ghost/8 bg-void text-ghost w-full border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-[2fr_1fr_1fr] lg:px-8 lg:pt-20">
        {/* Brand */}
        <div className="flex flex-col gap-3.5 sm:col-span-2 lg:col-span-1">
          <p className="font-display text-xl font-bold tracking-[-0.02em]">
            {BRAND_NAME}
            <span className="text-aerospace">.</span>
          </p>
          <p className="text-ghost/60 max-w-[40ch] text-[15px] leading-relaxed">{t(`brand_desc.${region}`)}</p>
          <p className="text-3xs text-ghost/35 font-mono tracking-[0.18em] uppercase">
            gocosmic.dev ·{' '}
            <Link
              href="/local"
              className="hover:text-ghost focus-visible:ring-aerospace/70 rounded transition-colors focus-visible:ring-2 focus-visible:outline-none">
              {t('local_page')}
            </Link>
          </p>
        </div>

        {/* Studio */}
        <nav aria-labelledby="footer-studio" className="flex flex-col gap-3">
          <FooterColumnHeading id="footer-studio">{t('nav_title')}</FooterColumnHeading>
          <ul className="flex flex-col gap-2.5">
            {STUDIO_LINKS.map(({ labelKey, href }) => (
              <li key={labelKey}>
                <Link className={FOOTER_LINK_CLASS} href={href}>
                  {t(labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <FooterColumnHeading>{t('legal_title')}</FooterColumnHeading>
          <ul className="flex flex-col gap-2.5">
            {LEGAL_LINKS.map(({ labelKey, href }) => (
              <li key={labelKey}>
                <Link className={FOOTER_LINK_CLASS} href={href}>
                  {t(labelKey)}
                </Link>
              </li>
            ))}
            <li>
              <CookieManageButton className={cn(FOOTER_LINK_CLASS, 'no-underline')} />
            </li>
          </ul>
          <FooterLanguages />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-ghost/8 border-t">
        <div className="text-3xs text-ghost/35 mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-4 py-4 font-mono tracking-[0.14em] uppercase sm:px-6 lg:px-8">
          <p>{t('copyright', { year, brand: BRAND_NAME })}</p>
          <p>{t('status')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

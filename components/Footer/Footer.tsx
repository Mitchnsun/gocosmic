import { useTranslations } from 'next-intl';

import { CookieManageButton } from '@/components/CookieConsent';
import { Link } from '@/i18n/navigation';

const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-widest text-white uppercase">
    <span className="text-aerospace text-lg drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]" aria-hidden="true">
      •
    </span>
    {children}
  </h4>
);

const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  const asciiLabels = t.raw('ascii_labels') as string[];

  return (
    <footer className="w-full bg-slate-900 pt-12 text-gray-400">
      <div
        aria-hidden="true"
        className="mb-10 overflow-hidden border-y border-slate-800/70 bg-slate-950/40 py-3 font-mono text-sm tracking-wide">
        <div className="animate-footer-ascii-marquee flex w-max whitespace-nowrap motion-reduce:animate-none">
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex items-center">
              {asciiLabels.map((label, labelIndex) => (
                <div key={`${copyIndex}-${label}`} className="flex items-center">
                  <span className="mx-3 text-gray-200">•</span>
                  <span className="text-gray-100">{label}</span>
                  {labelIndex < asciiLabels.length - 1 ? <span className="text-aerospace mx-4">✦</span> : null}
                </div>
              ))}
              <span className="text-aerospace mx-4">✦</span>
            </div>
          ))}
        </div>
      </div>
      <div className="m-auto grid max-w-7xl grid-cols-2 gap-12 px-6 md:grid-cols-4">
        {/* Column 1 — Brand */}
        <div className="col-span-2">
          <h4 className="mb-2 text-lg font-bold text-white">
            {t('brand_title')}
            <span className="text-aerospace">.</span>
          </h4>
          <p className="text-sm leading-relaxed">{t('brand_desc')}</p>
          <Link href="/local" className="my-2 block text-sm text-white transition hover:text-blue-400">
            {t('local_page')}
          </Link>
          <p className="text-xs text-gray-500">{t('legal')}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link className="text-gray-300 underline transition hover:text-white" href="/privacy">
              {t('privacy')}
            </Link>
            <Link className="text-gray-300 underline transition hover:text-white" href="/legal-notice">
              {t('legal_notice')}
            </Link>
            <CookieManageButton />
          </div>
        </div>

        {/* Column 2 — Studio navigation */}
        <nav aria-label={t('nav_aria')}>
          <ColumnHeading>{t('nav_title')}</ColumnHeading>
          <ul className="space-y-2 pl-4 text-sm">
            <li>
              <Link className="transition-colors hover:text-white" href="/services">
                {t('link_services')}
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-white" href="/projects">
                {t('link_projects')}
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-white" href="/offers">
                {t('link_offers')}
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-white" href="/about">
                {t('link_about')}
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-white" href="/contact">
                {t('link_contact')}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Column 3 — Offers */}
        <div>
          <ColumnHeading>{t('offers_title')}</ColumnHeading>
          <ul className="space-y-2 pl-4 text-sm">
            <li>
              <Link
                className="transition-colors hover:text-white"
                href={{ pathname: '/offers', hash: 'solo-developer' }}>
                {t('offer_solo')}
              </Link>
            </li>
            <li>
              <Link
                className="transition-colors hover:text-white"
                href={{ pathname: '/offers', hash: 'developer-designer' }}>
                {t('offer_duo')}
              </Link>
            </li>
            <li>
              <Link
                className="transition-colors hover:text-white"
                href={{ pathname: '/offers', hash: 'team-developers' }}>
                {t('offer_team')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 border-t border-slate-800 p-6 text-xs">
        <p>{t('copyright', { year })}</p>
      </div>
    </footer>
  );
};

export default Footer;

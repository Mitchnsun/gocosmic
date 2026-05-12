import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white">
    <span className="text-aerospace text-lg drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]" aria-hidden="true">
      •
    </span>
    {children}
  </h4>
);

const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 pt-12 text-gray-400">
      <div className="m-auto grid max-w-7xl grid-cols-2 gap-12 px-6 md:grid-cols-4">
        {/* Column 1 — Brand */}
        <div className="col-span-2">
          <h4 className="mb-2 text-lg font-bold text-white">
            {t('brand_title')}
            <span className="text-aerospace">.</span>
          </h4>
          <p className="text-sm leading-relaxed">{t('brand_desc')}</p>
          <p className="mt-1 text-xs text-gray-500">{t('legal')}</p>
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
            <li>
              <Link href="/local" className="transition-colors hover:text-white">
                {t('local_page')}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Column 3 — Offers */}
        <div>
          <ColumnHeading>{t('offers_title')}</ColumnHeading>
          <ul className="space-y-2 text-sm">
            <li>
              <Link className="transition-colors hover:text-white" href="/offers">
                {t('offer_solo')}
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-white" href="/offers">
                {t('offer_duo')}
              </Link>
            </li>
            <li>
              <Link className="transition-colors hover:text-white" href="/offers">
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

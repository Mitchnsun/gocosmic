import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 px-4 py-8 text-gray-400">
      <div className="m-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
        <address className="not-italic">
          <strong className="text-white">{t('zone_title')}</strong>
          <p>{t('zone_desc')}</p>
          <p>{t('phone')}</p>
          <p className="text-xs">{t('legal')}</p>
        </address>
        <nav aria-label={t('nav_aria')}>
          <strong className="text-white">{t('nav_title')}</strong>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/services">{t('link_services')}</Link>
            </li>
            <li>
              <Link href="/offers">{t('link_offers')}</Link>
            </li>
            <li>
              <Link href="/contact">{t('link_contact')}</Link>
            </li>
          </ul>
        </nav>
        <p className="text-sm">{t('copyright', { year })}</p>
      </div>
    </footer>
  );
};

export default Footer;

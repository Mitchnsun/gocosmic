import { EnvelopeIcon, InformationCircleIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import LanguageSwitcher from '../LanguageSwitcher';

const Header = () => {
  const t = useTranslations('navigation');

  return (
    <header className="text-ghost fixed top-0 z-50 flex w-full items-center justify-between bg-gray-900 p-4">
      <h1 className="shrink-0 text-xl font-bold transition-colors hover:text-blue-400 sm:text-2xl">
        <Link href="/" aria-label={t('home')}>
          Go Cosmic
        </Link>
      </h1>
      <nav className="flex items-center gap-4 sm:gap-8" role="navigation" aria-label={t('label')}>
        <Link
          href="/services"
          className="rounded px-2 py-1 transition-colors hover:text-blue-400"
          aria-label={t('services_label')}>
          <WrenchScrewdriverIcon className="h-5 w-5 md:hidden" aria-hidden="true" />
          <span className="hidden md:inline">{t('services')}</span>
        </Link>
        <Link
          href="/about"
          className="rounded px-2 py-1 transition-colors hover:text-blue-400"
          aria-label={t('about_label')}>
          <InformationCircleIcon className="h-5 w-5 md:hidden" aria-hidden="true" />
          <span className="hidden md:inline">{t('about')}</span>
        </Link>
        <Link
          href="/contact"
          className="rounded px-2 py-1 transition-colors hover:text-blue-400"
          aria-label={t('contact_label')}>
          <EnvelopeIcon className="h-5 w-5 md:hidden" aria-hidden="true" />
          <span className="hidden md:inline">{t('contact')}</span>
        </Link>
        <LanguageSwitcher />
      </nav>
    </header>
  );
};

export default Header;

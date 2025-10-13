import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');

  return <footer className="w-full bg-gray-900 p-4 text-center font-light text-gray-400">{t('copyright')}</footer>;
};

export default Footer;

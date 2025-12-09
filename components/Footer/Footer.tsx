import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');

  return <footer className="w-full bg-slate-950 p-4 text-center font-light text-gray-400">{t('copyright')}</footer>;
};

export default Footer;

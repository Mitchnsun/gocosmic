import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 p-4 text-center font-light text-gray-400">{t('copyright', { year })}</footer>
  );
};

export default Footer;

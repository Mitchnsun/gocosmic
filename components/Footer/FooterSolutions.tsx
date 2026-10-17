import { useTranslations } from 'next-intl';

import { CONTENT_PAGE_LABELS, FOOTER_SOLUTIONS } from '@/data/content-pages';
import { Link } from '@/i18n/navigation';

import { FOOTER_LINK_CLASS } from './Footer.constants';
import FooterColumnHeading from './FooterColumnHeading';

interface FooterSolutionsProps {
  /** The pages of the column that exist in the current language. */
  routes: typeof FOOTER_SOLUTIONS;
}

/** "Solutions & guides" column: the service pages, shown in the languages they are published in. */
const FooterSolutions = ({ routes }: FooterSolutionsProps) => {
  const t = useTranslations('contentPages');

  return (
    <nav aria-labelledby="footer-solutions" className="flex flex-col gap-3">
      <FooterColumnHeading id="footer-solutions">{t('footer_title')}</FooterColumnHeading>
      <ul className="flex flex-col gap-2.5">
        {routes.map((route) => (
          <li key={route}>
            <Link className={FOOTER_LINK_CLASS} href={route}>
              {t(`links.${CONTENT_PAGE_LABELS[route]}.label`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterSolutions;

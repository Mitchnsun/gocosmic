import type { Project, ProjectImage } from './ProjectsShowcase.types';

/** Static project definitions — non-translatable fields only.
 *  Translated title, description, tagline, tags, and image alt text are loaded via next-intl on the page. */
export type ProjectDefinition = Pick<Project, 'id' | 'year' | 'href' | 'featured'> & {
  image: Omit<ProjectImage, 'alt'>;
};

export const PROJECT_DEFINITIONS: ProjectDefinition[] = [
  {
    id: 'dailyFortune',
    year: 2026,
    href: '/projects/daily-fortune',
    featured: true,
    image: {
      src: '/projects/daily-fortune/hero.jpg',
      width: 1200,
      height: 600,
    },
  },
  {
    id: 'mcomperat',
    year: 2026,
    href: '/projects/mcomperat',
    image: {
      src: '/projects/mcomperat/hero.jpg',
      width: 1200,
      height: 600,
    },
  },
  {
    id: 'pscSupersprint',
    year: 2026,
    href: '/projects/psc-supersprint',
    image: {
      src: '/projects/psc-supersprint/hero.jpg',
      width: 1200,
      height: 600,
    },
  },
  {
    id: 'choeurDesPaysduMontBlanc',
    year: 2025,
    href: '/projects/choeurdespaysdumontblanc',
    image: {
      src: '/projects/choeurdespaysdumontblanc/hero.jpg',
      width: 1200,
      height: 600,
    },
  },
];

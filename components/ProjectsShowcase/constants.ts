import type { Project } from './ProjectsShowcase.types';

/** Static project definitions — non-translatable fields only.
 *  Translated title and description are loaded via next-intl on the page. */
export type ProjectDefinition = Pick<Project, 'id' | 'tagline' | 'tags' | 'year' | 'href' | 'featured' | 'image'>;

export const PROJECT_DEFINITIONS: ProjectDefinition[] = [
  {
    id: 'dailyFortune',
    tagline: 'Mobile · iOS / Android',
    tags: ['AI', 'Wellness'],
    year: 2025,
    href: '/projects/daily-fortune',
    featured: true,
    image: {
      src: '/projects/daily-fortune/hero.jpg',
      alt: 'Daily Fortune app preview',
      width: 1200,
      height: 600,
    },
  },
  {
    id: 'mcomperat',
    tagline: 'Web · Next.js',
    tags: ['Personal CV'],
    year: 2025,
    href: '/projects/mcomperat',
    image: {
      src: '/projects/mcomperat/hero.jpg',
      alt: 'mcomper.at website preview',
      width: 1200,
      height: 600,
    },
  },
  {
    id: 'pscSupersprint',
    tagline: 'Web · Real-time',
    tags: ['Sport', 'Live'],
    year: 2024,
    href: '/projects/psc-supersprint',
    image: {
      src: '/projects/psc-supersprint/hero.jpg',
      alt: 'PSC Supersprint results board preview',
      width: 1200,
      height: 600,
    },
  },
  {
    id: 'choeurDesPaysduMontBlanc',
    tagline: 'Web · Editorial',
    tags: ['Culture'],
    year: 2024,
    href: '/projects/choeurdespaysdumontblanc',
    image: {
      src: '/projects/choeurdespaysdumontblanc/hero.jpg',
      alt: 'Chœur des Pays du Mont Blanc website preview',
      width: 1200,
      height: 600,
    },
  },
];

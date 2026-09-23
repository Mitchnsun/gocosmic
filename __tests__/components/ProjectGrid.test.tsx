import { act, fireEvent } from '@testing-library/react';
import { type AbstractIntlMessages, createTranslator } from 'next-intl';

import { buildProjectCards, FilterableProjectGrid, ProjectGrid } from '@/components/ProjectGrid';
import { filterProjects, parseProjectFilter } from '@/components/ProjectGrid/ProjectGrid.utils';

import projects from '../../messages/en/projects.json';
import { render } from '../test-utils';

const t = createTranslator({
  locale: 'en',
  messages: projects as unknown as AbstractIntlMessages,
  namespace: 'projectsList',
});
const cards = buildProjectCards(t);

describe('buildProjectCards', () => {
  it('builds one card per case study, client work first', () => {
    expect(cards.map((card) => card.slug)).toEqual([
      'choeurdespaysdumontblanc',
      'psc-supersprint',
      'daily-fortune',
      'mcomperat',
    ]);
    expect(cards[0]).toMatchObject({
      kind: 'site',
      kindLabel: 'Website',
      client: 'Association · Haute-Savoie',
      href: '/projects/choeurdespaysdumontblanc',
      year: 2025,
    });
    expect(cards[0]?.cover?.alt).toBe('Chœur des Pays du Mont Blanc logo');
    expect(cards[1]?.cover).toBeUndefined();
  });

  it('filters by kind and parses the query parameter defensively', () => {
    expect(filterProjects(cards, 'all')).toHaveLength(4);
    expect(filterProjects(cards, 'mobile').map((card) => card.slug)).toEqual(['daily-fortune']);
    expect(parseProjectFilter('webapp')).toBe('webapp');
    expect(parseProjectFilter('<script>')).toBe('all');
    expect(parseProjectFilter(null)).toBe('all');
  });
});

describe('ProjectGrid', () => {
  it('renders each card with its badge, client line, tags and a link named after the project', () => {
    const { getByRole, getAllByRole, getByText } = render(<ProjectGrid projects={cards} />);

    expect(getAllByRole('article')).toHaveLength(4);
    expect(getByRole('link', { name: 'PSC Supersprint' })).toHaveAttribute('href', '/projects/psc-supersprint');
    expect(getByText('Triathlon club')).toBeInTheDocument();
    expect(getByRole('img', { name: 'Daily Fortune app icon' })).toBeInTheDocument();
    // Without a screenshot, the cover falls back to the project name.
    expect(getAllByRole('heading', { level: 3 })).toHaveLength(4);
    expect(getAllByRole('listitem').some((item) => item.textContent === 'Multilingual')).toBe(true);
  });
});

describe('FilterableProjectGrid', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/projects');
  });

  it('filters the cards, marks the pressed pill and mirrors the choice in the URL', () => {
    const { getByRole, getAllByRole, getByText } = render(<FilterableProjectGrid projects={cards} />);

    expect(getByRole('group', { name: 'Filter by project type' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    expect(getByText('4 projects')).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Mobile app' }));
    });

    expect(getByRole('button', { name: 'Mobile app' })).toHaveAttribute('aria-pressed', 'true');
    expect(getAllByRole('article')).toHaveLength(1);
    expect(getByText('1 project')).toBeInTheDocument();
    expect(window.location.search).toBe('?type=mobile');

    act(() => {
      fireEvent.click(getByRole('button', { name: 'All' }));
    });
    expect(window.location.search).toBe('');
  });

  it('starts from the ?type= filter of a shared link', () => {
    window.history.replaceState(null, '', '/projects?type=webapp');
    const { getAllByRole, getByRole } = render(<FilterableProjectGrid projects={cards} />);

    expect(getByRole('button', { name: 'Web app' })).toHaveAttribute('aria-pressed', 'true');
    expect(getAllByRole('article')).toHaveLength(1);
  });
});

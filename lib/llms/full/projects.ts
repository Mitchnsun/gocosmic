import { buildCaseStudyMeta, formatReleaseDate } from '@/components/CaseStudy/CaseStudy.utils';
import { PROJECTS } from '@/data/projects';

import { EN } from '../llms.messages';
import { link, list, pageUrl, section, valuesOf } from '../llms.utils';

type Project = (typeof PROJECTS)[number];

/** The latest release of a project that keeps being updated, as its page words it. */
function maintainedNote(project: Project): string | undefined {
  const key = `${project.i18nKey}.result.maintained`;
  if (!('latestRelease' in project) || !EN.projects.has(key)) return undefined;

  const { latestRelease } = project;
  return EN.projects(key, {
    version: 'version' in latestRelease ? latestRelease.version : '',
    date: formatReleaseDate(latestRelease.date, 'en'),
  });
}

/** A case study page: who it was for, what the studio did and what it changed. */
function buildCaseStudy(project: Project): string {
  const t = (key: string) => EN.projects(`${project.i18nKey}.${key}`);

  return section(
    link(t('title'), pageUrl(project.href)),
    [
      buildCaseStudyMeta(project.slug, EN.projectsList, 'en').join(' · '),
      t('subtitle'),
      `${t('for_whom.label')}: ${t('for_whom.title')}. ${t('for_whom.description')}`,
      `${t('what_we_did.label')}: ${t('what_we_did.title')}. ${t('what_we_did.description')}`,
      list(valuesOf(EN.projects.raw(`${project.i18nKey}.what_we_did.items`))),
      [`${t('result.label')}: ${t('result.title')}. ${t('result.description')}`, maintainedNote(project)]
        .filter(Boolean)
        .join(' '),
    ],
    3
  );
}

/** The projects page, then every case study in display order. */
export function buildProjectsSection(): string {
  return section(link(EN.footer('link_projects'), pageUrl('/projects')), [
    EN.projectsList('subtitle'),
    ...PROJECTS.map(buildCaseStudy),
  ]);
}

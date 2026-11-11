import { createTranslator } from 'next-intl';

import type { LegalParagraph } from '@/components/LegalDocument';
import {
  buildCorrection,
  buildLegalNoticeSections,
  buildPrivacySections,
  buildReleaseNotices,
  LEGAL_NOTICE_SECTIONS,
  PRIVACY_SECTIONS,
} from '@/components/MoiPresident';
import type { Translator } from '@/components/MoiPresident/MoiPresident.utils';

import enPage from '../../../messages/en/moi-president.json';
import enLegal from '../../../messages/en/moi-president-legal.json';
import frPage from '../../../messages/fr/moi-president.json';
import frLegal from '../../../messages/fr/moi-president-legal.json';
import { CORRECTION, RELEASES } from '../../moi-president-fixtures';

// Untyped, as the pages get them from the server: the keys are built at runtime.
const legal = (locale: 'fr' | 'en') =>
  createTranslator({
    locale,
    messages: locale === 'fr' ? frLegal : enLegal,
    namespace: 'moiPresidentLegal',
  }) as unknown as Translator;
const page = (locale: string) =>
  createTranslator({
    locale,
    messages: locale.startsWith('fr') ? frPage : enPage,
    namespace: 'moiPresident',
  }) as unknown as Translator;
const textOf = (paragraph: LegalParagraph | undefined) =>
  typeof paragraph === 'string' ? paragraph : (paragraph?.text ?? '');

describe('legal notice sections', () => {
  it("follows the app's order, without its costings and with the personal data on a page of their own", () => {
    const sections = buildLegalNoticeSections(legal('fr'), []);

    expect(sections.map(({ id }) => id)).toEqual([...LEGAL_NOTICE_SECTIONS]);
    expect(sections.map(({ title }) => title)).toEqual([
      'Le jeu',
      'Les chiffres',
      'Notice de la simulation',
      'Les sources et leurs dates',
      'Éditeur',
      'Responsabilité',
      "Conditions d'utilisation",
      'Crédits et licences',
      'Contact',
    ]);
    expect(sections[0]?.body[0]).toEqual({
      lead: 'Jeu de simulation satirique.',
      text: expect.stringMatching(/^Moi Président est une œuvre de fiction/),
    });
  });

  it('says nothing about consulting the notice at the Commission des sondages before it is filed', () => {
    const sections = buildLegalNoticeSections(legal('fr'), []);
    const byId = (id: string) => sections.find((section) => section.id === id);

    expect(textOf(byId('figures')?.body[0])).toMatch(/simulation de vote réalisée à partir de sondages\.$/);
    expect(byId('notice')?.body).toHaveLength(3);
    expect(JSON.stringify(sections)).not.toContain('consultable');
    expect(JSON.stringify(sections)).not.toContain('Toute personne peut consulter');
    expect(byId('notice')?.links).toEqual([
      { label: 'commission-des-sondages.fr', href: 'https://www.commission-des-sondages.fr' },
    ]);
  });

  it('links the filed notice of the latest version, and says it can be consulted, once it is filed', () => {
    const sections = buildLegalNoticeSections(legal('en'), RELEASES);
    const byId = (id: string) => sections.find((section) => section.id === id);

    expect(textOf(byId('figures')?.body[0])).toMatch(
      /treats a vote simulation made from polls as a poll: its notice can be consulted at the Commission des sondages\.$/
    );
    expect(byId('notice')?.body.at(-1)).toBe(
      'Anyone can consult the notice of this simulation at the Commission des sondages.'
    );
    expect(byId('notice')?.links?.map(({ href }) => href)).toEqual([
      RELEASES[0]?.noticeUrl,
      'https://www.commission-des-sondages.fr',
    ]);
  });

  it("points to the app's own page for the full list of licences", () => {
    const credits = buildLegalNoticeSections(legal('fr'), []).find(({ id }) => id === 'credits');

    expect(textOf(credits?.body.at(-1))).toMatch(/est dans la page «\u00a0Licences\u00a0» de l'application\.$/);
  });
});

describe('privacy sections', () => {
  it("turns each paragraph of the app's personal data into a section, its lead as title", () => {
    const sections = buildPrivacySections(legal('en'));

    expect(sections.map(({ id }) => id)).toEqual([...PRIVACY_SECTIONS]);
    expect(sections.map(({ title }) => title)).toEqual([
      'What Moi Président does with your data',
      'Permissions',
      'Sharing',
      'Deletion',
      'Campaign kit',
      'Changes',
      'Contact and recourse',
    ]);
    expect(sections.at(-1)?.links?.map(({ href }) => href)).toEqual([
      'mailto:support@gocosmic.dev',
      'https://www.edoeb.admin.ch',
      'https://www.cnil.fr',
    ]);
  });
});

describe('release notices', () => {
  it('dates each published version and lists the mentions of the polls it starts from', () => {
    const [latest, first] = buildReleaseNotices(legal('fr'), 'fr', RELEASES);

    expect(latest).toMatchObject({
      id: 'version-1.1.0',
      heading: 'Version 1.1.0, publiée le 2 mars 2027',
      frozen: 'Données figées dans la version 1.1.0 du jeu.',
      pollsLabel: "Sondages d'origine",
      noticeLink: { label: 'La notice de cette simulation', href: RELEASES[0]?.noticeUrl },
    });
    expect(latest?.polls[0]?.rows).toEqual([
      { label: 'Institut', value: 'Institut A' },
      { label: 'Commanditaire', value: 'Journal B, Radio C' },
      { label: 'Dates du terrain', value: 'du 12 janvier 2027 au 14 janvier 2027' },
      { label: 'Personnes interrogées', value: '1 000 inscrits, sur 1 100 personnes', lang: 'fr' },
      { label: 'Question posée', value: RELEASES[0]?.polls[0]?.question, lang: 'fr' },
      { label: "Marges d'erreur", value: 'Entre 1,4 et 3,1 points', lang: 'fr' },
    ]);
    expect(first).toMatchObject({ heading: 'Version 1.0.0, publiée le 10 février 2027', polls: [] });
    expect(first?.noticeLink).toBeUndefined();
  });

  it('shows nothing before the first store release', () => {
    expect(buildReleaseNotices(legal('en'), 'en')).toEqual([]);
  });
});

describe('correction', () => {
  it('shows nothing until the Commission orders one', () => {
    expect(buildCorrection(page('fr'), 'fr', null)).toBeUndefined();
  });

  it('shows its French or English text, and the English one in the other languages', () => {
    expect(buildCorrection(page('fr-CH'), 'fr-CH', CORRECTION)).toEqual({
      title: 'Mise au point',
      date: 'Publiée le 12 avril 2027',
      text: 'Texte de la mise au point.',
      lang: undefined,
    });
    expect(buildCorrection(page('en'), 'en', CORRECTION)).toMatchObject({
      text: 'Text of the correction.',
      lang: undefined,
    });
    expect(buildCorrection(page('en'), 'de', CORRECTION)).toMatchObject({
      text: 'Text of the correction.',
      lang: 'en',
    });
  });
});

import { createTranslator } from 'next-intl';

import type { LegalParagraph } from '@/components/LegalDocument';
import {
  ABOUT_SECTIONS,
  buildAboutSections,
  buildCorrection,
  buildLegalNoticeSections,
  buildLegalPointer,
  buildPrivacySections,
  buildReleaseNotices,
  buildTermsSections,
  formatDocumentDate,
  LEGAL_NOTICE_SECTIONS,
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
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
  typeof paragraph === 'string' ? paragraph : paragraph && 'text' in paragraph ? paragraph.text : '';

describe('about sections', () => {
  it("follows the app's « À propos du jeu », without its costings", () => {
    const sections = buildAboutSections(legal('fr'), []);

    expect(sections.map(({ id }) => id)).toEqual([...ABOUT_SECTIONS]);
    expect(sections.map(({ title }) => title)).toEqual([
      'Le jeu',
      'Les chiffres',
      'Notice de la simulation',
      'Les sources et leurs dates',
      'Crédits et licences',
    ]);
    expect(sections[0]?.body[0]).toEqual({
      lead: 'Jeu de simulation satirique.',
      text: expect.stringMatching(/^Moi Président est une œuvre de fiction/),
    });
  });

  it('says nothing about consulting the notice at the Commission des sondages before it is filed', () => {
    const sections = buildAboutSections(legal('fr'), []);
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
    const sections = buildAboutSections(legal('en'), RELEASES);
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
    const credits = buildAboutSections(legal('fr'), []).find(({ id }) => id === 'credits');

    expect(textOf(credits?.body.at(-1))).toMatch(/est dans la page «\u00a0Licences\u00a0» de l'application\.$/);
  });
});

describe('legal notice sections', () => {
  it('holds art. 1-1 of the LCEN, as the app does: publisher, director, hosts, distribution, right of reply', () => {
    const sections = buildLegalNoticeSections(legal('fr'));

    expect(sections.map(({ id }) => id)).toEqual([...LEGAL_NOTICE_SECTIONS]);
    expect(sections.map(({ title }) => title)).toEqual([
      'Éditeur',
      'Direction de la publication',
      'Hébergeurs',
      'Distribution',
      'Droit de réponse et signalement',
    ]);
    expect(textOf(sections[2]?.body[0])).toMatch(/^Vercel Inc\., 440 N Barranca Avenue #4133, Covina/);
    expect(sections.at(-1)?.links).toEqual([
      { label: 'Écrire à support@gocosmic.dev', href: 'mailto:support@gocosmic.dev' },
    ]);
  });
});

describe('terms sections', () => {
  it('numbers the thirteen articles after the preamble, which states the version in force', () => {
    const sections = buildTermsSections(legal('fr'), { version: 1, date: '25 novembre 2026' });

    expect(sections.map(({ id }) => id)).toEqual([...TERMS_SECTIONS]);
    expect(sections[0]?.title).toBe('Préambule');
    expect(sections[1]?.title).toBe('1. Objet et nature du jeu');
    expect(sections.at(-1)?.title).toBe('13. Contrat de licence des magasins');
    expect(textOf(sections[0]?.body[0])).toMatch(/version 1, en vigueur depuis le 25 novembre 2026\.$/);
    expect(sections.at(-1)?.links?.map(({ href }) => href)).toEqual([
      'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
    ]);
  });
});

describe('privacy sections', () => {
  it("follows the app's policy, with GitHub's statement and the authorities", () => {
    const sections = buildPrivacySections(legal('en'));

    expect(sections.map(({ id }) => id)).toEqual([...PRIVACY_SECTIONS]);
    expect(sections[0]?.title).toBe('In short');
    expect(sections.find(({ id }) => id === 'kit')?.links?.map(({ href }) => href)).toEqual([
      'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
    ]);
    expect(sections.at(-1)?.links?.map(({ href }) => href)).toEqual([
      'mailto:support@gocosmic.dev',
      'https://www.edoeb.admin.ch',
      'https://www.cnil.fr',
    ]);
  });
});

describe('legal pointer and dates', () => {
  it("points to the game's other legal pages, in the app's order", () => {
    expect(buildLegalPointer(legal('fr'), 'privacy')).toEqual({
      prefix: 'Les autres documents de Moi Président\u00a0:',
      links: [
        { label: 'Mentions légales', href: '/apps/moi-president/legal-notice' },
        { label: "Conditions générales d'utilisation", href: '/apps/moi-president/terms' },
        { label: 'À propos du jeu', href: '/apps/moi-president/about' },
      ],
    });
  });

  it('dates a document as the app does', () => {
    expect(formatDocumentDate(legal('en'), 'privacy', '2026-11-25', 'en')).toBe('Updated on 25 November 2026');
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

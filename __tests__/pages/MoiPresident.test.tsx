import { createTranslator } from 'next-intl';
import { vi } from 'vitest';

import MoiPresidentLegalNoticePage, {
  generateMetadata as legalNoticeMetadata,
} from '@/app/[locale]/apps/moi-president/legal-notice/page';
import MoiPresidentPage, { generateMetadata as presentationMetadata } from '@/app/[locale]/apps/moi-president/page';
import MoiPresidentPrivacyPage, {
  generateMetadata as privacyMetadata,
} from '@/app/[locale]/apps/moi-president/privacy/page';
import type { AppRelease, Correction } from '@/data/moi-president';
import { redirect } from '@/i18n/navigation';

import { CORRECTION, RELEASES } from '../moi-president-fixtures';
import { render, within } from '../test-utils';

const state = vi.hoisted(() => ({
  locale: 'en',
  correction: null as Correction | null,
  releases: [] as AppRelease[],
}));

vi.mock('next-intl/server', () => ({
  setRequestLocale: (locale: string) => {
    state.locale = locale;
  },
  getTranslations: async (options: string | { locale: string; namespace: string }) => {
    const { locale, namespace } = typeof options === 'string' ? { locale: state.locale, namespace: options } : options;
    const { MOI_PRESIDENT_MESSAGES } = await import('../moi-president-messages');
    const { getLanguage } = await import('@/i18n/locales');
    return createTranslator({ locale, messages: MOI_PRESIDENT_MESSAGES[getLanguage(locale)], namespace });
  },
}));

// No version is published and no correction ordered yet: the tests stand in their own.
vi.mock('@/data/moi-president', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/data/moi-president')>()),
  get MOI_PRESIDENT_CORRECTION() {
    return state.correction;
  },
  get MOI_PRESIDENT_RELEASES() {
    return state.releases;
  },
}));

const params = (locale: string) => ({ params: Promise.resolve({ locale }) });

afterEach(() => {
  state.correction = null;
  state.releases = [];
  vi.mocked(redirect).mockReset();
});

describe('Moi Président presentation page', () => {
  it('presents the game, its genres and its stores to come, then its support', async () => {
    const { getByRole, getByText, queryByRole } = render(await MoiPresidentPage(params('fr')));

    expect(getByRole('heading', { level: 1, name: 'Moi Président' })).toBeInTheDocument();
    expect(getByText(/^Jeu de simulation satirique\. Les personnages et les partis sont fictifs/)).toBeInTheDocument();
    expect(getByText('Jeu de rôle')).toBeInTheDocument();
    expect(getByText("Bientôt sur l'App Store et Google Play")).toBeInTheDocument();
    const support = getByRole('region', { name: 'Une question sur le jeu ?' });
    expect(within(support).getByRole('link', { name: 'Écrire à support@gocosmic.dev' })).toHaveAttribute(
      'href',
      'mailto:support@gocosmic.dev'
    );
    expect(within(support).getByRole('link', { name: 'Mentions légales' })).toHaveAttribute(
      'href',
      '/apps/moi-president/legal-notice'
    );
    expect(within(support).getByRole('link', { name: 'Politique de confidentialité' })).not.toHaveAttribute('hreflang');
    expect(queryByRole('region', { name: 'Mise au point' })).not.toBeInTheDocument();
  });

  it('links the English legal pages from the other languages, in the same region', async () => {
    const { getByRole } = render(await MoiPresidentPage(params('it-CH')));

    expect(getByRole('heading', { level: 1, name: 'Moi Président' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Note legali (in inglese)' })).toHaveAttribute('hreflang', 'en-CH');
    expect(getByRole('link', { name: 'Informativa sulla privacy (in inglese)' })).toHaveAttribute('locale', 'en-CH');
  });

  it('opens on a correction, in English in the other languages', async () => {
    state.correction = CORRECTION;
    const { getByRole } = render(await MoiPresidentPage(params('de')));
    const correction = getByRole('region', { name: 'Richtigstellung' });

    expect(within(correction).getByText('Veröffentlicht am 12. April 2027')).toBeInTheDocument();
    expect(within(correction).getByText('Text of the correction.')).toHaveAttribute('lang', 'en');
  });

  it('is indexed, with its own canonical URL in every language', async () => {
    const metadata = await presentationMetadata(params('fr'));

    expect(metadata.title).toBe('Moi Président, jeu de simulation satirique | Cosmic Studio');
    expect(metadata.robots).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe('https://www.gocosmic.dev/fr/applications/moi-president');
    expect(Object.keys(metadata.alternates?.languages ?? {})).toHaveLength(11);
  });
});

describe('Moi Président privacy policy', () => {
  it("shows each paragraph of the app's personal data as a section, then points to the legal notice", async () => {
    const { getByRole, getAllByRole } = render(await MoiPresidentPrivacyPage(params('en')));

    expect(getByRole('heading', { level: 1, name: 'Privacy policy' })).toBeInTheDocument();
    expect(getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'What Moi Président does with your data',
      'Permissions',
      'Sharing',
      'Deletion',
      'Campaign kit',
      'Changes',
      'Contact and recourse',
    ]);
    expect(getByRole('link', { name: 'Moi Président legal notice' })).toHaveAttribute(
      'href',
      '/apps/moi-president/legal-notice'
    );
  });

  it('stays out of search results', async () => {
    const metadata = await privacyMetadata(params('fr-CH'));

    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates?.canonical).toBe(
      'https://www.gocosmic.dev/fr-ch/applications/moi-president/confidentialite'
    );
  });
});

describe('Moi Président legal notice', () => {
  it("shows the app's sections, then points to the privacy policy", async () => {
    const { getByRole, getAllByRole, queryByRole } = render(await MoiPresidentLegalNoticePage(params('fr')));

    expect(getByRole('heading', { level: 1, name: 'Mentions légales' })).toBeInTheDocument();
    expect(getAllByRole('heading', { level: 2 })).toHaveLength(9);
    expect(queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    expect(getByRole('link', { name: 'politique de confidentialité de Moi Président' })).toHaveAttribute(
      'href',
      '/apps/moi-president/privacy'
    );
  });

  it('adds a section per published version to the notice of the simulation, and a correction on top', async () => {
    state.releases = RELEASES;
    state.correction = CORRECTION;
    const { getByRole, container } = render(await MoiPresidentLegalNoticePage(params('en')));
    const notice = container.querySelector<HTMLElement>('section#notice')!;

    expect(getByRole('region', { name: 'Correction' })).toHaveTextContent('Text of the correction.');
    expect(
      within(notice)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    ).toEqual(['Version 1.1.0, published on 2 March 2027', 'Version 1.0.0, published on 10 February 2027']);
    expect(within(notice).getAllByRole('link', { name: 'The notice of this simulation' })[0]).toHaveAttribute(
      'href',
      RELEASES[0]?.noticeUrl
    );
  });

  it('stays out of search results', async () => {
    const metadata = await legalNoticeMetadata(params('en'));

    expect(metadata.title).toBe('Moi Président legal notice | Cosmic Studio');
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});

describe("Moi Président's legal pages in another language", () => {
  beforeEach(() => {
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });
  });

  it('redirect the page and its metadata to the English version, in the same region', async () => {
    await expect(MoiPresidentLegalNoticePage(params('de'))).rejects.toThrow('NEXT_REDIRECT');
    await expect(privacyMetadata(params('es-CH'))).rejects.toThrow('NEXT_REDIRECT');

    expect(redirect).toHaveBeenNthCalledWith(1, { href: '/apps/moi-president/legal-notice', locale: 'en' });
    expect(redirect).toHaveBeenNthCalledWith(2, { href: '/apps/moi-president/privacy', locale: 'en-CH' });
  });
});

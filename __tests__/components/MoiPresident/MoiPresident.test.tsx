import { CorrectionNotice, MoiPresidentHero, MoiPresidentSupport, ReleaseNotice } from '@/components/MoiPresident';

import { render, within } from '../../test-utils';

describe('CorrectionNotice', () => {
  it('titles the correction, dates it and marks a text in another language', () => {
    const { getByRole, getByText } = render(
      <CorrectionNotice title="Richtigstellung" date="Veröffentlicht am 12. April 2027" text="Text." lang="en" />
    );

    expect(getByRole('region', { name: 'Richtigstellung' })).toBeInTheDocument();
    expect(getByText('Veröffentlicht am 12. April 2027')).toBeInTheDocument();
    expect(getByText('Text.')).toHaveAttribute('lang', 'en');
  });
});

describe('ReleaseNotice', () => {
  const props = {
    id: 'version-1.1.0',
    heading: 'Version 1.1.0, published on 2 March 2027',
    frozen: 'Data frozen in version 1.1.0 of the game.',
    pollsLabel: 'Source polls',
  };

  it('lists the mentions of each poll, then links its notice in a new tab', () => {
    const { getByRole } = render(
      <ReleaseNotice
        {...props}
        noticeLink={{ label: 'The notice of this simulation', href: 'https://example.org/notice.pdf' }}
        polls={[
          {
            rows: [
              { label: 'Institute', value: 'Institut A' },
              { label: 'Question asked', value: 'Pour qui voteriez-vous ?', lang: 'fr' },
            ],
            notice: { label: "The poll's notice", href: 'https://example.org/poll.pdf' },
          },
        ]}
      />
    );
    const version = getByRole('region', { name: 'Version 1.1.0, published on 2 March 2027' });
    const poll = within(within(version).getByRole('list', { name: 'Source polls' })).getByRole('listitem');

    expect(
      within(poll)
        .getAllByRole('term')
        .map((term) => term.textContent)
    ).toEqual(['Institute', 'Question asked']);
    expect(within(poll).getByText('Pour qui voteriez-vous ?')).toHaveAttribute('lang', 'fr');
    expect(within(poll).getByRole('link', { name: "The poll's notice" })).toHaveAttribute('target', '_blank');
    expect(within(version).getByRole('link', { name: 'The notice of this simulation' })).toHaveAttribute(
      'href',
      'https://example.org/notice.pdf'
    );
  });

  it('shows no list for a version without polls', () => {
    const { queryByRole, getByText } = render(<ReleaseNotice {...props} polls={[]} />);

    expect(getByText('Data frozen in version 1.1.0 of the game.')).toBeInTheDocument();
    expect(queryByRole('list')).not.toBeInTheDocument();
  });
});

describe('MoiPresidentHero', () => {
  it('shows the icon, the game, its genres, its stores and a correction above it all', () => {
    const { getByRole, getByText } = render(
      <MoiPresidentHero
        eyebrow="Mobile game · iOS and Android"
        title="Moi Président"
        lead="A satirical simulation game."
        categories={['Games', 'Role-playing', 'Strategy']}
        storesSoon="Coming soon to the App Store and Google Play"
        icon={{ src: '/apps/moi-president/app-icon.png', alt: 'Moi Président icon' }}
        banner={<p>Correction</p>}
      />
    );

    expect(getByRole('heading', { level: 1, name: 'Moi Président' })).toBeInTheDocument();
    expect(getByRole('img', { name: 'Moi Président icon' })).toBeInTheDocument();
    expect(
      within(getByRole('list'))
        .getAllByRole('listitem')
        .map((item) => item.textContent)
    ).toEqual(['Games', 'Role-playing', 'Strategy']);
    expect(getByText('Coming soon to the App Store and Google Play')).toBeInTheDocument();
    expect(
      getByText('Correction').compareDocumentPosition(getByRole('heading', { level: 1 })) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});

describe('MoiPresidentSupport', () => {
  it('opens the mail app and links both legal pages, marking one in another language', () => {
    const { getByRole } = render(
      <MoiPresidentSupport
        eyebrow="Support"
        title="A question about the game?"
        lead="Write to us."
        email={{ label: 'Write to support@gocosmic.dev', href: 'mailto:support@gocosmic.dev' }}
        legalLinks={[
          { label: 'Privacy policy (in English)', href: '/apps/moi-president/privacy', locale: 'en' },
          { label: 'Legal notice', href: '/apps/moi-president/legal-notice', locale: 'de' },
        ]}
        locale="de"
      />
    );

    expect(getByRole('region', { name: 'A question about the game?' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Write to support@gocosmic.dev' })).toHaveAttribute(
      'href',
      'mailto:support@gocosmic.dev'
    );
    expect(getByRole('link', { name: 'Privacy policy (in English)' })).toHaveAttribute('hreflang', 'en');
    expect(getByRole('link', { name: 'Legal notice' })).not.toHaveAttribute('hreflang');
  });
});

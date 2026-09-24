import { AudienceGrid } from '@/components/AudienceGrid';
import { OwnApps } from '@/components/OwnApps';
import { StudioIntro } from '@/components/StudioIntro';
import { WhyStudio } from '@/components/WhyStudio';

import { render } from '../../test-utils';

describe('AudienceGrid', () => {
  it('renders a labelled section with one numbered card per audience', () => {
    const { getByRole, getAllByRole, getByText } = render(
      <AudienceGrid
        eyebrow="[ Who · 03 ]"
        title="Who it is for"
        items={[
          { title: 'Craftspeople', description: 'Carpenters' },
          { title: 'Associations', description: 'Choirs' },
        ]}
      />
    );

    expect(getByRole('region', { name: 'Who it is for' })).toHaveAttribute('id', 'audience');
    expect(getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Craftspeople',
      'Associations',
    ]);
    expect(getByText('/02')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('WhyStudio', () => {
  it('renders the argument and the numbered reasons on the space background', () => {
    const { getByRole, getAllByRole, getByText } = render(
      <WhyStudio
        eyebrow="[ Why ]"
        title="Why a studio"
        lead="Because."
        reasons={[
          { title: 'You own it', description: 'Content is yours' },
          { title: 'Fast', description: 'Pages load fast' },
        ]}
      />
    );

    const section = getByRole('region', { name: 'Why a studio' });
    expect(section).toHaveClass('bg-space');
    expect(getByText('Because.')).toBeInTheDocument();
    expect(getAllByRole('listitem')).toHaveLength(2);
    expect(getByText('02')).toBeInTheDocument();
  });
});

describe('OwnApps', () => {
  it('links the app card to its page with the real icon', () => {
    const { getByRole } = render(
      <OwnApps
        eyebrow="[ Our apps ]"
        title="Our own products"
        lead="We test here."
        app={{
          name: 'Daily Fortune',
          badge: 'iOS · Android',
          description: 'A short message',
          linkLabel: 'Discover the app',
          href: '/projects/daily-fortune',
          icon: { src: '/projects/daily-fortune/app-icon.png', alt: 'Daily Fortune icon' },
        }}
      />
    );

    const card = getByRole('link', { name: /Daily Fortune/ });
    expect(card).toHaveAttribute('href', '/projects/daily-fortune');
    expect(getByRole('img', { name: 'Daily Fortune icon' })).toBeInTheDocument();
    expect(getByRole('heading', { level: 3, name: 'Daily Fortune' })).toBeInTheDocument();
  });
});

describe('StudioIntro', () => {
  const props = {
    eyebrow: '[ The studio ]',
    title: 'A developer in Geneva',
    paragraphs: ['First paragraph', 'Second paragraph'],
    zones: ['Chêne-Bougeries · base', 'Elsewhere · remote'],
  };

  it('renders the paragraphs and the zone line in a single column without a portrait', () => {
    const { getByText, getAllByRole, queryByRole } = render(<StudioIntro {...props} />);

    expect(getByText('Second paragraph')).toBeInTheDocument();
    expect(getAllByRole('listitem').map((item) => item.textContent)).toEqual(props.zones);
    expect(queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the portrait when one is provided', () => {
    const { getByRole } = render(
      <StudioIntro {...props} portrait={{ src: '/portrait.jpg', alt: 'Matthieu', width: 800, height: 1000 }} />
    );

    expect(getByRole('img', { name: 'Matthieu' })).toBeInTheDocument();
  });
});

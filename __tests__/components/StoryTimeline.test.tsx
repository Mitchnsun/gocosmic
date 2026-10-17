import { render, screen, within } from '@testing-library/react';

import { type StoryStep, StoryTimeline } from '@/components/StoryTimeline';

const STEPS: StoryStep[] = [
  { id: 'origins', date: 'Origins', title: 'Duingt', description: 'Matthieu comes from Duingt.' },
  {
    id: 'eirl',
    date: '17 October 2016',
    dateTime: '2016-10-17',
    title: 'The EIRL is founded',
    action: <a href="/projects">View project</a>,
  },
  { id: 'fer', date: 'In progress', title: 'Affiliation with FER Genève', current: true },
];

/** The list item of each step, by its position. */
const steps = () => {
  const [origins, eirl, fer] = screen.getAllByRole('listitem');
  return { origins: origins!, eirl: eirl!, fer: fer! };
};

function renderTimeline() {
  return render(
    <>
      <h1 id="story-intro">Story</h1>
      <StoryTimeline steps={STEPS} labelledBy="story-intro" className="max-w-3xl" />
    </>
  );
}

describe('StoryTimeline', () => {
  it('lists the steps in order, named by the page heading', () => {
    renderTimeline();

    const list = screen.getByRole('list', { name: 'Story' });
    expect(list.tagName).toBe('OL');
    expect(list).toHaveClass('max-w-3xl');
    expect(
      within(list)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    ).toEqual(['Duingt', 'The EIRL is founded', 'Affiliation with FER Genève']);
  });

  it('gives a date label a machine-readable date, and leaves a word as plain text', () => {
    const { container } = renderTimeline();

    expect(screen.getByText('17 October 2016').tagName).toBe('TIME');
    expect(screen.getByText('17 October 2016')).toHaveAttribute('datetime', '2016-10-17');
    expect(screen.getByText('Origins').tagName).toBe('SPAN');
    expect(container.querySelectorAll('time')).toHaveLength(1);
  });

  it('shows a description and an action only when the step has one', () => {
    renderTimeline();
    const { origins, eirl, fer } = steps();

    expect(within(origins).getByText('Matthieu comes from Duingt.')).toBeInTheDocument();
    expect(within(origins).queryByRole('link')).not.toBeInTheDocument();
    expect(within(eirl).getByRole('link', { name: 'View project' })).toHaveAttribute('href', '/projects');
    expect(within(fer).queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('marks the step in progress with the orange accent, the others in the meta colour', () => {
    renderTimeline();
    const { origins, fer } = steps();

    expect(within(fer).getByText('In progress')).toHaveClass('text-aerospace-ink');
    expect(fer.querySelector('[aria-hidden="true"]')).toHaveClass('bg-aerospace');
    expect(within(origins).getByText('Origins')).toHaveClass('text-fg-3');
    expect(origins.querySelector('[aria-hidden="true"]')).not.toHaveClass('bg-aerospace');
  });

  it('staggers the reveal of the steps by 50 ms', () => {
    renderTimeline();
    const { eirl, fer } = steps();

    expect(eirl.querySelector('[data-visible]')).toHaveStyle({ transitionDelay: '50ms' });
    expect(fer.querySelector('[data-visible]')).toHaveStyle({ transitionDelay: '100ms' });
  });
});

import { STORY_MILESTONES } from '@/data/story';
import { routing } from '@/i18n/routing';

import story from '../../messages/en/story.json';

describe('STORY_MILESTONES', () => {
  // The page and the files for AI agents both read this list: a step left out of it would show nowhere.
  it('lists every step of the story messages, in their order', () => {
    expect(STORY_MILESTONES.map(({ id }) => id)).toEqual(Object.keys(story.story.steps));
  });

  it('marks a single step as in progress, the last one', () => {
    expect(STORY_MILESTONES.filter(({ current }) => current)).toEqual([STORY_MILESTONES.at(-1)]);
  });

  it('dates the steps in chronological order', () => {
    const dates = STORY_MILESTONES.flatMap(({ dateTime }) => (dateTime ? [dateTime] : []));

    expect(dates).toEqual([...dates].sort());
    // `YYYY`, `YYYY-MM` or `YYYY-MM-DD`, the forms both `<time>` and `Date.parse` accept.
    for (const date of dates) expect(Date.parse(date), date).not.toBeNaN();
  });

  it('links only to declared routes', () => {
    for (const { href } of STORY_MILESTONES) {
      if (href) expect(Object.keys(routing.pathnames)).toContain(href);
    }
  });
});

import { describe, expect, it } from 'vitest';

import type { GuideAnswers } from '@/components/PricingGuide/PricingGuide.types';
import { answersToChoices, getOutcome, getSteps, INITIAL_ANSWERS } from '@/components/PricingGuide/PricingGuide.utils';
import { INITIAL_SELECTION } from '@/components/PricingSimulator/constants';

const answers = (overrides: Partial<GuideAnswers> = {}): GuideAnswers => ({
  ...INITIAL_ANSWERS,
  situation: 'new',
  ...overrides,
});

describe('getOutcome', () => {
  it('waits for the first answers', () => {
    expect(getOutcome(INITIAL_ANSWERS)).toBeNull();
    expect(getOutcome(answers({ situation: 'existing' }))).toBeNull();
  });

  it('composes a plan for a site to create or to redo', () => {
    expect(getOutcome(answers())).toBe('compose');
    expect(getOutcome(answers({ situation: 'existing', existingPlan: 'redo' }))).toBe('compose');
  });

  it('leads to the contact page to keep a site, and to a quote for a project outside the subscription', () => {
    expect(getOutcome(answers({ situation: 'existing', existingPlan: 'keep' }))).toBe('contact');
    expect(getOutcome(answers({ situation: 'custom', existingPlan: 'redo' }))).toBe('quote');
    // An answer to the follow-up question no longer counts once the first answer changes.
    expect(getOutcome(answers({ situation: 'new', existingPlan: 'keep' }))).toBe('compose');
  });
});

describe('getSteps', () => {
  it('asks only the opening questions until they lead to a plan', () => {
    expect(getSteps(INITIAL_ANSWERS)).toEqual(['situation']);
    expect(getSteps(answers({ situation: 'existing' }))).toEqual(['situation', 'existing']);
    expect(getSteps(answers({ situation: 'custom' }))).toEqual(['situation']);
  });

  it('asks about the email address only without a domain, and about news only when the studio publishes', () => {
    expect(getSteps(answers())).toEqual(['situation', 'editor', 'domain', 'pages', 'contact', 'news', 'updates']);
    expect(getSteps(answers({ situation: 'existing', existingPlan: 'redo', ownDomain: 'no', editor: 'self' }))).toEqual(
      ['situation', 'existing', 'editor', 'domain', 'pages', 'contact', 'email', 'updates']
    );
  });
});

describe('answersToChoices', () => {
  it('leaves the simulator at its start when nothing is answered', () => {
    expect(answersToChoices(answers())).toEqual(INITIAL_SELECTION);
  });

  it('turns every answer into the matching choice', () => {
    const choices = answersToChoices(
      answers({
        editor: 'studio',
        ownDomain: 'no',
        pages: 'five_seven',
        contact: ['email', 'form', 'booking'],
        email: 'team',
        news: 'monthly',
        updates: 'twice_monthly',
      })
    );

    expect(choices).toEqual({
      ...INITIAL_SELECTION,
      formula: 'managed',
      ownDomain: false,
      addOns: { ...INITIAL_SELECTION.addOns, domain: true, email: true, contact_form: true, booking: true },
      pages: 2,
      updatesEnabled: true,
      updates: 2,
      news: 1,
      mailboxes: 1,
    });
  });

  it('keeps one page, to be adjusted, when the number of pages is not known yet', () => {
    expect(answersToChoices(answers({ pages: 'unsure' })).pages).toBe(0);
    expect(answersToChoices(answers({ pages: 'ten_plus' })).pages).toBe(4);
  });

  it('keeps the yearly change included when it is enough', () => {
    expect(answersToChoices(answers({ updates: 'yearly' }))).toMatchObject({ updatesEnabled: false, updates: 0 });
    expect(answersToChoices(answers({ updates: 'few_per_year' }))).toMatchObject({ updatesEnabled: true, updates: 0 });
  });

  it('never charges news with "You stay in control", which includes them', () => {
    expect(answersToChoices(answers({ editor: 'self', news: 'weekly' }))).toMatchObject({
      formula: 'self_service',
      news: null,
    });
    expect(answersToChoices(answers({ news: 'none' })).news).toBeNull();
  });

  it('offers no email address to a client who already has a domain name', () => {
    const choices = answersToChoices(answers({ ownDomain: 'yes', email: 'team' }));

    expect(choices).toMatchObject({ ownDomain: true, mailboxes: 0 });
    expect(choices.addOns).toMatchObject({ domain: false, email: false });
    expect(answersToChoices(answers({ ownDomain: 'no', email: 'no' })).addOns).toMatchObject({
      domain: true,
      email: false,
    });
  });
});

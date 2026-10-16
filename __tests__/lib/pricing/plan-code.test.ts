import { INITIAL_SELECTION } from '@/components/PricingSimulator/constants';
import { type DecodedPlan, decodePlanCode, encodePlanCode } from '@/lib/pricing/plan-code';

import { makePlan } from './plan-fixtures';

const showcase = makePlan(
  {
    ownDomain: false,
    addOns: { domain: true, swiss_hosting: true },
    pages: 2,
    updatesEnabled: true,
    updates: 3,
    analytics: 1,
  },
  'ch'
);

const everything = makePlan(
  {
    formula: 'managed',
    ownDomain: false,
    addOns: {
      domain: true,
      swiss_hosting: true,
      email: true,
      contact_form: true,
      booking: true,
      reviews: true,
      english: true,
      detailed_analytics: true,
      redirects: true,
    },
    pages: 4,
    updatesEnabled: true,
    updates: 4,
    news: 2,
    analytics: 2,
    seo: 1,
    articles: 3,
    mailboxes: 5,
  },
  'ch'
);

/** A valid code of the current version, with one segment changed. */
const tweak = (index: number, segment: string) => {
  const segments = 'v2~website~showcase~managed~d-~p0~u-~n-~a-~s-~r-~m0~-~fr'.split('~');
  segments[index] = segment;
  return segments.join('~');
};

describe('plan code', () => {
  it('encodes a showcase plan with every segment, behind its version', () => {
    expect(encodePlanCode(showcase)).toBe(
      'v2~website~showcase~managed~d0~p2~u3~n-~a1~s-~r-~m0~domain.swiss_hosting~ch'
    );
  });

  it('encodes empty choices with placeholders', () => {
    const plan: DecodedPlan = { projectType: 'mobile', websiteType: null, selection: INITIAL_SELECTION, region: 'fr' };

    expect(encodePlanCode(plan)).toBe('v2~mobile~-~managed~d-~p0~u-~n-~a-~s-~r-~m0~-~fr');
  });

  it('normalises the plan before encoding it', () => {
    const plan = makePlan({ formula: 'self_service', ownDomain: true, addOns: { email: true }, news: 1, articles: 0 });

    expect(encodePlanCode(plan)).toBe('v2~website~showcase~self_service~d1~p0~u-~n-~a-~s-~r0~m0~-~fr');
  });

  it('keeps Swiss hosting for the Swiss version only', () => {
    const plan = makePlan({ addOns: { swiss_hosting: true } }, 'fr');

    expect(encodePlanCode(plan)).toBe('v2~website~showcase~managed~d-~p0~u-~n-~a-~s-~r-~m0~-~fr');
  });

  it('keeps every option within the length limit', () => {
    const code = encodePlanCode(everything);

    expect(code.length).toBeLessThanOrEqual(200);
    expect(decodePlanCode(code)).toEqual(everything);
  });

  it.each<DecodedPlan>([
    showcase,
    makePlan({
      formula: 'self_service',
      ownDomain: false,
      addOns: { domain: true, email: true },
      mailboxes: 2,
      seo: 0,
    }),
    makePlan({ ownDomain: true, news: 0, articles: 2 }),
    { projectType: 'website', websiteType: 'self_managed', selection: INITIAL_SELECTION, region: 'fr' },
    { projectType: 'both', websiteType: null, selection: INITIAL_SELECTION, region: 'fr' },
  ])('round-trips %o', (plan) => {
    expect(decodePlanCode(encodePlanCode(plan))).toEqual(plan);
  });

  it.each([
    ['a non-string', 42],
    ['undefined', undefined],
    ['an empty string', ''],
    ['an old six-segment code', 'website~showcase~p2~u3~domain.email~fr'],
    ['a first-version code', 'website~showcase~managed~p2~u3~a1~s-~r-~m0~domain.email~fr'],
    ['a first-version code with the monitoring', 'website~showcase~managed~p0~u-~a-~s-~r-~m0~monitoring~fr'],
    ['another version', tweak(0, 'v1')],
    ['too many segments', `${tweak(0, 'v2')}~x`],
    ['an unknown project', tweak(1, 'app')],
    ['an unknown website type', tweak(2, 'blog')],
    ['an unknown formula', tweak(3, 'diy')],
    ['an unknown domain answer', tweak(4, 'd2')],
    ['an unknown region', tweak(13, 'us')],
    ['a page tier out of range', tweak(5, 'p9')],
    ['an update tier out of range', tweak(6, 'u7')],
    ['a news tier out of range', tweak(7, 'n3')],
    ['a report tier out of range', tweak(8, 'a3')],
    ['an article tier out of range', tweak(10, 'r4')],
    ['a missing page tier', tweak(5, 'p-')],
    ['a malformed segment', tweak(6, 'ux')],
    ['a misplaced segment', tweak(6, 'a-')],
    ['too many mailboxes', tweak(11, 'm6')],
    ['an unknown add-on', tweak(12, 'hack')],
    ['the retired news add-on', tweak(12, 'news')],
    ['duplicated add-ons', 'v2~website~showcase~managed~d0~p0~u-~n-~a-~s-~r-~m0~domain.domain~fr'],
    ['reordered add-ons', 'v2~website~showcase~managed~d0~p0~u-~n-~a-~s-~r-~m0~swiss_hosting.domain~ch'],
    ['a domain the visitor did not ask for', tweak(12, 'domain')],
    ['a domain alongside one of their own', 'v2~website~showcase~managed~d1~p0~u-~n-~a-~s-~r-~m0~domain~fr'],
    ['an email address without its domain', 'v2~website~showcase~managed~d-~p0~u-~n-~a-~s-~r-~m0~email~fr'],
    ['mailboxes without an email address', 'v2~website~showcase~managed~d0~p0~u-~n-~a-~s-~r-~m2~domain~fr'],
    ['news charged in "You stay in control"', 'v2~website~showcase~self_service~d-~p0~u-~n1~a-~s-~r-~m0~-~fr'],
    ['Swiss hosting on the European version', tweak(12, 'swiss_hosting')],
    ['an oversized code', tweak(12, 'domain.'.repeat(30))],
  ])('rejects %s', (_label, raw) => {
    expect(decodePlanCode(raw)).toBeNull();
  });
});

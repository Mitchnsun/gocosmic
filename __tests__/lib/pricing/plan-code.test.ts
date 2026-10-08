import { INITIAL_SELECTION } from '@/components/PricingSimulator/constants';
import { type DecodedPlan, decodePlanCode, encodePlanCode } from '@/lib/pricing/plan-code';

import { makePlan } from './plan-fixtures';

const showcase = makePlan(
  { addOns: { domain: true, swiss_hosting: true }, pages: 2, updatesEnabled: true, updates: 3, analytics: 1 },
  'ch'
);

const everything = makePlan({
  formula: 'managed',
  addOns: {
    domain: true,
    swiss_hosting: true,
    email: true,
    contact_form: true,
    booking: true,
    reviews: true,
    english: true,
    news: true,
    monitoring: true,
    detailed_analytics: true,
    redirects: true,
  },
  pages: 4,
  updatesEnabled: true,
  updates: 4,
  analytics: 2,
  seo: 1,
  articles: 2,
  mailboxes: 5,
});

describe('plan code', () => {
  it('encodes a showcase plan with every segment', () => {
    expect(encodePlanCode(showcase)).toBe('website~showcase~managed~p2~u3~a1~s-~r-~m0~domain.swiss_hosting~ch');
  });

  it('encodes empty choices with placeholders', () => {
    const plan: DecodedPlan = { projectType: 'mobile', websiteType: null, selection: INITIAL_SELECTION, region: 'fr' };

    expect(encodePlanCode(plan)).toBe('mobile~-~managed~p0~u-~a-~s-~r-~m0~-~fr');
  });

  it('normalises the plan before encoding it', () => {
    const plan = makePlan({ formula: 'self_service', addOns: { news: true }, articles: 0 });

    expect(encodePlanCode(plan)).toBe('website~showcase~self_service~p0~u1~a-~s-~r0~m0~-~fr');
  });

  it('keeps every option within the length limit', () => {
    const code = encodePlanCode(everything);

    expect(code.length).toBeLessThanOrEqual(200);
    expect(decodePlanCode(code)).toEqual(everything);
  });

  it.each([
    showcase,
    makePlan({ formula: 'self_service', addOns: { domain: true, email: true }, mailboxes: 2, seo: 0 }),
    { projectType: 'website', websiteType: 'self_managed', selection: INITIAL_SELECTION, region: 'fr' } as DecodedPlan,
    { projectType: 'both', websiteType: null, selection: INITIAL_SELECTION, region: 'fr' } as DecodedPlan,
  ])('round-trips %o', (plan) => {
    expect(decodePlanCode(encodePlanCode(plan))).toEqual(plan);
  });

  it.each([
    ['a non-string', 42],
    ['undefined', undefined],
    ['an empty string', ''],
    ['an old six-segment code', 'website~showcase~p2~u3~domain.email~fr'],
    ['too many segments', 'website~showcase~managed~p0~u-~a-~s-~r-~m0~-~fr~x'],
    ['an unknown project', 'app~-~managed~p0~u-~a-~s-~r-~m0~-~fr'],
    ['an unknown website type', 'website~blog~managed~p0~u-~a-~s-~r-~m0~-~fr'],
    ['an unknown formula', 'website~showcase~diy~p0~u-~a-~s-~r-~m0~-~fr'],
    ['an unknown region', 'website~showcase~managed~p0~u-~a-~s-~r-~m0~-~us'],
    ['a page tier out of range', 'website~showcase~managed~p9~u-~a-~s-~r-~m0~-~fr'],
    ['an update tier out of range', 'website~showcase~managed~p0~u7~a-~s-~r-~m0~-~fr'],
    ['a report tier out of range', 'website~showcase~managed~p0~u-~a3~s-~r-~m0~-~fr'],
    ['a missing page tier', 'website~showcase~managed~p-~u-~a-~s-~r-~m0~-~fr'],
    ['a malformed segment', 'website~showcase~managed~p0~ux~a-~s-~r-~m0~-~fr'],
    ['a misplaced segment', 'website~showcase~managed~p0~a-~u-~s-~r-~m0~-~fr'],
    ['too many mailboxes', 'website~showcase~managed~p0~u-~a-~s-~r-~m6~-~fr'],
    ['an unknown add-on', 'website~showcase~managed~p0~u-~a-~s-~r-~m0~hack~fr'],
    ['duplicated add-ons', 'website~showcase~managed~p0~u-~a-~s-~r-~m0~domain.domain~fr'],
    ['reordered add-ons', 'website~showcase~managed~p0~u-~a-~s-~r-~m0~swiss_hosting.domain~fr'],
    ['an email address without its domain', 'website~showcase~managed~p0~u-~a-~s-~r-~m0~email~fr'],
    ['mailboxes without an email address', 'website~showcase~managed~p0~u-~a-~s-~r-~m2~domain~fr'],
    ['the news section charged in "You stay in control"', 'website~showcase~self_service~p0~u-~a-~s-~r-~m0~news~fr'],
    ['updates below the article rhythm', 'website~showcase~managed~p0~u0~a-~s-~r1~m0~-~fr'],
    ['an oversized code', `website~showcase~managed~p0~u-~a-~s-~r-~m0~${'domain.'.repeat(30)}~fr`],
  ])('rejects %s', (_label, raw) => {
    expect(decodePlanCode(raw)).toBeNull();
  });
});

import { INITIAL_SELECTION } from '@/components/PricingSimulator/constants';
import { type DecodedPlan, decodePlanCode, encodePlanCode } from '@/lib/pricing/plan-code';

const showcase: DecodedPlan = {
  projectType: 'website',
  websiteType: 'showcase',
  selection: {
    addOns: { domain: true, swiss_hosting: true, email: false },
    pages: 2,
    updatesEnabled: true,
    updates: 3,
  },
  region: 'ch',
};

describe('plan code', () => {
  it('encodes a showcase plan with every segment', () => {
    expect(encodePlanCode(showcase)).toBe('website~showcase~p2~u3~domain.swiss_hosting~ch');
  });

  it('encodes empty choices with placeholders', () => {
    const plan: DecodedPlan = { projectType: 'mobile', websiteType: null, selection: INITIAL_SELECTION, region: 'fr' };

    expect(encodePlanCode(plan)).toBe('mobile~-~p0~u-~-~fr');
  });

  it.each([
    showcase,
    { projectType: 'website', websiteType: 'self_managed', selection: INITIAL_SELECTION, region: 'fr' } as DecodedPlan,
    { projectType: 'both', websiteType: null, selection: INITIAL_SELECTION, region: 'fr' } as DecodedPlan,
  ])('round-trips %o', (plan) => {
    expect(decodePlanCode(encodePlanCode(plan))).toEqual(plan);
  });

  it.each([
    ['a non-string', 42],
    ['undefined', undefined],
    ['an empty string', ''],
    ['a truncated code', 'website~showcase~p2'],
    ['too many segments', 'website~showcase~p2~u3~-~fr~x'],
    ['an unknown project', 'app~-~p0~u-~-~fr'],
    ['an unknown website type', 'website~blog~p0~u-~-~fr'],
    ['an unknown region', 'website~showcase~p0~u-~-~us'],
    ['a page tier out of range', 'website~showcase~p9~u-~-~fr'],
    ['an update tier out of range', 'website~showcase~p0~u7~-~fr'],
    ['an unknown add-on', 'website~showcase~p0~u-~hack~fr'],
    ['duplicated add-ons', 'website~showcase~p0~u-~domain.domain~fr'],
    ['reordered add-ons', 'website~showcase~p0~u-~email.domain~fr'],
    ['an oversized code', `website~showcase~p0~u-~${'domain.'.repeat(30)}~fr`],
  ])('rejects %s', (_label, raw) => {
    expect(decodePlanCode(raw)).toBeNull();
  });
});

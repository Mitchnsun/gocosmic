import { INITIAL_SELECTION } from '@/components/PricingSimulator/constants';
import { buildQuoteEmailBody } from '@/components/PricingSimulator/PricingSimulator.summary';
import type { DecodedPlan } from '@/lib/pricing/plan-code';

/** Echoes the key, and interpolated values, so the assertions read the structure. */
const t = (key: string) => key;

const showcase = (overrides: Partial<DecodedPlan['selection']> = {}): DecodedPlan => ({
  projectType: 'website',
  websiteType: 'showcase',
  selection: { ...INITIAL_SELECTION, ...overrides },
  region: 'fr',
});

describe('buildQuoteEmailBody', () => {
  it('lists the project, the site type, the base plan and the total', () => {
    const body = buildQuoteEmailBody(t, showcase());

    expect(body).toContain('summary.intro');
    expect(body).toContain('summary.project : step1.options.website');
    expect(body).toContain('summary.site_type : step2.options.showcase');
    expect(body).toContain('builder.base.title : 10€ builder.period');
    expect(body).toContain('builder.pages.label : builder.pages.tiers.one (+0€)');
    expect(body).toContain('builder.total.label : 10€ builder.period');
    expect(body).not.toContain('builder.total.beyond');
  });

  it('only lists the ticked add-ons and the enabled update package', () => {
    const body = buildQuoteEmailBody(
      t,
      showcase({
        addOns: { domain: true, swiss_hosting: false, email: true },
        pages: 1,
        updatesEnabled: true,
        updates: 2,
      })
    );

    expect(body).toContain('builder.options.domain.label (+5€)');
    expect(body).toContain('builder.options.email.label (+10€)');
    expect(body).not.toContain('builder.options.swiss_hosting.label');
    expect(body).toContain('builder.updates.label : builder.updates.tiers.twice_monthly (+25€)');
    // 10 base + 5 pages + 5 domain + 10 email + 25 updates
    expect(body).toContain('builder.total.label : 55€ builder.period');
  });

  it('omits the update package when it is not enabled', () => {
    expect(buildQuoteEmailBody(t, showcase({ updatesEnabled: false, updates: 3 }))).not.toContain(
      'builder.updates.label'
    );
  });

  it('uses Swiss francs in the ch region', () => {
    expect(buildQuoteEmailBody(t, { ...showcase(), region: 'ch' })).toContain('builder.total.label : 10 CHF');
  });

  it('adds the beyond-volumes note once a slider is on its top position', () => {
    expect(buildQuoteEmailBody(t, showcase({ pages: 4 }))).toContain('builder.total.beyond');
  });

  it('gives the project context and no figure for a custom quote path', () => {
    const body = buildQuoteEmailBody(t, {
      projectType: 'website',
      websiteType: 'ecommerce',
      selection: INITIAL_SELECTION,
      region: 'fr',
    });

    expect(body).toContain('step2.options.ecommerce');
    expect(body).toContain('results.custom.note');
    expect(body).not.toContain('builder.total.label');
  });

  it('omits the site type for a mobile project', () => {
    const body = buildQuoteEmailBody(t, {
      projectType: 'mobile',
      websiteType: null,
      selection: INITIAL_SELECTION,
      region: 'fr',
    });

    expect(body).toContain('step1.options.mobile');
    expect(body).not.toContain('summary.site_type');
  });
});

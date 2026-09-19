import { INITIAL_SELECTION } from '@/components/PricingSimulator/constants';
import type { DecodedPlan } from '@/lib/pricing/plan-code';
import { buildPlanEmailRows } from '@/lib/pricing/plan-email';

const rowsToText = (plan: DecodedPlan) =>
  buildPlanEmailRows(plan)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

describe('buildPlanEmailRows', () => {
  it('lists the chosen options with their surcharge and recomputes the total', () => {
    const text = rowsToText({
      projectType: 'website',
      websiteType: 'showcase',
      selection: {
        addOns: { domain: true, swiss_hosting: false, email: true },
        pages: 2,
        updatesEnabled: true,
        updates: 1,
      },
      region: 'fr',
    });

    expect(text).toContain('Simulation — project: A website');
    expect(text).toContain('Simulation — base plan: 10€ / month');
    expect(text).toContain('Simulation — pages: 5 to 7 pages (+10€)');
    expect(text).toContain('Simulation — add-ons: Domain name management (+5€), Email address on the domain (+10€)');
    expect(text).toContain('Simulation — content updates: Once a month (+15€)');
    // 10 base + 10 pages + 5 domain + 10 email + 15 updates
    expect(text).toContain('Simulation — monthly total: 50€ / month');
  });

  it('uses Swiss francs for the ch region and reports unused options', () => {
    const text = rowsToText({
      projectType: 'website',
      websiteType: 'showcase',
      selection: INITIAL_SELECTION,
      region: 'ch',
    });

    expect(text).toContain('Simulation — add-ons: None');
    expect(text).toContain('Simulation — content updates: Not included');
    expect(text).toContain('Simulation — monthly total: 10 CHF / month');
    expect(text).not.toContain('personal quote');
  });

  it('flags a slider sitting on its top position', () => {
    const text = rowsToText({
      projectType: 'website',
      websiteType: 'showcase',
      selection: { ...INITIAL_SELECTION, pages: 4 },
      region: 'fr',
    });

    expect(text).toContain('personal quote');
  });

  it('reports a custom quote, without any figure, for a non-showcase path', () => {
    const text = rowsToText({
      projectType: 'website',
      websiteType: 'ecommerce',
      selection: INITIAL_SELECTION,
      region: 'fr',
    });

    expect(text).toContain('Simulation — site type: Online shop');
    expect(text).toContain('Simulation — pricing: Custom quote');
    expect(text).not.toContain('monthly total');
  });

  it('reports a custom quote for a mobile app', () => {
    const text = rowsToText({ projectType: 'mobile', websiteType: null, selection: INITIAL_SELECTION, region: 'fr' });

    expect(text).toContain('Simulation — project: A mobile app');
    expect(text).not.toContain('site type');
    expect(text).toContain('Custom quote');
  });
});

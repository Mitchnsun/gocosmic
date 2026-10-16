import { INITIAL_SELECTION } from '@/components/PricingSimulator/constants';
import type { DecodedPlan } from '@/lib/pricing/plan-code';
import { buildPlanEmailRows } from '@/lib/pricing/plan-email';

import { makePlan } from './plan-fixtures';

const rowsToText = (plan: DecodedPlan) =>
  buildPlanEmailRows(plan)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

describe('buildPlanEmailRows', () => {
  it('lists the chosen options with their surcharge and recomputes the total', () => {
    const text = rowsToText(
      makePlan({ ownDomain: false, addOns: { email: true }, pages: 2, updatesEnabled: true, updates: 1 })
    );

    expect(text).toContain('Simulation — project: A website');
    expect(text).toContain('Simulation — existing domain name: None yet: managed by the studio (in the add-ons)');
    expect(text).toContain('Simulation — formula: We take care of everything: 10€ / month');
    expect(text).toContain('Simulation — pages: 5 to 7 pages (+15€)');
    expect(text).toContain('Simulation — add-ons: Domain name management (+5€), Email address on the domain (+15€)');
    expect(text).toContain('Simulation — content updates: Once a month (+20€)');
    // 10 base + 15 pages + 5 domain + 15 email + 20 updates
    expect(text).toContain('Simulation — monthly total: 65€ / month');
  });

  it('describes the new options, the formula and the extra mailboxes', () => {
    const text = rowsToText(
      makePlan({
        formula: 'self_service',
        ownDomain: false,
        addOns: { contact_form: true, email: true, redirects: true, detailed_analytics: true },
        mailboxes: 2,
        analytics: 2,
        seo: 1,
        articles: 3,
      })
    );

    expect(text).toContain('Simulation — formula: You stay in control (editing tool and news section included): 20€');
    expect(text).toContain(
      'Simulation — add-ons: Contact form (+5€), Domain name management (+5€), Email address on the domain (+15€), 2 extra mailbox(es) (+20€), Forwarding addresses (up to 5) (+5€), Detailed statistics (consent banner) (+5€)'
    );
    expect(text).toContain('Simulation — local search follow-up: Every month (+15€)');
    expect(text).toContain('Simulation — visit statistics: Monthly report (+50€)');
    // Articles no longer count as content changes.
    expect(text).toContain('Simulation — content updates: Once a year (included)');
    expect(text).toContain('Simulation — AI-assisted articles: 3 articles a week (+250€)');
    // News are included in "You stay in control".
    expect(text).toContain('Simulation — news published by the studio: Not included');
    // 20 + 5 + 5 + 15 + 20 + 5 + 5 + 15 + 50 + 250
    expect(text).toContain('Simulation — monthly total: 390€ / month');
  });

  it('reports the news rhythm and a domain name the client already has', () => {
    const text = rowsToText(makePlan({ ownDomain: true, news: 1 }));

    expect(text).toContain('Simulation — existing domain name: The client already has one');
    expect(text).toContain('Simulation — news published by the studio: 1 news item a month (+25€)');
    expect(text).toContain('Simulation — monthly total: 35€ / month');
  });

  it('uses Swiss francs for the ch region and reports unused options', () => {
    const text = rowsToText(makePlan({}, 'ch'));

    expect(text).toContain('Simulation — pages: 1 page (included)');
    expect(text).toContain('Simulation — existing domain name: Not answered');
    expect(text).toContain('Simulation — add-ons: None');
    expect(text).toContain('Simulation — local search follow-up: Not included');
    expect(text).toContain('Simulation — content updates: Once a year (included)');
    expect(text).toContain('Simulation — monthly total: 10 CHF / month');
    expect(text).not.toContain('personal quote');
  });

  it('flags a volume sitting on its top position', () => {
    const text = rowsToText(makePlan({ pages: 4 }));

    expect(text).toContain('Simulation — pages: 10 pages or more (+40€ or more)');
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

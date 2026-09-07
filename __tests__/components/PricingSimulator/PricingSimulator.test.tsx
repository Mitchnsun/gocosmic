import { PricingSimulator } from '@/components/PricingSimulator/PricingSimulator';

import { fireEvent, render, screen } from '../../test-utils';

/** Walk the simulator down to the composable showcase plan. */
const openPlanBuilder = () => {
  fireEvent.click(screen.getByRole('button', { name: 'A website' }));
  fireEvent.click(screen.getByRole('button', { name: 'A site that presents my business' }));
};

describe('PricingSimulator', () => {
  it('renders step 1 on initial load and nothing else', () => {
    render(<PricingSimulator currency="eur" />);

    expect(screen.getByText('What would you like to create?')).toBeInTheDocument();
    expect(screen.queryByText('What kind of website do you need?')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Start over' })).not.toBeInTheDocument();
  });

  it('renders the three project type options', () => {
    render(<PricingSimulator currency="eur" />);

    expect(screen.getByRole('button', { name: 'A website' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A mobile app' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Both' })).toBeInTheDocument();
  });

  it('shows the four website types once "a website" is picked', () => {
    render(<PricingSimulator currency="eur" />);
    fireEvent.click(screen.getByRole('button', { name: 'A website' }));

    expect(screen.getByText('What kind of website do you need?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A site that presents my business' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A site I want to edit myself' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A site with an area for my customers' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A site to sell online' })).toBeInTheDocument();
  });

  describe('showcase plan builder', () => {
    it('opens on the advertised base price', () => {
      render(<PricingSimulator currency="eur" />);
      openPlanBuilder();

      expect(screen.getByText('Base plan')).toBeInTheDocument();
      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('10€');
    });

    it('adds an add-on to the live total when ticked', () => {
      render(<PricingSimulator currency="eur" />);
      openPlanBuilder();

      fireEvent.click(screen.getByRole('checkbox', { name: /managing your web address/i }));

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('15€');
    });

    it('accumulates several add-ons', () => {
      render(<PricingSimulator currency="eur" />);
      openPlanBuilder();

      fireEvent.click(screen.getByRole('checkbox', { name: /managing your web address/i }));
      fireEvent.click(screen.getByRole('checkbox', { name: /email address in your own name/i }));

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('25€');
    });

    it('raises the total when the pages slider moves', () => {
      render(<PricingSimulator currency="eur" />);
      openPlanBuilder();

      fireEvent.change(screen.getByRole('slider', { name: /number of pages/i }), { target: { value: '2' } });

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('20€');
    });

    it('leaves the update slider out of the total until its option is ticked', () => {
      render(<PricingSimulator currency="eur" />);
      openPlanBuilder();

      const slider = screen.getByRole('slider', { name: /changes per year/i });
      expect(slider).toBeDisabled();
      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('10€');

      fireEvent.click(screen.getByRole('checkbox', { name: /content changes included/i }));

      expect(screen.getByRole('slider', { name: /changes per year/i })).toBeEnabled();
      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('15€');
    });

    it('prices the chosen update frequency', () => {
      render(<PricingSimulator currency="eur" />);
      openPlanBuilder();

      fireEvent.click(screen.getByRole('checkbox', { name: /content changes included/i }));
      fireEvent.change(screen.getByRole('slider', { name: /changes per year/i }), { target: { value: '3' } });

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('60€');
    });

    it('invites a conversation once a slider hits its top position', () => {
      render(<PricingSimulator currency="eur" />);
      openPlanBuilder();

      expect(screen.queryByText(/beyond these volumes/i)).not.toBeInTheDocument();

      fireEvent.change(screen.getByRole('slider', { name: /number of pages/i }), { target: { value: '4' } });

      expect(screen.getByText(/beyond these volumes/i)).toBeInTheDocument();
    });

    it('quotes the plan in francs for Swiss visitors', () => {
      render(<PricingSimulator currency="chf" />);
      openPlanBuilder();

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('10 CHF');
      expect(screen.getByRole('status', { name: /your plan/i })).not.toHaveTextContent('10€');
    });
  });

  describe('custom quote paths', () => {
    it.each([
      ['A mobile app', undefined],
      ['Both', undefined],
      ['A website', 'A site I want to edit myself'],
      ['A website', 'A site with an area for my customers'],
      ['A website', 'A site to sell online'],
    ])('replaces the figure with a conversation for %s / %s', (projectType, websiteType) => {
      render(<PricingSimulator currency="eur" />);
      fireEvent.click(screen.getByRole('button', { name: projectType }));
      if (websiteType) fireEvent.click(screen.getByRole('button', { name: websiteType }));

      expect(screen.getByRole('heading', { level: 3, name: /let's talk it through/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /send an email/i })).toBeInTheDocument();
    });

    it('never shows a daily rate', () => {
      render(<PricingSimulator currency="eur" />);
      fireEvent.click(screen.getByRole('button', { name: 'A mobile app' }));

      expect(screen.queryByText(/per day/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/600/)).not.toBeInTheDocument();
    });
  });

  describe('reset behaviour', () => {
    it('returns to the first step', () => {
      render(<PricingSimulator currency="eur" />);
      fireEvent.click(screen.getByRole('button', { name: 'A mobile app' }));

      fireEvent.click(screen.getByRole('button', { name: 'Start over' }));

      expect(screen.queryByRole('heading', { level: 3, name: /let's talk it through/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Start over' })).not.toBeInTheDocument();
    });

    it('clears a composed plan when the project type changes', () => {
      render(<PricingSimulator currency="eur" />);
      openPlanBuilder();
      fireEvent.click(screen.getByRole('checkbox', { name: /managing your web address/i }));
      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('15€');

      fireEvent.click(screen.getByRole('button', { name: 'A website' }));
      fireEvent.click(screen.getByRole('button', { name: 'A site that presents my business' }));

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('10€');
    });
  });
});

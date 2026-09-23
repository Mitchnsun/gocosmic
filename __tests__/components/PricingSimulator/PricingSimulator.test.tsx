import { PricingSimulator } from '@/components/PricingSimulator/PricingSimulator';

import { fireEvent, render, screen } from '../../test-utils';

/** Walk the simulator down to the composable showcase plan. */
const openPlanBuilder = () => {
  fireEvent.click(screen.getByRole('button', { name: 'A website' }));
  fireEvent.click(screen.getByRole('button', { name: 'A site that presents my business' }));
};

describe('PricingSimulator', () => {
  it('renders step 1 on initial load and nothing else', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByText('What would you like to create?')).toBeInTheDocument();
    expect(screen.queryByText('What kind of website do you need?')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Start over' })).not.toBeInTheDocument();
  });

  it('renders the three project type options', () => {
    render(<PricingSimulator region="fr" />);

    expect(screen.getByRole('button', { name: 'A website' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A mobile app' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Both' })).toBeInTheDocument();
  });

  it('shows the four website types once "a website" is picked', () => {
    render(<PricingSimulator region="fr" />);
    fireEvent.click(screen.getByRole('button', { name: 'A website' }));

    expect(screen.getByText('What kind of website do you need?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A site that presents my business' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A site I want to edit myself' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A site with an area for my customers' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A site to sell online' })).toBeInTheDocument();
  });

  describe('showcase plan builder', () => {
    it('opens on the advertised base price', () => {
      render(<PricingSimulator region="fr" />);
      openPlanBuilder();

      expect(screen.getByText('Base plan')).toBeInTheDocument();
      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('10€');
    });

    it('adds an add-on to the live total when ticked', () => {
      render(<PricingSimulator region="fr" />);
      openPlanBuilder();

      fireEvent.click(screen.getByRole('checkbox', { name: /managing your domain name/i }));

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('15€');
    });

    it('shows a .com domain example for non-Swiss visitors', () => {
      render(<PricingSimulator region="fr" />);
      openPlanBuilder();

      // Domain and email hints each quote the example domain once.
      expect(screen.getAllByText(/my-business\.com/)).toHaveLength(2);
      expect(screen.queryByText(/my-business\.ch/)).not.toBeInTheDocument();
    });

    it('shows a .ch domain example for Swiss visitors', () => {
      render(<PricingSimulator region="ch" />);
      openPlanBuilder();

      expect(screen.getAllByText(/my-business\.ch/)).toHaveLength(2);
      expect(screen.queryByText(/my-business\.com/)).not.toBeInTheDocument();
    });

    it('accumulates several add-ons', () => {
      render(<PricingSimulator region="fr" />);
      openPlanBuilder();

      fireEvent.click(screen.getByRole('checkbox', { name: /managing your domain name/i }));
      fireEvent.click(screen.getByRole('checkbox', { name: /email address in your own name/i }));

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('25€');
    });

    it('raises the total when the pages slider moves', () => {
      render(<PricingSimulator region="fr" />);
      openPlanBuilder();

      const slider = screen.getByRole('slider', { name: /number of pages/i });
      fireEvent.keyDown(slider, { key: 'ArrowRight' });
      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('20€');
    });

    it('leaves the update slider out of the total until its option is ticked', () => {
      render(<PricingSimulator region="fr" />);
      openPlanBuilder();

      const slider = screen.getByRole('slider', { name: /changes per year/i });
      expect(slider).toHaveAttribute('data-disabled');
      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('10€');

      fireEvent.click(screen.getByRole('checkbox', { name: /content changes included/i }));

      expect(screen.getByRole('slider', { name: /changes per year/i })).not.toHaveAttribute('data-disabled');
      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('15€');
    });

    it('prices the chosen update frequency', () => {
      render(<PricingSimulator region="fr" />);
      openPlanBuilder();

      fireEvent.click(screen.getByRole('checkbox', { name: /content changes included/i }));

      const slider = screen.getByRole('slider', { name: /changes per year/i });
      fireEvent.keyDown(slider, { key: 'ArrowRight' });
      fireEvent.keyDown(slider, { key: 'ArrowRight' });
      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('60€');
    });

    it('invites a conversation once a slider hits its top position', () => {
      render(<PricingSimulator region="fr" />);
      openPlanBuilder();

      expect(screen.queryByText(/beyond these volumes/i)).not.toBeInTheDocument();

      fireEvent.keyDown(screen.getByRole('slider', { name: /number of pages/i }), { key: 'End' });

      expect(screen.getByText(/beyond these volumes/i)).toBeInTheDocument();
    });

    it('quotes the plan in francs for Swiss visitors', () => {
      render(<PricingSimulator region="ch" />);
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
      render(<PricingSimulator region="fr" />);
      fireEvent.click(screen.getByRole('button', { name: projectType }));
      if (websiteType) fireEvent.click(screen.getByRole('button', { name: websiteType }));

      expect(screen.getByRole('heading', { level: 3, name: /let's talk it through/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /send an email/i })).toBeInTheDocument();
    });

    it('never shows a daily rate', () => {
      render(<PricingSimulator region="fr" />);
      fireEvent.click(screen.getByRole('button', { name: 'A mobile app' }));

      expect(screen.queryByText(/per day/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/600/)).not.toBeInTheDocument();
    });
  });

  describe('reset behaviour', () => {
    it('returns to the first step', () => {
      render(<PricingSimulator region="fr" />);
      fireEvent.click(screen.getByRole('button', { name: 'A mobile app' }));

      fireEvent.click(screen.getByRole('button', { name: 'Start over' }));

      expect(screen.queryByRole('heading', { level: 3, name: /let's talk it through/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Start over' })).not.toBeInTheDocument();
    });

    it('clears a composed plan when the project type changes', () => {
      render(<PricingSimulator region="fr" />);
      openPlanBuilder();
      fireEvent.click(screen.getByRole('checkbox', { name: /managing your domain name/i }));
      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('15€');

      fireEvent.click(screen.getByRole('button', { name: 'A website' }));
      fireEvent.click(screen.getByRole('button', { name: 'A site that presents my business' }));

      expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('10€');
    });
  });
});

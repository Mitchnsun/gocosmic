import { PricingSimulator } from '@/components/PricingSimulator/PricingSimulator';

import { fireEvent, render, screen } from '../../test-utils';

describe('PricingSimulator', () => {
  it('renders step 1 question on initial load', () => {
    render(<PricingSimulator />);
    expect(screen.getByText('What would you like to create?')).toBeInTheDocument();
  });

  it('renders the three project type options', () => {
    render(<PricingSimulator />);
    expect(screen.getByRole('button', { name: 'A website' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A mobile application' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Both (website + mobile app)' })).toBeInTheDocument();
  });

  it('does not show step 2 or results initially', () => {
    render(<PricingSimulator />);
    expect(screen.queryByText('What type of website do you need?')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Start over' })).not.toBeInTheDocument();
  });

  describe('when "website" is selected', () => {
    it('shows step 2 with website type options', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A website' }));

      expect(screen.getByText('What type of website do you need?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'A showcase website' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'A website with client accounts' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'An e-commerce website' })).toBeInTheDocument();
    });

    it('shows the reset button', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A website' }));

      expect(screen.getByRole('button', { name: 'Start over' })).toBeInTheDocument();
    });
  });

  describe('when "mobile" is selected', () => {
    it('shows the Mobile Application result heading', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A mobile application' }));

      expect(screen.getByRole('heading', { level: 3, name: 'Mobile Application' })).toBeInTheDocument();
    });

    it('shows the contact banner link', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A mobile application' }));

      expect(screen.getByRole('link', { name: /send an email/i })).toBeInTheDocument();
    });
  });

  describe('when "both" is selected', () => {
    it('shows the Website + Mobile Application result heading', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'Both (website + mobile app)' }));

      expect(screen.getByRole('heading', { level: 3, name: 'Website + Mobile Application' })).toBeInTheDocument();
    });

    it('shows the contact banner link', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'Both (website + mobile app)' }));

      expect(screen.getByRole('link', { name: /send an email/i })).toBeInTheDocument();
    });
  });

  describe('when "website" → "accounts" is selected', () => {
    it('shows the Custom Website result', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A website' }));
      fireEvent.click(screen.getByRole('button', { name: 'A website with client accounts' }));

      expect(screen.getByRole('heading', { level: 3, name: 'Custom Website' })).toBeInTheDocument();
      expect(
        screen.getByText('No fixed price for a fully customisable website — each project is unique.')
      ).toBeInTheDocument();
    });
  });

  describe('when "website" → "ecommerce" is selected', () => {
    it('shows the Custom Website result', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A website' }));
      fireEvent.click(screen.getByRole('button', { name: 'An e-commerce website' }));

      expect(screen.getByRole('heading', { level: 3, name: 'Custom Website' })).toBeInTheDocument();
    });
  });

  describe('when "website" → "showcase" is selected', () => {
    it('shows step 3 with update frequency options', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A website' }));
      fireEvent.click(screen.getByRole('button', { name: 'A showcase website' }));

      expect(screen.getByText('How often would you like to update the content?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2 to 3 times per year' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Once a month' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Once a week' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /manage it myself/i })).toBeInTheDocument();
    });
  });

  describe('when "website" → "showcase" → "few_per_year" is selected', () => {
    it('shows the Essential Subscription', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A website' }));
      fireEvent.click(screen.getByRole('button', { name: 'A showcase website' }));
      fireEvent.click(screen.getByRole('button', { name: '2 to 3 times per year' }));

      expect(screen.getByRole('heading', { level: 3, name: 'Essential Subscription' })).toBeInTheDocument();
      expect(screen.getByText('75€ / month')).toBeInTheDocument();
    });
  });

  describe('when "website" → "showcase" → "monthly" is selected', () => {
    it('shows the Standard Subscription', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A website' }));
      fireEvent.click(screen.getByRole('button', { name: 'A showcase website' }));
      fireEvent.click(screen.getByRole('button', { name: 'Once a month' }));

      expect(screen.getByRole('heading', { level: 3, name: 'Standard Subscription' })).toBeInTheDocument();
    });
  });

  describe('when "website" → "showcase" → "weekly" is selected', () => {
    it('shows the Premium Subscription', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A website' }));
      fireEvent.click(screen.getByRole('button', { name: 'A showcase website' }));
      fireEvent.click(screen.getByRole('button', { name: 'Once a week' }));

      expect(screen.getByRole('heading', { level: 3, name: 'Premium Subscription' })).toBeInTheDocument();
    });
  });

  describe('when "website" → "showcase" → "self_managed" is selected', () => {
    it('shows the Self-Managed CMS result', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A website' }));
      fireEvent.click(screen.getByRole('button', { name: 'A showcase website' }));
      fireEvent.click(screen.getByRole('button', { name: /manage it myself/i }));

      expect(screen.getByRole('heading', { level: 3, name: 'Self-Managed CMS' })).toBeInTheDocument();
    });
  });

  describe('reset behaviour', () => {
    it('resets to initial state when reset button is clicked', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A mobile application' }));
      expect(screen.getByRole('heading', { level: 3, name: 'Mobile Application' })).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Start over' }));

      expect(screen.queryByRole('heading', { level: 3, name: 'Mobile Application' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Start over' })).not.toBeInTheDocument();
    });

    it('clears website type when project type changes', () => {
      render(<PricingSimulator />);
      fireEvent.click(screen.getByRole('button', { name: 'A website' }));
      fireEvent.click(screen.getByRole('button', { name: 'A showcase website' }));

      fireEvent.click(screen.getByRole('button', { name: 'A mobile application' }));

      expect(screen.queryByText('What type of website do you need?')).not.toBeInTheDocument();
    });
  });
});

import { PricingSimulator } from '@/components/PricingSimulator/PricingSimulator';

import { fireEvent, render } from '../../test-utils';

describe('PricingSimulator', () => {
  it('renders step 1 question on initial load', () => {
    const { getByText } = render(<PricingSimulator currency="eur" />);
    expect(getByText('What would you like to create?')).toBeInTheDocument();
  });

  it('renders the three project type options', () => {
    const { getByRole } = render(<PricingSimulator currency="eur" />);
    expect(getByRole('button', { name: 'A website' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'A mobile application' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Both (website + mobile app)' })).toBeInTheDocument();
  });

  it('does not show step 2 or results initially', () => {
    const { queryByText, queryByRole } = render(<PricingSimulator currency="eur" />);
    expect(queryByText('What type of website do you need?')).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Start over' })).not.toBeInTheDocument();
  });

  describe('when "website" is selected', () => {
    it('shows step 2 with website type options', () => {
      const { getByRole, getByText } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));

      expect(getByText('What type of website do you need?')).toBeInTheDocument();
      expect(getByRole('button', { name: 'A showcase website' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'A website with client accounts' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'An e-commerce website' })).toBeInTheDocument();
    });

    it('shows the reset button', () => {
      const { getByRole } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));

      expect(getByRole('button', { name: 'Start over' })).toBeInTheDocument();
    });
  });

  describe('when "mobile" is selected', () => {
    it('shows the Mobile Application result heading', () => {
      const { getByRole } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A mobile application' }));

      expect(getByRole('heading', { level: 3, name: 'Mobile Application' })).toBeInTheDocument();
    });

    it('shows the contact banner link', () => {
      const { getByRole } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A mobile application' }));

      expect(getByRole('link', { name: /send an email/i })).toBeInTheDocument();
    });
  });

  describe('when "both" is selected', () => {
    it('shows the Website + Mobile Application result heading', () => {
      const { getByRole } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'Both (website + mobile app)' }));

      expect(getByRole('heading', { level: 3, name: 'Website + Mobile Application' })).toBeInTheDocument();
    });

    it('shows the contact banner link', () => {
      const { getByRole } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'Both (website + mobile app)' }));

      expect(getByRole('link', { name: /send an email/i })).toBeInTheDocument();
    });
  });

  describe('when "website" → "accounts" is selected', () => {
    it('shows the Custom Website result', () => {
      const { getByRole, getByText } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));
      fireEvent.click(getByRole('button', { name: 'A website with client accounts' }));

      expect(getByRole('heading', { level: 3, name: 'Custom Website' })).toBeInTheDocument();
      expect(
        getByText('No fixed price for a fully customisable website — each project is unique.')
      ).toBeInTheDocument();
    });
  });

  describe('when "website" → "ecommerce" is selected', () => {
    it('shows the Custom Website result', () => {
      const { getByRole } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));
      fireEvent.click(getByRole('button', { name: 'An e-commerce website' }));

      expect(getByRole('heading', { level: 3, name: 'Custom Website' })).toBeInTheDocument();
    });
  });

  describe('when "website" → "showcase" is selected', () => {
    it('shows step 3 with update frequency options', () => {
      const { getByRole, getByText } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));
      fireEvent.click(getByRole('button', { name: 'A showcase website' }));

      expect(getByText('How often would you like to update the content?')).toBeInTheDocument();
      expect(getByRole('button', { name: '2 to 3 times per year' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'Once a month' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'Once a week' })).toBeInTheDocument();
      expect(getByRole('button', { name: /manage it myself/i })).toBeInTheDocument();
    });
  });

  describe('when "website" → "showcase" → "few_per_year" is selected', () => {
    it('shows the Essential Subscription', () => {
      const { getByRole, getByText } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));
      fireEvent.click(getByRole('button', { name: 'A showcase website' }));
      fireEvent.click(getByRole('button', { name: '2 to 3 times per year' }));

      expect(getByRole('heading', { level: 3, name: 'Essential Subscription' })).toBeInTheDocument();
      expect(getByText('75€ / month')).toBeInTheDocument();
    });
  });

  describe('when "website" → "showcase" → "monthly" is selected', () => {
    it('shows the Standard Subscription', () => {
      const { getByRole } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));
      fireEvent.click(getByRole('button', { name: 'A showcase website' }));
      fireEvent.click(getByRole('button', { name: 'Once a month' }));

      expect(getByRole('heading', { level: 3, name: 'Standard Subscription' })).toBeInTheDocument();
    });
  });

  describe('when "website" → "showcase" → "weekly" is selected', () => {
    it('shows the Premium Subscription', () => {
      const { getByRole } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));
      fireEvent.click(getByRole('button', { name: 'A showcase website' }));
      fireEvent.click(getByRole('button', { name: 'Once a week' }));

      expect(getByRole('heading', { level: 3, name: 'Premium Subscription' })).toBeInTheDocument();
    });
  });

  describe('when "website" → "showcase" → "self_managed" is selected', () => {
    it('shows the Self-Managed CMS result', () => {
      const { getByRole } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));
      fireEvent.click(getByRole('button', { name: 'A showcase website' }));
      fireEvent.click(getByRole('button', { name: /manage it myself/i }));

      expect(getByRole('heading', { level: 3, name: 'Self-Managed CMS' })).toBeInTheDocument();
    });
  });

  describe('reset behaviour', () => {
    it('resets to initial state when reset button is clicked', () => {
      const { getByRole, queryByRole } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A mobile application' }));
      expect(getByRole('heading', { level: 3, name: 'Mobile Application' })).toBeInTheDocument();

      fireEvent.click(getByRole('button', { name: 'Start over' }));

      expect(queryByRole('heading', { level: 3, name: 'Mobile Application' })).not.toBeInTheDocument();
      expect(queryByRole('button', { name: 'Start over' })).not.toBeInTheDocument();
    });

    it('clears website type when project type changes', () => {
      const { getByRole, queryByText } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));
      fireEvent.click(getByRole('button', { name: 'A showcase website' }));

      fireEvent.click(getByRole('button', { name: 'A mobile application' }));

      expect(queryByText('What type of website do you need?')).not.toBeInTheDocument();
    });
  });

  describe('currency', () => {
    it('quotes the daily rate in euros outside Switzerland', () => {
      const { getByRole, getByText } = render(<PricingSimulator currency="eur" />);
      fireEvent.click(getByRole('button', { name: 'A mobile application' }));

      expect(getByText('600€ excl. tax / day')).toBeInTheDocument();
    });

    it('quotes the daily rate in francs for Swiss visitors', () => {
      const { getByRole, getByText, queryByText } = render(<PricingSimulator currency="chf" />);
      fireEvent.click(getByRole('button', { name: 'A mobile application' }));

      expect(getByText('900 CHF excl. tax / day')).toBeInTheDocument();
      expect(queryByText('600€ excl. tax / day')).not.toBeInTheDocument();
    });

    it('quotes subscriptions in francs for Swiss visitors', () => {
      const { getByRole, getByText } = render(<PricingSimulator currency="chf" />);
      fireEvent.click(getByRole('button', { name: 'A website' }));
      fireEvent.click(getByRole('button', { name: 'A showcase website' }));
      fireEvent.click(getByRole('button', { name: '2 to 3 times per year' }));

      expect(getByText('90 CHF / month')).toBeInTheDocument();
    });
  });
});

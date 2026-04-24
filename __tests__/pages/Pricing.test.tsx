import { vi } from 'vitest';

import Pricing, { generateMetadata } from '@/app/[locale]/pricing/page';
import { PricingSimulator } from '@/components/PricingSimulator';

import { fireEvent, render, screen } from '../test-utils';

// Mock next-intl/server
vi.mock('next-intl/server', async () => {
  const actual = await vi.importActual('next-intl/server');
  return {
    ...actual,
    getTranslations: vi.fn().mockResolvedValue((key: string) => {
      if (key === 'meta.title') return 'Pricing Simulator - Go Cosmic';
      if (key === 'meta.description')
        return 'Estimate the cost of your web or mobile project with our interactive pricing simulator.';
      if (key === 'title') return 'Pricing Simulator';
      if (key === 'subtitle') return 'Answer a few questions to get an estimate for your project';
      return key;
    }),
  };
});

describe('Pricing Page', () => {
  it('should render the page with title and subtitle', () => {
    render(<Pricing />);
    expect(screen.getByRole('heading', { level: 1, name: /pricing simulator/i })).toBeInTheDocument();
    expect(screen.getByText(/answer a few questions to get an estimate/i)).toBeInTheDocument();
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'Pricing Simulator - Go Cosmic',
        description: 'Estimate the cost of your web or mobile project with our interactive pricing simulator.',
      });
    });
  });
});

describe('PricingSimulator', () => {
  it('should render step 1 with all three options', () => {
    render(<PricingSimulator />);

    expect(screen.getByText(/what would you like to create/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /a website/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /a mobile application/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /both/i })).toBeInTheDocument();
  });

  it('should show step 2 when "website" is selected', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a website/i }));

    expect(screen.getByText(/what type of website do you need/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /a showcase website/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /a website with client accounts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /an e-commerce website/i })).toBeInTheDocument();
  });

  it('should show step 2 when "both" is selected', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /both/i }));

    expect(screen.getByText(/what type of website do you need/i)).toBeInTheDocument();
  });

  it('should show mobile result when "mobile" is selected', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a mobile application/i }));

    expect(screen.getByText(/600€ excl. tax \/ day/i)).toBeInTheDocument();
    expect(screen.getByText(/mobile application development is billed at a daily rate/i)).toBeInTheDocument();
  });

  it('should show mobile result when "both" is selected', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /both/i }));

    expect(screen.getByText(/mobile application development is billed at a daily rate/i)).toBeInTheDocument();
  });

  it('should show complex website result for "accounts" website type', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a website/i }));
    fireEvent.click(screen.getByRole('button', { name: /a website with client accounts/i }));

    expect(screen.getAllByText(/custom website/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/no fixed price for a fully customisable website/i).length).toBeGreaterThan(0);
  });

  it('should show complex website result for "ecommerce" website type', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a website/i }));
    fireEvent.click(screen.getByRole('button', { name: /an e-commerce website/i }));

    expect(screen.getAllByText(/custom website/i).length).toBeGreaterThan(0);
  });

  it('should show step 3 when "showcase" website type is selected', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a website/i }));
    fireEvent.click(screen.getByRole('button', { name: /a showcase website/i }));

    expect(screen.getByText(/how often would you like to update the content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /2 to 3 times per year/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /once a month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /once a week/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /i want to manage it myself/i })).toBeInTheDocument();
  });

  it('should show 75€/month subscription for "few per year" frequency', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a website/i }));
    fireEvent.click(screen.getByRole('button', { name: /a showcase website/i }));
    fireEvent.click(screen.getByRole('button', { name: /2 to 3 times per year/i }));

    expect(screen.getByText(/75€ \/ month/i)).toBeInTheDocument();
    expect(screen.getAllByText(/essential subscription/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/seo optimisation/i)).toBeInTheDocument();
    expect(screen.getByText(/ssl certificate/i)).toBeInTheDocument();
  });

  it('should show 100€/month subscription for "monthly" frequency', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a website/i }));
    fireEvent.click(screen.getByRole('button', { name: /a showcase website/i }));
    fireEvent.click(screen.getByRole('button', { name: /once a month/i }));

    expect(screen.getByText(/100€ \/ month/i)).toBeInTheDocument();
    expect(screen.getAllByText(/standard subscription/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/up to 1 content update per month/i)).toBeInTheDocument();
  });

  it('should show 150€/month subscription for "weekly" frequency', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a website/i }));
    fireEvent.click(screen.getByRole('button', { name: /a showcase website/i }));
    fireEvent.click(screen.getByRole('button', { name: /once a week/i }));

    expect(screen.getByText(/150€ \/ month/i)).toBeInTheDocument();
    expect(screen.getAllByText(/premium subscription/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/up to 1 content update per week/i)).toBeInTheDocument();
  });

  it('should show CMS result for "self managed" frequency', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a website/i }));
    fireEvent.click(screen.getByRole('button', { name: /a showcase website/i }));
    fireEvent.click(screen.getByRole('button', { name: /i want to manage it myself/i }));

    expect(screen.getAllByText(/self-managed cms/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/a custom cms will be developed/i)).toBeInTheDocument();
  });

  it('should show contact section for rate-based results', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a mobile application/i }));

    expect(screen.getByText(/let's discuss your project/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /send an email to prospect@gocosmic\.dev/i })).toBeInTheDocument();
  });

  it('should show a contact mailto link with the correct email', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a mobile application/i }));

    const link = screen.getByRole('link', { name: /send an email to prospect@gocosmic\.dev/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('mailto:prospect@gocosmic.dev'));
  });

  it('should show the reset button after a selection is made', () => {
    render(<PricingSimulator />);

    expect(screen.queryByRole('button', { name: /start over/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /a website/i }));
    expect(screen.getByRole('button', { name: /start over/i })).toBeInTheDocument();
  });

  it('should reset the simulator when the reset button is clicked', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a website/i }));
    expect(screen.getByText(/what type of website do you need/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /start over/i }));

    expect(screen.queryByText(/what type of website do you need/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /start over/i })).not.toBeInTheDocument();
  });

  it('should update step 3 result when frequency changes', () => {
    render(<PricingSimulator />);

    fireEvent.click(screen.getByRole('button', { name: /a website/i }));
    fireEvent.click(screen.getByRole('button', { name: /a showcase website/i }));
    fireEvent.click(screen.getByRole('button', { name: /once a month/i }));

    expect(screen.getByText(/100€ \/ month/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /once a week/i }));

    expect(screen.getByText(/150€ \/ month/i)).toBeInTheDocument();
    expect(screen.queryByText(/100€ \/ month/i)).not.toBeInTheDocument();
  });
});

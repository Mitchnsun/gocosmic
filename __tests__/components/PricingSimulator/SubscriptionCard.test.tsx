import { useTranslations } from 'next-intl';

import type { UpdateFrequency } from '@/components/PricingSimulator/PricingSimulator.types';
import { SubscriptionCard } from '@/components/PricingSimulator/SubscriptionCard';
import type { Currency } from '@/lib/region';

import { render, screen } from '../../test-utils';

type SubscriptionFreq = Exclude<UpdateFrequency, 'self_managed'>;

function TestSubscriptionCard({ freq, currency = 'eur' }: { freq: SubscriptionFreq; currency?: Currency }) {
  const t = useTranslations('pricing');
  return <SubscriptionCard freq={freq} t={t} currency={currency} />;
}

describe('SubscriptionCard', () => {
  describe('few_per_year (Essential)', () => {
    it('renders the Essential Subscription title', () => {
      render(<TestSubscriptionCard freq="few_per_year" />);
      expect(screen.getByText('Essential Subscription')).toBeInTheDocument();
    });

    it('renders the price and duration', () => {
      render(<TestSubscriptionCard freq="few_per_year" />);
      expect(screen.getByText('50€ / month')).toBeInTheDocument();
      expect(screen.getByText('Annual commitment')).toBeInTheDocument();
    });

    it('renders 7 included items without content_update', () => {
      render(<TestSubscriptionCard freq="few_per_year" />);
      expect(screen.getByText('Showcase website creation')).toBeInTheDocument();
      expect(screen.getByText('SEO optimisation')).toBeInTheDocument();
      expect(screen.queryByText(/content update/i)).not.toBeInTheDocument();
    });
  });

  describe('monthly (Standard)', () => {
    it('renders the Standard Subscription title', () => {
      render(<TestSubscriptionCard freq="monthly" />);
      expect(screen.getByText('Standard Subscription')).toBeInTheDocument();
    });

    it('renders the price', () => {
      render(<TestSubscriptionCard freq="monthly" />);
      expect(screen.getByText('90€ / month')).toBeInTheDocument();
    });

    it('includes content_update item', () => {
      render(<TestSubscriptionCard freq="monthly" />);
      expect(screen.getByText('Up to 1 content update per month')).toBeInTheDocument();
    });
  });

  describe('weekly (Premium)', () => {
    it('renders the Premium Subscription title', () => {
      render(<TestSubscriptionCard freq="weekly" />);
      expect(screen.getByText('Premium Subscription')).toBeInTheDocument();
    });

    it('renders the price', () => {
      render(<TestSubscriptionCard freq="weekly" />);
      expect(screen.getByText('150€ / month')).toBeInTheDocument();
    });

    it('includes weekly content_update item', () => {
      render(<TestSubscriptionCard freq="weekly" />);
      expect(screen.getByText('Up to 1 content update per week')).toBeInTheDocument();
    });
  });

  describe('Swiss francs', () => {
    it('renders franc prices instead of euro prices', () => {
      render(<TestSubscriptionCard freq="monthly" currency="chf" />);
      expect(screen.getByText('90 CHF / month')).toBeInTheDocument();
      expect(screen.queryByText('90€ / month')).not.toBeInTheDocument();
    });
  });
});

import { vi } from 'vitest';

import Contact, { generateMetadata } from '@/app/[locale]/contact/page';

import { render, screen } from '../test-utils';

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getMessages: vi.fn().mockResolvedValue({
    meta: {
      title: 'Contact Us - Get in Touch with Go Cosmic',
      description:
        'Contact Go Cosmic for general inquiries, support, technical questions, or commercial requests. Choose the right email for your specific needs and get personalized assistance.',
    },
  }),
}));

describe('Contact Page', () => {
  it('should render all four contact blocks with correct titles', () => {
    render(<Contact />);

    // Check page title
    expect(screen.getByRole('heading', { level: 1, name: /contact us/i })).toBeInTheDocument();

    // Check all four block titles
    expect(screen.getByRole('heading', { level: 2, name: /general inquiries/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /support & assistance/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /technical inquiries/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /commercial inquiries/i })).toBeInTheDocument();
  });

  it('should display all email addresses', () => {
    render(<Contact />);

    expect(screen.getByText('contact@gocosmic.dev')).toBeInTheDocument();
    expect(screen.getByText('support@gocosmic.dev')).toBeInTheDocument();
    expect(screen.getByText('technique@gocosmic.dev')).toBeInTheDocument();
    expect(screen.getByText('prospect@gocosmic.dev')).toBeInTheDocument();
  });

  it('should have mailto links with pre-filled subjects', () => {
    render(<Contact />);

    // Check that all mailto links are present
    const mailtoLinks = screen.getAllByRole('link', {
      name: /send an email|request support|ask a technical question|get in touch/i,
    });
    expect(mailtoLinks).toHaveLength(4);

    // Verify each link has correct mailto format
    expect(mailtoLinks[0]).toHaveAttribute('href', expect.stringContaining('mailto:contact@gocosmic.dev?subject='));
    expect(mailtoLinks[1]).toHaveAttribute('href', expect.stringContaining('mailto:support@gocosmic.dev?subject='));
    expect(mailtoLinks[2]).toHaveAttribute('href', expect.stringContaining('mailto:technique@gocosmic.dev?subject='));
    expect(mailtoLinks[3]).toHaveAttribute('href', expect.stringContaining('mailto:prospect@gocosmic.dev?subject='));
  });

  it('should render reasons for each contact block', () => {
    render(<Contact />);

    // Check for some key reasons from each block
    expect(screen.getByText(/general questions about the project or company/i)).toBeInTheDocument();
    expect(screen.getByText(/help with an application or service/i)).toBeInTheDocument();
    expect(screen.getByText(/detailed questions about architecture or integration/i)).toBeInTheDocument();
    expect(screen.getByText(/commercial requests or quotes/i)).toBeInTheDocument();
  });

  it('should have proper semantic structure with sections and headings', () => {
    render(<Contact />);

    // Check that sections are properly structured
    const sections = screen.getAllByRole('region');
    expect(sections).toHaveLength(4); // 4 contact blocks

    // Each section should have a heading
    sections.forEach((section) => {
      const heading = section.querySelector('h2');
      expect(heading).toBeInTheDocument();
    });
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'Contact Us - Get in Touch with Go Cosmic',
        description:
          'Contact Go Cosmic for general inquiries, support, technical questions, or commercial requests. Choose the right email for your specific needs and get personalized assistance.',
      });
    });
  });
});

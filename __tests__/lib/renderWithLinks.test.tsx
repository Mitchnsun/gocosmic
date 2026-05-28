import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithLinks } from '@/lib/renderWithLinks';

function renderText(text: string) {
  render(<p>{renderWithLinks(text)}</p>);
}

describe('renderWithLinks', () => {
  it('returns plain text unchanged when no URL is present', () => {
    renderText('No links here.');
    expect(screen.getByText('No links here.')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders a bare URL as a clickable link', () => {
    renderText('https://example.com');
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders an http:// URL as a clickable link', () => {
    renderText('http://example.com');
    expect(screen.getByRole('link', { name: 'http://example.com' })).toBeInTheDocument();
  });

  it('renders a URL embedded in surrounding text', () => {
    renderText('Visit https://example.com for more info.');
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('strips a trailing period from the URL and keeps it outside the link', () => {
    renderText('See https://www.cnil.fr/.');
    const link = screen.getByRole('link', { name: 'https://www.cnil.fr/' });
    expect(link).toHaveAttribute('href', 'https://www.cnil.fr/');
    expect(link.nextSibling?.textContent).toBe('.');
  });

  it('strips a trailing comma from the URL', () => {
    renderText('See https://example.com, and also vercel.com.');
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('strips multiple trailing punctuation characters', () => {
    renderText('Go to https://example.com.:');
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('opens links in a new tab with noopener noreferrer', () => {
    renderText('https://example.com');
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders multiple URLs in the same string as separate links', () => {
    renderText('See https://example.com and https://vercel.com for details.');
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://example.com');
    expect(links[1]).toHaveAttribute('href', 'https://vercel.com');
  });

  it('preserves text before and after the URL', () => {
    const { container } = render(<p>{renderWithLinks('Before https://example.com after.')}</p>);
    expect(container.textContent).toBe('Before https://example.com after.');
  });
});

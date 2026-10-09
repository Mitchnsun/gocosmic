import { describe, expect, it } from 'vitest';

import { StatusBar } from '@/components/StatusBar';

import { render } from '../test-utils';

describe('StatusBar', () => {
  it('announces availability with a pulsing signal dot', () => {
    const { getByText, container } = render(<StatusBar />);
    expect(getByText('Available')).toBeInTheDocument();
    const ping = container.querySelector('.animate-ping');
    expect(ping).toHaveClass('bg-ok', 'motion-reduce:animate-none');
    expect(ping?.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows the region-aware studio base and altitude, defaulting to Annecy', () => {
    const { getByText } = render(<StatusBar />);
    expect(getByText('Mission control · Annecy · Alt. 447m')).toBeInTheDocument();
  });

  it('shows Chêne-Bougeries for Swiss visitors', () => {
    const { getByText } = render(<StatusBar region="ch" />);
    expect(getByText('Mission control · Chêne-Bougeries · Alt. 424m')).toBeInTheDocument();
  });

  it('exposes a labelled status region without live announcements', () => {
    const { getByRole } = render(<StatusBar />);
    const bar = getByRole('status', { name: 'Studio availability' });
    expect(bar).toHaveAttribute('aria-live', 'off');
  });
});

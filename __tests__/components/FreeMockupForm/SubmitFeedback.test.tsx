import { SubmitFeedback } from '@/components/FreeMockupForm/SubmitFeedback';

import { render } from '../../test-utils';

describe('SubmitFeedback', () => {
  it('keeps a polite live region in the DOM while idle', () => {
    const { container } = render(<SubmitFeedback status="idle" hasInvalidFields={false} />);

    const region = container.querySelector('[aria-live="polite"]');
    expect(region).toBeInTheDocument();
    expect(region).toBeEmptyDOMElement();
  });

  it('announces the success message', () => {
    const { getByText } = render(<SubmitFeedback status="success" hasInvalidFields={false} />);

    expect(getByText('Request received')).toBeInTheDocument();
    expect(getByText(/come back to you by email/)).toBeInTheDocument();
  });

  it('announces a delivery failure', () => {
    const { getByText } = render(<SubmitFeedback status="error" hasInvalidFields={false} />);

    expect(getByText('Your request could not be sent. Please try again in a moment.')).toBeInTheDocument();
  });

  it('points at the highlighted fields when the payload is invalid', () => {
    const { getByText } = render(<SubmitFeedback status="error" hasInvalidFields />);

    expect(getByText('Please check the highlighted fields.')).toBeInTheDocument();
  });

  it('announces the retry-later message', () => {
    const { getByText } = render(<SubmitFeedback status="error" hasInvalidFields={false} reason="retry_later" />);

    expect(getByText('Your request could not be sent right now. Please try again later.')).toBeInTheDocument();
  });
});

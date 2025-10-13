import Services from '@/app/[locale]/services/page';

import { render } from '../test-utils';

describe('Services Page', () => {
  it('should render the services page with all sections', () => {
    const { getByRole, getByText, getAllByText } = render(<Services />);

    // Check main heading
    expect(getByRole('heading', { name: /our cosmic services/i, level: 1 })).toBeInTheDocument();

    // Check all service sections
    expect(getByRole('heading', { name: /stellar development/i, level: 2 })).toBeInTheDocument();
    expect(getByRole('heading', { name: /mystical ui\/ux design/i, level: 2 })).toBeInTheDocument();
    expect(getByRole('heading', { name: /ai powered solutions/i, level: 2 })).toBeInTheDocument();
    expect(getByRole('heading', { name: /cosmic launch/i, level: 2 })).toBeInTheDocument();

    // Check CTA section
    expect(getByRole('heading', { name: /ready to launch your next cosmic project/i })).toBeInTheDocument();
    expect(getByText(/start your cosmic journey/i)).toBeInTheDocument();
    expect(getByText(/get a custom quote/i)).toBeInTheDocument();

    // Check some key technical content (using getAllByText since there are multiple occurrences)
    expect(getByText(/react 19, next\.js 15, typescript/i)).toBeInTheDocument();
    expect(getAllByText(/100% test coverage/i)).toHaveLength(2); // Appears in two places
    expect(getByText(/wcag compliance/i)).toBeInTheDocument();
  });
});

import { vi } from 'vitest';

import LanguageSwitcher from '@/components/LanguageSwitcher';

import { fireEvent, render, waitFor } from '../test-utils';

// Mock the i18n navigation functions
const mockPush = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/en',
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  redirect: vi.fn(),
  getPathname: vi.fn(() => '/en'),
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the language switcher button', () => {
    const { getByRole } = render(<LanguageSwitcher />);

    const button = getByRole('button', { name: /switch language/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('🇬🇧');
  });

  it('should open dropdown when clicked', () => {
    const { getByRole, getAllByRole } = render(<LanguageSwitcher />);

    const button = getByRole('button', { name: /switch language/i });
    fireEvent.click(button);

    // Check if all language options are visible in the dropdown by their roles
    const menuItems = getAllByRole('menuitem');
    expect(menuItems).toHaveLength(5);

    // Check specific languages exist within the menu
    expect(getByRole('menuitem', { name: /english/i })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: /français/i })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: /español/i })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: /deutsch/i })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: /italiano/i })).toBeInTheDocument();
  });

  it('should show current language with checkmark', () => {
    const { getByRole } = render(<LanguageSwitcher />);

    const button = getByRole('button', { name: /switch language/i });
    fireEvent.click(button);

    const englishOption = getByRole('menuitem', { name: /english/i });
    expect(englishOption).toHaveTextContent('🇬🇧English');
  });

  it('should close dropdown when clicking outside', async () => {
    const { getByRole, getAllByRole, queryAllByRole } = render(<LanguageSwitcher />);

    const button = getByRole('button', { name: /switch language/i });
    fireEvent.click(button);

    // Verify dropdown is open
    expect(getAllByRole('menuitem')).toHaveLength(5);

    // Click outside the component
    fireEvent.mouseDown(document.body);

    // Wait for the dropdown to close
    await waitFor(() => {
      expect(queryAllByRole('menuitem')).toHaveLength(0);
    });
  });

  it('should close dropdown on touch outside (mobile)', async () => {
    const { getByRole, getAllByRole, queryAllByRole } = render(<LanguageSwitcher />);

    const button = getByRole('button', { name: /switch language/i });
    fireEvent.click(button);

    // Verify dropdown is open
    expect(getAllByRole('menuitem')).toHaveLength(5);

    // Touch outside the component
    fireEvent.touchStart(document.body);

    // Wait for the dropdown to close
    await waitFor(() => {
      expect(queryAllByRole('menuitem')).toHaveLength(0);
    });
  });

  it('should handle language change when selecting a different locale', async () => {
    const { getByRole, queryAllByRole } = render(<LanguageSwitcher />);

    const button = getByRole('button', { name: /switch language/i });
    fireEvent.click(button);

    // Click on French option
    const frenchOption = getByRole('menuitem', { name: /français/i });
    fireEvent.click(frenchOption);

    // Verify router.push was called with correct parameters
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/en', { locale: 'fr' });
    });

    // Verify dropdown closes after selection
    await waitFor(() => {
      expect(queryAllByRole('menuitem')).toHaveLength(0);
    });
  });

  it('should not close dropdown when clicking inside the component', () => {
    const { getByRole, getAllByRole } = render(<LanguageSwitcher />);

    const button = getByRole('button', { name: /switch language/i });
    fireEvent.click(button);

    // Verify dropdown is open
    expect(getAllByRole('menuitem')).toHaveLength(5);

    // Click inside the dropdown (on a menu item but not triggering its click)
    const dropdown = getByRole('menu');
    fireEvent.mouseDown(dropdown);

    // Dropdown should remain open
    expect(getAllByRole('menuitem')).toHaveLength(5);
  });
});

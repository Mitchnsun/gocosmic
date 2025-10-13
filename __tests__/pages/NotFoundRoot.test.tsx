import NotFound from '@/app/not-found';

describe('NotFound (Root)', () => {
  it('should render html structure with lang="en"', () => {
    const result = NotFound();

    // The component returns JSX with html and body tags
    expect(result.type).toBe('html');
    expect(result.props.lang).toBe('en');
    expect(result.props.children.type).toBe('body');
  });
});

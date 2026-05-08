import robots from '@/app/robots';

describe('robots', () => {
  it('should allow all crawlers and reference sitemap', () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: 'https://www.gocosmic.dev/sitemap.xml',
    });
  });
});

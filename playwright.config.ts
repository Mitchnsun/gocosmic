import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

/**
 * Local QA of the production build (EPIC #113): axe accessibility audit of every route in both
 * themes, the no-flash check and review screenshots. Also run by the CI, without the screenshots.
 */
export default defineConfig({
  testDir: './e2e',
  // The review screenshots check nothing: the CI skips them.
  testIgnore: process.env.CI ? 'screens.spec.ts' : undefined,
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
    // The custom cursor and the entrance animations have nothing to audit.
    contextOptions: { reducedMotion: 'reduce' },
  },
  webServer: {
    command: `yarn build && yarn start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: true,
    timeout: 300_000,
  },
});

import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

/**
 * Local QA of the production build (EPIC #113): axe accessibility audit of every route in both
 * themes, the no-flash check and review screenshots. Not part of CI: run `yarn qa` before a release.
 */
export default defineConfig({
  testDir: './e2e',
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

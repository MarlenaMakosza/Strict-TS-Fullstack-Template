import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// playwright-bdd turns the Gherkin scenarios into Playwright tests in .features-gen/.
const testDirectory = defineBddConfig({
  features: 'tests/e2e/features/**/*.feature',
  steps: 'tests/e2e/steps/**/*.ts',
});

// Ports for the scenarios, away from the ones `npm run dev` uses, so both can run at once.
const API_PORT = 3100;
const WEB_PORT = 5174;
// The API validates DATABASE_URL on start; the scenarios do not use the database.
const DATABASE_URL = 'postgres://user:password@localhost:5432/e2e';

// The API scenarios start their own server per scenario (the `server` fixture in
// tests/e2e/steps/fixtures.ts). The page scenarios use the real web app in a browser: Playwright
// starts the API and the Vite dev server once, and the web app forwards /api to that API.
export default defineConfig({
  testDir: testDirectory,
  use: { baseURL: `http://localhost:${String(WEB_PORT)}` },
  webServer: [
    {
      command: 'npm run dev -w apps/api',
      env: {
        DATABASE_URL,
        DOTENV_CONFIG_PATH: '.env.scenarios-load-no-file',
        DOTENV_CONFIG_QUIET: 'true',
        NODE_ENV: 'test',
        PORT: String(API_PORT),
      },
      reuseExistingServer: false,
      url: `http://localhost:${String(API_PORT)}/api/health`,
    },
    {
      command: `npm run dev -w apps/web -- --port ${String(WEB_PORT)} --strictPort`,
      env: { API_URL: `http://localhost:${String(API_PORT)}` },
      reuseExistingServer: false,
      url: `http://localhost:${String(WEB_PORT)}`,
    },
  ],
});

import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// playwright-bdd turns the Gherkin scenarios into Playwright tests in .features-gen/.
const testDirectory = defineBddConfig({
  features: 'tests/e2e/features/**/*.feature',
  steps: 'tests/e2e/steps/**/*.ts',
});

// The scenarios call the HTTP API: the `server` fixture in tests/e2e/steps/fixtures.ts starts the
// real server on a free port for each scenario, so there is no `webServer` and no browser here.
export default defineConfig({ testDir: testDirectory });

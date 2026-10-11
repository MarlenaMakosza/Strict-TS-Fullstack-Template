import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// playwright-bdd turns the Gherkin scenarios into Playwright tests in .features-gen/.
const testDirectory = defineBddConfig({
  features: 'tests/e2e/features/**/*.feature',
  steps: 'tests/e2e/steps/**/*.ts',
});

// The app is a CLI for now: the steps start it as a process, so there is no browser and no web
// server. When the app gets an HTTP server, add `webServer` and `use.baseURL`, and use the `page`
// fixture in the steps.
export default defineConfig({ testDir: testDirectory });

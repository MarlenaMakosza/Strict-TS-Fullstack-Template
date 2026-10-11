import { expect } from '@playwright/test';

import { Then, When } from './fixtures.ts';

// The app validates DATABASE_URL on start. Scenarios must not depend on a local .env file.
const DATABASE_URL = 'postgres://user:password@localhost:5432/e2e';

When('I start the app with NODE_ENV {string}', ({ app }, nodeEnvironment: string) => {
  app.run({ DATABASE_URL, NODE_ENV: nodeEnvironment });
});

Then('the app prints {string}', ({ app }, expected: string) => {
  expect(app.result.exitCode, app.result.stderr).toBe(0);
  expect(app.result.stdout.trim()).toBe(expected);
});

Then('the app fails with {string}', ({ app }, message: string) => {
  expect(app.result.exitCode).not.toBe(0);
  expect(app.result.stderr).toContain(message);
});

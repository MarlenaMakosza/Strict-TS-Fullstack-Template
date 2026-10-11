import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import type { AppRun } from '../../../cypress.config.ts';

// The app validates DATABASE_URL on start. Scenarios must not depend on a local .env file.
const DATABASE_URL = 'postgres://user:password@localhost:5432/e2e';

When('I start the app with NODE_ENV {string}', (nodeEnvironment: string) => {
  cy.task<AppRun>('runApp', { DATABASE_URL, NODE_ENV: nodeEnvironment }).as('appRun');
});

Then('the app prints {string}', (expected: string) => {
  cy.get<AppRun>('@appRun').then(run => {
    expect(run.exitCode, run.stderr).to.equal(0);
    expect(run.stdout.trim()).to.equal(expected);
  });
});

Then('the app fails with {string}', (message: string) => {
  cy.get<AppRun>('@appRun').then(run => {
    expect(run.exitCode).not.to.equal(0);
    expect(run.stderr).to.contain(message);
  });
});

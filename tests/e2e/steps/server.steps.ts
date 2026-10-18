import { expect } from '@playwright/test';

import { Given, Then, When } from './fixtures.ts';

Given('the server runs', async ({ server }) => {
  await server.start({ NODE_ENV: 'test' });
  expect(server.exitCode, server.stderr).toBeNull();
});

Given('the server runs with NODE_ENV {string}', async ({ server }, nodeEnvironment: string) => {
  await server.start({ NODE_ENV: nodeEnvironment });
  expect(server.exitCode, server.stderr).toBeNull();
});

When('I start the server with NODE_ENV {string}', async ({ server }, nodeEnvironment: string) => {
  await server.start({ NODE_ENV: nodeEnvironment });
});

When('I request {string}', async ({ server }, path: string) => {
  await server.request(path);
});

Then('the response status is {int}', ({ server }, status: number) => {
  expect(server.answer.status, server.answer.body).toBe(status);
});

Then('the response body is {string}', ({ server }, body: string) => {
  expect(JSON.parse(server.answer.body)).toStrictEqual(JSON.parse(body));
});

Then('the server fails with {string}', ({ server }, message: string) => {
  expect(server.exitCode).not.toBeNull();
  expect(server.exitCode).not.toBe(0);
  expect(server.stderr).toContain(message);
});

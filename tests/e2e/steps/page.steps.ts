import { AxeBuilder } from '@axe-core/playwright';
import { expect } from '@playwright/test';

import { Given, Then, When } from './fixtures.ts';

// The standard the accessibility check holds the page to: WCAG 2.1, levels A and AA.
const WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const NAME_FIELD = 'Your name';

Given('I open the app', async ({ page }) => {
  await page.goto('/');
});

Given('the server cannot be reached', async ({ page }) => {
  await page.route('**/api/**', async route => route.abort());
});

When('I type {string} as my name', async ({ page }, name: string) => {
  await page.getByLabel(NAME_FIELD).fill(name);
});

When('I type {string} as my name and press Enter', async ({ page }, name: string) => {
  await page.getByLabel(NAME_FIELD).fill(name);
  await page.getByLabel(NAME_FIELD).press('Enter');
});

When('I type {string} on the keyboard', async ({ page }, text: string) => {
  await page.keyboard.type(text);
});

When('I press {string}', async ({ page }, button: string) => {
  await page.getByRole('button', { name: button }).click();
});

When('I press Tab', async ({ page }) => {
  await page.keyboard.press('Tab');
});

When('I press Enter', async ({ page }) => {
  await page.keyboard.press('Enter');
});

Then('the name field has the focus', async ({ page }) => {
  await expect(page.getByLabel(NAME_FIELD)).toBeFocused();
});

Then('the {string} button has the focus', async ({ page }, button: string) => {
  await expect(page.getByRole('button', { name: button })).toBeFocused();
});

Then('I see {string}', async ({ page }, text: string) => {
  await expect(page.getByRole('status')).toHaveText(text);
});

Then('I see the error {string}', async ({ page }, message: string) => {
  await expect(page.getByRole('alert')).toHaveText(message);
});

Then('the page has no accessibility violations', async ({ page }) => {
  const axe = new AxeBuilder({ page });
  const results = await axe.withTags(WCAG_21_AA).analyze();

  expect(results.violations.map(violation => violation.help)).toStrictEqual([]);
});

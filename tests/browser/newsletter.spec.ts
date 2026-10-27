import { test, expect } from '@playwright/test';

test('newsletter sits above Get involved, validates email, and preserves failed input', async ({
  page,
}) => {
  await page.goto('/');
  const newsletter = page.getByRole('region', {
    name: 'See you at the next one.',
  });
  const email = newsletter.getByLabel('Email address', { exact: true });
  await email.scrollIntoViewIfNeeded();
  await expect(newsletter).toBeVisible();
  const sectionOrder = await page.locator('main section h2').allTextContents();
  expect(sectionOrder.indexOf('See you at the next one.')).toBe(
    sectionOrder.indexOf('Get involved.') - 1,
  );
  await newsletter.getByRole('button', { name: 'Sign me up' }).click();
  expect(
    await email.evaluate((input: HTMLInputElement) => input.validity.valid),
  ).toBe(false);
  await email.fill('newsletter-test@example.com');
  // Exercise a real server action failure without writing a synthetic contact to Resend.
  await newsletter.locator('input[name="website"]').fill('bot');
  await newsletter.getByRole('button', { name: 'Sign me up' }).click();
  await expect(newsletter.getByRole('alert')).toContainText('Please try again');
  await expect(email).toHaveValue('newsletter-test@example.com');
  await expect(
    newsletter.getByRole('button', { name: 'Sign me up' }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () => document.querySelector('main')!.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
